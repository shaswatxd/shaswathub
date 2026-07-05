"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const nowScrolled = window.scrollY > 20;
      if (nowScrolled !== lastScrolled) {
        lastScrolled = nowScrolled;
        setScrolled(nowScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`sticky top-0 z-[100] flex items-center justify-between px-8 py-3.5 transition-all duration-500 border-b will-change-transform ${scrolled ? 'bg-[#060810]/85 border-white/[0.12] shadow-2xl backdrop-blur-xl' : 'bg-transparent border-white/[0.04]'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2.5 font-display font-bold text-lg tracking-wider text-[#e8edf8] uppercase">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor: '#00f0ff',
            boxShadow: '0 0 12px #00f0ff, 0 0 24px #00f0ff',
          }}
        />
        SHASWAT<span style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>HUB</span>
      </div>

      <div className="hidden md:flex items-center gap-1.5">
        {[
          { href: '#builds', label: 'Builds' },
          { href: '#projects', label: 'Projects' },
          { href: '#stack', label: 'Stack' },
          { href: '#contact', label: 'Contact' },
        ].map((link) => (
          <a key={link.href} href={link.href} className="relative group font-mono text-[11px] text-[#8895b0] hover:text-[#e8edf8] px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200">
            {link.label}
            <span className="absolute bottom-[-1px] left-1/2 w-0 h-[1.5px] transform translate-x-[-50%] group-hover:w-3/5 transition-all duration-300" style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)' }} />
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com/shaswatxd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full border overflow-hidden w-[38px] h-[38px] transition-all duration-300 hover:scale-105 hover:rotate-6"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00f0ff'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,240,255,0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
          title="GitHub Profile"
        >
          <Image
            src="/avatar.png"
            alt="GitHub Profile"
            width={38}
            height={38}
            className="w-full h-full object-cover"
            priority
          />
        </a>
      </div>
    </motion.nav>
  );
}
