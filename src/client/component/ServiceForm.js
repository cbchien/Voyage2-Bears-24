import React from 'react'
import propTypes from 'prop-types'
import {
  Form,
  Alert,
} from './'

class ServiceForm extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired,
    service: propTypes.func.isRequired,
    onError: propTypes.func.isRequired,
    onStateChange: propTypes.func.isRequired,
    itemLayout: propTypes.object,
    submitLayout: propTypes.object,
    layout: propTypes.string,
    rules: propTypes.object,
  }
  static defaultProps = {
    layout: 'horizontal',
    itemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    },
    submitLayout: {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 8 },
    },
    rules: {},
  }
  static Alert = ({ message, type }) => (
    message
      ? <Alert
        style={{
          marginBottom: '20px',
        }}
        message={message}
        type={type}
        showIcon
      />
      : null
  )
  constructor(...rest) {
    super(...rest)
    this.onSubmit = this.onSubmit.bind(this)
    this.data = {}
    this.keys = []
    this.state = {
      rules: this.props.rules,
    }
  }
  onSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    this.keys.forEach((key) => {
      this.data[key] = formData.get(key)
    })
    this.props.service({
      data: this.data,
      changeState: (state) => {
        this.props.onStateChange(state)
      },
      replyForm: (generalError = {}, fieldValidation = {}) => {
        if (generalError) {
          this.props.onError(generalError)
        }
        if (fieldValidation) {
          const rules = { ...this.state.rules }
          this.keys.forEach((key) => {
            rules[key] = { ...rules[key] }
            if (Reflect.has(fieldValidation, key)) {
              rules[key].validateStatus = (
                fieldValidation[key].status
                  ? fieldValidation[key].status
                  : 'error'
              )
              rules[key].help = fieldValidation[key].message
              rules[key].hasFeedback = true
            } else {
              rules[key].validateStatus = 'success'
              rules[key].hasFeedback = true
              delete rules[key].help
            }
          })

          this.setState({ rules })
        }
      },
    })
  }
  mapChildren() {
    const children = React.Children.map(this.props.children,
      (InputComponent) => {
        const name = InputComponent.props.name
        if (typeof name !== 'undefined') {
          this.data[name] = null
          this.keys.push(name)
        }
        return InputComponent.props.htmlType !== 'submit'
          ? (
            <Form.Item
              {...this.props.itemLayout}
              {...this.state.rules[name]}
            >
              {InputComponent}
            </Form.Item>
          )
          : (
            <Form.Item wrapperCol={this.props.submitLayout}>
              {InputComponent}
            </Form.Item>
          )
      },
    )
    return children
  }
  render() {
    return (
      <Form onSubmit={this.onSubmit} layout={this.props.layout}>
        {this.mapChildren()}
      </Form>
    )
  }
}

export default ServiceForm
