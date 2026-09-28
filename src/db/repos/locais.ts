import { and, asc, count, eq, isNull, sql } from 'drizzle-orm';

import type { LocalDados } from '../../domain/validacao';
import { compromissos, horarios, locais, salas, type Local } from '../schema';
import { EmUsoError, type Ambiente, type Db } from '../tipos';

export type LocalComContagem = Local & { totalSalas: number };

export function criarLocaisRepo(db: Db, amb: Ambiente) {
  const ativo = isNull(locais.deletedAt);

  function contarUsos(id: string): number {
    const [linha] = db
      .select({ n: count() })
      .from(horarios)
      .innerJoin(compromissos, eq(compromissos.id, horarios.compromissoId))
      .where(and(eq(horarios.localId, id), isNull(horarios.deletedAt), isNull(compromissos.deletedAt)))
      .all();
    return linha?.n ?? 0;
  }

  return {
    listar(): LocalComContagem[] {
      // Subconsulta correlacionada com nomes explícitos: o Drizzle omite o nome da
      // tabela nas colunas quando a consulta externa tem uma tabela só.
      const totalSalas = sql<number>`(
        select count(*) from salas s where s.local_id = locais.id and s.deleted_at is null
      )`;
      return db
        .select({
          id: locais.id,
          createdAt: locais.createdAt,
          updatedAt: locais.updatedAt,
          deletedAt: locais.deletedAt,
          nome: locais.nome,
          apelido: locais.apelido,
          observacao: locais.observacao,
          totalSalas,
        })
        .from(locais)
        .where(ativo)
        .orderBy(asc(sql`${locais.nome} collate nocase`))
        .all();
    },

    obter(id: string): Local | undefined {
      return db.select().from(locais).where(and(eq(locais.id, id), ativo)).get();
    },

    criar(dados: LocalDados): Local {
      const t = amb.agora();
      const novo: Local = { id: amb.novoId(), createdAt: t, updatedAt: t, deletedAt: null, ...dados };
      db.insert(locais).values(novo).run();
      amb.aoMudar?.();
      return novo;
    },

    atualizar(id: string, dados: LocalDados): void {
      db.update(locais)
        .set({ ...dados, updatedAt: amb.agora() })
        .where(and(eq(locais.id, id), ativo))
        .run();
      amb.aoMudar?.();
    },

    contarUsos,

    /** Exclusão lógica do local e das salas dele. Bloqueada se houver compromisso usando o local. */
    excluir(id: string): void {
      const usos = contarUsos(id);
      if (usos > 0) throw new EmUsoError(usos);
      const t = amb.agora();
      db.transaction((tx) => {
        tx.update(salas)
          .set({ deletedAt: t, updatedAt: t })
          .where(and(eq(salas.localId, id), isNull(salas.deletedAt)))
          .run();
        tx.update(locais).set({ deletedAt: t, updatedAt: t }).where(eq(locais.id, id)).run();
      });
      amb.aoMudar?.();
    },
  };
}

export type LocaisRepo = ReturnType<typeof criarLocaisRepo>;
