import React from 'react'
import CommonView from '../CommonView'
import {
  registerPath,
} from '../../component'

@registerPath({
  path: '/linkedSheets',
  title: 'Linked Sheets',
  icon: 'file-excel',
})
class LinkedSheets extends React.PureComponent {
  render() {
    return (
      <CommonView>
        LinkedSheets Page!
      </CommonView>
    )
  }
}

export default LinkedSheets
