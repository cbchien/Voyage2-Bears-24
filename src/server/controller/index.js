const io = require('socket.io')()
const {
  isLogged,
  isNotLogged,
  isGoogleSheets,
  connectSession,
} = require('./utils')
const MainService = require('./main')
const LoginService = require('./login')
const SetupService = require('./setup')
const UsersService = require('./users')
const LinkedSheetsService = require('./linkedSheets')

io.path('/api')

const namespace = {
  main: io.of('/')
    .use(connectSession),
  login: io.of('/login')
    .use(isGoogleSheets())
    .use(isNotLogged),
  setup: io.of('/setup')
    .use(isGoogleSheets({ connected: false })),
  users: io.of('/users')
    .use(isLogged),
  linkedSheets: io.of('/linkedSheets')
    .use(isLogged),
}
namespace.main.on('connection', socket => new MainService(socket))
namespace.login.on('connection', socket => new LoginService(socket))
namespace.setup.on('connection', socket => new SetupService(socket))
namespace.users.on('connection', socket => new UsersService(socket))
namespace.linkedSheets.on('connection', socket => new LinkedSheetsService(socket))

module.exports = io
