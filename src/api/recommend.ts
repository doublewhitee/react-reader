import { zsRequest } from './request'

// 获取所有排行榜
export function getRankings() {
  return zsRequest({
    url: '/ranking/gender'
  })
}

// 获取单一排行榜
export function getSingleRank(rankingId: string) {
  return zsRequest({
    url: `/ranking/${rankingId}`
  })
}
