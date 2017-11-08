import React from 'react'
import propTypes from 'prop-types'
import {
  Input,
  Modal,
  Button,
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
    username: propTypes.object,
    visible: propTypes.bool.isRequired,
    updatePwdProcess: propTypes.string.isRequired,
  }
  static defaultProps = {
    username: {},
  }
  rules = {
    password: { required: true, label: 'New Password' },
  }
  @bind handleRef(ref) {
    if (ref && ref.refs) {
      this.orgForm = ref.refs.input.form
    }
  }
  @bind handleOnOk() {
    this.orgForm.dispatchEvent(new Event('submit'))
  }
  render() {
    const { updatePwdProcess } = this.props
    let message
    if (updatePwdProcess === 'pending') {
      message = <h4>Enter your new password</h4>
    } else if (updatePwdProcess === 'ready') {
      message = <h4 style={{ color: 'green' }}>Password successfully updated</h4>
    } else if (updatePwdProcess === 'error') {
      message = <h4>Password update error</h4>
    } else {
      message = <h4>error reading props</h4>
    }
    return (
      <Modal
        title="Basic Modal"
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        okText="Complete"
        cancelText="Exit"
      >
        <ServiceForm
          layout="vertical"
          onSubmit={service.users.updatePassword}
          itemLayout={null}
          rules={this.rules}
          username={this.props.username}
          status={this.props.updatePwdProcess}
        >
          <Input type="hidden" ref={this.handleRef} />
          <Input name="username" value={this.props.username.tempUser} readOnly />
          <Input name="password" placeholder="New Password" />
          <Button
            type="primary"
            htmlType="submit"
          > Update Password
          </Button>
          {message}
        </ServiceForm>
      </Modal>
    )
  }
}

export default UpdatePasswordModal
