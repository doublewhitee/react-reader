import React from 'react'
import './index.less'

interface LeftBarProps {
  width?: number
  items?: { [key: string]: string }
  current: string
  handleClickItem: Function
}

const LeftBar: React.FC<LeftBarProps> = (props) => {
  const { width, items, current, handleClickItem } = props

  return (
    <div id="left-bar" style={{ width: `${width}%` }}>
      {
        Object.keys(items!).map((i) => (
          <div
            key={i}
            className={current === i ? 'item active' : 'item'}
            role="tab"
            tabIndex={0}
            onClick={() => handleClickItem(i)}
            onKeyDown={() => handleClickItem(i)}
          >
            {items ? items[i] : ''}
          </div>
        ))
      }
    </div>
  )
}

LeftBar.defaultProps = {
  width: 40, // percentage
  items: {}
}

export default LeftBar
