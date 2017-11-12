import React from 'react'
import {
  Button,
  Col,
  Icon,
  message,
  Popconfirm,
  Row,
  Table,
} from 'antd'

import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CommonView from '../CommonView'
import LinkedSheetModal from './LinkedSheetModal'
import service from '../../service'

import {
  registerPath,
  bind,
} from '../../component'

@registerPath({
  path: '/linkedSheets',
  title: 'Linked Sheets',
  icon: 'file-excel',
})
class LinkedSheets extends React.PureComponent {
  static propTypes = {
    linkedSheetsList: propTypes.object.isRequired,
    deleteProcess: propTypes.object.isRequired,
  }
  state = {
    isModalVisible: false,
  }
  @bind toggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    })
  }
  @bind handleOnOk() {
    this.toggleModal()
    message.success('Google Sheet Document linked successfully!')
  }
  @bind handleUnlinkClick(linkedSheetId) {
    service.linkedSheets.unlinkSheet({ linkedSheetId })
  }
  componentDidUpdate() {
    const { status, value } = this.props.deleteProcess
    if (value !== null) { // When value is null, do not display any message
      switch (status) {
        case 'pending': {
          this.hideMsg = message.loading(`Unlinking sheet "${value}"...`, 0)
          break
        }
        case 'rejected': {
          this.hideMsg() // hide previous message
          message.error(`Error while unlinking sheet: ${value}`)
          break
        }
        default: {
          this.hideMsg() // hide previous message
          message.success(`Sheet "${value}" was unlinked successfully`)
        }
      }
    }
  }
  componentDidMount() {
    service.linkedSheets.fetchLinkedSheets()
  }
  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Spreadsheet ID',
      dataIndex: 'spreadsheetId',
      key: 'spreadsheetId',
      render: id => (
        <a href={`https://docs.google.com/spreadsheets/d/${id}`}>{id}</a>
      ),
    }, {
      title: 'Action',
      dataIndex: 'spreadsheetId',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: id => (
        <Popconfirm
          title="Are you sure you want to unlink this sheet?"
          onConfirm={() => { message.success(`Unlinked ${id}`) }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger"><Icon type="close" />Unlink</Button>
        </Popconfirm>
      ),
    }]

    const { linkedSheetsList, deleteProcess } = this.props

    return (
      <CommonView>
        <Row type="flex" justify="space-between">
          <Col>
            <h1>Linked Sheets</h1>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={this.toggleModal}
            >
              <Icon type="link" />Add Link
            </Button>
            <LinkedSheetModal
              onCancel={this.toggleModal}
              onOk={this.handleOnOk}
              visible={this.state.isModalVisible}
            />
          </Col>
        </Row>
        <Table
          rowKey="spreadsheetId"
          columns={columns}
          dataSource={linkedSheetsList.value}
          pagination={{ total: linkedSheetsList.value.length, pageSize: 5 }}
          locale={{ emptyText: 'No data' }}
          loading={
            linkedSheetsList.status === 'pending' ||
            deleteProcess.status === 'pending'
          }
        />
      </CommonView>
    )
  }
}

export default withRouter(connect(
  state => ({
    linkedSheetsList: state.linkedSheets.linkedSheetsList,
    deleteProcess: state.linkedSheets.deleteProcess,
  }),
)(LinkedSheets))
