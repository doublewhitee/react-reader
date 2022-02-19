import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './pages/Layout'
import Search from './pages/Search'
import BookInfo from './pages/BookInfo'

const App: React.FC = () => (
  <div>
    <Routes>
      <Route path="search/*" element={<Search />} />
      <Route path="book/:bookId" element={<BookInfo />} />
      <Route path="*" element={<Layout />} />
    </Routes>
  </div>
)

export default App
