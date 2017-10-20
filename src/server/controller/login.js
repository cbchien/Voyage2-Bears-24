const { ServerNamespace } = require('./utils')
const users = require('../model/users')
const debugLogin = require('debug')('service:Login')

class Login extends ServerNamespace {
  /**
   * Attempts to login with the provided credentials
   * @param {Object} data - user data
   * @param {string} data.username - username
   * @param {string} data.password - user password
   * @param {Function} reply - callback to reply to user
   */
  async login(data, reply) {
    try {
      const { username, password } = data
      const { request } = this.socket.request
      await users.matchLogin(username, password)
      request.session = {
        logged: true,
        username,
      }
      reply({
        message: 'Login successfull',
      })
      debugLogin('User logged in successfully')
    } catch (error) {
      reply({
        error: error.message,
      })
      debugLogin(error.message)
    }
  }
}

module.exports = Login
