const src = `${import.meta.env.BASE_URL}song.mp3`
const VOLUME = 0.2

let audio = null
let timer = 0

const get = () => {
  if (!audio) {
    audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
  }
  return audio
}

const fadeTo = (target, ms, done) => {
  const a = get()
  clearInterval(timer)
  const from = a.volume
  const start = performance.now()
  timer = setInterval(() => {
    const k = Math.min(1, (performance.now() - start) / ms)
    a.volume = from + (target - from) * k
    if (k >= 1) {
      clearInterval(timer)
      if (done) done()
    }
  }, 40)
}

export const startMusic = () => {
  const a = get()
  const p = a.play()
  if (p && p.then) p.then(() => fadeTo(VOLUME, 2200)).catch(() => {})
}

export const stopMusic = () => {
  const a = get()
  fadeTo(0, 600, () => a.pause())
}
