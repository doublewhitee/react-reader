/* eslint-disable no-lonely-if */
import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Drawer, Row, Col, Spin, Slider, Progress, message } from 'antd'
import { MenuOutlined, SettingOutlined, LeftOutlined, EllipsisOutlined, CheckOutlined, createFromIconfontCN } from '@ant-design/icons'
import PubSub from 'pubsub-js'
import './index.less'

import BookMenu from '../../components/BookMenu'

import { getChapter } from '../../api/book'
import storage from '../../utils/storage'

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_3260786_3xhnhh3kglk.js',
  ],
})

interface chapterObj {
  cid: number // chapter id
  cname: string // 章节名称
  name: string // 书名
  content: string
  hasContent: number // 是否有内容
  id: number // 笔趣阁书本id
  nid: number // 下一章id,不存在则为-1
  pid: number // 前一章id,不存在则为-1
}

interface readSettingObj {
  isNightMode?: boolean // 是否是夜间模式
  displayMode?: string
  fontSize?: number
  lineHeight?: number
}

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

const Read: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuDrawerVisible, setIsMenuDrawerVisible] = useState<boolean>(false)
  const [chapterDetail, setChapterDetail] = useState<chapterObj>()
  const [loadingState, setLoadingState] = useState<'y'|'n'|'err'>('y') // 加载状态
  const [pages, setPages] = useState<number>(1) // 本章分页总页数
  const [currentPage, setCurrentPage] = useState<number>(1) // 当前页数
  const [pageTranslateX, setPageTranslateX] = useState<number>(0) // 偏移量
  const [readSettings, setReadSettings] = useState<readSettingObj>() // 阅读设置
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [isProgress, setIsProgress] = useState<boolean>(false)
  const [isSetting, setIsSetting] = useState<boolean>(false)
  const [readMenuHeight, setReadMenuHeight] = useState<number>(60)
  const [reCalcPageTimer, setReCalcPageTimer] = useState<any>(null) // 重新计算页数
  const [isProgressLoading, setIsProgressLoading] = useState<boolean>(true)
  const [totalChapter, setTotalChapter] = useState<number>(0) // 章节总数
  const [currentChapterIndex, setcurrentChapterIndex] = useState<number>(-1) // 当前章节位置
  const [touchStart, setTouchStart] = useState<number>(0) // 触摸开始位置(X)
  const [touchEnd, setTouchEnd] = useState<number>(-1) // 触摸结束位置
  const contentRef = useRef() as React.LegacyRef<HTMLDivElement>

  const params = useParams()

  const reqChapter = async (crrBookId: string, crrChapterId: string | number) => {
    const res = await getChapter(crrBookId, crrChapterId)
    if (res && res.status === 200) {
      const { data } = res
      if (data.status === 1 && data.data.hasContent === 1) {
        setChapterDetail(data.data)
        setLoadingState('n')
        // 读取书架内容，若在书架中则更新阅读章节信息
        const list: bookshelfObj[] = storage.get('BOOKSHELF_LIST') ? JSON.parse(storage.get('BOOKSHELF_LIST')!) : []
        let info: bookshelfObj | undefined
        list.some((i) => {
          if (i.biqugeId === crrBookId) {
            info = i
            return true
          }
          return false
        })
        if (info) {
          info.chapter.id = data.data.cid
          info.chapter.name = data.data.cname
          storage.save('BOOKSHELF_LIST', list)
        }
      } else {
        setLoadingState('err')
        message.error('似乎出了一点问题...')
      }
    } else {
      setLoadingState('err')
      message.error('似乎出了一点问题...')
    }
  }

  useEffect(() => {
    // 读取阅读界面设置;根据获取到的mode显示样式
    const readSetting: readSettingObj = storage.get('READ_SETTING') ? JSON.parse(storage.get('READ_SETTING')!) : undefined
    const readerDiv = document.getElementById('reader')
    if (!readSetting || (readSetting && !readSetting.displayMode && !readSetting.isNightMode)) {
      const temp: readSettingObj = {
        isNightMode: false,
        displayMode: 'light1',
        fontSize: 14,
        lineHeight: 20
      }
      storage.save('READ_SETTING', temp)
      setReadSettings(temp)
      readerDiv?.classList.add('light1')
    } else {
      setReadSettings(readSetting)
      if (readSetting.isNightMode!) {
        readerDiv?.classList.add('night')
      } else {
        readerDiv?.classList.add(readSetting.displayMode!)
      }
    }
    // 获取章节总数
    PubSub.subscribe('menu-loaded', (_, info) => {
      if (info.status === 'ok') {
        setTotalChapter(info.chapterCount)
      }
    })
    // 当前章节
    PubSub.subscribe('current-chapter-index', (_, index) => {
      setcurrentChapterIndex(index)
      setIsProgressLoading(false)
    })
    return () => {
      PubSub.unsubscribe('menu-loaded')
      PubSub.unsubscribe('current-chapter-index')
    }
  }, [])

  useEffect(() => {
    setLoadingState('y')
    if (!params || !params.bookId || !params.bqgBookId || !params.chapterId) {
      navigate(-1)
    } else {
      // 请求章节信息
      reqChapter(params.bqgBookId!, params.chapterId!)
      // 关闭进度及设置
      setIsProgress(false)
      setIsSetting(false)
      setcurrentChapterIndex(-1)
      setReadMenuHeight(60)
    }
  }, [location])

  useEffect(() => {
    if (contentRef) {
      const contentWidth = (contentRef as any).current.scrollWidth
      const { clientWidth } = document.body
      setPages(Math.ceil(contentWidth / clientWidth))
      if (location.state && (location.state as any).isEnd) {
        const p = Math.ceil(contentWidth / clientWidth)
        setPageTranslateX((clientWidth - 16) * (p - 1))
        setCurrentPage(Math.ceil(contentWidth / clientWidth))
      } else {
        setPageTranslateX(0)
        setCurrentPage(1)
      }
    }
  }, [chapterDetail])

  useEffect(() => {
    clearTimeout(reCalcPageTimer)
    if (loadingState === 'n') {
      setReCalcPageTimer(setTimeout(() => {
        const contentWidth = (contentRef as any).current.scrollWidth
        const { clientWidth } = document.body
        const p = Math.ceil(contentWidth / clientWidth)
        setPages(p)
        if (currentPage > p) {
          setCurrentPage(p)
          setPageTranslateX((clientWidth - 16) * (p - 1))
        } else {
          setPageTranslateX((clientWidth - 16) * (currentPage - 1))
        }
      }, 500))
    }
  }, [readSettings?.lineHeight, readSettings?.fontSize])

  const handleClickCenter = () => {
    setIsMenuDrawerVisible(true)
  }

  const handlePrePage = () => {
    const p = currentPage
    if (loadingState !== 'n') {
      message.info('章节信息获取错误，请从目录跳转')
      return
    }
    if (p > 1) {
      const { clientWidth } = document.body
      setCurrentPage((page) => page - 1);
      setPageTranslateX((clientWidth - 16) * (p - 2))
    } else {
      // 加载上一章
      if (chapterDetail!.pid === -1) {
        message.info('已经到第一章了')
      } else {
        navigate(`/read/${params.bookId}/${params.bqgBookId}/${chapterDetail!.pid}`, { state: { isEnd: true }, replace: true })
      }
    }
  }

  const handleNextPage = () => {
    const p = currentPage
    if (loadingState !== 'n') {
      message.info('章节信息获取错误，请从目录跳转')
      return
    }
    if (p < pages) {
      const { clientWidth } = document.body
      setCurrentPage((page) => page + 1)
      setPageTranslateX((clientWidth - 16) * p)
    } else {
      // 加载下一章
      if (chapterDetail!.nid === -1) {
        message.info('已经到最后一章了')
      } else {
        navigate(`/read/${params.bookId}/${params.bqgBookId}/${chapterDetail!.nid}`, { replace: true })
      }
    }
  }

  // 修改日间/夜间模式
  const handleSetNightMode = () => {
    const isNightMode = !readSettings?.isNightMode
    setReadSettings({ ...readSettings, isNightMode })
    storage.save('READ_SETTING', { ...readSettings, isNightMode })
    const readerDiv = document.getElementById('reader')
    if (isNightMode) {
      readerDiv?.classList.remove(readSettings?.displayMode!)
      readerDiv?.classList.add('night')
    } else {
      readerDiv?.classList.remove('night')
      readerDiv?.classList.add(readSettings?.displayMode!)
    }
  }

  // 进度
  const handleProgress = () => {
    if (isProgress) {
      setReadMenuHeight(60)
    } else {
      setReadMenuHeight(110)
    }
    setIsProgress((s) => !s)
    setIsSetting(false)
  }

  // 设置
  const handleSetting = () => {
    if (isSetting) {
      setReadMenuHeight(60)
    } else {
      setReadMenuHeight(180)
    }
    setIsSetting((s) => !s)
    setIsProgress(false)
  }

  // 修改字体/行高
  const handleSliderChange = (val: number, type: string) => {
    storage.save('READ_SETTING', { ...readSettings, [type]: val })
    setReadSettings({ ...readSettings, [type]: val })
  }

  // 修改主题
  const handleChangeDisplayMode = (mode: string) => {
    if (mode !== readSettings?.displayMode) {
      const readerDiv = document.getElementById('reader')
      readerDiv?.classList.remove(readSettings?.displayMode!)
      readerDiv?.classList.remove('night')
      readerDiv?.classList.add(mode)
      storage.save('READ_SETTING', { ...readSettings, displayMode: mode, isNightMode: false })
      setReadSettings({ ...readSettings, displayMode: mode, isNightMode: false })
    }
  }

  const handlePre = () => {
    if (chapterDetail!.pid === -1) {
      message.info('已经到第一章了')
    } else {
      navigate(`/read/${params.bookId}/${params.bqgBookId}/${chapterDetail!.pid}`, { replace: true })
    }
  }

  const handleNext = () => {
    if (chapterDetail!.nid === -1) {
      message.info('已经到最后一章了')
    } else {
      navigate(`/read/${params.bookId}/${params.bqgBookId}/${chapterDetail!.nid}`, { replace: true })
    }
  }

  // 开始移动
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    e.stopPropagation()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
    e.stopPropagation()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    // 左滑，进入下一页
    if (touchStart - touchEnd > 80 && touchEnd !== -1) {
      handleNextPage()
    } else if (touchEnd - touchStart > 80 && touchEnd !== -1) {
      handlePrePage()
    }
    setTouchStart(0)
    setTouchEnd(-1)
    e.stopPropagation()
  }

  return (
    <div style={{ position: 'relative' }} id="reader">
      <Spin spinning={loadingState === 'y'} size="large" tip="加载中...">
        <Row
          className="read-mask"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Col span={8} onClick={handlePrePage} />
          <Col span={8} onClick={handleClickCenter} />
          <Col span={8} onClick={handleNextPage} />
        </Row>

        <Drawer
          visible={isMenuDrawerVisible}
          onClose={() => setIsMenuDrawerVisible(false)}
          placement="top"
          closable={false}
          height={60}
          maskStyle={{ backgroundColor: 'transparent' }}
          className="top-menu"
        >
          <div className="top-menu-content">
            <LeftOutlined onClick={() => navigate(-1)} style={{ fontSize: '20px' }} />
            <EllipsisOutlined onClick={() => navigate(`/book/${params.bookId}`)} style={{ fontSize: '20px' }} />
          </div>
        </Drawer>

        <Drawer
          visible={isMenuDrawerVisible}
          onClose={() => setIsMenuDrawerVisible(false)}
          placement="bottom"
          height={readMenuHeight}
          closable={false}
          className="read-menu"
          mask={false}
        >
          {
            isProgress ? (
              <div style={{ height: '30px', margin: '15px 0' }}>
                <Spin spinning={isProgressLoading}>
                  <Row align="middle">
                    <Col span={4} style={{ textAlign: 'center' }} onClick={handlePre}>上一章</Col>
                    <Col span={16}>
                      <Progress
                        percent={currentChapterIndex !== -1 && totalChapter !== 0
                          ? (currentChapterIndex / totalChapter) * 100 : 50}
                        showInfo={false}
                        strokeWidth={5}
                      />
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }} onClick={handleNext}>下一章</Col>
                  </Row>
                </Spin>
              </div>
            ) : null
          }
          {
            isSetting ? (
              <div style={{ height: '110px', margin: '10px 0' }}>
                <Row align="middle">
                  <Col span={4} style={{ textAlign: 'center' }}>字体</Col>
                  <Col span={20}>
                    <Slider
                      min={12}
                      max={24}
                      defaultValue={readSettings ? readSettings.fontSize : 14}
                      onChange={(val) => handleSliderChange(val, 'fontSize')}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={4} style={{ textAlign: 'center' }}>行距</Col>
                  <Col span={20}>
                    <Slider
                      min={18}
                      max={34}
                      defaultValue={readSettings ? readSettings.lineHeight : 20}
                      onChange={(val) => handleSliderChange(val, 'lineHeight')}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={6} onClick={() => handleChangeDisplayMode('light1')}>
                    <div className="display-modes" style={{ backgroundColor: '#C3B298' }}>
                      <div
                        className="checked-mode"
                        style={{ display: !readSettings?.isNightMode && readSettings?.displayMode === 'light1' ? '' : 'none' }}
                      >
                        <CheckOutlined />
                      </div>
                    </div>
                  </Col>
                  <Col span={6} onClick={() => handleChangeDisplayMode('light2')}>
                    <div className="display-modes" style={{ backgroundColor: '#C3D4E6' }}>
                      <div
                        className="checked-mode"
                        style={{ display: !readSettings?.isNightMode && readSettings?.displayMode === 'light2' ? '' : 'none' }}
                      >
                        <CheckOutlined />
                      </div>
                    </div>
                  </Col>
                  <Col span={6} onClick={() => handleChangeDisplayMode('light3')}>
                    <div className="display-modes" style={{ backgroundColor: '#C8E8C8' }}>
                      <div
                        className="checked-mode"
                        style={{ display: !readSettings?.isNightMode && readSettings?.displayMode === 'light3' ? '' : 'none' }}
                      >
                        <CheckOutlined />
                      </div>
                    </div>
                  </Col>
                  <Col span={6} onClick={() => handleChangeDisplayMode('light4')}>
                    <div className="display-modes" style={{ backgroundColor: '#fff' }}>
                      <div
                        className="checked-mode"
                        style={{ display: !readSettings?.isNightMode && readSettings?.displayMode === 'light4' ? '' : 'none' }}
                      >
                        <CheckOutlined />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : null
          }
          <div className="read-menu-content">
            <div
              style={{ textAlign: 'center', flex: 1 }}
              role="tab"
              tabIndex={0}
              onClick={() => setMenuVisible(true)}
              onKeyDown={() => setMenuVisible(true)}
            >
              <MenuOutlined style={{ fontSize: '20px' }} />
              <div>目录</div>
            </div>

            <div
              style={{ textAlign: 'center', flex: 1 }}
              role="tab"
              tabIndex={0}
              onClick={handleProgress}
              onKeyDown={handleProgress}
            >
              <IconFont type="icon-progress" style={{ fontSize: '20px' }} />
              <div>进度</div>
            </div>

            <div
              style={{ textAlign: 'center', flex: 1 }}
              role="tab"
              tabIndex={0}
              onClick={handleSetNightMode}
              onKeyDown={handleSetNightMode}
            >
              <IconFont type={readSettings && readSettings.isNightMode ? 'icon-Daytimemode' : 'icon-nightmode'} style={{ fontSize: '20px' }} />
              <div>{readSettings && readSettings.isNightMode ? '日间' : '夜间'}</div>
            </div>

            <div
              style={{ textAlign: 'center', flex: 1 }}
              role="tab"
              tabIndex={0}
              onClick={handleSetting}
              onKeyDown={handleSetting}
            >
              <SettingOutlined style={{ fontSize: '20px' }} />
              <div>设置</div>
            </div>
          </div>
        </Drawer>

        <div className="chapter">
          <div className="chapter-info">
            {chapterDetail ? chapterDetail.name : ''}
          </div>

          <div className="chapter-wrapper">
            <div
              ref={contentRef}
              className="chapter-contents"
              key={params.chapterId}
              style={{
                transform: `translateX(-${pageTranslateX}px)`,
                fontSize: `${readSettings?.fontSize}px`,
                lineHeight: `${readSettings?.lineHeight}px` }}
            >
              {
                chapterDetail ? (
                  <>
                    <h2 style={{ fontWeight: 'bold', marginTop: '20px' }}>{chapterDetail.cname}</h2>
                    {chapterDetail.content}
                  </>
                )
                  : loadingState === 'err' ? '加载失败了...' : '加载中，请稍候...'
              }
            </div>
          </div>

          <div className="chapter-info">
            <div>
              {chapterDetail ? chapterDetail.cname : ''}
            </div>
            <div>
              {`${currentPage}/${pages}`}
            </div>
          </div>
        </div>

        <BookMenu
          bookId={params.bookId!}
          title={chapterDetail ? chapterDetail.name : ''}
          currentChapterId={chapterDetail ? chapterDetail.cid : ''}
          author=""
          hasBiqugeId={params.bqgBookId}
          isRepalce
          isVisible={menuVisible}
          setIsVisible={setMenuVisible}
          width="80%"
        />
      </Spin>
    </div>
  );
};

export default Read
