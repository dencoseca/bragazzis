import { useEffect, useRef } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'

export function useLocomotiveScroll() {
  const scrollRef = useRef<LocomotiveScroll | null>(null)

  useEffect(() => {
    scrollRef.current = new LocomotiveScroll()

    return () => {
      scrollRef.current?.destroy()
      scrollRef.current = null
    }
  }, [])

  return scrollRef
}
