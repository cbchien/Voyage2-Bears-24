const util = require('util')
const { middleware } = require('../config')
const gsheets = require('../model/gsheets')
const colors = require('colors/safe')
const debug = require('debug')('api:namespace')
const debugClient = require('debug')('api:namespace:client')
const debugServer = require('debug')('api:namespace:server')

// use express-session to share the session object
// between express.js and socket.io
const connectSession = (socket, next) => {
  middleware.session(socket.request, socket.request.res, next)
}
// allow only for logged in users
const isLogged = (socket, next) => {
  connectSession(socket, () => {
    if (socket.request.session.logged) next()
  })
}
// allow only for not logged in users
const isNotLogged = (socket, next) => {
  connectSession(socket, () => {
    if (!socket.request.session.logged) next()
  })
}

const isGoogleSheets = (options = { connected: true }) => (socket, next) => {
  // If options.connected is true, it verifies if the clientSecret
  // and token exists
  // else if options.connected is false, it verifies if either of
  // clientSecret or token do not exist
  gsheets.updateInfo()
  if (
    gsheets.existClientSecret &&
    gsheets.existToken &&
    options.connected
  ) {
    gsheets.initialize()
    next()
  } else if (
    !options.connected &&
    (!gsheets.existClientSecret || !gsheets.existToken)
  ) {
    next()
  }
}

const { white, bold, inverse } = colors

const emp = str => util.inspect(str, { colors: true })
const formatCode = code => (
  util.inspect(code, { colors: true, breakLength: 0 })
    .split('\n')
    .map((line, n) => `${inverse(String(n).padStart(3))} ${bold(white(line))}`)
    .join('\n')
)

class ServerNamespace {
  constructor(socket) {
    const ownMethods = Reflect.ownKeys(
      Reflect.getPrototypeOf(this),
    )
    debug(
      `new namespace created ${emp(socket.nsp.name)}`,
      ` for clientID ${emp(socket.id)}`,
    )
    const blacklist = [
      'askClient',
      'constructor',
      'dispatch',
      'emitClientEvent',
      'hasRequiredFields',
      'state',
      'type',
    ]
    ownMethods.forEach((method) => {
      if (
        typeof this[method] === 'function' &&
        !(method in blacklist)
      ) {
        debug(
          `adding new event ${emp(String(method))}`,
          ` for nsp ${emp(socket.nsp.name)}`,
        )

        socket.on(`server/${method}`, (data, reply) => {
          debugClient(`${(
            typeof reply === 'function'
              ? `asking event ${emp(String(method))} `
              : `emit server event ${emp(String(method))} `
          )}with data: \n${formatCode(data)}`)

          const wrapReply = (replayingData) => {
            if (typeof reply !== 'function') {
              return debugServer(colors.yellow(
                'WARNING: trying to reply but client is not expecting an answer',
              ))
            }
            debugServer(
              `event ${emp(String(method))} replying with data:` +
              `\n${formatCode(replayingData)}`,
            )
            return reply(replayingData)
          }
          this[method](data, wrapReply)
        })
      }
    })
    this.socket = socket
    // @ts-ignore
    if (typeof this.connection === 'function') {
      // @ts-ignore
      this.connection()
    }
  }
  /**
   * Asks for data to a specific client event
   * @param {String} event - Event on the client side where to send data
   * @param {*} data - Data to be sent to the client
   * @param {Function} callback - Acknowledge, will be called with the clients answer
   */
  askClient(event, data, callback) {
    const wrapCallback = (clientRepliedData) => {
      debugClient(
        `replying for ${emp(event)} with data: ` +
        `\n${formatCode(clientRepliedData)}`,
      )
      callback(clientRepliedData)
    }
    debugServer(
      `asking client event ${emp(event)} with data: ` +
      `\n${formatCode(data)}`,
    )
    this.socket.emit(`client/${event}`, data, wrapCallback)
  }
  /**
   * Emits an event on the client side and sends data
   * @param {*} event - Event on the client side where to send data
   * @param {*} data - Data to be sent to the client
   */
  emitClientEvent(event, data) {
    debugServer(
      `emit client event ${emp(event)} with data: ` +
      `\n${formatCode(data)}`,
    )
    this.socket.emit(`client/${event}`, data)
  }

  hasRequiredFields(data, expectedProps, addHelper = false) {
    const ret = {
      hasError: false,
      fieldErrors: {},
      generalError: {},
    }
    if (typeof data !== 'object') {
      ret.hasError = true
      ret.generalError = {
        message: 'Bad Request!, data is not an object',
        type: 'error',
      }
      return ret
    }
    expectedProps.forEach((prop) => {
      if (!Reflect.has(data, prop) || data[prop] === '') {
        ret.fieldErrors[prop] = { validateStatus: 'error' }
        ret.hasError = true
        if (addHelper) {
          ret.fieldErrors[prop].help = `${prop} is required`
        }
      }
    })
    return ret
  }
}

module.exports = {
  connectSession,
  isLogged,
  isNotLogged,
  isGoogleSheets,
  ServerNamespace,
}
