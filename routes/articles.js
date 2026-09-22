import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

export async function articles() {

  fastify.get('/', async (request, reply) => {
    console.log("aqui van las peticiones")
    await fastify.pg.query
     ('SELECT * FROM articles');
     function onResult (err, result) {
      reply.send(err || result.rows)
    }

    try {
     reply.send({ message: 'Consulta exitosa' });
      
    } catch (err) {
      reply.status(500).send({ error: 'Error al consultar la base de datos' });
    }
  });

}