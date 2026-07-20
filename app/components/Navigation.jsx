"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { href: '#builds', label: 'Builds' },
  { href: '#projects', label: 'Projects' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
];

const letterVariants1 = {
  initial: { y: 0 },
  hover: { y: "-100%" }
};

const letterVariants2 = {
  initial: { y: "100%" },
  hover: { y: 0 }
};

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
      className="sticky top-0 z-[100] bg-white dark:bg-[#0a0a0a] border-b border-[#0a0a0a] dark:border-white/15 transition-colors duration-300"
      style={{ boxShadow: scrolled ? '0 8px 24px -18px rgba(0,0,0,0.35)' : 'none' }}
      initial={{ opacity: 0, y: -30 }}
      animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="#" 
          className="flex items-center gap-2.5 select-none group"
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          {/* Animated S Logo Icon */}
          <div className="relative w-7 h-7 bg-[#0a0a0a] dark:bg-white/10 rounded-[6px] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3">
            <motion.svg
              viewBox="0 0 32 32"
              className="w-4 h-4"
            >
              <motion.path
                d="M22 11.5C22 8.5 19.5 7 16 7C12.5 7 10 8.5 10 11.5C10 14.5 13 15.2 16 16C19 16.8 22 17.5 22 20.5C22 23 19.5 25 16 25C12.5 25 10 23 10 20.5"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  initial: { pathLength: 0, stroke: "#00c2d1", filter: "drop-shadow(0 0 0px rgba(0,194,209,0))" },
                  animate: { pathLength: 1, transition: { duration: 1.2, ease: "easeInOut" } },
                  hover: { 
                    pathLength: [0, 1],
                    stroke: "#00f0ff",
                    filter: "drop-shadow(0 0 6px rgba(0,240,255,0.85))",
                    transition: { 
                      pathLength: { duration: 0.6, ease: "easeInOut" },
                      stroke: { duration: 0.2 },
                      filter: { duration: 0.2 }
                    }
                  }
                }}
              />
            </motion.svg>
          </div>
          <span className="font-semibold tracking-tight text-base text-[#0a0a0a] dark:text-[#f2f2f2] flex overflow-hidden h-[1.5em] items-center">
            {"ShaswatHub".split("").map((char, i) => (
              <span key={i} className="relative inline-block overflow-hidden h-[1.2em]">
                <motion.span
                  variants={letterVariants1}
                  className="inline-block"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
                >
                  {char}
                </motion.span>
                <motion.span
                  variants={letterVariants2}
                  className="absolute left-0 top-0 inline-block text-cyan"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </span>
        </motion.a>

        {/* Center Links (underline hover) */}
        <div className="hidden md:flex items-center gap-12 font-mono text-[11px] tracking-[0.12em] uppercase text-[#0a0a0a] dark:text-[#f2f2f2]">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-active={activeSection === link.href}
              className={`nav-link ${activeSection === link.href ? 'text-cyan font-semibold' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Theme Toggle + GitHub Profile */}
        <div className="flex items-center gap-3.5">
          <ThemeToggle className="rounded-full w-10 h-10 border border-[#0a0a0a]/20 dark:border-white/25 hover:border-cyan hover:text-cyan transition-all duration-200 shadow-sm" />
          <a
            href="https://github.com/shaswatxd"
            target="_blank"
            rel="noopener noreferrer"
            className="github-avatar-link"
            title="GitHub Profile"
          >
            <Image src="/avatar.png" alt="GitHub" width={46} height={46} className="github-avatar-img" priority />
          </a>
        </div>
      </div>

      {/* Mobile Nav Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-panel"
            className="md:hidden border-t border-[#e8e8e8] dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col px-6">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`font-mono text-xs tracking-wider uppercase py-4 border-b border-[#f0f0f0] dark:border-white/10 last:border-b-0 transition-colors duration-200 ${activeSection === link.href ? 'text-cyan font-semibold' : 'text-[#0a0a0a] dark:text-[#f2f2f2] hover:text-cyan'}`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/shaswatxd"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 font-mono text-xs tracking-wider uppercase py-4 border-b border-[#f0f0f0] dark:border-white/10 last:border-b-0 text-[#0a0a0a] dark:text-[#f2f2f2] hover:text-cyan transition-colors duration-200"
              >
                <Image src="/avatar.png" alt="" width={20} height={20} className="w-5 h-5 rounded-full object-cover" />
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
});

export default Navigation;
