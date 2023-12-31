import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, AccumulativeShadows, RandomizedLight, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, FXAA } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'

export default function App() {
  let sunPosition = new THREE.Vector3().setFromSphericalCoords(20, Math.PI / 2 - (45 * Math.PI) / 180, - Math.PI / 2 - (45 * Math.PI) / 180);

  return (
    <Canvas gl={{ logarithmicDepthBuffer: true, antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.5 }} shadows camera={{ position: [-15, 1.85, 10], fov: 25 }}>
      <fog attach="fog" args={['black', 15, 21.5]} />
      <Kamdo rotation={[0, Math.PI, 0]} position={[0, -0.05, 0]} />
      <OrbitControls autoRotate autoRotateSpeed={0.05} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} target={[0, 1.85, 0]} />
      <ContactShadows resolution={128} blur={1} opacity={0.5} far={100} scale={10} />
      <AccumulativeShadows frames={32} alphaTest={0.98} opacity={0.75} scale={10} position={[0, 0, 0]}>
        <RandomizedLight amount={8} radius={9} ambient={0} intensity={2} position={[sunPosition.x, sunPosition.y, sunPosition.z]} bias={0.001} />
      </AccumulativeShadows>      
      <EffectComposer disableNormalPass multisampling={0}>
        <FXAA />
        <Bloom luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
      <Environment background preset="sunset" blur={0.8} />
    </Canvas>
  )
}

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.0 s2wt_kamdo_industrial_divinities.glb --transform --simplify
Author: Hansalex (https://sketchfab.com/Hansalex)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/s2wt-kamdo-industrial-divinities-f503b70ac05e49a38c81100d71599a1b
Title: S2WT "Kamdo" (Industrial Divinities)
*/

function Kamdo(props) {
  const head = useRef()
  const stripe = useRef()
  const light = useRef()
  const { nodes, materials } = useGLTF('/s2wt_kamdo_industrial_divinities-transformed.glb')
  useFrame((state, delta) => {
    const t = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2
    stripe.current.color.setRGB(1 + t * 10, 2, 20 + t * 50)
    easing.dampE(head.current.rotation, [0, state.pointer.x * (state.camera.position.z > 1 ? 1 : -1), 0], 0.4, delta)
    light.current.intensity = 1 + t * 2
  })
  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={nodes.body001.geometry} material={materials.Body} />
      <group ref={head}>
        <mesh castShadow receiveShadow geometry={nodes.head001.geometry} material={materials.Head} />
        <mesh castShadow receiveShadow geometry={nodes.stripe001.geometry}>
          <meshBasicMaterial ref={stripe} toneMapped={false} />
          <pointLight ref={light} intensity={1} color={[10, 2, 5]} distance={2.5} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/s2wt_kamdo_industrial_divinities-transformed.glb')
