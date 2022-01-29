import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.less'

const Search: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="container">
      <button type="button" onClick={handleBack}>a</button>
      Search
    </div>
  )
}

export default Search
