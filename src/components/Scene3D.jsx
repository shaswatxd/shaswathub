import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PALETTE = ['#ff2233', '#00f0ff', '#8b6bff', '#ff3d9a'];
const LANES = [-3.4, 3.4];

/* ─── Floating Particle System ─── */
function Particles({ count = 50 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = Math.random() * 25 - 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 200 - 80;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.015;
    mesh.current.position.y = Math.sin(t * 0.2) * 1.5;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00f0ff" size={0.1} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Low-Poly Car (replaces GLTF) ─── */
function LowPolyCar({ initialZ, lane, color, speed }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.z += speed;
    if (groupRef.current.position.z > 18) {
      groupRef.current.position.z = -180 - Math.random() * 20;
    }
  });

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.15,
    roughness: 0.3,
    metalness: 0.6,
  }), [color]);

  const underGlow = useMemo(() => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.35,
  }), [color]);

  return (
    <group ref={groupRef} position={[lane, 0.02, initialZ]}>
      {/* Underglow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1.6, 3.2]} />
        <primitive object={underGlow} attach="material" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.4, 0.35, 3]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.6, -0.15]}>
        <boxGeometry args={[1.2, 0.3, 1.6]} />
        <primitive object={mat.clone()} attach="material" />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.5, 0.35, 1.5]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.5, 0.35, 1.5]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Taillights */}
      <mesh position={[-0.5, 0.35, -1.5]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshBasicMaterial color="#ff2233" />
      </mesh>
      <mesh position={[0.5, 0.35, -1.5]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshBasicMaterial color="#ff2233" />
      </mesh>
    </group>
  );
}

/* ─── Neon Road Dash Lines ─── */
function DashLines() {
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      arr.push({ z: -i * 15 - 5, key: i });
    }
    return arr;
  }, []);

  const groupRef = useRef();
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.position.z += 0.28;
      if (child.position.z > 18) child.position.z -= 375;
    });
  });

  const geo = useMemo(() => new THREE.BoxGeometry(0.06, 0.02, 4), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 }), []);

  return (
    <group ref={groupRef}>
      {lines.map(({ z, key }) => (
        <mesh key={key} position={[0, 0.04, z]} geometry={geo} material={mat} />
      ))}
    </group>
  );
}

/* ─── Cars ─── */
function Cars({ isMobile }) {
  const carData = useMemo(() => {
    const data = [];
    const CAR_COUNT = isMobile ? 3 : 6;
    for (let i = 0; i < CAR_COUNT; i++) {
      data.push({
        id: i,
        initialZ: -25 - i * 32,
        lane: LANES[i % 2],
        color: PALETTE[i % PALETTE.length],
        speed: 0.20 + Math.random() * 0.10,
      });
    }
    return data;
  }, [isMobile]);

  return (
    <>
      {carData.map(car => (
        <LowPolyCar
          key={car.id}
          initialZ={car.initialZ}
          lane={car.lane}
          color={car.color}
          speed={car.speed}
        />
      ))}
    </>
  );
}


/* ─── Main Scene ─── */
export default function Scene3D({ prefersReduced }) {
  const isMobile = useMemo(() =>
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
  , []);

  const effectiveReduced = prefersReduced || isMobile;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 4.2, 15], fov: 52, near: 0.1, far: 300 }}
        style={{ display: 'block', width: '100vw', height: '100vh' }}
        gl={{
          alpha: true,
          antialias: !isMobile,
          powerPreference: isMobile ? 'default' : 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? 1 : [1, 1.25]}
        frameloop={isMobile ? 'demand' : 'always'}
        onCreated={({ scene, camera, gl }) => {
          scene.fog = new THREE.FogExp2(0x080b12, 0.035);
          camera.lookAt(0, 1, -60);
          if (isMobile) gl.setPixelRatio(1);
        }}
      >
        {/* Reduced lighting — fewer lights, lower intensities */}
        <hemisphereLight args={[0x99bbff, 0x110022, 0.5]} />
        <directionalLight args={[0xffffff, 0.25]} position={[6, 12, 4]} />
        <pointLight color="#00f0ff" intensity={1.0} distance={25} position={[-6, 3, -15]} />
        <pointLight color="#8b6bff" intensity={0.8} distance={20} position={[6, 3, -35]} />

        {/* Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -180]}>
          <planeGeometry args={[16, 500]} />
          <meshStandardMaterial color="#060810" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Reflective road overlay — desktop only */}
        {!isMobile && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -180]}>
            <planeGeometry args={[16, 500]} />
            <meshStandardMaterial
              color="#0a0e1a"
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={0.35}
            />
          </mesh>
        )}

        {/* Neon Grid — reduced subdivision */}
        <gridHelper
          args={[500, 50, '#00f0ff', '#2a1c55']}
          position={[0, 0.02, -180]}
          material-transparent
          material-opacity={0.25}
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

        {/* Side barrier lights — desktop only */}
        {!effectiveReduced && [-1, -2, -3, -4].map(i => (
          <React.Fragment key={i}>
            <mesh position={[-7.6, 0.5, i * 30 - 60]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
            <mesh position={[7.6, 0.5, i * 30 - 60]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshBasicMaterial color="#8b6bff" />
            </mesh>
          </React.Fragment>
        ))}

        {/* Particle System — desktop only, reduced count */}
        {!effectiveReduced && <Particles count={50} />}

        {/* Cars */}
        <Suspense fallback={null}>
          <Cars isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
