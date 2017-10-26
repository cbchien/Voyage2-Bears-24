import React from 'react'
import CommonView from '../CommonView'
import {
  registerPath,
} from '../../component'

@registerPath({
  path: '/workflows',
  title: 'Workflows',
  icon: 'database',
})
class Workflows extends React.PureComponent {
  render() {
    return (
      <CommonView>
        Workflows Page!
      </CommonView>
    )
  }
}

export default Workflows
