import io from 'socket.io-client'
import debug from '../debug'

const debugClient = debug('api:client')
const debugServer = debug('api:server')
const manager = new io.Manager(
  '/', // equivalent to: http[s]://[host]:[port]/
  {
    path: '/api',
    autoConnect: false,
    reconnection: true,
  },
)

const privateProps = {
  reducer: Symbol('reducer'),
  dispatch: Symbol('dispatch'),
  manager: Symbol('socketManager'),
  blacklist: Symbol('blacklistMethods'),
  types: Symbol('arrayOfTypes'),
}

let dispatch = null

export const pending = (value = null) => ({
  status: 'pending',
  value,
})
export const resolved = (value = null) => ({
  status: 'resolved',
  value,
})
export const rejected = (value = null) => ({
  status: 'rejected',
  value,
})

export class Service {
  constructor() {
    this.state = {}
    this.type = {}
    this[privateProps.manager] = (
      !this[privateProps.manager]
        ? debugClient(
          'ERROR: You forgot to decorate your class with @Service(namespace)',
        )
        : this[privateProps.manager]
    )
    const socket = this[privateProps.manager]
    const ownMethods = Reflect.ownKeys(Reflect.getPrototypeOf(this))
    const blacklist = [
      'type',
      'state',
      'askServer',
      'connect',
      'connection',
      'constructor',
      'emitServerEvent',
      'socket',
    ]
    ownMethods.forEach((method) => {
      if (
        typeof this[method] === 'function' &&
        !(method in blacklist)
      ) {
        debugClient(`adding new event "${method}" for nsp "${socket.nsp}"`)

        this[method] = this[method].bind(this)

        socket.on(`client/${method}`, (data, reply) => {
          debugServer(
            typeof reply === 'function'
              ? `asking event "${method}" with data: "${data}"`
              : `emitting client event "${method}" with data: "${data}"`,
          )
          const wrapReply = (replyData) => {
            if (typeof reply !== 'function') {
              debugClient(
                'WARNING: trying to reply but server is not expecting an answer',
              )
              return undefined
            }
            debugClient(`event "${method}" replying with data "${replyData}"`)
            return reply(replyData)
          }
          this[method](data, wrapReply)
        })
      }
    })
    this.socket = socket
    socket.on('connect', () => {
      debugClient(`"${socket.nsp}" connected to server! :)`)
      // @ts-ignore
      if (typeof this.connection === 'function') {
        // @ts-ignore
        this.connection()
      }
    })
    debugClient(
      `new client Socket created for namespace ${socket.nsp}`,
    )
  }
  [privateProps.reducer](state = this.state, action) {
    if (!this[privateProps.types]) {
      this[privateProps.types] = {}
      Reflect.ownKeys(this.type).forEach((actionType) => {
        const symbol = this.type[actionType]
        this[privateProps.types][symbol] = true
      })
    }
    if (action.type in this[privateProps.types]) {
      this.state = Object.freeze({
        ...state,
        ...action.payload,
      })
      return this.state
    }
    return state
  }
  [privateProps.dispatch](...rest) {
    if (!dispatch) {
      debugClient('Cannot dispatch, service is not connected to the store.')
    } else {
      this[privateProps.dispatch] = dispatch
      dispatch(...rest)
    }
  }

  /**
   * Asks for data to a specific server event
   * @param {String} eventName - Event on the server side where to send data
   * @param {*} data - Data to be sent to the server
   * @param {Function} callback - Acknowledge, will be called with the server answer
   */
  askServer(eventName, data, callback) {
    const wrapCallback = (repliedData) => {
      debugServer(`replied for event "${eventName}" with data: "${repliedData}"`)
      callback(repliedData)
    }
    debugClient(`asking server for event "${eventName}" with data: "${data}"`)
    this.socket.emit(`server/${eventName}`, data, wrapCallback)
  }

  /**
   * Emits an event on the server side and sends data
   * @param {*} eventName - Event on the server side where to send data
   * @param {*} data - Data to be sent to the server
   */
  emitServerEvent(eventName, data) {
    debugClient(`emitting server event "${eventName}" with data: "${data}"`)
    this.socket.emit(`server/${eventName}`, data)
  }

  /**
   * Dispatches an action type
   * @param {*} actionType - action type to be dispatched
   * @param {*} payload - payload to be merged with the current state
   */
  dispatchAs(actionType, payload) {
    this[privateProps.dispatch]({
      type: actionType,
      payload,
    })
  }
}

export const mapServiceToStore = (services) => {
  const reducers = {}
  const ownKeys = Reflect.ownKeys(services)
  ownKeys.forEach((key) => {
    const service = services[key]
    service.socket.connect()
    reducers[key] = service[privateProps.reducer].bind(service)
  })
  return reducers
}

export const applyServices = createStore => (reducer, preloadedState, enhancer) => {
  const store = createStore(
    reducer,
    preloadedState,
    enhancer,
  )
  dispatch = store.dispatch
  return store
}

export const Namespace = namespace => (Constructor) => {
  Constructor.prototype[privateProps.manager] = manager.socket(namespace)
  return Constructor
}
