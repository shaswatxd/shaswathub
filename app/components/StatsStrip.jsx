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
    { value: projectsCount, suffix: "+", label: "Projects Shipped" },
    { value: techsCount, suffix: "+", label: "Technologies" },
    { value: commitsCount, suffix: "+", label: "Commits Logged" },
    { value: "100", suffix: "%", label: "Open Source" },
  ];

  return (
    <motion.div
      ref={statsRef}
      className="max-w-[1440px] mx-auto px-6 lg:px-16 border-y border-[#0a0a0a] dark:border-white/15"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: "spring", stiffness: 60, damping: 15 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`text-left py-10 ${idx < stats.length - 1 ? 'border-r' : ''} border-[#e8e8e8] dark:border-white/15 pr-6 ${idx > 0 ? 'pl-6' : ''}`}
          >
            <p className="num-tag font-semibold text-4xl lg:text-5xl text-[#0a0a0a] dark:text-[#f2f2f2]">
              {stat.value}<span className="text-cyan">{stat.suffix}</span>
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-widest uppercase text-[#666] dark:text-[#999]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

export default StatsStrip;
