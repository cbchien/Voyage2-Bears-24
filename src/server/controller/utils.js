const { middleware } = require('../config')
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
              ? `asking event "${method}" with data: "${data}"`
              : `emitting server event "${method}" with data: "${data}"`,
          )
          const wrapReply = (replyData) => {
            if (typeof reply !== 'function') {
              return debugServer(
                'WARNING: trying to reply but client is not expecting an answer',
              )
            }
            debugServer(`event "${method}" replying with data: "${replyData}"`)
            return reply(replyData)
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
   * @param {String} eventName - Event on the client side where to send data
   * @param {*} data - Data to be sent to the client
   * @param {Function} callback - Acknowledge, will be called with the clients answer
   */
  askClient(eventName, data, callback) {
    const wrapCallback = (repliedData) => {
      debugClient(`replied for event "${eventName}" with data: "${repliedData}"`)
      callback(repliedData)
    }
    debugServer(`asking client for event "${eventName}" with data: "${data}"`)
    this.socket.emit(`client/${eventName}`, data, wrapCallback)
  }
  /**
   * Emits an event on the client side and sends data
   * @param {*} eventName - Event on the client side where to send data
   * @param {*} data - Data to be sent to the client
   */
  emitClientEvent(eventName, data) {
    debugServer(`emitting client event "${eventName}" with data: "${data}"`)
    this.socket.emit(`client/${eventName}`, data)
  }
}

module.exports = {
  connectSession,
  isLogged,
  isNotLogged,
  ServerNamespace,
}
