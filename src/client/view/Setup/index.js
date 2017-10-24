import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Col,
  Layout,
  Row,
} from 'antd'
import {
  ChinguLogoHeader,
  LoginBackground,
  MainLayout,
  SwitchStep,
} from './../../component'

import SetupSteps from './SetupSteps'
import CredentialsForm from './CredentialsForm'
import AuthorizeForm from './AuthorizeForm'
import DashboardReady from './DashboardReady'

const { Content, Sider } = Layout

class Setup extends React.PureComponent {
  static propTypes = {
    step: propTypes.number.isRequired,
  }
  render() {
    return (
      <MainLayout>
        <LoginBackground />
        <Row type="flex" justify="center" align="middle" style={{ height: '100vh' }}>
          <Col xs={24} md={16} lg={12} xl={10}>
            <Content style={{ padding: '0 50px' }}>
              <Layout
                style={{
                  background: '#fff',
                  paddingLeft: '20px',
                  paddingTop: '20px',
                }}
              >
                <ChinguLogoHeader key="logo" title="Dashboard Setup" />
              </Layout>
              <Layout style={{ padding: '24px 0', background: '#fff' }}>
                <Sider width={230} style={{ background: 'none', paddingLeft: '24px' }}>
                  <SetupSteps current={this.props.step} />
                </Sider>
                <Content style={{ padding: '0 24px' }}>
                  <SwitchStep step={this.props.step}>
                    <CredentialsForm />
                    <AuthorizeForm />
                    <DashboardReady />
                  </SwitchStep>
                </Content>
              </Layout>
            </Content>
          </Col>
        </Row>
      </MainLayout>
    )
  }
}

export default connect(
  state => ({ step: state.setup.step }),
)(Setup)
