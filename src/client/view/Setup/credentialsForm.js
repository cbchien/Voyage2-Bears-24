import React from 'react'
import Form from 'antd/es/form'
import Icon from 'antd/es/icon'
import Input from 'antd/es/input'
import Button from 'antd/es/button'

class CredentialsForm extends React.Component {
  constructor(...props) {
    super(...props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit() {
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          validateStatus="error"
          help="Oh no!"
          hasFeedback
          required
        >
          <Input prefix={<Icon type="api" />} placeholder="Project ID" />
        </Form.Item>
        <Form.Item>
          <Input prefix={<Icon type="idcard" />} placeholder="Client ID" />
        </Form.Item>
        <Form.Item>
          <Input prefix={<Icon type="key" />} placeholder="Client Secret" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon="upload">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default CredentialsForm
