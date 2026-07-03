import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WHEEL_POSITIONS = [
  [-0.85, 0.34, 1.25],
  [0.85, 0.34, 1.25],
  [-0.85, 0.34, -1.25],
  [0.85, 0.34, -1.25]
];

const HEADLIGHT_POSITIONS = [
  [-0.55, 0.5, 2.6],
  [0.55, 0.5, 2.6]
];

const TAILLIGHT_POSITIONS = [
  [-0.55, 0.5, -2.0],
  [0.55, 0.5, -2.0]
];

const PALETTE = ['#00f0ff', '#8b6bff', '#ff3d9a', '#f5f7fb'];
const LANES = [-3.4, 3.4];

function Car({ initialZ, lane, color, speed, prefersReduced }) {
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
    <group ref={groupRef} position={[lane, 0, initialZ]}>
      {/* Body paint */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.7, 0.45, 3.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.42, 2.1]}>
        <boxGeometry args={[1.5, 0.35, 1.0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.85, -0.3]}>
        <boxGeometry args={[1.25, 0.4, 1.7]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>

      {/* Spoiler */}
      <mesh position={[0, 0.85, -1.9]}>
        <boxGeometry args={[1.6, 0.08, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>

      {/* Wheels */}
      {WHEEL_POSITIONS.map((pos, idx) => (
        <mesh key={idx} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.28, 14]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
      ))}

      {/* Headlights */}
      {HEADLIGHT_POSITIONS.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Taillights */}
      {TAILLIGHT_POSITIONS.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#ff2244" />
        </mesh>
      ))}
    </group>
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

        <Cars prefersReduced={prefersReduced} />
      </Canvas>
    </div>
  );
}
