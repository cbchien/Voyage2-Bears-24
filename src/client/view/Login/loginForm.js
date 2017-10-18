import React from 'react'
import {
  Button,
  Checkbox,
  ChinguLogoHeader,
  Form,
  Icon,
  Input,
} from '../../component'

class LoginForm extends React.Component {
  constructor(...props) {
    super(...props)
    this.state = {
      username: '',
      password: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(e) {
    const change = {}
    change[e.target.name] = e.target.value
    this.setState(change)
  }
  handleSubmit(e) {
    e.preventDefault()
    // TODO: handle submit
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit} >
        <Form.Item>
          <ChinguLogoHeader />
        </Form.Item>
        <Form.Item>
          <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} name="username" type="username" placeholder="Username" onChange={this.handleChange} value={this.state.username} />
        </Form.Item>
        <Form.Item>
          <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} name="password" type="password" placeholder="Password" onChange={this.handleChange} value={this.state.password} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }} >
            Log in
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default LoginForm
