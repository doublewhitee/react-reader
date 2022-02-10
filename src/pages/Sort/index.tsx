import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import TopBar from '../../components/TopBar'
import Home from './Home'
import Detail from './Detail'

import { getMinorCate } from '../../api/sort'

interface minorCateDataObj {
  major: string
  mins: string[]
}

const Sort: React.FC = () => {
  const location = useLocation()
  const [title, setTitle] = useState<string>('')
  const [active, setActive] = useState<string>('male')
  const [minorCate, setMinorCate] = useState<string[]>([])
  const [minorCateData, setMinorCateData] = useState<minorCateDataObj[]>([])

  const reqMinorCate = async () => {
    const res = await getMinorCate()
    if (res && res.status === 200) {
      const { data } = res
      let dataList: any = []
      Object.keys(data).forEach((i) => {
        if (['male', 'female', 'press'].includes(i)) {
          dataList = [...dataList, ...data[i]]
        }
      })
      setMinorCateData(dataList)
    }
  }

  useEffect(() => {
    reqMinorCate()
  }, [])

  useEffect(() => {
    if (location.state && (location.state as any).cate) {
      const { cate } = location.state as any
      setTitle(cate)
      // 查找子分类
      for (let i: number = 0; i < minorCateData.length; i += 1) {
        if (minorCateData[i].major === cate) {
          setMinorCate(minorCateData[i].mins)
        }
      }
    } else {
      setTitle('分类')
      setMinorCate([])
    }
  }, [location])

  return (
    <div style={{ height: '100vh' }}>
      <TopBar title={title} />

      <Routes>
        <Route path="index" element={<Home active={active} setActive={setActive} />} />
        <Route path="detail" element={<Detail minorCate={minorCate} gender={active} />} />
        <Route path="*" element={<Navigate to="/sort/index" />} />
      </Routes>
    </div>
  )
}

export default Sort
