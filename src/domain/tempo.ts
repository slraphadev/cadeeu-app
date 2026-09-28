/**
 * Horários flutuantes: hora de relógio local, sem fuso,
 * guardada em minutos desde a meia-noite (10h50 = 650).
 */

export const MINUTOS_NO_DIA = 24 * 60;

/** 650 → "10h50". Horas e minutos sempre com dois dígitos, como no design system. */
export function formatarHora(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`;
}

/** (650, 750) → "10h50 às 12h30". */
export function formatarIntervalo(inicioMin: number, fimMin: number): string {
  return `${formatarHora(inicioMin)} às ${formatarHora(fimMin)}`;
}

/**
 * Lê um horário digitado: "10h50", "10:50", "10h", "9h05", "1050".
 * Devolve minutos desde a meia-noite, ou null se inválido.
 */
export function lerHora(texto: string): number | null {
  const t = texto.trim().toLowerCase().replace(/\s+/g, '');
  let m = /^(\d{1,2})[h:](\d{2})?$/.exec(t) ?? /^(\d{1,2})(\d{2})$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]);
  const min = m[2] === undefined ? 0 : Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Minutos do relógio de um Date (usa a hora local do aparelho). */
export function minutosDe(data: Date): number {
  return data.getHours() * 60 + data.getMinutes();
}

/** Cria um Date de hoje com o horário indicado (para seletores de hora). */
export function dataComMinutos(minutos: number, base: Date = new Date()): Date {
  const d = new Date(base);
  d.setHours(Math.floor(minutos / 60), minutos % 60, 0, 0);
  return d;
}
