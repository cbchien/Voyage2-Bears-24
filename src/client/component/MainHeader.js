import React from 'react'
import propTypes from 'prop-types'
import {
  Col,
  Layout,
  Row,
} from 'antd'
import {
  ChinguLogoHeader,
} from './'

const { Header } = Layout

class MainHeader extends React.PureComponent {
  static propTypes = {
    children: propTypes.node,
    title: propTypes.string,
    titleColor: propTypes.string,
  }
  static defaultProps = {
    children: null,
    title: 'Dashboard',
    titleColor: '#000',
  }
  render() {
    return (
      <Header style={{ background: 'none', zIndex: 1 }}>
        <Row type="flex" justify="space-between">
          <Col span={10}>
            <ChinguLogoHeader
              title={this.props.title}
              color={this.props.titleColor}
            />
          </Col>
          <Col span={14} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {this.props.children}
          </Col>
        </Row>
      </Header>
    )
  }
}

export default MainHeader
