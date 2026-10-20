import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExecutiveKpiSimulatorProps {
  initialIndustryId?: string;
  onSelectUseCase?: (useCaseTitle: string) => void;
}

export default function ExecutiveKpiSimulator({
  onSelectUseCase
}: ExecutiveKpiSimulatorProps) {
  // Page Turn State: 'KPIS' (Page 1) or 'ARCHITECTURE' (Page 2)
  const [currentPage, setCurrentPage] = useState<'KPIS' | 'ARCHITECTURE'>('KPIS');
  const [pageDirection, setPageDirection] = useState<number>(1);

  // Single Master Qualitative Slider (0 = Siloed, 50 = Integrated, 100 = Unified)
  const [adoptionLevel, setAdoptionLevel] = useState<number>(75);

  // Selected Active Pillar Focus
  const [selectedPillar, setSelectedPillar] = useState<'ALL' | 'DESIGN' | 'BUILD' | 'OPERATE' | 'PROTECT'>('ALL');

  // Switch page with direction animation
  const handleTurnPage = (target: 'KPIS' | 'ARCHITECTURE') => {
    if (target === currentPage) return;
    setPageDirection(target === 'ARCHITECTURE' ? 1 : -1);
    setCurrentPage(target);
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

  // Qualitative KPI states derived from adoption level (No Numbers)
  const kpiState = useMemo(() => {
    if (adoptionLevel < 33) {
      return {
        stageName: 'Siloed Operations',
        stageDescription: 'Disconnected Design, Build, Operate & Protect workflows leading to data loss and rework',
        badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
        
        // KPI 1: Cost Overruns
        costStatus: 'High Overrun & Rework Risk',
        costBadge: 'Uncontrolled Budget Inflation',
        costColor: 'text-red-400',
        costProgress: 18,
        costDescription: 'Inaccurate initial designs lead to expensive construction rework & severe budget inflation.',
        costOutcome: 'Rework gaps between design and build remain unaddressed.',

        // KPI 2: Risk
        riskStatus: 'Critical Exposure & Vulnerability',
        riskBadge: 'High Cyber & Regulatory Risk',
        riskColor: 'text-red-400',
        riskProgress: 15,
        riskDescription: 'Fragmented view leaves critical infrastructure vulnerable to cyber threats & safety breaches.',
        riskOutcome: 'Unmonitored regulatory exposure & physical safety hazards.',

        // KPI 3: Operational Inefficiency
        efficiencyStatus: 'Reactive Repair & Data Loss',
        efficiencyBadge: 'Lost Build Phase Data',
        efficiencyColor: 'text-amber-400',
        efficiencyProgress: 25,
        efficiencyDescription: 'Data from the build phase is lost, forcing emergency reactive maintenance during live ops.',
        efficiencyOutcome: 'Frequent unplanned downtime and shortened asset lifespan.'
      };
    } else if (adoptionLevel < 66) {
      return {
        stageName: 'Connected Workflows',
        stageDescription: 'Partial digital thread establishing automated handoffs across major engineering teams',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',

        // KPI 1: Cost Overruns
        costStatus: 'Controlled Budget Variance',
        costBadge: 'Reduced Rework & Clashes',
        costColor: 'text-amber-400',
        costProgress: 58,
        costDescription: 'Design & build workflows share live models, significantly curbing engineering change orders.',
        costOutcome: 'Substantial capital savings achieved through early clash detection.',

        // KPI 2: Risk
        riskStatus: 'Active Governance & Defense',
        riskBadge: 'Managed Compliance Shield',
        riskColor: 'text-amber-300',
        riskProgress: 60,
        riskDescription: 'Inter-agency compliance checks and baseline industrial cybersecurity controls active.',
        riskOutcome: 'Streamlined safety audits and mitigated regulatory penalties.',

        // KPI 3: Operational Inefficiency
        efficiencyStatus: 'Preventative Asset Health',
        efficiencyBadge: 'Synchronized Equipment Data',
        efficiencyColor: 'text-sky-300',
        efficiencyProgress: 65,
        efficiencyDescription: 'Build-phase BIM and asset metadata seamlessly handed over to operations teams.',
        efficiencyOutcome: 'Reduced unplanned outages with structured maintenance scheduling.'
      };
    } else {
      return {
        stageName: 'Unified Digital Thread',
        stageDescription: 'Full Databridge Pro integration powering continuous design, execution & predictive AI health',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',

        // KPI 1: Cost Overruns
        costStatus: 'Eliminated Rework & Maximum ROI',
        costBadge: 'Locked Budget Precision',
        costColor: 'text-emerald-400',
        costProgress: 95,
        costDescription: 'Unified digital thread completely removes design-to-build gaps and eliminates budget inflation.',
        costOutcome: 'Maximized capital efficiency with flawless project commissioning.',

        // KPI 2: Risk
        riskStatus: 'Zero-Trust Cyber & Safety Shield',
        riskBadge: 'Audit-Ready Regulatory Defense',
        riskColor: 'text-emerald-400',
        riskProgress: 98,
        riskDescription: 'Real-time threat monitoring and continuous automated governance across all physical & digital assets.',
        riskOutcome: 'Uncompromising public safety and continuous zero-fine audit compliance.',

        // KPI 3: Operational Inefficiency
        efficiencyStatus: 'Predictive AI Optimization',
        efficiencyBadge: 'Maximum Asset Uptime',
        efficiencyColor: 'text-emerald-400',
        efficiencyProgress: 96,
        efficiencyDescription: 'Live IoT telemetry and digital twin models fuel AI-driven predictive asset maintenance.',
        efficiencyOutcome: 'Peak operational performance with virtually zero unplanned downtime.'
      };
    }
  }, [adoptionLevel]);

  return (
    <div className="bg-[#08080c] text-neutral-100 rounded-2xl border border-white/10 p-3 sm:p-4.5 md:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden w-full h-full min-h-[560px]">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP SLIM COCKPIT CONTROL & PAGE NAVIGATION STRIP */}
      <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-2.5 sm:p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg backdrop-blur-md relative z-10 shrink-0">
        
        {/* Left: Branding & Current Mode */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Icons.Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                OCTAVE VALUE SIMULATOR
              </span>
              <span className="px-2 py-0.2 rounded-full bg-white/10 text-white font-mono text-[9px] font-bold">
                {currentPage === 'KPIS' ? 'PAGE 1/2' : 'PAGE 2/2'}
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-black text-white tracking-tight">
              {currentPage === 'KPIS' ? 'Cross-Lifecycle KPI Impact Simulator' : 'Cross-Lifecycle Architecture & Databridge Pro'}
            </h2>
          </div>
        </div>

        {/* Center: Stage Presets */}
        {currentPage === 'KPIS' && (
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setAdoptionLevel(0)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                adoptionLevel === 0
                  ? 'bg-red-500/20 border-red-500 text-red-300 shadow'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Siloed Baseline</span>
            </button>

            <button
              type="button"
              onClick={() => setAdoptionLevel(50)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                adoptionLevel === 50
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Connected</span>
            </button>

            <button
              type="button"
              onClick={() => setAdoptionLevel(100)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                adoptionLevel === 100
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Unified Thread</span>
            </button>
          </div>
        )}

        {/* Right: Page Switcher Tabs & Turn Page */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => handleTurnPage('KPIS')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                currentPage === 'KPIS'
                  ? 'bg-amber-400 text-black shadow font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              1. KPIs
            </button>
            <button
              type="button"
              onClick={() => handleTurnPage('ARCHITECTURE')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                currentPage === 'ARCHITECTURE'
                  ? 'bg-sky-400 text-black shadow font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              2. Architecture
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleTurnPage(currentPage === 'KPIS' ? 'ARCHITECTURE' : 'KPIS')}
            className="px-2.5 py-1 rounded-lg border border-sky-400/40 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{currentPage === 'KPIS' ? 'Turn Page' : 'Back to KPIs'}</span>
            <Icons.ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* ANIMATED PAGE CONTENT (TURN THE PAGE EFFECT) */}
      <div className="flex-1 min-h-0 relative my-2.5 flex flex-col">
        <AnimatePresence mode="wait" custom={pageDirection}>
          {currentPage === 'KPIS' ? (
            <motion.div
              key="page-kpis"
              custom={pageDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1 h-full min-h-0"
            >
              {/* LEFT COMMAND PANEL: MASTER CONTROL & MACRO TRANSFORMATION (~40% / 5 Cols) */}
              <div className="lg:col-span-5 bg-neutral-900/80 border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 shadow-lg relative overflow-hidden">
                <div className="space-y-3">
                  
                  {/* Active Qualitative Stage Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">
                        Enterprise Integration
                      </span>
                      <div className={`text-sm sm:text-base font-black font-mono tracking-tight ${kpiState.badgeBg} border px-2.5 py-0.5 rounded-lg inline-block`}>
                        {kpiState.stageName}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-neutral-400 block">Digital Thread</span>
                      <span className="text-xs font-mono font-bold text-sky-300">
                        {adoptionLevel < 33 ? 'Disconnected' : adoptionLevel < 66 ? 'Partial Flow' : 'End-to-End'}
                      </span>
                    </div>
                  </div>

                  {/* Range Slider Control */}
                  <div className="space-y-2 bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                      <span className="text-red-400">0% Siloed</span>
                      <span className="text-neutral-400">Drag to Transform</span>
                      <span className="text-emerald-400">100% Unified</span>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={adoptionLevel}
                        onChange={(e) => setAdoptionLevel(Number(e.target.value))}
                        className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-white/10"
                      />
                    </div>
                  </div>

                  {/* Macro Stage Narrative */}
                  <div className="p-3 bg-neutral-950/90 border border-white/10 rounded-lg space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                      Enterprise Impact Profile
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {kpiState.stageDescription}.
                    </p>
                  </div>

                  {/* 4 Pillars Unified Thread Live Flow Diagram */}
                  <div className="p-2.5 bg-black/50 border border-sky-500/20 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span>LIFECYCLE DATA THREAD</span>
                      <span className="text-sky-400 font-bold flex items-center gap-1">
                        <Icons.Cpu className="w-3 h-3 animate-pulse" />
                        Databridge Pro
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px]">
                      <div className={`p-1.5 rounded border transition-all ${adoptionLevel >= 0 ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}>
                        DESIGN
                      </div>
                      <div className={`p-1.5 rounded border transition-all ${adoptionLevel >= 33 ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}>
                        BUILD
                      </div>
                      <div className={`p-1.5 rounded border transition-all ${adoptionLevel >= 66 ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}>
                        OPERATE
                      </div>
                      <div className={`p-1.5 rounded border transition-all ${adoptionLevel >= 85 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}>
                        PROTECT
                      </div>
                    </div>
                  </div>

                </div>

                {/* Quick Link to Page 2 */}
                <button
                  type="button"
                  onClick={() => handleTurnPage('ARCHITECTURE')}
                  className="w-full py-2 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5">
                    <Icons.Layers className="w-3.5 h-3.5 text-sky-400" />
                    <span>Explore 4 Lifecycle Pillars</span>
                  </span>
                  <Icons.ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* RIGHT IMPACT DECK: THE 3 CORE EXECUTIVE KPI TILES (~60% / 7 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-2.5 h-full min-h-0">

                {/* QUALITATIVE DISCLAIMER BANNER */}
                <div className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-500/8 border border-amber-500/30 rounded-xl">
                  <Icons.Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-0.5">Qualitative Assessment</span>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      This simulator illustrates <strong className="text-amber-300">qualitative directional impact</strong> across the asset lifecycle. To conduct a precise <strong className="text-sky-300">quantitative value assessment</strong> — with real ROI figures, cost savings, and KPIs tailored to your organization — we need a few more details about your environment. <span className="text-emerald-300 font-semibold">Let's start that journey together.</span>
                    </p>
                  </div>
                </div>

                {/* KPI 1: COST OVERRUNS */}
                <div className="bg-neutral-900/90 border border-amber-500/30 rounded-xl p-3 sm:p-3.5 space-y-2 shadow-md relative overflow-hidden flex flex-col justify-between flex-1 hover:border-amber-400/60 transition-all">
                  <div className="h-1 w-full bg-amber-400 absolute top-0 left-0" />
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Icons.TrendingDown className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                          COST OVERRUNS
                        </span>
                        <div className={`text-xs sm:text-sm font-black font-mono leading-tight ${kpiState.costColor}`}>
                          {kpiState.costStatus}
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                      {kpiState.costBadge}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 leading-snug">
                    {kpiState.costDescription}
                  </p>

                  <div className="space-y-1 pt-1 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-neutral-400">Capital Protection & Rework Lock:</span>
                      <span className="text-amber-300 font-bold">
                        {adoptionLevel < 33 ? 'Initial Gap' : adoptionLevel < 66 ? 'Partial Control' : 'Maximum Lock'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${kpiState.costProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* KPI 2: INCREASED RISK */}
                <div className="bg-neutral-900/90 border border-red-500/30 rounded-xl p-3 sm:p-3.5 space-y-2 shadow-md relative overflow-hidden flex flex-col justify-between flex-1 hover:border-red-400/60 transition-all">
                  <div className="h-1 w-full bg-red-500 absolute top-0 left-0" />
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                        <Icons.ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                          INCREASED RISK
                        </span>
                        <div className={`text-xs sm:text-sm font-black font-mono leading-tight ${kpiState.riskColor}`}>
                          {kpiState.riskStatus}
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-sky-400 font-bold bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full shrink-0">
                      {kpiState.riskBadge}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 leading-snug">
                    {kpiState.riskDescription}
                  </p>

                  <div className="space-y-1 pt-1 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-neutral-400">Cyber Shield & Regulatory Defense:</span>
                      <span className="text-red-300 font-bold">
                        {adoptionLevel < 33 ? 'Unmonitored' : adoptionLevel < 66 ? 'Active Shield' : 'Zero-Trust Secure'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 transition-all duration-500"
                        style={{ width: `${kpiState.riskProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* KPI 3: OPERATIONAL EFFICIENCY */}
                <div className="bg-neutral-900/90 border border-emerald-500/30 rounded-xl p-3 sm:p-3.5 space-y-2 shadow-md relative overflow-hidden flex flex-col justify-between flex-1 hover:border-emerald-400/60 transition-all">
                  <div className="h-1 w-full bg-emerald-400 absolute top-0 left-0" />
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Icons.Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                          OPERATIONAL EFFICIENCY
                        </span>
                        <div className={`text-xs sm:text-sm font-black font-mono leading-tight ${kpiState.efficiencyColor}`}>
                          {kpiState.efficiencyStatus}
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                      {kpiState.efficiencyBadge}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 leading-snug">
                    {kpiState.efficiencyDescription}
                  </p>

                  <div className="space-y-1 pt-1 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-neutral-400">Predictive AI & Asset Health:</span>
                      <span className="text-emerald-300 font-bold">
                        {adoptionLevel < 33 ? 'Reactive' : adoptionLevel < 66 ? 'Preventative' : 'Predictive AI'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${kpiState.efficiencyProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="page-architecture"
              custom={pageDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-black/60 border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 h-full min-h-0 shadow-2xl overflow-hidden"
            >
              {/* Header + Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5 shrink-0">
                <div>
                  <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                    OCTAVE LIFECYCLE ARCHITECTURE
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                    <Icons.Layers className="w-4 h-4 text-sky-400" />
                    Scalable Outcomes Across Mission-Critical Workflows
                  </h3>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-white/10 shrink-0">
                  {(['ALL', 'DESIGN', 'BUILD', 'OPERATE', 'PROTECT'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPillar(p)}
                      className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                        selectedPillar === p
                          ? 'bg-sky-500 text-black shadow font-extrabold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* The 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 flex-1 min-h-0 overflow-y-auto">

                {/* PILLAR 1: DESIGN */}
                <div className={`p-3 rounded-xl border transition-all flex flex-col justify-start gap-2.5 ${
                  selectedPillar === 'ALL' || selectedPillar === 'DESIGN'
                    ? 'bg-sky-500/10 border-sky-500/40 text-white shadow-lg shadow-sky-950/30'
                    : 'bg-black/40 border-white/5 opacity-40'
                }`}>
                  <div className="flex items-center gap-2 border-b border-sky-500/30 pb-2">
                    <div className="p-1 rounded bg-sky-500/20 text-sky-400">
                      <Icons.Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-sky-300 uppercase tracking-wider">Design</h4>
                      <span className="text-[9px] font-mono text-neutral-400">Engineering & 3D Modeling</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-[11px] font-mono text-neutral-300">
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-sky-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Schematics & 3D Engineering</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-sky-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Stress & Stress Analysis</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-sky-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Information Management</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-sky-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Geospatial Spatial Mapping</span>
                    </li>
                  </ul>
                </div>

                {/* PILLAR 2: BUILD */}
                <div className={`p-3 rounded-xl border transition-all flex flex-col justify-start gap-2.5 ${
                  selectedPillar === 'ALL' || selectedPillar === 'BUILD'
                    ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-lg shadow-amber-950/30'
                    : 'bg-black/40 border-white/5 opacity-40'
                }`}>
                  <div className="flex items-center gap-2 border-b border-amber-500/30 pb-2">
                    <div className="p-1 rounded bg-amber-500/20 text-amber-400">
                      <Icons.HardHat className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">Build</h4>
                      <span className="text-[9px] font-mono text-neutral-400">Construction & Field Execution</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-[11px] font-mono text-neutral-300">
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-amber-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Construction Execution</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-amber-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Project Performance</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-amber-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Supply Chain Management</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-amber-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Commissioning & Completions</span>
                    </li>
                  </ul>
                </div>

                {/* PILLAR 3: OPERATE */}
                <div className={`p-3 rounded-xl border transition-all flex flex-col justify-start gap-2.5 ${
                  selectedPillar === 'ALL' || selectedPillar === 'OPERATE'
                    ? 'bg-pink-500/10 border-pink-500/40 text-white shadow-lg shadow-pink-950/30'
                    : 'bg-black/40 border-white/5 opacity-40'
                }`}>
                  <div className="flex items-center gap-2 border-b border-pink-500/30 pb-2">
                    <div className="p-1 rounded bg-pink-500/20 text-pink-400">
                      <Icons.Settings2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-pink-300 uppercase tracking-wider">Operate</h4>
                      <span className="text-[9px] font-mono text-neutral-400">Asset Management & Optimization</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-[11px] font-mono text-neutral-300">
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-pink-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Enterprise Asset Management</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-pink-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Asset Performance & Health</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-pink-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Quality Assurance & Audits</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-pink-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Operations Optimization</span>
                    </li>
                  </ul>
                </div>

                {/* PILLAR 4: PROTECT */}
                <div className={`p-3 rounded-xl border transition-all flex flex-col justify-start gap-2.5 ${
                  selectedPillar === 'ALL' || selectedPillar === 'PROTECT'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg shadow-emerald-950/30'
                    : 'bg-black/40 border-white/5 opacity-40'
                }`}>
                  <div className="flex items-center gap-2 border-b border-emerald-500/30 pb-2">
                    <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                      <Icons.ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">Protect</h4>
                      <span className="text-[9px] font-mono text-neutral-400">Cybersecurity & Site Safety</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-[11px] font-mono text-neutral-300">
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Public & Environmental Safety</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Inter-Agency Collaboration</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Physical Asset Security</span>
                    </li>
                    <li className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors">
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Industrial Cybersecurity</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* BOTTOM INTEGRATION RIBBON: DATABRIDGE PRO */}
              <div className="p-2.5 bg-gradient-to-r from-sky-950/80 via-neutral-900 to-amber-950/80 border border-sky-500/40 rounded-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-sky-500/20 border border-sky-400 rounded text-sky-400">
                    <Icons.Cpu className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white tracking-wider">Databridge Pro</span>
                      <span className="text-[8px] font-mono px-1.5 py-0.2 bg-sky-400 text-black font-extrabold rounded">
                        Common Integration Platform
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-300">
                      Seamlessly moves and transforms data across systems, connecting workflows end-to-end.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 bg-black/60 px-2 py-1 rounded border border-emerald-500/30">
                    <Icons.CheckCircle2 className="w-3 h-3" />
                    Unified Thread Active
                  </span>

                  <button
                    type="button"
                    onClick={() => handleTurnPage('KPIS')}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer border border-white/10"
                  >
                    <Icons.ArrowLeft className="w-3 h-3" />
                    <span>Back to KPIs</span>
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
