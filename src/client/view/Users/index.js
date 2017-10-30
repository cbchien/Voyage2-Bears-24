import React from 'react'
import {
  Button,
  Table,
  Popconfirm,
  Input,
  Row,
  message,
  Modal,
  Col,
  Icon,
} from 'antd'

import CommonView from '../CommonView'

import {
  registerPath,
} from '../../component'

@registerPath({
  path: '/users',
  title: 'Authorized Users',
  icon: 'user',
})

class Users extends React.PureComponent {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    })
  }
  handleOk = () => {
    this.setState({
      visible: false,
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  removeUser(user) {
    return () => {
      // TODO: actual logic for reseting password
      // Need to define client side service
      // Find and delete api for server side service
      message.success(`Removed User: ${user}`)
    }
  }

  restSetPassword(user, pwd) {
    return () => {
      // TODO: actual logic for reseting password
      // Need to define client side service
      // Find and update api for server side service
      message.success(`Updated: ${user} with new password ${pwd}`)
    }
  }

  getUsers() {
    // TODO: fetch user information
    // Need to define client side service to call gshhet getUsers()
    return () => {
      // parseUserRows() with .shift() removes title [username, password] already
      // need to chagnge the format into [{
      // Username: 'Tester1',
      // }, {
      //  Username: 'Tester2',
      // }]
    }
  }

  render() {
    // Need a client side service to talk to server side model/user getUsers()
    const authorizedUsers = [{
      Username: 'Tester1',
    }, {
      Username: 'Tester2',
    }, {
      Username: 'Tester3',
    }, {
      Username: 'Tester4',
    }]

    const columns = [{
      title: 'Username',
      dataIndex: 'Username',
      key: 'Username',
    }, {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: username => (
        <span>
          <Button type="primary" onClick={this.showModal}>Reset Password</Button>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="Done"
            cancelText="Exit"
          >
            <Input placeholder="New Password" />
            <Popconfirm title="Update this password?" onConfirm={this.restSetPassword(username)} okText="Yes" cancelText="No">
              <Button><Icon type="solution" />Reset Password</Button>
            </Popconfirm>
          </Modal>
          <span className="ant-divider" />
          <Popconfirm title="Delete this user?" onConfirm={this.removeUser(username)} okText="Yes" cancelText="No">
            <Button type="danger"><Icon type="user-delete" /> Delete </Button>
          </Popconfirm>
        </span>
      ),
    }]

    return (
      <CommonView>
        <Row type="flex" justify="space-between">
          <Col>
            <h1>Authorized Users</h1>
          </Col>
        </Row>
        <br />
        <Table rowKey="Username" columns={columns} dataSource={authorizedUsers} pagination={{ total: authorizedUsers.length, pageSize: 10 }} />
      </CommonView>
    )
  }
}

export default Users

