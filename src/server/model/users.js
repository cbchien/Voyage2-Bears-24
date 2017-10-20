const debugUser = require('debug')('api:users')
const gsheets = require('./gsheets')

class DashboardUsers {
	constructor() {
		this.validated = null
	}

	initialize() {
	}

	async matchLogin(username, password) {
		// rows parameter input from gsheet getRows function
		// username and password will be from client side input
		const settingID = gsheets.settingsDocID
		const listOfSheets = await gsheets.getListOfSheets(settingID)
		const rows = await gsheets.getRows(settingID, listOfSheets[1])
		let matchCount = 0

		for (var row of rows) {
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
		} else {
			return false
		}
	}

	async getUsers() {
		// rows parameter input from gsheet getRows function
		const settingID = gsheets.settingsDocID
		const listOfSheets = await gsheets.getListOfSheets(settingID)
		const rows = await gsheets.getRows(settingID, listOfSheets[1])
		var userArr = []
		for (var row of rows) {
			userArr.push(row[0])
		}
		return userArr
	}
}

module.exports = new DashboardUsers()