import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Colunas comuns a todas as tabelas.
 * - id: UUID v7 (ordenável por tempo, nunca autoincremental).
 * - Datas de controle em milissegundos desde a época Unix.
 * - deleted_at preenchido = exclusão lógica.
 */
const controle = {
  id: text('id').primaryKey(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  deletedAt: integer('deleted_at'),
};

/** Semestre ou ciclo, ex. "2026.2". Datas no formato AAAA-MM-DD, sem fuso. */
export const periodos = sqliteTable('periodos', {
  ...controle,
  nome: text('nome').notNull(),
  dataInicio: text('data_inicio').notNull(),
  dataFim: text('data_fim').notNull(),
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(false),
});

/** Lugar geral, ex. "CCET da Unimontes". */
export const locais = sqliteTable('locais', {
  ...controle,
  nome: text('nome').notNull(),
  apelido: text('apelido'),
  observacao: text('observacao'),
});

/** Sala dentro de um local, ex. "Sala 1". */
export const salas = sqliteTable(
  'salas',
  {
    ...controle,
    localId: text('local_id')
      .notNull()
      .references(() => locais.id),
    nome: text('nome').notNull(),
    bloco: text('bloco'),
    andar: text('andar'),
    observacao: text('observacao'),
  },
  (t) => [index('salas_local_idx').on(t.localId)],
);

/** Compromisso, ex. "Computação Gráfica". Sempre pertence a um período. */
export const compromissos = sqliteTable(
  'compromissos',
  {
    ...controle,
    periodoId: text('periodo_id')
      .notNull()
      .references(() => periodos.id),
    titulo: text('titulo').notNull(),
    cor: text('cor'),
    observacao: text('observacao'),
  },
  (t) => [index('compromissos_periodo_idx').on(t.periodoId)],
);

/**
 * Regra de ocorrência de um compromisso. A sala fica aqui, e não no
 * compromisso, porque a mesma disciplina pode ter salas diferentes por dia.
 * Horários são hora de relógio local, em minutos desde a meia-noite (10h50 = 650).
 */
export const horarios = sqliteTable(
  'horarios',
  {
    ...controle,
    compromissoId: text('compromisso_id')
      .notNull()
      .references(() => compromissos.id),
    localId: text('local_id')
      .notNull()
      .references(() => locais.id),
    salaId: text('sala_id').references(() => salas.id),
    tipo: text('tipo', { enum: ['semanal', 'unico'] })
      .notNull()
      .default('semanal'),
    /** 1 = segunda ... 7 = domingo (ISO 8601). */
    diaSemana: integer('dia_semana'),
    inicioMin: integer('inicio_min').notNull(),
    fimMin: integer('fim_min').notNull(),
    intervaloSemanas: integer('intervalo_semanas').notNull().default(1),
    dataUnica: text('data_unica'),
  },
  (t) => [
    index('horarios_compromisso_idx').on(t.compromissoId),
    index('horarios_local_idx').on(t.localId),
    index('horarios_sala_idx').on(t.salaId),
  ],
);

export type Periodo = typeof periodos.$inferSelect;
export type Local = typeof locais.$inferSelect;
export type Sala = typeof salas.$inferSelect;
export type Compromisso = typeof compromissos.$inferSelect;
export type Horario = typeof horarios.$inferSelect;
