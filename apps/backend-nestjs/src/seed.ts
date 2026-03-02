import Database from "better-sqlite3";
import * as path from "path";
import { SEED_FRANCHISES } from "@franchise/shared";

function seed() {
  const dbPath = path.resolve(__dirname, "..", "franchises.db");
  const db = new Database(dbPath);

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS franchises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const count = db.prepare("SELECT COUNT(*) as count FROM franchises").get() as { count: number };

  if (count.count > 0) {
    console.log(`Database already has ${count.count} franchises. Clearing...`);
    db.prepare("DELETE FROM franchises").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'franchises'").run();
  }

  const insert = db.prepare(`
    INSERT INTO franchises (name, owner_name, email, phone, address, city, state, status)
    VALUES (@name, @ownerName, @email, @phone, @address, @city, @state, @status)
  `);

  const insertMany = db.transaction((franchises: typeof SEED_FRANCHISES) => {
    for (const franchise of franchises) {
      insert.run(franchise);
    }
  });

  insertMany(SEED_FRANCHISES);

  console.log(`Seeded ${SEED_FRANCHISES.length} franchises successfully.`);

  const rows = db.prepare("SELECT id, name, city, state, status FROM franchises").all();
  console.table(rows);

  db.close();
}

seed();
