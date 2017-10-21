const io = require('socket.io')()
const {
  isLogged,
  isNotLogged,
  isGoogleSheets,
} = require('./utils')
const MainService = require('./main')
const LoginService = require('./login')

io.path('/api')

const namespace = {
  main: io.of('/'),
  login: io.of('/login')
    .use(isGoogleSheets())
    .use(isNotLogged),
  setup: io.of('/setup')
    .use(isGoogleSheets({ connected: false })),
  users: io.of('/users')
    .use(isLogged),
}
namespace.main.on('connection', socket => new MainService(socket))
namespace.login.on('connection', socket => new LoginService(socket))

module.exports = io
