import React from 'react'
import propTypes from 'prop-types'
import { Steps } from 'antd'
const { Step } = Steps

class SetupSteps extends React.PureComponent {
  static propTypes = {
    current: propTypes.number.isRequired,
  }
  render() {
    return (
      <Steps direction="vertical" size="small" current={this.props.current}>
        <Step
          title="Setup Credentials"
          description="Credentials for accessing Google Sheets API."
        />
        <Step
          title="Authorize"
          description="Create an OAuth2 Client with the given credentials."
        />
        <Step
          title="Ready!"
          description="Setup is complete."
        />
      </Steps>
    )
  }
}

export default SetupSteps
