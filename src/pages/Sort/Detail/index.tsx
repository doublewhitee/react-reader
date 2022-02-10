import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tag, Spin, message } from 'antd'
import './index.less'

import Scroll from '../../../components/Scroll'
import BookItem from './BookItem'

import { getBookList } from '../../../api/sort'

const { CheckableTag } = Tag
const bookTypes: any = { hot: '热门', new: '新书', repulation: '好评', over: '完结', month: '包月' }

interface DetailProps {
  minorCate: string[]
  gender: string
}

interface bookListObj {
  _id: string
  title: string
  author: string
  cover: string
  shortIntro: string
}

const Detail: React.FC<DetailProps> = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const scrollRef1 = useRef<any>(null)
  const scrollRef2 = useRef<any>(null)
  const scrollRef3 = useRef<any>(null)
  const [checkedTag, setCheckedTag] = useState({ cate: '全部', type: 'hot' })
  const [bookList, setBookList] = useState<bookListObj[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { minorCate, gender } = props

  const reqBookList = async (
    type: string,
    genderType: string,
    major: string,
    start: number,
    minor?: string
  ) => {
    setLoading(true)
    const res = minor
      ? await getBookList(type, genderType, major, start, minor)
      : await getBookList(type, genderType, major, start)
    if (res && res.status === 200) {
      const { data } = res
      setBookList([...bookList, ...(data as any).books])
    } else {
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
  }

  useEffect(() => {
    // 没有子分类则不能进入该页面
    if (!location.state) {
      navigate('/sort/index')
    } else {
      reqBookList(checkedTag.type, gender, (location.state as any).cate, 0)
    }
  }, [])

  useEffect(() => {
    scrollRef1.current?.refresh()
    scrollRef2.current?.refresh()
  }, [minorCate])

  useEffect(() => {
    scrollRef3.current?.refresh()
  }, [bookList])

  const handleChangeTag = (tag: string, type: string) => {
    setCheckedTag({ ...checkedTag, [type]: tag })
  }

  return (
    <Spin spinning={loading} size="large" tip="加载中...">
      <Scroll direction="horizontal" ref={scrollRef1} id="scroll_1">
        <div className="tag-list">
          <CheckableTag
            checked={checkedTag.cate === '全部'}
            onChange={() => handleChangeTag('全部', 'cate')}
          >
            全部
          </CheckableTag>
          {minorCate.map((i) => (
            <CheckableTag
              key={i}
              checked={checkedTag.cate === i}
              onChange={() => handleChangeTag(i, 'cate')}
            >
              {i}
            </CheckableTag>
          ))}
        </div>
      </Scroll>

      <Scroll direction="horizontal" ref={scrollRef2} id="scroll_2">
        <div className="tag-list">
          {Object.keys(bookTypes).map((i) => (
            <CheckableTag
              key={i}
              checked={checkedTag.type === i}
              onChange={() => handleChangeTag(i, 'type')}
            >
              {bookTypes[i]}
            </CheckableTag>
          ))}
        </div>
      </Scroll>

      <div className="books">
        <Scroll ref={scrollRef3} id="scroll_3">
          {
            bookList.map((i) => (
              <BookItem
                key={i._id}
                _id={i._id}
                title={i.title}
                author={i.author}
                cover={i.cover}
                shortIntro={i.shortIntro}
              />
            ))
          }
        </Scroll>
      </div>
    </Spin>
  );
};

export default Detail
