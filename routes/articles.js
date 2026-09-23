export async function articles(fastify) {
  fastify.get("/", async (request, reply) => {
    reply.send({ message: "Bienvenido a la API de artículos, dirijete a http://localhost:3000/articles para ver los artículos" });
  });

  fastify.get("/articles", async (request, reply) => {
    try {
      const datos = await fastify.pg.query("SELECT * FROM articles");

      reply.send(datos.rows);
    } catch (err) {
      reply.status(500).send({
        error: "Error al consultar la base de datos",
      });
    }
  });

  fastify.get("/articles/:id", async (request, reply) => {
    try {
      const { id } = request.params;

      const query = "SELECT * FROM articles WHERE id = $1";
      const datos = await fastify.pg.query(query, [id]);

      if (datos.rows.length === 0) {
        return reply.status(404).send({ error: "Artículo no encontrado" });
      }

      return datos.rows[0];
    } catch (err) {
      fastify.log.error(err);
      reply
        .status(500)
        .send({ error: "Error al consultar el artículo por ID" });
    }
  });

  fastify.post("/articles", async (request, reply) => {
    const { title, content, author } = request.body;

    try {
      const query = `
      INSERT INTO articles (title, content, author, published_at, updated_at) 
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING *
    `;

      reply.code(201);
      console.log("Creacion de artículo exitosa");
      const result = await fastify.pg.query(query, [title, content, author]);
      reply.send(result.rows[0]);
      reply.send("creado correctamente");
    } catch (error) {
      reply.status(500).send({ error: "No se pudo crear el artículo" });
    }
  });

  fastify.patch("/articles/:id", async (request, reply) => {
    const { id } = request.params;
    const { title, content, author } = request.body;

    try {
      const query = `
      UPDATE articles 
      SET title = $1, content = $2, author = $3, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $4 
      RETURNING *
    `;
      const values = [title, content, author, id];
      const result = await fastify.pg.query(query, values);
      reply.send(result.rows[0]);
    } catch (error) {
      reply.status(500).send({ error: "No se pudo actualizar el artículo" });
    }
  });

  fastify.delete("/articles/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      const query = "DELETE FROM articles WHERE id = $1 RETURNING *";
      const result = await fastify.pg.query(query, [id]);
      if (result.rows.length === 0) {
        return reply.status(404).send({ error: "Artículo no encontrado" });
      }

      reply.send({ message: "Artículo eliminado correctamente" });
    } catch (error) {
      reply.status(500).send({ error: "No se pudo eliminar el artículo" });
    }
  });
}
