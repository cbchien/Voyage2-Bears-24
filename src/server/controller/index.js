const io = require('socket.io')()
const {
  isLogged,
  isNotLogged,
  isGoogleSheets,
} = require('./utils')
const MainService = require('./main')

io.path('/api')

const namespace = {
  main: io.of('/')
    .use(isGoogleSheets()),
  login: io.of('/login')
    .use(isGoogleSheets())
    .use(isNotLogged),
  setup: io.of('/setup')
    .use(isGoogleSheets({ connected: false })),
  users: io.of('/users')
    .use(isLogged),
}
namespace.main.on('connection', socket => new MainService(socket))

module.exports = io
