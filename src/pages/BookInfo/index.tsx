import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  biqugeId: string
  name: string
  author: string
  cover: string
  chapter: {
    id: string
    name?: string
  }
}

const BookInfo: React.FC = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>()
  const [bookInfo, setBookInfo] = useState<any>()
  const [topBarOpacity, setTopBarOpacity] = useState<number>(0)
  const [isMenuLoaded, setIsMenuLoaded] = useState<'y' | 'n' | 'error'>('n') // 目录是否加载完毕
  const [shelfBookInfo, setShelfBookInfo] = useState<bookshelfObj>() // 书架内存储的信息，判断是否已在书架
  const [biqugeId, setBiqugeId] = useState<string>('') // 笔趣阁ID
  const [readCh, setReadCh] = useState<string|null>(null) // 首个章节id记录

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
    PubSub.subscribe('menu-loaded', (_, info) => {
      if (info.status === 'ok') {
        setIsMenuLoaded('y')
        setBiqugeId(info.biquge)
        setReadCh(info.id)
      } else {
        setIsMenuLoaded('error')
        message.error('获取章节信息失败')
      }
    })
    return () => {
      PubSub.unsubscribe('menu-loaded')
    }
  }, [])

  useEffect(() => {
    reqBookInfo(bookId!)
    // 判断是否已经在书架中
    const list: bookshelfObj[] = storage.get('BOOKSHELF_LIST') ? JSON.parse(storage.get('BOOKSHELF_LIST')!) : []
    list.some((i) => {
      if (i.id === bookId) {
        setShelfBookInfo(i)
        return true
      }
      return false
    })
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
      cover: bookInfo.cover,
      biqugeId,
      chapter: {
        id: readCh!
      }
    })
    storage.save('BOOKSHELF_LIST', list)
    setShelfBookInfo({
      id: bookId!,
      name: bookInfo.title,
      author: bookInfo.author,
      cover: bookInfo.cover,
      biqugeId,
      chapter: {
        id: readCh!
      }
    })
  }

  // 开始/继续阅读
  const handleStartRead = () => {
    if (!shelfBookInfo || (shelfBookInfo && !shelfBookInfo.chapter.name)) {
      // 无书架阅读记录，获取首章id
      navigate(`/read/${bookId}/${biqugeId}/${readCh}`)
    } else {
      // 继续阅读
      navigate(`/read/${bookId}/${biqugeId}/${shelfBookInfo.chapter.id}`)
    }
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
        <Button
          type="link"
          onClick={handleAddShelf}
          disabled={shelfBookInfo !== undefined || isMenuLoaded === 'error'}
          loading={isMenuLoaded === 'n'}
        >
          <ReadOutlined />
          {shelfBookInfo !== undefined ? '已在书架' : '加入书架'}
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          loading={isMenuLoaded === 'n'}
          disabled={isMenuLoaded === 'error'}
          onClick={handleStartRead}
        >
          {shelfBookInfo && shelfBookInfo.chapter.name ? '继续阅读' : '开始阅读'}
        </Button>
      </div>
    </Spin>
  )
}

export default BookInfo
