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
        <p className="text-[#555] dark:text-[#aaa] max-w-md mx-auto">
          Have an idea, open-source sync, or a technical challenge? Drop me a mail.
        </p>
      </div>
    </motion.div>
  );
}
