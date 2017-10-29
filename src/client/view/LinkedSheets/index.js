import React from 'react'
import {
  Button,
  Table,
  Popconfirm,
  message,
  Row,
  Col,
  Icon,
} from 'antd'
import CommonView from '../CommonView'
import {
  registerPath,
} from '../../component'

// Todos:
//
// Add link to actual google spreadsheet for each spreadsheet ID.
// Add actual logic for unlinking sheets.

@registerPath({
  path: '/linkedSheets',
  title: 'Linked Sheets',
  icon: 'file-excel',
})

class LinkedSheets extends React.PureComponent {
  unlinkSheet(id) {
    return () => {
      // TODO: actual logic for unlinking sheet
      message.success(`Sheet with ID ${id} unlinked.`)
    }
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
      render: text => <a href="#todo_link_to_spreadsheet">{text}</a>,
    }, {
      title: 'Action',
      dataIndex: 'spreadsheetId',
      key: 'action',
      render: id => (
        <Popconfirm title="Are you sure you want to unlink this sheet?" onConfirm={this.unlinkSheet(id)} okText="Yes" cancelText="No">
          <Button type="danger"><Icon type="close" />Unlink</Button>
        </Popconfirm>
      ),
    }]

    const linkedSheets = [{
      name: 'Voyage 1',
      spreadsheetId: '1k5b22g5j',
    }, {
      name: 'Voyage 2',
      spreadsheetId: '2k5b22g5j',
    }, {
      name: 'Voyage 3',
      spreadsheetId: '3k5b22g5j',
    }, {
      name: 'Voyage 4',
      spreadsheetId: '4k5b22g5j',
    }, {
      name: 'Voyage 5',
      spreadsheetId: '5k5b22g5j',
    }, {
      name: 'Voyage 6',
      spreadsheetId: '6k5b22g5j',
    }, {
      name: 'Voyage 7',
      spreadsheetId: '7k5b22g5j',
    }, {
      name: 'Voyage 8',
      spreadsheetId: '8k5b22g5j',
    }, {
      name: 'Voyage 9',
      spreadsheetId: '9k5b22g5j',
    }, {
      name: 'Voyage 10',
      spreadsheetId: '105b22g5j',
    }, {
      name: 'Voyage 11',
      spreadsheetId: '115b22g5j',
    }]

    return (
      <CommonView>
        {/* <Table columns={columns} dataSource={linkedSheets} pagination={{ pageSize: 5 }} /> */}
        <Row type="flex" justify="end">
          <Col>
            <Button type="primary"><Icon type="link" />Add Link</Button>
          </Col>
        </Row>
        <br />
        <Table rowKey="spreadsheetId" columns={columns} dataSource={linkedSheets} />
      </CommonView>
    )
  }
}

export default LinkedSheets
