"use client";

import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PROJECTS = [
  {
    name: "VoiceWave",
    desc: "Crystal-clear real-time voice chat powered by WebRTC peer-to-peer connections. No accounts, no downloads required — just click and talk.",
    icon: "🎙️",
    glow: "cyan",
    badge: "LIVE APP",
    githubUrl: "https://github.com/shaswatxd/voicewave",
    liveUrl: "https://voicewave-7ozn.onrender.com",
    features: [
      "🔗 WebRTC Peer-to-Peer Voice",
      "🔒 Password Protected Rooms",
      "💬 Built-in Text Chat & Emoji",
      "🎵 Soundboard with 10+ Sounds"
    ],
    details: {
      architecture: "In-browser client WebRTC voice loop operating directly. Links peers via signaling servers and routes audio streams locally.",
      modules: ["PeerJS connection engine", "Web Audio API nodes", "Secure signaling sockets", "Offline cache database"],
      command: "git clone https://github.com/shaswatxd/voicewave.git"
    }
  },
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
    ],
    details: {
      architecture: "Desktop system orchestrating Electron IPC frames, local LAN streaming servers, and yt-dlp bindings.",
      modules: ["Electron IPC broker", "yt-dlp child nodes", "LAN discovery server", "Lyric scraper engine"],
      command: "git clone https://github.com/shaswatxd/we-plays.git"
    }
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
    ],
    details: {
      architecture: "100% Client-side sandbox. Intercepts files and updates buffer maps in WASM, keeping data completely local.",
      modules: ["pdf-lib compiler", "PDF.js parser", "Tesseract.js WASM engine", "Local browser memory stream"],
      command: "git clone https://github.com/shaswatxd/justpdfcraft.git"
    }
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
    ],
    details: {
      architecture: "Concurrent download manager queuing sub-tasks. Auto-updates dependencies on system startups.",
      modules: ["Task queue dispatcher", "FFmpeg codec merger", "yt-dlp updater core", "Node playback stream"],
      command: "git clone https://github.com/shaswatxd/snapgrab-downloader.git"
    }
  },
  {
    name: "Viscordz",
    desc: "Full-featured Discord clone with real-time messaging, voice/video channels, server management, role-based permissions, and seamless Google & GitHub OAuth integration.",
    icon: "💬",
    glow: "cyan",
    badge: "LIVE APP",
    githubUrl: "https://github.com/shaswatxd/viscordz",
    liveUrl: "https://viscordz.up.railway.app",
    features: [
      "💬 Real-time Messaging & Channels",
      "🔐 Google & GitHub OAuth Login",
      "🎙️ Voice & Video Channels",
      "⚙️ Server Roles & Permissions"
    ],
    details: {
      architecture: "Next.js full-stack application with real-time WebSocket communication, OAuth2 authentication providers, and role-based access control for guild management.",
      modules: ["Next.js App Router", "WebSocket real-time engine", "OAuth2 auth providers", "Role-based access control"],
      command: "git clone https://github.com/shaswatxd/viscordz.git"
    }
  }
];

const GLOW_COLORS = {
  cyan: "#00f0ff",
  violet: "#8b6bff",
  magenta: "#ff3d9a",
  emerald: "#3ef07c"
};

