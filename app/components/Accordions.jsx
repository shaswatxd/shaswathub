"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: "[SYS_SPEC] What is the architecture of ShaswatHub?",
    answer: "ShaswatHub is built as a static client-side console shell using Next.js, with GSAP-driven scroll reveals, Lenis smooth-scroll, and Framer Motion micro-interactions layered on a minimal, bordered-grid design system."
  },
  {
    question: "[PERF_SPEC] How is high performance (60 FPS) guaranteed?",
    answer: "Performance is kept lean by favoring CSS transforms and lightweight JS-driven animation over heavy rendering pipelines, using next/font for zero-layout-shift typography, and leveraging hardware-accelerated transitions with will-change properties where it matters."
  },
  {
    question: "[UPDATE_CYCLE] How are project builds compiled and index logs updated?",
    answer: "Projects are synchronized directly with local directories. The console checks repositories via automation webhooks and updates the build log list during deployment routines. A custom terminal interface lists system metadata, displaying compile timelines and active production states."
  }
];

function AccordionItem({ item, isOpen, onClick }) {
  return (
    <div className={`border transition-all duration-300 overflow-hidden ${isOpen ? 'border-cyan' : 'border-[#e8e8e8] dark:border-white/15'}`}>
      <button
        onClick={onClick}
        className="w-full text-left p-5 flex items-center justify-between font-mono text-[11px] sm:text-xs text-[#0a0a0a] dark:text-[#f2f2f2] hover:text-cyan transition-colors duration-200"
      >
        <span className="flex items-center gap-3">
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-cyan' : 'bg-[#999] dark:bg-[#777]'}`} />
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-[#999] dark:text-[#777] text-[10px]"
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
            <div className="px-5 pb-5 pt-4 text-[#555] dark:text-[#aaa] text-[11px] leading-relaxed border-t border-[#e8e8e8] dark:border-white/15">
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
    <div className="max-w-[760px] mx-auto mb-16 px-6 lg:px-16 animate-section">
      {/* Title */}
      <div className="flex items-baseline justify-between border-b border-[#0a0a0a] dark:border-white/20 pb-3 mb-6 select-none">
        <h3 className="font-semibold text-sm tracking-widest text-[#0a0a0a] dark:text-[#f2f2f2] uppercase">
          [System Console FAQ]
        </h3>
        <span className="font-mono text-[9px] text-[#999] dark:text-[#777]">// system_diagnostics.log</span>
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
