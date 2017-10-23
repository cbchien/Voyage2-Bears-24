import React from 'react'
import propTypes from 'prop-types'

class ChinguLogoHeader extends React.PureComponent {
  static propTypes = {
    title: propTypes.string,
    color: propTypes.string,
  }
  static defaultProps = {
    title: 'Dashboard',
    color: '#000',
  }
  render() {
    return (
      <h2 style={{ display: 'flex' }}>
        <img
          src="asset/logo.png"
          alt="Chingu Logo"
          style={{ with: '32px', height: '32px', margin: 'auto 0' }}
        />
        <span
          style={{
            marginLeft: '5px',
            color: this.props.color,
          }}
        >{this.props.title}</span>
      </h2>
    )
  }
}

export default ChinguLogoHeader
