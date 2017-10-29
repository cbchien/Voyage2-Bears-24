import React from 'react'
import {
  Button,
  Modal,
  message,
  Form,
  Input,
  Icon,
} from 'antd'
import GSheetsHelper from '../../helper/gsheets'
const FormItem = Form.Item

const AddLinkedSheetForm = Form.create()(
  (props) => {
    const {
      visible,
      onCancel,
      onCreate,
      form,
    } = props
    const { getFieldDecorator } = form

    const googleSheetRegex = /^(https:\/\/|http:\/\/)(docs.google.com\/spreadsheets\/d\/)([^/]+).*$/i

    return (
      <Modal
        visible={visible}
        title="Link a new spreadsheet"
        okText="Add Link"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: 'Name of spreadsheet required!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem label="Spreadsheet URL">
            {getFieldDecorator('url', {
              rules: [{
                required: true,
                whitespace: true,
                pattern: googleSheetRegex,
                message: 'Please enter a valid Google Sheets URL!',
              }],
            })(
              <Input />,
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  },
)

class AddLinkedSheetModal extends React.PureComponent {
  state = {
    visible: false,
  }
  showModal = () => {
    this.setState({ visible: true })
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  handleCreate = () => {
    const { form } = this
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      // TODO:
      // Submit spreadsheet name and ID.
      const { name, url } = values
      const spreadsheetId = GSheetsHelper.getSheetIdFromUrl(url)
      message.success(`Name: ${name}, ID: ${spreadsheetId}`)
      form.resetFields()
      this.setState({ visible: false })
    })
  }
  linkSheetFormRef = (form) => {
    this.form = form
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}><Icon type="link" />Add Link</Button>
        <AddLinkedSheetForm
          ref={this.linkSheetFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    )
  }
}

export default AddLinkedSheetModal
