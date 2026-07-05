"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Footer = React.memo(function Footer() {
  return (
    <motion.footer
      className="relative border-t border-white/[0.08] text-center py-10 bg-gradient-to-b from-transparent to-[#060810]/50 mt-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="font-display font-bold text-base tracking-wide text-[#e8edf8] mb-2.5">
        SHASWAT<span style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>HUB</span>
      </div>
      <div className="font-mono text-[10px] text-[#8895b0] mb-6">Building things that matter, one commit at a time.</div>
      <div className="font-mono text-[9px] text-[#8895b0]/55 max-w-[90vw] mx-auto">
        &copy; {new Date().getFullYear()} &middot; developed with &hearts; &amp; chai &middot; Contact: srijankumardeo777@gmail.com
      </div>
    </motion.footer>
  );
});

export default Footer;
