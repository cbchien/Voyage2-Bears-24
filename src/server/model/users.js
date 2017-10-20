const debugUser = require('debug')('api:users')

class DashboardUsers {
	constructor() {
		this.validated = null
	}

	async matchLogin(rows, username, password) {
		// rows parameter input from gsheet getRows function
		// username and password will be from client side input
		let matchCount = 0

		for (var row of rows) {
			if (row[0] === username && row[1] === password) {
				matchCount++
			} 
		}

		// return true if only one entry is matched
		if (matchCount === 1) {
			this.validated = true
			debugUser('Matching profile found for :', username)
			return true
		} else if (matchCount > 1) {
			debugUser('duplicate user entry in database')
			return false
		} else {
			return false
		}
	}

	async getUsers(rows) {
		// rows parameter input from gsheet getRows function
		var userArr = []
		for (var row of rows) {
			userArr.push(row[0])
		}
		return userArr
	}
}

module.exports = new DashboardUsers()