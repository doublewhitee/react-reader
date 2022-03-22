import React, { useEffect, useState, useRef } from 'react'
import { Tabs, Spin, Empty, message } from 'antd'
import PubSub from 'pubsub-js'
import './index.less'

import LeftBar from '../../components/LeftBar'
import Scroll from '../../components/Scroll'
import BookItem from '../../components/BookItem'

import { getRankings, getSingleRank } from '../../api/recommend'

const { TabPane } = Tabs

interface rankItem {
  _id: string
  title: string
  shortTitle: string
}

interface rankingsObj {
  male: rankItem[]
  female: rankItem[]
  epub: rankItem[]
}

interface bookObj {
  _id: string
  title: string
  author: string
  cover: string
  shortIntro: string
}

const Recommend: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [tabKey, setTabKey] = useState<string>('male')
  const [rankList, setRankingList] = useState<rankingsObj>()
  const [subRanks, setSubRanks] = useState<any>()
  const [activeRankId, setActiveRankID] = useState<string>('')
  const [bookList, setBookList] = useState<bookObj[]>()
  const [activeBookList, setActiveBookList] = useState<bookObj[]>()
  const [isPullingUp, setIsPullingUp] = useState<boolean>(false) // 上拉状态
  const [pullingUpTimer, setPullingUpTimer] = useState<any>()
  const scrollRef = useRef<any>(null)

  const reqRankings = async () => {
    setLoading(true)
    const res = await getRankings()
    if (res && res.status === 200 && res.data.ok) {
      const { data } = res
      setRankingList(data)
    } else {
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
  }

  const reqSingleRank = async (id: string) => {
    setLoading(true)
    const res = await getSingleRank(id)
    if (res && res.status === 200 && res.data.ok) {
      const { data } = res
      setBookList(data.ranking.books)
      setActiveBookList(data.ranking.books.slice(0, 10))
    } else {
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
  }

  useEffect(() => {
    reqRankings()
    PubSub.subscribe('pull-up', () => {
      setIsPullingUp(true)
    })
    return () => {
      // 取消订阅
      PubSub.unsubscribe('pull-up')
    }
  }, [])

  useEffect(() => {
    if (rankList) {
      const item: rankItem[] = (rankList as any)[tabKey]
      const r: any = {}
      item.forEach((i) => {
        r[i._id] = i.shortTitle
      })
      setSubRanks(r)
      setActiveRankID(item[0]._id)
    }
  }, [rankList, tabKey])

  useEffect(() => {
    if (activeRankId !== '') {
      reqSingleRank(activeRankId)
    }
  }, [activeRankId])

  useEffect(() => {
    if (isPullingUp) {
      setLoading(true)
      if (pullingUpTimer) {
        clearTimeout(pullingUpTimer)
      }
      setPullingUpTimer(setTimeout(() => {
        if (bookList && activeBookList && bookList.length > activeBookList!.length) {
          const l = activeBookList.length
          setActiveBookList(activeBookList.concat(bookList.slice(l, l + 10)))
        } else {
          message.info('已展示所有数据')
        }
        PubSub.publish('pull-up-finish')
        setIsPullingUp(false)
        setLoading(false)
      }, 200))
    }
  }, [isPullingUp])

  useEffect(() => {
    // 得到数据后刷新scroll重置高度
    scrollRef.current?.refresh()
  }, [activeBookList])

  const handleClickRankItem = (key: string) => {
    setActiveRankID(key)
  }

  return (
    <Spin spinning={loading} size="large" tip="加载中...">
      <Tabs activeKey={tabKey} centered onChange={(key) => setTabKey(key)}>
        <TabPane tab="男生" key="male" />
        <TabPane tab="女生" key="female" />
        <TabPane tab="出版" key="epub" />
      </Tabs>

      <div id="recommend">
        <LeftBar
          width={30}
          items={subRanks}
          current={activeRankId!}
          handleClickItem={handleClickRankItem}
        />

        <div style={{ padding: '0 10px' }}>
          <Scroll ref={scrollRef} pullUp>
            {
              activeBookList && activeBookList.length > 0
                ? (
                  activeBookList.map((i) => (
                    <BookItem
                      key={i._id}
                      _id={i._id}
                      title={i.title}
                      author={i.author}
                      cover={i.cover}
                      shortIntro={i.shortIntro}
                    />
                  ))
                )
                : <Empty />
            }
          </Scroll>
        </div>
      </div>
    </Spin>
  );
};

export default Recommend
