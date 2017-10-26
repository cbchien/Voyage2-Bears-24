import React from 'react'
import CommonView from '../CommonView'
import {
  registerPath,
} from '../../component'

@registerPath({
  path: '/settings',
  title: 'Settings',
  icon: 'setting',
})
class Settings extends React.PureComponent {
  render() {
    return (
      <CommonView>
        Settings Page
      </CommonView>
    )
  }
}

export default Settings
