import 'dotenv/config';
import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import {articles} from './routes/articles.js';

const fastify = Fastify({ logger: true });

fastify.register(fastifyPostgres, {
connectionString: process.env.DATABASE_URL
});

fastify.register(articles);

fastify.listen({ port: process.env.PORT }, (err) => {
  if (err) throw err;
});

