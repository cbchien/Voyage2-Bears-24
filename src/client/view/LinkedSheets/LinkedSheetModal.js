import React from 'react'
import propTypes from 'prop-types'
import {
  Modal,
  Input,
} from 'antd'
import {
  ServiceForm,
  bind,
} from '../../component'

class LinkedSheetModal extends React.Component {
  static propTypes = {
    visible: propTypes.bool.isRequired,
    onCancel: propTypes.func.isRequired,
    onOk: propTypes.func.isRequired,
  }
  rules = {
    name: { required: true, label: 'Name' },
    url: { required: true, label: 'Spreadsheet URL' },
  }
  @bind handleRef(ref) {
    this.orgForm = ref.refs.input.form
  }
  @bind handleOnOk() {
    this.orgForm.dispatchEvent(new Event('submit'))
  }
  render() {
    const {
      visible,
      onCancel,
    } = this.props

    return (
      <Modal
        visible={visible}
        title="Link a new spreadsheet"
        okText="Add Link"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={this.handleOnOk}
      >
        <ServiceForm
          layout="vertical"
          onSubmit={this.props.onOk}
          itemLayout={null}
          rules={this.rules}
        >
          <Input type="hidden" ref={this.handleRef} />
          <Input name="name" />
          <Input name="url" />
        </ServiceForm>
      </Modal>
    )
  }
}

export default LinkedSheetModal
