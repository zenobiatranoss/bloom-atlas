import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelector } from 'react-redux'
import { blueprints } from '../../data/blueprints'
import { selectSelectedFlower } from '../../store/slices/flowersSlice'
import useMouseParallax from '../../hooks/useMouseParallax'

export default function CameraRig() {
  const flower = useSelector(selectSelectedFlower)
  const flowerRef = useRef(flower)
  flowerRef.current = flower
  const mouse = useMouseParallax()
  const look = useRef(new THREE.Vector3(0, 1, 0))

  useFrame((state, dt) => {
    const bp = blueprints[flowerRef.current.id]
    const { camera, size } = state
    const wide = size.width / size.height > 1.1
    const shift = wide ? bp.shift : 0
    const lift = wide ? 0 : 0.7
    const tx = bp.position[0] - shift
    const cx = tx + mouse.current.x * 0.45
    const cy = bp.headY * 0.78 + 0.45 - mouse.current.y * 0.25 - lift
    const cz = bp.position[2] + bp.camDist * (wide ? 1 : 1.25)
    const k = 2.1
    camera.position.x = THREE.MathUtils.damp(camera.position.x, cx, k, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cy, k, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cz, k, dt)
    look.current.x = THREE.MathUtils.damp(look.current.x, tx, k * 1.15, dt)
    look.current.y = THREE.MathUtils.damp(look.current.y, bp.lookY - lift, k * 1.15, dt)
    look.current.z = THREE.MathUtils.damp(look.current.z, bp.position[2], k * 1.15, dt)
    camera.lookAt(look.current)
  })

  return null
}
