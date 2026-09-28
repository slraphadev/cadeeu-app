import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

import type * as schema from './schema';

/**
 * Banco síncrono com o esquema do app. O mesmo tipo atende o driver do
 * expo-sqlite (no aparelho) e o better-sqlite3 (nos testes).
 */
export type Db = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

/** Dependências externas dos repositórios, injetadas para facilitar testes. */
export type Ambiente = {
  /** Instante atual em milissegundos. */
  agora: () => number;
  /** Gera um novo id (UUID v7). */
  novoId: () => string;
  /** Avisado depois de toda escrita, para a interface recarregar os dados. */
  aoMudar?: () => void;
};

/** Erro de exclusão bloqueada porque o registro ainda é usado. */
export class EmUsoError extends Error {
  constructor(public readonly usos: number) {
    super(`Registro em uso por ${usos} horário(s).`);
    this.name = 'EmUsoError';
  }
}
