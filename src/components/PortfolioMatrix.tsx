import React, { useState } from 'react';
import { OCTAVE_PORTFOLIO, PILLAR_META, OctaveSolution, PillarType } from '../types';
import * as Icons from 'lucide-react';

interface PortfolioMatrixProps {
  onAddToCanvas: (solutionId: string) => void;
}

const CAPABILITY_OVERVIEW = {
  DESIGN: {
    color: '#22d3ee',
    icon: 'Wrench',
    capabilities: ['Schematics & 3D', 'Engineering & Analysis', 'Engineering Info Mgmt.', 'Geospatial']
  },
  BUILD: {
    color: '#fbbf24',
    icon: 'Hammer',
    capabilities: ['Construction', 'Project Performance', 'Supply Chain Management', 'Completions']
  },
  OPERATE: {
    color: '#e879f9',
    icon: 'Cpu',
    capabilities: ['Enterprise Asset Management', 'Asset Performance', 'Quality Assurance', 'Operations Optimization']
  },
  PROTECT: {
    color: '#34d399',
    icon: 'ShieldCheck',
    capabilities: ['Public Safety', 'Inter-agency Collaboration', 'Physical Security', 'Industrial Cybersecurity']
  }
};

export default function PortfolioMatrix({ onAddToCanvas }: PortfolioMatrixProps) {
  const [selectedSolution, setSelectedSolution] = useState<OctaveSolution | null>(null);
  const [view, setView] = useState<'OVERVIEW' | 'PRODUCTS'>('OVERVIEW');

  // Filter solutions into Design, Build, Operate, Protect columns
  const designSols = OCTAVE_PORTFOLIO.filter(s => s.pillar === 'DESIGN');
  const buildSols = OCTAVE_PORTFOLIO.filter(s => s.pillar === 'BUILD');
  const operateSols = OCTAVE_PORTFOLIO.filter(s => s.pillar === 'OPERATE');
  const protectSols = OCTAVE_PORTFOLIO.filter(s => s.pillar === 'PROTECT');

  // Dynamic Lucide Icon Component
  const LucideIcon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.HelpCircle className={className} style={style} />;
    return <IconComponent className={className} style={style} />;
  };

  const renderColumn = (
    title: string,
    icon: string,
    solutions: OctaveSolution[],
    pillar: PillarType,
    headerColorClass: string,
    borderColorClass: string,
    bgClass: string,
    accentText: string
  ) => {
    const meta = PILLAR_META[pillar];
    const accentColor = meta?.color || '#38bdf8';

    return (
      <div 
        id={`matrix-col-${pillar}`} 
        className="flex flex-col bg-[#09090d]/60 border border-white/10 rounded-xl overflow-hidden shadow-lg h-full"
      >
        {/* Column Header */}
        <div className="p-4 flex items-center justify-between bg-neutral-900/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg border border-white/5 bg-[#07070a]/30">
              <LucideIcon name={icon} className="w-4 h-4" style={{ color: accentColor }} />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: accentColor }}>{title}</span>
          </div>
          <span className="text-[10px] font-mono bg-neutral-900 px-2 py-0.5 rounded border border-white/10 text-neutral-400">
            {solutions.length}
          </span>
        </div>

        {/* Thick, high-precision colored accent line directly under the header */}
        <div className="h-[3px] w-full" style={{ backgroundColor: accentColor }} />

        {/* Column Items */}
        <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1 max-h-[580px] xl:max-h-[660px]">
          {solutions.map((sol) => {
            const cleanLegacy = sol.legacyDescription?.replace(/^Formerly\s+/, '') || '';
            const hasMore = sol.products.length > 2;
            const productsList = sol.products.map(p => p.name).slice(0, 2).join(', ') + (hasMore ? ', ...' : '');
            const displaySubtitle = cleanLegacy 
              ? `${cleanLegacy} (${productsList})`
              : productsList;

            return (
              <button
                id={`matrix-item-${sol.id}`}
                key={sol.id}
                onClick={() => setSelectedSolution(sol)}
                className="w-full p-3.5 text-left rounded-lg bg-neutral-900/30 hover:bg-neutral-900/60 border border-white/5 hover:border-white/20 transition-all group flex flex-col gap-1 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span 
                    className="text-xs font-bold transition-colors flex items-center gap-1.5"
                    style={{ color: accentColor }}
                  >
                    <span className="shrink-0">•</span>
                    <span className="truncate">{sol.name}</span>
                  </span>
                  <Icons.ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] text-neutral-500 leading-normal mt-1 line-clamp-2">
                  {displaySubtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div id="portfolio-matrix-root" className="flex flex-col gap-6">
      {/* View Toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setView('OVERVIEW')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
            view === 'OVERVIEW'
              ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow'
              : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
          }`}
        >
          1. Capability Overview
        </button>
        <button
          onClick={() => setView('PRODUCTS')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
            view === 'PRODUCTS'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
              : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
          }`}
        >
          2. Product Solutions
        </button>
      </div>

      {/* OVERVIEW PAGE: Capability Matrix */}
      {view === 'OVERVIEW' && (
        <div className="flex flex-col gap-5">
          <div className="text-center space-y-2">
            <h3 className="text-base md:text-xl font-black tracking-tight text-white">
              Delivering scalable outcomes across mission-critical workflows
            </h3>
          </div>

          {/* 4 Pillar Capability Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {(Object.entries(CAPABILITY_OVERVIEW) as [string, typeof CAPABILITY_OVERVIEW.DESIGN][]).map(([pillar, cfg]) => (
              <div key={pillar} className="flex flex-col rounded-xl border overflow-hidden" style={{ borderColor: `${cfg.color}30` }}>
                {/* Column Header */}
                <div className="p-4 flex flex-col items-center gap-2 text-center" style={{ backgroundColor: `${cfg.color}12` }}>
                  <LucideIcon name={cfg.icon} className="w-8 h-8" style={{ color: cfg.color }} />
                  <span className="text-lg font-black tracking-widest uppercase" style={{ color: cfg.color }}>{pillar.charAt(0) + pillar.slice(1).toLowerCase()}</span>
                </div>
                {/* Color bar */}
                <div className="h-[3px] w-full" style={{ backgroundColor: cfg.color }} />
                {/* Capabilities list */}
                <div className="flex flex-col divide-y divide-white/5 bg-[#09090d]/60 flex-1">
                  {cfg.capabilities.map((cap) => (
                    <div key={cap} className="px-4 py-3 text-xs text-neutral-200 font-medium tracking-wide">
                      {cap}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Databridge Pro Bar */}
          <div className="rounded-xl border border-white/20 overflow-hidden bg-neutral-900/60">
            <div className="flex items-center justify-between px-5 py-3 bg-neutral-800/60">
              <div className="w-2/5 h-1.5 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="text-sm font-black text-white tracking-wider uppercase px-4">Databridge Pro</span>
              <div className="w-2/5 h-1.5 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
            <div className="px-5 py-3 text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">Databridge Pro</strong> is Octave&apos;s common integration platform that seamlessly moves and transforms data across systems, connecting and enabling workflows end-to-end across the Design, Build, Operate and Protect pillars.
            </div>
          </div>

          {/* CTA to Products */}
          <div className="text-center">
            <button
              onClick={() => setView('PRODUCTS')}
              className="px-6 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-mono font-bold transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Icons.Package className="w-4 h-4" />
              Explore All Product Solutions
              <Icons.ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS PAGE: existing grid */}
      {view === 'PRODUCTS' && (
        <>
      {/* 1. Header Card (Exactly as in screenshot / video) */}
      <div
        id="matrix-intro-card"
        className="bg-neutral-900/40 border border-white/10 rounded-xl p-6 md:p-8 text-center max-w-4xl mx-auto space-y-3"
      >
        <h3 className="text-base md:text-lg font-bold tracking-tight text-white">
          Delivering scalable outcomes across mission-critical workflows
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed font-normal max-w-2xl mx-auto">
          Octave utilizes the <strong className="text-sky-400">DBOP</strong> model to align its software portfolio across the entire Design, Build, Operate, and Protect lifecycle of industrial facilities. Click on any product below to explore its specific capabilities, pre-sales talking points, and competitor alternatives.
        </p>
      </div>

      {/* 2. Grid Columns (DBOP model columns) */}
      <div id="matrix-columns-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        {renderColumn(
          'DESIGN',
          'Wrench',
          designSols,
          'DESIGN',
          'text-sky-400',
          'border-sky-500/10',
          'bg-sky-500/5',
          'text-sky-400'
        )}
        {renderColumn(
          'BUILD',
          'Hammer',
          buildSols,
          'BUILD',
          'text-amber-400',
          'border-amber-500/10',
          'bg-amber-500/5',
          'text-amber-400'
        )}
        {renderColumn(
          'OPERATE',
          'Cpu',
          operateSols,
          'OPERATE',
          'text-fuchsia-400',
          'border-fuchsia-500/10',
          'bg-fuchsia-500/5',
          'text-fuchsia-400'
        )}
        {renderColumn(
          'PROTECT',
          'ShieldCheck',
          protectSols,
          'PROTECT',
          'text-emerald-400',
          'border-emerald-500/10',
          'bg-emerald-500/5',
          'text-emerald-400'
        )}
      </div>

      {/* 3. Deep-Dive Slide-Out Drawer / Card for Selected Solution */}
      {selectedSolution && (
        <div 
          id="matrix-detail-overlay" 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setSelectedSolution(null)}
        >
          <div 
            id="matrix-detail-card" 
            className="w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-5 border-b border-white/10 flex items-center justify-between ${PILLAR_META[selectedSolution.pillar].bg}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${PILLAR_META[selectedSolution.pillar].border} bg-[#0a0a0a]`}>
                  <LucideIcon name={selectedSolution.icon} className={`w-5 h-5 ${PILLAR_META[selectedSolution.pillar].text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white uppercase">{selectedSolution.name}</h4>
                    <span className={`text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border bg-[#0a0a0a] ${PILLAR_META[selectedSolution.pillar].border} ${PILLAR_META[selectedSolution.pillar].text}`}>
                      {selectedSolution.pillar}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5 tracking-wider uppercase font-mono">{selectedSolution.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSolution(null)}
                className="p-1.5 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Panel */}
            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
              <div className="space-y-2">
                <h5 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">[ SYSTEM OVERVIEW ]</h5>
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  {selectedSolution.description}
                </p>
              </div>

              {/* Sub-systems / Products list */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                  [ INCLUDED SOLUTIONS &amp; SUB-PRODUCTS — {selectedSolution.products.length} ]
                </h5>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]/50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-900/60 border-b border-white/10 text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                        <th className="px-4 py-2.5">Software Module</th>
                        <th className="px-4 py-2.5">Legacy Asset Replaced</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {selectedSolution.products.map((p, idx) => (
                        <tr key={idx} className="hover:bg-neutral-900/20 text-xs">
                          <td className="px-4 py-2.5 font-bold text-neutral-200">{p.name}</td>
                          <td className="px-4 py-2.5 text-neutral-400 italic">
                            {p.legacyName ? p.legacyName : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Competitors & Replaced products mapping */}
              {selectedSolution.replacesWith && selectedSolution.replacesWith.length > 0 && (
                <div className="bg-[#0a0a0a]/80 border border-white/10 rounded-xl p-4.5 space-y-2">
                  <h5 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase flex items-center gap-1.5">
                    <Icons.AlertCircle className="w-3.5 h-3.5 text-sky-400" />
                    [ COMPETITIVE SWAP &amp; REPLACEMENT SCHEDULE ]
                  </h5>
                  <p className="text-xs text-neutral-400">
                     Specifically engineered as a direct replacement upgrade path for these legacy platforms:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedSolution.replacesWith.map((leg, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                        <Icons.X className="w-2.5 h-2.5 text-red-500" />
                        {leg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedSolution(null)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold text-xs uppercase tracking-wider rounded-lg border border-white/10 transition-all cursor-pointer"
                >
                  Close Specification
                </button>
                <button
                  onClick={() => {
                    onAddToCanvas(selectedSolution.id);
                    setSelectedSolution(null);
                  }}
                  className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-tight flex items-center gap-2 transition-all cursor-pointer select-none ${PILLAR_META[selectedSolution.pillar].bg} border ${PILLAR_META[selectedSolution.pillar].border} hover:opacity-95 ${PILLAR_META[selectedSolution.pillar].text}`}
                >
                  <Icons.Plus className="w-4 h-4" />
                  Orchestrate on Canvas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
