#!/usr/bin/env node
/**
 * Gera src/theme/tokens.ts a partir da tabela de tokens do design system.
 *
 * A fonte dos tokens é um arquivo Markdown local, fora do repositório.
 * O caminho vem, nesta ordem, de:
 *   1. argumento: npm run tokens -- <caminho>
 *   2. variável CADEEU_TOKENS no ambiente
 *   3. variável CADEEU_TOKENS em .env.local (não versionado)
 *
 * Sem a fonte, o script avisa e mantém o tokens.ts já versionado,
 * para que qualquer pessoa consiga compilar o app sem os arquivos locais.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destino = resolve(raiz, 'src/theme/tokens.ts');

function caminhoDaFonte() {
  if (process.argv[2]) return process.argv[2];
  if (process.env.CADEEU_TOKENS) return process.env.CADEEU_TOKENS;
  const envLocal = resolve(raiz, '.env.local');
  if (existsSync(envLocal)) {
    const linha = readFileSync(envLocal, 'utf8')
      .split(/\r?\n/)
      .find((l) => l.trim().startsWith('CADEEU_TOKENS='));
    if (linha) return linha.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
  }
  return null;
}

const fonte = caminhoDaFonte();
if (!fonte || !existsSync(resolve(raiz, fonte))) {
  console.log('Fonte de tokens não encontrada. Mantendo src/theme/tokens.ts como está.');
  process.exit(0);
}

const md = readFileSync(resolve(raiz, fonte), 'utf8');

/** Linhas de tabela de uma seção (do título até o próximo título de mesmo nível ou maior). */
function linhasDaSecao(titulo) {
  const inicio = md.indexOf(titulo);
  if (inicio < 0) throw new Error(`Seção não encontrada: ${titulo}`);
  const nivel = titulo.match(/^#+/)[0].length;
  const resto = md.slice(inicio + titulo.length);
  const fim = resto.search(new RegExp(`\\n#{1,${nivel}} `));
  return (fim < 0 ? resto : resto.slice(0, fim))
    .split(/\r?\n/)
    .filter((l) => l.startsWith('|') && !/^\|\s*-/.test(l))
    .map((l) =>
      l
        .slice(1, -1)
        .split('|')
        .map((c) => c.replace(/\*\*/g, '').replace(/`/g, '').trim()),
    )
    .slice(1); // remove o cabeçalho
}

const hexDe = (celula) => {
  const m = celula.match(/#[0-9A-Fa-f]{6}/);
  if (!m) throw new Error(`Cor inválida: ${celula}`);
  return m[0].toUpperCase();
};
const camel = (s) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());

// Cores semânticas: grupo/nome → { light, dark }
const cores = { light: {}, dark: {} };
for (const [token, , light, dark] of linhasDaSecao('## Color (semânticos)')) {
  if (!token.includes('/') || !light?.includes('#')) continue; // ignora a matriz de contraste
  const [grupo, nome] = token.split('/');
  for (const [modo, celula] of [['light', light], ['dark', dark]]) {
    (cores[modo][grupo] ??= {})[camel(nome)] = hexDe(celula);
  }
}

// Primitivos (cores e opacidades)
const primitivos = {};
const opacidade = {};
for (const [token, valor] of linhasDaSecao('## Primitives')) {
  if (token.startsWith('opacity/')) {
    // Aceita "0.45" ou "45 no Figma = 0.45 em código"; no Figma a escala é 0–100.
    const m = valor.match(/=\s*([\d.]+)/);
    const n = m ? Number(m[1]) : parseFloat(valor);
    opacidade[token.split('/')[1]] = n > 1 ? n / 100 : n;
  } else if (/#[0-9A-Fa-f]{6}/.test(valor)) {
    primitivos[token] = hexDe(valor);
  }
}

// Espaçamento: spacing/0-5 → chave 0.5
const espaco = {};
for (const [token, valor] of linhasDaSecao('## Spacing')) {
  if (token.startsWith('spacing/')) espaco[token.split('/')[1].replace('-', '.')] = Number(valor);
}

const raio = {};
const tamanho = {};
for (const [token, valor] of linhasDaSecao('## Radius e tamanho')) {
  const [grupo, nome] = token.split('/');
  if (grupo === 'radius') raio[nome] = Number(valor);
  if (grupo === 'size') tamanho[nome] = Number(valor);
}

// Estilos de texto
const PESOS = { Regular: '400', Medium: '500', Bold: '700' };
const FAMILIAS = { Sharpie: 'brand', Satoshi: 'ui', Sistema: 'widget' };
const texto = {};
for (const [estilo, familia, , peso, tam, alturaLinha, extras] of linhasDaSecao('### Estilos de texto')) {
  const nome = estilo
    .split('/')
    .map((p, i) => (i === 0 ? p.toLowerCase() : p.replace(/-/g, '')))
    .join('');
  const tamanhoFonte = Number(tam);
  const lh = Number(alturaLinha.replace('%', '')) / 100;
  const ls = extras.match(/letter-spacing (\d+)%/);
  texto[nome] = {
    familia: FAMILIAS[familia] ?? 'ui',
    fontSize: tamanhoFonte,
    lineHeight: Math.round(tamanhoFonte * lh),
    fontWeight: PESOS[peso],
    ...(ls ? { letterSpacing: Number(((tamanhoFonte * Number(ls[1])) / 100).toFixed(2)) } : {}),
    ...(/caixa alta/.test(extras) ? { textTransform: 'uppercase' } : {}),
  };
}

// Sombras (só no modo Light)
const sombra = {};
for (const [estilo, , valor] of linhasDaSecao('## Efeitos')) {
  const m = valor.match(/drop shadow (\d+) (\d+) (\d+) (\d+), (#[0-9A-Fa-f]{6}) a (\d+)%/);
  if (estilo.startsWith('Shadow/') && m) {
    sombra[estilo.split('/')[1]] = {
      offsetX: Number(m[1]),
      offsetY: Number(m[2]),
      blur: Number(m[3]),
      spread: Number(m[4]),
      color: m[5].toUpperCase(),
      opacity: Number(m[6]) / 100,
    };
  }
}

const json = (v) => JSON.stringify(v, null, 2);
const saida = `/**
 * Tokens do design system do CadêEu?.
 * Gerado por scripts/gerar-tokens.mjs. Não edite à mão: rode \`npm run tokens\`.
 */

export const primitivos = ${json(primitivos)} as const;

export const cores = ${json(cores)} as const;

export const espaco = ${json(espaco)} as const;

export const raio = ${json(raio)} as const;

export const tamanho = ${json(tamanho)} as const;

export const opacidade = ${json(opacidade)} as const;

export const texto = ${json(texto)} as const;

/** Sombras valem só no modo Light. No Dark a elevação vem da superfície e da borda. */
export const sombra = ${json(sombra)} as const;
`;

writeFileSync(destino, saida);
console.log(`Tokens gerados em ${destino}`);
