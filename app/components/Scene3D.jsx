"use client";

/**
 * Fullscreen premium WebGL background. Fixed behind all page content (z-0, pointer-events:none)
 * so existing layout/routing/clickability is untouched — this file only adds a visual layer.
 *
 * Quality tiers:
 *  - "high": glass MeshTransmissionMaterial shapes + Bloom/Vignette postprocessing, DPR up to 2
 *  - "low":  cheap MeshPhysicalMaterial shapes, no postprocessing, DPR capped at 1
 * Tier is chosen from device signals on mount, then live-adjusted by <PerformanceMonitor>
 * if the frame rate actually drops — so a "high-end" phone isn't punished, and a
 * struggling desktop isn't stuck rendering bloom it can't afford.
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshTransmissionMaterial,
  Sparkles,
  PerformanceMonitor,
  Preload,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const ACCENTS = ['#00f0ff', '#8b6bff', '#ff3d9a', '#3ef07c'];

// Deterministic pseudo-random layout so shapes don't jump around between renders/reloads
const SHAPE_LAYOUT = Array.from({ length: 7 }).map((_, i) => {
  const angle = (i / 7) * Math.PI * 2;
  const radius = 3.4 + (i % 3) * 0.9;
  return {
    position: [Math.cos(angle) * radius, Math.sin(angle * 1.3) * 2.1, -2 - (i % 4) * 1.4],
    scale: 0.55 + (i % 3) * 0.22,
    speed: 0.15 + (i % 5) * 0.05,
    rotAxis: [Math.sin(i), Math.cos(i * 1.7), Math.sin(i * 0.5)],
    color: ACCENTS[i % ACCENTS.length],
    geo: i % 3, // 0: icosahedron, 1: torus knot, 2: octahedron
  };
});

function GlassShape({ position, scale, speed, rotAxis, color, geo, quality }) {
  const ref = useRef(null);
  const start = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + start;
    // Gentle floating bob + slow tumble — delta-time based so speed is frame-rate independent
    ref.current.position.y = position[1] + Math.sin(t) * 0.4;
    ref.current.rotation.x += delta * 0.06 * rotAxis[0];
    ref.current.rotation.y += delta * 0.08 * rotAxis[1];
    ref.current.rotation.z += delta * 0.05 * rotAxis[2];
  });

  const geometry = useMemo(() => {
    if (geo === 0) return <icosahedronGeometry args={[1, 1]} />;
    if (geo === 1) return <torusKnotGeometry args={[0.7, 0.24, 128, 16]} />;
    return <octahedronGeometry args={[1, 0]} />;
  }, [geo]);

  return (
    <mesh ref={ref} position={position} scale={scale} frustumCulled>
      {geometry}
      {quality === 'high' ? (
        <MeshTransmissionMaterial
          color={color}
          thickness={0.6}
          roughness={0.08}
          transmission={1}
          ior={1.25}
          chromaticAberration={0.02}
          backside
          samples={6}
          resolution={256}
          distortion={0.1}
          temporalDistortion={0.1}
          emissive={color}
          emissiveIntensity={0.05}
        />
      ) : (
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.3}
          transmission={0.85}
          transparent
          opacity={0.65}
          emissive={color}
          emissiveIntensity={0.06}
        />
      )}
    </mesh>
  );
}

// Thin additive-blended cones standing in for volumetric light shafts — cheap fake that
// reads as "light rays" without a real volumetric raymarch pass.
function LightRays({ quality }) {
  const group = useRef(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.015;
  });
  const count = quality === 'high' ? 3 : 2;
  return (
    <group ref={group} position={[0, 2, -6]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI, 0, (i / count) * Math.PI * 2]} frustumCulled>
          <coneGeometry args={[2.6, 9, 24, 1, true]} />
          <meshBasicMaterial
            color={ACCENTS[i % ACCENTS.length]}
            transparent
            opacity={0.035}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Reads live pointer position from a ref (no React re-renders on mousemove) and drives
// a subtle parallax + slow sinusoidal "breathing" dolly on the camera.
function CameraRig({ pointerRef }) {
  useFrame((state, delta) => {
    const px = pointerRef?.current?.x ?? 0;
    const py = pointerRef?.current?.y ?? 0;
    const breathe = Math.sin(state.clock.elapsedTime * 0.25) * 0.35;

    const targetX = px * 1.1;
    const targetY = py * 0.7;
    const targetZ = 9 + breathe;

    // Critically-damped lerp toward target — frame-rate independent smoothing
    const damp = 1 - Math.pow(0.001, delta);
    state.camera.position.x += (targetX - state.camera.position.x) * damp;
    state.camera.position.y += (targetY - state.camera.position.y) * damp;
    state.camera.position.z += (targetZ - state.camera.position.z) * damp * 0.6;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContents({ quality }) {
  return (
    <>
      <color attach="background" args={['#020204']} />
      <fogExp2 attach="fog" args={['#020204', 0.055]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[6, 4, 4]} intensity={40} color="#00f0ff" distance={20} decay={2} />
      <pointLight position={[-6, -3, 2]} intensity={35} color="#8b6bff" distance={20} decay={2} />
      <pointLight position={[0, 5, -4]} intensity={25} color="#ff3d9a" distance={22} decay={2} />

      <LightRays quality={quality} />

      {SHAPE_LAYOUT.map((s, i) => (
        <GlassShape key={i} {...s} quality={quality} />
      ))}

      <Sparkles
        count={quality === 'high' ? 180 : 60}
        scale={[14, 8, 10]}
        size={2.2}
        speed={0.25}
        opacity={0.55}
        color="#e8edf8"
        noise={1}
      />

      <Preload all />
    </>
  );
}

const Scene3D = React.memo(function Scene3D({ pointerRef }) {
  // Start conservative on mobile/low-core devices; PerformanceMonitor can only ever
  // downgrade further from here if real frame times say so.
  const [quality, setQuality] = useState(() => {
    if (typeof window === 'undefined') return 'low';
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const lowCores = (navigator.hardwareConcurrency || 4) <= 4;
    const smallScreen = window.innerWidth < 768;
    return coarsePointer || smallScreen || lowCores ? 'low' : 'high';
  });

  const handleDecline = useCallback(() => setQuality('low'), []);

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={quality === 'high' ? [1, 2] : [1, 1]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 40 }}
        frameloop="always"
      >
        <PerformanceMonitor onDecline={handleDecline} bounds={() => [40, 58]} />
        <SceneContents quality={quality} />
        <CameraRig pointerRef={pointerRef} />
        {quality === 'high' && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.55} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.65} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
});

export default Scene3D;
