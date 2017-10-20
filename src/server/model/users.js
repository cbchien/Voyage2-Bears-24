const debugUser = require('debug')('api:users')
const gsheets = require('./gsheets')

class DashboardUsers {
  constructor() {
    this.validated = null
  }

  initialize() {
  }

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
    for (let row of users) {
      if (row[0] === username && row[1] === password) {
        matchCount++
      } 
    }

    // return true if only one entry is matched
    if (matchCount === 1) {
      this.validated = true
      debugUser('Matching profile found for:', username)
      return true
    } else if (matchCount > 1) {
      debugUser('duplicate user entry in database')
      return false
    }
    return false
  }

  async getUsers() {
    // rows parameter input from gsheet getRows function
    const users = await this.parseUserRows()
    let userArr = []
    for (let row of users) {
      userArr.push(row[0])
    }
    return userArr
  }
}

module.exports = new DashboardUsers()
