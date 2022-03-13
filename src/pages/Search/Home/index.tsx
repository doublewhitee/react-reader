import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tag, Skeleton, message } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import './index.less'

import { getSearchHotWords, getHotWord } from '../../../api/search'

interface tagDataObj {
  word: string
  times: number
  isNew: number
  soaring: number
}

interface hotBookObj {
  word: string
  book: string
}

interface HomeProps {
  setSearchText: Function
}

const Home: React.FC<HomeProps> = (props) => {
  const [tagData, setTagData] = useState(null)
  const [tagIndex, setTagIndex] = useState<number>(0)
  const [hotBook, setHotBook] = useState<hotBookObj[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const { setSearchText } = props

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
      setHotBook(data.newHotWords)
      setLoading(false)
    } else {
      message.error('似乎出了一点问题...')
    }
  }

  useEffect(() => {
    reqSearchHotWords()
    reqHotWord()
  }, [])

  const handleRefreshTags = () => {
    if (tagIndex < 9) {
      setTagIndex((i) => i + 1)
    } else {
      setTagIndex(0)
    }
  }

  const handleClickTag = (tag: string) => {
    setSearchText(tag)
    navigate(`/search/detail?key=${tag}`, { replace: true })
  }

  const handleClickHotBook = (id: string) => {
    navigate(`/book/${id}`)
  }

  return (
    <div>
      <div className="search-tags">
        <div className="search-tags-title">
          <span>搜索发现</span>
          <SyncOutlined onClick={handleRefreshTags} />
        </div>
        <div>
          {
            (tagData ? tagData as tagDataObj[] : []).slice(tagIndex * 10, tagIndex * 10 + 10)
              .map((i) => (
                <Tag
                  className="search-tags-item"
                  key={i.word}
                  onClick={() => handleClickTag(i.word)}
                >
                  {i.word}
                </Tag>
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
                <div
                  className="hot-card-item"
                  key={i.book}
                  role="tab"
                  tabIndex={0}
                  onClick={() => handleClickHotBook(i.book)}
                  onKeyDown={() => handleClickHotBook(i.book)}
                >
                  <span className={index < 3 ? 'hot-card-index-top' : 'hot-card-index'}>{index + 1}</span>
                  {i.word}
                </div>
              ))
            }
          </div>
        </Skeleton>
      </div>
    </div>
  )
}

export default Home
