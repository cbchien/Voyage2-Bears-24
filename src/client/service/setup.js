import {
  Service,
  Namespace,
} from './utils'

@Namespace('/setup')
class Setup extends Service {
  state = {
    step: 0,
    authUrl: null,
  }
  type = {
    SET_STEP: Symbol('Setup::Set step to display'),
    SET_AUTH_URL: Symbol('Setup::Set AuthURL'),
  }
  setCredentials(form) {
    const {
      data,
      replyForm,
      changeState,
    } = form
    changeState('pending')
    this.askServer('setCredentials', data, (answer) => {
      changeState('resolved')
      if (answer.hasError) {
        replyForm(answer.generalError, answer.fieldErrors)
      } else if (answer.status === 'OK!') {
        this.dispatchAs(this.type.SET_STEP, {
          step: this.state.step + 1,
        })
      }
    })
  }
  getAuthUrl(form) {
    const { replyForm, changeState } = form
    changeState('pending')
    replyForm(null, {
      url: { validateStatus: 'validating' },
    })
    this.askServer('getAuthUrl', null, (answer) => {
      replyForm(null, {
        url: { validateStatus: 'success' },
      })
      this.dispatchAs(this.type.SET_AUTH_URL, {
        authUrl: answer.url,
      })
      changeState('resolved')
    })
  }
  authorize(form) {
    const {
      data,
      replyForm,
      changeState,
    } = form
    changeState('pending')
    this.askServer('authorize', data, (answer) => {
      changeState('resolved')
      if (answer.hasError) {
        replyForm(answer.generalError, answer.fieldErrors)
      } else {
        this.dispatchAs(this.type.SET_STEP, {
          step: this.state.step + 1,
        })
      }
    })
  }
}

export default new Setup()
