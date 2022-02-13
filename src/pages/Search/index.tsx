import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './Home'
import Result from './Result'

const Search: React.FC = () => (
  <div style={{ height: '100vh' }}>
    <Routes>
      <Route path="index" element={<Home />} />
      <Route path="detail" element={<Result />} />
      <Route path="*" element={<Navigate to="/search/index" />} />
    </Routes>
  </div>
)

export default Search
