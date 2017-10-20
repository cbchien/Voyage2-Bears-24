const { ServerNamespace } = require('./utils')
const users = require('../model/users')
const debugLogin = require('debug')('test:login')

class Login extends ServerNamespace {
  async connection(myUser = 'test', myPwd = '1234') {
    const matchUser = await users.matchLogin(myUser, myPwd)
    debugLogin(matchUser)
  }
}

module.exports = Login
