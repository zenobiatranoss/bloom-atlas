import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import $ from 'jquery'
import { clamp } from '../utils/math'
import { setScrollProgress } from '../store/slices/uiSlice'

const sections = ['questions', 'herbarium', 'notes']

export default function useScrollProgress() {
  const dispatch = useDispatch()

  useEffect(() => {
    const root = document.documentElement
    let away = null
    let queued = false

    const update = () => {
      queued = false
      const vh = window.innerHeight
      const y = window.scrollY
      const fade = 1 - clamp(y / (vh * 0.5), 0, 1)

      root.style.setProperty('--hero-fade', fade.toFixed(3))
      root.classList.toggle('hero-away', fade < 0.02)
      root.classList.toggle('nav-solid', y > vh * 0.6)

      let current = 'garden'
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= vh * 0.4) current = id
      })
      if (root.dataset.section !== current) root.dataset.section = current

      const nextAway = y > vh * 1.02
      if (nextAway !== away) {
        away = nextAway
        dispatch(setScrollProgress(nextAway ? 1 : 0))
      }
    }

    const queue = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }

    $(window).on('scroll.progress resize.progress', queue)
    update()

    return () => {
      $(window).off('.progress')
    }
  }, [dispatch])
}
