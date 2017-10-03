const express = require('express')
const app = require('./server')
const server = express()

server.use(app)

server.listen(process.env.PORT || 8080)
