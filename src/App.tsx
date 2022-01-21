import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import NavBar from './components/NavBar'
import Bookshelf from './pages/Bookshelf'
import Sort from './pages/Sort'

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/bookshelf" element={<Bookshelf />} />
      <Route path="/sort" element={<Sort />} />
      <Route path="*" element={<Navigate to="/bookshelf" />} />
    </Routes>

    <NavBar />
  </BrowserRouter>
)

export default App
