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

interface HomeProps {
  active: string
  setActive: React.Dispatch<React.SetStateAction<string>>
}

const Home: React.FC<HomeProps> = (props) => {
  const navigate = useNavigate()
  const [cateData, setCateData] = useState(null)
  const [activeData, setActiveData] = useState(null)
  // const [active, setActive] = useState<string>('male')
  const [loading, setLoading] = useState<boolean>(true)
  const [total, setTotal] = useState<number>(0)
  const scrollRef = useRef<any>(null)

  const { active, setActive } = props

  const reqCate = async () => {
    const res = await getCate()
    if (res && res.status === 200) {
      const { data } = res
      setCateData(data)
      setActiveData(data[active])
      let sum: number = 0
      if (data) {
        (data[active] as cateDataObj[]).forEach((i) => {
          sum += i.bookCount
        })
      }
      setTotal(sum)
    } else {
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
  }

  useEffect(() => {
    reqCate()
  }, [])

  useEffect(() => {
    // 得到数据后刷新scroll重置高度
    scrollRef.current?.refresh()
  }, [activeData])

  const updateActiveItem = (item: string) => {
    if (active !== item) {
      setActive(item)
      setActiveData(cateData ? cateData[item] : null)
      // 切换分类后回到顶部
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

  const handleClickSortItem = (name: string) => {
    navigate('/sort/detail', { state: { cate: name } })
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
            <Row style={{ padding: '0 10px' }}>
              {
                (activeData ? activeData as cateDataObj[] : []).map((i) => (
                  <SortItem
                    name={i.name}
                    count={i.bookCount}
                    cover={i.bookCover[0]}
                    key={i.name}
                    clickItem={() => handleClickSortItem(i.name)}
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
