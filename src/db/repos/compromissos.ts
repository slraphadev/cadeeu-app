import { and, asc, eq, isNull } from 'drizzle-orm';

import type { CompromissoDados } from '../../domain/validacao';
import { compromissos, horarios, locais, salas, type Compromisso, type Horario } from '../schema';
import type { Ambiente, Db } from '../tipos';

/** Linha da grade: um horário semanal com compromisso, local e sala resolvidos. */
export type ItemGrade = {
  compromissoId: string;
  horarioId: string;
  titulo: string;
  diaSemana: number | null;
  inicioMin: number;
  fimMin: number;
  localId: string;
  localNome: string;
  salaId: string | null;
  salaNome: string | null;
};

export type CompromissoParaEdicao = { compromisso: Compromisso; horario: Horario };

export function criarCompromissosRepo(db: Db, amb: Ambiente) {
  /** Primeiro horário ativo do compromisso (na v0.1 cada compromisso tem um só). */
  function horarioDe(compromissoId: string): Horario | undefined {
    return db
      .select()
      .from(horarios)
      .where(and(eq(horarios.compromissoId, compromissoId), isNull(horarios.deletedAt)))
      .orderBy(asc(horarios.createdAt))
      .get();
  }

  return {
    /** Horários semanais do período, prontos para agrupar por dia. */
    listarGrade(periodoId: string): ItemGrade[] {
      return db
        .select({
          compromissoId: compromissos.id,
          horarioId: horarios.id,
          titulo: compromissos.titulo,
          diaSemana: horarios.diaSemana,
          inicioMin: horarios.inicioMin,
          fimMin: horarios.fimMin,
          localId: locais.id,
          localNome: locais.nome,
          salaId: salas.id,
          salaNome: salas.nome,
        })
        .from(horarios)
        .innerJoin(compromissos, eq(compromissos.id, horarios.compromissoId))
        .innerJoin(locais, eq(locais.id, horarios.localId))
        .leftJoin(salas, eq(salas.id, horarios.salaId))
        .where(
          and(
            eq(compromissos.periodoId, periodoId),
            eq(horarios.tipo, 'semanal'),
            isNull(compromissos.deletedAt),
            isNull(horarios.deletedAt),
          ),
        )
        .orderBy(asc(horarios.diaSemana), asc(horarios.inicioMin), asc(compromissos.titulo))
        .all();
    },

    obterParaEdicao(compromissoId: string): CompromissoParaEdicao | undefined {
      const compromisso = db
        .select()
        .from(compromissos)
        .where(and(eq(compromissos.id, compromissoId), isNull(compromissos.deletedAt)))
        .get();
      const horario = compromisso && horarioDe(compromissoId);
      return compromisso && horario ? { compromisso, horario } : undefined;
    },

    /** Cria o compromisso e o horário semanal dele numa única transação. */
    criarSemanal(periodoId: string, dados: CompromissoDados): Compromisso {
      const t = amb.agora();
      const compromisso: Compromisso = {
        id: amb.novoId(),
        createdAt: t,
        updatedAt: t,
        deletedAt: null,
        periodoId,
        titulo: dados.titulo,
        cor: null,
        observacao: dados.observacao,
      };
      const horario: Horario = {
        id: amb.novoId(),
        createdAt: t,
        updatedAt: t,
        deletedAt: null,
        compromissoId: compromisso.id,
        localId: dados.localId,
        salaId: dados.salaId,
        tipo: 'semanal',
        diaSemana: dados.diaSemana,
        inicioMin: dados.inicioMin,
        fimMin: dados.fimMin,
        intervaloSemanas: 1,
        dataUnica: null,
      };
      db.transaction((tx) => {
        tx.insert(compromissos).values(compromisso).run();
        tx.insert(horarios).values(horario).run();
      });
      amb.aoMudar?.();
      return compromisso;
    },

    atualizarSemanal(compromissoId: string, dados: CompromissoDados): void {
      const t = amb.agora();
      const horario = horarioDe(compromissoId);
      db.transaction((tx) => {
        tx.update(compromissos)
          .set({ titulo: dados.titulo, observacao: dados.observacao, updatedAt: t })
          .where(eq(compromissos.id, compromissoId))
          .run();
        const campos = {
          localId: dados.localId,
          salaId: dados.salaId,
          diaSemana: dados.diaSemana,
          inicioMin: dados.inicioMin,
          fimMin: dados.fimMin,
          updatedAt: t,
        };
        if (horario) {
          tx.update(horarios).set(campos).where(eq(horarios.id, horario.id)).run();
        } else {
          tx.insert(horarios)
            .values({
              ...campos,
              id: amb.novoId(),
              createdAt: t,
              compromissoId,
              tipo: 'semanal',
              intervaloSemanas: 1,
            })
            .run();
        }
      });
      amb.aoMudar?.();
    },

    /** Exclusão lógica do compromisso e dos horários dele. */
    excluir(compromissoId: string): void {
      const t = amb.agora();
      db.transaction((tx) => {
        tx.update(horarios)
          .set({ deletedAt: t, updatedAt: t })
          .where(and(eq(horarios.compromissoId, compromissoId), isNull(horarios.deletedAt)))
          .run();
        tx.update(compromissos)
          .set({ deletedAt: t, updatedAt: t })
          .where(eq(compromissos.id, compromissoId))
          .run();
      });
      amb.aoMudar?.();
    },
  };
}

export type CompromissosRepo = ReturnType<typeof criarCompromissosRepo>;
