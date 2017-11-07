import React from 'react'
import {
  Button,
  Table,
  Popconfirm,
  Row,
  Col,
  Icon,
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
    userlist: propTypes.array,
    fetched: propTypes.object,
  }
  static defaultProps = {
    userlist: [],
    fetched: false,
  }

  constructor(...rest) {
    super(...rest)
    this.state = {
      isModalVisible: false,
    }
  }

  componentDidMount() {
    const fetchUser = service.users.fetchUsers
    fetchUser()
  }

  @bind toggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    })
  }
  render() {
    let authorizedUsers = []
    console.log(this.props)
    if (this.props.fetched.status === 'pending') {
      authorizedUsers = [{ Username: 'LOADING' }]
    } else if (this.props.fetched.status === 'resolved') {
      console.log(this.props)
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
      render: () => (
        <span>
          <Button
            type="primary"
            onClick={this.toggleModal}
          >Reset Password
          </Button>
          <span className="ant-divider" />
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => {}}
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
})

export default withRouter(connect(
  mapStateToProps,
)(Users))

