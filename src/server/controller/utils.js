const { middleware } = require('../config')
const gsheets = require('../model/gsheets')
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

class ServerNamespace {
  constructor(socket) {
    const ownMethods = Reflect.ownKeys(
      Reflect.getPrototypeOf(this),
    )
    debug(
      `new namespace created "${socket.nsp.name}" for clientID "${socket.id}"`,
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
        debug(`adding new event "${method}" for nsp "${socket.nsp.name}"`)

        socket.on(`server/${method}`, (data, reply) => {
          debugClient(
            typeof reply === 'function'
              ? `asking event "${method}" with data: "${JSON.stringify(data)}"`
              : `emit server event "${method}" with data: "${JSON.stringify(data)}"`,
          )
          const wrapReply = (rData) => {
            if (typeof reply !== 'function') {
              return debugServer(
                'WARNING: trying to reply but client is not expecting an answer',
              )
            }
            debugServer(`event "${method}" replying with "${JSON.stringify(rData)}"`)
            return reply(rData)
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
   * @param {String} evt - Event on the client side where to send data
   * @param {*} data - Data to be sent to the client
   * @param {Function} callback - Acknowledge, will be called with the clients answer
   */
  askClient(evt, data, callback) {
    const wrapCallback = (repData) => {
      debugClient(`reply for "${evt}" with data: "${JSON.stringify(repData)}"`)
      callback(repData)
    }
    debugServer(`ask client "${evt}" with data: "${JSON.stringify(data)}"`)
    this.socket.emit(`client/${evt}`, data, wrapCallback)
  }
  /**
   * Emits an event on the client side and sends data
   * @param {*} evt - Event on the client side where to send data
   * @param {*} data - Data to be sent to the client
   */
  emitClientEvent(evt, data) {
    debugServer(`emit client event "${evt}" with data: "${JSON.stringify(data)}"`)
    this.socket.emit(`client/${evt}`, data)
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
