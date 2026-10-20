import React, { useState, useMemo, useEffect } from 'react';
import { OCTAVE_PORTFOLIO, PILLAR_META, OctaveSolution } from '../types';
import { INDUSTRY_SECTORS, IndustrySector, IndustryTask, IndustryResearch } from '../data/industryData';
import * as Icons from 'lucide-react';

interface SolutionFinderProps {
  onAddToCanvas: (solutionId: string) => void;
  onNavigateToBuilder?: () => void;
  onRequestDemo?: (solutionName: string) => void;
}

export default function SolutionFinder({
  onAddToCanvas,
  onNavigateToBuilder,
  onRequestDemo
}: SolutionFinderProps) {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('smart-cities');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('smart-city-twin');
  const [activeTab, setActiveTab] = useState<'solutions' | 'research'>('solutions');

  // Find active industry
  const activeIndustry = useMemo(
    () => INDUSTRY_SECTORS.find((i) => i.id === selectedIndustryId) || INDUSTRY_SECTORS[0],
    [selectedIndustryId]
  );

  // Auto-switch selected task when industry changes if current task isn't in new industry
  useEffect(() => {
    const isTaskValid = activeIndustry.tasks.some((t) => t.id === selectedTaskId);
    if (!isTaskValid && activeIndustry.tasks.length > 0) {
      setSelectedTaskId(activeIndustry.tasks[0].id);
    }
  }, [selectedIndustryId, activeIndustry, selectedTaskId]);

  // Find active task
  const activeTask = useMemo(
    () => activeIndustry.tasks.find((t) => t.id === selectedTaskId) || activeIndustry.tasks[0],
    [activeIndustry, selectedTaskId]
  );

  // Fetch matched solutions for active task
  const recommendedSolutions = useMemo(() => {
    const solIds = activeTask ? activeTask.recommendedSolutionIds : [];
    return OCTAVE_PORTFOLIO.filter((sol) => solIds.includes(sol.id));
  }, [activeTask]);

  // All distinct solutions across the selected industry
  const allIndustrySolutions = useMemo(() => {
    const allIds = new Set<string>();
    activeIndustry.tasks.forEach((t) => {
      t.recommendedSolutionIds.forEach((id) => allIds.add(id));
    });
    return OCTAVE_PORTFOLIO.filter((sol) => allIds.has(sol.id));
  }, [activeIndustry]);

  // Check if Information Management integrated platform applies
  const showInfoMgmtPlatform =
    activeTask &&
    (activeTask.id === 'info-mgmt' ||
      activeTask.id === '3d-design' ||
      activeTask.id === '2d-schematics' ||
      activeTask.id === 'gov-info-mgmt' ||
      activeTask.id === 'municipal-info-mgmt' ||
      activeTask.id === 'aerospace-config-mgmt');

  // Helper to render lucide icons
  const LucideIcon = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.CheckCircle className={className} />;
    return <IconComponent className={className} />;
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Icons.Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Solution & Industry Research Finder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Solutions Fit for <span className="text-sky-400">Your Purpose</span>
          </h1>
          <p className="text-neutral-300 text-sm max-w-3xl leading-relaxed">
            Select your industry sector and engineering workflow below. Octave offers purpose-fit software solutions tailored to the specific needs of your industry.
          </p>
          <p className="text-neutral-400 text-xs max-w-3xl leading-relaxed italic border-l-2 border-sky-500/40 pl-3 pt-0.5">
            Disclaimer: The identified systems are based on the selected criteria and are intended as preliminary recommendations. Final validation and applicability should be confirmed with the appropriate Subject Matter Expert (SME).
          </p>
        </div>
      </div>

      {/* SELECTION CONTROLS: STREAMLINED INDUSTRY & WORKFLOW SELECTOR */}
      <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-sky-500 text-black font-black text-xs flex items-center justify-center font-mono shrink-0">
              <Icons.Workflow className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Engineering Workflows & Operational Tasks
              </h2>
              <p className="text-[11px] text-neutral-400">
                Select an industry sector and choose a workflow to see purpose-fit software recommendations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-[260px]">
            <span className="text-xs font-mono font-bold text-sky-400 shrink-0">Industry:</span>
            <div className="relative w-full">
              <select
                value={selectedIndustryId}
                onChange={(e) => setSelectedIndustryId(e.target.value)}
                className="w-full bg-neutral-950 border border-sky-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-sky-400 cursor-pointer appearance-none pr-8 shadow-inner"
              >
                {INDUSTRY_SECTORS.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
              </select>
              <Icons.ChevronDown className="w-4 h-4 text-sky-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Operational Tasks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {activeIndustry.tasks.map((task) => {
            const isSelected = task.id === selectedTaskId;
            return (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500 text-white shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30'
                    : 'bg-neutral-950/60 border-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div
                  className={`p-2 rounded-lg border shrink-0 ${
                    isSelected
                      ? 'bg-sky-500 text-black border-sky-400'
                      : 'bg-neutral-800 text-neutral-400 border-white/5'
                  }`}
                >
                  <LucideIcon name={task.icon} className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold leading-snug">{task.name}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                    {task.recommendedSolutionIds.length} Recommended {task.recommendedSolutionIds.length === 1 ? 'Solution' : 'Solutions'}
                  </div>
                </div>
                {isSelected && (
                  <Icons.Check className="w-4 h-4 text-sky-400 shrink-0 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTOR ACTION & RESEARCH TABS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-900/60 border border-white/10 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'solutions'
                ? 'bg-sky-500 text-black font-black shadow-md shadow-sky-500/20'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Icons.Layers className="w-4 h-4" />
            <span>Purpose-Fit Solutions ({recommendedSolutions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'research'
                ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Icons.BookOpen className="w-4 h-4" />
            <span>Researched Sector Briefing & Standards</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RESEARCHED TECHNICAL BRIEFING */}
      {activeTab === 'research' && (
        <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <LucideIcon name={activeIndustry.icon} className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Technical Research & Regulatory Briefing
                </div>
                <h3 className="text-xl font-black text-white">{activeIndustry.name}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded bg-neutral-950 border border-white/10 text-neutral-300">
                {activeIndustry.tasks.length} Operational Tasks Mapped
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Context & Challenges */}
            <div className="space-y-4 bg-neutral-950/60 border border-white/5 rounded-xl p-4">
              <div>
                <h4 className="text-xs font-bold font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Icons.TrendingUp className="w-4 h-4" />
                  Industry Market Context
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeIndustry.research.marketContext}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Icons.AlertTriangle className="w-4 h-4" />
                  Mission-Critical Challenges
                </h4>
                <ul className="space-y-1.5">
                  {activeIndustry.research.challenges.map((chal, idx) => (
                    <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>{chal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Standards & Digital Twin Architecture */}
            <div className="space-y-4 bg-neutral-950/60 border border-white/5 rounded-xl p-4">
              <div>
                <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Icons.ShieldCheck className="w-4 h-4" />
                  Regulatory Standards & Compliance Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeIndustry.research.standards.map((std, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono font-bold"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Icons.Boxes className="w-4 h-4" />
                  Digital Twin Topology & Focus
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeIndustry.research.digitalTwinFocus}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Icons.Target className="w-4 h-4" />
                  Quantified ROI & Value Drivers
                </h4>
                <ul className="space-y-1.5">
                  {activeIndustry.research.roiDrivers.map((roi, idx) => (
                    <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                      <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{roi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECOMMENDED INTEGRATED PLATFORM BLUEPRINT BANNER */}
      {showInfoMgmtPlatform && (
        <div className="bg-gradient-to-r from-slate-900 via-neutral-900 to-sky-950 border border-sky-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
              <Icons.FolderGit className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  RECOMMENDED INTEGRATED PLATFORM
                </span>
              </div>
              <h3 className="text-base font-black text-white">
                Information Management Platform
              </h3>
              <p className="text-xs text-neutral-300 max-w-2xl">
                Unifies Octave InConcert (central SDx digital twin repository), Octave Forte (3D Design), and Octave Facets (2D P&ID & Schematics) using native direct bi-directional connectors without intermediate middleware.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {onNavigateToBuilder && (
              <button
                onClick={onNavigateToBuilder}
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Icons.Compass className="w-4 h-4" />
                <span>View Architecture Canvas</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* RECOMMENDED SOLUTIONS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Icons.CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Recommended Solutions for {activeIndustry.name} ({activeTask.name})
          </h2>
          <span className="text-xs font-mono text-neutral-400">
            {recommendedSolutions.length} Purpose-Fit Solutions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedSolutions.map((sol) => {
            const pillarMeta = PILLAR_META[sol.pillar];
            return (
              <div
                key={sol.id}
                className="bg-neutral-900 border border-white/10 hover:border-sky-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-neutral-800 border border-white/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-black transition-all">
                        <LucideIcon name={sol.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white group-hover:text-sky-300">
                          {sol.name}
                        </h3>
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${pillarMeta.bg} ${pillarMeta.border} ${pillarMeta.text}`}
                        >
                          {pillarMeta.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {sol.description}
                  </p>

                  <div className="bg-neutral-950 border border-white/5 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Why it fits your purpose in {activeIndustry.name}:
                    </span>
                    <p className="text-xs text-neutral-300 leading-snug">
                      {activeTask?.fitNote}
                    </p>
                  </div>

                  {/* Included Products & Legacy Software Mapping */}
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block mb-1">
                        Octave Products ({sol.products.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sol.products.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-neutral-950 border border-white/10 text-[10px] font-mono text-neutral-300 flex items-center gap-1"
                          >
                            <span className="font-bold text-white">{p.name}</span>
                            {p.legacyName && (
                              <span className="text-amber-400/90 text-[9px] font-sans italic">
                                ({p.legacyName})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {sol.replacesWith && sol.replacesWith.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                          Replaces Legacy Systems:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {sol.replacesWith.map((legacy, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] font-mono font-bold"
                            >
                              {legacy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {onRequestDemo && (
                    <button
                      onClick={() => onRequestDemo(sol.name)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all border border-white/10 cursor-pointer"
                    >
                      Request Demo
                    </button>
                  )}

                  <button
                    onClick={() => onAddToCanvas(sol.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    <span>Add to Canvas</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
