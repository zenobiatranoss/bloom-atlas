import * as THREE from 'three'
import { seeded } from './math'

const cache = {}

const makeCanvas = (w, h) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export const veinTexture = (kind) => {
  if (cache[kind]) return cache[kind]
  const w = 128
  const h = 256
  const c = makeCanvas(w, h)
  const g = c.getContext('2d')
  g.fillStyle = '#8c8c8c'
  g.fillRect(0, 0, w, h)
  g.lineCap = 'round'

  const line = (x0, y0, cx, cy, x1, y1, width, alpha) => {
    g.strokeStyle = `rgba(0,0,0,${alpha})`
    g.lineWidth = width
    g.beginPath()
    g.moveTo(x0, y0)
    g.quadraticCurveTo(cx, cy, x1, y1)
    g.stroke()
  }

  if (kind === 'leaf') {
    line(w / 2, h, w / 2, h * 0.5, w / 2, 4, 7, 0.16)
    line(w / 2, h, w / 2, h * 0.5, w / 2, 4, 3.5, 0.35)
    for (let k = 1; k <= 8; k++) {
      const y = h * (0.94 - k * 0.1)
      const reach = h * 0.14
      line(w / 2, y, w * 0.3, y - reach * 0.3, w * 0.04, y - reach, 4, 0.12)
      line(w / 2, y, w * 0.3, y - reach * 0.3, w * 0.04, y - reach, 2, 0.28)
      line(w / 2, y, w * 0.7, y - reach * 0.3, w * 0.96, y - reach, 4, 0.12)
      line(w / 2, y, w * 0.7, y - reach * 0.3, w * 0.96, y - reach, 2, 0.28)
    }
  } else {
    for (let i = -5; i <= 5; i++) {
      const x0 = w / 2 + i * 4
      const x1 = w / 2 + i * 11
      line(x0, h, w / 2 + i * 8, h * 0.5, x1, 6, 5, 0.1)
      line(x0, h, w / 2 + i * 8, h * 0.5, x1, 6, 2, 0.24)
    }
  }

  const t = new THREE.CanvasTexture(c)
  t.anisotropy = 4
  cache[kind] = t
  return t
}

export const groundTexture = () => {
  if (cache.ground) return cache.ground
  const size = 512
  const c = makeCanvas(size, size)
  const g = c.getContext('2d')
  g.fillStyle = '#e9e9e9'
  g.fillRect(0, 0, size, size)
  const rand = seeded(31)

  for (let i = 0; i < 620; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 8 + rand() * 46
    const v = Math.floor(205 + rand() * 50)
    const a = 0.05 + rand() * 0.12
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const cx = x + ox * size
        const cy = y + oy * size
        if (cx + r < 0 || cx - r > size || cy + r < 0 || cy - r > size) continue
        const grad = g.createRadialGradient(cx, cy, 0, cx, cy, r)
        grad.addColorStop(0, `rgba(${v},${v},${v},${a})`)
        grad.addColorStop(1, `rgba(${v},${v},${v},0)`)
        g.fillStyle = grad
        g.fillRect(cx - r, cy - r, r * 2, r * 2)
      }
    }
  }

  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(0,0,0,${0.02 + rand() * 0.05})`
    g.fillRect(rand() * size, rand() * size, 1 + rand() * 2, 1 + rand() * 2)
  }

  const t = new THREE.CanvasTexture(c)
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  t.repeat.set(24, 24)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  cache.ground = t
  return t
}

export const glowTexture = () => {
  if (cache.glow) return cache.glow
  const c = makeCanvas(128, 128)
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.45)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  cache.glow = t
  return t
}
