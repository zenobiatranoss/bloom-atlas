import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { blueprints } from '../../data/blueprints'
import { structureOf } from '../../data/lab'
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
import PetalLayer from '../three/Petals'

const SEED_COUNT = 520
const leafDefault = { base: '#2f5a36', mid: '#4a7d45', tip: '#78a95a' }
const UP = new THREE.Vector3(0, 1, 0)

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
      q.setFromUnitVectors(UP, n)
      spinQ.setFromAxisAngle(UP, rand() * Math.PI * 2)
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
      <instancedMesh ref={mesh} args={[geometry, material, spec.count]} frustumCulled={false} raycast={() => null} />
    </group>
  )
}

export default function LabFlower({ flower, explode, bloom, active, showLabels, onPart }) {
  const bp = blueprints[flower.id]
  const seed = useMemo(() => hash(flower.id), [flower.id])
  const phase = (seed % 628) / 100
  const accent = flower.colors.primary

  const root = useRef()
  const stemG = useRef()
  const headG = useRef()
  const petalsG = useRef()
  const coreG = useRef()
  const stamensG = useRef()
  const companionsG = useRef()
  const leafRefs = useRef([])
  const padRefs = useRef([])
  const mateRefs = useRef([])
  const calloutRefs = useRef([])
  const explodeRef = useRef(explode)
  const openRef = useRef(0.4 + 0.78 * bloom)
  const activeRef = useRef(active)
  activeRef.current = active

  const mats = useMemo(
    () => ({
      stem: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0.02, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0 }),
      leaf: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.62,
        sheen: 0.4,
        sheenRoughness: 0.6,
        sheenColor: new THREE.Color('#dff2c9'),
        clearcoat: 0.12,
        clearcoatRoughness: 0.6,
        bumpMap: veinTexture('leaf'),
        bumpScale: 1,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0
      }),
      pad: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.5,
        sheen: 0.5,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color('#c7f0d8'),
        clearcoat: 0.15,
        clearcoatRoughness: 0.55,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0
      }),
      stamen: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0 }),
      trumpet: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.5,
        sheen: 0.9,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color('#fff2c2'),
        clearcoat: 0.25,
        clearcoatRoughness: 0.5,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0
      })
    }),
    []
  )

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
        base: stem.curve.getPointAt(l.t).clone(),
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

  const stamenGeo = useMemo(
    () => (bp.stamens && bp.stamens.count > 0 ? buildStamenGeometry({ ...bp.stamens, seed }) : null),
    [bp, seed]
  )
  const trumpetGeo = useMemo(() => (bp.core.type === 'trumpet' ? buildTrumpetGeometry(bp.core) : null), [bp])

  const companions = useMemo(() => bp.companions || [], [bp])

  const callouts = useMemo(() => {
    const list = structureOf(flower).map((p, i) => ({
      id: p.id,
      label: p.label,
      anchor: new THREE.Vector3(p.at[0], p.at[1], p.at[2]),
      side: i % 2 === 0 ? 1 : -1
    }))

    const spread = (arr) => {
      arr.sort((a, b) => b.anchor.y - a.anchor.y)
      const top = bp.headY + 0.32
      arr.forEach((c, i) => {
        const x = c.side * 1.72
        const y = top - i * 0.46
        c.pos = new THREE.Vector3(x, y, 0.35)
      })
    }
    spread(list.filter((c) => c.side > 0))
    spread(list.filter((c) => c.side < 0))

    list.forEach((c) => {
      const elbow = new THREE.Vector3(
        c.anchor.x + (c.pos.x - c.anchor.x) * 0.55,
        c.pos.y,
        c.anchor.z + (c.pos.z - c.anchor.z) * 0.55
      )
      c.points = [
        [0, 0, 0],
        [elbow.x - c.anchor.x, elbow.y - c.anchor.y, elbow.z - c.anchor.z],
        [c.pos.x - c.anchor.x, c.pos.y - c.anchor.y, c.pos.z - c.anchor.z]
      ]
      c.relLabel = c.pos.clone().sub(c.anchor)
      c.quat = new THREE.Quaternion().setFromUnitVectors(UP, c.anchor.clone().sub(elbow).normalize())
    })
    return list
  }, [flower, bp])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    explodeRef.current = THREE.MathUtils.damp(explodeRef.current, explode, 5, dt)
    openRef.current = THREE.MathUtils.damp(openRef.current, 0.4 + 0.78 * bloom, 3, dt)
    const e = explodeRef.current
    const glow = activeRef.current
    const pulse = 1 + Math.sin(t * 3) * 0.02

    if (root.current) {
      root.current.rotation.z = Math.sin(t * 0.6 + phase) * 0.012
      root.current.rotation.x = Math.cos(t * 0.45 + phase) * 0.009
    }
    if (stemG.current) stemG.current.position.y = -0.28 * e
    if (headG.current) headG.current.position.set(headPos.x, headPos.y + 0.5 * e, headPos.z)
    if (petalsG.current) petalsG.current.scale.setScalar(glow === 'petals' ? pulse + 0.03 : 1)
    if (coreG.current) {
      coreG.current.position.y = 0.32 * e
      coreG.current.scale.setScalar(glow === 'core' ? pulse + 0.03 : 1)
    }
    if (stamensG.current) stamensG.current.position.y = 0.64 * e
    if (companionsG.current) companionsG.current.scale.setScalar(glow === 'companions' ? pulse + 0.03 : 1)

    leafRefs.current.forEach((g, i) => {
      if (!g) return
      const l = leaves[i].spec
      const az = l.az || 0
      g.position.set(
        leaves[i].base.x + Math.sin(az) * 0.95 * e,
        leaves[i].base.y + 0.12 * e,
        leaves[i].base.z + Math.cos(az) * 0.95 * e
      )
    })
    padRefs.current.forEach((g, i) => {
      if (!g) return
      const p = pads[i].spec
      const dir = new THREE.Vector3(p.offset[0], 0, p.offset[1]).normalize()
      g.position.set(p.offset[0] + dir.x * 0.65 * e, 0.03, p.offset[1] + dir.z * 0.65 * e)
    })
    mateRefs.current.forEach((g, i) => {
      if (!g) return
      const c = companions[i]
      const dir = new THREE.Vector3(c.off[0], 0, c.off[1]).normalize()
      g.position.set(c.off[0] + dir.x * 0.85 * e, 0.12 * e, c.off[1] + dir.z * 0.85 * e)
    })

    calloutRefs.current.forEach((g, i) => {
      if (!g) return
      const c = callouts[i]
      let dx = 0
      let dy = 0
      let dz = 0
      if (c.id === 'stem') dy = -0.14 * e
      else if (c.id === 'petals') dy = 0.5 * e
      else if (c.id === 'core') dy = 0.32 * e
      else if (c.id === 'stamens') dy = 0.64 * e
      else if (c.id === 'leaves' && leaves[0]) {
        const az = leaves[0].spec.az || 0
        dx = Math.sin(az) * 0.95 * e
        dy = 0.12 * e
        dz = Math.cos(az) * 0.95 * e
      } else if (c.id === 'pads' && pads[0]) {
        const dir = new THREE.Vector3(pads[0].spec.offset[0], 0, pads[0].spec.offset[1]).normalize()
        dx = dir.x * 0.65 * e
        dz = dir.z * 0.65 * e
      } else if (c.id === 'companions' && companions[0]) {
        const dir = new THREE.Vector3(companions[0].off[0], 0, companions[0].off[1]).normalize()
        dx = dir.x * 0.85 * e
        dy = 0.12 * e
        dz = dir.z * 0.85 * e
      }
      g.position.set(c.anchor.x + dx, c.anchor.y + dy, c.anchor.z + dz)
    })

    const set = (m, on) => {
      m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, on ? 0.3 : 0, 6, dt)
    }
    set(mats.stem, glow === 'stem')
    set(mats.leaf, glow === 'leaves')
    set(mats.pad, glow === 'pads')
    set(mats.stamen, glow === 'stamens')
    set(mats.trumpet, glow === 'core')
  })

  const select = (id) => () => onPart(id)

  return (
    <group ref={root} position={[0, -bp.headY * 0.5, 0]}>
      <group ref={stemG} onClick={select('stem')}>
        <mesh geometry={stem.geometry} material={mats.stem} />
        {twigs.map((tw, i) => (
          <mesh key={i} geometry={tw.geometry} material={mats.stem} />
        ))}
      </group>

      {leaves.map((l, i) => (
        <group
          key={i}
          ref={(n) => {
            leafRefs.current[i] = n
          }}
          position={[l.base.x, l.base.y, l.base.z]}
          rotation={[0, l.spec.az, 0]}
          onClick={select('leaves')}
        >
          <group rotation={[l.spec.open, 0, 0]}>
            <mesh geometry={l.geometry} material={mats.leaf} />
          </group>
        </group>
      ))}

      {pads.map((p, i) => (
        <group
          key={i}
          ref={(n) => {
            padRefs.current[i] = n
          }}
          position={[p.spec.offset[0], 0.03, p.spec.offset[1]]}
          onClick={select('pads')}
        >
          <mesh geometry={p.geometry} material={mats.pad} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
      ))}

      <group ref={headG} position={headPos} rotation={[bp.tilt[0], 0, bp.tilt[1]]}>
        <group ref={petalsG} onClick={select('petals')}>
          {bp.layers.map((layer, i) => (
            <PetalLayer key={i} spec={layer} colors={bp.colors} openness={openRef} seed={seed + i * 13} />
          ))}
          {bp.core.type === 'cluster' && <Cluster spec={bp.core} seed={seed} openness={openRef} />}
        </group>

        <group ref={coreG} onClick={select('core')}>
          {bp.core.type === 'disc' && <SeedDisc spec={bp.core} seed={seed} />}
          {bp.core.type === 'pod' && <Pod spec={bp.core} />}
          {trumpetGeo && <mesh geometry={trumpetGeo} material={mats.trumpet} position={[0, 0.02, 0]} />}
        </group>

        <group ref={stamensG} onClick={select('stamens')}>
          {stamenGeo && <mesh geometry={stamenGeo} material={mats.stamen} position={[0, 0.06, 0]} raycast={() => null} />}
        </group>

        {twigs.map((tw, i) => (
          <group key={i} position={[tw.position.x - headPos.x, tw.position.y - headPos.y, tw.position.z - headPos.z]} scale={tw.spec.scale} rotation={[tw.spec.tilt[0], 0, tw.spec.tilt[1]]}>
            {bp.layers.map((layer, k) => (
              <PetalLayer key={k} spec={layer} colors={bp.colors} openness={openRef} seed={seed + 31 * (i + 1) + k * 13} />
            ))}
          </group>
        ))}
      </group>

      <group ref={companionsG}>
        {companions.map((c, i) => (
          <group
            key={`c${i}`}
            ref={(n) => {
              mateRefs.current[i] = n
            }}
            position={[c.off[0], 0, c.off[1]]}
            rotation={[0, c.rot || 0, 0]}
            scale={c.scale}
            onClick={select('companions')}
          >
            <mesh geometry={stem.geometry} material={mats.stem} />
            <group position={headPos} rotation={[bp.tilt[0], 0, bp.tilt[1]]}>
              {bp.layers.map((layer, k) => (
                <PetalLayer key={k} spec={layer} colors={bp.colors} openness={openRef} seed={seed + 100 + i * 17 + k * 13} />
              ))}
            </group>
          </group>
        ))}
      </group>

      {showLabels &&
        callouts.map((c, i) => (
          <group
            key={c.id}
            ref={(n) => {
              calloutRefs.current[i] = n
            }}
            position={c.anchor}
          >
            <Line
              points={c.points}
              color={accent}
              lineWidth={active === c.id ? 2.4 : 1.2}
              transparent
              opacity={active === c.id ? 0.95 : 0.55}
            />
            <mesh quaternion={c.quat}>
              <coneGeometry args={[0.028, 0.085, 8]} />
              <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={active === c.id ? 1 : 0.8} />
            </mesh>
            <Html position={c.relLabel} center zIndexRange={[24, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                className={`lab-pin${active === c.id ? ' is-active' : ''}`}
                onClick={select(c.id)}
              >
                <i className="lab-pin__no">{String(i + 1).padStart(2, '0')}</i>
                <span className="lab-pin__dot" />
                <span className="lab-pin__label">{c.label}</span>
              </button>
            </Html>
          </group>
        ))}
    </group>
  )
}
