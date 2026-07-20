"use client";

import React, { useEffect, useRef } from 'react';

export default function BackgroundGrid() {
  const spotlightRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate3d(${e.clientX - 350}px, ${e.clientY - 350}px, 0)`;
        }
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Moving Cyber Grid Lines (Pure CSS GPU Composite Layer — Dark/Light adapt) */}
      <div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px] animate-[gridScroll_40s_linear_infinite] transform-gpu" 
      />

      {/* Radial Dot Matrix Grid */}
      <div 
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12] bg-[radial-gradient(#0a0a0a_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#808080_1.5px,transparent_1.5px)] bg-[size:30px_30px] transform-gpu" 
      />

      {/* Sweeping Cyber Laser Light Beam */}
      <div
        className="absolute w-[200vw] h-[2px] bg-gradient-to-r from-transparent via-cyan/45 dark:via-cyan/35 to-transparent shadow-[0_0_15px_#00c2d1] -top-1/2 -left-1/2 animate-[laserSweep_14s_ease-in-out_infinite] transform-gpu pointer-events-none"
      />

      {/* Mouse Spotlight Glow (Translates on GPU compositor thread) */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.14)_0%,rgba(139,107,255,0.07)_40%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.15)_0%,rgba(139,107,255,0.08)_40%,transparent_70%)] pointer-events-none transition-transform duration-100 ease-out transform-gpu"
        style={{ transform: 'translate3d(-1000px, -1000px, 0)' }}
      />

      {/* Floating Ambient GPU Glow Blob 1 (Top Left Cyan/Violet) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.10)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.08)_0%,transparent_70%)] top-[5%] -left-[10%] animate-[floatBlob1_25s_ease-in-out_infinite] transform-gpu"
      />

      {/* Floating Ambient GPU Glow Blob 2 (Middle Right Purple/Magenta) */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,107,255,0.10)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(139,107,255,0.07)_0%,transparent_70%)] top-[35%] -right-[10%] animate-[floatBlob2_30s_ease-in-out_infinite] transform-gpu"
      />
    </div>
  );
}
