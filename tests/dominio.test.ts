import { describe, expect, it } from 'vitest';

import { agruparPorDia, diaIsoDe, nomeDoDia } from '../src/domain/dias';
import { uuidv7 } from '../src/domain/ids';
import { periodoPadraoPara } from '../src/domain/periodo';
import { dataComMinutos, formatarHora, formatarIntervalo, lerHora, minutosDe } from '../src/domain/tempo';
import { compromissoSchema, localSchema } from '../src/domain/validacao';

describe('tempo', () => {
  it('formata minutos no padrão 10h50', () => {
    expect(formatarHora(650)).toBe('10h50');
    expect(formatarHora(480)).toBe('08h00');
    expect(formatarHora(0)).toBe('00h00');
    expect(formatarIntervalo(650, 750)).toBe('10h50 às 12h30');
  });

  it('lê horários digitados de várias formas', () => {
    expect(lerHora('10h50')).toBe(650);
    expect(lerHora('10:50')).toBe(650);
    expect(lerHora(' 9h05 ')).toBe(545);
    expect(lerHora('10h')).toBe(600);
    expect(lerHora('1050')).toBe(650);
    expect(lerHora('24h00')).toBeNull();
    expect(lerHora('10h60')).toBeNull();
    expect(lerHora('abc')).toBeNull();
  });

  it('converte entre Date e minutos sem depender de fuso', () => {
    const d = dataComMinutos(650, new Date(2026, 8, 28));
    expect(d.getHours()).toBe(10);
    expect(d.getMinutes()).toBe(50);
    expect(minutosDe(d)).toBe(650);
  });
});

describe('dias', () => {
  it('usa o padrão ISO, segunda = 1 e domingo = 7', () => {
    expect(diaIsoDe(new Date(2026, 8, 28))).toBe(1); // segunda
    expect(diaIsoDe(new Date(2026, 8, 27))).toBe(7); // domingo
    expect(nomeDoDia(1)).toBe('Segunda-feira');
  });

  it('agrupa por dia na ordem da semana e ordena pelo início', () => {
    const grupos = agruparPorDia([
      { diaSemana: 3, inicioMin: 600 },
      { diaSemana: 1, inicioMin: 800 },
      { diaSemana: 1, inicioMin: 650 },
    ]);
    expect(grupos.map((g) => g.dia)).toEqual([1, 3]);
    expect(grupos[0].itens.map((i) => i.inicioMin)).toEqual([650, 800]);
  });
});

describe('uuidv7', () => {
  const bytes = new Uint8Array(10).fill(0xff);

  it('gera versão 7 e variante RFC', () => {
    const id = uuidv7(Date.UTC(2026, 8, 28), bytes);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('ordena pelo instante de criação', () => {
    const a = uuidv7(1_000, bytes);
    const b = uuidv7(2_000, new Uint8Array(10));
    expect(a < b).toBe(true);
  });

  it('codifica o timestamp nos primeiros 48 bits', () => {
    const ms = Date.UTC(2026, 8, 28, 10, 50);
    const hex = uuidv7(ms, bytes).replace(/-/g, '').slice(0, 12);
    expect(parseInt(hex, 16)).toBe(ms);
  });
});

describe('período padrão', () => {
  it('usa o semestre da data', () => {
    expect(periodoPadraoPara(new Date(2026, 8, 28))).toEqual({
      nome: '2026.2',
      dataInicio: '2026-07-01',
      dataFim: '2026-12-31',
    });
    expect(periodoPadraoPara(new Date(2027, 1, 10)).nome).toBe('2027.1');
  });
});

describe('validação', () => {
  const base = {
    titulo: '  Computação Gráfica ',
    diaSemana: 1,
    inicioMin: 650,
    fimMin: 750,
    localId: 'local-1',
  };

  it('aceita o exemplo de referência e limpa os textos', () => {
    const r = compromissoSchema.parse({ ...base, observacao: '' });
    expect(r.titulo).toBe('Computação Gráfica');
    expect(r.salaId).toBeNull();
    expect(r.observacao).toBeNull();
  });

  it('exige que o fim seja depois do início', () => {
    const r = compromissoSchema.safeParse({ ...base, fimMin: 650 });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]).toMatchObject({
      path: ['fimMin'],
      message: 'O fim precisa ser depois do início.',
    });
  });

  it('exige nome e local', () => {
    expect(compromissoSchema.safeParse({ ...base, titulo: '   ' }).success).toBe(false);
    expect(compromissoSchema.safeParse({ ...base, localId: '' }).success).toBe(false);
    expect(localSchema.safeParse({ nome: '' }).success).toBe(false);
  });
});
