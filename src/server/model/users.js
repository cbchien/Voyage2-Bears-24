const gsheets = require('./gsheets')

class DashboardUsers {
  /**
   * Gets the list of users from the `users` sheet
   * @return {Promise<Array>} list of users in the format [[username, password], ...]
   */
  async parseUserRows() {
    const settingID = gsheets.settingsDocID
    const listOfSheets = await gsheets.getListOfSheets(settingID)
    const userSheet = listOfSheets.find(sheet => sheet.title === 'users')
    if (!userSheet) {
      throw new Error('"users" sheet couldn\'t be found :(')
    }
    const userRows = await gsheets.getRows(settingID, userSheet)
    userRows.shift()
    return userRows
  }
  /**
   * Verifies if the provided username and password exist in the `users` sheet
   * @param {string} username - username
   * @param {string} password - password
   * @return {Promise<boolean>} true if successful. Throws an error otherwise
   */
  async matchLogin(username, password) {
    const users = await this.parseUserRows()
    const matchCount = users.reduce((foundCount, [rowUsr, rowPwd]) => (
      rowUsr === username &&
      rowPwd === password
        ? foundCount + 1
        : foundCount
    ), 0)
    if (matchCount) {
      if (matchCount > 1) {
        throw new Error('Duplicated user entry in database')
      }
      return true
    }
    throw new Error('Invalid credentials')
  }
  /**
   * Gets the list of usernames from `users` sheet
   * @return {Promise<Array>} list of users in the format [username, ...]
   */
  async getUsers() {
    const users = await this.parseUserRows()
    return users.map(row => row[0])
  }

  async deleteUser(username) {
    const allUser = await this.getUsers()
    // add 1 to compensate .shift()
    const indexToDelete = allUser.findIndex( user => user === username) + 1
    // next three const are duplicate codes to parseUserRows()
    const settingID = gsheets.settingsDocID
    const listOfSheets = await gsheets.getListOfSheets(settingID)
    const userSheet = listOfSheets.find(sheet => sheet.title === 'users')
    if (!userSheet) {
      throw new Error('"users" sheet couldn\'t be found :(')
    }
    // indexToDelete + 1 to delete single row
    const removeUser = await gsheets.deleteRows(settingID, userSheet, indexToDelete + 1, indexToDelete + 1)
  }

  async updateUserPassword(username, password) {
    const allUser = await this.getUsers()
    // add 2 to compensate .shift()
    const indexToUpdate = allUser.findIndex( user => user === username) + 2
    // next three const are duplicate codes to parseUserRows()
    const settingID = gsheets.settingsDocID
    const listOfSheets = await gsheets.getListOfSheets(settingID)
    const userSheet = listOfSheets.find(sheet => sheet.title === 'users')
    if (!userSheet) {
      throw new Error('"users" sheet couldn\'t be found :(')
    }
    const range = 'A'+indexToUpdate+':B'+indexToUpdate
    const updatePwd = await gsheets.updateRows(settingID, userSheet, range, [
      [null, password]
    ])
  }
}

module.exports = new DashboardUsers()
