import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Spin, message } from 'antd'
import './index.less'

import { useThrottle } from '../../utils'
import { getBookInfo } from '../../api/book'
import { ZHUISHU_IMG_URL } from '../../config/constant'

import TopBar from '../../components/TopBar'
import Detail from './Detail'

const BookInfo: React.FC = () => {
  const { bookId } = useParams()
  const [loading, setLoading] = useState<boolean>()
  const [bookInfo, setBookInfo] = useState<any>()
  const [topBarOpacity, setTopBarOpacity] = useState<number>(0)

  const reqBookInfo = async (id: string) => {
    setLoading(true)
    const res = await getBookInfo(id)
    if (res && res.status === 200) {
      const { data } = res
      setBookInfo(data)
    } else {
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
  }

  useEffect(() => {
    reqBookInfo(bookId!)
  }, [bookId])

  // 顶部栏渐隐渐显
  const handleScroll = useThrottle((e: any) => {
    // 获取滚动高度
    const top: number = Math.floor(e.target.scrollTop / 1.5)
    setTopBarOpacity(top > 100 ? 100 : top)
  }, 100)

  return (
    <Spin spinning={loading} size="large" tip="加载中...">
      <div style={{ height: 'calc(100vh - 60px)', overflowY: 'scroll' }} onScroll={handleScroll}>
        <TopBar showTitle={false} showSearch={false} iconColor="#fff" />
        <div className="fixed-topbar" style={{ opacity: `${topBarOpacity}%` }}>
          <TopBar title={bookInfo ? bookInfo.title : ''} showSearch={false} iconColor="#fff" />
        </div>
        <div
          className="book"
          style={{ '--BACKGROUNDIMG': `url(${bookInfo ? ZHUISHU_IMG_URL + bookInfo.cover : ''})` } as React.CSSProperties}
        >
          <img src={bookInfo ? ZHUISHU_IMG_URL + bookInfo.cover : ''} alt="cover" className="book-cover" />
          <div className="book-info">
            <div className="book-title">{bookInfo ? bookInfo.title : ''}</div>
            <div className="book-author">{bookInfo ? bookInfo.author : ''}</div>
            <div>{bookInfo ? `${bookInfo.majorCate} | ${bookInfo.minorCate}` : ''}</div>
          </div>
        </div>

        <Detail
          bookId={bookId!}
          title={bookInfo ? bookInfo.title : ''}
          tags={bookInfo ? bookInfo.tags : []}
          longIntro={bookInfo ? bookInfo.longIntro : ''}
          wordCount={bookInfo ? bookInfo.wordCount : 0}
          rating={bookInfo ? bookInfo.rating : {}}
          retentionRatio={bookInfo ? bookInfo.retentionRatio : '0'}
          chaptersCount={bookInfo ? bookInfo.chaptersCount : 0}
        />
      </div>

      <div className="bottom-bar">
        <Button type="primary" shape="round" size="large">开始阅读</Button>
      </div>
    </Spin>
  )
}

export default BookInfo
