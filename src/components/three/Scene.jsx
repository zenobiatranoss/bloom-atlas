import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '../../store/store'
import { flowers } from '../../data/flowers'
import { blueprints } from '../../data/blueprints'
import { sceneThemes } from '../../utils/colors'
import useThemeRef from '../../hooks/useThemeRef'
import { selectSelectedFlower } from '../../store/slices/flowersSlice'
import { setLoaded } from '../../store/slices/uiSlice'
import Flower from './Flower'
import Particles from './Particles'
import CameraRig from './CameraRig'
import Effects from './Effects'
import Sky from './Sky'
import Ground from './Ground'
import Grass from './Grass'
import GroundPetals from './GroundPetals'
import Creatures from './Creatures'

function Atmosphere() {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const themeRef = useThemeRef()
  const flower = useSelector(selectSelectedFlower)
  const flowerRef = useRef(flower)
  flowerRef.current = flower

  const hemi = useRef()
  const key = useRef()
  const rim = useRef()
  const spot = useRef()
  const tmp = useMemo(() => new THREE.Color(), [])
  const init = themeRef.current

  useEffect(() => {
    camera.layers.enable(1)
    const p = themeRef.current
    scene.background = new THREE.Color(p.horizon)
    scene.fog = new THREE.Fog(p.horizon, 9, 34)
    scene.environmentIntensity = 0.4
    return () => {
      scene.background = null
      scene.fog = null
    }
  }, [scene, camera, themeRef])

  useFrame((_, dt) => {
    const p = themeRef.current
    const k = 1 - Math.exp(-3 * dt)
    if (scene.background) {
      scene.background.lerp(tmp.set(p.horizon), k)
      if (scene.fog) scene.fog.color.copy(scene.background)
    }
    hemi.current.color.lerp(tmp.set(p.fill), k)
    hemi.current.groundColor.lerp(tmp.set(p.ground), k)
    hemi.current.intensity = THREE.MathUtils.damp(hemi.current.intensity, p.fillI, 3, dt)
    key.current.color.lerp(tmp.set(p.key), k)
    key.current.intensity = THREE.MathUtils.damp(key.current.intensity, p.keyI, 3, dt)
    rim.current.color.lerp(tmp.set(p.rim), k)
    rim.current.intensity = THREE.MathUtils.damp(rim.current.intensity, p.rimI, 3, dt)
    spot.current.color.lerp(tmp.set(p.key), k)
    spot.current.intensity = THREE.MathUtils.damp(spot.current.intensity, p.spotI, 3, dt)
    const bp = blueprints[flowerRef.current.id]
    spot.current.position.x = THREE.MathUtils.damp(spot.current.position.x, bp.position[0] + 1.8, 2.5, dt)
    spot.current.position.y = THREE.MathUtils.damp(spot.current.position.y, bp.headY + 1.6, 2.5, dt)
    spot.current.position.z = THREE.MathUtils.damp(spot.current.position.z, bp.position[2] + 2.8, 2.5, dt)
  })

  return (
    <>
      <hemisphereLight ref={hemi} color={init.fill} groundColor={init.ground} intensity={init.fillI} />
      <directionalLight ref={key} position={[5, 9, 7]} color={init.key} intensity={init.keyI} />
      <directionalLight ref={rim} position={[-6, 5, -9]} color={init.rim} intensity={init.rimI} />
      <pointLight ref={spot} position={[2, 3, 3]} color={init.key} intensity={init.spotI} distance={0} decay={2} />
    </>
  )
}

const tickGeometry = new THREE.BoxGeometry(0.01, 0.002, 0.07)

function Marker() {
  const group = useRef()
  const theme = useSelector((s) => s.theme.current)
  const flower = useSelector(selectSelectedFlower)
  const themeRef = useRef(theme)
  themeRef.current = theme
  const flowerRef = useRef(flower)
  flowerRef.current = flower
  const tmp = useMemo(() => new THREE.Color(), [])
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5, depthWrite: false, fog: false }),
    []
  )
  const ticks = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2
        return { a, long: i % 6 === 0 }
      }),
    []
  )

  useFrame((_, dt) => {
    const bp = blueprints[flowerRef.current.id]
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, bp.position[0], 4, dt)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, bp.position[2], 4, dt)
    group.current.rotation.y += dt * 0.04
    material.color.lerp(tmp.set(sceneThemes[themeRef.current].mark), 1 - Math.exp(-3 * dt))
  })

  return (
    <group ref={group} position={[0, 0.012, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={material}>
        <ringGeometry args={[1.0, 1.012, 160]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={material}>
        <ringGeometry args={[1.42, 1.428, 160]} />
      </mesh>
      {ticks.map((tk, i) => (
        <mesh
          key={i}
          geometry={tickGeometry}
          material={material}
          position={[Math.cos(tk.a) * 1.75, 0, Math.sin(tk.a) * 1.75]}
          rotation={[0, Math.PI / 2 - tk.a, 0]}
          scale={[1, 1, tk.long ? 1.8 : 1]}
        />
      ))}
    </group>
  )
}

export default function Scene() {
  const dispatch = useDispatch()
  const paused = useSelector((s) => s.ui.scrollProgress >= 1)

  return (
    <Canvas
      frameloop={paused ? 'never' : 'always'}
      camera={{ position: [0, 3.5, 11], fov: 34, near: 0.1, far: 90 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onCreated={() => {
        setTimeout(() => dispatch(setLoaded(true)), 1200)
      }}
    >
      <Provider store={store}>
        <Atmosphere />
        <Sky />
        <CameraRig />
        <Ground />
        <Grass />
        {flowers.map((f) => (
          <Flower key={f.id} flower={f} />
        ))}
        <GroundPetals />
        <Marker />
        <Particles />
        <Creatures />
        <ContactShadows position={[0, 0, -2]} scale={24} far={3.5} blur={2.4} opacity={0.35} resolution={512} />
        <Environment resolution={256} frames={1} environmentIntensity={0.4}>
          <Lightformer form="rect" intensity={1.6} position={[0, 6, 4]} scale={[10, 4, 1]} color="#ffffff" target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1} position={[-6, 3, -6]} scale={[6, 6, 1]} color="#ffe9d6" target={[0, 0, 0]} />
          <Lightformer form="ring" intensity={1.2} position={[7, 5, -4]} scale={5} color="#cfe0ff" target={[0, 0, 0]} />
        </Environment>
        <Effects />
      </Provider>
    </Canvas>
  )
}
