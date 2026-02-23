import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.resolve(import.meta.dirname, '../data/reports.db')

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    city TEXT,
    state TEXT,
    place_id TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_slug TEXT NOT NULL REFERENCES restaurants(slug),
    raw_json TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL REFERENCES reports(id),
    section_id TEXT NOT NULL,
    section_number INTEGER NOT NULL,
    section_title TEXT NOT NULL,
    section_subtitle TEXT,
    category_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK(status IN ('pass','fail','warning')),
    findings TEXT,
    expected TEXT
  );
`)

export default db
