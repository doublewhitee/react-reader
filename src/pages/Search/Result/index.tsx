import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Empty, Spin, message } from 'antd'
import PubSub from 'pubsub-js'

import { getFuzzySearch } from '../../../api/search'

import Scroll from '../../../components/Scroll'
import BookItem from '../../../components/BookItem'

interface searchListObj {
  _id: string
  title: string
  author: string
  cover: string
  shortIntro: string
}

interface resultProps {
  setSearchText: Function
}

const Result: React.FC<resultProps> = (props) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const scrollRef = useRef<any>(null)
  const [searchList, setSearchList] = useState<searchListObj[]>([])
  const [loading, setLoading] = useState(false)
  const [isNull, setIsNull] = useState(true) // 搜索结果是否为空
  const [isPullingUp, setIsPullingUp] = useState<boolean>(false) // 上拉状态
  const [isEnd, setIsEnd] = useState<boolean>(false) // 是否加载完成

  const { setSearchText } = props

  const reqFuzzySearch = async (query: string, start: number) => {
    setLoading(true)
    const res = await getFuzzySearch(query, start)
    if (res && res.status === 200) {
      const { data } = res
      if (data.books.length > 0) {
        setSearchList((list) => [...list, ...data.books])
        setIsNull(false)
      }
      // 加载全部数据
      if (data.books.length < 20) {
        setIsEnd(true)
      }
    } else {
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
    scrollRef.current?.refresh()
  }

  useEffect(() => {
    if (searchParams.get('key')) {
      // reqFuzzySearch(searchParams.get('key')!, 0)
      PubSub.subscribe('pull-up', () => {
        setIsPullingUp(true)
      })
    } else {
      // 没有key，回到搜索主页
      navigate('/search/index')
    }
    return () => {
      // 取消订阅
      PubSub.unsubscribe('pull-up')
    }
  }, [])

  useEffect(() => {
    if (isPullingUp !== false) {
      if (!isEnd) {
        reqFuzzySearch(searchParams.get('key')!, searchList.length).then(() => {
          PubSub.publish('pull-up-finish')
        })
      } else {
        message.info('已展示所有数据')
        PubSub.publish('pull-up-finish')
      }
      setIsPullingUp(false)
    }
  }, [isPullingUp])

  useEffect(() => {
    // 重置状态
    setIsEnd(false)
    setIsNull(true)
    setSearchText(searchParams.get('key'))
    setSearchList([])
    // 回到顶部
    scrollRef.current?.scrollTo(0, 0)
    reqFuzzySearch(searchParams.get('key')!, 0)
  }, [location])

  return (
    <Spin spinning={loading} size="large" tip="加载中...">
      <div style={{ padding: '10px', height: 'calc(100vh - 42px)' }}>
        <Scroll ref={scrollRef} id="scroll" pullUp>
          {
            !isNull
              ? searchList.map((i) => (
                <BookItem
                  key={i._id}
                  _id={i._id}
                  title={i.title}
                  author={i.author}
                  cover={i.cover}
                  shortIntro={i.shortIntro}
                />
              ))
              : <Empty />
          }
        </Scroll>
      </div>
    </Spin>
  )
}

export default Result
