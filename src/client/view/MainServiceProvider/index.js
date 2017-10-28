import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { LoadingContent } from '../../component'

class MainServiceProvider extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired,
    history: propTypes.object.isRequired, // eslint-disable-line
    location: propTypes.object.isRequired, // eslint-disable-line
    connected: propTypes.object.isRequired, // eslint-disable-line
    isLogged: propTypes.object.isRequired, // eslint-disable-line
    displaySetup: propTypes.object.isRequired, // eslint-disable-line
  }
  componentWillReceiveProps(nextProps) {
    if (!this.isLocationAllowed(nextProps) && this.isConnected(nextProps)) {
      this.updateLocation(nextProps)
    }
  }
  updateLocation(props) {
    const {
      location,
      displaySetup,
      isLogged,
      history,
    } = props
    const { pathname } = location
    if (displaySetup.value && pathname !== '/setup') {
      history.push('/setup')
    } else if (!isLogged.value && pathname !== '/login') {
      history.push('/login')
    } else {
      history.push('/')
    }
  }
  isLocationAllowed(props) {
    const { displaySetup, isLogged } = props
    const { pathname } = location

    if (displaySetup.value && pathname !== '/setup') {
      return false
    } else if (!displaySetup.value) {
      if (isLogged.value && ['/setup', '/login'].includes(pathname)) {
        return false
      } else if (!isLogged.value && pathname !== '/login') {
        return false
      }
    }
    return true
  }
  isConnected(props) {
    const {
      isLogged,
      displaySetup,
      connected,
    } = props

    const status = (
      connected.value
        ? [
          isLogged,
          displaySetup,
        ].every(res => res.status === 'resolved')
        : false
    )
    return status
  }
  render() {
    return (
      <section role="main">
        {
          this.isConnected(this.props) && this.isLocationAllowed(this.props)
            ? this.props.children
            : <LoadingContent />
        }
      </section>
    )
  }
}

export default withRouter(connect(
  state => ({
    connected: state.main.connected,
    isLogged: state.main.isLogged,
    displaySetup: state.main.displaySetup,
  }),
)(MainServiceProvider))
