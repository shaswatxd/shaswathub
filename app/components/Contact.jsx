"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Contact = React.memo(function Contact() {
  return (
    <motion.div
      id="contact"
      className="max-w-[900px] mx-auto px-8 mb-16 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.06)_0%,rgba(139,107,255,0.04)_40%,transparent_70%)] pointer-events-none z-0" />
      <div className="relative z-10 text-center p-12 bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, #00f0ff, transparent)' }} />
        <div className="font-mono text-[10px] tracking-[3px] uppercase mb-4.5" style={{ color: '#00f0ff' }}>Get In Touch</div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl leading-[1.2] tracking-tight mb-5 text-[#e8edf8]">
          Let&apos;s Build Something<br />
          <span style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff, #ff3d9a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Together.</span>
        </h2>
        <p className="max-w-[500px] mx-auto text-[#8895b0] text-xs sm:text-sm leading-relaxed">
          Got a project idea, collaboration, or just want to say hi? I&apos;m always open to discussing new opportunities and interesting concepts. Reach out anytime.
        </p>
      </div>
    </motion.div>
  );
});

export default Contact;
