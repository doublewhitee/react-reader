import { zsRequest } from './request'

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
