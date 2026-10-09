import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useThemeRef from '../../hooks/useThemeRef'
import { buildGrassGeometry } from '../../utils/shapes'
import { seeded } from '../../utils/math'

export default function Grass() {
  const themeRef = useThemeRef()
  const init = themeRef.current
  const mesh = useRef()
  const time = useMemo(() => ({ value: 0 }), [])
  const tmp = useMemo(() => new THREE.Color(), [])
  const geometry = useMemo(() => buildGrassGeometry(), [])

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.85,
      color: init.grass
    })
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = time
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          float sway = sin(uTime * 1.6 + instanceMatrix[3].x * 0.9 + instanceMatrix[3].z * 0.6) * 0.5
            + sin(uTime * 2.7 + instanceMatrix[3].x * 2.1) * 0.25;
          float bendAmount = position.y * position.y;
          transformed.x += sway * 0.09 * bendAmount;
          transformed.z += sway * 0.05 * bendAmount;`
        )
    }
    return m
  }, [init, time])

  const blades = useMemo(() => {
    const rand = seeded(2024)
    const list = []
    let clumps = 0
    while (clumps < 760) {
      const x = (rand() * 2 - 1) * 10.5
      const z = -8 + rand() * 11.5
      const nx = x / 10.5
      const nz = (z + 2.5) / 5.75
      if (nx * nx + nz * nz > 1) continue
      if (Math.hypot(x, z) < 2.55) continue
      clumps++
      const count = 3 + Math.floor(rand() * 4)
      for (let b = 0; b < count; b++) {
        const bx = x + (rand() - 0.5) * 0.45
        const bz = z + (rand() - 0.5) * 0.45
        if (Math.hypot(bx, bz) < 2.5) continue
        list.push({
          x: bx,
          z: bz,
          ry: rand() * Math.PI * 2,
          w: 0.8 + rand() * 0.8,
          h: rand() < 0.08 ? 0.7 + rand() * 0.25 : 0.22 + rand() * 0.45,
          c: [0.85 + rand() * 0.3, 0.9 + rand() * 0.25, 0.8 + rand() * 0.2]
        })
      }
    }
    return list
  }, [])

  useLayoutEffect(() => {
    mesh.current.layers.set(1)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    blades.forEach((b, i) => {
      dummy.position.set(b.x, 0, b.z)
      dummy.rotation.set(0, b.ry, 0)
      dummy.scale.set(b.w, b.h, b.w)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      mesh.current.setColorAt(i, color.setRGB(b.c[0], b.c[1], b.c[2]))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  }, [blades])

  useFrame((state, dt) => {
    time.value = state.clock.elapsedTime
    material.color.lerp(tmp.set(themeRef.current.grass), 1 - Math.exp(-3 * dt))
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, blades.length]}
      frustumCulled={false}
      raycast={() => null}
    />
  )
}
