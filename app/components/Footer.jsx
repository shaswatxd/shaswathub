"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Footer = React.memo(function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.footer
      className="relative border-t border-[#0a0a0a] dark:border-white/15 px-6 lg:px-16 py-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Tagline */}
        <div className="text-center md:text-left">
          <motion.div 
            className="flex items-center gap-2.5 justify-center md:justify-start mb-1.5 select-none group cursor-default"
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
            <span className="font-semibold text-sm text-[#0a0a0a] dark:text-[#f2f2f2]">ShaswatHub</span>
          </motion.div>
          <div className="font-mono text-[9px] text-[#999] dark:text-[#777] tracking-wide">// Building things that matter, one commit at a time.</div>
        </div>



        {/* Contact Links & Back to Top */}
        <div className="flex flex-col items-center md:items-end gap-2.5">
          <a
            href="mailto:srijankumardeo777@gmail.com"
            className="font-mono text-[10px] text-[#666] dark:text-[#999] hover:text-cyan transition-colors duration-200"
          >
            srijankumardeo777@gmail.com
          </a>

          <button
            onClick={handleScrollTop}
            className="font-mono text-[9px] text-[#666] dark:text-[#999] hover:text-[#0a0a0a] dark:hover:text-[#f2f2f2] transition-colors duration-200 flex items-center gap-1 group cursor-pointer"
          >
            RETURN_TO_TOP <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>
      </div>

      {/* Copyright lines */}
      <div className="max-w-[1440px] mx-auto mt-8 pt-6 border-t border-[#e8e8e8] dark:border-white/10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        <div className="font-mono text-[9px] text-[#999] dark:text-[#777]">
          &copy; {currentYear} &middot; developed with &hearts; &amp; chai &middot; ShaswatHub shell.
        </div>
        <div className="font-mono text-[8px] text-[#bbb] dark:text-[#555] tracking-wider">
          SYSTEM_VERSION_4.2.0_SECURE
        </div>
      </div>
    </motion.footer>
  );
});

export default Footer;
