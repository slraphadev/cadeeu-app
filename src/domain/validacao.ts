import { z } from 'zod';

import { MINUTOS_NO_DIA } from './tempo';
import { textos } from '../strings';

const t = textos.validacao;

/** Texto obrigatório: remove espaços das pontas e exige conteúdo. */
const obrigatorio = (max: number) =>
  z.string().trim().min(1, t.obrigatorio).max(max, t.maximo(max));

/** Texto opcional: vazio vira null, para não gravar strings vazias. */
const opcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, t.maximo(max))
    .transform((v) => (v === '' ? null : v))
    .nullable()
    .optional()
    .transform((v) => v ?? null);

export const localSchema = z.object({
  nome: obrigatorio(60),
  apelido: opcional(30),
  observacao: opcional(200),
});
export type LocalEntrada = z.input<typeof localSchema>;
export type LocalDados = z.output<typeof localSchema>;

export const salaSchema = z.object({
  nome: obrigatorio(40),
  bloco: opcional(40),
  andar: opcional(20),
  observacao: opcional(200),
});
export type SalaEntrada = z.input<typeof salaSchema>;
export type SalaDados = z.output<typeof salaSchema>;

export const compromissoSchema = z
  .object({
    titulo: obrigatorio(60),
    diaSemana: z.number({ error: t.escolhaDia }).int().min(1, t.escolhaDia).max(7, t.escolhaDia),
    inicioMin: z.number({ error: t.obrigatorio }).int().min(0).max(MINUTOS_NO_DIA - 1),
    fimMin: z.number({ error: t.obrigatorio }).int().min(1).max(MINUTOS_NO_DIA),
    localId: z.string({ error: t.escolhaLocal }).min(1, t.escolhaLocal),
    salaId: z.string().min(1).nullable().optional().transform((v) => v ?? null),
    observacao: opcional(200),
  })
  .refine((c) => c.fimMin > c.inicioMin, { path: ['fimMin'], message: t.fimDepoisDoInicio });
export type CompromissoEntrada = z.input<typeof compromissoSchema>;
export type CompromissoDados = z.output<typeof compromissoSchema>;
