"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Footer = React.memo(function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      className="relative border-t border-white/[0.08] bg-gradient-to-b from-transparent to-[#04060f]/60 py-12 mt-16 pb-16 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-[1480px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo and Tagline */}
        <div className="text-center md:text-left">
          <div className="font-display font-bold text-base tracking-widest text-[#e8edf8] mb-1.5 uppercase select-none">
            SHASWAT<span style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>HUB</span>
          </div>
          <div className="font-mono text-[9px] text-[#8895b0] tracking-wide">// Building things that matter, one commit at a time.</div>
        </div>

        {/* Console Operational State */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.01] select-none">
          <span 
            className="w-1.5 h-1.5 rounded-full animate-pulse-custom" 
            style={{ 
              backgroundColor: '#3ef07c', 
              boxShadow: '0 0 8px #3ef07c' 
            }} 
          />
          <span className="font-mono text-[8px] text-[#8895b0] tracking-wider uppercase">
            CONSOLE_STATUS: <span className="text-[#3ef07c] font-bold">OPERATIONAL</span>
          </span>
        </div>

        {/* Contact Links & Back to Top */}
        <div className="flex flex-col items-center md:items-end gap-2.5">
          <a 
            href="mailto:srijankumardeo777@gmail.com" 
            className="font-mono text-[10px] text-[#8895b0] hover:text-[#00f0ff] transition-colors duration-200"
          >
            srijankumardeo777@gmail.com
          </a>
          
          <button 
            onClick={handleScrollTop}
            className="font-mono text-[9px] text-[#8895b0] hover:text-white transition-colors duration-200 flex items-center gap-1 group cursor-pointer"
          >
            RETURN_TO_TOP <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>

      </div>

      {/* Copyright lines */}
      <div className="max-w-[1480px] mx-auto px-8 mt-8 pt-6 border-t border-white/[0.04] text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        <div className="font-mono text-[9px] text-[#8895b0]/45">
          &copy; {currentYear} &middot; developed with &hearts; &amp; chai &middot; ShaswatHub shell.
        </div>
        <div className="font-mono text-[8px] text-[#8895b0]/30 tracking-wider">
          SYSTEM_VERSION_4.2.0_SECURE
        </div>
      </div>
    </motion.footer>
  );
});

export default Footer;
