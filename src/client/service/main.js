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
    username: pending(''),
    sidebar: [],
  }
  type = {
    CONNECT_MAIN: Symbol('Main::Connected to /main?'),
    USER_LOGGED: Symbol('Main::Is user logged?'),
    DISPLAY_SETUP: Symbol('Main::Should display setup?'),
    SET_USERNAME: Symbol('Main::Set current username'),
    ADD_ITEM_SIDEBAR: Symbol('Main::Register Page'),
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
  setUsername(str) {
    this.dispatchAs(this.type.SET_USERNAME, {
      username: resolved(str),
    })
  }
  logout() {
    this.askServer('logout', null, () => {
      location.reload()
    })
  }
  addToSidebar({ path, title, icon }) {
    this.dispatchAs(this.type.ADD_ITEM_SIDEBAR, {
      sidebar: [...this.state.sidebar, {
        path,
        title,
        icon,
      }],
    })
  }
}

export default new Main()
