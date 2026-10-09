import { useEffect, useRef } from 'react'

export default function useMouseParallax() {
  const ref = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ref.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return ref
}
