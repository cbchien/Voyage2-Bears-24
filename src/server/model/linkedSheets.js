const gsheets = require('./gsheets')

const LINKED_SHEETS_NAME = 'linkedSheets'

class LinkedSheets {
  SETTINGS_DOC_ID() { return gsheets.settingsDocID }

  /**
   * Gets the `linkedSheets` sheet from the Settings Doc
   * @return {Promise} the `linkedSheets` sheet
   */
  async getLinkedSheetsSheet() {
    const listOfSheets = await gsheets.getListOfSheets(this.SETTINGS_DOC_ID())
    const linkedSheetsSheet = listOfSheets.find(sheet => sheet.title === LINKED_SHEETS_NAME)
    if (!linkedSheetsSheet) {
      throw new Error(`"${LINKED_SHEETS_NAME}" does not exists in Settings doc`)
    }
    return linkedSheetsSheet
  }

  /**
   * Gets the list of linkedSheets from the `linkedSheets` sheet
   * @return {Promise<Array>} list of linkedSheets in the format
   * [[name, linkedSheetId, metadata], ...]
   */
  async fetchLinkedSheets() {
    const linkedSheetsSheet = await this.getLinkedSheetsSheet()
    const linkedSheetRows = await gsheets.getRows(this.SETTINGS_DOC_ID(), linkedSheetsSheet)
    linkedSheetRows.shift()
    return linkedSheetRows
  }

  /**
   * Links a Google Spreadsheet Document by its ID to the application.
   * The sheetID is saved in the "linkedSheets" sheet in the Settings
   * Document
   * @param {string} name - Name of the Document
   * @param {string} sheetID - The Google Spreadsheet ID to link
   * @return {Promise} The result of calling appendRows
   */
  async addLinkedSheet(name, sheetID) {
    const linkedSheetsSheet = await this.getLinkedSheetsSheet()
    return gsheets.appendRows(this.SETTINGS_DOC_ID(), linkedSheetsSheet, [
      [name, sheetID],
    ])
  }

  /**
   * Unlink a Google Spreadsheet Document by its ID.
   * This action removes the corresponding entry in the
   * "linkedSheets" sheet in the Settings Document.
   * @param {string} sheetID - The Google Spreadsheet ID to unlink
   * @return {Promise} The result of calling appendRows
   */
  async unlinkSheet(sheetID) {
    const linkedSheets = await this.fetchLinkedSheets()
    const linkedSheetsSheet = await this.getLinkedSheetsSheet()
    const indexToDelete = linkedSheets.findIndex(sheet => sheet[1] === sheetID)
    if (indexToDelete === -1) {
      throw new Error("Linked Sheet doesn't exist")
    }
    const adjustedIndex = indexToDelete + 2
    return gsheets.deleteRows(this.SETTINGS_DOC_ID(),
      linkedSheetsSheet, adjustedIndex, adjustedIndex)
  }
}

module.exports = new LinkedSheets()
