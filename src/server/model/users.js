const debugUser = require('debug')('api:users')
const gsheets = require('./gsheets')

class DashboardUsers {
  async parseUserRows() {
    const settingID = gsheets.settingsDocID
    const listOfSheets = await gsheets.getListOfSheets(settingID)
    const userRows = await gsheets.getRows(settingID, listOfSheets[1])
    return userRows
  }

  async matchLogin(username, password) {
    // rows parameter input from gsheet getRows function
    // username and password will be from client side input
    const users = await this.parseUserRows()
    let matchCount = 0
    users.forEach((row) => {
      if (row[0] === username && row[1] === password) {
        /* eslint no-plusplus: "error" */
        matchCount += 1
      }
    })

    // return true if only one entry is matched
    if (matchCount === 1) {
      this.validated = true
      debugUser('Matching profile found for:', username)
      return true
    } else if (matchCount > 1) {
      debugUser('duplicate user entry in database for:', username)
      return false
    }
    return false
  }

  async getUsers() {
    // rows parameter input from gsheet getRows function
    const users = await this.parseUserRows()
    return users.map(row => row[0])
  }
}

module.exports = new DashboardUsers()
