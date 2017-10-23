import React from 'react'
import propTypes from 'prop-types'
import {
  Menu,
  Icon,
  Button,
} from './index'

const { SubMenu } = Menu

class Sidebar extends React.PureComponent {
  static propTypes = {
    sections: propTypes.array.isRequired,
  }
  static defaultProps = {
    sections: [
      { item: 'Title1', path: '/page1' },
      { item: 'Title2', path: '/page2' },
      { item: 'Title3', path: '/page3' },
    ],
  }
  // Okay to use state here? 
  state = {
    collapsed: false,
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  SidebarItem = () => (
    // Need to use .map or sort to return elements form this.props.sections
    <Menu
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      theme="dark"
      inlineCollapsed={this.state.collapsed}
    >
      <Menu.Item key="1">
        <Icon type="pie-chart" />
        <span>Option 1</span>
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="desktop" />
        <span>Option 2</span>
      </Menu.Item>
      <Menu.Item key="3">
        <Icon type="inbox" />
        <span>Option 3</span>
      </Menu.Item>
      <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
        <Menu.Item key="5">Option 5</Menu.Item>
        <Menu.Item key="6">Option 6</Menu.Item>
        <Menu.Item key="7">Option 7</Menu.Item>
        <Menu.Item key="8">Option 8</Menu.Item>
      </SubMenu>
    </Menu>
  )

  render() {
    return (
      <div style={{ width: 240 }}>
        <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
      </div>
    )
  }
}

export default Sidebar
