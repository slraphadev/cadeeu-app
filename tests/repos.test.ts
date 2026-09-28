import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

import { EmUsoError } from '../src/db/tipos';
import { agruparPorDia } from '../src/domain/dias';
import { compromissoSchema, localSchema, salaSchema } from '../src/domain/validacao';
import { criarBancoDeTeste } from './helpers/banco';

let banco: ReturnType<typeof criarBancoDeTeste>;
beforeEach(() => {
  banco = criarBancoDeTeste();
});

/** Cadastra o exemplo de referência: CCET, Sala 1, Computação Gráfica, segunda 10h50–12h30. */
function cadastrarExemplo() {
  const { repos } = banco;
  const periodo = repos.periodos.garantirAtivo(new Date(2026, 8, 28));
  const local = repos.locais.criar(localSchema.parse({ nome: 'CCET da Unimontes', apelido: 'CCET' }));
  const sala = repos.salas.criar(local.id, salaSchema.parse({ nome: 'Sala 1', bloco: 'Bloco B' }));
  const compromisso = repos.compromissos.criarSemanal(
    periodo.id,
    compromissoSchema.parse({
      titulo: 'Computação Gráfica',
      diaSemana: 1,
      inicioMin: 650,
      fimMin: 750,
      localId: local.id,
      salaId: sala.id,
    }),
  );
  return { periodo, local, sala, compromisso };
}

describe('períodos', () => {
  it('cria o período implícito uma única vez', () => {
    const a = banco.repos.periodos.garantirAtivo(new Date(2026, 8, 28));
    const b = banco.repos.periodos.garantirAtivo(new Date(2026, 8, 29));
    expect(a.id).toBe(b.id);
    expect(a.nome).toBe('2026.2');
    expect(a.ativo).toBe(true);
  });
});

describe('locais e salas', () => {
  it('lista locais com a contagem de salas ativas', () => {
    const { local } = cadastrarExemplo();
    banco.repos.salas.criar(local.id, salaSchema.parse({ nome: 'Lab 3' }));
    const [l] = banco.repos.locais.listar();
    expect(l.nome).toBe('CCET da Unimontes');
    expect(l.totalSalas).toBe(2);
  });

  it('ordena locais e salas por nome, sem diferenciar maiúsculas', () => {
    banco.repos.locais.criar(localSchema.parse({ nome: 'biblioteca' }));
    banco.repos.locais.criar(localSchema.parse({ nome: 'Auditório' }));
    expect(banco.repos.locais.listar().map((l) => l.nome)).toEqual(['Auditório', 'biblioteca']);
  });

  it('usa UUID/id injetado, carimba datas e avisa mudanças', () => {
    const antes = banco.mudancas();
    const l = banco.repos.locais.criar(localSchema.parse({ nome: 'CCET' }));
    expect(l.id).toMatch(/^id-/);
    expect(l.createdAt).toBe(l.updatedAt);
    expect(banco.mudancas()).toBe(antes + 1);
  });

  it('edita um local e atualiza updated_at', () => {
    const l = banco.repos.locais.criar(localSchema.parse({ nome: 'CCET' }));
    banco.repos.locais.atualizar(l.id, localSchema.parse({ nome: 'CCET da Unimontes', observacao: 'Portaria 2' }));
    const editado = banco.repos.locais.obter(l.id)!;
    expect(editado.nome).toBe('CCET da Unimontes');
    expect(editado.observacao).toBe('Portaria 2');
    expect(editado.updatedAt).toBeGreaterThan(l.updatedAt);
  });

  it('bloqueia a exclusão de local e sala em uso', () => {
    const { local, sala } = cadastrarExemplo();
    expect(() => banco.repos.locais.excluir(local.id)).toThrow(EmUsoError);
    expect(() => banco.repos.salas.excluir(sala.id)).toThrow(EmUsoError);
  });

  it('exclui logicamente o local e as salas dele', () => {
    const l = banco.repos.locais.criar(localSchema.parse({ nome: 'Biblioteca' }));
    const s = banco.repos.salas.criar(l.id, salaSchema.parse({ nome: 'Sala de estudos' }));
    banco.repos.locais.excluir(l.id);
    expect(banco.repos.locais.listar()).toHaveLength(0);
    expect(banco.repos.salas.obter(s.id)).toBeUndefined();
    const linha = banco.sqlite.prepare('select deleted_at from salas where id = ?').get(s.id) as {
      deleted_at: number | null;
    };
    expect(linha.deleted_at).not.toBeNull();
  });

  it('libera a exclusão depois que o compromisso sai', () => {
    const { local, sala, compromisso } = cadastrarExemplo();
    banco.repos.compromissos.excluir(compromisso.id);
    expect(banco.repos.salas.contarUsos(sala.id)).toBe(0);
    banco.repos.salas.excluir(sala.id);
    banco.repos.locais.excluir(local.id);
    expect(banco.repos.locais.listar()).toHaveLength(0);
  });

  it('conta compromissos por sala', () => {
    const { local } = cadastrarExemplo();
    const [sala] = banco.repos.salas.listarPorLocal(local.id);
    expect(sala.totalCompromissos).toBe(1);
  });
});

