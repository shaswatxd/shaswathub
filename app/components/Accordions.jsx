"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: "[SYS_SPEC] What is the architecture of ShaswatHub?",
    answer: "ShaswatHub is built as a static client-side console shell using Next.js. It features a custom WebGL render loop powered by React Three Fiber for interactive background vectors, combined with GSAP scroll syncing and client-side processing units for full 60fps operation on both desktop and mobile layouts."
  },
  {
    question: "[PERF_SPEC] How is high performance (60 FPS) guaranteed?",
    answer: "Performance is optimized by locking the Canvas device pixel ratio (DPR) to 1, offloading all grid-oscillation calculations to the GPU via vertex shaders, using lightweight procedurally generated points instead of large 3D glb files, and leveraging hardware accelerated CSS transitions with will-change properties to avoid layout shifts."
  },
  {
    question: "[UPDATE_CYCLE] How are project builds compiled and index logs updated?",
    answer: "Projects are synchronized directly with local directories. The console checks repositories via automation webhooks and updates the build log list during deployment routines. A custom terminal interface lists system metadata, displaying compile timelines and active production states."
  }
];

function AccordionItem({ item, isOpen, onClick }) {
  return (
    <div 
      className={`border rounded-xl transition-all duration-300 overflow-hidden ${isOpen ? 'border-[#00f0ff]/20 bg-white/[0.03]' : 'border-white/[0.06] bg-white/[0.01]'}`}
    >
      <button
        onClick={onClick}
        className="w-full text-left p-5 flex items-center justify-between font-mono text-[11px] sm:text-xs text-[#e8edf8] hover:text-[#00f0ff] transition-colors duration-200"
      >
        <span className="flex items-center gap-3">
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-[#00f0ff]' : 'bg-[#8895b0]'}`} style={{ boxShadow: isOpen ? '0 0 8px #00f0ff' : 'none' }} />
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-[#8895b0] hover:text-white text-[10px]"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 pb-5 pt-0 text-[#8895b0] text-[11px] leading-relaxed border-t border-white/[0.04] pt-4">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Accordions() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[760px] mx-auto mb-16 px-8 animate-section">
      {/* Title */}
      <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-3 mb-6 select-none">
        <h3 className="font-display font-bold text-sm tracking-widest text-[#e8edf8] uppercase">
          [System Console FAQ]
        </h3>
        <span className="font-mono text-[9px] text-[#8895b0]">// system_diagnostics.log</span>
      </div>

      {/* Accordions */}
      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item, idx) => (
          <AccordionItem
            key={idx}
            item={item}
            isOpen={openIndex === idx}
            onClick={() => handleToggle(idx)}
            idx={idx}
          />
        ))}
      </div>
    </div>
  );
}
