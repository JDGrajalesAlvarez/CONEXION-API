const fastify = require('fastify')();

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})

fastify.get('/', function (req, reply) {
  fastify.pg.query(
    'SELECT * FROM articles',
    function onResult (err, result) {
     reply.send(err || result.rows)
    }
 )
})