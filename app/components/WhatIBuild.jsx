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
    title: "P2P & Real-Time",
    desc: "Peer-to-peer file sharing, WebRTC streaming, and real-time communication systems with zero server dependency.",
    icon: "📡",
    color: "#ff3d9a",
    tags: ["WebRTC", "PeerJS", "Socket.IO"]
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
      className="relative bg-white/[0.03] md:bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 overflow-hidden backdrop-blur-none md:backdrop-blur-xl"
      style={{ '--wib-color': item.color }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -8,
        boxShadow: `0 20px 40px -15px rgba(0,0,0,0.7), 0 0 45px -10px ${item.color}25`,
        borderColor: `rgba(255,255,255,0.16)`,
        transition: { type: 'spring', stiffness: 220, damping: 14 }
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 hover:opacity-100 transition-opacity duration-500"
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
