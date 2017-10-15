const gsheets = require('../model/gsheets')
const { ServerNamespace } = require('./utils')

class Main extends ServerNamespace {
  async addLinkedSheet(sheetID) {
    const settingsID = gsheets.settingsDocID
    const listOfSheets = await gsheets.getListOfSheets(settingsID)
    // linkedsheets is the third sheet (index 2)
    const index = 2
    const rows = await gsheets.getRows(settingsID, listOfSheets[index])
    const append = await gsheets.appendRows(settingsID, listOfSheets[index], [
      [sheetID]
    ])
  }
}

module.exports = Main
