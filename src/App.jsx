import React, { useState, useEffect, useRef } from 'react';
import Scene3D from './components/Scene3D';


/* ─── Projects Data ─── */
const PROJECTS = [
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
    badge: "LIVE APP",
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
  },
  {
    name: "Offline Music Player",
    desc: "Feature-rich Electron-based music player with yt-dlp integration, auto-download capabilities, and a sleek dark UI built for local playback.",
    icon: "🎵",
    glow: "cyan",
    badge: "DESKTOP APP",
    githubUrl: "https://github.com/shaswatxd/offline-music-player",
    liveUrl: "#",
    features: [
      "🎵 Local & Online Music Playback",
      "📥 Auto-Download via yt-dlp",
      "🎨 Sleek Glassmorphism Dark UI",
      "⚡ Background Engine Auto-Updates"
    ]
  }
];

const GLOW_COLORS = {
  cyan: "#00f0ff",
  violet: "#8b6bff",
  magenta: "#ff3d9a"
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
];



/* ─── Project Card ─── */
function Card({ project, idx }) {
  const cardRef = useRef(null);
  const [cardInView, setCardInView] = useState(false);

  // Lerp tilt state – no re-renders during mouse move
  const tiltRef = useRef({ rx: 0, ry: 0, txRx: 0, txRy: 0, mx: 0.5, my: 0.5, active: false });
  const rafTilt = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCardInView(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      observer.disconnect();
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

    const stillMoving =
      Math.abs(t.rx - t.txRx) > 0.01 ||
      Math.abs(t.ry - t.txRy) > 0.01;

    if (stillMoving || t.active) {
      rafTilt.current = requestAnimationFrame(animateTilt);
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    tiltRef.current.txRx = (ny - 0.5) * -14;
    tiltRef.current.txRy = (nx - 0.5) * 14;
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
    <div
      ref={cardRef}
      className={`card${cardInView ? ' card-visible' : ''}`}
      style={{
        '--glow-color': `${col}22`,
        '--card-accent': col,
        borderColor: undefined,
        animationDelay: `${idx * 0.12}s`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shimmer sweep */}
      <div className="card-shimmer" />

      <div className="card-top">
        <div
          className="card-icon"
          style={{ background: `${col}1a`, border: `1px solid ${col}44`, color: col }}
        >
          {project.icon}
        </div>
        <div className="card-links">
          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link-btn"
              title="GitHub Repository"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}>
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
              className="card-link-btn primary"
              style={{ '--btn-accent': col }}
              title="Launch Live App"
            >
              Launch ↗
            </a>
          )}
        </div>
      </div>

      <h3 className="card-title">{project.name}</h3>
      <p className="card-desc">{project.desc}</p>

      {project.features && (
        <ul className="card-features">
          {project.features.map((feat, fIdx) => (
            <li key={fIdx}>{feat}</li>
          ))}
        </ul>
      )}

      <span className="badge" style={{ color: col, borderColor: `${col}44` }}>
        {project.badge}
      </span>
    </div>
  );
}

