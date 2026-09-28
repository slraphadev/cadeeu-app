/**
 * Todos os textos da interface, em português do Brasil.
 * Centralizados aqui para permitir outros idiomas no futuro.
 */

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export const textos = {
  app: {
    nome: 'CadêEu?',
    erroBanco: 'Não foi possível abrir seus dados.',
    carregando: 'Carregando…',
  },
  abas: {
    grade: 'Grade',
    cadastros: 'Cadastros',
  },
  comum: {
    salvar: 'Salvar',
    cancelar: 'Cancelar',
    excluir: 'Excluir',
    editar: 'Editar',
    criar: 'Criar',
    opcional: (rotulo: string) => `${rotulo} (opcional)`,
    naoFoiPossivelExcluir: 'Não foi possível excluir',
  },
  grade: {
    titulo: 'Grade',
    periodo: (nome: string) => `Período ${nome}`,
    novo: 'Novo compromisso',
    vazioTitulo: 'Sem compromissos cadastrados',
    vazioDescricao:
      'Cadastre seu primeiro compromisso e ele aparece aqui, organizado por dia da semana.',
    vazioAcao: 'Cadastrar compromisso',
    semSala: 'Sem sala definida',
    compromissos: (n: number) => plural(n, 'compromisso', 'compromissos'),
  },
  locais: {
    titulo: 'Locais',
    novo: 'Novo local',
    editar: 'Editar local',
    excluir: 'Excluir local',
    vazioTitulo: 'Nenhum local cadastrado',
    vazioDescricao:
      'Cadastre o prédio ou campus onde você tem compromissos, como o CCET da Unimontes.',
    vazioAcao: 'Cadastrar local',
    salas: (n: number) => plural(n, 'sala', 'salas'),
    confirmarExclusao: 'Excluir local?',
    confirmarExclusaoDescricao: 'O local e as salas dele saem dos seus cadastros.',
    emUso: (n: number) =>
      `Este local é usado por ${plural(n, 'compromisso', 'compromissos')}. Altere ou exclua esses compromissos antes.`,
    campos: {
      nome: 'Nome do local',
      nomeExemplo: 'Ex. CCET da Unimontes',
      apelido: 'Apelido',
      apelidoExemplo: 'Ex. CCET',
      observacao: 'Observação',
      observacaoExemplo: 'Ex. Entrada pela portaria 2',
    },
  },
  salas: {
    titulo: 'Salas',
    nova: 'Nova sala',
    editar: 'Editar sala',
    excluir: 'Excluir sala',
    vazio: 'Nenhuma sala neste local ainda.',
    confirmarExclusao: 'Excluir sala?',
    confirmarExclusaoDescricao: 'A sala sai dos seus cadastros.',
    emUso: (n: number) =>
      `Esta sala é usada por ${plural(n, 'compromisso', 'compromissos')}. Altere ou exclua esses compromissos antes.`,
    compromissos: (n: number) => plural(n, 'compromisso', 'compromissos'),
    campos: {
      nome: 'Nome da sala',
      nomeExemplo: 'Ex. Sala 1',
      bloco: 'Bloco ou prédio',
      blocoExemplo: 'Ex. Bloco B',
      andar: 'Andar',
      andarExemplo: 'Ex. 1º andar',
      observacao: 'Observação',
      observacaoExemplo: 'Ex. Subir a escada da esquerda',
    },
  },
  compromissos: {
    novo: 'Novo compromisso',
    editar: 'Editar compromisso',
    salvar: 'Salvar compromisso',
    excluir: 'Excluir compromisso',
    confirmarExclusao: 'Excluir compromisso?',
    confirmarExclusaoDescricao: 'O compromisso sai da sua grade.',
    campos: {
      titulo: 'Nome do compromisso',
      tituloExemplo: 'Ex. Computação Gráfica',
      dia: 'Dia da semana',
      inicio: 'Início',
      fim: 'Fim',
      local: 'Local',
      localEscolha: 'Escolha um local',
      sala: 'Sala',
      salaEscolha: 'Escolha uma sala',
      salaSemLocal: 'Escolha o local primeiro',
      semSala: 'Sem sala',
      observacao: 'Observação',
      observacaoExemplo: 'Ex. Levar o notebook',
    },
    criarLocal: 'Criar novo local',
    criarSala: 'Criar nova sala',
    nomeNovoLocal: 'Nome do novo local',
    nomeNovaSala: 'Nome da nova sala',
    nenhumLocal: 'Nenhum local cadastrado ainda.',
    nenhumaSala: 'Nenhuma sala neste local ainda.',
  },
  validacao: {
    obrigatorio: 'Este campo é obrigatório.',
    maximo: (n: number) => `Máximo de ${n} caracteres.`,
    escolhaDia: 'Escolha o dia da semana.',
    escolhaLocal: 'Escolha um local.',
    fimDepoisDoInicio: 'O fim precisa ser depois do início.',
  },
} as const;
