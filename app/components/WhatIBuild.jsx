"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const WHAT_I_BUILD = [
  {
    title: "Desktop Applications",
    desc: "Native desktop experiences utilizing Electron, system-level APIs, multi-threading, and offline-first data synchronization structures.",
    icon: "🖥️",
    tags: ["Electron", "Node.js", "FFmpeg", "IPC Router"]
  },
  {
    title: "Web Applications",
    desc: "Full-stack client-server React web apps built with real-time web socket connections, 3D WebGL scenes, and server-side operations.",
    icon: "🌐",
    tags: ["React", "Next.js", "Three.js", "WebSockets"]
  },
  {
    title: "Developer Utilities",
    desc: "Command-line tools, local compilation shells, custom scripts, and build tools designed to automate tedious deployment paths.",
    icon: "⚙️",
    tags: ["Node Scripts", "Python", "CLI Tooling", "Git Hooks"]
  },
];

const WhatIBuildCard = React.memo(function WhatIBuildCard({ item, idx, isLast }) {
  const cardRef = useRef(null);

  // Mousemove handler to update spotlight coords
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`card spotlight-card p-8 flex flex-col border-b ${isLast ? '' : 'md:border-r'} border-r border-[#e8e8e8]`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: "spring", stiffness: 70, damping: 14, delay: idx * 0.08 }}
    >
      <div className="relative z-10 w-12 h-12 border border-[#0a0a0a] dark:border-white/25 flex items-center justify-center text-xl mb-6">
        {item.icon}
      </div>

      <h3 className="relative z-10 font-semibold text-lg mb-2 text-[#0a0a0a] dark:text-[#f2f2f2]">
        {item.title}
      </h3>

      <p className="relative z-10 text-sm text-[#555] dark:text-[#aaa] leading-relaxed mb-6 flex-1">
        {item.desc}
      </p>

      <div className="relative z-10 flex flex-wrap gap-2">
        {item.tags.map((tag, i) => (
          <span key={i} className="border border-[#e8e8e8] dark:border-white/15 px-2.5 py-1 font-mono text-[10px] text-[#666] dark:text-[#999]">
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
      <div id="builds" className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-20 pb-10 animate-section">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan mb-4 inline-block">Areas of Focus</span>
        <h2 className="font-semibold text-4xl lg:text-5xl tracking-tight text-[#0a0a0a] dark:text-[#f2f2f2]">What I Build</h2>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#e8e8e8] dark:border-white/15 mb-4">
        {WHAT_I_BUILD.map((item, idx) => (
          <WhatIBuildCard key={idx} item={item} idx={idx} isLast={idx === WHAT_I_BUILD.length - 1} />
        ))}
      </div>
    </>
  );
}