/* ─── Tech Stack Badge ─── */
const TechBadge = React.memo(function TechBadge({ tech, idx }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="tech-badge"
      style={{
        '--badge-color': tech.color,
        animationDelay: `${idx * 0.07}s`,
        boxShadow: hovered ? `0 0 20px ${tech.color}44, 0 0 40px ${tech.color}22` : undefined,
        borderColor: hovered ? `${tech.color}80` : undefined,
        transform: hovered ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="tech-icon">{tech.icon}</span>
      <span className="tech-name">{tech.name}</span>
    </div>
  );
});

/* ─── Main App ─── */
export default function App() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  // Lerp parallax — smooth, no jank
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

    const handleScroll = () => setScrolled(window.scrollY > 20);

    // RAF loop for smooth lerp — only runs when mouse moves, stops when idle
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
      // Stop loop when close enough to target
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

    return () => {
      mq.removeEventListener("change", handleMQ);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* 3D Background */}
      <Scene3D prefersReduced={prefersReduced} />

      {/* Overlay gradients — refs controlled by lerp RAF loop */}
      <div className="bg-fade" />
      <div ref={glowRef} className="bg-glow" />
      <div ref={glowSecRef} className="bg-glow secondary" />

      <div className="content-wrapper">
        {/* ── Navigation ── */}
        <nav className={scrolled ? 'scrolled' : ''}>
          <div className="brand">
            <span className="dot" />
            SHASWAT<span className="accent">HUB</span>
          </div>

          <div className="nav-center">
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#stack" className="nav-link">Stack</a>
            <a href="mailto:support@shaswathub.xyz" className="nav-link">Contact</a>
          </div>

          <a
            href="https://github.com/shaswatxd"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-avatar-link"
            title="GitHub Profile"
          >
            <img src="/avatar.png" alt="GitHub Profile" className="nav-avatar" />
          </a>
        </nav>

        {/* ── Hero Header ── */}
        <header>
          <div className="eyebrow">Dev Console · Personal Build Log</div>
          <h1>
            Everything I'm<br />
            <span className="line2">Building, Shipping, Breaking.</span>
          </h1>
          <p className="sub">
            A live index of projects, repos, and experiments — from <b>desktop apps</b> to <b>web tools</b>. Updated as things ship, not as a resume.
          </p>

          <div className="hero-ctas">
            <a href="#projects" className="cta-btn primary">
              <span>View Projects</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="https://github.com/shaswatxd" target="_blank" rel="noopener noreferrer" className="cta-btn ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </header>



        {/* ── Projects Section ── */}
        <div id="projects" className="section-head">
          <h2>Projects &amp; Links</h2>
          <div className="tag">// React Three Fiber powered dev console</div>
        </div>

        <div className="grid">
          {PROJECTS.map((project, idx) => (
            <Card key={idx} project={project} idx={idx} />
          ))}
          <div className="card placeholder">
            <div className="plus-ring">
              <span>⚡</span>
            </div>
            <div className="placeholder-text">
              More Projects<br />
              <span>Coming Soon</span>
            </div>
          </div>
        </div>

        {/* ── Tech Stack Section ── */}
        <div id="stack" className="section-head">
          <h2>Tech Stack</h2>
          <div className="tag">// Tools I build with daily</div>
        </div>

        <div className="stack-grid">
          {TECH_STACK.map((tech, idx) => (
            <TechBadge key={idx} tech={tech} idx={idx} />
          ))}
        </div>

        {/* ── Terminal About Block ── */}
        <div className="terminal-block">
          <div className="terminal-bar">
            <span className="t-dot red" />
            <span className="t-dot yellow" />
            <span className="t-dot green" />
            <span className="t-title">shaswat@devbox ~ zsh</span>
          </div>
          <div className="terminal-body">
            <div className="t-line">
              <span className="t-prompt">shaswat@devbox</span>
              <span className="t-path"> ~/projects</span>
              <span className="t-sym"> $ </span>
              <span className="t-cmd">whoami</span>
            </div>
            <div className="t-output">
              <span className="t-key">name</span>: Shaswat<br />
              <span className="t-key">role</span>: Full-Stack &amp; Desktop Developer<br />
              <span className="t-key">focus</span>: Web Apps · Desktop Tools · Automation<br />
              <span className="t-key">currently</span>: Building cool things &amp; shipping fast<br />
              <span className="t-key">contact</span>: support@shaswathub.xyz
            </div>
            <div className="t-line">
              <span className="t-prompt">shaswat@devbox</span>
              <span className="t-path"> ~/projects</span>
              <span className="t-sym"> $ </span>
              <span className="t-cursor">▮</span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer>
          <div className="footer-brand">
            SHASWAT<span className="accent">HUB</span>
          </div>
          <div className="footer-tagline">Building things that matter, one commit at a time.</div>
          <div className="links">
            <a href="https://github.com/shaswatxd" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a href="mailto:support@shaswathub.xyz">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email
            </a>
          </div>
          <div className="footer-copy">© 2025 shaswatxd · developed with ❤️ &amp; caffeine</div>
        </footer>
      </div>
    </>
  );
}
