import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDispatch, useSelector } from 'react-redux'
import { blueprints } from '../../data/blueprints'
import { hash, seeded } from '../../utils/math'
import {
  buildPadGeometry,
  buildStamenGeometry,
  buildStemGeometry,
  buildTrumpetGeometry,
  buildTwigGeometry
} from '../../utils/geometry'
import { petalGeometry, buildFloretGeometry } from '../../utils/shapes'
import { veinTexture } from '../../utils/textures'
import PetalLayer from './Petals'
import { selectFlower, hoverFlower } from '../../store/slices/flowersSlice'

const SEED_COUNT = 520
const leafDefault = { base: '#2f5a36', mid: '#4a7d45', tip: '#78a95a' }

function SeedDisc({ spec, seed }) {
  const ref = useRef()

  useLayoutEffect(() => {
    const mesh = ref.current
    const rand = seeded(seed)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const inner = new THREE.Color(spec.inner)
    const outer = new THREE.Color(spec.outer)
    const seedColor = new THREE.Color(spec.seed)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < SEED_COUNT; i++) {
      const r = spec.radius * Math.sqrt((i + 0.5) / SEED_COUNT)
      const a = i * golden
      const k = r / spec.radius
      dummy.position.set(Math.cos(a) * r, 0.09 * (1 - k * k) + (rand() - 0.5) * 0.01, Math.sin(a) * r)
      dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3)
      const s = 0.034 * (0.8 + 0.5 * k)
      dummy.scale.set(s, s * 0.7, s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      color.copy(inner).lerp(outer, Math.pow(k, 1.3)).lerp(seedColor, rand() * 0.35)
      mesh.setColorAt(i, color)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [spec, seed])

  return (
    <group>
      <mesh position={[0, -0.02, 0]} scale={[1, 0.18, 1]}>
        <sphereGeometry args={[spec.radius * 1.02, 32, 12]} />
        <meshStandardMaterial color={spec.inner} roughness={0.9} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, SEED_COUNT]} raycast={() => null}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshStandardMaterial roughness={0.75} />
      </instancedMesh>
    </group>
  )
}

function Pod({ spec }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        i === 0
          ? [0, 0]
          : [Math.cos(((i - 1) / 6) * Math.PI * 2) * 0.095, Math.sin(((i - 1) / 6) * Math.PI * 2) * 0.095]
      ),
    []
  )
  return (
    <group position={[0, 0.07, 0]}>
      <mesh>
        <cylinderGeometry args={[0.17, 0.09, 0.2, 24]} />
        <meshStandardMaterial color={spec.color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.101, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.17, 24]} />
        <meshStandardMaterial color={spec.top} roughness={0.85} />
      </mesh>
      {dots.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.104, z]}>
          <sphereGeometry args={[0.022, 8, 6]} />
          <meshStandardMaterial color="#5a4b14" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Cluster({ spec, seed, openness }) {
  const group = useRef()
  const mesh = useRef()

  const geometry = useMemo(
    () => buildFloretGeometry({ colors: spec.floret, size: spec.size || 1 }),
    [spec]
  )

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.5,
        sheen: 1,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color('#ffffff'),
        bumpMap: veinTexture('petal'),
        bumpScale: 0.5
      }),
    []
  )

  useLayoutEffect(() => {
    const rand = seeded(seed)
    const dummy = new THREE.Object3D()
    const q = new THREE.Quaternion()
    const spinQ = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)
    const n = new THREE.Vector3()
    const color = new THREE.Color()
    const a = new THREE.Color(spec.mix[0])
    const b = new THREE.Color(spec.mix[1])
    const c = new THREE.Color(spec.mix[2])
    const golden = Math.PI * (3 - Math.sqrt(5))
    const total = spec.count

    for (let i = 0; i < total; i++) {
      const k = (i + 0.5) / total
      const cosT = 1 - (1 - Math.cos(spec.arc)) * k
      const sinT = Math.sqrt(1 - cosT * cosT)
      const phi = i * golden
      n.set(sinT * Math.cos(phi), cosT, sinT * Math.sin(phi))
      const r = spec.radius * (1 + (rand() - 0.5) * 0.08)
      dummy.position.set(n.x * r, n.y * r * 0.92, n.z * r)
      q.setFromUnitVectors(up, n)
      spinQ.setFromAxisAngle(up, rand() * Math.PI * 2)
      dummy.quaternion.copy(q).multiply(spinQ)
      dummy.scale.setScalar(0.85 + rand() * 0.4)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)

      const w = Math.min(1, k * 0.8 + rand() * 0.45)
      color.copy(a).lerp(b, w)
      if (rand() < 0.25) color.lerp(c, 0.55)
      color.multiplyScalar(0.88 + rand() * 0.2)
      mesh.current.setColorAt(i, color)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  }, [spec, seed])

  useFrame(() => {
    const o = openness.current
    const s = 0.72 + 0.28 * Math.min(1, Math.max(0, (o - 0.28) / 0.72))
    group.current.scale.setScalar(s)
  })

  return (
    <group ref={group} position={[0, spec.lift, 0]}>
      <instancedMesh
        ref={mesh}
        args={[geometry, material, spec.count]}
        frustumCulled={false}
        raycast={() => null}
      />
    </group>
  )
}

