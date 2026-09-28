import { and, desc, eq, isNull } from 'drizzle-orm';

import { periodoPadraoPara } from '../../domain/periodo';
import { periodos, type Periodo } from '../schema';
import type { Ambiente, Db } from '../tipos';

export function criarPeriodosRepo(db: Db, amb: Ambiente) {
  function obterAtivo(): Periodo | undefined {
    return db
      .select()
      .from(periodos)
      .where(and(eq(periodos.ativo, true), isNull(periodos.deletedAt)))
      .orderBy(desc(periodos.createdAt))
      .get();
  }

  return {
    obterAtivo,

    /**
     * v0.1: período único implícito. Se ainda não existe um período ativo,
     * cria o do semestre atual. Chamado na abertura do app.
     */
    garantirAtivo(hoje: Date): Periodo {
      const existente = obterAtivo();
      if (existente) return existente;
      const t = amb.agora();
      const novo: Periodo = {
        id: amb.novoId(),
        createdAt: t,
        updatedAt: t,
        deletedAt: null,
        ativo: true,
        ...periodoPadraoPara(hoje),
      };
      db.insert(periodos).values(novo).run();
      amb.aoMudar?.();
      return novo;
    },
  };
}

export type PeriodosRepo = ReturnType<typeof criarPeriodosRepo>;
