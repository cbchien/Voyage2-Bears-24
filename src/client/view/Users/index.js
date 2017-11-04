import React from 'react'
import {
  Button,
  Table,
  Popconfirm,
  Row,
  Col,
  Icon,
} from 'antd'

// import propTypes from 'prop-types'
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
    // userlist: propTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
    }
  }

  componentWillMount() {
    this.displayUsers()
  }

  componentDidMount() {
    // need to re-map states to props after displayUsers() is called
  }

  displayUsers() {
    const fetchUser = service.users.fetchUsers
    return fetchUser()
  }

  @bind toggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    })
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

export default withRouter(connect(
  state => ({
    userlist: state.user.userlist,
  }),
)(Users))

