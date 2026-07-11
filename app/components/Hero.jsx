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
  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.3
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

  const letterVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.header
      id="top"
      className="relative px-6 lg:px-16 pt-10 pb-24 max-w-[1440px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Animated S Logo — large decorative hero badge */}
      <motion.div
        className="mb-10 inline-flex"
        variants={itemVariants}
      >
        <motion.div
          className="relative w-14 h-14 bg-[#0a0a0a] dark:bg-white/8 rounded-[14px] flex items-center justify-center overflow-visible"
          whileHover={{ scale: 1.08, rotate: -4, transition: { type: 'spring', stiffness: 300, damping: 14 } }}
        >
          {/* Pulsing glow ring behind icon */}
          <motion.div
            className="absolute inset-0 rounded-[14px] bg-cyan/20 dark:bg-cyan/10 blur-xl"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.svg
            viewBox="0 0 24 24"
            className="w-7 h-7 relative z-10"
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <motion.path
              d="M18 8.5C18 6.5 15.5 5 12 5C8.5 5 6 6.5 6 8.5C6 11 9 11.5 12 12C15 12.5 18 13 18 15.5C18 17.5 15.5 19 12 19C8.5 19 6 17.5 6 15.5"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{
                initial: { pathLength: 0, stroke: '#00c2d1' },
                animate: { pathLength: 1, stroke: '#00c2d1', transition: { duration: 1.4, ease: 'easeInOut', delay: 0.2 } },
                hover: {
                  pathLength: [0, 1],
                  stroke: '#00f0ff',
                  filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.9))',
                  transition: { pathLength: { duration: 0.55, ease: 'easeInOut' }, stroke: { duration: 0.15 }, filter: { duration: 0.15 } }
                }
              }}
            />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Main Heading with Word-Safe Letter-by-Letter Animation & Hover Bounce */}
      <h1 className="font-semibold tracking-tight leading-[1.02] text-6xl sm:text-7xl lg:text-[96px] max-w-6xl text-[#0a0a0a] dark:text-[#f2f2f2] select-none">
        <div className="flex flex-wrap py-1">
          {"Everything I'm".split(" ").map((word, wIdx) => (
            <span key={`w1-${wIdx}`} className="inline-block whitespace-nowrap mr-[0.25em]">
              {word.split("").map((char, cIdx) => (
                <motion.span
                  key={`c1-${wIdx}-${cIdx}`}
                  className="inline-block"
                  variants={letterVariants}
                  whileHover={{ 
                    y: -10, 
                    color: "#00c2d1",
                    transition: { type: "spring", stiffness: 350, damping: 10 } 
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap py-1">
          {"Building, Shipping,".split(" ").map((word, wIdx) => (
            <span key={`w2-${wIdx}`} className="inline-block whitespace-nowrap mr-[0.25em]">
              {word.split("").map((char, cIdx) => (
                <motion.span
                  key={`c2-${wIdx}-${cIdx}`}
                  className="inline-block"
                  variants={letterVariants}
                  whileHover={{ 
                    y: -10, 
                    color: "#00c2d1",
                    transition: { type: "spring", stiffness: 350, damping: 10 } 
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap py-1">
          {"Breaking.".split(" ").map((word, wIdx) => (
            <span key={`w3-${wIdx}`} className="inline-block whitespace-nowrap mr-[0.25em]">
              {word.split("").map((char, cIdx) => (
                <motion.span
                  key={`c3-${wIdx}-${cIdx}`}
                  className="inline-block text-cyan"
                  variants={letterVariants}
                  whileHover={{ 
                    y: -10, 
                    color: "#00f0ff",
                    transition: { type: "spring", stiffness: 350, damping: 10 } 
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
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
