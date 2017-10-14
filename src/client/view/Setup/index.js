import React from 'react'
import Layout from 'antd/es/layout'
import Icon from 'antd/es/icon'
import Steps from 'antd/es/steps'
import Menu from 'antd/es/menu'
import Avatar from 'antd/es/avatar'
import CredentialsForm from './credentialsForm'
import {
  MainLayout,
  MainHeader,
  Row,
  Col,
} from './../../component/index'
const { Sider, Content } = Layout
const { Step } = Steps

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

const Setup = () => (
  <MainLayout>
    <MainHeader>
      <Menu.SubMenu title={UserItem}>
        <Menu.Item key=":logout"><Icon type="logout" /> Logout</Menu.Item>
      </Menu.SubMenu>
    </MainHeader>
    <Row type="flex" justify="center" align="top">
      <Col xs={24} md={16} lg={12} xl={10}>
        <Content style={{ padding: '0 50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={230} style={{ background: 'none', paddingLeft: '24px' }}>
              <Steps direction="vertical" size="small" current={0}>
                <Step
                  title="Setup Credentials"
                  description="Credentials for accessing Google Sheets API."
                />
                <Step
                  title="Authorize"
                  description="Create an OAuth2 Client with the given credentials."
                />
                <Step
                  title="Provide Settings"
                  description="Provide a Google Sheets URL for Settings."
                />
                <Step
                  title="Ready!"
                  description="Setup is complete."
                />
              </Steps>
            </Sider>
            <Content style={{ padding: '0 24px' }}>
              <CredentialsForm />
            </Content>
          </Layout>
        </Content>
      </Col>
    </Row>
  </MainLayout>
)
export default Setup
