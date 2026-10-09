import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { buildPetalGeometry, paint } from './geometry'
import { clamp, smoothstep } from './math'

export const withUV = (geometry, segU, segV) => {
  const uv = new Float32Array((segU + 1) * (segV + 1) * 2)
  let k = 0
  for (let j = 0; j <= segV; j++) {
    for (let i = 0; i <= segU; i++) {
      uv[k++] = i / segU
      uv[k++] = j / segV
    }
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geometry
}

export const petalGeometry = (opts) =>
  withUV(buildPetalGeometry(opts), opts.segU ?? 10, opts.segV ?? 16)

export const buildFloretGeometry = ({ colors, size = 1 }) => {
  const parts = []
  for (let k = 0; k < 4; k++) {
    const g = petalGeometry({
      shape: 'round',
      length: 0.2 * size,
      width: 0.115 * size,
      bend: 0.32,
      cup: 0.7,
      wave: 0.2,
      colors,
      seed: 11 + k * 7,
      segU: 4,
      segV: 5,
      vein: 0.07
    })
    const m = new THREE.Matrix4()
      .makeRotationY((k * Math.PI) / 2 + 0.12)
      .multiply(new THREE.Matrix4().makeRotationX(1.32))
    g.applyMatrix4(m)
    parts.push(g)
  }
  const heart = new THREE.SphereGeometry(0.02 * size, 6, 4)
  heart.translate(0, 0.012 * size, 0)
  paint(heart, '#cfd99a')
  parts.push(heart)
  return mergeGeometries(parts)
}

export const buildGrassGeometry = () => {
  const levels = 4
  const positions = []
  const colors = []
  const indices = []
  const base = new THREE.Color('#21451f')
  const tip = new THREE.Color('#8dbb5a')
  const c = new THREE.Color()

  for (let i = 0; i < levels; i++) {
    const t = i / levels
    const w = 0.028 * (1 - t * 0.8)
    const z = 0.24 * t * t
    c.copy(base).lerp(tip, Math.pow(t, 0.9))
    positions.push(-w, t, z, w, t, z)
    colors.push(c.r, c.g, c.b, c.r, c.g, c.b)
  }
  positions.push(0, 1, 0.24)
  colors.push(tip.r, tip.g, tip.b)

  for (let i = 0; i < levels - 1; i++) {
    const a = i * 2
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  const last = (levels - 1) * 2
  indices.push(last, last + 1, levels * 2)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export const buildRockGeometry = () => {
  const g = new THREE.IcosahedronGeometry(1, 1)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const d =
      1 +
      0.16 * Math.sin(x * 4.1 + y * 2.3) +
      0.12 * Math.sin(y * 5.7 + z * 3.1) +
      0.1 * Math.sin(z * 6.3 + x * 2.9)
    pos.setXYZ(i, x * d, y * d * 0.8, z * d)
  }
  g.computeVertexNormals()
  const normal = g.attributes.normal
  const col = new Float32Array(pos.count * 3)
  const low = new THREE.Color('#bdb7ae')
  const high = new THREE.Color('#9fb27c')
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const moss = smoothstep(0.35, 0.85, normal.getY(i))
    c.copy(low).lerp(high, moss * 0.6)
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return g
}

export const buildWingGeometry = (hex) => {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.05, 0.16, 0.3, 0.3, 0.5, 0.2)
  s.bezierCurveTo(0.62, 0.08, 0.5, -0.04, 0.38, -0.06)
  s.bezierCurveTo(0.44, -0.2, 0.3, -0.34, 0.12, -0.26)
  s.bezierCurveTo(0.04, -0.2, 0.01, -0.08, 0, 0)
  const g = new THREE.ShapeGeometry(s, 8)
  g.scale(0.34, 0.34, 1)
  g.rotateX(Math.PI / 2)
  const pos = g.attributes.position
  const near = new THREE.Color('#2a1d16')
  const far = new THREE.Color(hex)
  const c = new THREE.Color()
  const col = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const t = clamp(pos.getX(i) / 0.2, 0, 1)
    c.copy(near).lerp(far, smoothstep(0.05, 0.6, t))
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return g
}
