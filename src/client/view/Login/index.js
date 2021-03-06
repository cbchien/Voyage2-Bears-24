import React from 'react'
import {
  Col,
  Layout,
  Row,
} from 'antd'
import {
  MainLayout,
  LoginBackground,
} from './../../component/index'
import LoginForm from './loginForm'

const { Content } = Layout

const Login = () => (
  <MainLayout>
    <LoginBackground />
    <Row type="flex" justify="center" align="middle" style={{ height: '100vh' }}>
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
