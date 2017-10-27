import React from 'react'
import { Layout } from 'antd'

const LoginBackground = () => (
  <Layout
    style={{
      background: 'url(/asset/login-bg.jpg) no-repeat center center',
      backgroundSize: 'cover',
      width: '100%',
      height: '100%',
      filter: 'brightness(30%)',
      zIndex: 0,
      position: 'absolute',
    }}
  />
)

export default LoginBackground
