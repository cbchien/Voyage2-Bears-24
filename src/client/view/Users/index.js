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
import UpdatePasswordModal from './updatePasswordModal'
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
    userlist: propTypes.array,
    fetched: propTypes.object,
    updatePwdProcess: propTypes.object.isRequired,
  }
  static defaultProps = {
    userlist: [],
    fetched: false,
  }

  constructor(...rest) {
    super(...rest)
    this.state = {
      isModalVisible: false,
      targetUser: {},
    }
  }

  componentDidMount() {
    // maybe another function to refresh user list after five minutes?
    service.users.fetchUsers()
  }

  @bind toggleModal(tempUser) {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      // set username as tempUser
      targetUser: { tempUser },
    })
    this.props.updatePwdProcess.status = 'pending'
  }

  @bind handleDeleteClick(username) {
    service.users.deleteUser({ username })
    const hide = message.loading('Action in progress..', 0)
    // add logic to display and remove message.loading
    setTimeout(hide, 5000)
  }

  render() {
    // authorizedUsers as dataSource for ant-design table
    let authorizedUsers = []
    if (this.props.fetched.status === 'pending') {
      authorizedUsers = [{ Username: 'LOADING' }]
    } else if (this.props.fetched.status === 'resolved') {
      authorizedUsers = this.props.userlist.map(user => ({
        Username: user,
      }))
    }

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
          updatePwdProcess={this.props.updatePwdProcess.status}
        />
        <Table
          rowKey="Username"
          columns={columns}
          dataSource={authorizedUsers}
          pagination={{ total: authorizedUsers.length, pageSize: 10 }}
        />
      </CommonView>
    )
  }
}

const mapStateToProps = state => ({
  userlist: state.user.userlist.users,
  fetched: state.user.fetched,
  updatePwdProcess: state.user.updatePwdProcess,
})

export default withRouter(connect(
  mapStateToProps,
)(Users))

