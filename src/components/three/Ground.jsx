import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useThemeRef from '../../hooks/useThemeRef'
import { groundTexture } from '../../utils/textures'
import { buildRockGeometry } from '../../utils/shapes'
import { seeded } from '../../utils/math'

const fract = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const rocks = [
  [3.7, 0.7, 0.5],
  [-4.1, 0.6, 0.42],
  [1.7, -2.5, 0.34],
  [-1.3, -5.2, 0.55],
  [4.3, -4.5, 0.45],
  [-6.3, -0.7, 0.4],
  [7.4, -1.2, 0.5]
]

function Earth() {
  const themeRef = useThemeRef()
  const init = themeRef.current
  const ref = useRef()
  const texture = useMemo(() => groundTexture(), [])
  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame((_, dt) => {
    ref.current.color.lerp(tmp.set(themeRef.current.earth), 1 - Math.exp(-3 * dt))
  })

  return (
    <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[70, 72]} />
      <meshStandardMaterial ref={ref} color={init.earth} map={texture} roughness={1} />
    </mesh>
  )
}

function Pond() {
  const themeRef = useThemeRef()
  const init = themeRef.current
  const water = useRef()
  const rings = useRef([])
  const tmp = useMemo(() => new THREE.Color(), [])
  const mats = useMemo(
    () =>
      Array.from(
        { length: 4 },
        () =>
          new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: THREE.DoubleSide
          })
      ),
    []
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    water.current.color.lerp(tmp.set(themeRef.current.water), 1 - Math.exp(-3 * dt))
    for (let i = 0; i < 4; i++) {
      const ring = rings.current[i]
      if (!ring) continue
      const k = t / (5 + i * 1.3) + i * 0.31
      const cycle = Math.floor(k)
      const phase = k - cycle
      const a = fract(cycle * 13.1 + i * 7.7) * Math.PI * 2
      const r = 0.3 + fract(cycle * 5.3 + i * 3.1) * 1.1
      ring.position.set(Math.cos(a) * r, -0.001, Math.sin(a) * r)
      ring.scale.setScalar(0.06 + phase * 0.7)
      mats[i].opacity = Math.sin(phase * Math.PI) * 0.32
    }
  })

  return (
    <group>
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.3, 72]} />
        <meshPhysicalMaterial
          ref={water}
          color={init.water}
          roughness={0.05}
          metalness={0}
          transparent
          opacity={0.92}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
      {mats.map((m, i) => (
        <mesh
          key={i}
          ref={(n) => {
            rings.current[i] = n
          }}
          material={m}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.88, 1, 56]} />
        </mesh>
      ))}
    </group>
  )
}

function Stones() {
  const themeRef = useThemeRef()
  const init = themeRef.current
  const mesh = useRef()
  const material = useRef()
  const geometry = useMemo(() => buildRockGeometry(), [])
  const tmp = useMemo(() => new THREE.Color(), [])
  const ring = 40
  const total = ring + rocks.length

  useLayoutEffect(() => {
    const rand = seeded(901)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    let n = 0

    for (let i = 0; i < ring; i++) {
      const a = (i / ring) * Math.PI * 2 + (rand() - 0.5) * 0.12
      const r = 2.42 + (rand() - 0.5) * 0.2
      const s = 0.12 + rand() * 0.14
      dummy.position.set(Math.cos(a) * r, s * 0.25 - 0.01, Math.sin(a) * r)
      dummy.rotation.set(rand() * 0.6, rand() * 6.28, rand() * 0.6)
      dummy.scale.set(s * (1 + rand() * 0.6), s * (0.6 + rand() * 0.4), s * (1 + rand() * 0.5))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(n, dummy.matrix)
      mesh.current.setColorAt(n, color.setScalar(0.8 + rand() * 0.3))
      n++
    }

    rocks.forEach(([x, z, s]) => {
      dummy.position.set(x, s * 0.3 - 0.02, z)
      dummy.rotation.set(rand() * 0.3, rand() * 6.28, rand() * 0.3)
      dummy.scale.set(s * (1 + rand() * 0.4), s * (0.7 + rand() * 0.3), s * (1 + rand() * 0.3))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(n, dummy.matrix)
      mesh.current.setColorAt(n, color.setScalar(0.85 + rand() * 0.2))
      n++
    })

    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  }, [])

  useFrame((_, dt) => {
    material.current.color.lerp(tmp.set(themeRef.current.stone), 1 - Math.exp(-3 * dt))
  })

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, total]} frustumCulled={false} raycast={() => null}>
      <meshStandardMaterial ref={material} vertexColors roughness={1} color={init.stone} />
    </instancedMesh>
  )
}

export default function Ground() {
  return (
    <>
      <Earth />
      <Pond />
      <Stones />
    </>
  )
}
