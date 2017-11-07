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
    username: propTypes.object.isRequired,
    visible: propTypes.bool.isRequired,
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
    return (
      <Modal
        title="Basic Modal"
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        okText="Complete"
        cancelText="Exit"
        username={this.username}
      >
        <ServiceForm
          layout="vertical"
          onSubmit={service.users.updatePassword}
          itemLayout={null}
          rules={this.rules}
          username={this.props.username}
        >
          <Input type="hidden" ref={this.handleRef} />
          <Input name="username" value={this.props.username} />
          <Input name="password" placeholder="New Password" />
          <Button
            type="primary"
            htmlType="submit"
          > Update Password
          </Button>
        </ServiceForm>
      </Modal>
    )
  }
}

export default UpdatePasswordModal
