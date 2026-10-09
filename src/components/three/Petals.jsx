import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { petalGeometry } from '../../utils/shapes'
import { veinTexture } from '../../utils/textures'
import { seeded, clamp } from '../../utils/math'

const rotY = new THREE.Matrix4()
const shift = new THREE.Matrix4()
const tiltM = new THREE.Matrix4()
const sizeM = new THREE.Matrix4()
const out = new THREE.Matrix4()
const euler = new THREE.Euler()

export default function PetalLayer({ spec, colors, openness, seed }) {
  const mesh = useRef()
  const last = useRef(-1)
  const palette = spec.colors || colors

  const geometry = useMemo(
    () =>
      petalGeometry({
        shape: spec.shape,
        length: spec.length,
        width: spec.width,
        bend: spec.bend,
        cup: spec.cup,
        wave: spec.wave,
        colors: palette,
        seed
      }),
    [spec, palette, seed]
  )

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.55,
        metalness: 0,
        sheen: 1,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color(palette.tip).lerp(new THREE.Color('#ffffff'), 0.6),
        emissive: new THREE.Color(palette.mid),
        emissiveIntensity: 0.05,
        clearcoat: 0.12,
        clearcoatRoughness: 0.55,
        bumpMap: veinTexture('petal'),
        bumpScale: 0.6
      }),
    [palette]
  )

  const items = useMemo(() => {
    const rand = seeded(seed * 7 + 1)
    return Array.from({ length: spec.count }, (_, i) => ({
      az: (i / spec.count + (spec.offset || 0)) * Math.PI * 2 + (rand() - 0.5) * 0.22,
      scale: 0.9 + rand() * 0.2,
      wscale: 0.9 + rand() * 0.22,
      tilt: (rand() - 0.5) * 0.18,
      twist: (rand() - 0.5) * 0.3,
      delay: rand() * 0.25
    }))
  }, [spec.count, spec.offset, seed])

  useLayoutEffect(() => {
    const rand = seeded(seed * 3 + 5)
    const color = new THREE.Color()
    for (let i = 0; i < items.length; i++) {
      mesh.current.setColorAt(i, color.setScalar(0.88 + rand() * 0.16))
    }
    mesh.current.instanceColor.needsUpdate = true
    last.current = -1
  }, [items, seed])

  useFrame(() => {
    const o = openness.current
    if (Math.abs(o - last.current) < 0.0004) return
    last.current = o
    const closed = spec.closed ?? 0.15
    const m = mesh.current
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      const e = clamp((o - it.delay) / 0.7, 0, 1)
      const s = e * e * (3 - 2 * e)
      const rx = closed + (spec.open - closed) * s + it.tilt
      rotY.makeRotationY(it.az)
      shift.makeTranslation(0, 0, spec.radius || 0)
      euler.set(rx, 0, it.twist, 'XYZ')
      tiltM.makeRotationFromEuler(euler)
      sizeM.makeScale(it.wscale, it.scale, 1)
      out.copy(rotY).multiply(shift).multiply(tiltM).multiply(sizeM)
      m.setMatrixAt(i, out)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={[0, spec.lift || 0, 0]}>
      <instancedMesh
        ref={mesh}
        args={[geometry, material, items.length]}
        frustumCulled={false}
        raycast={() => null}
      />
    </group>
  )
}
