import { neon } from "@neondatabase/serverless";

/**
 * Opens a short-lived connection to Neon.
 * Each query is sent as raw SQL. There is no ORM in between.
 */
export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local.");
  }

  return neon(databaseUrl);
}
