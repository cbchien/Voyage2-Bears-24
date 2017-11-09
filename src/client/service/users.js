import {
  Namespace,
  pending,
  resolved,
  rejected,
  Service,
} from './utils'

@Namespace('/users')
class Users extends Service {
  state = {
    userlist: pending([]),
    deleteProcess: resolved(null),
  }
  type = {
    FETCHED_USER_LIST: Symbol('User::Fetch userlist'),
    DELETE_USER: Symbol('User::Delete user'),
  }
  async fetchUsers() {
    // Mark status of userlist as "pending"
    // { userlist: { status: "pending", value: [] } }
    this.dispatchAs(this.type.FETCHED_USER_LIST, {
      userlist: pending([]),
    })

    this.askServer('fetchUsers', null, (answer) => {
      if (answer.hasError) {
        // Mark status of userlist as "rejected"
        // { userlist: { status: "rejected", value: [] } }
        this.dispatchAs(this.type.FETCHED_USER_LIST, {
          userlist: rejected({}),
        })
      } else {
        // Mark status of userlist as resolved
        // { userlist: { status: "resolved", value: [...,{ Username }] } }
        this.dispatchAs(this.type.FETCHED_USER_LIST, {
          userlist: resolved(
            answer.users.map(Username => ({ Username })),
          ),
        })
      }
    })
  }

  deleteUser(data) {
    // Mark as { deleteProcess: { status: 'pending', value: '[USERNAME]' } }
    this.dispatchAs(this.type.DELETE_USER, {
      deleteProcess: pending(data.username),
    })
    this.askServer('deleteUser', data, (answer) => {
      if (answer.hasError) {
        // Mark as { deleteProcess: { status: 'rejected', value: '[ERROR]' } }
        this.dispatchAs(this.type.DELETE_USER, {
          deleteProcess: rejected(answer.generalError.message),
        })
      } else {
        // Mark as { deleteProcess: { status: 'resolved', value: '[USERNAME]' } }
        // At this point, Component gets updated and receives new props,
        // A message box is displayed that the user was successfully updated
        this.dispatchAs(this.type.DELETE_USER, {
          deleteProcess: resolved(data.username),
        })
        // We set to null, so Component won't display the message box again when
        // It updates the next time (this is the initial state of deleteProcess)
        this.dispatchAs(this.type.DELETE_USER, {
          deleteProcess: resolved(null),
        })
        this.fetchUsers()
      }
    })
  }

  updatePassword(form) {
    const {
      data, // Input fields' values { username, password }
      changeState, // Lets the form know the state of the service
      replyForm, // Ask the form to update fields rules or display general error
    } = form
    changeState('pending')
    replyForm(
      null, // null (because no general error)
      { // Update rules to display loading spinner [name=password]
        password: {
          validateStatus: 'validating',
          help: '',
        },
      },
    )
    this.askServer('updatePassword', data, (answer) => {
      if (answer.hasError) {
        replyForm(
          answer.generalError, // Display in ServiceForm.Alert
          answer.fieldErrors, // Display in Inputs (Done Automatically)
        )
      } else {
        changeState('done!')
      }
    })
  }
}

export default new Users()
