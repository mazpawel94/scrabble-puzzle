import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";
import { migrations } from "./migrations/migrations";
import * as schema from "./schema";

const expo = SQLite.openDatabaseSync("app.db");

export const db = drizzle(expo, { schema });

export function useDbMigrations() {
  return useMigrations(db, migrations as any);
}
