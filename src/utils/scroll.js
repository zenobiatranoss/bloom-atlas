import $ from 'jquery'

$.easing.bloom = (p) => 1 - Math.pow(1 - p, 4)

export const scrollToY = (y) => {
  const $root = $('html, body')
  const html = document.documentElement
  const target = Math.max(0, Math.round(y))
  const distance = Math.abs(target - window.scrollY)
  const duration = Math.min(1600, 700 + distance * 0.3)

  $root.stop(true)
  $(window).off('.bloom')
  html.style.scrollBehavior = 'auto'

  $(window).one('wheel.bloom touchstart.bloom', () => {
    $root.stop(true)
    html.style.scrollBehavior = ''
    $(window).off('.bloom')
  })

  $root.animate(
    { scrollTop: target },
    {
      duration,
      easing: 'bloom',
      complete: () => {
        html.style.scrollBehavior = ''
        $(window).off('.bloom')
      }
    }
  )
}

export const scrollToTop = () => scrollToY(0)

export const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  scrollToY(el.getBoundingClientRect().top + window.scrollY)
}
