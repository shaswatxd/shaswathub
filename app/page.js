"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useCountUp } from '../src/hooks';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

// Dynamically import Scene3D with SSR disabled to prevent Canvas hydration issues
const Scene3D = dynamic(() => import('../src/components/Scene3D'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ─── Projects Data ─── */
const PROJECTS = [
  {
    name: "We Plays",
    desc: "Premium glassmorphic desktop music player with integrated YouTube downloader, visualizer, local LAN share, and automatic ID3 metadata fetching.",
    icon: "🎵",
    glow: "emerald",
    badge: "LIVE APP",
    githubUrl: "https://github.com/shaswatxd/we-plays",
    liveUrl: "https://website-nine-tau-67.vercel.app",
    features: [
      "🎨 Dynamic Album Art Theme Engine",
      "🚀 In-App yt-dlp YouTube Downloader",
      "📶 LAN Offline Media Sharing",
      "🎤 Synchronized Lyrics & Insights"
    ]
  },
  {
    name: "VoiceWave",
    desc: "Real-time voice chat application featuring WebRTC audio streaming, Socket.IO room coordination, and an Electron desktop shell.",
    icon: "🎙️",
    glow: "cyan",
    badge: "LIVE APP",
    githubUrl: "https://github.com/shaswatxd/voicewave",
    liveUrl: "https://voicewave-production-289f.up.railway.app/",
    features: [
      "🎙️ WebRTC Real-Time Audio",
      "⚡ Socket.IO Room Coordination",
      "🖥️ Electron Desktop Shell Integration",
      "🎛️ Ultra Low Latency Connections"
    ]
  },
  {
    name: "JustPDFCraft",
    desc: "Browser-based client-side PDF utility toolkit to merge, split, compress, watermark, protect, and annotate documents locally.",
    icon: "📄",
    glow: "violet",
    badge: "WEBSITE",
    githubUrl: "https://github.com/shaswatxd/justpdfcraft",
    liveUrl: "https://justpdfcraft.xyz/",
    features: [
      "📄 30+ Free PDF & Student Tools",
      "🔒 100% Secure Client-Side Processing",
      "🛠️ Merge, Split & Compress Functionality",
      "🔍 Built-in OCR Text Extraction"
    ]
  },
  {
    name: "SnapGrab",
    desc: "Desktop media downloader shell utilizing yt-dlp & FFmpeg. Features concurrent playlist downloads, local file playback, and background engine auto-updates.",
    icon: "⬇️",
    glow: "magenta",
    badge: "LIVE APP",
    githubUrl: "https://github.com/shaswatxd/snapgrab-downloader",
    liveUrl: "https://snapgrab-eight.vercel.app/",
    features: [
      "⬇️ Downloader for 1,000+ Platforms",
      "🎬 Automated FFmpeg Muxing & Quality Merge",
      "⚡ Background Component Auto-Updates",
      "📻 Built-in Media Playback Shell"
    ]
  }
];

const GLOW_COLORS = {
  cyan: "#00f0ff",
  violet: "#8b6bff",
  magenta: "#ff3d9a",
  emerald: "#00cdac"
};

const TECH_STACK = [
  { name: "React", icon: "⚛️", color: "#61dafb" },
  { name: "Electron", icon: "⚡", color: "#47848f" },
  { name: "Node.js", icon: "🟢", color: "#3ef07c" },
  { name: "Three.js", icon: "🔺", color: "#8b6bff" },
  { name: "Socket.IO", icon: "🔌", color: "#00f0ff" },
  { name: "WebRTC", icon: "📡", color: "#ff3d9a" },
  { name: "Vite", icon: "🔥", color: "#f5a623" },
  { name: "FFmpeg", icon: "🎬", color: "#ff3d9a" },
  { name: "Python", icon: "🐍", color: "#ffd43b" },
  { name: "Git", icon: "🔀", color: "#f05032" },
  { name: "MongoDB", icon: "🍃", color: "#00ed64" },
  { name: "Tailwind", icon: "🌊", color: "#38bdf8" },
];

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
    color: "#ff3d9a",
    tags: ["Python", "Git", "Automation"]
  },
];

