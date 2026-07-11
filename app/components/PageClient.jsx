"use client";

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

import Navigation from './Navigation';
import Hero from './Hero';
import StatsStrip from './StatsStrip';
import WhatIBuild from './WhatIBuild';
import Projects from './Projects';
import Marquee from './Marquee';
import TechStack from './TechStack';
import Terminal from './Terminal';
import Accordions from './Accordions';
import Contact from './Contact';
import Footer from './Footer';

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Section divider — thin hairline, matches the bordered-grid minimal aesthetic
const SectionDivider = React.memo(function SectionDivider() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-16 my-4">
      <div className="h-px w-full bg-[#e8e8e8] dark:bg-white/15" />
    </div>
  );
});// Minimal boot screen — ultra-fast brand flash, no delays
function Preloader({ onComplete }) {
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { damping: 30, stiffness: 200, mass: 0.4 });
  const width = useTransform(smooth, (v) => `${v}%`);

  useEffect(() => {
    let timer;
    const startTime = Date.now();
    const duration = 2100; // 2.1 seconds loading animation time

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Organic easing: starts quick, slows down near 85%, then fills at the end
      const easedProgress = progress < 0.85
        ? Math.pow(progress / 0.85, 0.75) * 0.88
        : 0.88 + (progress - 0.85) * 0.8;
      
      const val = Math.min(100, Math.round(easedProgress * 100));
      
      raw.set(val);

      if (progress < 1) {
        timer = setTimeout(tick, 16);
      } else {
        timer = setTimeout(onComplete, 250); // 250ms pause at 100% for visual feedback
      }
    };
    timer = setTimeout(tick, 16);
    return () => clearTimeout(timer);
  }, [onComplete, raw]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -30,
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Dynamic Background Glow Aura */}
      <div className="absolute w-[400px] h-[400px] bg-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="relative flex flex-col items-center gap-6 px-6"
        exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.45, ease: "easeIn" } }}
      >
        <motion.div
          className="flex flex-col items-center gap-4 sm:gap-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated S Logo Icon */}
          <motion.div 
            className="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#0a0a0a] dark:bg-white/10 rounded-[12px] flex items-center justify-center overflow-hidden border border-white/10 dark:border-white/20 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.4)]"
            initial={{ scale: 0.8, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Pulsing overlay glow inside box */}
            <motion.div
              className="absolute inset-0 bg-cyan/15 blur-sm"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
            
            <svg
              viewBox="0 0 32 32"
              className="w-7 h-7 sm:w-8 sm:h-8 z-10 relative"
            >
              <motion.path
                d="M22 11.5C22 8.5 19.5 7 16 7C12.5 7 10 8.5 10 11.5C10 14.5 13 15.2 16 16C19 16.8 22 17.5 22 20.5C22 23 19.5 25 16 25C12.5 25 10 23 10 20.5"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, stroke: "#00c2d1" }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.1, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>

          {/* Staggered Letter Text Reveal */}
          <div className="font-semibold tracking-tight text-2xl sm:text-4xl text-[#0a0a0a] dark:text-[#f2f2f2] flex items-center overflow-hidden select-none">
            {"ShaswatHub".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.12 + index * 0.03,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Loading Progress Section */}
        <div className="flex flex-col items-center gap-3 w-[160px] sm:w-[280px] mt-4">
          <motion.div
            className="w-full h-[2px] bg-[#e8e8e8] dark:bg-white/10 rounded-full overflow-hidden relative"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          >
            <motion.div 
              className="h-full bg-cyan shadow-[0_0_8px_#00c2d1]" 
              style={{ width }} 
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const PageClient = React.memo(function PageClient() {
  const [loading, setLoading] = useState(true);

  const finishBoot = React.useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // Accessibility check
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMQ = () => {};
    mq.addEventListener("change", handleMQ, { passive: true });

    let lenis;
    let rafId;
    let handleAnchorClick;

    if (!mq.matches) {
      // Initialize Lenis smooth scroll
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.0,
      });

      // Synchronize Lenis scroll positions with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      // Tell GSAP to use Lenis requestAnimationFrame
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Route in-page anchor links (#projects, #contact, etc.) through Lenis so
      // clicking a link doesn't kick off a second, competing native smooth-scroll.
      handleAnchorClick = (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const id = anchor.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -90, duration: 1.1 });
      };
      document.addEventListener('click', handleAnchorClick);

      // Expose for components outside this effect's scope (e.g. Footer's "back to top")
      window.__lenis = lenis;
    }

    return () => {
      mq.removeEventListener("change", handleMQ);
      if (handleAnchorClick) document.removeEventListener('click', handleAnchorClick);
      if (lenis) {
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
        if (window.__lenis === lenis) window.__lenis = null;
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Handle staggered entry animations via ScrollTrigger
  useEffect(() => {
    if (loading) return;

    // Scroll reveal sections
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((section) => {
      gsap.fromTo(section,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader onComplete={finishBoot} />}
      </AnimatePresence>

      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Content wrapper */}
      <div id="main-content" className="relative w-full max-w-[100vw] overflow-x-clip bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <Navigation />
        <Hero />
        <StatsStrip />
        <WhatIBuild />
        <SectionDivider />
        <Projects />
        <Marquee />
        <TechStack />
        <Terminal />
        <SectionDivider />
        <Accordions />
        <SectionDivider />
        <Contact />
        <Footer />
      </div>
    </>
  );
});

export default PageClient;
