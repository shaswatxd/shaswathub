"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { href: '#builds', label: 'Builds' },
  { href: '#projects', label: 'Projects' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
];

const Navigation = React.memo(function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route-internal navigation or resize past mobile breakpoint
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 90) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section observer to update active indicator
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    LINKS.forEach((link) => {
      const id = link.href.substring(1);
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Reset indicator if at the top of the page
    const handleTopReset = () => {
      if (window.scrollY < 150) {
        setActiveSection("");
      }
    };
    window.addEventListener('scroll', handleTopReset, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleTopReset);
    };
  }, []);

  return (
    <motion.nav
      className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-6 md:px-12 py-3.5 transition-all duration-300 border-b glass-panel"
      style={{
        backgroundColor: scrolled ? 'rgba(5, 7, 15, 0.75)' : 'rgba(5, 7, 15, 0.15)',
        borderColor: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
        boxShadow: scrolled ? '0 15px 30px -15px rgba(0, 0, 0, 0.5)' : 'none',
      }}
      initial={{ opacity: 0, y: -30 }}
      animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <a 
        href="#" 
        className="flex items-center gap-2.5 font-display font-bold text-sm tracking-widest text-[#e8edf8] uppercase select-none group"
      >
        <span
          className="w-2 h-2 rounded-full nav-active-glow transition-all duration-300 group-hover:scale-125"
          style={{
            backgroundColor: '#00f0ff',
          }}
        />
        <span>
          SHASWAT
          <span style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            HUB
          </span>
        </span>
      </a>

      {/* Center Links (Sliding Pill Highlight) */}
      <div className="hidden md:flex items-center gap-2">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="relative font-mono text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg transition-all duration-300"
          >
            <span className={`relative z-10 transition-colors duration-300 ${activeSection === link.href ? 'text-[#00f0ff] font-bold glow-cyan' : 'text-[#8895b0] hover:text-[#e8edf8]'}`}>
              {link.label}
            </span>
            {activeSection === link.href && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute inset-0 bg-white/[0.03] border border-white/[0.08] rounded-lg z-0"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
          </a>
        ))}
      </div>

      {/* Profile + Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/shaswatxd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full border overflow-hidden w-[36px] h-[36px] transition-all duration-300 hover:scale-105 hover:rotate-6"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00f0ff';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0,240,255,0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="GitHub Profile"
        >
          <Image
            src="/avatar.png"
            alt="GitHub Profile"
            width={36}
            height={36}
            className="w-full h-full object-cover"
            priority
          />
        </a>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden relative flex items-center justify-center w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#e8edf8] transition-colors duration-300 hover:border-[#00f0ff]/50"
        >
          <span className="relative w-4 h-3 flex flex-col justify-between">
            <motion.span
              className="block h-[1.5px] w-full bg-current rounded-full"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5.5 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            />
            <motion.span
              className="block h-[1.5px] w-full bg-current rounded-full"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-[1.5px] w-full bg-current rounded-full"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5.5 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            />
          </span>
        </button>
      </div>

      {/* Mobile Nav Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-panel"
            className="md:hidden absolute top-full inset-x-0 mt-2 mx-4 rounded-2xl border border-white/[0.08] glass-panel overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col p-2">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`font-mono text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-colors duration-200 ${activeSection === link.href ? 'text-[#00f0ff] bg-white/[0.04]' : 'text-[#8895b0] hover:text-[#e8edf8] hover:bg-white/[0.02]'}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
});

export default Navigation;
