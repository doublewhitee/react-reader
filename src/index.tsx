import React from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
// antd
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import './index.less'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// todo
document.getElementById('root')!.className = 'light'
