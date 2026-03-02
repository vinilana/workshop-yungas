import db from "./database.js";
import { SEED_FRANCHISES } from "@franchise/shared";

function seed() {
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
}

seed();
