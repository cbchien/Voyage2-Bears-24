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
    deleteProcess: pending(''),
    updatePwdProcess: pending(''),
  }

  type = {
    FETCHING_COMPLETE: Symbol('User::Fetching action done?'),
    FETCHED_USER_LIST: Symbol('User::Fetched userlist'),
    DELETE_USER_START: Symbol('User::Deleting user'),
    DELETE_USER_END: Symbol('User::Deleted user'),
    UPDATE_PASSWORD_START: Symbol('User::Updating user password'),
    UPDATE_PASSWORD_END: Symbol('User::Updated user password status?'),
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
      deleteProcess: 'pending',
    })
    this.askServer('deleteUser', data, (answer) => {
      if (answer.hasError) {
        this.dispatchAs(this.type.DELETE_USER_END, {
          deleteProcess: 'error',
        })
      } else {
        this.dispatchAs(this.type.DELETE_USER_END, {
          deleteProcess: 'ready',
        })
        this.fetchUsers()
      }
    })
  }

  updatePassword(data) {
    // need to have ways of changeState for letting user know when th action is complete
    this.dispatchAs(this.type.UPDATE_PASSWORD_START, {
      updatePwdProcess: {
        status: 'pending',
      },
    })
    this.askServer('updatePassword', data, (answer) => {
      if (answer.hasError) {
        this.dispatchAs(this.type.UPDATE_PASSWORD_END, {
          updatePwdProcess: {
            status: 'error',
          },
        })
      } else {
        this.dispatchAs(this.type.UPDATE_PASSWORD_END, {
          updatePwdProcess: {
            status: 'ready',
          },
        })
      }
    })
  }
}

export default new Users()
