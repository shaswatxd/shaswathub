"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../../src/hooks';

const StatsStrip = React.memo(function StatsStrip() {
  const statsRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.15 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const projectsCount = useCountUp(3, 1400, inView);
  const techsCount = useCountUp(16, 1600, inView);
  const commitsCount = useCountUp(1000, 2000, inView);

  const stats = [
    { value: `${projectsCount}+`, label: "Projects Shipped", color: "from-[#00f0ff] to-[#8b6bff]" },
    { value: `${techsCount}+`, label: "Technologies", color: "from-[#8b6bff] to-[#ff3d9a]" },
    { value: `${commitsCount}+`, label: "Commits Logs", color: "from-[#ff3d9a] to-[#00f0ff]" },
    { value: "100%", label: "Open Source", color: "from-[#00f0ff] to-[#8b6bff]" }
  ];

  return (
    <motion.div
      ref={statsRef}
      className="max-w-[1000px] mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 border border-white/[0.08] rounded-2xl overflow-hidden glass-panel divide-x divide-y md:divide-y-0 divide-white/[0.06]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: "spring", stiffness: 60, damping: 15 }}
    >
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="p-6 md:p-8 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden"
        >
          {/* Subtle back glowing element */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div 
            className="font-display font-bold text-3xl md:text-4xl tracking-tight select-none"
            style={{ 
              backgroundImage: stat.color.includes('from') ? `linear-gradient(to right, #00f0ff, #8b6bff)` : 'none',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 15px rgba(0, 240, 255, 0.1)'
            }}
          >
            {stat.value}
          </div>
          
          <div className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase text-[#8895b0] mt-2.5 transition-colors duration-300 group-hover:text-[#e8edf8]">
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
});

export default StatsStrip;
