"use client";

import React from 'react';
import { motion } from 'framer-motion';

const TECH_STACK = [
  { name: "React", icon: "⚛️", color: "#61dafb" },
  { name: "Electron", icon: "⚡", color: "#47848f" },
  { name: "Node.js", icon: "🟢", color: "#3ef07c" },
  { name: "Three.js", icon: "🔺", color: "#8b6bff" },
  { name: "Socket.IO", icon: "🔌", color: "#00f0ff" },
  { name: "WebRTC", icon: "📡", color: "#ff3d9a" },
  { name: "PeerJS", icon: "🔗", color: "#00cdac" },
  { name: "Vite", icon: "🔥", color: "#f5a623" },
  { name: "FFmpeg", icon: "🎬", color: "#ff3d9a" },
  { name: "Python", icon: "🐍", color: "#ffd43b" },
  { name: "Git", icon: "🔀", color: "#f05032" },
  { name: "MongoDB", icon: "🍃", color: "#00ed64" },
  { name: "Tailwind", icon: "🌊", color: "#38bdf8" },
  { name: "Stripe", icon: "💳", color: "#8b6bff" },
  { name: "Prisma", icon: "🔷", color: "#2D3748" },
  { name: "Supabase", icon: "⚡", color: "#3ECF8E" },
];

const TechBadge = React.memo(function TechBadge({ tech, idx }) {
  return (
    <motion.div
      className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] cursor-default"
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: idx * 0.025, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -3,
        scale: 1.03,
        boxShadow: `0 8px 24px ${tech.color}18`,
        borderColor: `${tech.color}77`,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
    >
      <span className="text-lg">{tech.icon}</span>
      <span className="font-mono text-xs font-medium text-[#e8edf8] tracking-wide">{tech.name}</span>
    </motion.div>
  );
});
TechBadge.displayName = 'TechBadge';

const TechStack = React.memo(function TechStack() {
  return (
    <>
      <div id="stack" className="max-w-[1480px] mx-auto px-8 flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-8 animate-section">
        <h2 className="font-display font-bold text-xl" style={{ backgroundImage: 'linear-gradient(to right, #e8edf8, #00f0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Tech Stack</h2>
        <div className="font-mono text-[10px] text-[#8895b0]">// Tools I build with daily</div>
      </div>
      <div className="max-w-[1200px] mx-auto px-8 flex flex-wrap gap-3.5 mb-16">
        {TECH_STACK.map((tech, idx) => (
          <TechBadge key={idx} tech={tech} idx={idx} />
        ))}
      </div>
    </>
  );
});

export default TechStack;
