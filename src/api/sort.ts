import { zsRequest } from './request'

// 获取分类
export function getCate() {
  return zsRequest({
    url: '/cats/lv2/statistics'
  })
}

//
export function getMinorCate() {
  return zsRequest({
    url: '/cats/lv2'
  })
}
