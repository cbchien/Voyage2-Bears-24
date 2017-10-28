import React from 'react'
import {
  Spin,
  Row,
  Col,
  Card,
} from 'antd'
import {
  LoginBackground,
  MainLayout,
} from '.'

const LoadingContent = () => (
  <MainLayout>
    <LoginBackground />
    <Row type="flex" justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={6} sm={3} md={2}>
        <Card style={{ textAlign: 'center' }}>
          <Spin size="large" />
        </Card>
      </Col>
    </Row>
  </MainLayout>
)

export default LoadingContent
