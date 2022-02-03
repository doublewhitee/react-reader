import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Tag, message } from 'antd'
import { SearchOutlined, SyncOutlined } from '@ant-design/icons'
import './index.less'

import { getSearchHotWords, getHotWord } from '../../api/search'

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
    const res = await getHotWord()
    if (res && res.status === 200) {
      const { data } = res
      setHotBook(data.hotWords)
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

  const handleRefreshTags = () => {
    if (tagIndex < 9) {
      setTagIndex((i) => i + 1)
    } else {
      setTagIndex(0)
    }
  }

  return (
    <div className="container">
      <div className="search-box">
        <Input placeholder="搜索发现" prefix={<SearchOutlined />} />
        <div
          role="tab"
          tabIndex={0}
          onClick={handleBack}
          onKeyDown={handleBack}
          style={{ width: '50px' }}
        >
          取消
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
      </div>
    </div>
  )
}

export default Search
