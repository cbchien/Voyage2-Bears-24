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
    const validate = this.hasRequiredFields(data, ['username', 'password'], true)
    if (validate.hasError) {
      return reply(validate)
    }
    try {
      const { username, password } = data
      const { session } = this.socket.request
      await users.matchLogin(username, password)
      session.logged = true
      session.username = username
      session.save()
      reply({ status: 'OK' })
      debugLogin('User logged in successfully')
    } catch (error) {
      reply({
        hasError: true,
        generalError: { message: error.message, type: 'error' },
      })
      debugLogin(error.message)
    }
    return true
  }
}

module.exports = Login
