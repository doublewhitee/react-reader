import { zsRequest } from './request'

// 获取分类
export function getCate() {
  return zsRequest({
    url: '/cats/lv2/statistics'
  })
}

// 二级分类
export function getMinorCate() {
  return zsRequest({
    url: '/cats/lv2'
  })
}

// 按分类获取书籍列表
export function getBookList(type: string, gender: string, major: string, start: number, minor: string = '', limit: number = 20) {
  return zsRequest({
    url: '/book/by-categories',
    params: { type, gender, major, start, minor, limit }
  })
}
