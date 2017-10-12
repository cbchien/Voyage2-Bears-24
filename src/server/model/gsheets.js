const fs = require('fs')
const path = require('path')
const google = require('googleapis')
const GoogleAuth = require('google-auth-library')
const debugSetup = require('debug')('api:gsheets:setup')
const readline = require('readline')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TOKEN_DIR = path.join(__dirname, '../../../.credentials/')
const TOKEN_PATH = path.join(TOKEN_DIR, 'token-chingu-dashboard.json')
const CLIENT_SECRET = path.join(TOKEN_DIR, 'client_secret.json')

class GoogleSheetsAPI {
  constructor() {
    try {
      fs.mkdirSync(TOKEN_DIR)
    } catch (fsErr) {
      if (fsErr.code !== 'EEXIST') {
        throw fsErr
      }
    }
    this.existClientSecret = fs.existsSync(CLIENT_SECRET)
    this.existToken = fs.existsSync(TOKEN_PATH)
    this.settingsDocID = null
    // @ts-ignore
    this.sheets = google.sheets('v4')
  }
  initialize(withToken = true) {
    try {
      this.auth = new GoogleAuth()
      this.credentials = JSON.parse(
        fs.readFileSync(CLIENT_SECRET).toString(),
      )
      this.settingsDocID = this.credentials.settings
      this.oauth2Client = new this.auth.OAuth2(
        this.credentials.client_id,
        this.credentials.client_secret,
        this.credentials.redirect_uris,
      )
      if (withToken) {
        this.oauth2Client.credentials = JSON.parse(
          fs.readFileSync(TOKEN_PATH).toString(),
        )
      }
    } catch (err) {
      throw err
    }
  }
  saveCredentials(clientId, clientSecret, redirectUri, settingsDocID) {
    try {
      fs.writeFileSync(CLIENT_SECRET, JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: redirectUri,
        settings: settingsDocID,
      }))
      this.auth = new GoogleAuth()
      this.oauth2Client = new this.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri,
      )
    } catch (error) {
      throw error
    }
  }
  generateAuthUrl() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      // @ts-ignore
      access_type: 'offline',
      scope: SCOPES,
    })
    return authUrl
  }
  getNewToken(code, readyCb) {
    this.oauth2Client.getToken(code, (codeErr, token) => {
      if (codeErr) {
        throw codeErr
      }
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))
      readyCb()
    })
  }
  async getRows(spreadsheetId, sheet) {
    return new Promise((next, fail) => {
      this.sheets.spreadsheets.values.get({
        auth: this.oauth2Client,
        range: `${sheet.title}!A1:Z`,
        spreadsheetId,
      }, (err, response) => {
        if (err) return fail(err)
        return next(response.values)
      })
    })
  }
  async getRowsByRange(spreadsheetId, sheet, range) {
    return new Promise((next, fail) => {
      this.sheets.spreadsheets.values.get({
        auth: this.oauth2Client,
        range: `${sheet.title}!${range}`,
        spreadsheetId,
      }, (err, response) => {
        if (err) return fail(err)
        return next(response.values)
      })
    })
  }
  async appendRows(spreadsheetId, sheet, rows) {
    return new Promise((next, fail) => {
      this.sheets.spreadsheets.values.append({
        auth: this.oauth2Client,
        range: `${sheet.title}`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        includeValuesInResponse: false,
        resource: {
          values: rows,
        },
        spreadsheetId,
      }, (err, response) => {
        if (err) return fail(err)
        return next(response)
      })
    })
  }
  async updateRows(spreadsheetId, sheet, range, rows) {
    return new Promise((next, fail) => {
      this.sheets.spreadsheets.values.update({
        auth: this.oauth2Client,
        range: `${sheet.title}!${range}`,
        valueInputOption: 'USER_ENTERED',
        includeValuesInResponse: false,
        resource: {
          values: rows,
        },
        spreadsheetId,
      }, (err, response) => {
        if (err) return fail(err)
        return next(response)
      })
    })
  }
  async clearRows(spreadsheetId, sheet, range) {
    return new Promise((next, fail) => {
      this.sheets.spreadsheets.values.clear({
        auth: this.oauth2Client,
        range: `${sheet.title}!${range}`,
        spreadsheetId,
      }, (err, response) => {
        if (err) return fail(err)
        return next(response)
      })
    })
  }
  async deleteRows(spreadsheetId, sheet, startIndex, endIndex) {
    return new Promise((next, fail) => {
      this.sheets.spreadsheets.batchUpdate({
        auth: this.oauth2Client,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                dimension: 'ROWS',
                sheetId: sheet.sheetId,
                startIndex: startIndex - 1,
                endIndex,
              },
            },
          }],
        },
        spreadsheetId,
      }, (err, response) => {
        if (err) return fail(err)
        return next(response)
      })
    })
  }
  async getListOfSheets(spreadsheetId) {
    return new Promise((next, fail) => this.sheets.spreadsheets.get({
      spreadsheetId,
      auth: this.oauth2Client,
    }, (err, response) => {
      if (err) return fail(err)
      return next(response.sheets.map(sheet => (
        sheet.properties
      )))
    }))
  }
  commandLineSetup(finallyCb) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    if (!this.existToken) {
      this.initialize(false)
      debugSetup('Authorize by visiting URL:', this.generateAuthUrl())
      rl.question('Enter code here:', (code) => {
        rl.close()
        this.getNewToken(code, () => {
          this.initialize()
          debugSetup('Restart the server!')
        })
      })
    } else {
      this.initialize()
      debugSetup('GoogleSheets API was initialized. :)')
      finallyCb()
    }
  }
}

module.exports = new GoogleSheetsAPI()
