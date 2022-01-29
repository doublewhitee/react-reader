import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import 'normalize.css'
// antd
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

import './index.less'
import App from './App'

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>,
  document.getElementById('root')
)

// todo
document.getElementById('root')!.className = 'light'
