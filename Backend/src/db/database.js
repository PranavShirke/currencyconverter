import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = process.env.DATABASE_PATH || './data/currency_converter.sqlite';
const absoluteDatabasePath = path.resolve(process.cwd(), databasePath);
const databaseDirectory = path.dirname(absoluteDatabasePath);

fs.mkdirSync(databaseDirectory, { recursive: true });

const db = new Database(absoluteDatabasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schemaPath = path.join(__dirname, 'schema.sql');
db.exec(fs.readFileSync(schemaPath, 'utf8'));

export default db;
