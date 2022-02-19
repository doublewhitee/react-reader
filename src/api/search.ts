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

// 搜索自动补充
export function getAutoComplete(query: string) {
  return zsRequest({
    url: '/book/auto-complete',
    params: { query }
  })
}

// 模糊搜索书籍
export function getFuzzySearch(query: string, start: number, limit: number = 20) {
  return zsRequest({
    url: '/book/fuzzy-search',
    params: { query, start, limit }
  })
}
