import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelector } from 'react-redux'
import { blueprints } from '../../data/blueprints'
import { sceneThemes } from '../../utils/colors'
import { buildPetalGeometry } from '../../utils/geometry'
import { clamp, seeded } from '../../utils/math'
import { selectSelectedFlower } from '../../store/slices/flowersSlice'

const makeSprite = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function Pollen({ count = 420 }) {
  const group = useRef()
  const points = useRef()
  const material = useRef()
  const theme = useSelector((s) => s.theme.current)
  const flower = useSelector(selectSelectedFlower)
  const themeRef = useRef(theme)
  themeRef.current = theme
  const flowerRef = useRef(flower)
  flowerRef.current = flower
  const texture = useMemo(makeSprite, [])
  const tint = useMemo(() => new THREE.Color(), [])

  const data = useMemo(() => {
    const rand = seeded(11)
    const pos = new Float32Array(count * 3)
    const meta = new Float32Array(count * 5)
    for (let i = 0; i < count; i++) {
      meta[i * 5] = 0.05 + rand() * 0.17
      meta[i * 5 + 1] = rand() * 6.28
      meta[i * 5 + 2] = 0.2 + rand() * 0.6
      meta[i * 5 + 3] = (rand() - 0.5) * 16
      meta[i * 5 + 4] = (rand() - 0.5) * 14 - 1
      pos[i * 3] = meta[i * 5 + 3]
      pos[i * 3 + 1] = rand() * 7
      pos[i * 3 + 2] = meta[i * 5 + 4]
    }
    return { pos, meta }
  }, [count])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const attr = points.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const speed = data.meta[i * 5]
      const ph = data.meta[i * 5 + 1]
      const sway = data.meta[i * 5 + 2]
      let y = data.pos[i * 3 + 1] + speed * dt
      if (y > 7) y -= 7
      data.pos[i * 3 + 1] = y
      data.pos[i * 3] = data.meta[i * 5 + 3] + Math.sin(t * 0.35 + ph) * sway
      data.pos[i * 3 + 2] = data.meta[i * 5 + 4] + Math.cos(t * 0.3 + ph) * sway
    }
    attr.needsUpdate = true
    const bp = blueprints[flowerRef.current.id]
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, bp.position[0], 1.5, dt)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, bp.position[2], 1.5, dt)
    material.current.color.lerp(tint.set(sceneThemes[themeRef.current].pollen), 1 - Math.exp(-3 * dt))
  })

  return (
    <group ref={group}>
      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={material}
          map={texture}
          size={0.09}
          transparent
          opacity={0.7}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

function FallingPetals({ count = 90 }) {
  const group = useRef()
  const mesh = useRef()
  const flower = useSelector(selectSelectedFlower)
  const flowerRef = useRef(flower)
  flowerRef.current = flower
  const ratio = useRef(0.2)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tint = useMemo(() => new THREE.Color(), [])

  const geometry = useMemo(
    () =>
      buildPetalGeometry({
        shape: 'round',
        length: 0.2,
        width: 0.1,
        bend: 0.4,
        cup: 0.5,
        colors: { base: '#ffffff', mid: '#ffffff', tip: '#ffffff' },
        seed: 5,
        segU: 4,
        segV: 5,
        vein: 0
      }),
    []
  )
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, vertexColors: true, roughness: 0.7 }),
    []
  )

  const items = useMemo(() => {
    const rand = seeded(23)
    return Array.from({ length: count }, () => ({
      x0: (rand() - 0.5) * 12,
      z0: (rand() - 0.5) * 10 - 1,
      y0: rand() * 7,
      speed: 0.18 + rand() * 0.3,
      ax: 0.3 + rand() * 0.7,
      az: 0.2 + rand() * 0.5,
      f: 0.4 + rand() * 0.6,
      phase: rand() * 6.28,
      rx: 0.4 + rand() * 1.2,
      ry: 0.3 + rand() * 1,
      rz: 0.3 + rand() * 0.9,
      size: 0.8 + rand() * 0.9,
      shade: 0.75 + rand() * 0.25
    }))
  }, [count])

  useLayoutEffect(() => {
    const c = new THREE.Color()
    items.forEach((it, i) => mesh.current.setColorAt(i, c.setScalar(it.shade)))
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [items])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const sel = flowerRef.current
    const goal = sel.id === 'sakura' ? 1 : sel.id === 'lotus' ? 0.35 : 0.18
    ratio.current = THREE.MathUtils.damp(ratio.current, goal, 1.2, dt)
    material.color.lerp(tint.set(sel.colors.primary), 1 - Math.exp(-2 * dt))
    const bp = blueprints[sel.id]
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, bp.position[0], 1.5, dt)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, bp.position[2], 1.5, dt)
    for (let i = 0; i < count; i++) {
      const it = items[i]
      let y = (it.y0 - t * it.speed) % 7
      if (y < 0) y += 7
      dummy.position.set(
        it.x0 + Math.sin(t * it.f + it.phase) * it.ax,
        y,
        it.z0 + Math.cos(t * it.f * 0.8 + it.phase) * it.az
      )
      dummy.rotation.set(t * it.rx + it.phase, t * it.ry, t * it.rz)
      dummy.scale.setScalar(clamp((ratio.current - i / count) * 10, 0, 1) * it.size)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} raycast={() => null} />
    </group>
  )
}

export default function Particles() {
  return (
    <>
      <Pollen />
      <FallingPetals />
    </>
  )
}
