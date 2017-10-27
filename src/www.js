const express = require('express')
const compression = require('compression')
const colors = require('colors/safe')
const debugWebpackInfo = require('debug')('webpack:info')
const debugWebpackWarn = require('debug')('webpack:warn')
const debugWebpackErr = require('debug')('webpack:werr')

const app = require('./server')
const io = require('./server/controller')
const server = express()

if (process.env.NODE_ENV === 'development') {
  /* eslint-disable */
  const webpack = require('webpack')
  const webpackMiddleware = require('webpack-dev-middleware')
  const config = require('../webpack.config')({
    in: './src/client/index.js',
    out: 'bundle'
  })
  /* eslint-enable */
  // @ts-ignore
  const compiler = webpack(config)
  const webpackInstance = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    log: (...rest) => {
      if (rest.length === 1) {
        debugWebpackInfo(
          rest[0].includes('webpack:')
            ? colors.bold(rest[0])
            : rest[0],
        )
      } else {
        debugWebpackInfo(...rest)
      }
    },
    warn: (...rest) => {
      debugWebpackWarn(...rest)
    },
    error: (...rest) => {
      debugWebpackErr(...rest)
    },
    stats: {
      assets: true,
      colors: true,
      errorDetails: true,
      errors: true,
      timings: false,
      warnings: true,
      cached: true,
      chunks: false,
      modules: false,
      hash: false,
      version: false,
      reasons: true,
    },
  })
  server.use(webpackInstance)
  server.use((req, res, next) => {
    webpackInstance.waitUntilValid(() => {
      next()
    })
  })
}

server.use(compression({ threshold: 0, level: 9 }))
server.use(app)
io.attach(
  server.listen(process.env.PORT || 8080),
)
