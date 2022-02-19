import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined, SearchOutlined } from '@ant-design/icons'
import './index.less'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showSearch?: boolean
  showTitle?: boolean
  iconColor?: string
}

const TopBar: React.FC<TopBarProps> = (props) => {
  const navigate = useNavigate()
  const { title, showBack, showSearch, showTitle, iconColor } = props

  const handleBack = () => {
    navigate(title === '分类' ? -2 : -1)
  }

  const handleClickSearch = () => {
    navigate('/search/index')
  }

  return (
    <div id="topBar">
      <LeftOutlined
        className="icon"
        style={{ visibility: showBack ? 'visible' : 'hidden', color: iconColor }}
        onClick={handleBack}
      />
      {
        showTitle ? <div>{title}</div> : <div />
      }
      <SearchOutlined
        className="icon"
        onClick={handleClickSearch}
        style={{ visibility: showSearch ? 'visible' : 'hidden', color: iconColor }}
      />
    </div>
  )
}

TopBar.defaultProps = {
  title: '',
  showBack: true,
  showSearch: true,
  showTitle: true,
  iconColor: '#555'
}

export default TopBar
