"use client";
import React, { useRef, useMemo, useState, useEffect, Suspense, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

const Particles = memo(function Particles({ count = 30 }) {
  const mesh = useRef();
  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0, 0.94, 1],
      [0.545, 0.42, 1],
      [1, 0.24, 0.6],
      [1, 0.82, 0.4],
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

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.12,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.008;
    mesh.current.position.y = Math.sin(t * 0.08) * 1.2;
    material.opacity = 0.35 + Math.sin(t * 0.6) * 0.12;
  });

  return <points ref={mesh} geometry={geometry} material={material} />;
});

const LuxuryCar = memo(function LuxuryCar({ initialZ, lane, speed, color, rimColor, underglowColor, isMobile, reduced }) {
  const groupRef = useRef();
  const bodyGroupRef = useRef();
  const wheelsRef = useRef([]);
  const trailRef = useRef();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const { scene } = useGLTF('/models/ferrari.glb');

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    const createdMaterials = [];
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;
        if (child.name === 'body' || child.name.includes('body') || child.name.includes('paint')) {
          const m = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(color),
            metalness: 0.85,
            roughness: 0.1,
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            envMapIntensity: 1.4,
          });
          child.material = m;
          createdMaterials.push(m);
        }
        if (child.name.includes('rim') || child.name.includes('spoke')) {
          const m = new THREE.MeshPhysicalMaterial({
            color: rimColor,
            metalness: 0.95,
            roughness: 0.08,
            clearcoat: 0.6,
          });
          child.material = m;
          createdMaterials.push(m);
        }
        if (child.name.includes('tire') || child.name.includes('wheel')) {
          const m = new THREE.MeshStandardMaterial({
            color: '#121212',
            roughness: 0.85,
            metalness: 0.1,
          });
          child.material = m;
          createdMaterials.push(m);
        }
      }
    });
    clone.userData.materials = createdMaterials;
    return clone;
  }, [scene, color, rimColor]);

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

  useEffect(() => {
    return () => {
      if (clonedScene.userData.materials) {
        clonedScene.userData.materials.forEach(m => m.dispose());
      }
    };
  }, [clonedScene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const speedPerSecond = speed * 60;
    groupRef.current.position.z += speedPerSecond * dt;
    if (groupRef.current.position.z > 22) {
      groupRef.current.position.z = -220 - Math.random() * 40;
    }
    const wheelSpin = speedPerSecond * 4 * dt;
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x += wheelSpin;
    });

    if (!reduced && bodyGroupRef.current) {
      const t = state.clock.getElapsedTime();
      bodyGroupRef.current.position.y = Math.sin(t * 3.2 + phase) * 0.012;
      bodyGroupRef.current.rotation.z = Math.sin(t * 1.7 + phase) * 0.006;
      bodyGroupRef.current.rotation.x = Math.sin(t * 2.1 + phase) * 0.004;
    }

    if (trailRef.current) {
      const speedNorm = THREE.MathUtils.clamp((speed - 0.14) / 0.1, 0, 1);
      trailRef.current.material.opacity = 0.1 + speedNorm * 0.16;
      trailRef.current.scale.z = 1 + speedNorm * 0.6;
    }
  });

  const underglowGeo = useMemo(() => new THREE.PlaneGeometry(1.9, 4.4), []);
  const underglowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: underglowColor,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [underglowColor]);

  const trailGeo = useMemo(() => new THREE.PlaneGeometry(1.5, 9), []);
  const trailMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: underglowColor,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [underglowColor]);

  useEffect(() => {
    return () => {
      underglowGeo.dispose();
      underglowMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
    };
  }, [underglowGeo, underglowMat, trailGeo, trailMat]);

  return (
    <group ref={groupRef} position={[lane, 0.05, initialZ]} scale={[0.82, 0.82, 0.82]} rotation={[0, Math.PI, 0]}>
      <group ref={bodyGroupRef}>
        <primitive object={clonedScene} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} geometry={underglowGeo} material={underglowMat} />
      {!isMobile && <pointLight color={underglowColor} intensity={1.5} distance={4} position={[0, -0.05, 0]} />}
      {!isMobile && (
        <mesh
          ref={trailRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.02, -6.2]}
          geometry={trailGeo}
          material={trailMat}
        />
      )}
    </group>
  );
});

