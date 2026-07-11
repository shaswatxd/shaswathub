"use client";

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function BackgroundGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse spotlight tracking - optimized response
  const springX = useSpring(mouseX, { damping: 60, stiffness: 140, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 60, stiffness: 140, mass: 0.5 });

  useEffect(() => {
    let frameId;
    const handleMouseMove = (e) => {
      // Throttle mouse updates to requestAnimationFrame to prevent event flooding lag
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        mouseX.set(e.pageX);
        mouseY.set(e.pageY);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Tactile Noise Texture Overlay (uses low opacity, optimized blend mode) */}
      <div 
        className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Cyber Grid Lines (hardware accelerated, low opacity) */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px] translate-z-0" 
      />

      {/* Radial Dot Grid Pattern (hardware accelerated, low opacity) */}
      <div 
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12] bg-[radial-gradient(#808080_1.5px,transparent_1.5px)] bg-[size:30px_30px] translate-z-0" 
      />

      {/* Mouse Spotlight Radial Glow (hardware accelerated via translate-z-0, no blur filter) */}
      <motion.div
        className="absolute w-[750px] h-[750px] -left-[375px] -top-[375px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.07)_0%,rgba(0,194,209,0.05)_40%,rgba(0,194,209,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.06)_0%,rgba(0,194,209,0)_70%)] translate-z-0"
        style={{
          x: springX,
          y: springY,
        }}
      />

      {/* Floating Ambient Blobs - Optimised using radial-gradients instead of expensive CSS blur filters */}
      {/* Cyan/Aqua Glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.1)_0%,rgba(0,194,209,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.03)_0%,rgba(0,194,209,0)_70%)] top-[10%] left-[5%] translate-z-0"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Indigo/Violet Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.07)_0%,rgba(99,102,241,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.02)_0%,rgba(99,102,241,0)_70%)] top-[35%] right-[5%] translate-z-0"
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.95, 1.08, 1],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Rose/Pink Bottom Glow */}
      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.07)_0%,rgba(244,63,94,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.02)_0%,rgba(244,63,94,0)_70%)] bottom-[15%] left-[15%] translate-z-0"
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
