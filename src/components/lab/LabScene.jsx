import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Lightformer, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { Provider } from 'react-redux'
import { store } from '../../store/store'
import { blueprints } from '../../data/blueprints'
import useThemeRef from '../../hooks/useThemeRef'
import LabFlower from './LabFlower'
import Effects from '../three/Effects'

function Studio() {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const themeRef = useThemeRef()
  const init = themeRef.current
  const hemi = useRef()
  const key = useRef()
  const rim = useRef()
  const spot = useRef()
  const tmp = useMemo(() => new THREE.Color(), [])

  useEffect(() => {
    scene.background = new THREE.Color(init.horizon)
    scene.fog = new THREE.Fog(init.horizon, 11, 28)
    camera.layers.enable(1)
    return () => {
      scene.background = null
      scene.fog = null
    }
  }, [scene, camera, init])

  useFrame((_, dt) => {
    const p = themeRef.current
    const k = 1 - Math.exp(-3 * dt)
    if (scene.background) {
      scene.background.lerp(tmp.set(p.horizon), k)
      if (scene.fog) scene.fog.color.copy(scene.background)
    }
    hemi.current.color.lerp(tmp.set(p.fill), k)
    hemi.current.groundColor.lerp(tmp.set(p.ground), k)
    hemi.current.intensity = THREE.MathUtils.damp(hemi.current.intensity, p.fillI + 0.25, 3, dt)
    key.current.color.lerp(tmp.set(p.key), k)
    key.current.intensity = THREE.MathUtils.damp(key.current.intensity, p.keyI + 0.5, 3, dt)
    rim.current.color.lerp(tmp.set(p.rim), k)
    rim.current.intensity = THREE.MathUtils.damp(rim.current.intensity, p.rimI + 0.2, 3, dt)
    spot.current.color.lerp(tmp.set(p.key), k)
    spot.current.intensity = THREE.MathUtils.damp(spot.current.intensity, p.spotI, 3, dt)
  })

  return (
    <>
      <hemisphereLight ref={hemi} color={init.fill} groundColor={init.ground} intensity={init.fillI} />
      <directionalLight ref={key} position={[4, 8, 6]} color={init.key} intensity={init.keyI} />
      <directionalLight ref={rim} position={[-6, 5, -7]} color={init.rim} intensity={init.rimI} />
      <pointLight ref={spot} position={[1.5, 3, 2.5]} color={init.key} intensity={init.spotI} distance={0} decay={2} />
    </>
  )
}

function Plate({ radius }) {
  const themeRef = useThemeRef()
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false
      }),
    []
  )
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128)
    g.addColorStop(0, 'rgba(255,255,255,0.14)')
    g.addColorStop(0.55, 'rgba(255,255,255,0.05)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])
  const tickGeometry = useMemo(() => new THREE.BoxGeometry(0.008, 0.001, 1), [])
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => ({ a: (i / 60) * Math.PI * 2, long: i % 5 === 0 })), [])
  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame((_, dt) => {
    material.color.lerp(tmp.set(themeRef.current.mark), 1 - Math.exp(-3 * dt))
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} material={material}>
        <ringGeometry args={[radius * 0.992, radius, 128]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[radius, 96]} />
        <meshBasicMaterial map={tex} transparent opacity={0.85} depthWrite={false} toneMapped={false} />
      </mesh>
      {ticks.map((tk, i) => (
        <mesh
          key={i}
          geometry={tickGeometry}
          material={material}
          position={[Math.cos(tk.a) * radius * 0.94, 0.003, Math.sin(tk.a) * radius * 0.94]}
          rotation={[0, Math.PI / 2 - tk.a, 0]}
          scale={[1, 1, tk.long ? 0.16 : 0.08]}
        />
      ))}
    </group>
  )
}

function ViewReset({ resetKey }) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  useEffect(() => {
    camera.position.set(3, 1.3, 6.2)
    if (controls) {
      controls.target.set(0, 0, 0)
      controls.update()
    }
  }, [resetKey, camera, controls])
  return null
}

export default function LabScene({ flower, explode, bloom, active, showLabels, spin, onPart, resetKey, frameloop = 'always' }) {
  const bp = blueprints[flower.id]
  const floor = -bp.headY * 0.5
  const plateRadius = Math.max(1.55, bp.headY * 0.98)

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: 'high-performance' }}
      camera={{ position: [3, 1.3, 6.2], fov: 36, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.12
      }}
    >
      <Provider store={store}>
        <Studio />
        <ViewReset resetKey={resetKey} />
        <group position={[0, floor, 0]}>
          <Plate radius={plateRadius} />
        </group>
        <Sparkles count={34} scale={[4.6, 3.2, 4.6]} size={1.6} speed={0.22} opacity={0.45} color="#cfe3ff" position={[0, 0.2, 0]} />
        <LabFlower flower={flower} explode={explode} bloom={bloom} active={active} showLabels={showLabels} onPart={onPart} />
        <ContactShadows position={[0, floor + 0.004, 0]} scale={plateRadius * 2.4} far={4} blur={2.8} opacity={0.45} resolution={512} color="#000000" />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          autoRotate={spin}
          autoRotateSpeed={1.1}
          minDistance={2.6}
          maxDistance={9.5}
          minPolarAngle={0.4}
          maxPolarAngle={Math.PI * 0.58}
          target={[0, 0, 0]}
        />
        <Environment resolution={512} frames={1} environmentIntensity={0.5}>
          <Lightformer form="rect" intensity={1.8} position={[0, 6, 4]} scale={[10, 4, 1]} color="#ffffff" target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1.2} position={[-6, 3, -6]} scale={[6, 6, 1]} color="#ffe9d6" target={[0, 0, 0]} />
          <Lightformer form="ring" intensity={1.4} position={[7, 5, -4]} scale={5} color="#cfe0ff" target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={0.9} position={[0, -4, 3]} scale={[8, 3, 1]} color="#ffffff" target={[0, 0, 0]} />
        </Environment>
        <Effects />
      </Provider>
    </Canvas>
  )
}
