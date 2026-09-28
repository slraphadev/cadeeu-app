import type { Ambiente, Db } from '../tipos';
import { criarCompromissosRepo } from './compromissos';
import { criarLocaisRepo } from './locais';
import { criarPeriodosRepo } from './periodos';
import { criarSalasRepo } from './salas';

/** Único ponto de acesso ao banco para telas e, no futuro, widgets. */
export function criarRepos(db: Db, amb: Ambiente) {
  return {
    periodos: criarPeriodosRepo(db, amb),
    locais: criarLocaisRepo(db, amb),
    salas: criarSalasRepo(db, amb),
    compromissos: criarCompromissosRepo(db, amb),
  };
}

export type Repos = ReturnType<typeof criarRepos>;

export type { ItemGrade, CompromissoParaEdicao } from './compromissos';
export type { LocalComContagem } from './locais';
export type { SalaComContagem } from './salas';
