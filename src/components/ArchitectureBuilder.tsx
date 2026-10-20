import React, { useState, useRef, useEffect } from 'react';
import { 
  CanvasNode, 
  CanvasIntegration, 
  OCTAVE_PORTFOLIO, 
  PILLAR_META, 
  BLUEPRINTS 
} from '../types';
import * as Icons from 'lucide-react';

interface ArchitectureBuilderProps {
  onNodeSelect?: (solId: string) => void;
  onRequestFollowUp?: (components: CanvasNode[], integrations: CanvasIntegration[]) => void;
  externalAddSignal?: string | null;
  onCanvasChange?: (components: CanvasNode[], integrations: CanvasIntegration[]) => void;
}

export default function ArchitectureBuilder({ 
  onNodeSelect, 
  onRequestFollowUp, 
  externalAddSignal, 
  onCanvasChange 
}: ArchitectureBuilderProps) {
  // Default Blueprint selection: Information Management Platform (index 0)
  const [activeBlueprintIdx, setActiveBlueprintIdx] = useState<number | null>(0);

  // Default Initial Canvas Topology: Information Management Platform
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([
    { id: 'node-inconcert', solutionId: 'node-inconcert', name: 'Octave InConcert', pillar: 'DESIGN', x: 65, y: 50 },
    { id: 'node-forte', solutionId: 'node-forte', name: 'Octave Forte', pillar: 'DESIGN', x: 25, y: 30 },
    { id: 'node-facets', solutionId: 'node-facets', name: 'Octave Facets', pillar: 'DESIGN', x: 25, y: 70 }
  ]);

  const [integrations, setIntegrations] = useState<CanvasIntegration[]>([
    { id: 'int-1', sourceId: 'node-forte', targetId: 'node-inconcert', direction: 'unidirectional', protocol: 'Native Direct Connector / REST', purpose: 'Direct 3D spatial models & tag attribute export into InConcert' },
    { id: 'int-2', sourceId: 'node-facets', targetId: 'node-inconcert', direction: 'unidirectional', protocol: 'Native Direct Connector / OData', purpose: 'Direct 2D P&ID schematics & instrument index export into InConcert' }
  ]);

  // Synchronize canvas state changes with parent
  useEffect(() => {
    if (onCanvasChange) {
      onCanvasChange(canvasNodes, integrations);
    }
  }, [canvasNodes, integrations]);

  // Handle external add requests (clear canvas and populate only with sent solution)
  useEffect(() => {
    if (externalAddSignal) {
      handleSendToEmptyCanvas(externalAddSignal);
    }
  }, [externalAddSignal]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-inconcert');
  
  // Drag State
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ clientX: 0, clientY: 0 });
  const [nodeStartPos, setNodeStartPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Orchestrator Builder States
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [direction, setDirection] = useState<'unidirectional' | 'bidirectional'>('unidirectional');
  const [protocol, setProtocol] = useState('REST Web Service');
  const [purpose, setPurpose] = useState('Exchanging operational metrics');

  // Palette Search Query
  const [paletteQuery, setPaletteQuery] = useState('');

  // AI Review Loading state
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [isAiReviewLoading, setIsAiReviewLoading] = useState(false);

  // Auto-fill form inputs when selecting nodes
  useEffect(() => {
    if (selectedNodeId) {
      if (!sourceId) {
        setSourceId(selectedNodeId);
      } else if (sourceId && sourceId !== selectedNodeId && !targetId) {
        setTargetId(selectedNodeId);
      }
    }
  }, [selectedNodeId]);

  // Load a Blueprint Template
  const loadBlueprint = (blueprintIdx: number) => {
    setActiveBlueprintIdx(blueprintIdx);
    const template = BLUEPRINTS[blueprintIdx];
    if (!template) return;
    
    const nextNodes = template.nodes.map((n, i) => {
      const sol = OCTAVE_PORTFOLIO.find(s => s.id === n.solutionId);
      return {
        id: `node-${n.solutionId}-${i}-${Date.now()}`,
        solutionId: n.solutionId,
        name: sol?.name || 'System Node',
        pillar: sol?.pillar || 'DESIGN',
        x: n.x,
        y: n.y
      };
    });

    const nextInts = template.integrations.map((it, i) => {
      return {
        id: `int-${i}-${Date.now()}`,
        sourceId: nextNodes[it.sourceIdx]?.id || '',
        targetId: nextNodes[it.targetIdx]?.id || '',
        direction: it.direction,
        protocol: it.protocol,
        purpose: it.purpose
      };
    }).filter(it => it.sourceId && it.targetId);

    setCanvasNodes(nextNodes);
    setIntegrations(nextInts);
    setSelectedNodeId(nextNodes[0]?.id || null);
    setAiReview(null);
    setSourceId('');
    setTargetId('');
  };

  // Send a solution from directory/matrix to an empty canvas
  const handleSendToEmptyCanvas = (solId: string) => {
    const sol = OCTAVE_PORTFOLIO.find(s => 
      s.id === solId || 
      s.id === `node-${solId}` || 
      s.name.toLowerCase().includes(solId.toLowerCase())
    );
    if (!sol) return;

    const newNode: CanvasNode = {
      id: `${sol.id}-${Date.now()}`,
      solutionId: sol.id,
      name: sol.name,
      pillar: sol.pillar,
      x: 50,
      y: 45
    };

    setActiveBlueprintIdx(null);
    setCanvasNodes([newNode]);
    setIntegrations([]);
    setSelectedNodeId(newNode.id);
    setSourceId(newNode.id);
    setTargetId('');
    setAiReview(null);
  };

  // Add item from Palette
  const handleAddFromPalette = (solId: string) => {
    const sol = OCTAVE_PORTFOLIO.find(s => s.id === solId);
    if (!sol) return;

    const instances = canvasNodes.filter(n => n.solutionId === solId).length;
    const suffix = instances > 0 ? ` ${instances + 1}` : '';
    const nameWithSuffix = `${sol.name}${suffix}`;

    const newNode: CanvasNode = {
      id: `${solId}-${Date.now()}`,
      solutionId: solId,
      name: nameWithSuffix,
      pillar: sol.pillar,
      x: 35 + Math.floor(Math.random() * 30),
      y: 35 + Math.floor(Math.random() * 30)
    };

    setCanvasNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setAiReview(null);
  };

  // Delete node
  const handleDeleteNode = (nodeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCanvasNodes(prev => prev.filter(n => n.id !== nodeId));
    setIntegrations(prev => prev.filter(i => i.sourceId !== nodeId && i.targetId !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    setAiReview(null);
  };

  // Create an integration
  const handleBindIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    const duplicate = integrations.some(i => 
      (i.sourceId === sourceId && i.targetId === targetId) ||
      (i.sourceId === targetId && i.targetId === sourceId)
    );
    if (duplicate) {
      alert("An integration link already exists between these two components.");
      return;
    }

    const newInt: CanvasIntegration = {
      id: `int-${Date.now()}`,
      sourceId,
      targetId,
      direction,
      protocol,
      purpose: purpose || 'Exchanging data & commands'
    };

    setIntegrations(prev => [...prev, newInt]);
    setPurpose('');
    setAiReview(null);
  };

  // Delete integration
  const handleDeleteIntegration = (intId: string) => {
    setIntegrations(prev => prev.filter(i => i.id !== intId));
    setAiReview(null);
  };

  // Clear Canvas
  const handleResetCanvas = () => {
    setActiveBlueprintIdx(null);
    setCanvasNodes([]);
    setIntegrations([]);
    setSelectedNodeId(null);
    setAiReview(null);
    setSourceId('');
    setTargetId('');
  };

  // Export Canvas as JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ canvasNodes, integrations }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `octave-architecture-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export Canvas as SVG
  const handleExportSVG = () => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    let nodesSVG = '';
    let linksSVG = '';

    integrations.forEach(link => {
      const src = canvasNodes.find(n => n.id === link.sourceId);
      const tgt = canvasNodes.find(n => n.id === link.targetId);
      if (!src || !tgt) return;

      const x1 = (src.x / 100) * width;
      const y1 = (src.y / 100) * height;
      const x2 = (tgt.x / 100) * width;
      const y2 = (tgt.y / 100) * height;

      linksSVG += `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="4" />
        <rect x="${(x1 + x2) / 2 - 35}" y="${(y1 + y2) / 2 - 10}" width="70" height="20" rx="4" fill="#090d16" stroke="#0284c7" stroke-width="1" />
        <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + 3}" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${link.protocol}</text>
      `;
    });

    canvasNodes.forEach(node => {
      const cx = (node.x / 100) * width;
      const cy = (node.y / 100) * height;
      const color = PILLAR_META[node.pillar]?.color || '#38bdf8';

      nodesSVG += `
        <rect x="${cx - 70}" y="${cy - 30}" width="140" height="60" rx="8" fill="#090d16" stroke="${color}" stroke-width="2" />
        <rect x="${cx - 70}" y="${cy - 30}" width="140" height="4" fill="${color}" />
        <text x="${cx}" y="${cy - 10}" fill="${color}" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">${node.pillar}</text>
        <text x="${cx}" y="${cy + 12}" fill="#f1f5f9" font-size="11" font-family="sans-serif" font-weight="800" text-anchor="middle">${node.name}</text>
      `;
    });

    const fullSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background:#04070d;">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#111827" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        ${linksSVG}
        ${nodesSVG}
      </svg>
    `;

    const blob = new Blob([fullSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `octave-architecture-diagram-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Pointer drag handlers
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, nodeId: string) => {
    const isTouch = 'touches' in e;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    
    setDraggingId(nodeId);
    setDragStart({ clientX, clientY });
    
    const node = canvasNodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNodeId(nodeId);
      setNodeStartPos({ x: node.x, y: node.y });
      if (onNodeSelect) {
        onNodeSelect(node.solutionId);
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const isTouch = 'touches' in e;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const dx = ((clientX - dragStart.clientX) / rect.width) * 100;
    const dy = ((clientY - dragStart.clientY) / rect.height) * 100;

    setCanvasNodes(prev => prev.map(node => {
      if (node.id === draggingId) {
        const newX = Math.max(5, Math.min(95, nodeStartPos.x + dx));
        const newY = Math.max(5, Math.min(95, nodeStartPos.y + dy));
        return { ...node, x: newX, y: newY };
      }
      return node;
    }));
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  // Selected Node Metadata
  const selectedNode = canvasNodes.find(n => n.id === selectedNodeId);
  const selectedSol = selectedNode 
    ? OCTAVE_PORTFOLIO.find(s => s.id === selectedNode.solutionId) 
    : null;

  // Dynamic Lucide Icon
  const LucideIcon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.Layers className={className} style={style} />;
    return <IconComponent className={className} style={style} />;
  };

  // Group portfolio by category for palette
  const coreOctaveSystems = OCTAVE_PORTFOLIO.filter(s => s.pillar === 'DESIGN' || s.pillar === 'BUILD' || s.pillar === 'OPERATE' || s.pillar === 'PROTECT');
  const middlewareSystems = OCTAVE_PORTFOLIO.filter(s => s.pillar === 'MIDDLEWARE');
  const targetSystems = OCTAVE_PORTFOLIO.filter(s => s.pillar === 'THIRD_PARTY');

  return (
    <div id="arch-builder-root" className="flex flex-col gap-5 w-full bg-[#060911] text-white p-4 sm:p-6 rounded-2xl border border-sky-900/30 shadow-2xl font-sans">
      
      {/* ================= TOP HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Icons.Layers className="w-6 h-6 text-sky-400" />
              OCTAVE ARCHITECTURE BUILDER
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400 text-sky-300 font-mono text-[10px] font-bold uppercase tracking-widest">
              INTERACTIVE CANVAS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-widest">
              LIVE TOPOLOGY ENGINE
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-4xl leading-relaxed">
            Drag, tap, and connect Octave core solutions, middleware data bridges, and enterprise ERP endpoints with real-time protocol flow simulation.
          </p>
        </div>

        {/* Top Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportSVG}
            className="px-3 py-1.5 bg-[#0e1726] hover:bg-[#162238] border border-sky-500/30 text-sky-300 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Icons.Download className="w-3.5 h-3.5" />
            Export Graphic (SVG)
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-[#0e1726] hover:bg-[#162238] border border-sky-500/30 text-sky-300 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Icons.FolderGit className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={handleResetCanvas}
            className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Icons.RotateCcw className="w-3.5 h-3.5" />
            Reset Canvas
          </button>
        </div>
      </div>

      {/* ================= PRE-BUILT BLUEPRINT TEMPLATES ROW ================= */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0a0f1d]/80 border border-white/10 p-3 rounded-xl">
        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 mr-1">
          <Icons.LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
          PRE-BUILT BLUEPRINT TEMPLATES:
        </span>

        {BLUEPRINTS.map((bp, idx) => {
          const isActive = activeBlueprintIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => loadBlueprint(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm group ${
                isActive
                  ? 'bg-sky-500/25 border border-sky-400 text-white ring-1 ring-sky-400/50 shadow-sky-500/20'
                  : 'bg-[#0e1729] hover:bg-[#16243f] border border-sky-500/30 text-sky-200 hover:text-white'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)]' : 'bg-sky-400/60 group-hover:animate-ping'
                }`}
              />
              <span>{bp.name}</span>
              {isActive && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-400 text-black font-black uppercase tracking-wider ml-0.5">
                  Default
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= THREE COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* ---------------- 1. DRAG & DROP PALETTE (LEFT SIDEBAR) ---------------- */}
        <div className="xl:col-span-3 bg-[#0a0f1d]/90 border border-white/10 rounded-xl p-4 flex flex-col gap-4 max-h-[640px]">
          <div>
            <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <Icons.Boxes className="w-4 h-4 text-sky-400" />
              1. DRAG & DROP PALETTE
            </h3>
            <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">
              Drag items onto canvas to deploy into your integration framework.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Filter palette products..."
              value={paletteQuery}
              onChange={(e) => setPaletteQuery(e.target.value)}
              className="w-full bg-[#050811] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Palette Items Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            
            {/* CORE OCTAVE SYSTEMS */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                CORE OCTAVE SYSTEMS
              </span>
              <div className="space-y-1.5">
                {coreOctaveSystems
                  .filter(s => s.name.toLowerCase().includes(paletteQuery.toLowerCase()))
                  .map((sol) => {
                    const meta = PILLAR_META[sol.pillar];
                    return (
                      <div
                        key={sol.id}
                        className="group flex items-center justify-between p-2 rounded-lg border border-white/10 bg-[#060a14] hover:bg-[#0c1426] hover:border-sky-500/40 transition-all cursor-pointer"
                        onClick={() => handleAddFromPalette(sol.id)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-1.5 py-0.5 text-[8px] font-mono font-extrabold rounded border ${meta?.bg} ${meta?.border} ${meta?.text}`}>
                            {sol.pillar}
                          </span>
                          <span className="font-bold text-neutral-200 truncate group-hover:text-white">
                            {sol.name}
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddFromPalette(sol.id); }}
                          className="p-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-black transition-all cursor-pointer"
                        >
                          <Icons.Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* ORCHESTRATE INTEGRATIONS & INTEGRATORS */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                MIDDLEWARE & INTEGRATORS
              </span>
              <div className="space-y-1.5">
                {middlewareSystems.map((sol) => (
                  <div
                    key={sol.id}
                    className="group flex items-center justify-between p-2 rounded-lg border border-purple-500/30 bg-[#0d091a] hover:bg-[#181130] transition-all cursor-pointer"
                    onClick={() => handleAddFromPalette(sol.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 text-[8px] font-mono font-extrabold rounded border bg-purple-500/20 border-purple-500/40 text-purple-300">
                        MIDDLEWARE
                      </span>
                      <span className="font-bold text-purple-200 truncate group-hover:text-white">
                        {sol.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddFromPalette(sol.id); }}
                      className="p-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-black transition-all cursor-pointer"
                    >
                      <Icons.Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* TARGET SYSTEMS & 3RD PARTY CONNECTORS */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-pink-400 uppercase tracking-wider block">
                  3RD PARTY TARGET SYSTEMS ({targetSystems.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {targetSystems
                  .filter(s => s.name.toLowerCase().includes(paletteQuery.toLowerCase()) || s.category.toLowerCase().includes(paletteQuery.toLowerCase()))
                  .map((sol) => (
                    <div
                      key={sol.id}
                      className="group flex items-center justify-between p-2 rounded-lg border border-pink-500/30 bg-[#160814] hover:bg-[#2b0f28] transition-all cursor-pointer"
                      onClick={() => handleAddFromPalette(sol.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[8px] font-mono font-extrabold rounded border bg-pink-500/20 border-pink-500/40 text-pink-300 shrink-0">
                          3RD PARTY
                        </span>
                        <span className="font-bold text-pink-200 truncate group-hover:text-white text-xs">
                          {sol.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddFromPalette(sol.id); }}
                        className="p-1 rounded bg-pink-500/20 text-pink-300 hover:bg-pink-500 hover:text-black transition-all cursor-pointer shrink-0"
                      >
                        <Icons.Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>

        {/* ---------------- 2. INTERACTIVE CANVAS (MIDDLE COLUMN) ---------------- */}
        <div className="xl:col-span-6 flex flex-col gap-4">
          
          {/* Main Stage Area */}
          <div 
            ref={canvasRef}
            onMouseMove={handlePointerMove}
            onTouchMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchEnd={handlePointerUp}
            className="relative min-h-[480px] xl:min-h-[520px] bg-[#04070d] border border-sky-900/40 rounded-2xl overflow-hidden shadow-2xl select-none"
            style={{
              backgroundImage: 'radial-gradient(#1e293b 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Empty Canvas Placeholder */}
            {canvasNodes.length === 0 && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                <div className="bg-[#090f1d]/90 border border-sky-500/30 rounded-2xl p-6 max-w-md shadow-2xl pointer-events-auto space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400 flex items-center justify-center mx-auto">
                    <Icons.Compass className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Canvas Stage Ready</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Select a system from the left palette to add nodes, or load an example architecture from the blueprint templates above.
                  </p>
                </div>
              </div>
            )}

            {/* Instruction Overlay Tag */}
            <div className="absolute top-3 left-3 z-30 bg-[#090f1d]/90 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-mono text-neutral-300 flex items-center gap-1.5 shadow-md">
              <Icons.Move className="w-3.5 h-3.5 text-sky-400" />
              <span>Drag systems on stage to rearrange. Click system to inspect detail.</span>
            </div>

            {/* SVG Connector Lines with Animated Data Stream Flow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                {/* Forward Arrow (End) */}
                <marker
                  id="arrow-cyan"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#00e5ff" />
                </marker>
                {/* Reverse Arrow (Start for Bidirectional) */}
                <marker
                  id="arrow-cyan-start"
                  viewBox="0 0 10 10"
                  refX="-12"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 10 1 L 0 5 L 10 9 z" fill="#00e5ff" />
                </marker>
                {/* Purple Markers */}
                <marker
                  id="arrow-purple"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#e040fb" />
                </marker>
                <marker
                  id="arrow-purple-start"
                  viewBox="0 0 10 10"
                  refX="-12"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 10 1 L 0 5 L 10 9 z" fill="#e040fb" />
                </marker>
              </defs>

              {integrations.map((link) => {
                const src = canvasNodes.find(n => n.id === link.sourceId);
                const tgt = canvasNodes.find(n => n.id === link.targetId);
                if (!src || !tgt) return null;

                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return null;

                const x1 = (src.x / 100) * rect.width;
                const y1 = (src.y / 100) * rect.height;
                const x2 = (tgt.x / 100) * rect.width;
                const y2 = (tgt.y / 100) * rect.height;

                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                const isTargetOrOperate = link.protocol.includes('OPC') || link.protocol.includes('JSON') || link.protocol.includes('IDOC') || link.protocol.includes('Kafka');
                const streamColor = isTargetOrOperate ? '#e040fb' : '#00e5ff';
                const markerEnd = isTargetOrOperate ? 'url(#arrow-purple)' : 'url(#arrow-cyan)';
                const markerStart = link.direction === 'bidirectional' 
                  ? (isTargetOrOperate ? 'url(#arrow-purple-start)' : 'url(#arrow-cyan-start)') 
                  : undefined;

                return (
                  <g key={link.id} className="pointer-events-auto">
                    {/* Background Link Line */}
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      stroke="#1e293b"
                      strokeWidth="3"
                      markerEnd={markerEnd}
                      markerStart={markerStart}
                      fill="none"
                      className="cursor-pointer hover:stroke-sky-400 transition-colors"
                      onClick={() => {
                        if (confirm(`Connection: ${src.name} ${link.direction === 'bidirectional' ? '↔' : '→'} ${tgt.name} (${link.protocol})\nPurpose: ${link.purpose}\n\nRemove this link?`)) {
                          handleDeleteIntegration(link.id);
                        }
                      }}
                    />

                    {/* Animated Streaming Flow Dot Path */}
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      stroke={streamColor}
                      strokeWidth="3.5"
                      strokeDasharray="8 24"
                      fill="none"
                      className="pointer-events-none animate-stream"
                      style={{ strokeLinecap: 'round' }}
                    />

                    {/* Protocol & Direction Badge at Midpoint */}
                    <foreignObject
                      x={midX - 110}
                      y={midY - 16}
                      width="220"
                      height="32"
                      className="overflow-visible pointer-events-none"
                    >
                      <div className="flex items-center justify-center h-full">
                        <span 
                          title={`${link.direction === 'bidirectional' ? 'Bidirectional' : 'Unidirectional'} Link: ${link.purpose}`}
                          className={`bg-[#080d1a]/95 border text-[9px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md shadow-xl flex items-center gap-1.5 whitespace-nowrap backdrop-blur-sm ${
                            link.direction === 'bidirectional'
                              ? 'border-purple-400/80 text-purple-200 bg-purple-950/50 shadow-purple-950/40'
                              : 'border-sky-400/80 text-sky-200 bg-sky-950/50 shadow-sky-950/40'
                          }`}
                        >
                          <span className={link.direction === 'bidirectional' ? 'text-purple-300 font-black text-[10px]' : 'text-sky-300 font-black text-[10px]'}>
                            {link.direction === 'bidirectional' ? '⇆' : '→'}
                          </span>
                          <span className="whitespace-nowrap">{link.protocol}</span>
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>

            {/* Canvas Nodes */}
            {canvasNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const meta = PILLAR_META[node.pillar];
              const colorAccent = meta?.color || '#38bdf8';

              const isMiddleware = node.pillar === 'MIDDLEWARE';
              const isTarget = node.pillar === 'THIRD_PARTY';

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handlePointerDown(e, node.id)}
                  onTouchStart={(e) => handlePointerDown(e, node.id)}
                  className={`absolute z-20 w-36 sm:w-40 -translate-x-1/2 -translate-y-1/2 bg-[#090f1f]/95 rounded-lg border p-2 shadow-lg transition-all cursor-grab active:cursor-grabbing select-none overflow-hidden ${
                    isSelected ? 'scale-105 shadow-2xl ring-1 ring-sky-400' : 'hover:scale-[1.02]'
                  } ${
                    isMiddleware
                      ? 'border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-gradient-to-b from-[#180f33] to-[#0a0717]'
                      : isTarget
                      ? 'border-pink-500/80 shadow-[0_0_15px_rgba(236,72,153,0.2)] bg-[#1a0918]'
                      : ''
                  }`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    borderColor: isSelected ? colorAccent : isMiddleware ? '#a855f7' : isTarget ? '#ec4899' : 'rgba(255,255,255,0.18)',
                    boxShadow: isSelected ? `0 0 15px ${colorAccent}55` : undefined
                  }}
                >
                  {/* Pillar Tag Pill */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[7.5px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border ${meta?.bg} ${meta?.text}`}
                      style={{ borderColor: `${colorAccent}44` }}
                    >
                      {node.pillar}
                    </span>

                    <button
                      onClick={(e) => handleDeleteNode(node.id, e)}
                      className="text-neutral-500 hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
                      title="Remove node"
                    >
                      <Icons.X className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* System Title */}
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-black/50 border border-white/10 shrink-0">
                      <LucideIcon name={node.pillar === 'MIDDLEWARE' ? 'Shuffle' : node.pillar === 'THIRD_PARTY' ? 'Database' : 'Layers'} className="w-3.5 h-3.5" style={{ color: colorAccent }} />
                    </div>
                    <span className="font-extrabold text-xs text-white tracking-tight leading-tight truncate">
                      {node.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {canvasNodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-2">
                <Icons.Compass className="w-10 h-10 stroke-1 text-neutral-600 animate-pulse" />
                <p className="text-xs font-mono font-bold uppercase tracking-widest">[ CANVAS IS EMPTY ]</p>
                <p className="text-[11px] text-neutral-500">Add products from left palette or select a blueprint above.</p>
              </div>
            )}
          </div>

          {/* Connection Orchestrator Form */}
          <div className="bg-[#0a0f1d]/90 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <Icons.ArrowLeftRight className="w-4 h-4 text-indigo-400" />
              2. ORCHESTRATE INTEGRATIONS & INTEGRATORS
            </span>

            <form onSubmit={handleBindIntegration} className="flex flex-col gap-3">
              {/* Row 1: Source, Direction, Target, Interface Protocol (4 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* 1. SOURCE SYSTEM */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold tracking-wider">
                    SOURCE SYSTEM
                  </label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="bg-[#050811] border border-white/15 rounded-lg px-2.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="">Select source...</option>
                    {canvasNodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. DIRECTION (Unidirectional vs Bidirectional) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold tracking-wider">
                    DIRECTION
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as 'unidirectional' | 'bidirectional')}
                    className="bg-[#050811] border border-white/15 rounded-lg px-2.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="unidirectional">Unidirectional (A → B)</option>
                    <option value="bidirectional">Bidirectional (A ↔ B)</option>
                  </select>
                </div>

                {/* 3. TARGET SYSTEM */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold tracking-wider">
                    TARGET SYSTEM
                  </label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="bg-[#050811] border border-white/15 rounded-lg px-2.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="">Select target...</option>
                    {canvasNodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>

                {/* 4. INTERFACE PROTOCOL */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold tracking-wider">
                    INTERFACE PROTOCOL
                  </label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="bg-[#050811] border border-white/15 rounded-lg px-2.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="REST Web Service">REST Web Service</option>
                    <option value="gRPC / Protobuf">gRPC / Protobuf</option>
                    <option value="Kafka Event Stream">Kafka Event Stream</option>
                    <option value="OData v4 / REST">OData v4 / REST</option>
                    <option value="IDOC RFC (SAP)">IDOC RFC (SAP)</option>
                    <option value="OPC UA / Modbus">OPC UA / Modbus</option>
                    <option value="GraphQL Endpoint">GraphQL Endpoint</option>
                    <option value="SFTP / Batch File">SFTP / Batch File</option>
                    <option value="Direct DB Link">Direct DB Link</option>
                    <option value="MQTT Telemetry">MQTT Telemetry</option>
                    <option value="JSON / HTTPS">JSON / HTTPS</option>
                    <option value="SOAP WebService">SOAP WebService</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Integration Purpose / Description + Bind Integration Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 pt-1">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase font-bold tracking-wider">
                    INTEGRATION PURPOSE / DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Exchanging operational metrics, real-time telemetry, work orders..."
                    className="bg-[#050811] border border-white/15 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="shrink-0">
                  <button
                    type="submit"
                    disabled={!sourceId || !targetId || sourceId === targetId}
                    className="w-full sm:w-auto px-6 py-2 bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer h-[34px]"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    + BIND INTEGRATION
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* ---------------- 3. COMPONENT INSPECTOR (RIGHT SIDEBAR) ---------------- */}
        <div className="xl:col-span-3 bg-[#0a0f1d]/90 border border-white/10 rounded-xl p-4 flex flex-col gap-4 min-h-[500px]">
          <div>
            <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <Icons.FileSearch className="w-4 h-4 text-sky-400" />
              3. COMPONENT INSPECTOR
            </h3>
          </div>

          {selectedNode && selectedSol ? (
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
              
              {/* Pillar Badge & Title */}
              <div className="space-y-1 border-b border-white/10 pb-3">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[9px] font-extrabold uppercase border border-sky-500/30">
                  PILLAR: {selectedNode.pillar}
                </span>
                <h4 className="text-lg font-black text-white mt-1">{selectedNode.name}</h4>
                <p className="text-neutral-300 leading-relaxed text-xs">
                  {selectedSol.description}
                </p>
              </div>

              {/* Sub-capabilities / Products */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                  Capabilities
                </span>
                <div className="p-2.5 rounded-lg bg-[#050811] border border-white/10 text-neutral-300 leading-relaxed text-xs font-sans">
                  {selectedSol.products.map(p => p.name).join(', ')}
                </div>
              </div>

              {/* Connected Active Interfaces & Direction */}
              {(() => {
                const nodeIntegrations = integrations.filter(
                  i => i.sourceId === selectedNode.id || i.targetId === selectedNode.id
                );
                return (
                  <div className="space-y-2 pt-1 border-t border-white/10">
                    <span className="text-[9px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Connected Interfaces ({nodeIntegrations.length})</span>
                      <span className="text-[8px] text-neutral-500 font-sans">Click ⇆ to toggle mode</span>
                    </span>

                    {nodeIntegrations.length === 0 ? (
                      <p className="text-[11px] text-neutral-500 italic">No integration links connected yet.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {nodeIntegrations.map((link) => {
                          const isSource = link.sourceId === selectedNode.id;
                          const otherNode = canvasNodes.find(n => n.id === (isSource ? link.targetId : link.sourceId));
                          return (
                            <div
                              key={link.id}
                              className="p-2 rounded-lg bg-[#050811] border border-white/10 flex flex-col gap-1 text-[11px]"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <span className="text-white truncate">{otherNode?.name || 'External'}</span>
                                  <button
                                    onClick={() => {
                                      setIntegrations(prev => prev.map(item => {
                                        if (item.id === link.id) {
                                          return {
                                            ...item,
                                            direction: item.direction === 'bidirectional' ? 'unidirectional' : 'bidirectional'
                                          };
                                        }
                                        return item;
                                      }));
                                    }}
                                    title="Click to toggle between Bidirectional and Unidirectional"
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase border flex items-center gap-1 cursor-pointer transition-colors ${
                                      link.direction === 'bidirectional'
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30'
                                    }`}
                                  >
                                    <span>{link.direction === 'bidirectional' ? '⇆ Bi-directional' : '→ Uni-directional'}</span>
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleDeleteIntegration(link.id)}
                                  className="text-neutral-500 hover:text-red-400 p-0.5 cursor-pointer"
                                  title="Delete connection"
                                >
                                  <Icons.Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400">
                                <span className="text-indigo-300 font-bold">{link.protocol}</span>
                                <span className="truncate max-w-[120px] text-neutral-400" title={link.purpose}>
                                  {link.purpose}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Replaces / Competes With */}
              {selectedSol.replacesWith && selectedSol.replacesWith.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                    Replaces / Competes with
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#050811] border border-amber-500/20 text-amber-300 leading-relaxed text-xs font-mono">
                    {selectedSol.replacesWith.join(', ')}
                  </div>
                </div>
              )}

              {/* ID & Position */}
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-white/5">
                <span>ID: <strong className="text-neutral-200">{selectedNode.id}</strong></span>
                <span>Position: <strong className="text-sky-400">X:{Math.round(selectedNode.x)}% Y:{Math.round(selectedNode.y)}%</strong></span>
              </div>

              {/* DESIGN COMPLIANCE RATING */}
              <div className="p-3 rounded-xl bg-[#050811] border border-sky-500/30 space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                    DESIGN COMPLIANCE RATING
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-400">
                    98 / 100
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                    <Icons.CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">High Interoperability</h5>
                    <p className="text-[10px] text-neutral-400">Full API & Protocol Isolation</p>
                  </div>
                </div>
              </div>

              {/* PRE-SALES PRESALE SYNOPSIS */}
              <div className="p-3 rounded-xl bg-[#050811] border border-purple-500/30 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase block">
                  PRE-SALES PRESALE SYNOPSIS
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Utilizing central DataBridge middleware creates fully compliance-safe REST and API traffic isolation, protecting live data flow and operational network integrity.
                </p>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 text-center text-xs p-4 gap-2">
              <Icons.MousePointerClick className="w-8 h-8 text-neutral-700" />
              <p>Select any node on stage to inspect detailed specifications, competitors replaced, and position ratings.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
