import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { flowers } from '../../data/flowers'
import { blueprints } from '../../data/blueprints'
import { petalGeometry } from '../../utils/shapes'
import { seeded, hash } from '../../utils/math'

const counts = { lotus: 9, sakura: 46, narcissus: 8, higanbana: 0, sunflower: 16, lily: 5, hydrangea: 26 }
const spreads = { lotus: 1.3, sakura: 1.7, narcissus: 0.9, higanbana: 0.9, sunflower: 1.3, lily: 0.9, hydrangea: 1.1 }

export default function GroundPetals() {
  const mesh = useRef()
  const total = useMemo(() => flowers.reduce((sum, f) => sum + (counts[f.id] || 0), 0), [])

  const geometry = useMemo(
    () =>
      petalGeometry({
        shape: 'round',
        length: 0.17,
        width: 0.085,
        bend: 0.3,
        cup: 0.5,
        colors: { base: '#ffffff', mid: '#ffffff', tip: '#ffffff' },
        seed: 9,
        segU: 4,
        segV: 5,
        vein: 0
      }),
    []
  )

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.7 }),
    []
  )

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    dummy.rotation.order = 'YXZ'
    const a = new THREE.Color()
    const b = new THREE.Color()
    const c = new THREE.Color()
    let n = 0

    flowers.forEach((f) => {
      const count = counts[f.id] || 0
      const bp = blueprints[f.id]
      const rand = seeded(hash(f.id) + 17)
      a.set(f.colors.primary)
      b.set(f.colors.secondary)
      for (let i = 0; i < count; i++) {
        const ang = rand() * Math.PI * 2
        const r = spreads[f.id] * Math.sqrt(rand()) + 0.15
        dummy.position.set(bp.position[0] + Math.cos(ang) * r, 0.012 + rand() * 0.008, bp.position[2] + Math.sin(ang) * r)
        dummy.rotation.set(Math.PI / 2 + (rand() - 0.5) * 0.25, rand() * Math.PI * 2, (rand() - 0.5) * 0.3)
        dummy.scale.setScalar((f.id === 'hydrangea' ? 0.55 : 0.7) + rand() * 0.6)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(n, dummy.matrix)
        c.copy(a).lerp(b, rand())
        mesh.current.setColorAt(n, c)
        n++
      }
    })

    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  }, [])

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, total]}
      frustumCulled={false}
      raycast={() => null}
    />
  )
}
