"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

// Reusable Magnetic component using GSAP for smooth physics
function MagneticButton({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      // Pull toward mouse (magnetic strength 0.35)
      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      // Elastic rebound to original position
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1.1, 0.4)"
      });
    };

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={ref} className="magnetic-container">
      {children}
    </div>
  );
}

// Custom click ripple effect handler
const triggerRipple = (e) => {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ripple = document.createElement("span");
  ripple.className = "ripple-effect";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  // Ripple diameter covering the button diagonals
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;

  btn.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 700);
};

const Hero = React.memo(function Hero() {
  // Split headings into words for staggered text reveal
  const title1 = "Everything I'm".split(" ");
  const title2 = "Building, Shipping,".split(" ");

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.header
      id="top"
      className="relative px-6 lg:px-16 pt-28 pb-24 max-w-[1440px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Console Badge */}
      <motion.div
        className="flex items-center gap-3 mb-10 select-none"
        variants={itemVariants}
      >
        <span className="w-6 h-px bg-[#0a0a0a] dark:bg-white/40" />
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-[#666] dark:text-[#999]">
          <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-pulse-custom" />
          ShaswatHub · Dev Console
        </span>
      </motion.div>

      {/* Main Heading with Word-by-Word Animation */}
      <h1 className="font-semibold tracking-tight leading-[1.02] text-6xl sm:text-7xl lg:text-[96px] max-w-6xl text-[#0a0a0a] dark:text-[#f2f2f2]">
        <div className="flex flex-wrap gap-x-4 overflow-hidden py-1">
          {title1.map((word, i) => (
            <motion.span key={i} className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 overflow-hidden py-1">
          {title2.map((word, i) => (
            <motion.span key={i} className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 overflow-hidden py-1">
          <motion.span className="inline-block text-cyan" variants={wordVariants}>
            Breaking.
          </motion.span>
        </div>
      </h1>

      {/* Subtext description */}
      <motion.p
        className="mt-10 max-w-xl text-base lg:text-lg text-[#555] dark:text-[#aaa] leading-relaxed"
        variants={itemVariants}
      >
        A live index of projects, repos, and experiments — from <span className="text-[#0a0a0a] dark:text-[#f2f2f2] font-medium">desktop apps</span> to <span className="text-[#0a0a0a] dark:text-[#f2f2f2] font-medium">web tools</span>. Updated as things ship, not as a resume.
      </motion.p>

      {/* CTA Buttons with Magnetic wraps and click ripples */}
      <motion.div
        className="mt-12 flex flex-col sm:flex-row items-start gap-4"
        variants={itemVariants}
      >
        <MagneticButton>
          <a
            href="#projects"
            onClick={triggerRipple}
            className="ripple-container btn-primary inline-flex items-center gap-2 px-8 py-4 font-semibold text-xs uppercase tracking-wider text-white"
          >
            Explore Projects
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </MagneticButton>

        <MagneticButton>
          <a
            href="#contact"
            onClick={triggerRipple}
            className="ripple-container btn-outline inline-flex items-center gap-2 px-8 py-4 font-medium text-xs uppercase tracking-wider text-[#0a0a0a]"
          >
            Get In Touch
          </a>
        </MagneticButton>
      </motion.div>
    </motion.header>
  );
});

export default Hero;
