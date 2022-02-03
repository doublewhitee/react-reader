import React from 'react'
import { Col } from 'antd'
import './index.less'

import { ZHUISHU_IMG_URL } from '../../../../config/constant'

interface SortItemProps {
  name: string
  count: Number
  cover: string
  clickItem: () => void
}

const SortItem: React.FC<SortItemProps> = (props) => {
  const { name, count, cover, clickItem } = props

  return (
    <Col span={12} className="sort-item" onClick={clickItem}>
      <img src={ZHUISHU_IMG_URL + cover} alt="cover" className="cover" />
      <div>
        <div>{name}</div>
        <div className="count">{`${count}部`}</div>
      </div>
    </Col>
  )
}

export default SortItem
