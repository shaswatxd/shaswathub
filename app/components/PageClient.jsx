"use client";

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

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

// Dynamically load R3F Scene to ensure it works on the client and is optimized
const Scene3D = dynamic(() => import('../../src/components/Scene3D'), { ssr: false });
const AnimatedFavicon = dynamic(() => import('./AnimatedFavicon'), { ssr: false });

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Section divider with elegant grid lines
const SectionDivider = React.memo(function SectionDivider() {
  return (
    <div className="max-w-[1480px] mx-auto px-8 my-10 md:my-16 opacity-30">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent animate-glow-pulse" />
    </div>
  );
});

// Boot Terminal Preloader Component
function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  
  const logs = useMemo(() => [
    "[BOOT] Initializing ShaswatHub terminal v4.2.0...",
    "[CORE] Loading WebGL rendering pipelines...",
    "[SYS] Calibrating 3D digital wireframe grid...",
    "[SYS] Loading assets: materials, vectors, shaders...",
    "[ANIM] Synced GSAP + Lenis scroll controllers...",
    "[SEC] Establishing secure sandbox environment...",
    "[OK] Systems nominal. Booting user interface..."
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 550);
          return 100;
        }
        const diff = Math.random() * 9 + 4;
        return Math.min(prev + diff, 100);
      });
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const targetIdx = Math.min(Math.floor((progress / 100) * logs.length), logs.length - 1);
    if (targetIdx > logIndex) {
      setLogIndex(targetIdx);
    }
  }, [progress, logIndex, logs.length]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#020204] z-[99999] flex flex-col items-center justify-center font-mono text-xs px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="preloader-scanline" />
      <div className="w-full max-w-[460px]">
        {/* Terminal Header */}
        <div className="border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 rounded-t-xl flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[10px] text-[#8895b0]">shaswat-hub-bootloader.sh</span>
        </div>
        
        {/* Terminal Body */}
        <div className="border-x border-b border-white/[0.08] bg-[#05070f]/90 p-6 rounded-b-xl min-h-[170px] flex flex-col justify-between">
          <div className="space-y-1.5 text-[#8895b0] text-[10px] sm:text-xs">
            {logs.slice(0, logIndex + 1).map((log, i) => (
              <div key={i} className={i === logIndex ? "text-[#00f0ff] font-medium" : ""}>
                {log}
              </div>
            ))}
          </div>
          
          {/* Progress Section */}
          <div className="mt-8">
            <div className="flex justify-between font-mono text-[10px] text-[#8895b0] mb-2">
              <span>LOADING NEURAL NETWORK...</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00f0ff] via-[#8b6bff] to-[#ff3d9a]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const PageClient = React.memo(function PageClient() {
  const [loading, setLoading] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Mouse coordinates using MotionValues for GPU accelerated mouse glow
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  
  // Custom spring configurations for smooth mouse-follow glow
  const springConfig = { damping: 45, stiffness: 350, mass: 0.45 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Accessibility check
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handleMQ = (e) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handleMQ, { passive: true });

    // Track mouse movement
    const handleMouseMove = (e) => {
      if (mq.matches) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lenis;
    let rafId;

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
    }

    return () => {
      mq.removeEventListener("change", handleMQ);
      window.removeEventListener('mousemove', handleMouseMove);
      if (lenis) {
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

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
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <AnimatedFavicon prefersReduced={prefersReduced} />
      
      {/* 3D Interactive Cyber Grid */}
      <Scene3D prefersReduced={prefersReduced} />

      {/* Mouse cursor glow background asset */}
      {!prefersReduced && (
        <motion.div
          className="cursor-follower hidden md:block"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%"
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-[100vw] overflow-x-clip">
        <Navigation />
        <Hero />
        <StatsStrip />
        <SectionDivider />
        <WhatIBuild />
        <SectionDivider />
        <Projects />
        <Marquee />
        <SectionDivider />
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