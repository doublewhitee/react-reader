import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select, Tag, Skeleton, message } from 'antd'
import { LeftOutlined, SyncOutlined } from '@ant-design/icons'
import './index.less'

import { getSearchHotWords, getHotWord, getAutoComplete } from '../../api/search'
import { useDebounce } from '../../utils'

const { Option } = Select

interface tagDataObj {
  word: string
  times: number
  isNew: number
  soaring: number
}

const Search: React.FC = () => {
  const navigate = useNavigate()
  const [tagData, setTagData] = useState(null)
  const [tagIndex, setTagIndex] = useState<number>(0)
  const [hotBook, setHotBook] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string | null>()
  const [autoWords, setAutoWords] = useState<string[]>([])

  const reqSearchHotWords = async () => {
    const res = await getSearchHotWords()
    if (res && res.status === 200) {
      const { data } = res
      setTagData(data.searchHotWords)
    } else {
      message.error('似乎出了一点问题...')
    }
  }

  const reqHotWord = async () => {
    setLoading(true)
    const res = await getHotWord()
    if (res && res.status === 200) {
      const { data } = res
      setHotBook(data.hotWords)
      setLoading(false)
    } else {
      message.error('似乎出了一点问题...')
    }
  }

  const reqAutoComplete = async (query: string) => {
    const res = await getAutoComplete(query)
    if (res && res.status === 200) {
      const { data } = res
      setAutoWords(data.keywords)
    } else {
      message.error('似乎出了一点问题...')
    }
  }

  useEffect(() => {
    reqSearchHotWords()
    reqHotWord()
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const handleSelectChange = (value: string) => {
    setSearchText(value)
  }

  const handleSearchWord = useDebounce(async (query: string) => {
    await reqAutoComplete(query)
    setSearchText(query)
  }, 1000)

  const handleRefreshTags = () => {
    if (tagIndex < 9) {
      setTagIndex((i) => i + 1)
    } else {
      setTagIndex(0)
    }
  }

  const handleSearch = () => {
    console.log('search')
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

      <div className="search-tags">
        <div className="search-tags-title">
          <span>搜索发现</span>
          <SyncOutlined onClick={handleRefreshTags} />
        </div>
        <div>
          {
            (tagData ? tagData as tagDataObj[] : []).slice(tagIndex * 10, tagIndex * 10 + 10)
              .map((i) => (
                <Tag className="search-tags-item" key={i.word}>{i.word}</Tag>
              ))
          }
        </div>
      </div>

      <div className="hot-card">
        <div className="hot-card-title">热搜作品榜</div>
        <Skeleton
          active
          title={false}
          paragraph={{ rows: 10, width: '100%' }}
          loading={loading}
        >
          <div>
            {
              hotBook.map((i, index) => (
                <div className="hot-card-item" key={i}>
                  <span className={index < 3 ? 'hot-card-index-top' : 'hot-card-index'}>{index + 1}</span>
                  {i}
                </div>
              ))
            }
          </div>
        </Skeleton>
      </div>
    </div>
  )
}

export default Search
