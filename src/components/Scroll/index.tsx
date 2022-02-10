import React, { useState, useEffect, useImperativeHandle } from 'react'
import BScroll from 'better-scroll'

interface ScrollProps {
  probeType?: number
  direction?: 'horizontal' | 'vertical'
  id?: string
}

const Scroll: React.FC<any> = React.forwardRef<any, ScrollProps>((props, ref) => {
  const [bScroll, setBScroll] = useState<any>()
  // const wrapper: any = useRef()
  const { probeType, direction, id, children } = props

  useEffect(() => {
    const wrapper = document.getElementById(id!)
    const scroll = new BScroll(wrapper as any, {
      click: true,
      probeType,
      scrollX: direction === 'horizontal',
      scrollY: direction === 'vertical'
    })
    setBScroll(scroll)
  }, [])

  // 使用 ref 时自定义暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    refresh: () => {
      if (bScroll) {
        bScroll.refresh()
      }
    },
    scrollTo: (x: number, y: number, time: number = 500) => {
      if (bScroll) {
        bScroll.scrollTo(x, y, time)
      }
    }
  }))

  return (
    <div
      id={id}
      className="scroll-wrapper"
      ref={ref}
      style={{ height: '100%', overflow: 'hidden' }}
    >
      {/* inline-block解决横向scroll问题 */}
      <div className="scroll-content" style={{ display: direction === 'horizontal' ? 'inline-block' : 'block' }}>
        {children}
      </div>
    </div>
  )
})

Scroll.defaultProps = {
  probeType: 0,
  direction: 'vertical',
  id: 'scroll-wrapper'
}

export default Scroll
