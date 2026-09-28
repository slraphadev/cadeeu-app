import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { criarRepos } from '../../src/db/repos';
import * as schema from '../../src/db/schema';
import type { Db } from '../../src/db/tipos';

/**
 * Banco SQLite em memória com as mesmas migrações do app.
 * Relógio e ids determinísticos para os testes ficarem estáveis.
 */
export function criarBancoDeTeste(caminho = ':memory:') {
  const sqlite = new Database(caminho);
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: 'drizzle' });

  let relogio = Date.UTC(2026, 8, 28, 12, 0, 0);
  let contador = 0;
  let mudancas = 0;
  const repos = criarRepos(db as unknown as Db, {
    agora: () => (relogio += 1000),
    novoId: () => `id-${String(++contador).padStart(4, '0')}`,
    aoMudar: () => {
      mudancas++;
    },
  });

  return { sqlite, db, repos, mudancas: () => mudancas };
}
