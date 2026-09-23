import 'dotenv/config';
import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import { articles } from './routes/articles.js';

const fastify = Fastify({ logger: true });

fastify.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL
});

console.log('Conexión a la base de datos establecida');

fastify.register(articles);

fastify.listen({ port: process.env.PORT }, (err) => {
  console.log(`Servidor escuchando en el puerto http://localhost:${process.env.PORT}`);
  if (err) throw err;
});