"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Custom Shader Material for the digital wave grid
const WaveGrid = React.memo(function WaveGrid({ prefersReduced }) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  // Custom Shader definition
  const shaderData = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vPosition;
        varying float vDistToMouse;
        
        void main() {
          vec3 pos = position;
          
          // Wave displacement
          float wave = sin(pos.x * 0.15 + uTime * 1.3) * 0.45 + 
                       cos(pos.y * 0.15 + uTime * 1.0) * 0.45;
          
          // Distance from mouse in local coordinate system
          vec2 mouseLocal = uMouse * vec2(15.0, 10.0);
          float dist = distance(pos.xy, mouseLocal);
          vDistToMouse = dist;
          
          // Soft push force away from mouse
          float force = 0.0;
          if (dist < 7.0) {
            force = (7.0 - dist) * 0.35;
          }
          
          pos.z += wave + force;
          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying float vDistToMouse;
        
        void main() {
          vec3 cyan = vec3(0.0, 0.94, 1.0);      // #00f0ff
          vec3 violet = vec3(0.54, 0.42, 1.0);    // #8b6bff
          vec3 magenta = vec3(1.0, 0.24, 0.6);   // #ff3d9a
          
          // Mix colors based on position z-displacement
          float heightFactor = (vPosition.z + 1.0) * 0.5;
          heightFactor = clamp(heightFactor, 0.0, 1.0);
          vec3 baseColor = mix(cyan, violet, heightFactor);
          
          // Ripple overlay for mouse proximity
          if (vDistToMouse < 6.0) {
            float glow = (6.0 - vDistToMouse) / 6.0;
            baseColor = mix(baseColor, magenta, glow * 0.4);
            baseColor += cyan * glow * 0.3; // add glow emission
          }
          
          // Distance radial fade to blend with deep dark bg
          float radialFade = 1.0 - (length(vPosition.xy) / 24.0);
          radialFade = clamp(radialFade, 0.0, 1.0);
          radialFade = pow(radialFade, 1.5); // smoother falloff
          
          gl_FragColor = vec4(baseColor, radialFade * 0.28);
        }
      `
    };
  }, []);

  useFrame((state) => {
    if (prefersReduced) return;
    
    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      
      // Smoothly interpolate mouse uniform
      const pointer = state.pointer; // coordinates between -1 and 1
      const currentMouse = materialRef.current.uniforms.uMouse.value;
      currentMouse.x = THREE.MathUtils.lerp(currentMouse.x, pointer.x, 0.08);
      currentMouse.y = THREE.MathUtils.lerp(currentMouse.y, pointer.y, 0.08);
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -2, -4]}>
      <planeGeometry args={[45, 30, 48, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={shaderData.vertexShader}
        fragmentShader={shaderData.fragmentShader}
        uniforms={shaderData.uniforms}
        transparent={true}
        wireframe={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});

// Floating Particle System - GPU Animated (Zero CPU Buffer Uploads)
const FloatingParticles = React.memo(function FloatingParticles({ count = 35, prefersReduced }) {
  const pointsRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Random spread in a bounding volume
      pos[i * 3] = (Math.random() - 0.5) * 40;     // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30; // Z
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (prefersReduced || !pointsRef.current) return;
    
    const t = state.clock.getElapsedTime();
    // Rotate and sway the entire group on the GPU
    pointsRef.current.rotation.y = t * 0.025;
    pointsRef.current.rotation.x = t * 0.015;
    pointsRef.current.position.y = Math.sin(t * 0.25) * 1.5;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.075}
        transparent={true}
        opacity={0.35}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

// Camera parallax movement
const CameraRig = React.memo(function CameraRig({ prefersReduced }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    if (prefersReduced) return;
    
    const pointer = state.pointer;
    // Calculate targeted position
    const targetX = pointer.x * 2.2;
    const targetY = 3.5 + pointer.y * 1.5;
    
    // Smooth transition
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(0, 0.8, -10);
  });

  return null;
});

const Scene3D = React.memo(function Scene3D({ prefersReduced }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const particleCount = isMobile ? 15 : 45;
  const dprValue = 1; // Explicit static DPR as per requirements to avoid throttling

  return (
    <div className="fixed inset-0 z-0 bg-[#020204] overflow-hidden pointer-events-none">
      {/* Background radial overlay gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,20,36,0.2)_0%,rgba(2,2,4,0.95)_90%)] z-[1]" />
      
      <Canvas
        camera={{ position: [0, 3.5, 14], fov: 50, near: 0.1, far: 100 }}
        style={{ display: 'block', width: '100vw', height: '100vh' }}
        gl={{
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false, // Turn off depth buffer for performance (since we use wireframes and particles)
        }}
        dpr={dprValue}
        frameloop={prefersReduced ? "never" : "always"}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <ambientLight intensity={0.4} />
        
        <WaveGrid prefersReduced={prefersReduced} />
        
        <FloatingParticles count={particleCount} prefersReduced={prefersReduced} />
        
        <CameraRig prefersReduced={prefersReduced} />
      </Canvas>
    </div>
  );
});

export default Scene3D;
