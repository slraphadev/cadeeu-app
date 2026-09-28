import { useColorScheme, type TextStyle } from 'react-native';

import { cores, espaco, opacidade, raio, sombra, tamanho, texto } from './tokens';

export type Modo = 'light' | 'dark';
export type EstiloTexto = keyof typeof texto;
export type Cores = (typeof cores)[Modo];

/**
 * Família de fonte de cada papel. Na v0.1 o app usa a fonte do sistema;
 * Satoshi e Sharpie entram na v0.5, com os arquivos das fontes no projeto.
 */
const FONTE: Record<'brand' | 'ui' | 'widget', string | undefined> = {
  brand: undefined,
  ui: undefined,
  widget: undefined,
};

function estiloDeTexto(nome: EstiloTexto): TextStyle {
  const { familia, ...resto } = texto[nome];
  return { ...resto, fontFamily: FONTE[familia] } as TextStyle;
}

const tipografia = Object.fromEntries(
  (Object.keys(texto) as EstiloTexto[]).map((n) => [n, estiloDeTexto(n)]),
) as Record<EstiloTexto, TextStyle>;

function criarTema(modo: Modo) {
  return {
    modo,
    cores: cores[modo],
    espaco,
    raio,
    tamanho,
    opacidade,
    tipografia,
    /** Sombras só existem no Light; no Dark a elevação vem da superfície e da borda. */
    sombra: modo === 'light' ? sombra : null,
  };
}

export const temas = { light: criarTema('light'), dark: criarTema('dark') };
export type Tema = ReturnType<typeof criarTema>;

/** Tema atual, seguindo o tema claro ou escuro do sistema. */
export function useTema(): Tema {
  return useColorScheme() === 'dark' ? temas.dark : temas.light;
}
