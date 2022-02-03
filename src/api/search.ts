import { zsRequest } from './request'

// 搜索热词
export function getSearchHotWords() {
  return zsRequest({
    url: '/book/search-hotwords'
  })
}

// 热门搜索
export function getHotWord() {
  return zsRequest({
    url: '/book/hot-word'
  })
}
