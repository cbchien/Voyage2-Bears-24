const express = require('express')
const path = require('path')
const config = require('./config')
const app = express()

app.use(config.middleware.session)
app.use('/build', express.static(config.assets.javascript))
app.use('/style', express.static(config.assets.style))
app.use('/asset', express.static(config.assets.asset))

app.get('*', (req, res) => {
  res.sendFile('default.html', { root: path.resolve(__dirname, './view') })
})

module.exports = app
