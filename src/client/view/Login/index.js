import React from 'react'
import Layout from 'antd/es/layout'
import Icon from 'antd/es/icon'
import Menu from 'antd/es/menu'
import Avatar from 'antd/es/avatar'
import LoginForm from './loginForm'
import {
  MainLayout,
  MainHeader,
  Row,
  Col,
} from './../../component/index'
const { Content } = Layout

const UserItem = (
  <Content style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
    <Avatar
      size="small"
      style={{ background: '#a31837', paddingLeft: '5px' }}
      icon="user"
    />
    <span style={{ marginLeft: '5px' }}>
      eddyw
    </span>
  </Content>
)

const Login = () => (
  <MainLayout>
    <MainHeader>
      <Menu.SubMenu title={UserItem}>
        <Menu.Item key=":logout"><Icon type="logout" /> Logout</Menu.Item>
      </Menu.SubMenu>
    </MainHeader>
    <Row type="flex" justify="center" align="top">
      <Col xs={24} sm={12} md={10} lg={8} xl={6}>
        <Content style={{ padding: '0 50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Content style={{ padding: '0 24px' }}>
              <LoginForm />
            </Content>
          </Layout>
        </Content>
      </Col>
    </Row>
  </MainLayout>
)
export default Login
