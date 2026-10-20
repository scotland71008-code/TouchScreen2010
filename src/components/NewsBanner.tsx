import React, { useState, useEffect } from 'react';
import OctaveLogo from './OctaveLogo';

export default function NewsBanner() {
  const [huntsvilleTime, setHuntsvilleTime] = useState('');
  const [uaeTime, setUaeTime] = useState('');
  const [gmtTime, setGmtTime] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      
      const huntsvilleString = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);

      const uaeString = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);

      const gmtString = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);

      setHuntsvilleTime(huntsvilleString);
      setUaeTime(uaeString);
      setGmtTime(gmtString);
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full relative z-30 select-none overflow-hidden bg-black/95 border-t border-sky-500/20 font-sans shadow-2xl">
      {/* LOWER THIRD BROADCAST CONTAINER - FULL WIDTH EDGE TO EDGE */}
      <div className="w-full flex items-end relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
        
        {/* 1. LEFT BOX ("OCTAVE") */}
        <div className="relative shrink-0 z-20 flex items-center justify-center bg-gradient-to-b from-[#182032] via-[#0b101d] to-[#04070e] border-t border-r border-b border-sky-500/40 px-3 md:px-5 h-13 md:h-15 shadow-2xl">
          {/* Red Accent Bar on extreme left */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 via-red-600 to-red-800" />
          
          {/* Inner Glowing "OCTAVE" Screen Frame */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-sky-400 bg-gradient-to-r from-sky-950/90 to-blue-950/90 shadow-[0_0_15px_rgba(56,189,248,0.4)] relative overflow-hidden">
            <div className="absolute inset-0 bg-sky-400/10 animate-pulse pointer-events-none" />
            <OctaveLogo variant="icon-only" iconSize={20} markColor="#38bdf8" />
            <span className="text-xs md:text-sm font-black tracking-widest text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.9)] uppercase font-mono">
              OCTAVE
            </span>
          </div>
        </div>

        {/* RIGHT SIDE (TOP RED TAB + MAIN BLUE BANNER) */}
        <div className="flex-1 flex flex-col items-end relative min-w-0">
          
          {/* 2. TOP RED RIBBON TAB (HUNTSVILLE CLOCK, UAE CLOCK & GMT CLOCK) */}
          <div className="relative z-10 self-end mr-3 md:mr-8">
            <div 
              className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white px-3.5 md:px-6 py-1 text-[10px] md:text-xs font-mono font-bold tracking-wider uppercase shadow-md flex items-center gap-2.5 md:gap-3 border-t border-r border-red-400/50"
              style={{
                clipPath: 'polygon(14px 0, 100% 0, 100% 100%, 0 100%)'
              }}
            >
              <div className="flex items-center gap-1.5 text-white drop-shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span className="text-amber-200">HUNTSVILLE:</span>
                <span className="text-white font-extrabold">{huntsvilleTime || '12:00:00'} CST</span>
              </div>

              <span className="text-red-300/80">|</span>

              <div className="flex items-center gap-1.5 text-white drop-shadow">
                <span className="text-emerald-200">UAE:</span>
                <span className="text-white font-extrabold">{uaeTime || '13:00:00'} GST</span>
              </div>

              <span className="text-red-300/80">|</span>

              <div className="flex items-center gap-1.5 text-white drop-shadow">
                <span className="text-sky-200">GMT:</span>
                <span className="text-white font-extrabold">{gmtTime || '09:00:00'} UTC</span>
              </div>
            </div>
          </div>

          {/* 3. MAIN BLUE BANNER BAR (FULL WIDTH EDGE TO EDGE) */}
          <div className="w-full relative h-11 md:h-13 bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0a192f] border-t-2 border-b border-sky-300/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-between px-3 md:px-6 overflow-hidden">
            
            {/* Glossy Reflection Highlight Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
            
            {/* Subtle Scanline Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0001_1px,transparent_1px)] [background-size:12px_100%] opacity-20 pointer-events-none" />

            {/* Main Banner Title in Running Motion (Marquee Ticker) */}
            <div className="relative z-10 flex items-center w-full overflow-hidden whitespace-nowrap">
              {/* Live Flash Badge */}
              <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-0.5 rounded bg-sky-950/90 border border-sky-400/50 mr-3 z-10 backdrop-blur-sm shadow-md">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse shrink-0" />
                <span className="text-[10px] md:text-xs font-mono font-bold text-sky-300 tracking-wider uppercase">LIVE</span>
              </div>

              {/* Running Marquee Text Track */}
              <div className="flex-1 overflow-hidden relative flex items-center">
                <div className="flex w-max animate-marquee whitespace-nowrap font-black text-xs sm:text-sm md:text-base lg:text-lg text-white tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <span className="px-6 flex items-center gap-4">
                    THE OCTAVE TEAM IS HAPPY TO HOST YOU AT THE ADIPEC EVENT! ✦ HALL 12 - STAND #12610
                    <span className="text-amber-300 text-xs font-mono">✦</span>
                  </span>
                  <span className="px-6 flex items-center gap-4">
                    THE OCTAVE TEAM IS HAPPY TO HOST YOU AT THE ADIPEC EVENT! ✦ HALL 12 - STAND #12610
                    <span className="text-amber-300 text-xs font-mono">✦</span>
                  </span>
                  <span className="px-6 flex items-center gap-4">
                    THE OCTAVE TEAM IS HAPPY TO HOST YOU AT THE ADIPEC EVENT! ✦ HALL 12 - STAND #12610
                    <span className="text-amber-300 text-xs font-mono">✦</span>
                  </span>
                  <span className="px-6 flex items-center gap-4">
                    THE OCTAVE TEAM IS HAPPY TO HOST YOU AT THE ADIPEC EVENT! ✦ HALL 12 - STAND #12610
                    <span className="text-amber-300 text-xs font-mono">✦</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Live Signal Red Dot (Right Top Edge of Blue Bar) */}
            <div className="absolute top-2 right-3 md:right-5 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-ping pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  );
}
