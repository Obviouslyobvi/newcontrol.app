import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let _db: ReturnType<typeof createDb> | null = null;

function createDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

/**
 * Lazy database client. Throws DatabaseNotConfiguredError when DATABASE_URL
 * is missing so API routes can return a friendly setup message instead of
 * crashing at import time.
 */
export function getDb() {
  if (!isDatabaseConfigured()) {
    throw new DatabaseNotConfiguredError();
  }
  if (!_db) _db = createDb();
  return _db;
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "DATABASE_URL is not set. Follow SETUP.md to create a Neon database and add the connection string to your environment."
    );
    this.name = "DatabaseNotConfiguredError";
  }
}

export { schema };