describe('compromissos', () => {
  it('guarda o exemplo de referência e o devolve na grade da segunda-feira', () => {
    const { periodo } = cadastrarExemplo();
    const grade = banco.repos.compromissos.listarGrade(periodo.id);
    expect(grade).toHaveLength(1);
    expect(grade[0]).toMatchObject({
      titulo: 'Computação Gráfica',
      diaSemana: 1,
      inicioMin: 650,
      fimMin: 750,
      localNome: 'CCET da Unimontes',
      salaNome: 'Sala 1',
    });
    const [segunda] = agruparPorDia(grade);
    expect(segunda.dia).toBe(1);
  });

  it('aceita compromisso sem sala', () => {
    const { periodo, local } = cadastrarExemplo();
    banco.repos.compromissos.criarSemanal(
      periodo.id,
      compromissoSchema.parse({ titulo: 'Monitoria', diaSemana: 3, inicioMin: 840, fimMin: 900, localId: local.id }),
    );
    const item = banco.repos.compromissos.listarGrade(periodo.id).find((i) => i.titulo === 'Monitoria')!;
    expect(item.salaNome).toBeNull();
  });

  it('edita título, dia, horário e sala', () => {
    const { periodo, local, compromisso } = cadastrarExemplo();
    const nova = banco.repos.salas.criar(local.id, salaSchema.parse({ nome: 'Sala 4' }));
    banco.repos.compromissos.atualizarSemanal(
      compromisso.id,
      compromissoSchema.parse({
        titulo: 'Computação Gráfica II',
        diaSemana: 2,
        inicioMin: 600,
        fimMin: 700,
        localId: local.id,
        salaId: nova.id,
      }),
    );
    const [item] = banco.repos.compromissos.listarGrade(periodo.id);
    expect(item).toMatchObject({ titulo: 'Computação Gráfica II', diaSemana: 2, inicioMin: 600, salaNome: 'Sala 4' });
    const edicao = banco.repos.compromissos.obterParaEdicao(compromisso.id)!;
    expect(edicao.horario.salaId).toBe(nova.id);
  });

  it('exclui logicamente o compromisso e o horário', () => {
    const { periodo, compromisso } = cadastrarExemplo();
    banco.repos.compromissos.excluir(compromisso.id);
    expect(banco.repos.compromissos.listarGrade(periodo.id)).toHaveLength(0);
    expect(banco.repos.compromissos.obterParaEdicao(compromisso.id)).toBeUndefined();
    const linha = banco.sqlite.prepare('select count(*) n from horarios where deleted_at is not null').get() as {
      n: number;
    };
    expect(linha.n).toBe(1);
  });

  it('mantém os dados depois de fechar e reabrir o banco (critério de aceite da v0.1)', () => {
    const arquivo = join(mkdtempSync(join(tmpdir(), 'cadeeu-')), 'cadeeu.db');
    banco = criarBancoDeTeste(arquivo);
    const { periodo } = cadastrarExemplo();
    const antes = banco.repos.compromissos.listarGrade(periodo.id);
    banco.sqlite.close();

    // "Reabrir o app": nova conexão, migrações de novo e repositórios novos.
    const reaberto = criarBancoDeTeste(arquivo);
    const ativo = reaberto.repos.periodos.garantirAtivo(new Date(2026, 8, 30));
    expect(ativo.id).toBe(periodo.id);
    expect(reaberto.repos.compromissos.listarGrade(ativo.id)).toEqual(antes);
    expect(reaberto.repos.locais.listar()[0]).toMatchObject({ nome: 'CCET da Unimontes', totalSalas: 1 });
    reaberto.sqlite.close();
  });
});
