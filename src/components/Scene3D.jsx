import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PALETTE = ['#ff2233', '#00f0ff', '#8b6bff', '#ff3d9a'];
const LANES = [-3.4, 3.4];

/* ─── Floating Particle System ─── */
function Particles({ count = 120 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = Math.random() * 30 - 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 200 - 80;
    }
    return arr;
  }, [count]);

  const speeds = useMemo(() => new Float32Array(count).map(() => 0.005 + Math.random() * 0.01), [count]);

  useFrame(() => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += speeds[i];
      if (pos.array[i * 3 + 1] > 25) {
        pos.array[i * 3 + 1] = -5;
      }
    }
    pos.needsUpdate = true;
    mesh.current.rotation.y += 0.0003;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00f0ff" size={0.08} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ─── Floating Geometric Orb ─── */
function FloatingOrb({ position, color, speed = 1, size = 1 }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.4;
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.z = t * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={color}
        wireframe
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

/* ─── Animated Energy Ring ─── */
function EnergyRing({ position, color, radius = 4, thickness = 0.05, speed = 0.5 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.getElapsedTime() * speed;
    ref.current.rotation.z = clock.getElapsedTime() * speed * 0.7;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

/* ─── Neon Road Dash Lines ─── */
function DashLines() {
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({ z: -i * 15 - 5, key: i });
    }
    return arr;
  }, []);

  const groupRef = useRef();
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.position.z += 0.28;
      if (child.position.z > 18) child.position.z -= 450;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map(({ z, key }) => (
        <mesh key={key} position={[0, 0.04, z]}>
          <boxGeometry args={[0.06, 0.02, 4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Car Component ─── */
function Car({ initialZ, lane, color, speed, prefersReduced }) {
  const { scene } = useGLTF('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/ferrari.glb');
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        if (
          child.material.name.toLowerCase().includes('paint') ||
          child.material.name.toLowerCase().includes('red') ||
          child.name.toLowerCase().includes('body')
        ) {
          child.material = child.material.clone();
          child.material.color.set(color);
          child.material.emissive = new THREE.Color(color);
          child.material.emissiveIntensity = 0.12;
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
    <>
      {/* Headlight glow beneath car */}
      <pointLight
        color={color}
        intensity={1.2}
        distance={6}
        position={[lane, 0.5, groupRef.current?.position.z ?? initialZ]}
      />
      <primitive
        ref={groupRef}
        object={clonedScene}
        position={[lane, 0.02, initialZ]}
        rotation={[0, Math.PI, 0]}
        scale={1.2}
      />
    </>
  );
}

function Cars({ prefersReduced }) {
  const carData = useMemo(() => {
    const data = [];
    const CAR_COUNT = 14;
    for (let i = 0; i < CAR_COUNT; i++) {
      data.push({
        id: i,
        initialZ: -25 - i * 24,
        lane: LANES[i % 2],
        color: PALETTE[i % PALETTE.length],
        speed: 0.22 + Math.random() * 0.16,
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

/* ─── Main Scene ─── */
export default function Scene3D({ prefersReduced }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 4.2, 15], fov: 52, near: 0.1, far: 400 }}
        style={{ display: 'block', width: '100vw', height: '100vh' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        onCreated={({ scene, camera }) => {
          scene.fog = new THREE.FogExp2(0x080b12, 0.028);
          camera.lookAt(0, 1, -60);
        }}
      >
        {/* Lighting */}
        <hemisphereLight args={[0x99bbff, 0x110022, 0.6]} />
        <directionalLight args={[0xffffff, 0.3]} position={[6, 12, 4]} />
        <pointLight color="#00f0ff" intensity={1.5} distance={30} position={[-8, 3, -20]} />
        <pointLight color="#8b6bff" intensity={1.2} distance={25} position={[8, 3, -40]} />
        <pointLight color="#ff3d9a" intensity={0.8} distance={20} position={[0, 5, -10]} />

        {/* Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -180]}>
          <planeGeometry args={[16, 500]} />
          <meshStandardMaterial color="#060810" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Reflective road overlay */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -180]}>
          <planeGeometry args={[16, 500]} />
          <meshStandardMaterial
            color="#0a0e1a"
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Neon Grid */}
        <gridHelper
          args={[500, 80, '#00f0ff', '#2a1c55']}
          position={[0, 0.02, -180]}
          material-transparent
          material-opacity={0.3}
        />

        {/* Dash Lines */}
        <DashLines />

        {/* Edge Strips */}
        <mesh position={[-7.6, 0.08, -180]}>
          <boxGeometry args={[0.08, 0.08, 500]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[7.6, 0.08, -180]}>
          <boxGeometry args={[0.08, 0.08, 500]} />
          <meshBasicMaterial color="#8b6bff" />
        </mesh>

        {/* Side barrier lights */}
        {[-1, -2, -3, -4].map(i => (
          <React.Fragment key={i}>
            <mesh position={[-7.6, 0.5, i * 30 - 60]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
            <mesh position={[7.6, 0.5, i * 30 - 60]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#8b6bff" />
            </mesh>
          </React.Fragment>
        ))}

        {/* Floating Orbs */}
        {!prefersReduced && (
          <>
            <FloatingOrb position={[-12, 6, -30]} color="#00f0ff" speed={0.5} size={1.2} />
            <FloatingOrb position={[14, 8, -50]} color="#8b6bff" speed={0.4} size={1.6} />
            <FloatingOrb position={[-16, 4, -70]} color="#ff3d9a" speed={0.6} size={0.9} />
          </>
        )}

        {/* Energy Rings */}
        {!prefersReduced && (
          <>
            <EnergyRing position={[0, 10, -60]} color="#00f0ff" radius={5} speed={0.4} />
            <EnergyRing position={[0, 8, -100]} color="#8b6bff" radius={7} speed={0.25} />
          </>
        )}

        {/* Particle System */}
        {!prefersReduced && <Particles count={100} />}

        {/* Cars */}
        <Suspense fallback={null}>
          <Cars prefersReduced={prefersReduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
