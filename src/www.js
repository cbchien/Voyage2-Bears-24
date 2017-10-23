const express = require('express')
const app = require('./server')
const io = require('./server/controller')
const server = express()

server.use(app)
io.listen(
  server.listen(process.env.PORT || 8080),
)
