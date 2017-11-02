const { ServerNamespace } = require('./utils')
const users = require('../model/users')

class Users extends ServerNamespace {
  async connection() {
    await this.fetachUsers()
  }

  async fetachUsers() {
    const data = await users.getUsers()
    this.emitClientEvent('fetch users', data)
  }

  // functions only. No logic built at this moment
  async deleteUser(username) {
    const check = await users.deleteUser(username)
    this.emitClientEvent('delete users', username)
  }

  async updatePassword(username, password) {
    const check = await users.updateUserPassword(username, password)
    this.emitClientEvent('Updated password for users', username)
  }
}

module.exports = Users
