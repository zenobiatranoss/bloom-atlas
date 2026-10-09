import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { seeded, smoothstep } from './math'

export const paint = (geometry, hex) => {
  const color = new THREE.Color(hex)
  const count = geometry.attributes.position.count
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    arr[i * 3] = color.r
    arr[i * 3 + 1] = color.g
    arr[i * 3 + 2] = color.b
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(arr, 3))
  return geometry
}

const profile = (shape, t) => {
  const base = 0.15 + 0.85 * smoothstep(0, 0.3, t)
  let w
  if (shape === 'round') w = Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(t, 0.55))), 0.5)
  else if (shape === 'notched') w = Math.pow(Math.max(0, Math.sin(Math.PI * 0.8 * Math.pow(t, 0.75))), 0.8)
  else if (shape === 'curled') w = Math.max(0, Math.sin(Math.PI * Math.pow(t, 0.8))) * (1 - 0.3 * t)
  else w = Math.max(0, Math.sin(Math.PI * Math.pow(t, 0.72)))
  return w * base
}

export const buildPetalGeometry = ({
  shape = 'pointed',
  length = 1,
  width = 0.3,
  bend = 0.4,
  cup = 0.3,
  wave = 1,
  colors,
  seed = 1,
  segU = 10,
  segV = 16,
  vein = 0.07
}) => {
  const rand = seeded(seed)
  const phase = rand() * 6.28
  const rows = []
  const dl = length / segV
  let y = 0
  let z = 0
  for (let j = 0; j <= segV; j++) {
    rows.push([y, z])
    const theta = bend * Math.pow(j / segV, 1.7)
    y += Math.cos(theta) * dl
    z += Math.sin(theta) * dl
  }

  const cb = new THREE.Color(colors.base)
  const cm = new THREE.Color(colors.mid)
  const ct = new THREE.Color(colors.tip)
  const white = new THREE.Color('#ffffff')
  const tint = new THREE.Color()

  const positions = []
  const colorArr = []
  const indices = []

  for (let j = 0; j <= segV; j++) {
    const t = j / segV
    const w = width * profile(shape, t)
    for (let i = 0; i <= segU; i++) {
      const u = -1 + (2 * i) / segU
      const x = u * w
      const ripple =
        0.035 * wave * length * Math.sin(u * 2.4 + t * 6 + phase) * Math.pow(Math.abs(u), 1.2) * smoothstep(0.25, 1, t)
      const notch =
        shape === 'notched' ? -length * 0.15 * smoothstep(0.76, 1, t) * Math.pow(1 - Math.abs(u), 2.2) : 0
      positions.push(x, rows[j][0] + notch, rows[j][1] - (cup * x * x) / Math.max(width, 0.01) + ripple)

      if (t < 0.45) tint.copy(cb).lerp(cm, t / 0.45)
      else tint.copy(cm).lerp(ct, (t - 0.45) / 0.55)
      tint.multiplyScalar(1 - vein * (0.5 + 0.5 * Math.cos(u * Math.PI * 5)) * smoothstep(0.05, 0.5, t))
      tint.lerp(white, Math.pow(Math.abs(u), 5) * 0.12)
      colorArr.push(tint.r, tint.g, tint.b)
    }
  }

  for (let j = 0; j < segV; j++) {
    for (let i = 0; i < segU; i++) {
      const a = j * (segU + 1) + i
      const b = a + 1
      const c = a + segU + 1
      const d = c + 1
      indices.push(a, b, c, b, d, c)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArr, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export const buildStemGeometry = ({ headY, bendX, bendZ, radius, color }) => {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(bendX * 0.2, headY * 0.33, bendZ * 0.2),
    new THREE.Vector3(bendX * 0.7, headY * 0.66, bendZ * 0.7),
    new THREE.Vector3(bendX, headY, bendZ)
  ])
  const segs = 48
  const radial = 8
  const geometry = new THREE.TubeGeometry(curve, segs, radius, radial, false)
  const pos = geometry.attributes.position
  const p = new THREE.Vector3()
  const v = new THREE.Vector3()
  for (let i = 0; i <= segs; i++) {
    const t = i / segs
    const s = 1.3 - 0.45 * t
    curve.getPointAt(t, p)
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j
      v.fromBufferAttribute(pos, idx)
      v.sub(p).multiplyScalar(s).add(p)
      pos.setXYZ(idx, v.x, v.y, v.z)
    }
  }
  geometry.computeVertexNormals()
  paint(geometry, color)
  return { geometry, curve }
}

