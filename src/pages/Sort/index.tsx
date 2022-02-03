import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import TopBar from '../../components/TopBar'
import Home from './Home'
import Detail from './Detail'

const Sort: React.FC = () => (
  <div style={{ height: '100vh' }}>
    <TopBar title="分类" />

    <Routes>
      <Route path="index" element={<Home />} />
      <Route path="detail" element={<Detail />} />
      <Route path="*" element={<Navigate to="/sort/index" />} />
    </Routes>
  </div>
)

export default Sort
