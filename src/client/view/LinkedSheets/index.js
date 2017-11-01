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
import CommonView from '../CommonView'
import LinkedSheetModal from './LinkedSheetModal'
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
      render: () => (
        <Popconfirm
          title="Are you sure you want to unlink this sheet?"
          onConfirm={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger"><Icon type="close" />Unlink</Button>
        </Popconfirm>
      ),
    }]

    // linkedSheets contains dummy data that should be replaced later.
    const linkedSheets = [{
      name: 'spreadsheet 1',
      spreadsheetId: '1dl2dX4K-CuospT5rHtK-GSr_dAOmVijz4k4aM750Ipg',
    }, {
      name: 'spreadsheet 2',
      spreadsheetId: '1h4FhfXt1m2LfVS13YJuOWd9jSUu_xz5r-eFCwtzekhg',
    }, {
      name: 'spreadsheet 3',
      spreadsheetId: '1_UMy96CeGkCrF5cNMA1cxLVP-E_xCV_Q-tZpziugf_g',
    }, {
      name: 'Voyage 4',
      spreadsheetId: '4xxxxxxxxx',
    }, {
      name: 'Voyage 5',
      spreadsheetId: '5xxxxxxxxx',
    }, {
      name: 'Voyage 6',
      spreadsheetId: '6xxxxxxxxx',
    }, {
      name: 'Voyage 7',
      spreadsheetId: '7xxxxxxxxx',
    }, {
      name: 'Voyage 8',
      spreadsheetId: '8xxxxxxxxx',
    }, {
      name: 'Voyage 9',
      spreadsheetId: '9xxxxxxxxx',
    }, {
      name: 'Voyage 10',
      spreadsheetId: '10xxxxxxxx',
    }, {
      name: 'Voyage 11',
      spreadsheetId: '11xxxxxxxx',
    }]

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
          dataSource={linkedSheets}
          pagination={{ total: linkedSheets.length, pageSize: 5 }}
        />
      </CommonView>
    )
  }
}

export default LinkedSheets
