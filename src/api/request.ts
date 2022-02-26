import axios from 'axios'

// 追书神器
export function zsRequest(config: object) {
  const instance = axios.create({
    baseURL: 'zhuishu',
    timeout: 10000
  })

  return instance(config)
}

// 笔趣阁[1]
export function bqgRequest1(config: object) {
  const instance = axios.create({
    baseURL: 'biquge1',
    timeout: 10000
  })

  return instance(config)
}

// 笔趣阁[2]
export function bqgRequest2(config: object) {
  const instance = axios.create({
    headers: { 'content-type': 'application/json; charset=utf-8' },
    baseURL: 'biquge2',
    timeout: 10000
  })

  return instance(config)
}
