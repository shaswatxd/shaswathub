"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const Scene3D = dynamic(() => import('../../src/components/Scene3D'), { ssr: false });
const AnimatedFavicon = dynamic(() => import('./AnimatedFavicon'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const SectionDivider = React.memo(function SectionDivider() {
  return <div className="max-w-[1480px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent my-16 opacity-40 animate-glow-pulse" />;
});

const PageClient = React.memo(function PageClient() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const parallaxRef = useRef(0);
  const parallaxTarget = useRef(0);
  const glowRef = useRef(null);
  const glowSecRef = useRef(null);
  const rafRef = useRef(null);

  const lerp = useCallback((a, b, t) => a + (b - a) * t, []);

  const tick = useCallback(() => {
    parallaxRef.current = lerp(parallaxRef.current, parallaxTarget.current, 0.08);
    const px = parallaxRef.current;
    if (glowRef.current) {
      glowRef.current.style.transform = `translate3d(calc(-50% + ${px}px), 0, 0)`;
    }
    if (glowSecRef.current) {
      glowSecRef.current.style.transform = `translate3d(calc(-50% + ${-px * 0.5}px), 0, 0)`;
    }
    if (Math.abs(parallaxRef.current - parallaxTarget.current) > 0.05) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
    }
  }, [lerp]);

  const handleMouse = useCallback((e) => {
    parallaxTarget.current = (e.clientX / window.innerWidth - 0.5) * 40;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handleMQ = (e) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handleMQ);

    if (window.innerWidth >= 768) {
      window.addEventListener("mousemove", handleMouse, { passive: true });
    }

    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((sec) => {
      gsap.fromTo(sec,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    return () => {
      mq.removeEventListener("change", handleMQ);
      window.removeEventListener("mousemove", handleMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [handleMouse]);

  return (
    <>
      <AnimatedFavicon prefersReduced={prefersReduced} />
      <Scene3D prefersReduced={prefersReduced} />

      <div className="fixed inset-0 bg-gradient-to-b from-[#060810]/10 via-[#060810]/50 to-[#060810]/95 pointer-events-none z-[1]" />
      <div ref={glowRef} className="fixed top-[-25%] left-1/2 w-[90vw] md:w-[1100px] h-[50vh] md:h-[700px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.07)_0%,rgba(0,240,255,0.04)_15%,rgba(139,107,255,0.03)_30%,rgba(139,107,255,0.01)_50%,transparent_65%)] pointer-events-none z-[1] will-change-transform" />
      <div ref={glowSecRef} className="fixed top-[30%] left-1/2 w-[80vw] md:w-[700px] h-[40vh] md:h-[500px] bg-[radial-gradient(ellipse,rgba(255,61,154,0.05)_0%,rgba(139,107,255,0.02)_30%,transparent_60%)] pointer-events-none z-[1] will-change-transform" />

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