const MARQUEE_ITEMS = [
  "REACT", "NODE.JS", "ELECTRON", "THREE.JS", "WEBRTC", "SOCKET.IO",
  "VITE", "FFMPEG", "PYTHON", "MONGODB", "GIT", "TAILWIND CSS",
  "JAVASCRIPT", "HTML5", "CSS3", "REST APIs"
];

/* ─── Project Card ─── */
function Card({ project, idx }) {
  const cardRef = useRef(null);
  const tiltRef = useRef({ rx: 0, ry: 0, txRx: 0, txRy: 0, mx: 0.5, my: 0.5, active: false });
  const rafTilt = useRef(null);

  useEffect(() => {
    return () => {
      if (rafTilt.current) cancelAnimationFrame(rafTilt.current);
    };
  }, []);

  const lerp = (a, b, t) => a + (b - a) * t;
  const SPEED = 0.1;

  const animateTilt = () => {
    const t = tiltRef.current;
    t.rx = lerp(t.rx, t.txRx, SPEED);
    t.ry = lerp(t.ry, t.txRy, SPEED);
    t.mx = lerp(t.mx, t.tmx ?? 0.5, SPEED);
    t.my = lerp(t.my, t.tmy ?? 0.5, SPEED);

    if (cardRef.current) {
      const dy = t.active ? -8 : 0;
      const sc = t.active ? 1.015 : 1;
      cardRef.current.style.transform =
        `perspective(700px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateY(${dy}px) scale(${sc})`;
      cardRef.current.style.setProperty('--mx', `${t.mx * 100}%`);
      cardRef.current.style.setProperty('--my', `${t.my * 100}%`);
    }

    const stillMoving = Math.abs(t.rx - t.txRx) > 0.01 || Math.abs(t.ry - t.txRy) > 0.01;
    if (stillMoving || t.active) {
      rafTilt.current = requestAnimationFrame(animateTilt);
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    tiltRef.current.txRx = (ny - 0.5) * -12;
    tiltRef.current.txRy = (nx - 0.5) * 12;
    tiltRef.current.tmx = nx;
    tiltRef.current.tmy = ny;
    tiltRef.current.active = true;
    if (!rafTilt.current) rafTilt.current = requestAnimationFrame(animateTilt);
  };

  const handleMouseLeave = () => {
    tiltRef.current.txRx = 0;
    tiltRef.current.txRy = 0;
    tiltRef.current.tmx = 0.5;
    tiltRef.current.tmy = 0.5;
    tiltRef.current.active = false;
    rafTilt.current = requestAnimationFrame(animateTilt);
  };

  const col = GLOW_COLORS[project.glow] || GLOW_COLORS.cyan;

  return (
    <motion.div
      ref={cardRef}
      className="relative bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-7 transform-gpu overflow-hidden backdrop-blur-xl transition-all duration-300"
      style={{
        '--glow-color': `${col}22`,
        '--card-accent': col,
      }}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Hover Spotlight Glow */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at var(--mx, 50%) var(--my, 50%), ${col}18, transparent 65%)`
        }}
      />

      {/* Shimmer sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent bg-[length:200%_200%] opacity-0 hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 hover:scale-110 hover:-rotate-3"
          style={{ background: `${col}1a`, border: `1px solid ${col}44`, color: col }}
        >
          {project.icon}
        </div>
        <div className="flex gap-2">
          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#8895b0] hover:text-[#e8edf8] border border-white/[0.08] hover:border-white/[0.2] bg-white/[0.02] px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub ↗
            </a>
          )}
          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#030303] bg-gradient-to-r from-[#e8edf8] to-[#ffffff] px-3.5 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 hover:translate-y-[-1px]"
              style={{ boxShadow: `0 0 15px ${col}44` }}
            >
              <span>Launch ↗</span>
            </a>
          )}
        </div>
      </div>

      <h3 className="relative z-10 font-display font-bold text-lg mb-2 text-[#e8edf8]">{project.name}</h3>
      <p className="relative z-10 text-[#8895b0] text-xs leading-relaxed mb-4 min-h-[3.6rem]">{project.desc}</p>

      {project.features && (
        <ul className="relative z-10 border-t border-white/[0.08] pt-3.5 flex flex-col gap-1.5 mb-4">
          {project.features.map((feat, fIdx) => (
            <li key={fIdx} className="text-[11px] text-[#8895b0] flex items-center gap-2 hover:text-[#e8edf8] transition-colors duration-200">
              {feat}
            </li>
          ))}
        </ul>
      )}

      <span className="relative z-10 inline-flex items-center gap-1.5 font-mono text-[9px] tracking-wider uppercase border border-white/[0.08] px-3 py-1 rounded-full" style={{ color: col, borderColor: `${col}33` }}>
        <span className="w-1 h-1 rounded-full animate-pulse-custom" style={{ backgroundColor: col, boxShadow: `0 0 6px ${col}` }} />
        {project.badge}
      </span>
    </motion.div>
  );
}

/* ─── Tech Stack Badge ─── */
const TechBadge = React.memo(function TechBadge({ tech, idx }) {
  return (
    <motion.div
      className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] cursor-default"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.04, ease: 'easeOut' }}
      whileHover={{
        y: -4,
        scale: 1.04,
        boxShadow: `0 8px 24px ${tech.color}33`,
        borderColor: `${tech.color}99`,
        transition: { type: 'spring', stiffness: 350, damping: 12 }
      }}
    >
      <span className="text-lg">{tech.icon}</span>
      <span className="font-mono text-xs font-medium text-[#e8edf8] tracking-wide">{tech.name}</span>
    </motion.div>
  );
});
TechBadge.displayName = 'TechBadge';

/* ─── What I Build Card ─── */
function WhatIBuildCard({ item, idx }) {
  return (
    <motion.div
      className="relative bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 overflow-hidden backdrop-blur-xl"
      style={{ '--wib-color': item.color }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -8,
        boxShadow: `0 20px 40px -15px rgba(0,0,0,0.7), 0 0 45px -10px ${item.color}25`,
        borderColor: `rgba(255,255,255,0.16)`,
        transition: { type: 'spring', stiffness: 220, damping: 14 }
      }}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 hover:opacity-100 transition-opacity duration-300"
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
}

/* ─── Infinite Marquee ─── */
function Marquee() {
  const items = MARQUEE_ITEMS;
  const row = items.map((t, i) => (
    <span key={i} className="inline-flex items-center gap-2.5 px-7 text-xs font-display font-bold tracking-widest text-[#8895b0]/50 hover:text-cyan hover:opacity-100 transition-all duration-300">
      <span className="text-[6px] text-violet">◆</span> {t}
    </span>
  ));
  return (
    <div className="relative overflow-hidden py-8 my-4 pointer-events-none">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-10" />
      <div className="flex w-max mb-4">
        <div className="flex animate-marquee">{row}{row}</div>
      </div>
      <div className="flex w-max reverse">
        <div className="flex animate-marquee-reverse">{row}{row}</div>
      </div>
    </div>
  );
}

/* ─── Stats Strip ─── */
function StatsStrip() {
  const statsRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const projects = useCountUp(4, 1600, inView);
  const techs = useCountUp(12, 1800, inView);
  const commits = useCountUp(1000, 2200, inView);

  return (
    <motion.div
      ref={statsRef}
      className="max-w-[900px] mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="p-7 text-center border-r border-white/[0.08] hover:bg-white/[0.01] transition-colors duration-300">
        <div className="font-display font-bold text-3xl bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">{projects}+</div>
        <div className="font-mono text-[9px] tracking-wider uppercase text-[#8895b0] mt-2">Projects Shipped</div>
      </div>
      <div className="p-7 text-center md:border-r border-white/[0.08] hover:bg-white/[0.01] transition-colors duration-300">
        <div className="font-display font-bold text-3xl bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">{techs}+</div>
        <div className="font-mono text-[9px] tracking-wider uppercase text-[#8895b0] mt-2">Technologies</div>
      </div>
      <div className="p-7 text-center border-r border-white/[0.08] hover:bg-white/[0.01] transition-colors duration-300">
        <div className="font-display font-bold text-3xl bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">{commits}+</div>
        <div className="font-mono text-[9px] tracking-wider uppercase text-[#8895b0] mt-2">Commits</div>
      </div>
      <div className="p-7 text-center hover:bg-white/[0.01] transition-colors duration-300">
        <div className="font-display font-bold text-3xl bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">100%</div>
        <div className="font-mono text-[9px] tracking-wider uppercase text-[#8895b0] mt-2">Open Source</div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Page() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Animated Glowing 'S' Favicon Effect
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    let animationFrameId;
    let lastUpdate = 0;
    const interval = 80;

    const draw = (timestamp) => {
      if (prefersReduced) {
        ctx.clearRect(0, 0, 32, 32);
        
        const bgGrad = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
        bgGrad.addColorStop(0, '#0f1326');
        bgGrad.addColorStop(1, '#05070f');
        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(16, 16, 13.5, 0, Math.PI * 2);
        ctx.stroke();

        const grad = ctx.createLinearGradient(10, 10, 22, 22);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(0.5, '#8b6bff');
        grad.addColorStop(1, '#ff3d9a');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(22, 10);
        ctx.lineTo(14, 10);
        ctx.arcTo(10, 10, 10, 16, 4);
        ctx.arcTo(10, 16, 22, 16, 4);
        ctx.lineTo(18, 16);
        ctx.arcTo(22, 16, 22, 22, 4);
        ctx.arcTo(22, 22, 10, 22, 4);
        ctx.lineTo(10, 22);
        ctx.stroke();

        link.href = canvas.toDataURL('image/png');
        return;
      }

      animationFrameId = requestAnimationFrame(draw);

      if (timestamp - lastUpdate < interval) return;
      lastUpdate = timestamp;

      ctx.clearRect(0, 0, 32, 32);

      const bgGrad = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
      bgGrad.addColorStop(0, '#0f1326');
      bgGrad.addColorStop(1, '#05070f');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(16, 16, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(139, 107, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(16, 16, 13.5, 0, Math.PI * 2);
      ctx.stroke();

      const angle = (timestamp / 450) % (Math.PI * 2);
      const px = 16 + Math.cos(angle) * 13.5;
      const py = 16 + Math.sin(angle) * 13.5;
      
      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();

      const grad = ctx.createLinearGradient(10, 10, 22, 22);
      grad.addColorStop(0, `hsl(${(timestamp / 12) % 360}, 100%, 65%)`);
      grad.addColorStop(0.5, `hsl(${(timestamp / 12 + 60) % 360}, 100%, 60%)`);
      grad.addColorStop(1, `hsl(${(timestamp / 12 + 120) % 360}, 100%, 55%)`);

      const glowIntensity = Math.sin(timestamp / 150) * 1.5 + 4.5;

      ctx.strokeStyle = grad;
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = `hsl(${(timestamp / 12 + 30) % 360}, 100%, 60%)`;
      ctx.shadowBlur = glowIntensity;
      
      ctx.beginPath();
      ctx.moveTo(22, 10);
      ctx.lineTo(14, 10);
      ctx.arcTo(10, 10, 10, 16, 4);
      ctx.arcTo(10, 16, 22, 16, 4);
      ctx.lineTo(18, 16);
      ctx.arcTo(22, 16, 22, 22, 4);
      ctx.arcTo(22, 22, 10, 22, 4);
      ctx.lineTo(10, 22);
      ctx.stroke();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      link.href = canvas.toDataURL('image/png');
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [prefersReduced]);

  // Lerp Parallax Effect
  const parallaxRef = useRef(0);
  const parallaxTarget = useRef(0);
  const glowRef = useRef(null);
  const glowSecRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handleMQ = (e) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handleMQ);

    let lastScrolled = false;
    const handleScroll = () => {
      const nowScrolled = window.scrollY > 20;
      if (nowScrolled !== lastScrolled) {
        lastScrolled = nowScrolled;
        setScrolled(nowScrolled);
      }
    };

    const lerp = (a, b, t) => a + (b - a) * t;
    let running = false;
    const tick = () => {
      parallaxRef.current = lerp(parallaxRef.current, parallaxTarget.current, 0.06);
      const px = parallaxRef.current;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(calc(-50% + ${px}px), 0)`;
      }
      if (glowSecRef.current) {
        glowSecRef.current.style.transform = `translate(calc(-50% + ${-px * 0.5}px), 0)`;
      }
      if (Math.abs(parallaxRef.current - parallaxTarget.current) > 0.05) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const handleMouse = (e) => {
      parallaxTarget.current = (e.clientX / window.innerWidth - 0.5) * 40;
      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // GSAP ScrollTrigger Section Transitions
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((sec) => {
      gsap.fromTo(sec,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    gsap.fromTo('.terminal-block',
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.terminal-block',
          start: 'top 85%',
        }
      }
    );

    return () => {
      mq.removeEventListener("change", handleMQ);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <ReactLenis root>
      {/* 3D Background */}
      <Scene3D prefersReduced={prefersReduced} />

      {/* Overlay Ambient Gradients */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#060810]/10 via-[#060810]/50 to-[#060810]/95 pointer-events-none z-[1] will-change-transform transform-gpu" />
      <div ref={glowRef} className="fixed top-[-25%] left-1/2 w-[1100px] h-[700px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.07)_0%,rgba(0,240,255,0.04)_15%,rgba(139,107,255,0.03)_30%,rgba(139,107,255,0.01)_50%,transparent_65%)] pointer-events-none z-[1] will-change-transform transform translate-x-[-50%] transform-gpu" />
      <div ref={glowSecRef} className="fixed top-[30%] left-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(255,61,154,0.05)_0%,rgba(139,107,255,0.02)_30%,transparent_60%)] pointer-events-none z-[1] will-change-transform transform translate-x-[-50%] transform-gpu" />

      <div className="relative z-10 w-full max-w-[100vw] transform-gpu">
        {/* ── Navigation ── */}
        <motion.nav 
          className={`sticky top-0 z-[100] flex items-center justify-between px-8 py-3.5 transition-all duration-300 border-b ${scrolled ? 'bg-[#060810]/85 border-white/[0.12] shadow-2xl backdrop-blur-xl' : 'bg-transparent border-white/[0.04]'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-2.5 font-display font-bold text-lg tracking-wider text-[#e8edf8] uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_#00f0ff] animate-pulse" />
            SHASWAT<span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">HUB</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <a href="#builds" className="relative group font-mono text-[11px] text-[#8895b0] hover:text-[#e8edf8] px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200">
              Builds
              <span className="absolute bottom-[-1px] left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-cyan to-violet transform translate-x-[-50%] group-hover:w-3/5 transition-all duration-300" />
            </a>
            <a href="#projects" className="relative group font-mono text-[11px] text-[#8895b0] hover:text-[#e8edf8] px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200">
              Projects
              <span className="absolute bottom-[-1px] left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-cyan to-violet transform translate-x-[-50%] group-hover:w-3/5 transition-all duration-300" />
            </a>
            <a href="#stack" className="relative group font-mono text-[11px] text-[#8895b0] hover:text-[#e8edf8] px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200">
              Stack
              <span className="absolute bottom-[-1px] left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-cyan to-violet transform translate-x-[-50%] group-hover:w-3/5 transition-all duration-300" />
            </a>
            <a href="#contact" className="relative group font-mono text-[11px] text-[#8895b0] hover:text-[#e8edf8] px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200">
              Contact
              <span className="absolute bottom-[-1px] left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-cyan to-violet transform translate-x-[-50%] group-hover:w-3/5 transition-all duration-300" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/shaswatxd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full border border-white/[0.1] overflow-hidden w-[38px] h-[38px] transition-all duration-300 hover:scale-105 hover:rotate-6 hover:border-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              title="GitHub Profile"
            >
              <img src="/avatar.png?v=2" alt="GitHub Profile" className="w-full h-full object-cover" />
            </a>
          </div>
        </motion.nav>

        {/* ── Hero Header ── */}
        <motion.header
          className="relative z-10 px-6 py-[10vh] text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="font-mono text-[10px] text-cyan tracking-[3.5px] uppercase mb-6 flex items-center justify-center gap-3">
            <span className="w-[30px] h-[1px] bg-gradient-to-r from-transparent to-cyan" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00f0ff] animate-pulse" />
            Dev Console · Personal Build Log
            <span className="w-[30px] h-[1px] bg-gradient-to-l from-transparent to-cyan" />
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-[-1.5px] leading-[1.05] text-[#e8edf8] mb-6">
            Everything I'm<br />
            <span className="bg-gradient-to-r from-cyan via-violet to-magenta bg-clip-text text-transparent animate-shimmer-text">Building, Shipping, Breaking.</span>
          </h1>
          <p className="max-w-[620px] mx-auto text-[#8895b0] text-sm sm:text-base leading-relaxed mb-10">
            A live index of projects, repos, and experiments — from <b className="text-[#e8edf8] font-semibold">desktop apps</b> to <b className="text-[#e8edf8] font-semibold">web tools</b>. Updated as things ship, not as a resume.
          </p>

          <div className="flex items-center justify-center gap-4.5 max-w-[290px] sm:max-w-none mx-auto flex-col sm:flex-row">
            <a href="#projects" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display text-[13px] font-bold px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan to-violet text-[#030303] shadow-[0_0_24px_rgba(0,240,255,0.25)] hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all duration-300">
              <span>View Projects</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#contact" className="w-full sm:w-auto inline-flex items-center justify-center font-display text-[13px] font-bold px-7 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:border-violet text-[#e8edf8] hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(139,107,255,0.18)] transition-all duration-300">
              <span>Get In Touch</span>
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-2.5 mt-16">
            <div className="w-6 h-[38px] rounded-xl border-2 border-white/[0.15] flex justify-center">
              <div className="w-[3px] h-2 rounded-full bg-cyan mt-1.5 animate-scroll-bounce" />
            </div>
            <span className="font-mono text-[9px] tracking-[2px] uppercase text-[#8895b0]/60">Scroll to explore</span>
          </div>
        </motion.header>

        {/* ── Stats Strip ── */}
        <StatsStrip />

        {/* ── Section Divider ── */}
        <div className="max-w-[1480px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent my-16 opacity-40 animate-glow-pulse" />

        {/* ── What I Build Section ── */}
        <div id="builds" className="max-w-[1480px] mx-auto px-8 flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-8 animate-section">
          <h2 className="font-display font-bold text-xl bg-gradient-to-r from-[#e8edf8] to-cyan bg-clip-text text-transparent">What I Build</h2>
          <div className="font-mono text-[10px] text-[#8895b0]">// Areas of focus &amp; expertise</div>
        </div>

        <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {WHAT_I_BUILD.map((item, idx) => (
            <WhatIBuildCard key={idx} item={item} idx={idx} />
          ))}
        </div>

        {/* ── Section Divider ── */}
        <div className="max-w-[1480px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent my-16 opacity-40 animate-glow-pulse" />

        {/* ── Projects Section ── */}
        <div id="projects" className="max-w-[1480px] mx-auto px-8 flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-8 animate-section">
          <h2 className="font-display font-bold text-xl bg-gradient-to-r from-[#e8edf8] to-cyan bg-clip-text text-transparent">Projects &amp; Links</h2>
          <div className="font-mono text-[10px] text-[#8895b0]">// Live apps &amp; open source tools</div>
        </div>

        <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PROJECTS.map((project, idx) => (
            <Card key={idx} project={project} idx={idx} />
          ))}
          <div className="flex flex-col items-center justify-center border border-dashed border-white/[0.08] hover:border-violet/40 hover:bg-violet/[0.02] text-[#8895b0] hover:text-violet rounded-2xl min-h-[260px] text-center gap-4 transition-all duration-300">
            <div className="w-[56px] h-[56px] rounded-full border border-dashed border-white/[0.12] flex items-center justify-center text-xl transition-all duration-300 hover:rotate-90 hover:scale-105 hover:border-violet">
              <span>⚡</span>
            </div>
            <div className="text-sm font-medium">
              More Projects<br />
              <span className="font-mono text-[10px] text-[#8895b0]/60">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* ── Scrolling Marquee ── */}
        <Marquee />

        {/* ── Section Divider ── */}
        <div className="max-w-[1480px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent my-16 opacity-40 animate-glow-pulse" />

        {/* ── Tech Stack Section ── */}
        <div id="stack" className="max-w-[1480px] mx-auto px-8 flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-8 animate-section">
          <h2 className="font-display font-bold text-xl bg-gradient-to-r from-[#e8edf8] to-cyan bg-clip-text text-transparent">Tech Stack</h2>
          <div className="font-mono text-[10px] text-[#8895b0]">// Tools I build with daily</div>
        </div>

        <div className="max-w-[1200px] mx-auto px-8 flex flex-wrap gap-3.5 mb-16">
          {TECH_STACK.map((tech, idx) => (
            <TechBadge key={idx} tech={tech} idx={idx} />
          ))}
        </div>

        {/* ── Terminal About Block ── */}
        <div className="max-w-[760px] mx-auto mb-20 px-8">
          <div className="rounded-2xl border border-white/[0.08] bg-[#060810]/75 shadow-3xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="font-mono text-[11px] text-[#8895b0] ml-2">shaswat@devbox ~ zsh</span>
            </div>
            <div className="p-7">
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[12px] mb-2.5">
                <span className="text-green font-semibold">shaswat@devbox</span>
                <span className="text-violet">~/projects</span>
                <span className="text-[#8895b0]">$</span>
                <span className="text-[#e8edf8]">whoami</span>
              </div>
              <div className="font-mono text-[12px] text-[#8895b0] leading-relaxed pl-0.5 mb-5 space-y-1">
                <div><span className="text-cyan font-medium">name</span>: Srijan Shaswat</div>
                <div><span className="text-cyan font-medium">role</span>: Full-Stack &amp; Desktop Developer</div>
                <div><span className="text-cyan font-medium">focus</span>: Web Apps · Desktop Tools · Automation</div>
                <div><span className="text-cyan font-medium">currently</span>: Building cool things &amp; shipping fast</div>
                <div><span className="text-cyan font-medium">contact</span>: srijankumardeo777@gmail.com</div>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[12px]">
                <span className="text-green font-semibold">shaswat@devbox</span>
                <span className="text-violet">~/projects</span>
                <span className="text-[#8895b0]">$</span>
                <span className="w-2 h-4 bg-cyan animate-blink" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section Divider ── */}
        <div className="max-w-[1480px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent my-16 opacity-40 animate-glow-pulse" />

        {/* ── Contact CTA Section ── */}
        <div id="contact" className="max-w-[900px] mx-auto px-8 mb-16 relative">
          <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.06)_0%,rgba(139,107,255,0.04)_40%,transparent_70%)] pointer-events-none z-0" />
          <div className="relative z-10 text-center p-12 bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent" />
            <div className="font-mono text-[10px] text-cyan tracking-[3px] uppercase mb-4.5">Get In Touch</div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl leading-[1.2] tracking-tight mb-5 text-[#e8edf8]">
              Let's Build Something<br /><span className="bg-gradient-to-r from-cyan via-violet to-magenta bg-clip-text text-transparent">Together.</span>
            </h2>
            <p className="max-w-[500px] mx-auto text-[#8895b0] text-xs sm:text-sm leading-relaxed">
              Got a project idea, collaboration, or just want to say hi? I'm always open to discussing new opportunities and interesting concepts at <a href="mailto:srijankumardeo777@gmail.com" className="text-cyan underline hover:text-[#e8edf8] transition-colors duration-200">srijankumardeo777@gmail.com</a>.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="relative border-t border-white/[0.08] text-center py-10 bg-gradient-to-b from-transparent to-[#060810]/50 mt-10">
          <div className="font-display font-bold text-base tracking-wide text-[#e8edf8] mb-2.5">
            SHASWAT<span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">HUB</span>
          </div>
          <div className="font-mono text-[10px] text-[#8895b0] mb-6">Building things that matter, one commit at a time.</div>
          <div className="font-mono text-[9px] text-[#8895b0]/55 max-w-[90vw] mx-auto">
            © {new Date().getFullYear()} · developed with ❤️ &amp; chai · Contact: srijankumardeo777@gmail.com
          </div>
        </footer>
      </div>
    </ReactLenis>
  );
}
