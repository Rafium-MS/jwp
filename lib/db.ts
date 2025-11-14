import * as SQLite from "expo-sqlite";

type BindParams = SQLite.SQLiteBindParams;

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initPromise: Promise<void> | null = null;

async function ensureDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("jwplanner.db");
  }

  const database = await databasePromise;

  if (!initPromise) {
    initPromise = database.execAsync(`
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

  await initPromise;

  return database;
}

export async function initDb() {
  await ensureDatabase();
}

export const db = {
  async getAll<T>(query: string, params: BindParams = []) {
    const database = await ensureDatabase();
    return database.getAllAsync<T>(query, params);
  },

  async run(query: string, params: BindParams = []) {
    const database = await ensureDatabase();
    await database.runAsync(query, params);
  },
};

