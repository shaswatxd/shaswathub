"use client";

import React from 'react';
import { motion } from 'framer-motion';

const TECH_STACK = [
  { name: "React", icon: "⚛️" },
  { name: "Electron", icon: "⚡" },
  { name: "Node.js", icon: "🟢" },
  { name: "Three.js", icon: "🔺" },
  { name: "Socket.IO", icon: "🔌" },
  { name: "WebRTC", icon: "📡" },
  { name: "PeerJS", icon: "🔗" },
  { name: "Vite", icon: "🔥" },
  { name: "FFmpeg", icon: "🎬" },
  { name: "Python", icon: "🐍" },
  { name: "Git", icon: "🔀" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Tailwind", icon: "🌊" },
  { name: "Stripe", icon: "💳" },
  { name: "Prisma", icon: "🔷" },
  { name: "Supabase", icon: "⚡" },
];

const TechBadge = React.memo(function TechBadge({ tech, idx }) {
  return (
    <motion.div
      className="card flex flex-col items-center gap-3 p-6 text-center border-r border-b border-[#e8e8e8] dark:border-white/15"
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: idx * 0.02, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-2xl">{tech.icon}</span>
      <span className="text-xs font-medium text-[#0a0a0a] dark:text-[#f2f2f2]">{tech.name}</span>
    </motion.div>
  );
});
TechBadge.displayName = 'TechBadge';

const TechStack = React.memo(function TechStack() {
  return (
    <>
      <div id="stack" className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-20 pb-10 animate-section">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan mb-4 inline-block">The Toolkit</span>
        <h2 className="font-semibold text-4xl lg:text-5xl tracking-tight text-[#0a0a0a] dark:text-[#f2f2f2] mb-6">Powered by a modern stack, obsessed with performance.</h2>
        <p className="text-[#555] dark:text-[#aaa] leading-relaxed max-w-md">Every project in this console is built, deployed, and monitored using the same battle-tested toolkit — chosen for speed, DX, and zero compromise on polish.</p>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 grid grid-cols-2 sm:grid-cols-4 border-t border-l border-[#e8e8e8] dark:border-white/15 mb-4">
        {TECH_STACK.map((tech, idx) => (
          <TechBadge key={idx} tech={tech} idx={idx} />
        ))}
      </div>
    </>
  );
});

export default TechStack;
