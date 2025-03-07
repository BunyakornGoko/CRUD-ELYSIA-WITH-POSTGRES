import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { note } from "./note"
import { initDB } from "./db/config"

const app = new Elysia().use(swagger()).use(note)

// Initialize the database before starting the server
await initDB()

app.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
