const fastify = require('fastify')()

fastify.register(require('@fastify/postgres'), {
  connectionString: 'postgres://postgres:1234@localhost:5432/proyecto_api'

})

