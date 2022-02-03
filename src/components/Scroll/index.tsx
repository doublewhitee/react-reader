import React, { useState, useEffect, useImperativeHandle } from 'react'
import BScroll from 'better-scroll'

interface ScrollProps {
  probeType?: number
}

const Scroll: React.FC<any> = React.forwardRef<any, ScrollProps>((props, ref) => {
  const [bScroll, setBScroll] = useState<any>()
  // const wrapper: any = useRef()
  const { probeType, children } = props

  useEffect(() => {
    const wrapper = document.querySelector('.scroll-wrapper')
    const scroll = new BScroll(wrapper as any, {
      click: true,
      probeType
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
    <div className="scroll-wrapper" ref={ref} style={{ height: '100%', overflow: 'hidden' }}>
      <div className="scroll-content">
        {children}
      </div>
    </div>
  )
})

Scroll.defaultProps = {
  probeType: 0
}

export default Scroll
