import postgres from "postgres"

export const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "notes_db",
  username: "postgres",
  password: "postgres"
})

// Initialize the database table
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `
}
