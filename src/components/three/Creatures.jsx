import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelector } from 'react-redux'
import useThemeRef from '../../hooks/useThemeRef'
import { blueprints } from '../../data/blueprints'
import { buildWingGeometry } from '../../utils/shapes'
import { seeded } from '../../utils/math'
import { selectSelectedFlower } from '../../store/slices/flowersSlice'

const palette = ['#f2b134', '#f4f1ea', '#e0708f']

function Butterflies() {
  const themeRef = useThemeRef()
  const flower = useSelector(selectSelectedFlower)
  const flowerRef = useRef(flower)
  flowerRef.current = flower
  const groups = useRef([])
  const lefts = useRef([])
  const rights = useRef([])
  const presence = useRef(0)
  const center = useMemo(() => new THREE.Vector3(0, 1.5, 0), [])
  const next = useMemo(() => new THREE.Vector3(), [])
  const geometries = useMemo(() => palette.map((c) => buildWingGeometry(c)), [])
  const materials = useMemo(
    () =>
      palette.map(
        (c) =>
          new THREE.MeshStandardMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            roughness: 0.6,
            emissive: new THREE.Color(c),
            emissiveIntensity: 0.08
          })
      ),
    []
  )
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2b211b', roughness: 0.8 }), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const bp = blueprints[flowerRef.current.id]
    presence.current += (themeRef.current.butterflies - presence.current) * (1 - Math.exp(-1.6 * dt))
    center.x = THREE.MathUtils.damp(center.x, bp.position[0], 1.4, dt)
    center.y = THREE.MathUtils.damp(center.y, bp.headY + 0.15, 1.4, dt)
    center.z = THREE.MathUtils.damp(center.z, bp.position[2], 1.4, dt)

    for (let i = 0; i < palette.length; i++) {
      const g = groups.current[i]
      if (!g) continue
      g.visible = presence.current > 0.02
      if (!g.visible) continue
      const ph = i * 2.1
      const at = (tt, out) =>
        out.set(
          center.x + Math.cos(tt * 0.5 + ph) * (1.1 + i * 0.25) + Math.sin(tt * 1.1 + ph * 2) * 0.25,
          center.y + 0.1 + i * 0.12 + Math.sin(tt * 0.8 + ph) * 0.45,
          center.z + 0.5 + Math.sin(tt * 0.45 + ph) * (0.9 + i * 0.2) + Math.cos(tt * 0.9 + ph) * 0.2
        )
      at(t, g.position)
      at(t + 0.08, next)
      g.lookAt(next)
      const f = Math.sin(t * (17 + i * 2) + ph) * 0.85 + 0.25
      rights.current[i].rotation.z = f
      lefts.current[i].rotation.z = -f
      g.scale.setScalar(presence.current)
    }
  })

  return (
    <>
      {palette.map((c, i) => (
        <group
          key={c}
          ref={(n) => {
            groups.current[i] = n
          }}
        >
          <mesh material={bodyMat} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.014, 0.1, 3, 6]} />
          </mesh>
          <group
            ref={(n) => {
              rights.current[i] = n
            }}
          >
            <mesh geometry={geometries[i]} material={materials[i]} />
          </group>
          <group
            ref={(n) => {
              lefts.current[i] = n
            }}
          >
            <mesh geometry={geometries[i]} material={materials[i]} scale={[-1, 1, 1]} />
          </group>
        </group>
      ))}
    </>
  )
}

const fireflyVertex = `
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixel;
  uniform float uLife;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.4 + aPhase * 6.2) * 0.6;
    p.y += sin(uTime * 0.55 + aPhase * 9.0) * 0.35;
    p.z += cos(uTime * 0.35 + aPhase * 4.0) * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float blink = pow(max(0.0, sin(uTime * (0.8 + aPhase * 0.9) + aPhase * 20.0)), 3.0);
    vAlpha = (0.15 + 0.85 * blink) * uLife;
    gl_PointSize = uPixel * 70.0 * (0.55 + blink * 0.9) / -mv.z;
  }
`

const fireflyFragment = `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha);
  }
`

function Fireflies({ count = 90 }) {
  const themeRef = useThemeRef()
  const life = useRef(0)

  const data = useMemo(() => {
    const rand = seeded(515)
    const pos = new Float32Array(count * 3)
    const phase = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 18
      pos[i * 3 + 1] = 0.35 + rand() * 3
      pos[i * 3 + 2] = -8 + rand() * 10
      phase[i] = rand()
    }
    return { pos, phase }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLife: { value: 0 },
      uPixel: { value: 1 },
      uColor: { value: new THREE.Color('#d9ff7a') }
    }),
    []
  )

  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPixel.value = state.gl.getPixelRatio()
    life.current += (themeRef.current.fireflies - life.current) * (1 - Math.exp(-1.6 * dt))
    uniforms.uLife.value = life.current
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phase, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={fireflyVertex}
        fragmentShader={fireflyFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Creatures() {
  return (
    <>
      <Butterflies />
      <Fireflies />
    </>
  )
}
