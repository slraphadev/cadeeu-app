import { and, asc, count, eq, isNull, sql } from 'drizzle-orm';

import type { SalaDados } from '../../domain/validacao';
import { compromissos, horarios, salas, type Sala } from '../schema';
import { EmUsoError, type Ambiente, type Db } from '../tipos';

export type SalaComContagem = Sala & { totalCompromissos: number };

export function criarSalasRepo(db: Db, amb: Ambiente) {
  const ativa = isNull(salas.deletedAt);

  function contarUsos(id: string): number {
    const [linha] = db
      .select({ n: count() })
      .from(horarios)
      .innerJoin(compromissos, eq(compromissos.id, horarios.compromissoId))
      .where(and(eq(horarios.salaId, id), isNull(horarios.deletedAt), isNull(compromissos.deletedAt)))
      .all();
    return linha?.n ?? 0;
  }

  return {
    listarPorLocal(localId: string): SalaComContagem[] {
      // Nomes explícitos, pelo mesmo motivo da contagem em locais.ts.
      const totalCompromissos = sql<number>`(
        select count(*) from horarios h
        inner join compromissos c on c.id = h.compromisso_id
        where h.sala_id = salas.id and h.deleted_at is null and c.deleted_at is null
      )`;
      return db
        .select({
          id: salas.id,
          createdAt: salas.createdAt,
          updatedAt: salas.updatedAt,
          deletedAt: salas.deletedAt,
          localId: salas.localId,
          nome: salas.nome,
          bloco: salas.bloco,
          andar: salas.andar,
          observacao: salas.observacao,
          totalCompromissos,
        })
        .from(salas)
        .where(and(eq(salas.localId, localId), ativa))
        .orderBy(asc(sql`${salas.nome} collate nocase`))
        .all();
    },

    obter(id: string): Sala | undefined {
      return db.select().from(salas).where(and(eq(salas.id, id), ativa)).get();
    },

    criar(localId: string, dados: SalaDados): Sala {
      const t = amb.agora();
      const nova: Sala = { id: amb.novoId(), createdAt: t, updatedAt: t, deletedAt: null, localId, ...dados };
      db.insert(salas).values(nova).run();
      amb.aoMudar?.();
      return nova;
    },

    atualizar(id: string, dados: SalaDados): void {
      db.update(salas)
        .set({ ...dados, updatedAt: amb.agora() })
        .where(and(eq(salas.id, id), ativa))
        .run();
      amb.aoMudar?.();
    },

    contarUsos,

    /** Exclusão lógica. Bloqueada se algum compromisso usa a sala. */
    excluir(id: string): void {
      const usos = contarUsos(id);
      if (usos > 0) throw new EmUsoError(usos);
      const t = amb.agora();
      db.update(salas).set({ deletedAt: t, updatedAt: t }).where(eq(salas.id, id)).run();
      amb.aoMudar?.();
    },
  };
}

export type SalasRepo = ReturnType<typeof criarSalasRepo>;
