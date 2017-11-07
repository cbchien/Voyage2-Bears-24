import {
  Namespace,
  pending,
  resolved,
  Service,
} from './utils'

@Namespace('/users')
class Users extends Service {
  state = {
    fetched: pending(false),
    userlist: pending(''),
  }

  type = {
    FETCHING_COMPLETE: Symbol('User::Fetching action done?'),
    FETCHED_USER_LIST: Symbol('User::Fetched userlist'),
  }

  async fetchUsers() {
    const data = 'fetch user request'
    this.askServer('fetchUsers', data, (answer) => {
      let users = ['no user']
      if (answer.hasError) {
        // replyForm(answer.generalError)
      } else {
        this.dispatchAs(this.type.FETCHING_COMPLETE, {
          fetched: resolved(true),
        })
        users = answer
        this.dispatchAs(this.type.FETCHED_USER_LIST, {
          userlist: users,
          fetched: resolved(true),
        })
      }
      return users
    })
  }

  deleteUser(data) {
    this.askServer('deleteUser', data, (answer) => {
      if (answer.hasError) {
        // some cb to display message
      } else {
        this.fetchUsers()
      }
    })
  }
}

export default new Users()
