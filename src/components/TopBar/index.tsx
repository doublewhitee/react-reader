import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined, SearchOutlined } from '@ant-design/icons'
import './index.less'

interface TopBarProps {
  title: string
  showBack?: boolean
}

const TopBar: React.FC<TopBarProps> = (props) => {
  const navigate = useNavigate()
  const { title, showBack } = props

  const handleBack = () => {
    navigate(-2)
  }

  const handleClickSearch = () => {
    navigate('/search')
  }

  return (
    <div id="topBar">
      <LeftOutlined className="icon" style={{ visibility: showBack ? 'visible' : 'hidden' }} onClick={handleBack} />
      <div>{title}</div>
      <SearchOutlined className="icon" onClick={handleClickSearch} />
    </div>
  )
}

TopBar.defaultProps = {
  showBack: true
}

export default TopBar
