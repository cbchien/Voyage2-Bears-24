const io = require('socket.io')()
const { isLogged, isNotLogged } = require('./utils')
const MainService = require('./main')

io.path('/api')

const namespace = {
  main: io.of('/'),
  login: io.of('/login').use(isNotLogged),
  setup: io.of('/setup').use(isLogged),
}
namespace.main.on('connection', socket => new MainService(socket))

module.exports = io
