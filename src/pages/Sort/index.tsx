import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import './index.less'

import TopBar from '../../components/TopBar'
import LeftBar from '../../components/LeftBar'

import { getCate } from '../../api/sort'

interface cateDataObj {
  name: string
}

const Sort: React.FC = () => {
  const [cateData, setCateData] = useState(null)
  const [active, setActive] = useState('male')
  const [loading, setLoading] = useState(true)

  const reqCate = async () => {
    const { data } = await getCate()
    setCateData(data)
    setLoading(false)
  }

  useEffect(() => {
    reqCate()
  }, [])

  const updateActiveItem = (item: string) => {
    if (active !== item) {
      setActive(item)
    }
  }

  console.log(cateData)

  return (
    <div style={{ height: '100vh' }}>
      <TopBar title="分类" />

      <Spin spinning={loading} size="large" tip="加载中...">
        <div id="sort">
          <LeftBar
            width={30}
            items={{ male: '男生', female: '女生', press: '出版' }}
            current={active}
            handleClickItem={updateActiveItem}
          />
          <div style={{ width: '70%' }}>
            {
              (cateData ? cateData[active] as cateDataObj[] : []).map((i) => i.name)
            }
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default Sort
