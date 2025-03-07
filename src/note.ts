import { Elysia, t } from "elysia"
import { sql } from "./db/config"

class Note {
  async getAll() {
    const notes = await sql`SELECT * FROM notes ORDER BY created_at DESC`
    return {
      notes: notes.map((note) => ({
        id: note.id,
        content: note.content,
        created_at: note.created_at
      }))
    }
  }

  async add(content: string) {
    const [note] =
      await sql`INSERT INTO notes (content) VALUES (${content}) RETURNING *`
    return {
      id: note.id,
      content: note.content,
      created_at: note.created_at
    }
  }

  async getOne(id: number) {
    const [result] = await sql`SELECT * FROM notes WHERE id = ${id}`
    return result
  }

  async remove(id: number) {
    const [result] = await sql`DELETE FROM notes WHERE id = ${id} RETURNING *`
    return result
  }

  async update(id: number, content: string) {
    const [result] = await sql`
        UPDATE notes 
        SET content = ${content} 
        WHERE id = ${id} 
        RETURNING *
    `
    return result
  }
}

export const note = new Elysia()
  .decorate("note", new Note())
  .get("/notes", async ({ note }) => await note.getAll())
  .post("/notes", async ({ note, body }) => await note.add(body.content), {
    body: t.Object({
      content: t.String()
    })
  })
  .get(
    "/notes/:id",
    async ({ note, params: { id }, error }) => {
      const result = await note.getOne(id)
      return result ?? error(404, "Note not found")
    },
    {
      params: t.Object({
        id: t.Number()
      })
    }
  )
  .delete(
    "/notes/:id",
    async ({ note, params: { id }, error }) => {
      const result = await note.remove(id)
      return result ?? error(404, "Note not found")
    },
    {
      params: t.Object({
        id: t.Number()
      })
    }
  )
  .patch(
    "/notes/:id",
    async ({ note, params: { id }, body, error }) => {
      const result = await note.update(id, body.content)
      return result ?? error(404, "Note not found")
    },
    {
      params: t.Object({
        id: t.Number()
      }),
      body: t.Object({
        content: t.String()
      })
    }
  )
