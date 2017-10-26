import service from '../service'

export const bind = function bindMethod(target, method, descriptor) {
  const func = descriptor.value
  let isBound = false
  delete descriptor.value
  delete descriptor.writable
  delete descriptor.value
  descriptor.get = function get() {
    if (!isBound) {
      isBound = func.bind(this)
      Reflect.defineProperty(this, method, {
        writable: true,
        enumerable: true,
        configurable: true,
        value: isBound,
      })
      return isBound
    }
    return isBound
  }
  descriptor.set = function set(value) {
    delete this[method]
    this[method] = value
  }
}

export const registerPath = ({ path, title, icon = '' }) => (constructor) => {
  service.main.socket.on('connect', () => {
    service.main.addToSidebar({
      path,
      title,
      icon,
    })
  })
  return constructor
}
