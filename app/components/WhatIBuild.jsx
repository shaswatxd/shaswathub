"use client";

import React from 'react';
import { motion } from 'framer-motion';

const WHAT_I_BUILD = [
  {
    title: "Desktop Apps",
    desc: "Native-feeling desktop experiences with Electron, system-level APIs, and offline-first architectures.",
    icon: "🖥️",
    color: "#00f0ff",
    tags: ["Electron", "Node.js", "FFmpeg"]
  },
  {
    title: "Web Applications",
    desc: "Full-stack React web apps with real-time features, modern UI frameworks, and production-grade deployments.",
    icon: "🌐",
    color: "#8b6bff",
    tags: ["React", "Vite", "Three.js"]
  },
  {
    title: "Developer Tools",
    desc: "CLI utilities, automation scripts, and dev tooling that solve real problems and save hours of manual work.",
    icon: "⚙️",
    color: "#00cdac",
    tags: ["Python", "Git", "Automation"]
  },
];

const WhatIBuildCard = React.memo(function WhatIBuildCard({ item, idx }) {
  return (
    <motion.div
      className="relative bg-[#080b16] border border-white/[0.08] rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8),0_0_35px_-10px_var(--wib-glow)] hover:border-white/[0.16] group"
      style={{ 
        '--wib-color': item.color,
        '--wib-glow': `${item.color}20`
      }}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: "spring", stiffness: 70, damping: 14, delay: idx * 0.08 }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
      />
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 hover:scale-110 hover:-rotate-3" style={{ background: `${item.color}15`, border: `1px solid ${item.color}33` }}>
        {item.icon}
      </div>
      <h3 className="font-display font-bold text-lg mb-2.5 text-[#e8edf8]">{item.title}</h3>
      <p className="text-[#8895b0] text-xs leading-relaxed mb-5">{item.desc}</p>
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag, i) => (
          <span key={i} className="font-mono text-[10px] tracking-wide px-2.5 py-1 rounded-md border border-white/[0.06] bg-white/[0.01]" style={{ color: item.color, borderColor: `${item.color}22` }}>
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
      <div id="builds" className="max-w-[1480px] mx-auto px-8 flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-8 animate-section">
        <h2 className="font-display font-bold text-xl" style={{ backgroundImage: 'linear-gradient(to right, #e8edf8, #00f0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>What I Build</h2>
        <div className="font-mono text-[10px] text-[#8895b0]">// Areas of focus &amp; expertise</div>
      </div>
      <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {WHAT_I_BUILD.map((item, idx) => (
          <WhatIBuildCard key={idx} item={item} idx={idx} />
        ))}
      </div>
    </>
  );
}
