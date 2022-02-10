/* eslint-disable no-unused-vars */
import { useCallback, useRef, useEffect } from 'react'

// 防抖
export function useDebounce(fn: Function, time: number, dep = []) {
  // 使用useRef存储保证fn和timeout的唯一性
  const { current } = useRef<any>({ fn, timeout: null })

  // 确保调用函数是最新的
  useEffect(() => {
    // console.log('fn变化')
    current.fn = fn
  }, [fn])

  return useCallback(function f(this: any, args) {
    if (current.timeout) {
      clearTimeout(current.timeout)
    }
    const context = this
    current.timeout = setTimeout(() => {
      current.fn.apply(context, typeof args === 'object' ? args : [args])
    }, time)
  }, dep)
}

// 节流
export function throttle(fn: Function, delay: number = 1000) {
  // let valid: boolean = true
  // return function (this: any) {
  //   if (!valid) {
  //     return
  //   }
  //   valid = false
  //   setTimeout(() => {
  //     fn.apply(this)
  //     valid = true
  //   }, delay)
  // }
}
