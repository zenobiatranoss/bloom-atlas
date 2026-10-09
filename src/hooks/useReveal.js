import { useEffect } from 'react'
import $ from 'jquery'

export default function useReveal() {
  useEffect(() => {
    const root = document.documentElement
    let queued = false

    const check = () => {
      const limit = window.innerHeight * 0.92
      $('[data-reveal]:not(.is-in)').each(function () {
        if (this.getBoundingClientRect().top < limit) $(this).addClass('is-in')
      })
    }

    const queue = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        check()
      })
    }

    root.classList.add('reveal-ready')
    $(window).on('scroll.reveal resize.reveal', queue)

    const observer = new MutationObserver(queue)
    const chapters = document.querySelector('.chapters')
    if (chapters) observer.observe(chapters, { childList: true, subtree: true })

    queue()

    return () => {
      $(window).off('.reveal')
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}
