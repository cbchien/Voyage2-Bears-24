import {
  Service,
  Namespace,
  pending,
  resolved,
} from './utils'

@Namespace('/')
class Main extends Service {
  state = {
    connected: pending(false),
    isLogged: pending(false),
    displaySetup: pending(false),
  }
  type = {
    CONNECT_MAIN: Symbol('CONNECT_MAIN'),
    USER_LOGGED: Symbol('USER_LOGGED'),
    DISPLAY_SETUP: Symbol('DISPLAY_SETUP'),
  }
  connection() {
    this.dispatchAs(this.type.CONNECT_MAIN, {
      connected: resolved(true),
    })
  }
  isLogged(bool) {
    this.dispatchAs(this.type.USER_LOGGED, {
      isLogged: resolved(bool),
    })
  }
  displaySetup(bool) {
    this.dispatchAs(this.type.DISPLAY_SETUP, {
      displaySetup: resolved(bool),
    })
  }
}

export default new Main()
