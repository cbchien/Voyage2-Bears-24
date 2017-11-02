const { ServerNamespace } = require('./utils')
const users = require('../model/users')
const debugGetUser = require('debug')('service:getUser')

class Users extends ServerNamespace {
  async connection() {
    const { session } = this.socket.request
    console.log('12345678')
    if (session) {
      const data = await users.getUsers()
      console.log('12345678')
      this.emitClientEvent('users', data)
    } else {
      console.log('12345678')
    }
    // try {
    //   debugGetUser('fetched users', userData)
    // } catch (error) {
    //   debugGetUser(error.message)
    // }
  }
}

module.exports = Users
