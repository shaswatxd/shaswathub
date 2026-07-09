"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const WHAT_I_BUILD = [
  {
    title: "Desktop Applications",
    desc: "Native desktop experiences utilizing Electron, system-level APIs, multi-threading, and offline-first data synchronization structures.",
    icon: "🖥️",
    color: "#00f0ff",
    tags: ["Electron", "Node.js", "FFmpeg", "IPC Router"]
  },
  {
    title: "Web Applications",
    desc: "Full-stack client-server React web apps built with real-time web socket connections, 3D WebGL scenes, and server-side operations.",
    icon: "🌐",
    color: "#8b6bff",
    tags: ["React", "Next.js", "Three.js", "WebSockets"]
  },
  {
    title: "Developer Utilities",
    desc: "Command-line tools, local compilation shells, custom scripts, and build tools designed to automate tedious deployment paths.",
    icon: "⚙️",
    color: "#ff3d9a",
    tags: ["Node Scripts", "Python", "CLI Tooling", "Git Hooks"]
  },
];

const WhatIBuildCard = React.memo(function WhatIBuildCard({ item, idx }) {
  const cardRef = useRef(null);

  // Mousemove handler to update spotlight coords
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set variables as percentages for the radial gradient
    card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative glass-card spotlight-card p-8 rounded-2xl overflow-hidden group hover:scale-[1.015] hover:-translate-y-1.5 transition-all duration-300"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: "spring", stiffness: 70, damping: 14, delay: idx * 0.08 }}
      style={{
        '--wib-accent': item.color,
      }}
    >
      {/* Top glowing line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent 15%, ${item.color} 50%, transparent 85%)` }}
      />
      
      {/* Glow icon wrapper */}
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 select-none" 
        style={{ 
          background: `${item.color}15`, 
          border: `1px solid ${item.color}33`, 
          boxShadow: `0 0 15px ${item.color}0a` 
        }}
      >
        {item.icon}
      </div>

      <h3 className="font-display font-bold text-lg mb-3 text-[#e8edf8] group-hover:text-white transition-colors duration-300">
        {item.title}
      </h3>
      
      <p className="text-[#8895b0] text-[12px] leading-relaxed mb-6">
        {item.desc}
      </p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.04]">
        {item.tags.map((tag, i) => (
          <span 
            key={i} 
            className="font-mono text-[9px] tracking-wide px-2.5 py-1 rounded-md border" 
            style={{ 
              color: item.color, 
              borderColor: `${item.color}22`,
              backgroundColor: `${item.color}05`
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
});

export default function WhatIBuild() {
  return (
    <>
      {/* Section Header */}
      <div id="builds" className="max-w-[1480px] mx-auto px-8 flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-8 animate-section">
        <h2 
          className="font-display font-bold text-xl" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #e8edf8, #00f0ff)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            backgroundClip: 'text' 
          }}
        >
          What I Build
        </h2>
        <div className="font-mono text-[10px] text-[#8895b0] select-none">// Areas of focus &amp; core expertise</div>
      </div>

      {/* Grid container changed to 3 columns to perfectly fit the 3 items */}
      <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {WHAT_I_BUILD.map((item, idx) => (
          <WhatIBuildCard key={idx} item={item} idx={idx} />
        ))}
      </div>
    </>
  );
}
