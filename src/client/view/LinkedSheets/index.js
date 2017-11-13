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
          this.hideMsg = message.loading(`Unlinking sheet "${value.linkedSheetId}"...`, 0)
          break
        }
        case 'rejected': {
          this.hideMsg() // hide previous message
          message.error(`Error while unlinking sheet: ${value.linkedSheetId}`)
          break
        }
        default: {
          this.hideMsg() // hide previous message
          message.success(`Sheet "${value.linkedSheetId}" was unlinked successfully`)
        }
      }
    }
  }
  componentDidMount() {
    if (this.props.linkedSheetsList.status === 'pending') {
      service.linkedSheets.fetchLinkedSheets()
    }
  }
  render() {
    // dataIndex needs to match server service respond JSON field ID
    const columns = [{
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    }, {
      title: 'Spreadsheet ID',
      dataIndex: 'SpreadsheetID',
      key: 'SpreadsheetID',
      render: id => (
        <a href={`https://docs.google.com/spreadsheets/d/${id}`}>{id}</a>
      ),
    }, {
      title: 'Action',
      dataIndex: 'SpreadsheetID',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: record => (
        <Popconfirm
          title="Are you sure you want to unlink this sheet?"
          onConfirm={() => this.handleUnlinkClick(record)}
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
          rowKey="SpreadsheetID"
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
    linkedSheetsList: state.linkedSheets.showAll,
    deleteProcess: state.linkedSheets.deleteProcess,
  }),
)(LinkedSheets))
