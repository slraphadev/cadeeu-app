/** Dias da semana no padrão ISO 8601: 1 = segunda ... 7 = domingo. */
export type DiaSemana = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DIAS: readonly { dia: DiaSemana; curto: string; longo: string; letra: string }[] = [
  { dia: 1, curto: 'Seg', longo: 'Segunda-feira', letra: 'S' },
  { dia: 2, curto: 'Ter', longo: 'Terça-feira', letra: 'T' },
  { dia: 3, curto: 'Qua', longo: 'Quarta-feira', letra: 'Q' },
  { dia: 4, curto: 'Qui', longo: 'Quinta-feira', letra: 'Q' },
  { dia: 5, curto: 'Sex', longo: 'Sexta-feira', letra: 'S' },
  { dia: 6, curto: 'Sáb', longo: 'Sábado', letra: 'S' },
  { dia: 7, curto: 'Dom', longo: 'Domingo', letra: 'D' },
];

export function nomeDoDia(dia: number): string {
  return DIAS.find((d) => d.dia === dia)?.longo ?? '';
}

/** getDay() do JavaScript (0 = domingo) para o padrão ISO. */
export function diaIsoDe(data: Date): DiaSemana {
  const d = data.getDay();
  return (d === 0 ? 7 : d) as DiaSemana;
}

/**
 * Agrupa itens por dia da semana, na ordem segunda → domingo,
 * mantendo só os dias que têm itens. Dentro do dia, ordena pelo início.
 */
export function agruparPorDia<T extends { diaSemana: number | null; inicioMin: number }>(
  itens: readonly T[],
): { dia: DiaSemana; itens: T[] }[] {
  return DIAS.map(({ dia }) => ({
    dia,
    itens: itens.filter((i) => i.diaSemana === dia).sort((a, b) => a.inicioMin - b.inicioMin),
  })).filter((g) => g.itens.length > 0);
}
