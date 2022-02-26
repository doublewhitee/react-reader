import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Spin, message } from 'antd'
import { ReadOutlined } from '@ant-design/icons'
import PubSub from 'pubsub-js'
import './index.less'

import { useThrottle } from '../../utils'
import { getBookInfo } from '../../api/book'
import storage from '../../utils/storage'
import { ZHUISHU_IMG_URL } from '../../config/constant'

import TopBar from '../../components/TopBar'
import Detail from './Detail'

interface bookshelfObj {
  id: string
  name: string
  author: string
  cover: string
  chapter?: {
    id: string
    name: string
  }
}

const BookInfo: React.FC = () => {
  const { bookId } = useParams()
  const [loading, setLoading] = useState<boolean>()
  const [bookInfo, setBookInfo] = useState<any>()
  const [topBarOpacity, setTopBarOpacity] = useState<number>(0)
  const [isMenuLoaded, setIsMenuLoaded] = useState<boolean>(false) // 目录是否加载完毕
  const [isInShelf, setIsInShelf] = useState<boolean>(false)

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
    PubSub.subscribe('menu-loaded', () => {
      setIsMenuLoaded(true)
    })
    return () => {
      PubSub.unsubscribe('menu-loaded')
    }
  }, [])

  useEffect(() => {
    setIsInShelf(false)
    reqBookInfo(bookId!)
    // 判断是否已经在书架中
    const list: bookshelfObj[] = storage.get('BOOKSHELF_LIST') ? JSON.parse(storage.get('BOOKSHELF_LIST')!) : []
    if (list.some((i) => i.id === bookId)) {
      setIsInShelf(true)
    }
  }, [bookId])

  // 顶部栏渐隐渐显
  const handleScroll = useThrottle((e: any) => {
    // 获取滚动高度
    const top: number = Math.floor(e.target.scrollTop / 1.5)
    setTopBarOpacity(top > 100 ? 100 : top)
  }, 100)

  // 加入书架
  const handleAddShelf = () => {
    const list: bookshelfObj[] = storage.get('BOOKSHELF_LIST') ? JSON.parse(storage.get('BOOKSHELF_LIST')!) : []
    list.unshift({
      id: bookId!,
      name: bookInfo.title,
      author: bookInfo.author,
      cover: bookInfo.cover
    })
    storage.save('BOOKSHELF_LIST', list)
    setIsInShelf(true)
  }

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
          author={bookInfo ? bookInfo.author : ''}
          tags={bookInfo ? bookInfo.tags : []}
          longIntro={bookInfo ? bookInfo.longIntro : ''}
          wordCount={bookInfo ? bookInfo.wordCount : 0}
          rating={bookInfo ? bookInfo.rating : {}}
          retentionRatio={bookInfo ? bookInfo.retentionRatio : '0'}
          chaptersCount={bookInfo ? bookInfo.chaptersCount : 0}
        />
      </div>

      <div className="bottom-bar">
        <Button type="link" onClick={handleAddShelf} disabled={isInShelf}>
          <ReadOutlined />
          {isInShelf ? '已在书架' : '加入书架'}
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          loading={!isMenuLoaded}
        >
          开始阅读
        </Button>
      </div>
    </Spin>
  )
}

export default BookInfo
