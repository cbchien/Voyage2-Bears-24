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

  fetchUsers() {
    const data = 'fetch user request'
    this.askServer('fetchUsers', data, (answer) => {
      let users = ['no user']
      if (answer.hasError) {
        // replyForm(answer.generalError)
      } else {
        this.dispatchAs(this.type.FETCHING_COMPLETE, {
          fetched: resolved(true),
        })
        users = answer.userList
        this.dispatchAs(this.type.FETCHED_USER_LIST, {
          userlist: users,
        })
      }
      return users
    })
  }
}

export default new Users()
