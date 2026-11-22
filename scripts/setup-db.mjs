import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing. Put it in .env.local, then run npm run db:setup.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

const statements = schema
  .split(";")
  .map((statement) => statement.replace(/--.*$/gm, "").trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

const restaurants = await sql.query(
  "SELECT id, name, cuisine, area FROM restaurants ORDER BY id"
);
const reviews = await sql.query(
  "SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY created_at DESC"
);

console.log("Restaurants:");
console.log(JSON.stringify(restaurants, null, 2));
console.log("Reviews:");
console.log(JSON.stringify(reviews, null, 2));
