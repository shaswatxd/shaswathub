"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('../../src/components/Scene3D'), { ssr: false });
const AnimatedFavicon = dynamic(() => import('./AnimatedFavicon'), { ssr: false });

const Navigation = lazy(() => import('./Navigation'));
const Hero = lazy(() => import('./Hero'));
const StatsStrip = lazy(() => import('./StatsStrip'));
const WhatIBuild = lazy(() => import('./WhatIBuild'));
const Projects = lazy(() => import('./Projects'));
const Marquee = lazy(() => import('./Marquee'));
const TechStack = lazy(() => import('./TechStack'));
const Terminal = lazy(() => import('./Terminal'));
const Contact = lazy(() => import('./Contact'));
const Footer = lazy(() => import('./Footer'));

gsap.registerPlugin(ScrollTrigger);

function SectionDivider() {
  return <div className="max-w-[1480px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent my-16 opacity-40 animate-glow-pulse" />;
}

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,240,255,0.3)', borderTopColor: '#00f0ff' }} />
    </div>
  );
}

export default function PageClient() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const parallaxRef = useRef(0);
  const parallaxTarget = useRef(0);
  const glowRef = useRef(null);
  const glowSecRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handleMQ = (e) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handleMQ);

    const lerp = (a, b, t) => a + (b - a) * t;
    let running = false;
    const tick = () => {
      parallaxRef.current = lerp(parallaxRef.current, parallaxTarget.current, 0.045);
      const px = parallaxRef.current;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(calc(-50% + ${px}px), 0, 0)`;
      }
      if (glowSecRef.current) {
        glowSecRef.current.style.transform = `translate3d(calc(-50% + ${-px * 0.5}px), 0, 0)`;
      }
      if (Math.abs(parallaxRef.current - parallaxTarget.current) > 0.02) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const handleMouse = (e) => {
      parallaxTarget.current = (e.clientX / window.innerWidth - 0.5) * 40;
      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });

    // GSAP ScrollTrigger Section Transitions with smoother easing
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((sec, i) => {
      gsap.fromTo(sec,
        { opacity: 0, y: 40, willChange: 'transform, opacity' },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: i * 0.03,
          ease: 'power4.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: sec,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    gsap.fromTo('.terminal-block',
      { opacity: 0, y: 50, scale: 0.97, willChange: 'transform, opacity' },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: 'power4.out',
        clearProps: 'willChange',
        scrollTrigger: {
          trigger: '.terminal-block',
          start: 'top 88%',
        }
      }
    );

    return () => {
      mq.removeEventListener("change", handleMQ);
      window.removeEventListener("mousemove", handleMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      <AnimatedFavicon prefersReduced={prefersReduced} />
      <Scene3D prefersReduced={prefersReduced} />

      <div className="fixed inset-0 bg-gradient-to-b from-[#060810]/10 via-[#060810]/50 to-[#060810]/95 pointer-events-none z-[1] will-change-[opacity] transform-gpu" />
      <div ref={glowRef} className="fixed top-[-25%] left-1/2 w-[1100px] h-[700px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.07)_0%,rgba(0,240,255,0.04)_15%,rgba(139,107,255,0.03)_30%,rgba(139,107,255,0.01)_50%,transparent_65%)] pointer-events-none z-[1] will-change-transform transform-gpu" />
      <div ref={glowSecRef} className="fixed top-[30%] left-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(255,61,154,0.05)_0%,rgba(139,107,255,0.02)_30%,transparent_60%)] pointer-events-none z-[1] will-change-transform transform-gpu" />

      <div className="relative z-10 w-full max-w-[100vw] transform-gpu">
        <Suspense fallback={<SectionLoader />}>
          <Navigation />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Hero />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <StatsStrip />
        </Suspense>

        <SectionDivider />

        <Suspense fallback={<SectionLoader />}>
          <WhatIBuild />
        </Suspense>

        <SectionDivider />

        <Suspense fallback={<SectionLoader />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Marquee />
        </Suspense>

        <SectionDivider />

        <Suspense fallback={<SectionLoader />}>
          <TechStack />
        </Suspense>

        <div className="terminal-block">
          <Suspense fallback={<SectionLoader />}>
            <Terminal />
          </Suspense>
        </div>

        <SectionDivider />

        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </ReactLenis>
  );
}
