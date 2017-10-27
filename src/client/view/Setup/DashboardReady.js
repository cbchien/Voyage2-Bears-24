import React from 'react'
import { Button } from 'antd'

class DashboardReady extends React.PureComponent {
  constructor(...rest) {
    super(...rest)
    this.state = {
      disabled: false,
      message: 'Click here to LogIn! =)',
    }
    this.onClick = this.onClick.bind(this)
  }
  onClick() {
    this.setState({
      disabled: true,
      message: 'Redirecting in 5 seconds...',
    })
    setTimeout(() => {
      location.reload(true)
    }, 5000)
  }
  render() {
    return (
      <Button
        onClick={this.onClick}
        type="dashed"
        disabled={this.state.disabled}
      >{this.state.message}
      </Button>
    )
  }
}

export default DashboardReady
