import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, List, Comment, Empty, Tabs, Tag, Rate, Select, message } from 'antd'
import { RightOutlined, SyncOutlined, DislikeOutlined, LikeOutlined, LoadingOutlined } from '@ant-design/icons'
import './index.less'

import { getRecommend, getBookReview } from '../../../api/book'

import { cutNumber } from '../../../utils/number'
import { ZHUISHU_IMG_URL } from '../../../config/constant'

import BookMenu from '../../../components/BookMenu'

const { TabPane } = Tabs
const { Option } = Select

interface detailProps {
  bookId: string
  title: string
  author: string
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

interface reviewObj {
  _id: string
  author: {
    _id: string
    avatar: string
    nickname: string
  }
  rating: number
  helpful: {
    total: number
    yes: number
    no: number
  }
  title: string
  content: string
  updated: string
  isUnfold? : boolean
}

const Detail: React.FC<detailProps> = (props) => {
  const navigate = useNavigate()
  const [isIntroFold, setIsIntroFold] = useState<boolean>(true)
  const [recommendBook, setRecommendBook] = useState<recommendBookObj[]>([]) // 所有推荐
  const [activeRecommendBook, setActiveRecommendBook] = useState<recommendBookObj[]>([]) // 当前显示推荐
  const [recommendIndex, setRecommendIndex] = useState<number>(0) // 下一个起始Index
  const [visible, setVisible] = useState<boolean>(false) // 控制目录
  const [reviewSort, setReviewSort] = useState<'updated' | 'created' | 'helpful' | 'comment-count'>('updated')
  const [reviewLoading, setReviewLoading] = useState<boolean>(false)
  const [reviewList, setReviewList] = useState<reviewObj[]>([])
  const [isReviewLoaded, setIsReviewLoaded] = useState<boolean>(false) // 书评是否全部加载
  const {
    bookId,
    title,
    author,
    tags,
    longIntro,
    wordCount,
    rating,
    retentionRatio,
    chaptersCount
  } = props

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

  const reqBookReview = async (book: string, sort: 'updated' | 'created' | 'helpful' | 'comment-count', start: number) => {
    setReviewLoading(true)
    const res = await getBookReview(book, sort, start)
    if (res && res.status === 200) {
      const { data } = res
      if (data.total <= reviewList.length + 10) {
        setIsReviewLoaded(true)
      }
      setReviewList((list) => [...list, ...data.reviews])
    } else {
      message.error('似乎出了一点问题...')
    }
    setReviewLoading(false)
  }

  useEffect(() => {
    setReviewList([])
    reqRecommend(bookId)
    reqBookReview(bookId, reviewSort, 0)
  }, [bookId])

  useEffect(() => {
    // 清空reviewList
    setReviewList([])
    // 查找
    reqBookReview(bookId, reviewSort, 0)
  }, [reviewSort])

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

  const handleFoldReview = (index: number) => {
    setReviewList((list) => {
      const temp: reviewObj[] = JSON.parse(JSON.stringify(list))
      temp[index].isUnfold = !temp[index].isUnfold
      return temp
    })
  }

  const handleLoadMoreReview = async () => {
    await reqBookReview(bookId, reviewSort, reviewList.length)
  }

  const reviewLoadingContent = reviewLoading
    ? (
      <span>
        <LoadingOutlined style={{ marginRight: '10px' }} />
        加载中...
      </span>
    )
    : (
      <span
        role="tab"
        tabIndex={0}
        onClick={handleLoadMoreReview}
        onKeyDown={handleLoadMoreReview}
      >
        点击加载更多
      </span>
    )

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
          {
            reviewList.length > 0
              ? (
                <div>
                  <div className="review-selector">
                    <Select defaultValue={reviewSort} onChange={(val) => { setReviewSort(val) }}>
                      <Option value="updated">默认排序</Option>
                      <Option value="created">最新发布</Option>
                      <Option value="helpful">最有帮助</Option>
                      <Option value="comment-count">最高热度</Option>
                    </Select>
                  </div>
                  <List
                    itemLayout="horizontal"
                    dataSource={reviewList}
                    renderItem={
                      (item, index) => (
                        <li>
                          <Comment
                            author={item.author.nickname}
                            avatar={ZHUISHU_IMG_URL + item.author.avatar}
                            actions={[
                              <span>
                                <LikeOutlined />
                                <span>{item.helpful.yes}</span>
                              </span>,
                              <span>
                                <DislikeOutlined />
                                <span>{item.helpful.no}</span>
                              </span>
                            ]}
                            content={(
                              <div
                                className="review-item-content"
                                style={!item.isUnfold ? {} : { display: 'block' }}
                                role="tab"
                                tabIndex={0}
                                onClick={() => handleFoldReview(index)}
                                onKeyDown={() => handleFoldReview(index)}
                              >
                                <Rate disabled defaultValue={item.rating} style={{ fontSize: '12px' }} />
                                <div>{item.content}</div>
                              </div>
                            )}
                            datetime={item.updated}
                          />
                        </li>
                      )
                    }
                  />
                  <div className="review-loadmore">
                    {!isReviewLoaded ? reviewLoadingContent : '已加载全部内容'}
                  </div>
                </div>
              )
              : <Empty />
          }
        </TabPane>
      </Tabs>

      <BookMenu
        bookId={bookId}
        title={title}
        author={author}
        isVisible={visible}
        setIsVisible={setVisible}
        width="100%"
      />
    </div>
  );
};

export default Detail
