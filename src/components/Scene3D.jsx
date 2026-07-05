"use client";
import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const LANES = [-3.6, 3.6];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function Particles({ count = 40 }) {
  const mesh = useRef();
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0, 0.94, 1],
      [0.545, 0.42, 1],
      [1, 0.24, 0.6],
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 25 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 220 - 60;
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
    mesh.current.rotation.y = t * 0.01;
    mesh.current.position.y = Math.sin(t * 0.1) * 1.5;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.12} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function FerrariCar({ initialZ, lane, speed, color, underglowColor }) {
  const groupRef = useRef();
  const wheelsRef = useRef([]);
  const { scene } = useGLTF('/models/ferrari.glb');

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.name === 'body' || child.name.includes('body') || child.name.includes('paint')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            metalness: 0.9,
            roughness: 0.15,
          });
        }
        if (child.name.includes('rim') || child.name.includes('spoke')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            metalness: 0.95,
            roughness: 0.1,
          });
        }
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

  useEffect(() => {
    wheelsRef.current = [];
    clonedScene.traverse((child) => {
      if (child.name.includes('wheel') || child.name.includes('rim') || child.name.includes('tire')) {
        if (child.name.match(/wheel_[f|r][l|r]/i)) {
          wheelsRef.current.push(child);
        }
      }
    });
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.z += speed;
    if (groupRef.current.position.z > 22) {
      groupRef.current.position.z = -220 - Math.random() * 40;
    }
    const wheelRotationSpeed = (speed / 0.2) * 8 * delta;
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x += wheelRotationSpeed;
    });
  });

  return (
    <group ref={groupRef} position={[lane, 0.05, initialZ]} scale={[0.82, 0.82, 0.82]} rotation={[0, Math.PI, 0]}>
      <primitive object={clonedScene} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <planeGeometry args={[1.9, 4.4]} />
        <meshBasicMaterial color={underglowColor} transparent opacity={0.25} />
      </mesh>
      <pointLight color={underglowColor} intensity={2.0} distance={5} position={[0, -0.05, 0]} />
    </group>
  );
}

function DashLines() {
  const groupRef = useRef();
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      arr.push({ z: -i * 15 - 5, key: i });
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.position.z += 0.32;
      if (child.position.z > 22) child.position.z -= 375;
    });
  });

  const geo = useMemo(() => new THREE.BoxGeometry(0.08, 0.02, 4.5), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 }), []);

  return (
    <group ref={groupRef}>
      {lines.map(({ z, key }) => (
        <mesh key={key} position={[0, 0.04, z]} geometry={geo} material={mat} />
      ))}
    </group>
  );
}

function SpeedLines() {
  const groupRef = useRef();
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 15; i++) {
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
  });

  return (
    <group ref={groupRef}>
      {lines.map(({ x, z, key }) => (
        <mesh key={key} position={[x, 0.06, z]}>
          <boxGeometry args={[0.02, 0.01, 3]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Cars({ isMobile }) {
  const CAR_COUNT = isMobile ? 1 : 2;

  const carData = useMemo(() => {
    const specs = [
      { color: '#ff1100', underglow: '#ff1144' },
      { color: '#00ccff', underglow: '#00f0ff' },
    ];
    const data = [];
    for (let i = 0; i < CAR_COUNT; i++) {
      data.push({
        id: i,
        initialZ: -20 - i * 65,
        lane: LANES[i % 2],
        speed: 0.16 + Math.random() * 0.06,
        color: specs[i % specs.length].color,
        underglow: specs[i % specs.length].underglow,
      });
    }
    return data;
  }, [CAR_COUNT]);

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

useGLTF.preload('/models/ferrari.glb');

export default function Scene3D({ prefersReduced }) {
  const isMobile = useIsMobile();
  const effectiveReduced = prefersReduced || isMobile;

  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    let scrollTimer = null;
    let scrollCount = 0;
    const onScroll = () => {
      scrollCount++;
      if (!isScrolling) setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrollCount--;
        if (scrollCount === 0) setIsScrolling(false);
      }, 150);
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
        camera={{ position: [0, 5.2, 16], fov: 48, near: 0.1, far: 300 }}
        style={{ display: 'block', width: '100vw', height: '100vh' }}
        gl={{
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={isMobile ? 0.75 : 1}
        frameloop={frameloop}
        onCreated={({ scene, camera, gl }) => {
          scene.fog = new THREE.FogExp2(0x060810, 0.024);
          camera.lookAt(0, 0.6, -70);
          if (isMobile) gl.setPixelRatio(0.75);
        }}
      >
        <hemisphereLight args={[0xaaccff, 0x110022, 0.75]} />
        <directionalLight args={[0xffffff, 1.2]} position={[10, 20, 8]} />
        <directionalLight args={[0x8888ff, 0.3]} position={[-10, 10, -10]} />
        <pointLight color="#00f0ff" intensity={1.5} distance={25} position={[-8, 4, -20]} />
        <pointLight color="#8b6bff" intensity={1.2} distance={20} position={[8, 4, -40]} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -200]}>
          <planeGeometry args={[18, 550]} />
          <meshStandardMaterial color="#060810" roughness={0.2} metalness={0.85} />
        </mesh>

        <gridHelper
          args={[550, 55, '#00f0ff', '#1a0e44']}
          position={[0, 0.02, -200]}
          material-transparent
          material-opacity={0.18}
        />

        <DashLines />
        {!effectiveReduced && <SpeedLines />}

        <mesh position={[-8.2, 0.1, -200]}>
          <boxGeometry args={[0.1, 0.1, 550]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[8.2, 0.1, -200]}>
          <boxGeometry args={[0.1, 0.1, 550]} />
          <meshBasicMaterial color="#8b6bff" />
        </mesh>

        {!effectiveReduced && [-1, -2, -3, -4, -5].map(i => (
          <React.Fragment key={i}>
            <mesh position={[-8.2, 0.6, i * 32 - 40]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
            <mesh position={[8.2, 0.6, i * 32 - 40]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#8b6bff" />
            </mesh>
          </React.Fragment>
        ))}

        {!effectiveReduced && <Particles count={isMobile ? 25 : 40} />}

        <Suspense fallback={null}>
          <Cars isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
