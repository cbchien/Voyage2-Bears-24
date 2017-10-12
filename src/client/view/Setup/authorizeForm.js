import React from 'react'
import Form from 'antd/es/form'
import Input from 'antd/es/input'
import Button from 'antd/es/button'
import Card from 'antd/es/card'
import Icon from 'antd/es/icon'

class AuthorizeForm extends React.Component {
  constructor(...props) {
    super(...props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit() {

  }
  render() {
    return ([
      <Card>
        <a href="/">Visit this URL to get an access code</a>
      </Card>,
      <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
        <Form.Item>
          <Input prefix={<Icon type="key" />} placeholder="Authorization Code" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon="upload">
            Submit
          </Button>
        </Form.Item>
      </Form>,
    ])
  }
}

export default AuthorizeForm
