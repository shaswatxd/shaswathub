import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, invalidate } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const LANES = [-3.6, 3.6];

/* ─── Floating Particle System ─── */
function Particles({ count = 80 }) {
  const mesh = useRef();
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0, 0.94, 1],    // cyan
      [0.545, 0.42, 1], // violet
      [1, 0.24, 0.6],   // magenta
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 30 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 250 - 80;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.012;
    mesh.current.position.y = Math.sin(t * 0.15) * 2;
    invalidate();
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.15} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ─── Realistic 3D Ferrari Model Component ─── */
function FerrariCar({ initialZ, lane, speed, color, underglowColor }) {
  const groupRef = useRef();
  const wheelsRef = useRef([]);
  
  // Load the downloaded Ferrari model
  const { scene } = useGLTF('/models/ferrari.glb');
  
  // Clone the scene so each instance has its own position, rotation, and materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Customize materials for premium look and individual instance colors
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Customize the paint color
        // In Three.js official Ferrari model, the body paint is typically named 'body'
        if (child.name === 'body' || child.name.includes('body') || child.name.includes('paint')) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(color),
            metalness: 0.9,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
          });
        }
        
        // Add chrome metalness to rims/wheels
        if (child.name.includes('rim') || child.name.includes('spoke')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            metalness: 0.95,
            roughness: 0.1,
          });
        }
        
        // Darken tires
        if (child.name.includes('tire') || child.name.includes('wheel')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#121212',
            roughness: 0.85,
            metalness: 0.1,
          });
        }
      }
    });
    
    return clone;
  }, [scene, color]);

  // Find wheels to animate rotation
  useEffect(() => {
    wheelsRef.current = [];
    clonedScene.traverse((child) => {
      if (child.name.includes('wheel') || child.name.includes('rim') || child.name.includes('tire')) {
        // Only target the main wheel assembly groups/meshes to rotate
        if (child.name.match(/wheel_[f|r][l|r]/i)) {
          wheelsRef.current.push(child);
        }
      }
    });
  }, [clonedScene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Move car forward along Z-axis
    groupRef.current.position.z += speed;
    
    // Reset position if it goes past the camera viewport
    if (groupRef.current.position.z > 22) {
      groupRef.current.position.z = -220 - Math.random() * 40;
    }

    // Rotate wheels relative to car speed
    const wheelRotationSpeed = (speed / 0.2) * 8 * delta;
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x += wheelRotationSpeed;
    });

    invalidate();
  });

  return (
    <group ref={groupRef} position={[lane, 0.05, initialZ]} scale={[0.82, 0.82, 0.82]} rotation={[0, Math.PI, 0]}>
      {/* Real Ferrari GLB model primitive */}
      <primitive object={clonedScene} />

      {/* Realistic Neonly Glowing Underglow Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <planeGeometry args={[1.9, 4.4]} />
        <meshBasicMaterial
          color={underglowColor}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Underglow Point Light */}
      <pointLight color={underglowColor} intensity={1.8} distance={4} position={[0, -0.1, 0]} />

      {/* Headlights Emissive Point Light */}
      <pointLight color="#ffffff" intensity={2.0} distance={10} position={[0, 0.4, -2.2]} />
      
      {/* Taillights Emissive Point Light */}
      <pointLight color="#ff1100" intensity={1.5} distance={8} position={[0, 0.4, 2.2]} />
    </group>
  );
}

/* ─── Neon Road Dash Lines ─── */
function DashLines() {
  const groupRef = useRef();
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({ z: -i * 14 - 5, key: i });
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.position.z += 0.32;
      if (child.position.z > 22) child.position.z -= 420;
    });
    invalidate();
  });

  const geo = useMemo(() => new THREE.BoxGeometry(0.08, 0.02, 4.5), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35 }), []);

  return (
    <group ref={groupRef}>
      {lines.map(({ z, key }) => (
        <mesh key={key} position={[0, 0.04, z]} geometry={geo} material={mat} />
      ))}
    </group>
  );
}