// Details Modal Component
const ProjectModal = memo(function ProjectModal({ project, onClose }) {
  const [copied, setCopied] = useState(false);
  const color = GLOW_COLORS[project.glow] || GLOW_COLORS.cyan;

  const copyToClipboard = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(project.details.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy path: ", err);
    }
  };

  useEffect(() => {
    // Disable scroll behind modal
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop blur overlay */}
      <motion.div 
        className="absolute inset-0 bg-[#020204]/85 backdrop-filter backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div 
        className="relative w-full max-w-[620px] rounded-2xl border border-white/[0.08] bg-[#060812]/95 shadow-3xl overflow-hidden z-10"
        initial={{ scale: 0.93, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 25 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        style={{
          boxShadow: `0 30px 60px -15px rgba(0,0,0,0.9), 0 0 40px -10px ${color}1a`
        }}
      >
        {/* Glowing border top */}
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
            <span className="font-mono text-[10px] text-[#8895b0]">{project.name.toLowerCase()}-specs.json</span>
          </div>
          <button 
            onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center border border-white/[0.06] hover:border-white/[0.2] bg-white/[0.01] hover:bg-white/[0.04] text-[#8895b0] hover:text-white transition-all duration-200"
          >
            ✕
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto scrollbar-thin">
          <div className="flex items-center gap-3.5 mb-5">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `${color}15`, border: `1px solid ${color}33`, color: color }}
            >
              {project.icon}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#e8edf8]">{project.name}</h3>
              <span className="font-mono text-[9px] tracking-widest px-2.5 py-0.5 rounded-full border border-white/[0.08]" style={{ color: color, borderColor: `${color}33` }}>
                {project.badge}
              </span>
            </div>
          </div>

          <p className="text-[#8895b0] text-[12px] leading-relaxed mb-6">
            {project.desc}
          </p>

          {/* Architecture breakdown */}
          <div className="mb-6 p-4 rounded-xl border border-white/[0.05] bg-white/[0.01]">
            <h4 className="font-mono text-[10px] uppercase text-[#e8edf8] mb-2 tracking-wider flex items-center gap-1.5">
              <span className="text-[6px]" style={{ color: color }}>◆</span> System Architecture
            </h4>
            <p className="text-[#8895b0]/90 text-[11px] leading-relaxed">
              {project.details.architecture}
            </p>
          </div>

          {/* Key Modules lists */}
          <div className="mb-6">
            <h4 className="font-mono text-[10px] uppercase text-[#e8edf8] mb-2.5 tracking-wider flex items-center gap-1.5">
              <span className="text-[6px]" style={{ color: color }}>◆</span> Modules &amp; Subsystems
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {project.details.modules.map((mod, i) => (
                <div key={i} className="flex items-center gap-2 border border-white/[0.04] bg-[#080c18]/40 px-3 py-2 rounded-lg">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-mono text-[9.5px] text-[#8895b0]">{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Command Terminal box */}
          <div>
            <h4 className="font-mono text-[10px] uppercase text-[#e8edf8] mb-2 tracking-wider flex items-center gap-1.5">
              <span className="text-[6px]" style={{ color: color }}>◆</span> Local Installation
            </h4>
            <div 
              onClick={copyToClipboard}
              className="flex items-center justify-between border border-white/[0.08] hover:border-white/[0.18] bg-[#020204] p-3 rounded-lg font-mono text-[11px] text-[#8895b0] cursor-pointer transition-all duration-300 group"
            >
              <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
                <span className="text-[#00f0ff]">$</span>
                <span className="text-[#e8edf8]">{project.details.command}</span>
              </div>
              <button 
                className="ml-3 font-mono text-[8px] tracking-wider uppercase font-bold px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-white transition-all duration-200"
                style={{ color: copied ? '#3ef07c' : '#ffffff' }}
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>
        </div>

        {/* Links Footer */}
        <div className="border-t border-white/[0.08] bg-white/[0.02]">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-4 text-center font-mono text-[11px] tracking-widest uppercase font-bold text-[#020204] hover:scale-[1.01] transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${color}, #8b6bff)`,
            }}
          >
            Launch Console ↗
          </a>
        </div>
      </motion.div>
    </div>
  );
});

// Card Component
const Card = memo(function Card({ project, idx, onOpenDetails }) {
  const col = GLOW_COLORS[project.glow] || GLOW_COLORS.cyan;
  const cardRef = useRef(null);

  // Mousemove handler for card spotlight
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
      onClick={() => onOpenDetails(project)}
      className="relative glass-card spotlight-card p-6 rounded-2xl overflow-hidden hover:scale-[1.015] hover:-translate-y-1.5 group cursor-pointer transition-all duration-300"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: "spring", stiffness: 75, damping: 14, delay: idx * 0.06 }}
      style={{
        '--wib-accent': col,
      }}
    >
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{ background: `${col}15`, border: `1px solid ${col}33`, color: col }}
        >
          {project.icon}
        </div>
        <div className="flex gap-2">
          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="launch-btn relative overflow-hidden flex items-center gap-2 font-mono text-[11px] font-bold text-[#030303] bg-gradient-to-r from-[#e8edf8] to-[#ffffff] px-5 py-2 rounded-xl transition-all duration-300 hover:scale-110 hover:translate-y-[-2px] cursor-pointer animate-pulse-glow"
              style={{ boxShadow: `0 0 20px ${col}55, 0 0 40px ${col}22` }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Launch</span>
              <span className="text-[13px]">↗</span>
            </a>
          )}
        </div>
      </div>

      <h3 className="relative z-10 font-display font-bold text-base mb-2 text-[#e8edf8] group-hover:text-white transition-colors duration-300">{project.name}</h3>
      <p className="relative z-10 text-[#8895b0] text-[11px] leading-relaxed mb-4.5 min-h-[3.6rem]">{project.desc}</p>

      {project.features && (
        <ul className="relative z-10 border-t border-white/[0.04] pt-3.5 flex flex-col gap-1.5 mb-4">
          {project.features.map((feat, fIdx) => (
            <li key={fIdx} className="text-[10px] text-[#8895b0] flex items-center gap-2 hover:text-[#e8edf8] transition-colors duration-300">
              {feat}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between pt-1 select-none">
        <span 
          className="relative z-10 inline-flex items-center gap-1.5 font-mono text-[8px] tracking-wider uppercase border px-2.5 py-0.5 rounded-full" 
          style={{ color: col, borderColor: `${col}22`, backgroundColor: `${col}05` }}
        >
          <span className="w-1 h-1 rounded-full animate-pulse-custom" style={{ backgroundColor: col, boxShadow: `0 0 6px ${col}` }} />
          {project.badge}
        </span>
        
        <span className="font-mono text-[8px] tracking-widest text-[#8895b0]/40 group-hover:text-white/60 transition-colors duration-300">
          READ SPECS &rarr;
        </span>
      </div>
    </motion.div>
  );
});

export default memo(function Projects() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <>
      <div id="projects" className="max-w-[1480px] mx-auto px-8 flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-8 animate-section">
        <h2 className="font-display font-bold text-xl" style={{ backgroundImage: 'linear-gradient(to right, #e8edf8, #00f0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Projects &amp; Links</h2>
        <div className="font-mono text-[10px] text-[#8895b0] select-none">// Live consoles &amp; open systems</div>
      </div>

      <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {PROJECTS.map((project, idx) => (
          <Card 
            key={idx} 
            project={project} 
            idx={idx} 
            onOpenDetails={setActiveProject}
          />
        ))}
        
        {/* Placeholder Coming Soon Box */}
        <div className="flex flex-col items-center justify-center border border-dashed border-white/[0.08] hover:border-violet/40 hover:bg-violet/[0.01] text-[#8895b0] hover:text-violet rounded-2xl min-h-[260px] text-center gap-4 transition-all duration-300 select-none group">
          <div className="w-[52px] h-[52px] rounded-full border border-dashed border-white/[0.12] flex items-center justify-center text-lg transition-all duration-500 group-hover:rotate-90 group-hover:scale-105 group-hover:border-violet/50 group-hover:bg-violet/[0.04]">
            <span>⚡</span>
          </div>
          <div className="text-xs font-medium">
            More Systems<br />
            <span className="font-mono text-[9px] text-[#8895b0]/50">INDEX_INITIALIZING</span>
          </div>
        </div>
      </div>

      {/* Details Modal overlay */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal 
            project={activeProject} 
            onClose={() => setActiveProject(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
});