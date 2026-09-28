<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset=".github/assets/banner-light.png">
  <img alt="CadêEu? — Onde você deveria estar agora." src=".github/assets/banner-dark.png" width="100%">
</picture>

# CadêEu?

Aplicativo mobile que responde à pergunta "cadê eu?" para quem tem uma rotina de compromissos em lugares diferentes. Você cadastra locais, salas, compromissos e horários uma vez, e o app mostra onde você deveria estar. A sala é a informação mais importante: é ela que o aluno esquece a cada semestre.

O app funciona 100% offline, sem conta. Os dados ficam no próprio aparelho.

## Estado atual: v0.1

- Cadastro de **locais** (ex. CCET da Unimontes) e, dentro de cada local, de **salas** (ex. Sala 1, com bloco, andar e observação). Criar, editar e excluir.
- Cadastro de **compromissos** com um horário semanal: dia da semana, início, fim, local e sala. Local e sala podem ser criados no próprio formulário, sem sair dele.
- **Grade** com os compromissos da semana agrupados por dia, com a sala em destaque.
- Período (semestre) criado automaticamente no primeiro uso.
- Tema claro e escuro, seguindo o sistema.

Ainda não fazem parte do app: widgets na tela inicial, gestão de períodos, exceções (mudança de sala em um dia), recorrência quinzenal, backup, notificações, conta e sincronização. Esses itens estão previstos para as próximas versões.

### Limitações conhecidas

- Foco em Android. O iOS ainda não foi testado.
- A interface usa a fonte do sistema. As fontes da identidade visual entram numa versão futura.
- Cada compromisso tem um único horário semanal.

## Stack

- [Expo](https://expo.dev) SDK 57 com React Native, TypeScript e Expo Router
- SQLite local com [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) e [Drizzle ORM](https://orm.drizzle.team), com migrações versionadas
- Zod, React Hook Form e date-fns
- Vitest para a lógica pura e os repositórios (com better-sqlite3)
- Development builds desde o início (sem Expo Go), porque os widgets vão exigir código nativo

## Arquitetura

- **Local-first.** O SQLite do aparelho é a fonte da verdade.
- **Repositórios.** Telas nunca acessam o banco direto; tudo passa por `src/db/repos`.
- **Pronto para sincronizar.** Ids em UUID v7, `created_at`, `updated_at` e exclusão lógica (`deleted_at`) em todas as tabelas.
- **Horários flutuantes.** Hora de relógio local, sem fuso, guardada em minutos desde a meia-noite (10h50 = 650).
- **Tokens primeiro.** Cores, espaçamentos, raios e tipografia vêm de `src/theme/tokens.ts`, com modos claro e escuro.
- **Textos centralizados** em `src/strings`, em português do Brasil.

```
src/
  app/        telas (Expo Router)
  db/         esquema, conexão e repositórios
  domain/     lógica pura: horários, dias, ids, validação
  features/   formulários
  strings/    textos da interface
  theme/      tokens e tema claro/escuro
  ui/         componentes de interface
drizzle/      migrações SQL
tests/        testes (Vitest)
docs/decisoes registros de decisões técnicas
```

## Como rodar

Requisitos: Node.js 24 e, para rodar no aparelho, Android Studio (emulador ou aparelho com depuração USB) ou uma conta [EAS](https://expo.dev/eas) para gerar o build na nuvem.

```bash
npm install
```

### No Android, com build local

```bash
npm run android
```

O comando gera a pasta `android/`, compila o development build, instala e abre o app. Depois disso, basta `npm start` para o servidor de desenvolvimento.

### No Android, com build na nuvem (EAS)

```bash
npx eas-cli@latest build --profile development --platform android
```

Instale o APK gerado no aparelho e rode `npm start`.

### Verificações

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm test            # testes
```

## Desenvolvimento

- **Esquema do banco.** Depois de alterar `src/db/schema.ts`, gere a migração com `npm run db:gerar`. Ela é aplicada automaticamente na próxima abertura do app.
- **Tokens.** `src/theme/tokens.ts` é versionado e não deve ser editado à mão. Quem tem a fonte de tokens do design system regenera o arquivo com `npm run tokens`. Sem a fonte, o comando mantém o arquivo atual.

## Licença

Todos os direitos reservados. Veja [LICENSE.md](LICENSE.md).
