"use client";

import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PROJECTS = [
  {
    name: "VoiceWave",
    desc: "Real-time voice chat app that works directly in your browser. No account needed, no downloads — just share a room link and start talking instantly.",
    icon: "🎙️",
    glow: "cyan",
    badge: "WEB/APP",
    githubUrl: "https://github.com/shaswatxd/voicewave",
    liveUrl: "https://voicewave-7ozn.onrender.com",
    features: [
      "🎙️ Crystal-Clear Voice Calls",
      "🔒 Password Protected Rooms",
      "💬 Built-in Text Chat & Emoji",
      "🎵 Soundboard with 10+ Sounds"
    ],
    details: {
      architecture: "Runs entirely in the browser — no installs needed. Audio is transmitted in real-time between users with low latency.",
      modules: ["PeerJS connection engine", "Web Audio API nodes", "Secure signaling sockets", "Offline cache database"],
      command: "git clone https://github.com/shaswatxd/voicewave.git"
    }
  },
  {
    name: "We Plays",
    desc: "Premium glassmorphic desktop music player with a built-in visualizer, synchronized lyrics, custom playlist management, and automatic ID3 metadata fetching.",
    icon: "🎵",
    glow: "emerald",
    badge: "APP",
    githubUrl: "https://github.com/shaswatxd/we-plays",
    liveUrl: "https://weplays.vercel.app",
    features: [
      "🎨 Dynamic Album Art Theme Engine",
      "🎤 Synchronized Lyrics & Insights",
      "🎛️ Custom Playlist & Queue Manager",
      "🏷️ Automatic ID3 Metadata Fetching"
    ],
    details: {
      architecture: "Desktop app built on Electron with a rich audio engine, real-time lyrics sync, and automatic metadata tagging.",
      modules: ["Electron IPC broker", "Web Audio visualizer", "Lyric scraper engine", "ID3 metadata tagger"],
      command: "git clone https://github.com/shaswatxd/we-plays.git"
    }
  },
  {
    name: "JustPDFCraft",
    desc: "Browser-based client-side PDF utility toolkit to merge, split, compress, watermark, protect, and annotate documents locally.",
    icon: "📄",
    glow: "violet",
    badge: "SITE",
    githubUrl: "https://github.com/shaswatxd/justpdfcraft",
    liveUrl: "https://justpdfcraft.xyz/",
    features: [
      "📄 Free PDF & Student Tools",
      "🔒 100% Secure Client-Side Processing",
      "🛠️ Merge, Split & Compress Functionality"
    ],
    details: {
      architecture: "100% Client-side sandbox. Intercepts files and updates buffer maps in WASM, keeping data completely local.",
      modules: ["pdf-lib compiler", "PDF.js parser", "Local browser memory stream"],
      command: "git clone https://github.com/shaswatxd/justpdfcraft.git"
    }
  },
  {
    name: "SnapGrab",
    desc: "Desktop media downloader app that lets you download videos and audio from 1,000+ platforms. Supports playlist downloads, built-in playback, and stays up to date automatically.",
    icon: "⬇️",
    glow: "magenta",
    badge: "APP",
    githubUrl: "https://github.com/shaswatxd/snapgrab-downloader",
    liveUrl: "https://snapgrab-eight.vercel.app/",
    features: [
      "⬇️ Downloader for 1,000+ Platforms",
      "📂 Playlist & Batch Downloads",
      "⚡ Background Component Auto-Updates",
      "📻 Built-in Media Playback Shell"
    ],
    details: {
      architecture: "Concurrent download manager with a built-in task queue. Auto-updates itself in the background on startup.",
      modules: ["Task queue dispatcher", "Concurrent download engine", "Auto-update scheduler", "Node playback stream"],
      command: "git clone https://github.com/shaswatxd/snapgrab-downloader.git"
    }
  },
  {
    name: "ResumeAI",
    desc: "AI-powered resume builder that creates professional resumes from a simple text description. Choose from 30 templates and export as PDF instantly.",
    icon: "📝",
    glow: "cyan",
    badge: "SITE",
    githubUrl: "https://github.com/shaswatxd/resumeai",
    liveUrl: "https://resumeaihai.vercel.app/",
    features: [
      "🤖 3 AI Models (Gemini, Groq, Cerebras)",
      "📄 30 Professional Templates",
      "💾 Save Draft & Download PDF",
      "🔒 100% Client-Side API Key Storage"
    ],
    details: {
      architecture: "Next.js app with client-side AI integration. API keys stored in localStorage, resumes generated entirely in the browser.",
      modules: ["AI prompt engine", "Template renderer", "PDF export module", "Draft autosave system"],
      command: "git clone https://github.com/shaswatxd/resumeai.git"
    }
  }
];

