import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Tabs, Tag, message } from 'antd'
import { RightOutlined, SyncOutlined } from '@ant-design/icons'
import './index.less'

import { getRecommend } from '../../../api/book'

import { cutNumber } from '../../../utils/number'
import { ZHUISHU_IMG_URL } from '../../../config/constant'

import BookMenu from '../../../components/BookMenu'

const { TabPane } = Tabs

interface detailProps {
  bookId: string
  title: string
  tags: string[]
  longIntro: string
  wordCount: number
  rating: {
    count: number
    score: number
    tip: string
  }
  retentionRatio: string
  chaptersCount: number
}

interface recommendBookObj {
  _id: string
  title: string
  author: string
  cover: string
}

const Detail: React.FC<detailProps> = (props) => {
  const navigate = useNavigate()
  const [isIntroFold, setIsIntroFold] = useState<boolean>(true)
  const [recommendBook, setRecommendBook] = useState<recommendBookObj[]>([]) // 所有推荐
  const [activeRecommendBook, setActiveRecommendBook] = useState<recommendBookObj[]>([]) // 当前显示推荐
  const [recommendIndex, setRecommendIndex] = useState<number>(0) // 下一个起始Index
  const [visible, setVisible] = useState<boolean>(false) // 控制目录
  const { bookId, title, tags, longIntro, wordCount, rating, retentionRatio, chaptersCount } = props

  const reqRecommend = async (id: string) => {
    const res = await getRecommend(id)
    if (res && res.status === 200) {
      const { data } = res
      // 所有推荐及当前显示推荐
      setRecommendBook(data.books)
      setActiveRecommendBook(data.books.length <= 8 ? data.books : data.books.slice(0, 8))
      setRecommendIndex(8)
    } else {
      message.error('似乎出了一点问题...')
    }
  }

  useEffect(() => {
    reqRecommend(bookId)
  }, [bookId])

  const handleRefreshRecommend = () => {
    const len: number = recommendBook.length
    const index: number = len - recommendIndex >= 8 ? recommendIndex + 8 : 8 - len + recommendIndex
    setActiveRecommendBook(len - recommendIndex >= 8
      ? recommendBook.slice(recommendIndex, recommendIndex + 8)
      : [...recommendBook.slice(recommendIndex, len), ...recommendBook.slice(0, index)])
    setRecommendIndex(index)
  }

  const handleShowMenu = () => {
    setVisible(true)
  }

  return (
    <div className="main">

      <Tabs centered size="large" defaultActiveKey="info">
        <TabPane tab="详情" key="info">
          <div className="basic-info">
            <div className="basic-info-item">
              <div className="basic-info-item-title">字数</div>
              <div className="basic-info-item-content">{`${cutNumber(wordCount)}字`}</div>
            </div>
            <div className="basic-info-item">
              <div className="basic-info-item-title">读者留存率</div>
              <div className="basic-info-item-content">{`${retentionRatio}%`}</div>
            </div>
            <div className="basic-info-item">
              <div className="basic-info-item-title">评分</div>
              <div className="basic-info-item-content" style={{ fontSize: '18px' }}>{rating.score}</div>
              <div className="basic-info-item-title" style={{ fontSize: '12px' }}>{rating.tip}</div>
            </div>
          </div>

          <div className="book-tags">
            {
              tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
            }
          </div>

          <div
            className="book-intro"
            style={isIntroFold ? {} : { display: 'block' }}
            role="tab"
            tabIndex={0}
            onClick={() => { setIsIntroFold((i) => !i) }}
            onKeyDown={() => { setIsIntroFold((i) => !i) }}
          >
            {longIntro}
          </div>

          <div
            className="menu-info"
            role="tab"
            tabIndex={0}
            onClick={handleShowMenu}
            onKeyDown={handleShowMenu}
          >
            <span className="menu-title">目录</span>
            <span style={{ color: '#999' }}>
              {`${chaptersCount}章`}
              <RightOutlined />
            </span>
          </div>

          <div className="book-recommend">
            <div className="book-recommend-main">
              <span>喜欢这本书的也喜欢</span>
              <SyncOutlined onClick={handleRefreshRecommend} />
            </div>
            <Row>
              {
                activeRecommendBook.map((i) => (
                  <Col
                    span={6}
                    key={i._id}
                    onClick={() => { navigate(`/book/${i._id}`) }}
                    style={{ padding: '10px 5px 0 5px' }}
                  >
                    <img src={ZHUISHU_IMG_URL + i.cover} alt="cover" className="book-recommend-cover" />
                    <div className="book-recommend-title">{i.title}</div>
                    <div className="book-recommend-author">{i.author}</div>
                  </Col>
                ))
              }
            </Row>
          </div>
        </TabPane>

        <TabPane tab="讨论" key="2">
          Tab 2
        </TabPane>
      </Tabs>

      <BookMenu title={title} isVisible={visible} setIsVisible={setVisible} width="100%" />
    </div>
  );
};

export default Detail
