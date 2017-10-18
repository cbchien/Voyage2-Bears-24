import React from 'react'
import propTypes from 'prop-types'
import {
  Menu,
  Icon,
  Layout,
  Avatar,
} from '.'
const { Content } = Layout

class UserMenu extends React.PureComponent {
  static propTypes = {
    username: propTypes.string.isRequired,
  }
  static defaultProps = {
    username: 'undefined',
  }

  UserItem = () => (
    <Content style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
      <Avatar
        size="small"
        style={{ background: '#a31837', paddingLeft: '5px' }}
        icon="user"
      />
      <span style={{ marginLeft: '5px' }}>
        {this.props.username}
      </span>
    </Content>
  )
  render() {
    return (
      <Menu.SubMenu title={this.UserItem()}>
        <Menu.Item key=":logout"><Icon type="logout" /> Logout</Menu.Item>
      </Menu.SubMenu>
    )
  }
}

export default UserMenu
