"use client";

import React from 'react';

const MARQUEE_ITEMS = [
  "REACT", "NODE.JS", "ELECTRON", "THREE.JS", "WEBRTC", "SOCKET.IO",
  "VITE", "FFMPEG", "PYTHON", "MONGODB", "GIT", "TAILWIND CSS",
  "JAVASCRIPT", "HTML5", "CSS3", "REST APIs", "PEERJS", "STRIPE", "PRISMA", "SUPABASE"
];

const Marquee = React.memo(function Marquee() {
  const items = MARQUEE_ITEMS;
  const row = items.map((t, i) => (
    <span key={i} className="inline-flex items-center gap-2.5 px-7 text-xs font-semibold tracking-widest text-[#999] dark:text-[#777] hover:text-[#0a0a0a] dark:hover:text-[#f2f2f2] transition-colors duration-500">
      <span className="text-[6px] text-cyan">◆</span> {t}
    </span>
  ));
  return (
    <div className="relative overflow-hidden py-8 border-y border-[#0a0a0a] dark:border-white/15 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent z-10" />
      <div className="flex w-max">
        <div className="flex animate-marquee will-change-transform">{row}{row}</div>
      </div>
    </div>
  );
});

export default Marquee;
