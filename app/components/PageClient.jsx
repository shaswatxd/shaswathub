"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';

import Navigation from './Navigation';
import Hero from './Hero';
import StatsStrip from './StatsStrip';
import WhatIBuild from './WhatIBuild';
import Projects from './Projects';
import Marquee from './Marquee';
import TechStack from './TechStack';
import Terminal from './Terminal';
import Contact from './Contact';
import Footer from './Footer';

const AnimatedFavicon = dynamic(() => import('./AnimatedFavicon'), { ssr: false });

const SectionDivider = React.memo(function SectionDivider() {
  return <div className="max-w-[1480px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent my-16 opacity-40 animate-glow-pulse" />;
});

const PageClient = React.memo(function PageClient() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mq.matches;
    setPrefersReduced(reduced);
    const handleMQ = (e) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handleMQ);

    let lenis;
    let rafId;
    if (!reduced) {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.0,
      });
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const sections = gsap.utils.toArray('.animate-section');
    gsap.fromTo(sections,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
      }
    );

    return () => {
      mq.removeEventListener("change", handleMQ);
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <AnimatedFavicon prefersReduced={prefersReduced} />
      {/* Premium Cyber Grid Background (Lag-Free alternative to 3D Scene) */}
      <div className="fixed inset-0 z-0 bg-[#030303] overflow-hidden pointer-events-none">
        {/* Subtle grid pattern with fading mask */}
        <div 
          className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{
            maskImage: 'radial-gradient(ellipse 65% 55% at 50% 0%, #000 35%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 0%, #000 35%, transparent 100%)',
          }}
        />
        {/* Premium laser glow accents */}
        <div className="absolute top-[35vh] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/12 to-transparent" />
        <div className="absolute top-[70vh] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8b6bff]/8 to-transparent" />
      </div>

      <div className="fixed inset-0 bg-gradient-to-b from-[#060810]/10 via-[#060810]/50 to-[#060810]/95 pointer-events-none z-[1]" />
      <div className="fixed top-[-25%] left-1/2 -translate-x-1/2 w-[90vw] md:w-[1100px] h-[50vh] md:h-[700px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.07)_0%,rgba(0,240,255,0.04)_15%,rgba(139,107,255,0.03)_30%,rgba(139,107,255,0.01)_50%,transparent_65%)] pointer-events-none z-[1]" />
      <div className="fixed top-[30%] left-1/2 -translate-x-1/2 w-[80vw] md:w-[700px] h-[40vh] md:h-[500px] bg-[radial-gradient(ellipse,rgba(255,61,154,0.05)_0%,rgba(139,107,255,0.02)_30%,transparent_60%)] pointer-events-none z-[1]" />
      {/* Bottom Ambient Glow (Lag-free color animation) */}
      <div className="fixed bottom-[-15%] left-1/2 -translate-x-1/2 w-[95vw] md:w-[1000px] h-[40vh] md:h-[600px] bg-[radial-gradient(ellipse,rgba(255,61,154,0.08)_0%,rgba(139,107,255,0.05)_25%,rgba(0,240,255,0.02)_50%,transparent_70%)] pointer-events-none z-[1] animate-ambient-glow will-change-transform" />

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
        <Contact />
        <Footer />
      </div>
    </>
  );
});

export default PageClient;