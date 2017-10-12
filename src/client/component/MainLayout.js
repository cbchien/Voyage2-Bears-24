import React from 'react'
import propTypes from 'prop-types'
import { Layout } from './index'

class MainLayout extends React.PureComponent {
  static propTypes = {
    children: propTypes.node.isRequired,
  }
  render() {
    return (
      <Layout style={{ height: '100vh', background: '#f6f6f6' }}>
        {this.props.children}
      </Layout>
    )
  }
}

export default MainLayout
