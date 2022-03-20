import React, { useEffect, useState } from 'react'
import { Button, Collapse, Drawer, Empty, Spin, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import PubSub from 'pubsub-js'
import './index.less'

import { getBiQuGeID, getBookMenu } from '../../api/book'

const { Panel } = Collapse

interface BookMenuProps {
  bookId: string
  title: string
  author: string
  isVisible: boolean
  setIsVisible: Function
  width?: string
  isRepalce?: boolean
  hasBiqugeId?: string // 是否由父组件传入笔趣阁ID
}

interface MenuListObj {
  name: string
  list: [
    {
      id: number
      name: string
      hasContent: number
    }
  ]
}

const BookMenu: React.FC<BookMenuProps> = (props) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [biqugeID, setBiqugeID] = useState<string>('')
  const [menuList, setMenuList] = useState<MenuListObj[]>([])

  const { bookId, title, author, isVisible, setIsVisible, width, isRepalce, hasBiqugeId } = props

  // 获取笔趣阁的本书ID
  const reqBiQuGeID = async () => {
    setLoading(true)
    const res = await getBiQuGeID(title)
    if (res && res.status === 200) {
      const { data } = res
      // 去除作者名前的空格和.
      const au = author.trim().replace(/(^\.*)|(\.*$)/g, '').trim()
      const ti = title.trim().replace(/(^\.*)|(\.*$)/g, '').trim()
      // 查找是否存在该书籍
      const hasId = data.data.some((item: any) => {
        if (item.Name === ti && item.Author === au) {
          setBiqugeID(item.Id)
          return true
        }
        return false
      })
      if (!hasId) PubSub.publish('menu-loaded', { status: 'id_error' })
    } else {
      PubSub.publish('menu-loaded', { status: 'id_error' })
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
  }

  // 获取目录
  const reqBookMenu = async (id: string) => {
    setLoading(true)
    const res = await getBookMenu(id)
    if (res && res.status === 200) {
      let { data } = res
      // 去除错误格式
      data = JSON.parse(data.replace(/\},\]/g, '}]'))
      setMenuList(data.data.list)
      // 计算章节总数
      const len = data.data.list.reduce((pre: number, cur: MenuListObj) => pre + cur.list.length, 0)
      // 发送加载完成信号
      if (data.data.list && data.data.list[0] && data.data.list[0].list) {
        PubSub.publish('menu-loaded', {
          chapterCount: len,
          biquge: id,
          id: data.data.list[0].list[0].id,
          status: 'ok'
        })
      } else {
        PubSub.publish('menu-loaded', { status: 'error', biquge: id })
      }
    } else {
      PubSub.publish('menu-loaded', { status: 'error', biquge: id })
      message.error('似乎出了一点问题...')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (hasBiqugeId !== '') {
      setBiqugeID(hasBiqugeId!)
    } else if (title !== '') {
      reqBiQuGeID()
    }
  }, [title])

  useEffect(() => {
    if (biqugeID !== '') {
      reqBookMenu(biqugeID)
    }
  }, [biqugeID])

  const handleCloseDrawer = () => {
    setIsVisible(false)
  }

  const handleReloadData = async () => {
    // 没有笔趣阁ID，重新发送两个请求，否则只发送章节请求
    if (biqugeID === '') {
      // biqugeID变化useEffect中发送章节请求
      await reqBiQuGeID()
    } else {
      // 手动调用章节请求
      await reqBookMenu(biqugeID)
    }
  }

  const handleClickItem = (chapterId: string | number) => {
    navigate(`/read/${bookId}/${biqugeID}/${chapterId}`, { replace: isRepalce })
  }

  return (
    <Drawer
      title="章节目录"
      visible={isVisible}
      onClose={handleCloseDrawer}
      width={width}
    >
      <Spin spinning={loading} size="large" tip="加载中...">
        {
          menuList.length > 0
            ? (
              <Collapse defaultActiveKey={[...menuList.map((i) => i.name)]} ghost>
                {
                  menuList.map((item) => (
                    <Panel header={item.name} key={item.name}>
                      {
                        item.list.map((c) => (
                          <div
                            key={c.id}
                            className={c.hasContent === 0 ? 'chapter-div unable-ch' : 'chapter-div'}
                            role="tab"
                            tabIndex={0}
                            onClick={() => handleClickItem(c.id)}
                            onKeyDown={() => handleClickItem(c.id)}
                          >
                            {c.name}
                          </div>
                        ))
                      }
                    </Panel>
                  ))
                }
              </Collapse>
            )
            : (
              <Empty>
                <Button onClick={handleReloadData} loading={loading}>重新加载</Button>
              </Empty>
            )
        }
      </Spin>
    </Drawer>
  )
}

BookMenu.defaultProps = {
  width: '100%',
  isRepalce: false,
  hasBiqugeId: ''
}

export default BookMenu
