const { ServerNamespace } = require('./utils')
const linkedSheets = require('../model/linkedSheets')

class LinkedSheets extends ServerNamespace {
  async connection() {
    // await this.fetchLinkedSheets()
  }

  async fetchLinkedSheets(noData, reply) {
    try {
      const data = await linkedSheets.fetchLinkedSheets()
      reply({
        userList: data,
        status: 'OK!',
      })
    } catch ({ message }) {
      reply({
        hasError: true,
        generalError: { message, type: 'error' },
      })
    }
  }

  async addLinkedSheet(data, reply) {
    try {
      const validate = this.hasRequiredFields(data, [
        'name',
        'linkedSheetId',
      ], true)
      if (validate.hasError) {
        reply(validate)
      } else {
        const { name, linkedSheetId } = data
        await linkedSheets.addLinkedSheet(name, linkedSheetId)
        reply({ status: 'OK!' })
      }
    } catch ({ message }) {
      reply({ hasError: true, generalError: { message } })
    }
  }

  async unlinkSheet(data, reply) {
    try {
      const validate = this.hasRequiredFields(data, [
        'linkedSheetId',
      ])
      if (validate.hasError) {
        reply(validate)
      } else {
        const { linkedSheetId } = data
        await linkedSheets.unlinkSheet(linkedSheetId)
        reply({ status: 'OK!' })
      }
    } catch ({ message }) {
      reply({
        hasError: true,
        generalError: { message, type: 'error' },
      })
    }
  }
}

module.exports = LinkedSheets
