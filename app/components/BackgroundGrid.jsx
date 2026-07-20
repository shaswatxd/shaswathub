"use client";

import React from 'react';

export default function BackgroundGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Static Cyber Grid Lines (Zero CPU/GPU animation load) */}
      <div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07] bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px]" 
      />

      {/* Static Radial Dot Matrix Grid */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.10] bg-[radial-gradient(#0a0a0a_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#808080_1.5px,transparent_1.5px)] bg-[size:30px_30px]" 
      />

      {/* Static Ambient Glow Blob 1 (Top Left Cyan) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,194,209,0.06)_0%,transparent_70%)] -top-[10%] -left-[10%]"
      />

      {/* Static Ambient Glow Blob 2 (Middle Right Violet) */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,107,255,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(139,107,255,0.05)_0%,transparent_70%)] top-[40%] -right-[10%]"
      />
    </div>
  );
}
