/**
 * Período implícito da v0.1: o semestre da data informada.
 * Janeiro a junho = ".1"; julho a dezembro = ".2".
 */
export function periodoPadraoPara(data: Date): { nome: string; dataInicio: string; dataFim: string } {
  const ano = data.getFullYear();
  const primeiro = data.getMonth() < 6;
  return {
    nome: `${ano}.${primeiro ? 1 : 2}`,
    dataInicio: primeiro ? `${ano}-01-01` : `${ano}-07-01`,
    dataFim: primeiro ? `${ano}-06-30` : `${ano}-12-31`,
  };
}
