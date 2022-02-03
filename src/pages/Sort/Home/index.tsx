import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spin, Row, message } from 'antd'
import './index.less'

import LeftBar from '../../../components/LeftBar'
import SortItem from './SortItem'
import Scroll from '../../../components/Scroll'

import { getCate } from '../../../api/sort'

interface cateDataObj {
  name: string
  bookCount: number
  bookCover: string[]
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [cateData, setCateData] = useState(null)
  const [active, setActive] = useState<string>('male')
  const [loading, setLoading] = useState<boolean>(true)
  const [total, setTotal] = useState<number>(0)
  const scrollRef = useRef<any>(null)

  const reqCate = async () => {
    const res = await getCate()
    if (res && res.status === 200) {
      const { data } = res
      setCateData(data)
      let sum: number = 0
      if (data) {
        (data[active] as cateDataObj[]).forEach((i) => {
          sum += i.bookCount
        })
      }
      setTotal(sum)
      scrollRef.current?.refresh()
    } else {
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
  }

  useEffect(() => {
    reqCate()
  }, [])

  const updateActiveItem = (item: string) => {
    if (active !== item) {
      setActive(item)
      scrollRef.current?.scrollTo(0, 0)
    }
    let sum: number = 0
    if (cateData) {
      (cateData[item] as cateDataObj[]).forEach((i) => {
        sum += i.bookCount
      })
    }
    setTotal(sum)
  }

  const handleClickSortItem = () => {
    navigate('/sort/detail')
  }

  return (
    <Spin spinning={loading} size="large" tip="加载中...">
      <div id="sort">
        <LeftBar
          width={30}
          items={{ male: '男生', female: '女生', press: '出版' }}
          current={active}
          handleClickItem={updateActiveItem}
        />

        <Scroll ref={scrollRef}>
          <div>
            <div className="total">{`共${total}部`}</div>
            <Row>
              {
                (cateData ? cateData[active] as cateDataObj[] : []).map((i) => (
                  <SortItem
                    name={i.name}
                    count={i.bookCount}
                    cover={i.bookCover[0]}
                    key={i.name}
                    clickItem={handleClickSortItem}
                  />
                ))
              }
            </Row>
          </div>
        </Scroll>
      </div>
    </Spin>
  )
}

export default Home