function Head({ bp, seed, openness, groupRef, position, scale = 1, tilt }) {
  const stamenGeo = useMemo(
    () => (bp.stamens && bp.stamens.count > 0 ? buildStamenGeometry({ ...bp.stamens, seed }) : null),
    [bp, seed]
  )
  const trumpetGeo = useMemo(() => (bp.core.type === 'trumpet' ? buildTrumpetGeometry(bp.core) : null), [bp])
  const stamenMat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 }), [])
  const trumpetMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.55,
        sheen: 0.8,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color('#ffffff')
      }),
    []
  )

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={tilt}>
      {bp.layers.map((layer, i) => (
        <PetalLayer key={i} spec={layer} colors={bp.colors} openness={openness} seed={seed + i * 13} />
      ))}
      {bp.core.type === 'disc' && <SeedDisc spec={bp.core} seed={seed} />}
      {bp.core.type === 'pod' && <Pod spec={bp.core} />}
      {bp.core.type === 'cluster' && <Cluster spec={bp.core} seed={seed} openness={openness} />}
      {trumpetGeo && <mesh geometry={trumpetGeo} material={trumpetMat} position={[0, 0.02, 0]} />}
      {stamenGeo && <mesh geometry={stamenGeo} material={stamenMat} position={[0, 0.06, 0]} raycast={() => null} />}
    </group>
  )
}

