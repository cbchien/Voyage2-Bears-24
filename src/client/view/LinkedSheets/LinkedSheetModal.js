import React from 'react'
import propTypes from 'prop-types'
import {
  Modal,
  Input,
  message,
} from 'antd'
import {
  ServiceForm,
  bind,
} from '../../component'
import service from '../../service'

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
  state = {
    generalError: {},
    formState: null,
  }
  @bind handleRef(ref) {
    if (ref && ref.refs) {
      this.orgForm = ref.refs.input.form
    }
  }
  @bind handleOnOk() {
    this.orgForm.dispatchEvent(new Event('submit'))
  }
  @bind whenStateChanges(state) {
    if (state === 'done!') {
      message.success('Sheet linked successfully!')
      this.props.onOk()
      this.orgForm.name.value = ''
      this.orgForm.url.value = ''
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
  /**
   * clear values and reset generalError state when exiting Modal
   */
  @bind clearValueWhenCancel() {
    this.props.onCancel()
    this.setState({
      generalError: {},
    })
    this.orgForm.name.value = ''
    this.orgForm.url.value = ''
  }

  render() {
    const {
      visible,
    } = this.props
    const { generalError, formState } = this.state

    return (
      <Modal
        visible={visible}
        title="Link a new spreadsheet"
        okText="Add Link"
        cancelText="Cancel"
        onCancel={this.clearValueWhenCancel}
        onOk={this.handleOnOk}
      >
        <ServiceForm.Alert
          message={generalError.message}
          type={generalError.type}
        />
        <ServiceForm
          layout="vertical"
          itemLayout={null}
          rules={this.rules}
          onSubmit={service.linkedSheets.addLinkedSheet}
          onStateChange={this.whenStateChanges}
          onError={this.whenGeneralError}

        >
          <Input type="hidden" ref={this.handleRef} />
          <Input name="name" readOnly={formState === 'loading'} />
          <Input name="url" readOnly={formState === 'loading'} />
        </ServiceForm>
      </Modal>
    )
  }
}

export default LinkedSheetModal