const GLOW_COLORS = {
  cyan: "#00c2d1",
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
      {/* Backdrop overlay */}
      <motion.div
        className="absolute inset-0 bg-[#0a0a0a]/50 backdrop-filter backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        className="relative w-full max-w-[620px] border border-[#0a0a0a] dark:border-white/20 bg-white dark:bg-[#111] overflow-hidden z-10"
        initial={{ scale: 0.93, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 25 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0a0a0a] dark:border-white/15">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-mono text-[10px] text-[#666] dark:text-[#999]">{project.name.toLowerCase()}-specs.json</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center border border-[#e8e8e8] dark:border-white/15 hover:border-[#0a0a0a] dark:hover:border-white/40 text-[#666] dark:text-[#999] hover:text-[#0a0a0a] dark:hover:text-[#f2f2f2] transition-all duration-200"
          >
            ✕
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto scrollbar-thin">
          <div className="flex items-center gap-3.5 mb-5">
            <div
              className="w-12 h-12 border border-[#0a0a0a] dark:border-white/25 flex items-center justify-center text-2xl"
            >
              {project.icon}
            </div>
            <div>
              <h3 className="font-semibold text-xl text-[#0a0a0a] dark:text-[#f2f2f2]">{project.name}</h3>
              <span className="font-mono text-[9px] tracking-widest px-2.5 py-0.5 border" style={{ color: color, borderColor: color }}>
                {project.badge}
              </span>
            </div>
          </div>

          <p className="text-[#555] dark:text-[#aaa] text-[13px] leading-relaxed mb-6">
            {project.desc}
          </p>

          {/* Architecture breakdown */}
          <div className="mb-6 p-4 border border-[#e8e8e8] dark:border-white/15">
            <h4 className="font-mono text-[10px] uppercase text-[#0a0a0a] dark:text-[#f2f2f2] mb-2 tracking-wider flex items-center gap-1.5">
              <span style={{ color: color }}>◆</span> System Architecture
            </h4>
            <p className="text-[#555] dark:text-[#aaa] text-[11px] leading-relaxed">
              {project.details.architecture}
            </p>
          </div>

          {/* Key Modules lists */}
          <div className="mb-6">
            <h4 className="font-mono text-[10px] uppercase text-[#0a0a0a] dark:text-[#f2f2f2] mb-2.5 tracking-wider flex items-center gap-1.5">
              <span style={{ color: color }}>◆</span> Modules &amp; Subsystems
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {project.details.modules.map((mod, i) => (
                <div key={i} className="flex items-center gap-2 border border-[#e8e8e8] dark:border-white/15 px-3 py-2">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-mono text-[9.5px] text-[#555] dark:text-[#aaa]">{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Command Terminal box */}
          <div>
            <h4 className="font-mono text-[10px] uppercase text-[#0a0a0a] dark:text-[#f2f2f2] mb-2 tracking-wider flex items-center gap-1.5">
              <span style={{ color: color }}>◆</span> Local Installation
            </h4>
            <div
              onClick={copyToClipboard}
              className="flex items-center justify-between border border-[#0a0a0a] bg-[#0a0a0a] p-3 font-mono text-[11px] cursor-pointer transition-all duration-300 group"
            >
              <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
                <span className="text-cyan">$</span>
                <span className="text-white">{project.details.command}</span>
              </div>
              <button
                className="ml-3 font-mono text-[8px] tracking-wider uppercase font-bold px-2 py-1 border border-white/20 text-white transition-all duration-200"
                style={{ color: copied ? '#3ef07c' : '#ffffff' }}
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>
        </div>

        {/* Links Footer */}
        <div className="border-t border-[#0a0a0a] dark:border-white/15">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center py-4 text-center font-mono text-[11px] tracking-widest uppercase font-bold text-white transition-all duration-200"
          >
            <span>Launch Console</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
});

// Card Component
const Card = memo(function Card({ project, idx, onOpenDetails, borderClasses }) {
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
      className={`card spotlight-card p-8 flex flex-col cursor-pointer group ${borderClasses}`}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: "spring", stiffness: 75, damping: 14, delay: idx * 0.06 }}
    >
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="w-10 h-10 border border-[#0a0a0a] dark:border-white/25 flex items-center justify-center text-lg">
          {project.icon}
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#666] dark:text-[#999]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col }} /> {project.badge}
        </span>
      </div>

      <h3 className="relative z-10 font-semibold text-lg mb-2 text-[#0a0a0a] dark:text-[#f2f2f2]">{project.name}</h3>
      <p className="relative z-10 text-sm text-[#555] dark:text-[#aaa] leading-relaxed mb-6 flex-1">{project.desc}</p>

      {project.features && (
        <ul className="relative z-10 flex flex-col gap-1.5 mb-6">
          {project.features.map((feat, fIdx) => (
            <li key={fIdx} className="text-[11px] text-[#666] dark:text-[#999]">
              {feat}
            </li>
          ))}
        </ul>
      )}

      <div className="relative z-10 flex items-center justify-between pt-1 select-none">
        {project.liveUrl && project.liveUrl !== '#' && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center px-6 py-1.5 rounded-full text-xs font-semibold bg-[#0a0a0a] text-white border border-[#0a0a0a] dark:bg-white dark:text-[#0a0a0a] dark:border-white hover:bg-transparent hover:text-[#0a0a0a] dark:hover:bg-transparent dark:hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.08)]"
          >
            <span>Launch</span>
          </a>
        )}
        <span className="font-mono text-[10px] tracking-widest text-[#999] dark:text-[#777] group-hover:text-[#0a0a0a] dark:group-hover:text-[#f2f2f2] transition-colors duration-300 ml-auto">
          Specs →
        </span>
      </div>
    </motion.div>
  );
});

export default memo(function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const cols = 3; // md:grid-cols-3

  return (
    <>
      <div id="projects" className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-20 pb-10 animate-section">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan mb-4 inline-block">Selected Work</span>
        <h2 className="font-semibold text-4xl lg:text-5xl tracking-tight text-[#0a0a0a] dark:text-[#f2f2f2]">Live Project Index</h2>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#e8e8e8] dark:border-white/15 mb-4">
        {PROJECTS.map((project, idx) => (
          <Card
            key={idx}
            project={project}
            idx={idx}
            onOpenDetails={setActiveProject}
            borderClasses={`border-r border-b border-[#e8e8e8] dark:border-white/15 ${(idx + 1) % cols === 0 ? '' : ''}`}
          />
        ))}

        {/* Placeholder Coming Soon Box */}
        <div className="card flex flex-col items-center justify-center border-r border-b border-[#e8e8e8] dark:border-white/15 text-[#666] dark:text-[#999] hover:text-cyan min-h-[300px] text-center gap-4 select-none group">
          <div className="w-12 h-12 border border-dashed border-[#999] dark:border-white/30 flex items-center justify-center text-lg transition-transform duration-500 group-hover:rotate-90">
            <span>⚡</span>
          </div>
          <div className="text-xs font-medium">
            In Development<br />
            <span className="font-mono text-[9px] text-[#999] dark:text-[#777]">NEXT_BUILD_QUEUED</span>
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
