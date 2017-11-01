import React from 'react'
import propTypes from 'prop-types'
import {
  Form,
  Alert,
} from 'antd'

class ServiceForm extends React.Component {
  static propTypes = {
    children: propTypes.node.isRequired,
    onSubmit: propTypes.func.isRequired,
    onStateChange: propTypes.func,
    onInit: propTypes.func,
    onError: propTypes.func,
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
    onInit: () => { },
    onError: () => { },
    onStateChange: () => { },
  }
  static Alert = ({ message, type, style = {} }) => (
    message
      ? <Alert
        message={message}
        type={type}
        style={style}
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
  componentDidMount() {
    this.props.onInit({
      data: {},
      changeState: (state) => {
        this.props.onStateChange(state)
      },
      replyForm: (generalError = {}, fieldValidation = {}) => {
        if (generalError) {
          this.props.onError(generalError)
        }
        if (fieldValidation) {
          this.validate(fieldValidation, true)
        }
      },
    })
  }
  onSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    this.keys.forEach((key) => {
      this.data[key] = formData.get(key)
    })
    this.props.onSubmit({
      data: this.data,
      changeState: (state) => {
        this.props.onStateChange(state)
      },
      replyForm: (generalError = {}, fieldValidation = {}) => {
        if (generalError) {
          this.props.onError(generalError)
        }
        if (fieldValidation) {
          this.validate(fieldValidation)
        }
      },
    })
  }
  validate(fieldValidation, onInit = false) {
    const rules = { ...this.state.rules }
    this.keys.forEach((key) => {
      rules[key] = { ...rules[key] }
      if (Reflect.has(fieldValidation, key)) {
        rules[key].validateStatus = (
          fieldValidation[key].validateStatus
            ? fieldValidation[key].validateStatus
            : ''
        )
        rules[key].help = fieldValidation[key].help || rules[key].help
        rules[key].hasFeedback = true
      } else if (!onInit) {
        rules[key].validateStatus = 'success'
        rules[key].hasFeedback = true
      }
    })
    this.setState({ rules })
  }
  mapChildren() {
    const children = React.Children.map(this.props.children,
      (InputComponent) => {
        const {
          name,
          htmlType,
          type,
        } = InputComponent.props
        if (type === 'hidden') return InputComponent
        if (typeof name !== 'undefined') {
          this.data[name] = null
          this.keys.push(name)
        }
        return htmlType !== 'submit'
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
