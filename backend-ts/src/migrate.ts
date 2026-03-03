import fs from 'fs';
import path from 'path';
import pool from './config/db';

export async function runMigrations() {
  const migrationsPath = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsPath).sort();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const { rows } = await pool.query('SELECT name FROM migrations');
  const executed = rows.map(r => r.name);

  for (const file of files) {
    if (executed.includes(file)) continue;

    const filePath = path.join(migrationsPath, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`Running migration: ${file}`);
    await pool.query(sql);
    await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
    console.log(`✔ ${file} executed`);
  }

  console.log(' Migrations done');
}