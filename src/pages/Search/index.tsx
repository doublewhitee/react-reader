import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Select, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import './index.less'

import { getAutoComplete } from '../../api/search'
import { useDebounce } from '../../utils'

import Home from './Home'
import Result from './Result'

const { Option } = Select

const Search: React.FC = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState<string | null>()
  const [autoWords, setAutoWords] = useState<string[]>([])

  const reqAutoComplete = async (query: string) => {
    const res = await getAutoComplete(query)
    if (res && res.status === 200) {
      const { data } = res
      setAutoWords(data.keywords)
    } else {
      message.error('似乎出了一点问题...')
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleSelectChange = (value: string) => {
    setSearchText(value)
  }

  const handleSearchWord = useDebounce(async (query: string) => {
    setSearchText(query)
    await reqAutoComplete(query)
  }, 1000)

  const handleSearch = () => {
    if (searchText && searchText !== '') {
      navigate(`/search/detail?key=${searchText}`, { replace: true })
    }
  }

  return (
    <div className="container">
      <div className="search-box">
        <LeftOutlined style={{ width: '50px', fontSize: '18px' }} onClick={handleBack} />
        <Select
          showSearch
          placeholder="搜索发现"
          value={searchText}
          showArrow={false}
          defaultActiveFirstOption={false}
          filterOption={false}
          onChange={handleSelectChange}
          onSearch={handleSearchWord}
          notFoundContent={null}
          style={{ width: '100%' }}
        >
          {
            autoWords.map((i) => <Option key={i}>{i}</Option>)
          }
        </Select>
        <div
          role="tab"
          tabIndex={0}
          onClick={handleSearch}
          onKeyDown={handleSearch}
          style={{ width: '50px' }}
        >
          搜索
        </div>
      </div>

      <Routes>
        <Route path="index" element={<Home setSearchText={setSearchText} />} />
        <Route path="detail" element={<Result setSearchText={setSearchText} />} />
        <Route path="*" element={<Navigate to="/search/index" />} />
      </Routes>
    </div>
  )
}

export default Search
