"use client";

import React from 'react';

// Ultra-light, GPU-accelerated cyber background.
// Pure CSS transforms — no WebGL, no external assets. Buttery smooth on every device.
const CyberBackground = React.memo(function CyberBackground({ prefersReduced }) {
  return (
    <div className="cyber-bg" aria-hidden="true">
      {/* Deep radial base glow */}
      <div className="cyber-bg__glow" />

      {/* Perspective scrolling neon grid floor */}
      {!prefersReduced && (
        <div className="cyber-bg__scene">
          <div className="cyber-bg__grid" />
        </div>
      )}

      {/* Neon horizon line */}
      <div className="cyber-bg__horizon" />

      {/* Floating particles */}
      {!prefersReduced && (
        <div className="cyber-bg__particles">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={`cyber-bg__dot cyber-bg__dot--${i % 4}`} />
          ))}
        </div>
      )}

      {/* Vignette / fog fade for depth */}
      <div className="cyber-bg__fog" />
    </div>
  );
});

export default CyberBackground;
