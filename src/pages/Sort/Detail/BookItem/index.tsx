import React from 'react'
import './index.less'

import { ZHUISHU_IMG_URL } from '../../../../config/constant'

interface BookItemProps {
  _id: string
  title: string
  author: string
  cover: string
  shortIntro: string
}

const BookItem: React.FC<BookItemProps> = (props) => {
  const { _id, title, author, cover, shortIntro } = props

  return (
    <div className="book-item" key={_id}>
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
