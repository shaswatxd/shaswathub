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
});

// Minimal boot screen — ultra-fast brand flash, no delays
function Preloader({ onComplete }) {
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { damping: 30, stiffness: 200, mass: 0.4 });
  const width = useTransform(smooth, (v) => `${v}%`);

  useEffect(() => {
    let timer;
    let val = 0;
    const tick = () => {
      val = Math.min(val + Math.random() * 25 + 20, 100);
      raw.set(val);
      if (val >= 100) {
        timer = setTimeout(onComplete, 80);
        return;
      }
      timer = setTimeout(tick, 16);
    };
    timer = setTimeout(tick, 16);
    return () => clearTimeout(timer);
  }, [onComplete, raw]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="relative flex flex-col items-center gap-6 px-6">
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="w-2 h-2 bg-cyan rounded-full" />
          <div className="font-semibold tracking-tight text-xl sm:text-2xl text-[#0a0a0a] dark:text-[#f2f2f2]">
            SHASWATHUB
          </div>
        </motion.div>

        <motion.div
          className="w-[180px] sm:w-[240px] h-px bg-[#e8e8e8] dark:bg-white/15 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <motion.div className="h-full bg-cyan" style={{ width }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

const PageClient = React.memo(function PageClient() {
  const [loading, setLoading] = useState(true);

  // Skip the boot preloader if it already played this session (instant load on repeat visits)
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("booted") === "1") {
      setLoading(false);
    }
  }, []);

  const finishBoot = React.useCallback(() => {
    if (typeof window !== "undefined") sessionStorage.setItem("booted", "1");
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
