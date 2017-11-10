import React from 'react'
import propTypes from 'prop-types'
import {
  Input,
  Modal,
  message,
} from 'antd'
import {
  bind,
  ServiceForm,
} from '../../component'
import service from '../../service'

class UpdatePasswordModal extends React.Component {
  static propTypes = {
    onCancel: propTypes.func.isRequired,
    onOk: propTypes.func.isRequired,
    visible: propTypes.bool.isRequired,
    username: propTypes.object.isRequired,
  }
  state = {
    generalError: {},
    formState: null,
  }
  rules = {
    password: { required: true, label: 'Introduce new password' },
    username: { label: 'Username' },
  }
  /**
   * Create a copy of the instance of the form,
   * so we can submit the form outside of the component
   * @param {object} ref expecting instance of form
   */
  @bind handleRef(ref) {
    if (ref && ref.refs) {
      this.orgForm = ref.refs.input.form
    }
  }
  /**
   * When pressing the Modal Button, dispatch a "submit"
   * event on the form. We need this because the button in the
   * modal is outside of the form
   */
  @bind whenUpdatePassword() {
    this.orgForm.dispatchEvent(new Event('submit'))
  }
  /**
   * The Service notifies the ServiceForm that the state changed when
   * we call the changeState(state) method inside them.
   * If changeState("done!"), "done!" is the received argument here
   * @param {string} state it is passed through changeState(state) in Service
   */
  @bind whenStateChanges(state) {
    if (state === 'done!') {
      message.success('Password updated successfully')
      this.props.onOk()
      this.orgForm.password.value = ''
    } else {
      this.setState({
        formState: state,
      })
    }
  }
  /**
   * The general error is handled manually since we can choose to display it or not
   * @param {object} error an object representing the error { message, type }
   */
  @bind whenGeneralError(error) {
    this.setState({
      generalError: error,
    })
  }
  @bind clearInputOnCancel() {
    this.props.onCancel()
    this.orgForm.password.value = ''
    // this.orgForm.resetFields
  }
  render() {
    const { generalError, formState } = this.state
    return (
      <Modal
        title="Basic Modal"
        visible={this.props.visible}
        onOk={this.whenUpdatePassword}
        onCancel={this.clearInputOnCancel}
        okText="Update Password"
        cancelText="Cancel"
      >
        <ServiceForm.Alert
          message={generalError.message}
          type={generalError.type}
        />
        <ServiceForm
          onSubmit={service.users.updatePassword}
          onStateChange={this.whenStateChanges}
          onError={this.whenGeneralError}
          rules={this.rules}
          itemLayout={null}
          submitLayout={null}
        >
          <Input type="hidden" ref={this.handleRef} />
          <Input
            name="username"
            value={this.props.username.tempUser}
            readOnly
          />
          <Input
            name="password"
            type="password"
            placeholder="New Password"
            readOnly={formState === 'loading'}
          />
        </ServiceForm>
      </Modal>
    )
  }
}

export default UpdatePasswordModal
