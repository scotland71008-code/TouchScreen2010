import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OctaveLogo from './OctaveLogo';

interface TimelineEvent {
  year: string;
  era: string;
  title: string;
  highlightsTop: string[];
  highlightsBottom: string[];
  description: string;
  icon: string;
  keyInnovations: string[];
  color: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '1969',
    era: 'FOUNDATION',
    title: 'Pioneering Computer-Aided Engineering',
    highlightsTop: [],
    highlightsBottom: ['Founding', 'Built first interactive CAD system'],
    description: 'Pioneered the very first interactive computer-aided design (CAD) software, revolutionizing draftsmanship and industrial spatial design.',
    icon: 'Box',
    keyInnovations: ['First interactive graphical CAD engine', 'Precision vector drafting', 'Early mainframe engineering graphics'],
    color: 'from-blue-500 to-cyan-400'
  },
  {
    year: '1980s',
    era: 'SCALE',
    title: 'Global CAD Leadership & 3D Expansion',
    highlightsTop: ['Global CAD leader', 'Expansion into 3D engineering'],
    highlightsBottom: [],
    description: 'Expanded globally to become the premier 3D plant engineering and spatial modeling provider for process plants, refineries, and offshore structures.',
    icon: 'Maximize2',
    keyInnovations: ['3D plant modeling engines', 'Piping isometric generation', 'Clash detection software'],
    color: 'from-cyan-400 to-teal-400'
  },
  {
    year: 'Late 80s-90s',
    era: 'ENTERPRISE',
    title: 'Networked Computing & Enterprise Adoption',
    highlightsTop: [],
    highlightsBottom: ['Networked computing shift', 'Enterprise-scale adoption'],
    description: 'Shifted from isolated workstations to enterprise-networked computing environments, enabling multi-discipline design teams across global shipyards and engineering firms.',
    icon: 'Network',
    keyInnovations: ['Multi-user design databases', 'Client-server plant design', 'Automated schematic drafting'],
    color: 'from-emerald-400 to-green-500'
  },
  {
    year: 'Late 90s',
    era: 'DATA SHIFT',
    title: 'Data-Centric Engineering & Geospatial',
    highlightsTop: ['Data-centric engineering', 'Early geospatial + mobility innovations'],
    highlightsBottom: [],
    description: 'Transitioned from purely visual CAD graphics to intelligent tag-driven data modeling, uniting spatial design with GIS mapping and early field mobility.',
    icon: 'Database',
    keyInnovations: ['Tag-centric relational databases', 'Geospatial mapping (MGE/GeoMedia)', 'Early mobile inspection tools'],
    color: 'from-amber-400 to-yellow-500'
  },
  {
    year: '2003-2011',
    era: 'INTEGRATION',
    title: 'Integrated Digital Twin & Full Lifecycle',
    highlightsTop: [],
    highlightsBottom: ['Launch of data-centric modeling', 'Full lifecycle solutions expansion'],
    description: 'Launched next-generation data-centric modeling (SmartPlant / SDx architecture), extending solutions across capital construction and operational handovers.',
    icon: 'FolderGit',
    keyInnovations: ['Integrated engineering registers (SDx)', 'Advanced Work Packaging (AWP)', 'Owner-operator digital handovers'],
    color: 'from-amber-500 to-orange-500'
  },
  {
    year: '2015-2019',
    era: 'CONVERGENCE',
    title: 'Cloud-Native & Connected Worker',
    highlightsTop: ['Cloud-native', 'Mobile-first, connected worker'],
    highlightsBottom: [],
    description: 'Pioneered cloud-hosted engineering repositories, OT cybersecurity, and mobile-first field execution apps for frontline workers.',
    icon: 'Cloud',
    keyInnovations: ['Cloud SaaS digital twin repositories', 'Cyber Integrity for OT networks', 'Mobile site inspection & work packages'],
    color: 'from-sky-400 to-indigo-400'
  },
  {
    year: '2026',
    era: 'OCTAVE',
    title: 'Platform-First AI Intelligence & Convergence',
    highlightsTop: [],
    highlightsBottom: ['AI-powered solutions and insights', 'Platform-first architecture'],
    description: 'Unified under Octave — combining 50+ years of domain expertise with AI-powered analytics, real-time telemetry, and modular cross-pillar interoperability.',
    icon: 'Sparkles',
    keyInnovations: ['Octave InConcert SDx Repository', 'Octave Forte & Facets CAD Suites', 'Octave Attune & Reliance Operations', 'Presales AI Copilot'],
    color: 'from-sky-400 via-indigo-500 to-purple-500'
  }
];

