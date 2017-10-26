import React from 'react'
import CommonView from '../CommonView'
import {
  registerPath,
} from '../../component'

@registerPath({
  path: '/',
  title: 'Overview',
  icon: 'home',
})
class Home extends React.PureComponent {
  render() {
    return (
      <CommonView>
        Home Page!
      </CommonView>
    )
  }
}

export default Home
