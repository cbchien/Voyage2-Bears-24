import React from 'react'
import propTypes from 'prop-types'
import {
  Input,
  Modal,
} from 'antd'
import {
  bind,
  ServiceForm,
} from '../../component'

class UpdatePasswordModal extends React.Component {
  static propTypes = {
    onCancel: propTypes.func.isRequired,
    onOk: propTypes.func.isRequired,
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
        okText="Reset Password"
        cancelText="Exit"
      >
        <ServiceForm
          layout="vertical"
          onSubmit={this.props.onOk}
          itemLayout={null}
          rules={this.rules}
        >
          <Input type="hidden" ref={this.handleRef} />
          <Input name="password" placeholder="New Password" />
        </ServiceForm>
      </Modal>
    )
  }
}

export default UpdatePasswordModal
