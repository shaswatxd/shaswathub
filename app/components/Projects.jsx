"use client";

import React, { useRef, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

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
    ]
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

const Card = memo(function Card({ project, idx }) {
  const col = GLOW_COLORS[project.glow] || GLOW_COLORS.cyan;

  return (
    <motion.div
      className="relative bg-[#080b16] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_35px_-10px_var(--glow-color)] group"
      style={{
        '--glow-color': `${col}1c`,
        '--card-accent': col,
      }}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: "spring", stiffness: 75, damping: 14, delay: idx * 0.06 }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `radial-gradient(280px circle at 50% 50%, ${col}0f, transparent 70%)`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent bg-[length:200%_200%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
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
              className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#8895b0] hover:text-[#e8edf8] border border-white/[0.08] hover:border-white/[0.2] bg-white/[0.02] px-3 py-1.5 rounded-lg transition-all duration-300"
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
            <li key={fIdx} className="text-[11px] text-[#8895b0] flex items-center gap-2 hover:text-[#e8edf8] transition-colors duration-300">
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
});

export default memo(function Projects() {
  return (
    <>
      <div id="projects" className="max-w-[1480px] mx-auto px-8 flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-8 animate-section">
        <h2 className="font-display font-bold text-xl" style={{ backgroundImage: 'linear-gradient(to right, #e8edf8, #00f0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Projects &amp; Links</h2>
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
    </>
  );
});