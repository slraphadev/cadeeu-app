import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import * as Crypto from 'expo-crypto';
import { openDatabaseSync } from 'expo-sqlite';
import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';

import migracoes from '../../drizzle/migrations';
import { uuidv7 } from '../domain/ids';
import type { Periodo } from './schema';
import * as schema from './schema';
import { criarRepos, type Repos } from './repos';
import type { Db } from './tipos';

// Conexão única do app. WAL melhora a concorrência de leitura; chaves estrangeiras ligadas.
const sqlite = openDatabaseSync('cadeeu.db');
sqlite.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
const db = drizzle(sqlite, { schema });

// Sinal de mudança: toda escrita nos repositórios incrementa a versão e as telas releem.
let versao = 0;
const ouvintes = new Set<() => void>();
function avisarMudanca() {
  versao++;
  ouvintes.forEach((o) => o());
}
function assinar(o: () => void) {
  ouvintes.add(o);
  return () => ouvintes.delete(o);
}

const repos = criarRepos(db as unknown as Db, {
  agora: () => Date.now(),
  novoId: () => uuidv7(Date.now(), Crypto.getRandomBytes(10)),
  aoMudar: avisarMudanca,
});

type Contexto = { repos: Repos; periodo: Periodo };
const BancoContext = createContext<Contexto | null>(null);

type Props = {
  children: ReactNode;
  carregando: ReactNode;
  erro: (mensagem: string) => ReactNode;
};

/** Roda as migrações pendentes, garante o período ativo e disponibiliza os repositórios. */
export function BancoProvider({ children, carregando, erro }: Props) {
  const { success, error } = useMigrations(db, migracoes);
  const valor = useMemo(
    () => (success ? { repos, periodo: repos.periodos.garantirAtivo(new Date()) } : null),
    [success],
  );
  if (error) return erro(error.message);
  if (!valor) return carregando;
  return <BancoContext.Provider value={valor}>{children}</BancoContext.Provider>;
}

function useBanco(): Contexto {
  const ctx = useContext(BancoContext);
  if (!ctx) throw new Error('useBanco precisa estar dentro de BancoProvider');
  return ctx;
}

export const useRepos = () => useBanco().repos;
export const usePeriodoAtivo = () => useBanco().periodo;

/**
 * Executa uma leitura nos repositórios e repete depois de cada escrita.
 * A versão dos dados vai como argumento para que o React Compiler a trate como
 * dependência e nunca reaproveite um resultado antigo.
 */
export function useConsulta<T>(ler: (r: Repos, versaoDosDados: number) => T): T {
  const v = useSyncExternalStore(assinar, () => versao);
  return ler(repos, v);
}
