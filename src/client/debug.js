const debug = (
  process.env.NODE_ENV === 'development'
    ? require('debug')
    : () => () => undefined
)
export default debug
