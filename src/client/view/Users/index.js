import React from 'react'
import {
  Button,
  Table,
  Popconfirm,
  Row,
  Col,
  Icon,
  message,
} from 'antd'

import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CommonView from '../CommonView'
import UpdatePasswordModal from './UpdatePasswordModal'
import service from '../../service'

import {
  registerPath,
  bind,
} from '../../component'

@registerPath({
  path: '/users',
  title: 'Authorized Users',
  icon: 'user',
})
class Users extends React.PureComponent {
  static propTypes = {
    userlist: propTypes.object.isRequired,
    deleteProcess: propTypes.object.isRequired,
  }
  state = {
    isModalVisible: false,
    targetUser: {},
  }
  @bind toggleModal(tempUser = '') {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      targetUser: { tempUser },
    })
  }
  @bind handleDeleteClick(username) {
    service.users.deleteUser({ username })
  }
  componentDidUpdate() {
    const { status, value } = this.props.deleteProcess
    if (value !== null) { // When value is null, do not display any message
      switch (status) {
        case 'pending': {
          this.hideMsg = message.loading(`Deleting user "${value}"...`, 0)
          break
        }
        case 'rejected': {
          this.hideMsg() // hide previous message
          message.error(`Error while deleting user: ${value}`)
          break
        }
        default: {
          this.hideMsg() // hide previous message
          message.success(`User "${value}" was deleted successfully`)
        }
      }
    }
  }
  componentDidMount() {
    service.users.fetchUsers()
  }
  render() {
    const columns = [{
      title: 'Username',
      dataIndex: 'Username',
      key: 'Username',
    }, {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      fixed: 'right',
      width: 245,
      render: record => (
        <span>
          <Button
            type="primary"
            onClick={() => this.toggleModal(record.Username)}
          >Reset Password
          </Button>
          <span className="ant-divider" />
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => this.handleDeleteClick(record.Username)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">
              <Icon type="user-delete" />Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    }]
    const { userlist, deleteProcess } = this.props

    return (
      <CommonView>
        <Row type="flex" justify="space-between">
          <Col>
            <h1>Authorized Users</h1>
          </Col>
        </Row>
        <UpdatePasswordModal
          onCancel={this.toggleModal}
          onOk={this.toggleModal}
          visible={this.state.isModalVisible}
          username={this.state.targetUser}
        />
        <Table
          rowKey="Username"
          columns={columns}
          dataSource={userlist.value}
          size="middle"
          pagination={{ total: userlist.value.length, pageSize: 10 }}
          locale={{ emptyText: 'No data' }}
          loading={
            userlist.status === 'pending' ||
            deleteProcess.status === 'pending'
          }
        />
      </CommonView>
    )
  }
}

export default withRouter(connect(
  state => ({
    userlist: state.user.userlist,
    deleteProcess: state.user.deleteProcess,
  }),
)(Users))