interface WhoIsOctaveProps {
  onNavigateToCanvas?: () => void;
}

export default function WhoIsOctave({ onNavigateToCanvas }: WhoIsOctaveProps) {
  // Page Turn State: 'OVERVIEW' (Page 1) or 'TIMELINE' (Page 2)
  const [currentPage, setCurrentPage] = useState<'OVERVIEW' | 'TIMELINE'>('OVERVIEW');
  const [pageDirection, setPageDirection] = useState<number>(1);

  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(6); // Default to 2026
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Switch page with direction animation
  const handleTurnPage = (target: 'OVERVIEW' | 'TIMELINE') => {
    if (target === currentPage) return;
    setPageDirection(target === 'TIMELINE' ? 1 : -1);
    setCurrentPage(target);
  };

  // Auto-play timer for timeline slider
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentPage === 'TIMELINE') {
      timer = setInterval(() => {
        setActiveTimelineIndex((prev) => (prev + 1) % TIMELINE_EVENTS.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentPage]);

  const activeEvent = TIMELINE_EVENTS[activeTimelineIndex];

  // Helper to render lucide icons safely
  const LucideIcon = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.CheckCircle className={className} />;
    return <IconComponent className={className} />;
  };

  const pageVariants: Record<string, any> = {
    initial: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    animate: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.35, ease: 'easeOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      filter: 'blur(4px)',
      transition: { duration: 0.25, ease: 'easeIn' },
    }),
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-16 text-white font-sans">
      
      {/* PAGE TURN NAVIGATION BAR */}
      <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        
        {/* Left: Section Identity & Page Indicator */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Icons.BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400">
                WHO IS OCTAVE?
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px] font-bold">
                {currentPage === 'OVERVIEW' ? 'PAGE 1 OF 2' : 'PAGE 2 OF 2'}
              </span>
            </div>
            <h2 className="text-sm font-bold text-white">
              {currentPage === 'OVERVIEW' ? 'Core Identity & 3 Pillars' : 'Octave 50+ Year Evolution Timeline'}
            </h2>
          </div>
        </div>

        {/* Center: Page Tabs (Turn Page Left / Right) */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => handleTurnPage('OVERVIEW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentPage === 'OVERVIEW'
                ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Icons.Building2 className="w-3.5 h-3.5" />
            <span>1. Identity & Pillars</span>
          </button>

          <button
            type="button"
            onClick={() => handleTurnPage('TIMELINE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentPage === 'TIMELINE'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Icons.History className="w-3.5 h-3.5" />
            <span>2. Evolution Timeline</span>
          </button>
        </div>

        {/* Right: Interactive Next / Previous Turn Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 'OVERVIEW'}
            onClick={() => handleTurnPage('OVERVIEW')}
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-neutral-800 text-xs font-mono font-bold text-neutral-300 hover:text-white hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Previous Page</span>
          </button>

          <button
            type="button"
            disabled={currentPage === 'TIMELINE'}
            onClick={() => handleTurnPage('TIMELINE')}
            className="px-3.5 py-1.5 rounded-xl border border-amber-400/40 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-bold disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="font-extrabold">Turn Page</span>
            <Icons.ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ANIMATED PAGE CONTENT (TURN THE PAGE EFFECT) */}
      <AnimatePresence mode="wait" custom={pageDirection}>
        {currentPage === 'OVERVIEW' ? (
          <motion.div
            key="page-overview"
            custom={pageDirection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {/* PAGE 1: WHO IS OCTAVE HERO SLIDE */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 md:p-10 relative overflow-hidden shadow-2xl space-y-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Top Header Row */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10 border-b border-white/10 pb-8">
                <div className="space-y-3 max-w-sm shrink-0">
                  <div className="flex items-center gap-3">
                    <OctaveLogo variant="icon-only" iconSize={36} markColor="#38bdf8" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
                      octave.com
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    Who is <br />
                    <span className="text-sky-400">Octave?</span>
                  </h1>
                </div>

                <div className="max-w-2xl flex flex-col justify-between gap-4">
                  <p className="text-lg sm:text-xl md:text-2xl font-medium text-neutral-200 leading-relaxed">
                    Octave delivers mission-critical software for decision-making across the asset lifecycle, where performance, safety and reliability are non-negotiable.
                  </p>
                </div>
              </div>

              {/* 3 Core Pillars Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                
                {/* PILLAR 1: DATA + INTELLIGENCE */}
                <div className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-sky-500/50 transition-all duration-300 shadow-xl">
                  {/* Visual Abstract Geometric Banner */}
                  <div className="h-44 relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
                    <svg className="absolute inset-0 w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none" viewBox="0 0 400 180" fill="none">
                      <defs>
                        <linearGradient id="dataGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="dataGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 30 Q100 80 200 40 T400 90" stroke="url(#dataGrad1)" strokeWidth="2" fill="none" />
                      <path d="M0 90 Q120 20 250 110 T400 50" stroke="url(#dataGrad1)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                      <path d="M0 140 Q150 100 300 150 T400 120" stroke="url(#dataGrad2)" strokeWidth="2" fill="none" />
                      <circle cx="100" cy="65" r="4" fill="#38bdf8" className="animate-ping opacity-75" />
                      <circle cx="100" cy="65" r="3" fill="#e0f2fe" />
                      <circle cx="200" cy="40" r="4" fill="#818cf8" />
                      <circle cx="250" cy="110" r="5" fill="#38bdf8" />
                      <circle cx="320" cy="70" r="3" fill="#c084fc" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                    
                    <div className="relative z-10 text-center space-y-1">
                      <div className="inline-flex p-3 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-400 backdrop-blur-md shadow-lg shadow-sky-500/20">
                        <Icons.Zap className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider">
                        DATA + INTELLIGENCE
                      </h3>
                      <p className="text-sm font-semibold italic text-sky-400 mt-0.5">
                        Unstoppable intelligence.
                      </p>
                      <p className="text-xs text-neutral-300 leading-relaxed mt-3">
                        We don’t just make data usable; we unlock its power to give customers a lasting edge.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                      <Icons.CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Actionable Telemetry & Analytics</span>
                    </div>
                  </div>
                </div>

                {/* PILLAR 2: SCALE + COMPLEXITY */}
                <div className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-amber-500/50 transition-all duration-300 shadow-xl">
                  {/* Visual Abstract Geometric Banner */}
                  <div className="h-44 relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950 flex items-center justify-center p-4">
                    <svg className="absolute inset-0 w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none" viewBox="0 0 400 180" fill="none">
                      <defs>
                        <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                      <g stroke="url(#amberGrad)" strokeWidth="1" opacity="0.4">
                        <line x1="50" y1="20" x2="150" y2="160" />
                        <line x1="150" y1="20" x2="200" y2="160" />
                        <line x1="250" y1="20" x2="250" y2="160" />
                        <line x1="350" y1="20" x2="300" y2="160" />
                        <line x1="20" y1="50" x2="380" y2="50" />
                        <line x1="40" y1="90" x2="360" y2="90" />
                        <line x1="60" y1="130" x2="340" y2="130" />
                      </g>
                      <polygon points="200,30 260,65 260,130 200,165 140,130 140,65" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                      <line x1="200" y1="30" x2="200" y2="95" stroke="#fbbf24" strokeWidth="1.5" />
                      <line x1="200" y1="95" x2="260" y2="130" stroke="#fbbf24" strokeWidth="1.5" />
                      <line x1="200" y1="95" x2="140" y2="130" stroke="#fbbf24" strokeWidth="1.5" />
                      <circle cx="200" cy="30" r="4" fill="#fef08a" />
                      <circle cx="260" cy="65" r="4" fill="#fbbf24" />
                      <circle cx="140" cy="65" r="4" fill="#fbbf24" />
                      <circle cx="200" cy="95" r="5" fill="#f59e0b" className="animate-pulse" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                    <div className="relative z-10 text-center space-y-1">
                      <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 backdrop-blur-md shadow-lg shadow-amber-500/20">
                        <Icons.Layers className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider">
                        SCALE + COMPLEXITY
                      </h3>
                      <p className="text-sm font-semibold italic text-amber-400 mt-0.5">
                        Scaling up what’s possible.
                      </p>
                      <p className="text-xs text-neutral-300 leading-relaxed mt-3">
                        From factories to cities, we solve complex challenges at any scale.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                      <Icons.CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Petabyte-Scale Engineering SDx</span>
                    </div>
                  </div>
                </div>

                {/* PILLAR 3: PERFORMANCE + OUTCOMES */}
                <div className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-all duration-300 shadow-xl">
                  {/* Visual Abstract Geometric Banner */}
                  <div className="h-44 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex items-center justify-center p-4">
                    <svg className="absolute inset-0 w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none" viewBox="0 0 400 180" fill="none">
                      <defs>
                        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                          <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <path d="M0 100 L80 100 L110 40 L140 150 L170 70 L200 120 L230 100 L400 100" stroke="url(#emeraldGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M0 130 C100 120 150 60 250 50 C320 42 360 30 400 20" stroke="#a7f3d0" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                      <circle cx="170" cy="70" r="5" fill="#34d399" className="animate-ping opacity-75" />
                      <circle cx="170" cy="70" r="4" fill="#ecfdf5" />
                      <circle cx="250" cy="50" r="4" fill="#10b981" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                    <div className="relative z-10 text-center space-y-1">
                      <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 backdrop-blur-md shadow-lg shadow-emerald-500/20">
                        <Icons.Activity className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider">
                        PERFORMANCE + OUTCOMES
                      </h3>
                      <p className="text-sm font-semibold italic text-emerald-400 mt-0.5">
                        Your outcomes, optimized.
                      </p>
                      <p className="text-xs text-neutral-300 leading-relaxed mt-3">
                        Built for real impact – helping you unlock potential and achieve higher performance.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                      <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero-Unplanned Shutdowns Target</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Callout Banner & Turn Page Action */}
              <div className="bg-neutral-950/90 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                    <Icons.Check className="w-5 h-5" />
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    Turning <span className="text-amber-400 font-bold">complex operational data</span> into <span className="text-sky-400 font-bold">actionable intelligence</span>, Octave connects expertise, real-world conditions and enterprise-scale insight.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTurnPage('TIMELINE')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 transition-all cursor-pointer group"
                >
                  <span>Turn Page to Evolution Timeline</span>
                  <Icons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="page-timeline"
            custom={pageDirection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {/* PAGE 2: INTERACTIVE TIMELINE / EVOLUTION SLIDER */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 md:p-10 space-y-8 shadow-2xl relative overflow-hidden">
              
              {/* Timeline Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <Icons.History className="w-3.5 h-3.5" />
                    <span>Octave Evolution Timeline</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Octave: From innovation to focus
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                    Use the timeline slider below or click any era to explore Octave's 50+ year technology trajectory.
                  </p>
                </div>

                {/* Interactive Player Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                      isPlaying
                        ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-neutral-800 text-neutral-300 border-white/10 hover:bg-neutral-700 hover:text-white'
                    }`}
                  >
                    {isPlaying ? <Icons.Pause className="w-4 h-4 fill-current" /> : <Icons.Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'PAUSE TIMELINE' : 'AUTO-PLAY'}</span>
                  </button>

                  <div className="flex items-center gap-1 bg-neutral-950 border border-white/10 p-1 rounded-xl">
                    <button
                      disabled={activeTimelineIndex === 0}
                      onClick={() => setActiveTimelineIndex((prev) => Math.max(0, prev - 1))}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Previous Era"
                    >
                      <Icons.ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-bold px-2 text-sky-400 min-w-[50px] text-center">
                      {activeEvent.year}
                    </span>
                    <button
                      disabled={activeTimelineIndex === TIMELINE_EVENTS.length - 1}
                      onClick={() => setActiveTimelineIndex((prev) => Math.min(TIMELINE_EVENTS.length - 1, prev + 1))}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Next Era"
                    >
                      <Icons.ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RANGE SLIDER CONTROL */}
              <div className="space-y-3 bg-neutral-950/80 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 font-bold">
                  <span className="flex items-center gap-1 text-sky-400">
                    <Icons.Sliders className="w-3.5 h-3.5" /> Drag Slider to Scrub Eras
                  </span>
                  <span className="text-amber-400">
                    Selected: {activeEvent.year} ({activeEvent.era})
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={TIMELINE_EVENTS.length - 1}
                  step={1}
                  value={activeTimelineIndex}
                  onChange={(e) => {
                    setActiveTimelineIndex(parseInt(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
                />

                {/* VISUAL TIMELINE NODES (Matching the exact Slide Diagram) */}
                <div className="relative pt-8 pb-4 hidden lg:block">
                  {/* Main Axis Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-700 -translate-y-1/2 z-0" />

                  <div className="grid grid-cols-7 gap-2 relative z-10">
                    {TIMELINE_EVENTS.map((event, idx) => {
                      const isActive = idx === activeTimelineIndex;
                      return (
                        <button
                          key={event.year}
                          onClick={() => {
                            setActiveTimelineIndex(idx);
                            setIsPlaying(false);
                          }}
                          className={`flex flex-col items-center text-center cursor-pointer group transition-all`}
                        >
                          {/* Top Highlights Label if present */}
                          <div className="h-14 flex flex-col justify-end mb-3">
                            {event.highlightsTop.length > 0 && (
                              <div className="text-[10px] text-neutral-300 leading-tight space-y-0.5">
                                {event.highlightsTop.map((h, i) => (
                                  <div key={i} className="flex items-center gap-1 justify-center">
                                    <span className="w-1 h-1 rounded-full bg-sky-400" />
                                    <span className="font-medium">{h}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Node Dot */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isActive
                                ? 'bg-sky-400 text-black ring-4 ring-sky-400/30 scale-125 shadow-lg shadow-sky-500/50'
                                : 'bg-neutral-800 border-2 border-sky-400/60 text-sky-400 group-hover:border-white group-hover:scale-110'
                            }`}
                          >
                            {event.year === '2026' ? (
                              <OctaveLogo variant="icon-only" iconSize={14} markColor={isActive ? '#000000' : '#38bdf8'} />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-current" />
                            )}
                          </div>

                          {/* Year & Era Label */}
                          <div className="mt-3 space-y-0.5">
                            <div className={`text-xs font-black font-mono transition-colors ${isActive ? 'text-sky-400' : 'text-white'}`}>
                              {event.year}
                            </div>
                            <div className="text-[9px] font-mono tracking-widest uppercase text-neutral-400 font-bold">
                              {event.era}
                            </div>
                          </div>

                          {/* Bottom Highlights Label if present */}
                          <div className="h-14 mt-3">
                            {event.highlightsBottom.length > 0 && (
                              <div className="text-[10px] text-neutral-300 leading-tight space-y-0.5">
                                {event.highlightsBottom.map((h, i) => (
                                  <div key={i} className="flex items-center gap-1 justify-center">
                                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                                    <span className="font-medium">{h}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* FOCUSED ERA DETAIL CARD */}
              <div className="bg-gradient-to-br from-neutral-950 via-slate-950 to-neutral-900 border border-sky-500/30 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-4">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-r ${activeEvent.color} text-black font-black shadow-lg`}>
                      <LucideIcon name={activeEvent.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
                          {activeEvent.year}
                        </span>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          {activeEvent.era}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                        {activeEvent.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-neutral-400">
                    Era {activeTimelineIndex + 1} of {TIMELINE_EVENTS.length}
                  </div>
                </div>

                <p className="text-sm text-neutral-200 leading-relaxed max-w-4xl">
                  {activeEvent.description}
                </p>
              </div>

              {/* Bottom Page Return Button */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleTurnPage('OVERVIEW')}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer border border-white/10"
                >
                  <Icons.ArrowLeft className="w-4 h-4" />
                  <span>Turn Back to Who is Octave Overview</span>
                </button>

                <span className="text-xs font-mono text-neutral-500">
                  Octave History & Evolution Trajectory
                </span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
