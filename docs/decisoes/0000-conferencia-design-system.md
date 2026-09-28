# 0000. Conferência entre o design system e os tokens do código

- Data: 28/09/2026
- Versão: v0.1
- Situação: concluída

## Contexto

Antes do primeiro código, a tabela de tokens usada para gerar o tema do app foi conferida, uma única vez, contra o arquivo Figma do design system. Nessa conferência, o Figma é a fonte da verdade. Dali em diante o desenvolvimento usa os tokens validados, sem nova consulta ao Figma a cada tarefa.

A conferência cobriu variáveis primitivas, tokens semânticos nos modos Light e Dark, espaçamento, raios, estilos de texto, efeitos e code syntax.

## Resultado

Tudo bate, com uma divergência corrigida a partir do Figma:

| Item | Antes | Figma (valor adotado) |
|---|---|---|
| `font/family/brand` | Sharpie | Sharpie Variable |
| `font/family/ui` | Satoshi | Satoshi Variable |

Contagem conferida: 105 variáveis (Primitives 35, Color 32 com Light e Dark, Spacing 20, Typography 18), 18 estilos de texto e 4 estilos de efeito.

## Consequências

- No Figma, as famílias têm o sufixo "Variable" porque foram instaladas as versões variáveis das fontes. No app, a partir da v0.5, entram os arquivos estáticos (Satoshi Regular, Medium e Bold; Sharpie Bold), registrados como `Satoshi` e `Sharpie`, pois o React Native no Android lida mal com fontes variáveis.
- Na v0.1 o app usa a fonte do sistema. Cores, espaçamentos, raios, tamanhos e opacidades já vêm dos tokens em `src/theme/tokens.ts`.
- `opacity/faded` e `opacity/disabled` ficam na escala 0–100 no Figma (45 e 38) e em 0–1 no código (0.45 e 0.38).
