const { ServerNamespace } = require('./utils')
const users = require('../model/users')
// const debugUsers = require('debug')('service:Users')

class Users extends ServerNamespace {
  async connection() {
    // await this.fetchUsers()
  }

  async fetchUsers(noData, reply) {
    try {
      const data = await users.getUsers()
      reply({
        users: data,
        status: 'OK!',
      })
    } catch ({ message }) {
      reply({
        hasError: true,
        generalError: { message, type: 'error' },
      })
    }
  }

  async deleteUser(data, reply) {
    try {
      const validate = this.hasRequiredFields(data, [
        'username',
      ])
      if (validate.hasError) {
        reply(validate)
      } else {
        const { username } = data
        await users.deleteUser(username)
        reply({ status: 'OK!' })
      }
    } catch ({ message }) {
      reply({
        hasError: true,
        generalError: { message, type: 'error' },
      })
    }
  }

  async updatePassword(data, reply) {
    try {
      // data is nested under data?
      const validate = this.hasRequiredFields(data.data, ['username', 'password'], true)
      if (validate.hasError) {
        reply(validate)
      } else {
        const { username, password } = data.data
        await users.updateUserPassword(username, password)
        reply({ status: 'OK!' })
      }
    } catch ({ message }) {
      reply({ hasError: true, generalError: { message } })
    }
  }
}

module.exports = Users