const DashLines = memo(function DashLines() {
  const groupRef = useRef();
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      arr.push({ z: -i * 18 - 5, key: i });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const step = 0.32 * 60 * dt;
    groupRef.current.children.forEach(child => {
      child.position.z += step;
      if (child.position.z > 22) child.position.z -= 324;
    });
  });

  const geo = useMemo(() => new THREE.BoxGeometry(0.08, 0.02, 4.5), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.25 }), []);

  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  return (
    <group ref={groupRef}>
      {lines.map(({ z, key }) => (
        <mesh key={key} position={[0, 0.04, z]} geometry={geo} material={mat} />
      ))}
    </group>
  );
});

const CAR_SPECS = [
  { color: '#0e2f6e', rim: '#d9dee6', underglow: '#2f7bff' },
  { color: '#efe6d2', rim: '#e6c07a', underglow: '#ffcf7a' },
  { color: '#0a0a0c', rim: '#8a8a92', underglow: '#c76bff' },
];

const Cars = memo(function Cars({ isMobile, reduced }) {
  const CAR_COUNT = isMobile ? 1 : 3;

  const carData = useMemo(() => {
    const data = [];
    for (let i = 0; i < CAR_COUNT; i++) {
      const spec = CAR_SPECS[i % CAR_SPECS.length];
      data.push({
        id: i,
        initialZ: -20 - i * 65,
        lane: LANES[i % 2],
        speed: 0.15 + Math.random() * 0.05,
        color: spec.color,
        rimColor: spec.rim,
        underglow: spec.underglow,
      });
    }
    return data;
  }, [CAR_COUNT]);

  return (
    <>
      {carData.map(car => (
        <LuxuryCar
          key={car.id}
          initialZ={car.initialZ}
          lane={car.lane}
          speed={car.speed}
          color={car.color}
          rimColor={car.rimColor}
          underglowColor={car.underglow}
          isMobile={isMobile}
          reduced={reduced}
        />
      ))}
    </>
  );
});

useGLTF.preload('/models/ferrari.glb');

const CameraRig = memo(function CameraRig({ reduced }) {
  const { camera } = useThree();
  const base = useMemo(() => new THREE.Vector3(0, 5.2, 16), []);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    camera.position.x = base.x + Math.sin(t * 0.12) * 0.35;
    camera.position.y = base.y + Math.sin(t * 0.09) * 0.18;
    camera.lookAt(0, 0.6, -70);
  });

  return null;
});

const Scene3D = memo(function Scene3D({ prefersReduced }) {
  const isMobile = useIsMobile();
  const effectiveReduced = prefersReduced || isMobile;

  const roadGeo = useMemo(() => new THREE.PlaneGeometry(18, 550), []);
  const roadMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#060810', roughness: 0.35, metalness: 0.4 }), []);
  const borderGeo = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 550), []);
  const border1Mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#00f0ff' }), []);
  const border2Mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#8b6bff' }), []);

  useEffect(() => {
    return () => {
      roadGeo.dispose();
      roadMat.dispose();
      borderGeo.dispose();
      border1Mat.dispose();
      border2Mat.dispose();
    };
  }, [roadGeo, roadMat, borderGeo, border1Mat, border2Mat]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', willChange: 'transform' }}>
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
          precision: isMobile ? 'lowp' : 'highp',
        }}
        dpr={isMobile ? 0.6 : 1}
        frameloop={effectiveReduced ? "never" : "always"}
        onCreated={({ scene, camera, gl }) => {
          scene.fog = new THREE.FogExp2(0x060810, 0.024);
          camera.lookAt(0, 0.6, -70);
          if (isMobile) gl.setPixelRatio(0.6);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <hemisphereLight args={[0xaaccff, 0x110022, 0.6]} />
        <directionalLight args={[0xffffff, 1.0]} position={[10, 20, 8]} />
        {!isMobile && <pointLight color="#00f0ff" intensity={1.2} distance={20} position={[-8, 4, -20]} />}
        {!isMobile && <pointLight color="#ff9de2" intensity={0.6} distance={18} position={[8, 5, -12]} />}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -200]} geometry={roadGeo} material={roadMat} />

        <gridHelper
          args={[550, 55, '#00f0ff', '#1a0e44']}
          position={[0, 0.02, -200]}
          material-transparent
          material-opacity={0.15}
        />

        <DashLines />

        <mesh position={[-8.2, 0.1, -200]} geometry={borderGeo} material={border1Mat} />
        <mesh position={[8.2, 0.1, -200]} geometry={borderGeo} material={border2Mat} />

        {!effectiveReduced && <Particles count={isMobile ? 12 : 24} />}

        <Suspense fallback={null}>
          <Cars isMobile={isMobile} reduced={effectiveReduced} />
        </Suspense>

        <CameraRig reduced={effectiveReduced} />
      </Canvas>
    </div>
  );
});

export default Scene3D;
