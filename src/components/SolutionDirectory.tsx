import { useState } from 'react';
import { OCTAVE_PORTFOLIO, PILLAR_META, OctaveSolution, PillarType } from '../types';
import * as Icons from 'lucide-react';

interface SolutionDirectoryProps {
  onAddToCanvas?: (solutionId: string) => void;
}

export default function SolutionDirectory({ onAddToCanvas }: SolutionDirectoryProps) {
  const [selectedPillar, setSelectedPillar] = useState<PillarType>('DESIGN');
  const [selectedSolution, setSelectedSolution] = useState<OctaveSolution | null>(
    OCTAVE_PORTFOLIO.find(s => s.pillar === 'DESIGN') || null
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Pillars to show in directory (exclude Middleware and Third Party from main directory browsing,
  // but let them see them as extra integrations, or include them!)
  const pillars: PillarType[] = ['DESIGN', 'BUILD', 'OPERATE', 'PROTECT'];

  const filteredSolutions = OCTAVE_PORTFOLIO.filter(sol => {
    // Only show direct portfolio solutions in the browse view
    if (sol.pillar === 'MIDDLEWARE' || sol.pillar === 'THIRD_PARTY') return false;
    
    const matchesPillar = sol.pillar === selectedPillar;
    const matchesSearch = 
      sol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sol.legacyDescription && sol.legacyDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sol.replacesWith && sol.replacesWith.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesPillar && (searchQuery ? matchesSearch : true);
  });

  // Dynamic Lucide Icon Component
  const LucideIcon = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.HelpCircle className={className} />;
    return <IconComponent className={className} />;
  };

  return (
    <div id="solution-directory-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
      {/* Sidebar: Pillar Selection & Search */}
      <div id="dir-sidebar" className="lg:col-span-4 flex flex-col gap-5">
        {/* Search */}
        <div id="dir-search-container" className="relative">
          <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            id="dir-search-input"
            type="text"
            placeholder="Search Octave portfolio or legacy names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          {searchQuery && (
            <button
              id="dir-search-clear"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Pillars selector */}
        <div id="dir-pillars-grid" className="grid grid-cols-2 gap-2.5">
          {pillars.map((p) => {
            const meta = PILLAR_META[p];
            const isSelected = selectedPillar === p;
            return (
              <button
                id={`dir-pillar-btn-${p}`}
                key={p}
                onClick={() => {
                  setSelectedPillar(p);
                  setSearchQuery('');
                  const firstSol = OCTAVE_PORTFOLIO.find(s => s.pillar === p);
                  setSelectedSolution(firstSol || null);
                }}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-500/40 bg-neutral-900/80 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                    : 'border-white/10 bg-neutral-900/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-md ${meta.bg}`}>
                    <LucideIcon name={OCTAVE_PORTFOLIO.find(s => s.pillar === p)?.icon || 'HelpCircle'} className={`w-3.5 h-3.5 ${meta.text}`} />
                  </div>
                  <span className={`text-[9px] font-mono tracking-widest uppercase ${meta.text}`}>{meta.title}</span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-1 leading-tight">{meta.description}</p>
              </button>
            );
          })}
        </div>

        {/* Solutions List */}
        <div id="dir-solutions-list" className="flex-1 bg-neutral-900/20 border border-white/10 rounded-xl p-4 overflow-y-auto max-h-[400px] lg:max-h-[500px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              [ {PILLAR_META[selectedPillar].title} SOLUTIONS — {filteredSolutions.length} ]
            </span>
          </div>

          {filteredSolutions.length === 0 ? (
            <div className="text-center py-8 text-neutral-600 text-xs">
              No solutions match your search.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSolutions.map((sol) => {
                const isSelected = selectedSolution?.id === sol.id;
                const meta = PILLAR_META[selectedPillar];
                return (
                  <button
                    id={`dir-solution-item-${sol.id}`}
                    key={sol.id}
                    onClick={() => setSelectedSolution(sol)}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0a0a0a] border border-white/10 shadow-sm'
                        : 'border border-transparent hover:bg-neutral-900/30'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${meta.bg} mt-0.5`}>
                      <LucideIcon name={sol.icon} className={`w-3.5 h-3.5 ${meta.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-neutral-200 truncate">{sol.name}</span>
                        <Icons.ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5 leading-normal">{sol.description}</p>
                      {sol.legacyDescription && (
                        <p className="text-[10px] text-sky-400/80 font-mono mt-1 uppercase tracking-tight">{sol.legacyDescription}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Panel: Selected Solution Deep-Dive */}
      <div id="dir-main-panel" className="lg:col-span-8 bg-neutral-900/30 border border-white/10 rounded-xl p-6 flex flex-col gap-6">
        {selectedSolution ? (
          <>
            {/* Header */}
            <div id="dir-deep-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${PILLAR_META[selectedSolution.pillar].bg} border ${PILLAR_META[selectedSolution.pillar].border}`}>
                  <LucideIcon name={selectedSolution.icon} className={`w-6 h-6 ${PILLAR_META[selectedSolution.pillar].text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white tracking-tight">{selectedSolution.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border bg-[#0a0a0a] ${PILLAR_META[selectedSolution.pillar].border} ${PILLAR_META[selectedSolution.pillar].text}`}>
                      {selectedSolution.pillar}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 font-bold tracking-widest uppercase">
                    {selectedSolution.category}
                  </p>
                </div>
              </div>

              {onAddToCanvas && (
                <button
                  id={`dir-add-to-canvas-btn-${selectedSolution.id}`}
                  onClick={() => onAddToCanvas(selectedSolution.id)}
                  className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-lg font-bold text-xs uppercase tracking-tighter flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
                >
                  <Icons.Plus className="w-4 h-4" />
                  Place on Canvas
                </button>
              )}
            </div>

            {/* Content Body */}
            <div id="dir-deep-body" className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-y-auto pr-1">
              {/* Description & Legacy Mapping */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-2">[ CAPABILITIES SYNOPSIS ]</h4>
                  <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                    {selectedSolution.description}
                  </p>
                </div>

                {selectedSolution.replacesWith && selectedSolution.replacesWith.length > 0 && (
                  <div className="bg-[#0a0a0a]/60 border border-white/10 rounded-xl p-5">
                    <h5 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-3 flex items-center gap-1.5">
                      <Icons.Info className="w-3.5 h-3.5 text-sky-400" />
                      [ LEGACY REPLACEMENT MAPPING ]
                    </h5>
                    <div className="space-y-3">
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        This modern unified solution replaces and consolidates these legacy enterprise applications:
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedSolution.replacesWith.map((legacyName, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#0a0a0a] text-sky-400 border border-sky-500/20"
                          >
                            {legacyName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Suite Detail */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                  [ SOLUTIONS & SUB-SYSTEMS — {selectedSolution.products.length} ]
                </h4>
                <div className="flex-1 border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-900/80 border-b border-white/10 text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                        <th className="px-4 py-3">Sub-System Name</th>
                        <th className="px-4 py-3">Legacy Asset</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {selectedSolution.products.map((prod, idx) => (
                        <tr key={idx} className="hover:bg-neutral-900/30 text-xs">
                          <td className="px-4 py-3.5 font-bold text-neutral-200">{prod.name}</td>
                          <td className="px-4 py-3.5 text-neutral-400 italic">
                            {prod.legacyName ? prod.legacyName : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
            <Icons.FolderGit className="w-12 h-12 text-neutral-700 mb-2" />
            <p className="text-sm font-mono">[ SELECT A SOLUTION FOR DETAILS ]</p>
          </div>
        )}
      </div>
    </div>
  );
}
