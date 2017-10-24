import React from 'react'
import {
  Button,
  Icon,
  Input,
} from 'antd'
import { ServiceForm } from '../../component'
import service from '../../service'

class CredentialsForm extends React.Component {
  constructor(...props) {
    super(...props)
    this.onError = this.onError.bind(this)
    this.onStateChange = this.onStateChange.bind(this)
    this.rules = {
      clientId: { label: 'Client ID', required: true },
      clientSecret: { label: 'Client Secret', required: true },
      redirectUri: { label: 'Redirect URI', required: true },
      settingsDocId: { label: 'Settings Document ID', required: true },
    }
    this.state = {
      error: {
        message: null,
        type: null,
      },
      loading: false,
    }
  }
  onError(generalError) {
    this.setState({
      error: generalError,
    })
  }
  onStateChange(state) {
    this.setState({
      loading: state === 'pending',
    })
  }
  render() {
    const { loading, error } = this.state
    return (
      <section>
        <ServiceForm.Alert key="alert" message={error.message} type={error.type} />
        <ServiceForm
          key="serviceform"
          onSubmit={service.setup.setCredentials}
          rules={this.rules}
          onError={this.onError}
          onStateChange={this.onStateChange}
        >
          <Input
            name="clientId"
            placeholder="[ID].apps.googleusercontent.com"
            readOnly={loading}
            autoComplete="off"
            prefix={<Icon type="idcard" />}
          />
          <Input
            name="clientSecret"
            placeholder="[HASH]"
            readOnly={loading}
            autoComplete="off"
            prefix={<Icon type="key" />}
          />
          <Input
            name="redirectUri"
            placeholder="urn:[resource]"
            readOnly={loading}
            autoComplete="off"
            prefix={<Icon type="link" />}
          />
          <Input
            name="settingsDocId"
            placeholder="[Google Sheets 'Settings' Document ID]"
            readOnly={loading}
            autoComplete="off"
            prefix={<Icon type="file-excel" />}
          />
          <Button
            type="primary"
            icon="upload"
            htmlType="submit"
            loading={this.state.loading}
          >
            Submit
          </Button>
        </ServiceForm>
      </section>
    )
  }
}

export default CredentialsForm
