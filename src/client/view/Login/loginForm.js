import React from 'react'
import {
  Button,
  ChinguLogoHeader,
  Icon,
  Input,
  ServiceForm,
} from '../../component'
import service from '../../service'

class LoginForm extends React.Component {
  constructor(...rest) {
    super(...rest)
    this.state = {
      loading: false,
      error: {
        message: null,
        type: null,
      },
    }
    this.onStateChange = this.onStateChange.bind(this)
    this.onError = this.onError.bind(this)
  }
  onStateChange(state) {
    this.setState({
      loading: state === 'pending',
    })
  }
  onError(generalError) {
    this.setState({
      error: generalError,
    })
  }
  render() {
    return (
      <section role="form">
        <ServiceForm
          onSubmit={service.login.attemptLogin}
          onStateChange={this.onStateChange}
          onError={this.onError}
          itemLayout={null}
          submitLayout={null}
        >
          <ChinguLogoHeader />
          <ServiceForm.Alert
            message={this.state.error.message}
            type={this.state.error.type}
          />
          <Input
            name="username"
            type="username"
            placeholder="Username"
            autoComplete="off"
            readOnly={this.state.loading}
            prefix={<Icon type="user" />}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="off"
            readOnly={this.state.loading}
            prefix={<Icon type="lock" />}
          />
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
            loading={this.state.loading}
          >Log in</Button>
        </ServiceForm>
      </section>
    )
  }
}

export default LoginForm
