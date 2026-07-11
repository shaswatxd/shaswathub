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
    <span key={i} className="inline-flex items-center gap-2.5 px-7 text-xs font-display font-bold tracking-widest text-[#8895b0]/50 hover:opacity-100 transition-all duration-500" style={{ '--tw-text-opacity': 1 }}>
      <span className="text-[6px]" style={{ color: '#8b6bff' }}>◆</span> {t}
    </span>
  ));
  return (
    <div className="relative overflow-hidden py-8 my-4 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-10" />
      <div className="flex w-max mb-4">
        <div className="flex animate-marquee will-change-transform">{row}{row}</div>
      </div>
      <div className="flex w-max reverse">
        <div className="flex animate-marquee-reverse will-change-transform">{row}{row}</div>
      </div>
    </div>
  );
});

export default Marquee;
