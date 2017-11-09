const { ServerNamespace } = require('./utils')
const users = require('../model/users')
// const debugUsers = require('debug')('service:Users')

class Users extends ServerNamespace {
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
      const validate = this.hasRequiredFields(data, [
        'username',
        'password',
      ], true)

      if (validate.hasError) {
        reply(validate) // One or both fields are required
      } else {
        const {
          username, // data.username exist if passed validation
          password, // data.password exist if passed validation
        } = data

        // Check if password is empty or less than 6 chars
        if (String(password).trim().length <= 6) {
          // Reply with custom error message
          reply({
            hasError: true,
            fieldErrors: {
              password: {
                validateStatus: 'error',
                help: 'Password must contain more than 6 valid characters',
              },
            },
          })
        } else {
          await users.updateUserPassword(username, password)
          reply({ status: 'OK!' }) // If it doesn't throw any error,
        }
      }
    } catch ({ message }) {
      // There was an error in users.updateUserPassword (This is General Error)
      reply({
        hasError: true,
        generalError: { message, type: 'error' },
      })
    }
  }
}

module.exports = Users
