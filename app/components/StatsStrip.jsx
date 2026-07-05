"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../../src/hooks';

function StatsStrip() {
  const statsRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const projects = useCountUp(5, 1600, inView);
  const techs = useCountUp(16, 1800, inView);
  const commits = useCountUp(1000, 2200, inView);

  return (
    <motion.div
      ref={statsRef}
      className="max-w-[900px] mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl will-change-transform"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="p-7 text-center border-r border-white/[0.08] hover:bg-white/[0.01] transition-colors duration-300">
        <div className="font-display font-bold text-3xl" style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{projects}+</div>
        <div className="font-mono text-[9px] tracking-wider uppercase text-[#8895b0] mt-2">Projects Shipped</div>
      </div>
      <div className="p-7 text-center md:border-r border-white/[0.08] hover:bg-white/[0.01] transition-colors duration-300">
        <div className="font-display font-bold text-3xl" style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{techs}+</div>
        <div className="font-mono text-[9px] tracking-wider uppercase text-[#8895b0] mt-2">Technologies</div>
      </div>
      <div className="p-7 text-center border-r border-white/[0.08] hover:bg-white/[0.01] transition-colors duration-300">
        <div className="font-display font-bold text-3xl" style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{commits}+</div>
        <div className="font-mono text-[9px] tracking-wider uppercase text-[#8895b0] mt-2">Commits</div>
      </div>
      <div className="p-7 text-center hover:bg-white/[0.01] transition-colors duration-300">
        <div className="font-display font-bold text-3xl" style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>100%</div>
        <div className="font-mono text-[9px] tracking-wider uppercase text-[#8895b0] mt-2">Open Source</div>
      </div>
    </motion.div>
  );
}

export default StatsStrip;
