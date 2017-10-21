import React from 'react'
import propTypes from 'prop-types'

class SwitchStep extends React.PureComponent {
  static propTypes = {
    step: propTypes.number.isRequired,
    children: propTypes.node.isRequired,
  }
  render() {
    return (
      React.Children.toArray(this.props.children)[this.props.step] || null
    )
  }
}

export default SwitchStep
