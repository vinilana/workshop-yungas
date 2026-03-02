import Database from "better-sqlite3";
import * as path from "path";
import { SEED_FRANCHISES, SEED_COLLABORATORS } from "@franchise/shared";

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

  db.exec(`
    CREATE TABLE IF NOT EXISTS collaborators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL,
      franchise_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE CASCADE
    )
  `);

  // Clear existing data (collaborators first due to FK)
  const collabCount = db.prepare("SELECT COUNT(*) as count FROM collaborators").get() as { count: number };
  if (collabCount.count > 0) {
    console.log(`Database already has ${collabCount.count} collaborators. Clearing...`);
    db.prepare("DELETE FROM collaborators").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'collaborators'").run();
  }

  const franchiseCount = db.prepare("SELECT COUNT(*) as count FROM franchises").get() as { count: number };
  if (franchiseCount.count > 0) {
    console.log(`Database already has ${franchiseCount.count} franchises. Clearing...`);
    db.prepare("DELETE FROM franchises").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'franchises'").run();
  }

  // Seed franchises
  const insertFranchise = db.prepare(`
    INSERT INTO franchises (name, owner_name, email, phone, address, city, state, status)
    VALUES (@name, @ownerName, @email, @phone, @address, @city, @state, @status)
  `);

  const insertManyFranchises = db.transaction((franchises: typeof SEED_FRANCHISES) => {
    for (const franchise of franchises) {
      insertFranchise.run(franchise);
    }
  });

  insertManyFranchises(SEED_FRANCHISES);
  console.log(`Seeded ${SEED_FRANCHISES.length} franchises successfully.`);

  const franchiseRows = db.prepare("SELECT id, name, city, state, status FROM franchises").all();
  console.table(franchiseRows);

  // Seed collaborators
  const insertCollaborator = db.prepare(`
    INSERT INTO collaborators (name, email, phone, role, franchise_id)
    VALUES (@name, @email, @phone, @role, @franchiseId)
  `);

  const insertManyCollaborators = db.transaction((collaborators: typeof SEED_COLLABORATORS) => {
    for (const collaborator of collaborators) {
      insertCollaborator.run(collaborator);
    }
  });

  insertManyCollaborators(SEED_COLLABORATORS);
  console.log(`Seeded ${SEED_COLLABORATORS.length} collaborators successfully.`);

  const collabRows = db.prepare("SELECT c.id, c.name, c.role, f.name as franchise FROM collaborators c JOIN franchises f ON c.franchise_id = f.id").all();
  console.table(collabRows);

  db.close();
}

seed();
