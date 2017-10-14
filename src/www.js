const express = require('express')
const gsheets = require('./server/model/gsheets')
const app = require('./server')
const io = require('./server/controller')
const server = express()

gsheets.commandLineSetup(async () => {
  server.use(app)
  io.listen(
    server.listen(process.env.PORT || 8080),
  )
})
