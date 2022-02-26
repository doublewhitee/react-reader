import { zsRequest, bqgRequest1, bqgRequest2 } from './request'

// 书籍详情
export function getBookInfo(id: string) {
  return zsRequest({
    url: `/book/${id}`
  })
}

// 根据某小说Id获取推荐小说
export function getRecommend(id: string) {
  return zsRequest({
    url: `book/${id}/recommend`
  })
}

// 搜索小说获取ID[笔趣阁1]
export function getBiQuGeID(key: string) {
  return bqgRequest1({
    url: '/search.aspx',
    params: { key, page: 1, siteid: 'app2' }
  })
}

// 获取章节列表
export function getBookMenu(id: string | number) {
  return bqgRequest2({
    url: `/book/${id}/`
  })
}

// 书评
export function getBookReview(book: string, sort: 'updated' | 'created' | 'helpful' | 'comment-count', start: number) {
  return zsRequest({
    url: '/post/review/by-book',
    params: { book, sort, start, limit: 10 }
  })
}
