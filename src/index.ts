import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { note } from "./note"
import { initDB } from "./db/config"
import { jwt } from "@elysiajs/jwt"

const app = new Elysia()
  .use(swagger())
  .use(note)
  .use(
    jwt({
      name: "jwt",
      secret: "Fischl von Luftschloss Narfidort"
    })
  )
  .get("/sign/:name", async ({ jwt, params: { name }, cookie: { auth } }) => {
    const value = await jwt.sign({ name })

    auth.set({
      value,
      httpOnly: true,
      maxAge: 7 * 86400,
      path: "/profile"
    })

    return `Sign in as ${value}`
  })
  .get("/profile", async ({ jwt, error, cookie: { auth } }) => {
    const profile = await jwt.verify(auth.value)

    if (!profile) return error(401, "Unauthorized")

    return `Hello ${profile.name}`
  })

// Initialize the database before starting the server
await initDB()

app.listen({ port: 3000 })

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
