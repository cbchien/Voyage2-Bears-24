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
    deleteProgress: pending(''),
  }

  type = {
    FETCHING_COMPLETE: Symbol('User::Fetching action done?'),
    FETCHED_USER_LIST: Symbol('User::Fetched userlist'),
    DELETE_USER_START: Symbol('User::Deleting user'),
    DELETE_USER_END: Symbol('User::Deleted user'),
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
    this.dispatchAs(this.type.DELETE_USER_START, {
      deleteProgress: 'pending',
    })
    this.askServer('deleteUser', data, (answer) => {
      if (answer.hasError) {
        this.dispatchAs(this.type.DELETE_USER_END, {
          deleteProgress: 'error',
        })
      } else {
        this.dispatchAs(this.type.DELETE_USER_END, {
          deleteProgress: 'ready',
        })
        this.fetchUsers()
      }
    })
  }

  updatePassword(data) {
    this.askServer('deleteUser', data, (answer) => {
      console.log(answer)
    })
  }
}

export default new Users()