/* ─── Speed Lines Effect ─── */
function SpeedLines() {
  const groupRef = useRef();
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 14;
      arr.push({
        x,
        z: -Math.random() * 300 - 20,
        speed: 0.45 + Math.random() * 0.3,
        key: i,
      });
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.z += lines[i].speed;
      if (child.position.z > 22) child.position.z = -300 - Math.random() * 50;
    });
    invalidate();
  });

  return (
    <group ref={groupRef}>
      {lines.map(({ x, z, key }) => (
        <mesh key={key} position={[x, 0.06, z]}>
          <boxGeometry args={[0.02, 0.01, 3]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Cars Fleet ─── */
function Cars({ isMobile }) {
  const CAR_COUNT = isMobile ? 2 : 4;
  
  // Custom luxury color schemes for the Ferraris
  const carSpecs = [
    { color: '#ff1100', underglow: '#ff1144' }, // Rosso Corsa (Classic Red)
    { color: '#00ccff', underglow: '#00f0ff' }, // Modena Cyan
    { color: '#ffcc00', underglow: '#ffaa00' }, // Giallo Modena (Yellow)
    { color: '#a855f7', underglow: '#d8b4fe' }, // Purple Pearl
  ];

  const carData = useMemo(() => {
    const data = [];
    for (let i = 0; i < CAR_COUNT; i++) {
      data.push({
        id: i,
        initialZ: -20 - i * 45,
        lane: LANES[i % 2],
        speed: 0.16 + Math.random() * 0.06,
        color: carSpecs[i % carSpecs.length].color,
        underglow: carSpecs[i % carSpecs.length].underglow,
      });
    }
    return data;
  }, [isMobile]);

  return (
    <>
      {carData.map(car => (
        <FerrariCar
          key={car.id}
          initialZ={car.initialZ}
          lane={car.lane}
          speed={car.speed}
          color={car.color}
          underglowColor={car.underglow}
        />
      ))}
    </>
  );
}

/* Preload model to ensure zero pop-in delay */
useGLTF.preload('/models/ferrari.glb');

/* ─── Main Scene ─── */
export default function Scene3D({ prefersReduced }) {
  const isMobile = useMemo(() =>
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
  , []);

  const effectiveReduced = prefersReduced || isMobile;

  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    let scrollTimer = null;
    const onScroll = () => {
      if (!isScrolling) setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsScrolling(false), 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimer);
    };
  }, [isScrolling]);

  const frameloop = isMobile ? 'demand' : (isScrolling ? 'demand' : 'always');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 5.2, 16], fov: 48, near: 0.1, far: 350 }}
        style={{ display: 'block', width: '100vw', height: '100vh' }}
        gl={{
          alpha: true,
          antialias: !isMobile,
          powerPreference: isMobile ? 'default' : 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? 1 : [1, 1.25]}
        frameloop={frameloop}
        onCreated={({ scene, camera, gl }) => {
          scene.fog = new THREE.FogExp2(0x060810, 0.024);
          camera.lookAt(0, 0.6, -70);
          if (isMobile) gl.setPixelRatio(1);
        }}
      >
        {/* Rich Studio Lights for Metallic Car Reflections */}
        <hemisphereLight args={[0xaaccff, 0x110022, 0.75]} />
        <directionalLight args={[0xffffff, 1.2]} position={[10, 20, 8]} castShadow />
        <directionalLight args={[0x8888ff, 0.3]} position={[-10, 10, -10]} />
        <pointLight color="#00f0ff" intensity={1.8} distance={30} position={[-8, 4, -20]} />
        <pointLight color="#8b6bff" intensity={1.5} distance={25} position={[8, 4, -40]} />
        <pointLight color="#ff3d9a" intensity={1.0} distance={20} position={[0, 3, -80]} />

        {/* Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -200]}>
          <planeGeometry args={[18, 550]} />
          <meshStandardMaterial color="#060810" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Reflective wet/shiny road overlay — desktop only */}
        {!isMobile && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -200]}>
            <planeGeometry args={[18, 550]} />
            <meshStandardMaterial
              color="#0a0e1a"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.45}
            />
          </mesh>
        )}

        {/* Neon Grid */}
        <gridHelper
          args={[550, 55, '#00f0ff', '#1a0e44']}
          position={[0, 0.02, -200]}
          material-transparent
          material-opacity={0.18}
        />

        {/* Dash Lines */}
        <DashLines />

        {/* Speed Lines */}
        {!effectiveReduced && <SpeedLines />}

        {/* Edge Strips */}
        <mesh position={[-8.2, 0.1, -200]}>
          <boxGeometry args={[0.1, 0.1, 550]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[8.2, 0.1, -200]}>
          <boxGeometry args={[0.1, 0.1, 550]} />
          <meshBasicMaterial color="#8b6bff" />
        </mesh>

        {/* Side barrier lights */}
        {!effectiveReduced && [-1, -2, -3, -4, -5, -6].map(i => (
          <React.Fragment key={i}>
            <mesh position={[-8.2, 0.6, i * 28 - 50]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
            <mesh position={[8.2, 0.6, i * 28 - 50]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#8b6bff" />
            </mesh>
          </React.Fragment>
        ))}

        {/* Particle System */}
        {!effectiveReduced && <Particles count={80} />}

        {/* Supercars fleet */}
        <Suspense fallback={null}>
          <Cars isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
