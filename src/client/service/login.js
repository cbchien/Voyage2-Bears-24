import { Namespace, Service } from './utils'

@Namespace('/login')
class Login extends Service {
  attemptLogin({ changeState, replyForm, data }) {
    changeState('pending')
    this.askServer('login', data, (answer) => {
      changeState('resolved')
      if (answer.hasError) {
        replyForm(answer.generalError, answer.fieldErrors)
      } else {
        location.reload()
      }
    })
  }
}

export default new Login()
