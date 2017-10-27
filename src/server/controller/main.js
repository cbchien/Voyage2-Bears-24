const { ServerNamespace } = require('./utils')
const gsheets = require('../model/gsheets')

class Main extends ServerNamespace {
  async connection() {
    const { session } = this.socket.request
    gsheets.updateInfo()
    if (
      !gsheets.existClientSecret ||
      !gsheets.existToken
    ) {
      this.emitClientEvent('isLogged', false)
      this.emitClientEvent('displaySetup', true)
    } else {
      if (session && session.logged) {
        this.emitClientEvent('isLogged', true)
        this.emitClientEvent('setUsername', session.username)
      } else {
        this.emitClientEvent('isLogged', false)
      }
      this.emitClientEvent('displaySetup', false)
    }
  }
  /**
   * Logs a user out from the application by deleting the session object
   * @param {null} data is null, no data should be sent by the client
   * @param {Function} reply tells the client to reload the page
   */
  logout(data, reply) {
    this.socket.request.session.destroy()
    reply()
  }
}

module.exports = Main
