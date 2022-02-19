import React, { useEffect } from 'react'
import { Drawer } from 'antd'

interface BookMenuProps {
  title: string
  isVisible: boolean
  setIsVisible: Function
  width?: string
}

const BookMenu: React.FC<BookMenuProps> = (props) => {
  const { title, isVisible, setIsVisible, width } = props

  useEffect(() => {
    if (isVisible) {
      console.log(title)
    }
  }, [isVisible])

  const handleCloseDrawer = () => {
    setIsVisible(false)
  }
  return (
    <Drawer
      title="章节目录"
      visible={isVisible}
      onClose={handleCloseDrawer}
      width={width}
    >
      {title}
    </Drawer>
  )
}

BookMenu.defaultProps = {
  width: '100%'
}

export default BookMenu
