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
  const title2 = "Building, Shipping, Breaking.".split(" ");

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
      className="relative z-10 px-6 py-[14vh] md:py-[18vh] text-center flex flex-col items-center justify-center min-h-[85vh]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Console Badge */}
      <motion.div 
        className="font-mono text-[9px] sm:text-[10px] text-[#00f0ff] tracking-[3px] sm:tracking-[4.5px] uppercase mb-7 flex items-center justify-center gap-3 select-none"
        variants={itemVariants}
      >
        <span className="w-[20px] sm:w-[35px] h-[1px] bg-gradient-to-r from-transparent to-[#00f0ff]" />
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-custom"
          style={{ backgroundColor: '#00f0ff', boxShadow: '0 0 10px #00f0ff' }}
        />
        ShaswatHub · Dev Console
        <span className="w-[20px] sm:w-[35px] h-[1px] bg-gradient-to-l from-transparent to-[#00f0ff]" />
      </motion.div>

      {/* Main Heading with Word-by-Word Animation */}
      <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-[80px] tracking-[-1.5px] sm:tracking-[-2.5px] leading-[1.05] text-[#e8edf8] mb-6 max-w-[950px]">
        <div className="flex flex-wrap justify-center gap-x-3.5 overflow-hidden py-1">
          {title1.map((word, i) => (
            <motion.span key={i} className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-3.5 overflow-hidden py-1">
          {title2.map((word, i) => (
            <motion.span 
              key={i} 
              className="inline-block" 
              variants={wordVariants}
              style={{
                backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff, #ff3d9a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </h1>

      {/* Subtext description */}
      <motion.p 
        className="max-w-[620px] mx-auto text-[#8895b0] text-sm sm:text-base leading-relaxed mb-11 px-4"
        variants={itemVariants}
      >
        A live index of projects, repos, and experiments — from <b className="text-[#e8edf8] font-semibold glow-cyan">desktop apps</b> to <b className="text-[#e8edf8] font-semibold glow-violet">web tools</b>. Updated as things ship, not as a resume.
      </motion.p>

      {/* CTA Buttons with Magnetic wraps and click ripples */}
      <motion.div 
        className="flex items-center justify-center gap-5 max-w-[320px] sm:max-w-none w-full mx-auto flex-col sm:flex-row px-4"
        variants={itemVariants}
      >
        <MagneticButton>
          <a
            href="#projects"
            onClick={triggerRipple}
            className="ripple-container w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display text-[13px] font-bold px-8 py-4 rounded-xl text-[#020204] transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #8b6bff)',
              boxShadow: '0 0 25px rgba(0,240,255,0.28)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 35px rgba(0,240,255,0.45)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(0,240,255,0.28)'}
          >
            <span>Explore Projects</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </MagneticButton>

        <MagneticButton>
          <a 
            href="#contact" 
            onClick={triggerRipple}
            className="ripple-container w-full sm:w-auto inline-flex items-center justify-center font-display text-[13px] font-bold px-8 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-violet/60 text-[#e8edf8] hover:bg-white/[0.06] transition-all duration-300 hover:scale-[1.03]"
          >
            <span>Get In Touch</span>
          </a>
        </MagneticButton>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="flex flex-col items-center gap-2.5 mt-16 select-none"
        variants={itemVariants}
      >
        <div className="w-6 h-[38px] rounded-xl border-2 border-white/[0.12] flex justify-center py-1">
          <div 
            className="w-[3px] h-2.5 rounded-full animate-scroll-bounce" 
            style={{ backgroundColor: '#00f0ff', boxShadow: '0 0 5px #00f0ff' }} 
          />
        </div>
        <span className="font-mono text-[9px] tracking-[2.5px] uppercase text-[#8895b0]/50">Scroll to explore</span>
      </motion.div>
    </motion.header>
  );
});

export default Hero;
