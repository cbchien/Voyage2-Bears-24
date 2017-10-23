const { ServerNamespace } = require('./utils')
const gsheets = require('../model/gsheets')

class Main extends ServerNamespace {
  async connection() {
    gsheets.updateInfo()
    if (
      !gsheets.existClientSecret ||
      !gsheets.existToken
    ) {
      this.emitClientEvent('isLogged', false)
      this.emitClientEvent('displaySetup', true)
    } else {
      if (
        this.socket.request.session &&
        this.socket.request.session.logged
      ) {
        this.emitClientEvent('isLogged', true)
      } else {
        this.emitClientEvent('isLogged', false)
      }
      this.emitClientEvent('displaySetup', false)
    }
  }
}

module.exports = Main
