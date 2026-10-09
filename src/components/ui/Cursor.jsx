import { useEffect, useRef } from 'react'
import $ from 'jquery'
import { useSelector } from 'react-redux'
import { selectHoveredFlower } from '../../store/slices/flowersSlice'

export default function Cursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const hovered = useSelector(selectHoveredFlower)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    const cursor = cursorRef.current
    const dot = dotRef.current
    const $cursor = $(cursor)
    const $dot = $(dot)
    const $label = $(labelRef.current)
    const $root = $(document.documentElement)
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const eased = { x: target.x, y: target.y }
    let seen = false
    let frame = 0

    const loop = () => {
      eased.x += (target.x - eased.x) * 0.17
      eased.y += (target.y - eased.y) * 0.17
      cursor.style.transform = `translate3d(${eased.x.toFixed(1)}px, ${eased.y.toFixed(1)}px, 0)`
      frame = requestAnimationFrame(loop)
    }

    const show = () => {
      $cursor.addClass('is-visible')
      $dot.addClass('is-visible')
    }

    const hide = () => {
      $cursor.removeClass('is-visible')
      $dot.removeClass('is-visible')
    }

    document.body.classList.add('has-cursor')
    loop()

    $(document)
      .on('mousemove.cursor', (e) => {
        target.x = e.clientX
        target.y = e.clientY
        if (!seen) {
          eased.x = e.clientX
          eased.y = e.clientY
          seen = true
        }
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        show()
      })
      .on('mousedown.cursor', () => $cursor.addClass('is-press'))
      .on('mouseup.cursor', () => $cursor.removeClass('is-press'))
      .on('mouseenter.cursor', '[data-cursor]', function () {
        $label.text($(this).attr('data-cursor'))
        $cursor.addClass('is-label')
        $dot.addClass('is-hidden')
      })
      .on('mouseleave.cursor', '[data-cursor]', () => {
        $cursor.removeClass('is-label')
        $dot.removeClass('is-hidden')
      })

    $root.on('mouseleave.cursor', hide).on('mouseenter.cursor', show)

    return () => {
      cancelAnimationFrame(frame)
      $(document).off('.cursor')
      $root.off('.cursor')
      document.body.classList.remove('has-cursor')
    }
  }, [])

  useEffect(() => {
    const $cursor = $(cursorRef.current)
    const $dot = $(dotRef.current)
    if (hovered) {
      $(labelRef.current).text(hovered.name)
      $cursor.addClass('is-label')
      $dot.addClass('is-hidden')
    } else {
      $cursor.removeClass('is-label')
      $dot.removeClass('is-hidden')
    }
  }, [hovered])

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden="true">
        <div className="cursor__ring">
          <span ref={labelRef} className="cursor__label" />
        </div>
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