export const buildTwigGeometry = (from, to, radius, color) => {
  const mid = from.clone().lerp(to, 0.5)
  mid.y += 0.08
  const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone())
  return paint(new THREE.TubeGeometry(curve, 10, radius, 5, false), color)
}

export const buildStamenGeometry = ({
  count,
  length,
  spread,
  lift = 0.7,
  thick = 0.007,
  tipRadius = 0.02,
  filament,
  tip,
  seed = 3
}) => {
  const rand = seeded(seed)
  const parts = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.5
    const k = 0.7 + rand() * 0.3
    const sp = spread * (0.55 + rand() * 0.45)
    const p0 = new THREE.Vector3(0, 0, 0)
    const p1 = new THREE.Vector3(Math.cos(a) * sp * 0.25, length * k * lift, Math.sin(a) * sp * 0.25)
    const p2 = new THREE.Vector3(Math.cos(a) * sp, length * k, Math.sin(a) * sp)
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2)
    parts.push(paint(new THREE.TubeGeometry(curve, 8, thick, 4, false), filament))
    const sphere = new THREE.SphereGeometry(tipRadius * (0.8 + rand() * 0.5), 8, 6)
    sphere.translate(p2.x, p2.y, p2.z)
    parts.push(paint(sphere, tip))
  }
  return mergeGeometries(parts)
}

export const buildTrumpetGeometry = ({ color, rim, height = 0.56 }) => {
  const pts = []
  for (let k = 0; k <= 14; k++) {
    const t = k / 14
    pts.push(new THREE.Vector2(0.075 + 0.23 * Math.pow(t, 2.4), t * height))
  }
  const geometry = new THREE.LatheGeometry(pts, 56)
  const pos = geometry.attributes.position
  const col = new Float32Array(pos.count * 3)
  const a = new THREE.Color(color)
  const b = new THREE.Color(rim)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const t = y / height
    const ang = Math.atan2(z, x)
    const ruf = smoothstep(0.72, 1, t)
    const r = Math.hypot(x, z) * (1 + 0.11 * ruf * Math.sin(ang * 12))
    pos.setXYZ(i, Math.cos(ang) * r, y + 0.035 * ruf * Math.sin(ang * 12 + 1.2), Math.sin(ang) * r)
    c.copy(a).lerp(b, Math.pow(t, 1.5))
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(col, 3))
  geometry.computeVertexNormals()
  return geometry
}

export const buildPadGeometry = ({ radius, color, rim, seed = 1 }) => {
  const rand = seeded(seed)
  const phase = rand() * 6
  const rings = 14
  const segs = 64
  const a = new THREE.Color(color)
  const b = new THREE.Color(rim)
  const c = new THREE.Color()
  const positions = []
  const colorArr = []
  const indices = []
  for (let j = 0; j <= rings; j++) {
    const k = j / rings
    for (let i = 0; i <= segs; i++) {
      const th = (i / segs) * Math.PI * 2
      const rr = radius * k * (1 + 0.04 * Math.sin(th * 5 + phase))
      const h = Math.pow(k, 3) * 0.16 + 0.03 * Math.sin(th * 7 + phase) * Math.pow(k, 4)
      positions.push(Math.cos(th) * rr, Math.sin(th) * rr, h)
      c.copy(a).lerp(b, Math.pow(k, 1.2) * (0.85 + rand() * 0.15))
      colorArr.push(c.r, c.g, c.b)
    }
  }
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segs; i++) {
      const p = j * (segs + 1) + i
      const q = p + 1
      const r = p + segs + 1
      const s = r + 1
      indices.push(p, q, r, q, s, r)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArr, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
