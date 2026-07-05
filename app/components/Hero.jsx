"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Hero = React.memo(function Hero() {
  return (
    <motion.header
      className="relative z-10 px-6 py-[10vh] text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="font-mono text-[10px] text-[#00f0ff] tracking-[3.5px] uppercase mb-6 flex items-center justify-center gap-3">
        <span className="w-[30px] h-[1px] bg-gradient-to-r from-transparent to-[#00f0ff]" />
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }}
        />
        Dev Console · Personal Build Log
        <span className="w-[30px] h-[1px] bg-gradient-to-l from-transparent to-[#00f0ff]" />
      </div>
      <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-[-1.5px] leading-[1.05] text-[#e8edf8] mb-6">
        Everything I&apos;m<br />
        <span
          className="animate-shimmer-text"
          style={{
            backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff, #ff3d9a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 100%',
          }}
        >
          Building, Shipping, Breaking.
        </span>
      </h1>
      <p className="max-w-[620px] mx-auto text-[#8895b0] text-sm sm:text-base leading-relaxed mb-10">
        A live index of projects, repos, and experiments — from <b className="text-[#e8edf8] font-semibold">desktop apps</b> to <b className="text-[#e8edf8] font-semibold">web tools</b>. Updated as things ship, not as a resume.
      </p>

      <div className="flex items-center justify-center gap-4.5 max-w-[290px] sm:max-w-none mx-auto flex-col sm:flex-row">
        <a
          href="#projects"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display text-[13px] font-bold px-7 py-3.5 rounded-xl text-[#030303] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #00f0ff, #8b6bff)',
            boxShadow: '0 0 24px rgba(0,240,255,0.25)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 35px rgba(0,240,255,0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(0,240,255,0.25)'}
        >
          <span>View Projects</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="#contact" className="w-full sm:w-auto inline-flex items-center justify-center font-display text-[13px] font-bold px-7 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:border-violet text-[#e8edf8] hover:bg-white/[0.06] transition-all duration-300"
          style={{ boxShadow: 'none' }}
        >
          <span>Get In Touch</span>
        </a>
      </div>

      <div className="flex flex-col items-center gap-2.5 mt-16">
        <div className="w-6 h-[38px] rounded-xl border-2 border-white/[0.15] flex justify-center">
          <div className="w-[3px] h-2 rounded-full mt-1.5 animate-scroll-bounce" style={{ backgroundColor: '#00f0ff' }} />
        </div>
        <span className="font-mono text-[9px] tracking-[2px] uppercase text-[#8895b0]/60">Scroll to explore</span>
      </div>
    </motion.header>
  );
});

export default Hero;
