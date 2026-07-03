import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PALETTE = ['#ff2233', '#00f0ff', '#8b6bff', '#ff3d9a'];
const LANES = [-3.4, 3.4];

function Car({ initialZ, lane, color, speed, prefersReduced }) {
  const { scene } = useGLTF('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/ferrari.glb');
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        // The body paint material of the three.js Ferrari is typically named "Red" or contains "paint"
        if (child.material.name.toLowerCase().includes('paint') || 
            child.material.name.toLowerCase().includes('red') || 
            child.name.toLowerCase().includes('body')) {
          child.material = child.material.clone();
          child.material.color.set(color);
        }
      }
    });
    return clone;
  }, [scene, color]);

  const groupRef = useRef();

  useFrame(() => {
    if (prefersReduced) return;
    if (groupRef.current) {
      groupRef.current.position.z += speed;
      if (groupRef.current.position.z > 18) {
        groupRef.current.position.z = -180 - Math.random() * 20;
      }
    }
  });

  return (
    <primitive
      ref={groupRef}
      object={clonedScene}
      position={[lane, 0.02, initialZ]}
      rotation={[0, Math.PI, 0]}
      scale={1.2}
    />
  );
}

function Cars({ prefersReduced }) {
  const carData = useMemo(() => {
    const data = [];
    const CAR_COUNT = 6;
    for (let i = 0; i < CAR_COUNT; i++) {
      data.push({
        id: i,
        initialZ: -25 - i * 26,
        lane: LANES[i % 2],
        color: PALETTE[i % PALETTE.length],
        speed: 0.22 + Math.random() * 0.14
      });
    }
    return data;
  }, []);

  return (
    <>
      {carData.map(car => (
        <Car
          key={car.id}
          initialZ={car.initialZ}
          lane={car.lane}
          color={car.color}
          speed={car.speed}
          prefersReduced={prefersReduced}
        />
      ))}
    </>
  );
}

export default function Scene3D({ prefersReduced }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 4.2, 15], fov: 52, near: 0.1, far: 300 }}
        style={{ display: 'block', width: '100vw', height: '100vh' }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ scene, camera }) => {
          scene.fog = new THREE.FogExp2(0x080b12, 0.032);
          camera.lookAt(0, 1, -60);
        }}
      >
        <hemisphereLight args={[0x99bbff, 0x110022, 0.7]} />
        <directionalLight args={[0xffffff, 0.35]} position={[6, 12, 4]} />

        {/* Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -180]}>
          <planeGeometry args={[16, 500]} />
          <meshStandardMaterial color="#060810" roughness={0.95} />
        </mesh>

        {/* Neon Grid Helper */}
        <gridHelper
          args={[500, 100, '#00f0ff', '#3a2c66']}
          position={[0, 0.02, -180]}
          material-transparent
          material-opacity={0.35}
        />

        {/* Edge Strips */}
        <mesh position={[-7.6, 0.08, -180]}>
          <boxGeometry args={[0.12, 0.12, 500]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[7.6, 0.08, -180]}>
          <boxGeometry args={[0.12, 0.12, 500]} />
          <meshBasicMaterial color="#8b6bff" />
        </mesh>

        <Suspense fallback={null}>
          <Cars prefersReduced={prefersReduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
