"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <motion.div
      id="contact"
      className="max-w-[1000px] mx-auto px-6 lg:px-16 py-20 relative"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan mb-4 inline-block">
          Let&apos;s Connect
        </span>
        <h2 className="font-semibold text-4xl lg:text-6xl tracking-tight mb-6 leading-[1.05] text-[#0a0a0a] dark:text-[#f2f2f2]">
          Got a build in mind?<br />Let&apos;s ship it.
        </h2>
        <p className="text-[#555] dark:text-[#aaa] max-w-md mx-auto mb-10">
          Have an idea, open-source sync, or a technical challenge? Drop me a mail.
        </p>

        <motion.a
          href="mailto:srijankumardeo777@gmail.com"
          className="inline-flex items-center gap-3 font-mono text-sm lg:text-base text-[#0a0a0a] dark:text-[#f2f2f2] border border-[#e8e8e8] dark:border-white/15 px-6 py-4 transition-all duration-300 hover:border-cyan hover:text-cyan group"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <span className="text-cyan text-xs font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity duration-300">✉</span>
          srijankumardeo777@gmail.com
        </motion.a>
      </div>
    </motion.div>
  );
}
