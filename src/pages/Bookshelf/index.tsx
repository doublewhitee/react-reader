import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Empty, Button, Checkbox, message } from 'antd'
import { AppstoreAddOutlined, BarsOutlined } from '@ant-design/icons'
import './index.less'

import TopBar from '../../components/TopBar'
import Scroll from '../../components/Scroll'

import { ZHUISHU_IMG_URL } from '../../config/constant'
import storage from '../../utils/storage'

interface bookshelfObj {
  id: string
  biqugeId: string
  name: string
  author: string
  cover: string
  chapter: {
    id: string
    name?: string
  }
}

const Bookshelf: React.FC = () => {
  const navigate = useNavigate()
  const [bookshelfList, setBookshelfList] = useState<bookshelfObj[]>([])
  const [displayStyle, setDisplayStyle] = useState<'pic'|'list'>('pic') // 页面布局[图墙|列表]
  const [longTouch, setLongTouch] = useState<boolean>(false) // 是否长按
  const [longTouchTimer, setLongTouchTimer] = useState<any>(null) // 长按Timer
  const [checkedList, setCheckedList] = useState<any>([]) // checkbox选中列表
  const scrollRef = useRef<any>(null)

  useEffect(() => {
    const list: bookshelfObj[] = storage.get('BOOKSHELF_LIST') ? JSON.parse(storage.get('BOOKSHELF_LIST')!) : []
    setBookshelfList(list)
  }, [])

  useEffect(() => {
    scrollRef.current?.refresh()
  }, [bookshelfList])

  const handleTouchStart = () => {
    // 开启定时器
    setLongTouchTimer(setTimeout(() => {
      setCheckedList([])
      setLongTouch(true)
    }, 1500))
  }

  const handleTouchMove = (e: any) => {
    // 移动，清除计时器
    clearTimeout(longTouchTimer)
    e.preventDefault() // 阻止其他点击事件
  }

  const handleTouchEnd = () => {
    // 清除计时器
    clearTimeout(longTouchTimer)
  }

  const handleCheckChange = (checked: any) => {
    setCheckedList(checked)
  }

  const handleClickItem = (id: string) => {
    // 在编辑模式下
    if (longTouch) {
      const list = checkedList.slice()
      if (checkedList.indexOf(id) === -1) {
        list.push(id)
      } else {
        list.splice(checkedList.indexOf(id), 1)
      }
      setCheckedList(list)
    } else {
      const item: bookshelfObj | undefined = bookshelfList.find((i) => i.id === id)
      navigate(`/read/${id}/${item?.biqugeId}/${item?.chapter.id}`)
    }
  }

  // 从书架移除
  const handleDeleteBook = () => {
    if (checkedList.length > 0) {
      const list: bookshelfObj[] = []
      bookshelfList.forEach((i) => {
        if (checkedList.indexOf(i.id) === -1) {
          list.push(i)
        }
      })
      storage.save('BOOKSHELF_LIST', list)
      setBookshelfList(list)
      message.success('删除成功！')
    }
    setLongTouch(false)
  }

  return (
    <div>
      <TopBar title="书架" showBack={false} />
      <div className="top-menu" style={{ display: longTouch ? 'none' : '' }}>
        <div
          className="top-menu-item"
          style={{ display: displayStyle === 'pic' ? 'flex' : 'none' }}
          role="tab"
          tabIndex={0}
          onClick={() => setDisplayStyle('list')}
          onKeyDown={() => setDisplayStyle('list')}
        >
          <BarsOutlined className="top-menu-icon" />
          列表模式
        </div>
        <div
          className="top-menu-item"
          style={{ display: displayStyle === 'list' ? 'flex' : 'none' }}
          role="tab"
          tabIndex={0}
          onClick={() => setDisplayStyle('pic')}
          onKeyDown={() => setDisplayStyle('pic')}
        >
          <AppstoreAddOutlined className="top-menu-icon" />
          图墙模式
        </div>
      </div>

      <div style={{ display: longTouch ? 'flex' : 'none' }} className="tool-menu">
        <Button size="small" onClick={() => setLongTouch(false)}>关闭</Button>
        <Button
          onClick={handleDeleteBook}
          danger
          size="small"
          type="primary"
        >
          删除
        </Button>
      </div>

      <div style={{ padding: '10px', height: 'calc(100vh - 140px)' }}>
        <Scroll ref={scrollRef} id="scroll">
          <Checkbox.Group
            onChange={handleCheckChange}
            defaultValue={checkedList}
            value={checkedList}
            style={{ width: '100%' }}
          >
            <Row style={{ alignItems: 'center' }}>
              {
                bookshelfList.length === 0 ? <Empty style={{ width: '100%' }} />
                  : bookshelfList.map((item) => (
                    <Fragment key={item.id}>
                      <Col
                        className="books-item-main"
                        span={displayStyle === 'pic' ? 8 : 6}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={() => handleClickItem(item.id)}
                      >
                        <Checkbox
                          value={item.id}
                          className="check-box"
                          style={{ display: longTouch ? '' : 'none' }}
                        />
                        <img src={ZHUISHU_IMG_URL + item.cover} alt="cover" className="book-cover" />
                        {
                          displayStyle === 'pic' ? (
                            <div>
                              <div className="book-title">{item.name}</div>
                              <div className="book-info">{item.chapter.name ? item.chapter.name : '尚未阅读'}</div>
                            </div>
                          ) : ''
                        }
                      </Col>
                      <Col
                        style={{ display: displayStyle === 'list' ? '' : 'none' }}
                        className="books-item-info"
                        span={18}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={() => handleClickItem(item.id)}
                      >
                        <div className="book-title">{item.name}</div>
                        <div className="book-info">{item.author}</div>
                        <div className="book-info">{item.chapter.name ? item.chapter.name : '尚未阅读'}</div>
                      </Col>
                    </Fragment>
                  ))
              }
            </Row>
          </Checkbox.Group>
        </Scroll>
      </div>
    </div>
  )
}

export default Bookshelf
