import { useEffect, useRef, useState } from 'react'

export default function useInView(rootMargin = '180px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setSeen(true)
      },
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView, seen]
}