export default function Flower({ flower }) {
  const bp = blueprints[flower.id]
  const dispatch = useDispatch()
  const active = useSelector((s) => s.flowers.selectedId === flower.id)
  const activeRef = useRef(active)
  activeRef.current = active

  const root = useRef()
  const head = useRef()
  const openness = useRef(0.28)
  const hoverAmount = useRef(0)
  const hovered = useRef(false)
  const seed = useMemo(() => hash(flower.id), [flower.id])
  const phase = (seed % 628) / 100
  const [hitY, hitR] = bp.hit || [bp.headY * 0.6, 1.15]

  const stem = useMemo(
    () =>
      buildStemGeometry({
        headY: bp.headY,
        bendX: bp.bend[0],
        bendZ: bp.bend[1],
        radius: bp.stem.radius,
        color: bp.stem.color
      }),
    [bp]
  )
  const headPos = useMemo(() => stem.curve.getPointAt(1), [stem])

  const twigs = useMemo(
    () =>
      (bp.extras || []).map((e) => {
        const p = stem.curve.getPointAt(e.t)
        const q = p.clone().add(new THREE.Vector3(e.off[0], e.off[1], e.off[2]))
        return { geometry: buildTwigGeometry(p, q, 0.016, bp.stem.color), position: q, spec: e }
      }),
    [bp, stem]
  )

  const leaves = useMemo(
    () =>
      (bp.leaves || []).map((l, i) => ({
        spec: l,
        point: stem.curve.getPointAt(l.t),
        geometry: petalGeometry({
          shape: l.shape || 'pointed',
          length: l.length,
          width: l.width,
          bend: l.bend,
          cup: l.cup ?? 0.15,
          wave: l.wave ?? 1,
          colors: bp.leafColors || leafDefault,
          seed: seed + i * 5,
          vein: 0.12,
          segU: 8,
          segV: 14
        })
      })),
    [bp, stem, seed]
  )

  const pads = useMemo(
    () => (bp.pads || []).map((p, i) => ({ spec: p, geometry: buildPadGeometry({ ...p, seed: seed + i * 3 }) })),
    [bp, seed]
  )

  const companions = useMemo(() => bp.companions || [], [bp])
  const fixed = useMemo(() => companions.map((c) => ({ current: c.open ?? 0.28 })), [companions])

  const stemMat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }), [])
  const leafMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.6,
        bumpMap: veinTexture('leaf'),
        bumpScale: 1
      }),
    []
  )
  const padMat = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.55 }),
    []
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const goal = activeRef.current ? 1 : 0.28
    openness.current = THREE.MathUtils.damp(openness.current, goal, activeRef.current ? 1.6 : 2.4, dt)
    hoverAmount.current = THREE.MathUtils.damp(hoverAmount.current, hovered.current ? 1 : 0, 6, dt)
    if (root.current) {
      root.current.rotation.z = Math.sin(t * 0.55 + phase) * 0.014
      root.current.rotation.x = Math.cos(t * 0.42 + phase) * 0.01
      root.current.scale.setScalar(1 + hoverAmount.current * 0.03)
    }
    if (head.current) {
      head.current.rotation.set(bp.tilt[0] + Math.sin(t * 0.9 + phase) * 0.02, 0, bp.tilt[1])
    }
  })

  return (
    <group position={bp.position}>
      <group
        ref={root}
        onClick={(e) => {
          e.stopPropagation()
          dispatch(selectFlower(flower.id))
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          hovered.current = true
          dispatch(hoverFlower(flower.id))
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          hovered.current = false
          dispatch(hoverFlower(null))
          document.body.style.cursor = ''
        }}
      >
        <mesh geometry={stem.geometry} material={stemMat} />

        {twigs.map((tw, i) => (
          <mesh key={i} geometry={tw.geometry} material={stemMat} />
        ))}

        {leaves.map((l, i) => (
          <group key={i} position={[l.point.x, l.point.y, l.point.z]} rotation={[0, l.spec.az, 0]}>
            <group rotation={[l.spec.open, 0, 0]}>
              <mesh geometry={l.geometry} material={leafMat} />
            </group>
          </group>
        ))}

        {pads.map((p, i) => (
          <mesh
            key={i}
            geometry={p.geometry}
            material={padMat}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[p.spec.offset[0], 0.03, p.spec.offset[1]]}
          />
        ))}

        <Head bp={bp} seed={seed} openness={openness} groupRef={head} position={headPos} />

        {twigs.map((tw, i) => (
          <Head
            key={i}
            bp={bp}
            seed={seed + (i + 1) * 31}
            openness={openness}
            position={tw.position}
            scale={tw.spec.scale}
            tilt={[tw.spec.tilt[0], 0, tw.spec.tilt[1]]}
          />
        ))}

        {companions.map((c, i) => (
          <group
            key={`c${i}`}
            position={[c.off[0], 0, c.off[1]]}
            rotation={[0, c.rot || 0, 0]}
            scale={c.scale}
          >
            <mesh geometry={stem.geometry} material={stemMat} />
            <Head
              bp={bp}
              seed={seed + 100 + i * 17}
              openness={c.follow ? openness : fixed[i]}
              position={headPos}
              tilt={[bp.tilt[0], 0, bp.tilt[1]]}
            />
          </group>
        ))}

        <mesh position={[0, hitY, 0]}>
          <sphereGeometry args={[hitR, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}
