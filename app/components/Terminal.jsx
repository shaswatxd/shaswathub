"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';

export default memo(function Terminal() {
  return (
    <div className="max-w-[760px] mx-auto mb-20 px-8">
      <motion.div
        className="rounded-2xl border border-white/[0.08] bg-[#060810]/75 shadow-3xl overflow-hidden"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="font-mono text-[11px] text-[#8895b0] ml-2">shaswat@devbox ~ zsh</span>
        </div>
        <div className="p-7">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[12px] mb-2.5">
            <span className="font-semibold" style={{ color: '#3ef07c' }}>shaswat@devbox</span>
            <span style={{ color: '#8b6bff' }}>~/projects</span>
            <span className="text-[#8895b0]">$</span>
            <span className="text-[#e8edf8]">whoami</span>
          </div>
          <div className="font-mono text-[12px] text-[#8895b0] leading-relaxed pl-0.5 mb-5 space-y-1">
            <div><span className="font-medium" style={{ color: '#00f0ff' }}>name</span>: Srijan Shaswat</div>
            <div><span className="font-medium" style={{ color: '#00f0ff' }}>role</span>: Full-Stack &amp; Desktop Developer</div>
            <div><span className="font-medium" style={{ color: '#00f0ff' }}>focus</span>: Web Apps · Desktop Tools · Automation</div>
            <div><span className="font-medium" style={{ color: '#00f0ff' }}>currently</span>: Building cool things &amp; shipping fast</div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[12px]">
            <span className="font-semibold" style={{ color: '#3ef07c' }}>shaswat@devbox</span>
            <span style={{ color: '#8b6bff' }}>~/projects</span>
            <span className="text-[#8895b0]">$</span>
            <span className="w-2 h-4 animate-blink" style={{ backgroundColor: '#00f0ff' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
});