import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import service from '../../service'
import {
  Input,
  Button,
  // Icon,
  ServiceForm,
} from '../../component'

class AuthorizeForm extends React.Component {
  static propTypes = {
    url: propTypes.string,
  }
  static defaultProps = {
    url: null,
  }
  constructor(...props) {
    super(...props)
    this.state = {
      loading: false,
      error: {
        message: null,
        type: null,
      },
    }
    this.rules = {
      url: {
        label: 'URL',
        help: 'Visit the provided URL',
      },
      code: {
        label: 'Code',
        help: 'Copy/paste the access code',
        required: true,
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
      error: {
        message: generalError,
        type: 'error',
      },
    })
  }
  render() {
    const loading = this.state.loading
    const error = this.state.error
    return (
      <section>
        <ServiceForm.Alert key="alert" message={error.message} type={error.type} />
        <ServiceForm
          onInit={service.setup.getAuthUrl}
          onSubmit={service.setup.authorize}
          onStateChange={this.onStateChange}
          onError={this.onError}
          rules={this.rules}
        >
          <Input
            name="url"
            placeholder="Generating URL..."
            value={this.props.url}
            readOnly
          />
          <Input
            name="code"
            autoComplete="disable"
          />
          <Button
            type="primary"
            icon="upload"
            htmlType="submit"
            loading={loading}
          >
            Submit
          </Button>
        </ServiceForm>
      </section>
    )
  }
}

export default connect(
  state => ({ url: state.setup.authUrl }),
)(AuthorizeForm)
