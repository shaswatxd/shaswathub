"use client";

import React, { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const COMMANDS = {
  help: `Available commands:
  • whoami    : About Srijan Shaswat
  • projects  : List live projects & repos
  • skills    : Tech stack & tools
  • contact   : Get in touch & social links
  • theme     : Toggle Dark / Light mode
  • matrix    : Trigger Cyber Matrix code stream
  • clear     : Clear terminal output
  • sudo      : Execute with superuser privileges`,

  whoami: `name      : Srijan Shaswat
role      : Full-Stack & Desktop Developer
focus     : Desktop Apps · Web Tools · High Performance Interfaces
currently : Shipping software, writing code & breaking bugs`,

  projects: `⚡ SHASWATHUB LIVE REPOSITORY INDEX:
  1. NovaDL       : Multi-threaded Download Manager for Windows with HLS Support
  2. VoiceWave    : Peer-to-peer real-time browser voice chat app
  3. We Plays     : Glassmorphic music player with lyrics & visualizer
  4. JustPDFCraft : 100% Client-Side PDF Utilities Toolkit
  5. ResumeAI     : AI-Powered Resume Builder with 30 Templates`,

  skills: `🛠️ CORE TECH STACK & ENGINE:
  • Languages  : JavaScript (ESNext), TypeScript, HTML5, CSS3, C++
  • Frameworks : Next.js (App Router), React 19, Tailwind v4
  • Desktop    : Electron, Node.js, Worker Threads, WASM (sql.js)
  • Animations : GSAP, Framer Motion, Lenis Smooth Scroll
  • WebGL/3D   : React Three Fiber (R3F), Three.js`,

  contact: `📬 REACH OUT:
  • GitHub   : https://github.com/shaswatxd
  • Projects : https://novadl.vercel.app`,

  sudo: `[sudo] permission requested for user 'guest'...
Access Granted: You already hold root privileges on ShaswatHub OS 👑`
};

export default memo(function Terminal() {
  const [history, setHistory] = useState([
    { type: 'cmd', text: 'whoami' },
    { type: 'output', text: COMMANDS.whoami },
    { type: 'info', text: 'Type "help" to see available commands or "matrix" for a surprise.' }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [pastCmds, setPastCmds] = useState(['whoami']);
  const [isMatrix, setIsMatrix] = useState(false);

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const isFirstRender = useRef(true);

  // Auto scroll to bottom on new output (skipping initial page mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isMatrix]);

  // Handle command submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    const cmd = rawCmd.toLowerCase();
    const newHistory = [...history, { type: 'cmd', text: rawCmd }];
    setPastCmds((prev) => [...prev, rawCmd]);
    setCmdIndex(-1);

    if (cmd === 'clear' || cmd === 'cls') {
      setHistory([]);
      setInputVal("");
      return;
    }

    if (cmd === 'theme') {
      const isDark = document.documentElement.classList.contains('dark');
      const next = !isDark;
      document.documentElement.classList.toggle('dark', next);
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
      newHistory.push({ type: 'output', text: `Switched theme to ${next ? 'DARK' : 'LIGHT'} mode ☀️🌙` });
    } else if (cmd === 'matrix') {
      setIsMatrix(true);
      newHistory.push({ type: 'output', text: 'INITIATING CYBER MATRIX STREAM...' });
      setTimeout(() => setIsMatrix(false), 4500);
    } else if (COMMANDS[cmd]) {
      newHistory.push({ type: 'output', text: COMMANDS[cmd] });
    } else {
      newHistory.push({ type: 'error', text: `zsh: command not found: ${rawCmd}. Type "help" for a list of available commands.` });
    }

    setHistory(newHistory);
    setInputVal("");
  };

  // Keyboard navigation UP/DOWN arrow for history
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCmds.length === 0) return;
      const nextIdx = cmdIndex === -1 ? pastCmds.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(nextIdx);
      setInputVal(pastCmds[nextIdx] || "");
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex === -1) return;
      const nextIdx = cmdIndex + 1;
      if (nextIdx >= pastCmds.length) {
        setCmdIndex(-1);
        setInputVal("");
      } else {
        setCmdIndex(nextIdx);
        setInputVal(pastCmds[nextIdx] || "");
      }
    }
  };

  return (
    <div className="max-w-[820px] mx-auto mb-20 px-6 lg:px-16">
      <motion.div
        className="border border-[#0a0a0a] dark:border-white/20 bg-[#07070c] shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden rounded-xl"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0a0b12] select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
            <span className="font-mono text-[11px] text-[#999] ml-2 font-semibold tracking-wider">shaswat@devbox ~ zsh</span>
          </div>
          <span className="font-mono text-[10px] text-cyan uppercase tracking-widest font-medium">[INTERACTIVE]</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-[12px] min-h-[260px] max-h-[420px] overflow-y-auto scrollbar-thin select-text">
          {history.map((item, idx) => (
            <div key={idx} className="mb-3">
              {item.type === 'cmd' && (
                <div className="flex items-center gap-2 text-white">
                  <span className="font-semibold text-[#3ef07c]">shaswat@devbox</span>
                  <span className="text-[#8b6bff]">~/projects</span>
                  <span className="text-[#999]">$</span>
                  <span className="font-bold text-white">{item.text}</span>
                </div>
              )}
              {item.type === 'output' && (
                <pre className="text-[#aaa] leading-relaxed whitespace-pre-wrap font-mono mt-1 text-[11px]">
                  {item.text}
                </pre>
              )}
              {item.type === 'info' && (
                <div className="text-cyan/80 leading-relaxed font-mono mt-1 text-[11px] italic">
                  ℹ️ {item.text}
                </div>
              )}
              {item.type === 'error' && (
                <div className="text-rose-400 font-mono mt-1 text-[11px]">
                  {item.text}
                </div>
              )}
            </div>
          ))}

          {/* Matrix Stream Animation Overlay */}
          {isMatrix && (
            <div className="text-cyan font-mono text-[11px] leading-tight my-2 animate-pulse space-y-0.5">
              <div>01001100 01001111 01000001 01000100 01001001 01001110 01000111</div>
              <div>01010011 01001008 01000001 01010011 01010111 01000001 01010100</div>
              <div>[ MATRIX CODE STREAM ENGAGED • ALL SYSTEMS NORMAL ]</div>
            </div>
          )}

          {/* Active Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-[#3ef07c] shrink-0">shaswat@devbox</span>
            <span className="text-[#8b6bff] shrink-0">~/projects</span>
            <span className="text-[#999] shrink-0">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white border-none outline-none focus:ring-0 p-0 font-mono text-[12px] caret-cyan"
              spellCheck="false"
              autoComplete="off"
            />
          </form>
          <div ref={terminalEndRef} />
        </div>
      </motion.div>
    </div>
  );
});
