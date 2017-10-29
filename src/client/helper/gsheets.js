class GSheetsHelper {
  /**
   * Gets a Google Spreadsheet's ID from a URL
   *
   * The URL should be in the following format:
   * https://docs.google.com/spreadsheets/d/myIdGoesHere/...
   *
   * It should start with 'docs.google.com/spreadsheets/d/'
   * followed by the spreadsheet ID and other arguments.
   *
   * The function is expected to throw an error for invalid URLs.
   *
   * @param {string} url - Google Spreadsheet URL
   * @return {string} Google Spreadsheet's ID
   */
  getSheetIdFromUrl(url) {
    const urlObj = new URL(url)
    const pathnameArgs = urlObj.pathname.split('/')

    if (urlObj.hostname !== 'docs.google.com') {
      throw Error(`URL is not valid: ${url}`)
    }
    if (pathnameArgs.length < 4 || pathnameArgs[3] === '') {
      throw Error(`URL is not complete: ${url}`)
    }
    return pathnameArgs[3]
  }
}

export default new GSheetsHelper()
