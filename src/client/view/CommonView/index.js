import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Avatar,
  Icon,
  Layout,
  Menu,
  Spin,
} from 'antd'
import {
  MainHeader,
  MainLayout,
  bind,
} from '../../component'
import service from '../../service'
const { Content, Sider, Footer } = Layout

class CommonView extends React.PureComponent {
  static propTypes = {
    username: propTypes.object.isRequired,
    location: propTypes.object.isRequired,
    history: propTypes.object.isRequired,
    items: propTypes.array.isRequired,
    children: propTypes.node,
  }
  static defaultProps = {
    children: [''],
  }
  userItem(loading) {
    return (
      <Content style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
        <Avatar
          size="small"
          style={{ background: '#a31837', paddingLeft: '5px' }}
          icon="user"
        />
        <span style={{ marginLeft: '5px' }}>
          {
            loading
              ? <Spin size="small" />
              : this.props.username.value
          }
        </span>
      </Content>
    )
  }
  @bind handleLogoutClick(e) {
    if (e.key === ':logout') {
      service.main.logout()
    }
  }
  @bind handleItemClick(e) {
    const { history } = this.props
    history.push(e.key)
  }
  render() {
    const { username, items, location } = this.props
    const loading = username.status === 'pending'
    return (
      <MainLayout>
        <MainHeader>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            selectable={false}
            style={{
              background: 'none',
              lineHeight: '32px',
              border: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={this.handleLogoutClick}
          >
            <Menu.SubMenu title={this.userItem(loading)}>
              <Menu.Item key=":logout">
                <Icon type="logout" />Logout
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </MainHeader>
        <Content style={{
            display: 'flex',
            justifyContent: 'center',
            overflow: 'auto',
          }}
        >
          <Layout style={{
              padding: '24px 0',
              background: '#fff',
              maxWidth: 1024,
              overflow: 'auto',
              alignSelf: 'baseline',
            }}
          >
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                style={{ height: '100%' }}
                onClick={this.handleItemClick}
              >{
                items.map(item => (
                  <Menu.Item key={item.path}>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                  </Menu.Item>
                ))
              }
              </Menu>
            </Sider>
            <Content style={{
                padding: '0 24px',
                minHeight: '390px',
                minWidth: '600px',
              }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Chingu Dashboard 2017
        </Footer>
      </MainLayout>
    )
  }
}

export default withRouter(connect(
  state => ({
    username: state.main.username,
    items: state.main.sidebar,
  }),
)(CommonView))
