const { ServerNamespace } = require('./utils')
const users = require('../model/users')
const debugUsers = require('debug')('service:Users')

class Users extends ServerNamespace {
  async connection() {
    await this.fetchUsers()
  }

  async fetchUsers(reply) {
    try {
      const data = await users.getUsers()
      this.emitClientEvent('fetch users', data)
      reply({
        fetchUsers: 'OK'
      })
      debugUsers('Successfully fetched authorized users')
    } catch (error) {
      reply({
        hasError: true,
        generalError: { message: error.message, type: 'error'},
      })
      debugUsers(error.message)
    }
  }

  async deleteUser(username) {
    try {
      const check = await users.deleteUser(username)
      this.emitClientEvent('delete users', username)  
    } catch (error) {
      debugUsers(error)
    }
  }

  async updatePassword(username, password) {
    const validate = this.hasRequiredFields(username,['username'],true)
    if (validate.hasError) {
      return debugUsers(validate)
    }
    try {
      const check = await users.updateUserPassword(username, password)
      this.emitClientEvent('Updated password for users', username)
      debugUsers('Updated password for users')
    } catch (error) {
      debugUsers(error)
    }
  }
}

module.exports = Users
