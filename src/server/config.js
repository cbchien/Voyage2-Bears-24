const session = require('express-session')
const path = require('path')

const config = {
  assets: {
    javascript: path.resolve(__dirname, '../../build'),
    style: path.resolve(__dirname, '../../node_modules/antd/dist'),
    asset: path.resolve(__dirname, './assets'),
  },
  middleware: {
    session: session({
      secret: process.env.SECRET || 'chingu dashboard',
      resave: true,
      saveUninitialized: true,
    }),
  },
}

module.exports = config
