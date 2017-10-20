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
    const userRows = await gsheets.getRows(settingID, listOfSheets[1])
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
    throw new Error(`No matching profile was found for ${username}`)
  }
  /**
   * Gets the list of usernames from `users` sheet
   * @return {Promise<Array>} list of users in the format [username, ...]
   */
  async getUsers() {
    const users = await this.parseUserRows()
    return users.map(row => row[0])
  }
}

module.exports = new DashboardUsers()
