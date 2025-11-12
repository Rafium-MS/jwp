import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('jwplanner.db');

export function initDb() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks(
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      due_at INTEGER,
      alarm_at INTEGER,
      done INTEGER DEFAULT 0,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS events(
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      starts_at INTEGER,
      ends_at INTEGER,
      location TEXT,
      kind TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS sessions(
      id INTEGER PRIMARY KEY NOT NULL,
      started_at INTEGER,
      ended_at INTEGER,
      duration_sec INTEGER,
      notes TEXT,
      placements INTEGER,
      rv INTEGER,
      studies INTEGER
    );
    CREATE TABLE IF NOT EXISTS notes(
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT,
      body TEXT,
      created_at INTEGER,
      updated_at INTEGER
    );
  `);
}
