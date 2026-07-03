import React, { useState, useEffect, useRef } from 'react';
import Scene3D from './components/Scene3D';

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
  }
];

const GLOW_COLORS = {
  cyan: "#00f0ff",
  violet: "#8b6bff",
  magenta: "#ff3d9a"
};

function Card({ project }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: '50%', my: '50%', active: false });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const rx = ((y / r.height) - 0.5) * -12;
    const ry = ((x / r.width) - 0.5) * 12;

    setTilt({
      rx,
      ry,
      mx: `${x}px`,
      my: `${y}px`,
      active: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, mx: '50%', my: '50%', active: false });
  };

  const col = GLOW_COLORS[project.glow] || GLOW_COLORS.cyan;

  const cardStyle = {
    '--mx': tilt.mx,
    '--my': tilt.my,
    '--glow-color': `${col}1c`,
    transform: tilt.active
      ? `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-6px)`
      : 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)',
    borderColor: tilt.active ? `${col}55` : 'var(--border)'
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-top">
        <div
          className="card-icon"
          style={{
            background: `${col}1a`,
            border: `1px solid ${col}44`,
            color: col
          }}
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
      <h3>{project.name}</h3>
      <p>{project.desc}</p>
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

export default function App() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [parallaxX, setParallaxX] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handleQueryChange = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", handleQueryChange);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35;
      setParallaxX(x);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      mediaQuery.removeEventListener("change", handleQueryChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <Scene3D prefersReduced={prefersReduced} />
      <div className="bg-fade"></div>
      <div
        className="bg-glow"
        style={{
          transform: `translate(calc(-50% + ${parallaxX}px), 0)`
        }}
      ></div>

      <div className="content-wrapper">
        <nav>
          <div className="brand">
            <span className="dot"></span>
            SHASWAT<span className="accent">HUB</span>
          </div>
          <a
            href="https://github.com/shaswatxd"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-user-container"
          >
            <span className="nav-github-name">shaswatxd</span>
            <div className="nav-avatar-wrapper">
              <img src="/avatar.jpg" alt="GitHub Profile" className="nav-avatar" />
            </div>
          </a>
        </nav>

        <header>
          <div className="eyebrow">Dev Console · Personal Build Log</div>
          <h1>
            Everything I'm<br />
            <span className="line2">Building, Shipping, Breaking.</span>
          </h1>
          <p className="sub">
            A live index of projects, repos, and experiments — from <b>desktop apps</b> to <b>web tools</b>. Updated as things ship, not as a resume.
          </p>
        </header>


        <div className="section-head">
          <h2>Projects & Links</h2>
          <div className="tag">// React Three Fiber powered dev console</div>
        </div>

        <div className="grid">
          {PROJECTS.map((project, idx) => (
            <Card key={idx} project={project} />
          ))}
          <div className="card placeholder">
            <div className="plus">⚡</div>
            <div>
              More Projects<br />
              Coming Soon
            </div>
          </div>
        </div>

        <footer>
          <div className="links">
            <a href="https://github.com/shaswatxd" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="mailto:support@shaswathub.xyz">Email</a>
          </div>
          <div>ShaswatHub — built &amp; maintained by Srijan</div>
        </footer>
      </div>
    </>
  );
}
