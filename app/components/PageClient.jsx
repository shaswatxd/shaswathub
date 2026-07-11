"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
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

// Lightweight CSS background (no WebGL) — used as fallback when WebGL is unavailable
// or the user prefers reduced motion. Deferred favicon animation loads the same way.
const CyberBackground = dynamic(() => import('./CyberBackground'), { ssr: false });
// Premium WebGL background — heavy (three.js + postprocessing), so it's code-split
// and only ever mounted client-side after a capability check.
const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false });
const AnimatedFavicon = dynamic(() => import('./AnimatedFavicon'), { ssr: false });

// One-time, cheap WebGL support probe (mirrors the standard Modernizr-style check)
function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

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

// Cinematic branded boot animation
function Preloader({ onComplete }) {
  const [display, setDisplay] = useState(0);

  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { damping: 26, stiffness: 180, mass: 0.5 });
  const width = useTransform(smooth, (v) => `${v}%`);
  const glow = useTransform(smooth, [0, 100], [0.3, 1]);

  const status = display < 35
    ? "Initializing console"
    : display < 70
      ? "Loading WebGL grid"
      : display < 99
        ? "Syncing motion engine"
        : "Ready";

  useEffect(() => {
    const unsub = smooth.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [smooth]);

  useEffect(() => {
    let timer;
    let val = 0;
    const tick = () => {
      val = Math.min(val + Math.random() * 12 + 10, 100);
      raw.set(val);
      if (val >= 100) {
        timer = setTimeout(onComplete, 160);
        return;
      }
      timer = setTimeout(tick, 28);
    };
    timer = setTimeout(tick, 28);
    return () => clearTimeout(timer);
  }, [onComplete, raw]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020204] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 46%, rgba(0,240,255,0.10), transparent 55%)" }}
      />
      {/* Drifting cyber grid */}
      <div aria-hidden className="preloader-grid" />
      <div className="preloader-scanline" />

      <div className="relative flex flex-col items-center gap-9 px-6">
        {/* Logo lockup */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="preloader-dot"
            animate={{ scale: [1, 1.4, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="font-display font-bold uppercase text-2xl sm:text-4xl tracking-[6px] text-[#e8edf8]">
            SHASWAT<span className="preloader-grad">HUB</span>
          </div>
        </motion.div>

        {/* Status line */}
        <div className="h-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              className="font-mono text-[10px] sm:text-[11px] tracking-[4px] uppercase text-[#8895b0]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {status}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <motion.div
          className="w-[220px] sm:w-[300px] flex flex-col gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="h-[3px] w-full rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width,
                opacity: glow,
                background: "linear-gradient(90deg,#00f0ff,#8b6bff,#ff3d9a)",
                boxShadow: "0 0 12px rgba(0,240,255,0.6)",
              }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] tracking-[2px] text-[#8895b0]/70 uppercase">
            <span>Booting</span>
            <span className="tabular-nums">{display}%</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const PageClient = React.memo(function PageClient() {
  const [loading, setLoading] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [webglOk, setWebglOk] = useState(false);
  // Scene3D's WebGL init (shader compilation for the glass material + bloom pass) is
  // heavy enough to steal main-thread frames from Hero's word-stagger entrance if they
  // run at the same moment — the text would visibly snap in instead of animating.
  // Mounting the 3D canvas only once Hero's own reveal has had time to finish keeps
  // the two from competing for the same frames.
  const [show3D, setShow3D] = useState(false);
  // Normalized pointer position for the 3D scene's camera parallax. Kept in a ref (not
  // state) so mousemove never triggers a React re-render — the R3F scene reads it
  // directly inside its own useFrame loop.
  const scenePointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setWebglOk(detectWebGL());
  }, []);

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

  // Wait out Hero's entrance animation (delayChildren 0.4s + staggered word reveals,
  // finishes well under 1.2s) before compiling the 3D scene's shaders.
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setShow3D(true), 1200);
    return () => clearTimeout(t);
  }, [loading]);

  // Mouse coordinates using MotionValues for GPU accelerated mouse glow
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const [cursorHover, setCursorHover] = useState(false);

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
      // Normalize to [-1, 1] for the 3D scene's camera parallax
      scenePointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      scenePointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Grow the glow when hovering any interactive element
    const handleOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea')) setCursorHover(true);
    };
    const handleOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea')) setCursorHover(false);
    };
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mouseout', handleOut, { passive: true });

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
      if (handleAnchorClick) document.removeEventListener('click', handleAnchorClick);
      if (lenis) {
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
        if (window.__lenis === lenis) window.__lenis = null;
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
        {loading && <Preloader onComplete={finishBoot} />}
      </AnimatePresence>

      <AnimatedFavicon prefersReduced={prefersReduced} />

      {/* Premium WebGL background when supported + motion is welcome; otherwise (or while
          waiting for Hero's entrance animation to clear) the lightweight CSS background carries it */}
      {webglOk && !prefersReduced && show3D ? (
        <Scene3D pointerRef={scenePointerRef} />
      ) : (
        <CyberBackground prefersReduced={prefersReduced} />
      )}

      {/* Mouse cursor glow background asset — grows on hover of interactive elements */}
      {!prefersReduced && (
        <motion.div
          className="cursor-follower hidden md:block"
          animate={{ scale: cursorHover ? 1.6 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%"
          }}
        />
      )}

      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Content wrapper */}
      <div id="main-content" className="relative z-10 w-full max-w-[100vw] overflow-x-clip">
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