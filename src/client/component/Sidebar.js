import React from 'react'
import propTypes from 'prop-types'
import {
  Menu,
  Icon,
  Button,
} from './index'

class Sidebar extends React.PureComponent {
  static propTypes = {
    sections: propTypes.array.isRequired,
    defaultSelectedKeys: propTypes.array.isRequired,
  }
  static defaultProps = {
    sections: [
      { item: 'Title1', path: '/page1' },
      { item: 'Title2', path: '/page2' },
      { item: 'Title3', path: '/page3' },
      { item: 'Title4', path: '/page4' },
    ],
    defaultSelectedKeys: ['1'],
  }

  state = {
    collapsed: false,
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }


  render() {
    const list = this.props.sections.map(element =>
      (<Menu.Item key={element.path}>
        <Icon type="desktop" />
        <span><a href={element.path}>{element.item}</a></span>
      </Menu.Item>),
    )
    return (
      <div style={{ width: 240, float: 'left', position: 'absolute' }}>
        <Button type="primary" onClick={this.toggleCollapsed} style={{ margin: '10px 0px 2px 10px' }}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <Menu
          defaultSelectedKeys={this.props.defaultSelectedKeys}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
        >
          { list }
        </Menu>
      </div>
    )
  }
}

export default Sidebar
