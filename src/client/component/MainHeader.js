import React from 'react'
import propTypes from 'prop-types'
import {
  ChinguLogoHeader,
  Col,
  Layout,
  Menu,
  Row,
} from './index'

const { Header } = Layout

class MainHeader extends React.PureComponent {
  static propTypes = {
    children: propTypes.node.isRequired,
  }
  render() {
    return (
      <Header style={{ background: 'none', zIndex: 1 }}>
        <Row type="flex" justify="space-between">
          <Col span={10}>
            <ChinguLogoHeader />
          </Col>
          <Col span={14} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            >{this.props.children}</Menu>
          </Col>
        </Row>
      </Header>
    )
  }
}

export default MainHeader
