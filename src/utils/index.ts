/* eslint-disable no-unused-vars */
import { useCallback, useRef, useEffect } from 'react'

// 防抖
export function debounce(fn: Function, delay: number) {
  let timer: any = null
  return function f(this: any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      const context = this
      fn.apply(context)
    }, delay)
  }
}

export function useDebounce(fn: Function, delay: number, dep = []) {
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
    }, delay)
  }, dep)
}

// 节流
export function useThrottle(fn: Function, delay: number, dep = []) {
  // 使用useRef存储保证fn和timeout的唯一性
  const { current } = useRef<any>({ fn, timeout: null })

  // 确保调用函数是最新的
  useEffect(() => {
    // console.log('fn变化')
    current.fn = fn
  }, [fn])

  // eslint-disable-next-line prefer-arrow-callback
  return useCallback(function f(this: any, args) {
    const context = this
    if (!current.timeout) {
      current.timeout = setTimeout(() => {
        current.fn.apply(context, typeof args === 'object' ? args : [args])
        delete current.timeout
      }, delay)
    }
  }, dep)
}
