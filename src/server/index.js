const express = require('express')
const path = require('path')
const app = express.Router()

const config = {
  assets: {
    javascript: path.resolve(__dirname, '../../build'),
    style: path.resolve(__dirname, '../../node_modules/antd/dist'),
  },
}

app.use('/build', express.static(config.assets.javascript))
app.use('/style', express.static(config.assets.style))

app.get('*', (req, res) => {
  res.sendFile('default.html', { root: path.resolve(__dirname, './view') })
})

module.exports = app
