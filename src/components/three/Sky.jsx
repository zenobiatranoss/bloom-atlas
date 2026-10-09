import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useThemeRef from '../../hooks/useThemeRef'
import { glowTexture } from '../../utils/textures'
import { seeded } from '../../utils/math'

const vertex = `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y, -0.2, 1.0);
    float a = smoothstep(-0.05, 0.28, h);
    float b = smoothstep(0.2, 0.85, h);
    vec3 col = mix(uHorizon, uMid, a);
    col = mix(col, uTop, b);
    gl_FragColor = vec4(col, 1.0);
  }
`

export default function Sky() {
  const themeRef = useThemeRef()
  const init = themeRef.current
  const group = useRef()
  const starMat = useRef()
  const sun = useRef()
  const sunMat = useRef()
  const halo = useRef()
  const haloMat = useRef()
  const tmp = useMemo(() => new THREE.Color(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const glow = useMemo(() => glowTexture(), [])

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(init.skyTop) },
      uMid: { value: new THREE.Color(init.skyMid) },
      uHorizon: { value: new THREE.Color(init.horizon) }
    }),
    [init]
  )

  const stars = useMemo(() => {
    const rand = seeded(77)
    const arr = new Float32Array(900 * 3)
    for (let i = 0; i < 900; i++) {
      const y = 0.03 + rand() * 0.97
      const r = Math.sqrt(1 - y * y)
      const a = rand() * Math.PI * 2
      arr[i * 3] = Math.cos(a) * r * 70
      arr[i * 3 + 1] = y * 70
      arr[i * 3 + 2] = Math.sin(a) * r * 70
    }
    return arr
  }, [])

  useFrame((state, dt) => {
    const p = themeRef.current
    const k = 1 - Math.exp(-2.4 * dt)
    group.current.position.copy(state.camera.position)
    uniforms.uTop.value.lerp(tmp.set(p.skyTop), k)
    uniforms.uMid.value.lerp(tmp.set(p.skyMid), k)
    uniforms.uHorizon.value.lerp(tmp.set(p.horizon), k)
    starMat.current.opacity += (p.stars - starMat.current.opacity) * k
    sun.current.position.lerp(target.set(p.luminaryPos[0], p.luminaryPos[1], p.luminaryPos[2]), k)
    sun.current.scale.setScalar(sun.current.scale.x + (p.luminaryScale - sun.current.scale.x) * k)
    sunMat.current.color.lerp(tmp.set(p.luminary).multiplyScalar(2.2), k)
    halo.current.position.copy(sun.current.position)
    halo.current.scale.setScalar(halo.current.scale.x + (p.haloScale - halo.current.scale.x) * k)
    haloMat.current.color.lerp(tmp.set(p.halo), k)
    haloMat.current.opacity += (p.haloOpacity - haloMat.current.opacity) * k
  })

  return (
    <group ref={group}>
      <mesh renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[80, 32, 16]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          side={THREE.BackSide}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={starMat}
          color="#ffffff"
          size={1.8}
          sizeAttenuation={false}
          transparent
          opacity={0}
          depthWrite={false}
          fog={false}
        />
      </points>

      <mesh ref={sun} position={init.luminaryPos} scale={init.luminaryScale}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial ref={sunMat} color={init.luminary} fog={false} toneMapped={false} />
      </mesh>

      <sprite ref={halo} position={init.luminaryPos} scale={[init.haloScale, init.haloScale, 1]}>
        <spriteMaterial
          ref={haloMat}
          map={glow}
          color={init.halo}
          transparent
          opacity={init.haloOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </sprite>
    </group>
  )
}
