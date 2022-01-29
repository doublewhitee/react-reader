import axios from 'axios'

// 追书神器
export function zsRequest(config: object) {
  const instance = axios.create({
    baseURL: 'zhuishu',
    timeout: 10000
  })

  return instance(config)
}

export function request() {}
