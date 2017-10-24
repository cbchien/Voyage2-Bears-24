import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Spin } from 'antd'

class MainServiceProvider extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired,
    history: propTypes.object.isRequired,
    location: propTypes.object.isRequired,
    connected: propTypes.object.isRequired,
    isLogged: propTypes.object.isRequired,
    displaySetup: propTypes.object.isRequired,
  }
  constructor(...rest) {
    super(...rest)
    this.onServiceChange()
  }
  componentDidUpdate() {
    this.onServiceChange()
  }
  onServiceChange() {
    const shouldDisplaySetup = this.props.displaySetup
    const ifLogged = this.props.isLogged
    const connectedToServices = (
      this.props.connected
        ? (
          shouldDisplaySetup.status === 'resolved' &&
          ifLogged.status === 'resolved'
        )
        : false
    )
    const currentPath = this.props.location.pathname

    if (!connectedToServices) return

    if (shouldDisplaySetup.value && currentPath !== '/setup') {
      this.props.history.push('/setup')
    } else if (!shouldDisplaySetup.value) {
      if (
        ifLogged.value &&
        (currentPath === '/setup' || currentPath === '/login')
      ) {
        this.props.history.push('/')
      } else if (
        !ifLogged.value &&
        currentPath !== '/login'
      ) {
        this.props.history.push('/login')
      }
    }
  }
  render() {
    const connectedToServices = this.props.connected.value
    return (
      <section role="main">
        {
          connectedToServices
            ? this.props.children
            : <Spin size="large" />
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
