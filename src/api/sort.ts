import { zsRequest } from './request'

export function getCate() {
  return zsRequest({
    url: '/cats/lv2/statistics'
  })
}

export function a() {}
