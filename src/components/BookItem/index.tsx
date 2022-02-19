import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.less'

import { ZHUISHU_IMG_URL } from '../../config/constant'

interface BookItemProps {
  _id: string
  title: string
  author: string
  cover: string
  shortIntro: string
}

const BookItem: React.FC<BookItemProps> = (props) => {
  const { _id, title, author, cover, shortIntro } = props
  const navigate = useNavigate()

  const handleClickItem = (id: string) => {
    navigate(`/book/${id}`)
  }

  return (
    <div
      className="book-item"
      key={_id}
      role="tab"
      tabIndex={0}
      onClick={() => handleClickItem(_id)}
      onKeyDown={() => handleClickItem(_id)}
    >
      <img src={ZHUISHU_IMG_URL + cover} alt="cover" className="item-cover" />
      <div className="item-info">
        <div className="item-title">{title}</div>
        <div className="item-author">{author}</div>
        <div className="item-intro">{shortIntro}</div>
      </div>
    </div>
  )
}

export default BookItem
