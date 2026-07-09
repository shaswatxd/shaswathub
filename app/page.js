"use client";

import dynamic from 'next/dynamic';

// Dynamic import with custom loading fallback
const PageClient = dynamic(
  () => import('./components/PageClient'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#020204] flex flex-col items-center justify-center font-sans z-[99999] select-none">
        {/* Glowing pulsing logo container */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5 font-bold text-xl sm:text-2xl tracking-[4px] text-[#e8edf8] uppercase animate-pulse">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ 
                backgroundColor: '#00f0ff', 
                boxShadow: '0 0 12px #00f0ff, 0 0 24px #00f0ff' 
              }} 
            />
            <span>
              SHASWAT
              <span style={{ backgroundImage: 'linear-gradient(to right, #00f0ff, #8b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                HUB
              </span>
            </span>
          </div>
          <div className="font-mono text-[9px] text-[#8895b0]/60 tracking-[3px] uppercase animate-pulse" style={{ animationDelay: '0.2s' }}>
            [CONNECTING_CONSOLE...]
          </div>
        </div>
      </div>
    )
  }
);

export default function Page() {
  return <PageClient />;
}
