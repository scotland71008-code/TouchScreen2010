import React, { useRef, useState } from 'react';
import * as Icons from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CERTIFICATE_POSITIONS } from '../utils/certificateConfig';

export interface Top3WinnerData {
  rank: number;
  name: string;
  organization?: string;
  specialization?: string;
  company?: string;
  position?: string;
  email?: string;
  score?: number;
}

interface OfficialAchievementCertificateProps {
  winner: Top3WinnerData;
  dateStr?: string;
  onClose?: () => void;
  showModal?: boolean;
}

export default function OfficialAchievementCertificate({
  winner,
  dateStr,
  onClose,
  showModal = true,
}: OfficialAchievementCertificateProps) {
  const certificateContainerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Position calibration state (defaults from CERTIFICATE_POSITIONS)
  const [nameX, setNameX] = useState(CERTIFICATE_POSITIONS.name.x); // 792
  const [nameY, setNameY] = useState(CERTIFICATE_POSITIONS.name.y); // 700 (just above line 710)
  const [dateX, setDateX] = useState(CERTIFICATE_POSITIONS.date.x); // 345
  const [dateY, setDateY] = useState(CERTIFICATE_POSITIONS.date.y); // 1000 (above line 1013)
  const [bodyY, setBodyY] = useState(CERTIFICATE_POSITIONS.bodySentence.y); // 820
  const [includeBodySentence, setIncludeBodySentence] = useState(CERTIFICATE_POSITIONS.bodySentence.enabled);
  const [nameFontSize, setNameFontSize] = useState(CERTIFICATE_POSITIONS.name.fontSize); // 68
  const [showCalibrator, setShowCalibrator] = useState(false);

  const formattedDate = dateStr || new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const org = winner.organization || winner.company || '';
  const spec = winner.specialization || winner.position || '';

  const placeLabel = winner.rank === 1 ? '1st' : winner.rank === 2 ? '2nd' : winner.rank === 3 ? '3rd' : `${winner.rank}th`;
  const placeWord = winner.rank === 1 ? '1st place' : winner.rank === 2 ? '2nd place' : winner.rank === 3 ? '3rd place' : `${winner.rank}th place`;

  const resetToDefaults = () => {
    setNameX(792);
    setNameY(700);
    setDateX(345);
    setDateY(1000);
    setBodyY(820);
    setNameFontSize(68);
    setIncludeBodySentence(true);
  };

  const exportPDF = async () => {
    setIsExporting(true);
    const safeName = (winner.name || `Rank_${winner.rank}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Octave_Certificate_${placeLabel}_Place_${safeName}.pdf`;
    const pdfUrl = `/api/quiz/certificate-pdf?rank=${winner.rank}&name=${encodeURIComponent(winner.name || '')}&organization=${encodeURIComponent(org)}&specialization=${encodeURIComponent(spec)}&email=${encodeURIComponent(winner.email || '')}&score=${winner.score || 0}&nameX=${nameX}&nameY=${nameY}&dateX=${dateX}&dateY=${dateY}&includeBody=${includeBodySentence}`;

    try {
      // 1. Primary: Fetch high-resolution binary PDF directly from server generator
      const res = await fetch(pdfUrl);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }, 1500);
        setIsExporting(false);
        return;
      }
    } catch (apiErr) {
      console.warn('Server PDF fetch failed, attempting client render fallback:', apiErr);
    }

    // 2. Client-side fallback using jsPDF and html2canvas
    try {
      if (certificateContainerRef.current) {
        const canvas = await html2canvas(certificateContainerRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#111217',
          logging: false,
        });

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [1584, 1224],
          hotfixes: ['px_scaling'],
        });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 1584, 1224);
        pdf.save(filename);
        setIsExporting(false);
        return;
      }
    } catch (canvasErr) {
      console.warn('Client canvas render fallback failed:', canvasErr);
    }

    // 3. Ultimate browser download fallback
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 1000);

    setIsExporting(false);
  };

  const exportPNG = async () => {
    if (!certificateContainerRef.current) return;
    setIsExporting(true);
    const safeName = (winner.name || `Rank_${winner.rank}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Octave_Certificate_${placeLabel}_Place_${safeName}.png`;

    try {
      const canvas = await html2canvas(certificateContainerRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#111217',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);
    } catch (err) {
      console.error('Failed to export certificate to PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Certificate Render Body (Native 1584 x 1224 SVG ViewBox)
  const certificateContent = (
    <div
      ref={certificateContainerRef}
      className="relative w-full max-w-[1020px] aspect-[1584/1224] bg-[#111217] text-white overflow-hidden shadow-2xl rounded-xl select-none print:m-0 print:p-0 print:w-full print:h-screen print:max-w-none print:shadow-none"
      style={{
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 45px rgba(224, 36, 125, 0.2)',
      }}
    >
      <svg
        viewBox="0 0 1584 1224"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111319" />
            <stop offset="45%" stopColor="#0f1118" />
            <stop offset="100%" stopColor="#090a0f" />
          </linearGradient>

          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#e0247d" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#d946ef" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#ec4899" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* ── Base Layer: Backdrop Image with vector fallback ── */}
        <image
          href="/certificate_background.png"
          x="0"
          y="0"
          width="1584"
          height="1224"
          preserveAspectRatio="none"
        />

        {/* Fallback decorative waves and branding if image is loading or blocked */}
        <g opacity="0.1" pointerEvents="none">
          <rect width="1584" height="1224" fill="url(#bgGrad)" />
        </g>


        {/* ── Dynamic Layer 1: Recipient Name in Great Vibes Cursive ── */}
        {/* Centred at x=792, positioned just above name line (y=710) */}
        <text
          x={nameX}
          y={nameY}
          textAnchor="middle"
          fill="#ffffff"
          style={{
            fontFamily: "'Great Vibes', cursive, 'Brush Script MT', 'Times New Roman', serif",
            fontSize: `${nameFontSize}px`,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
          }}
        >
          {winner.name || 'Participant Name'}
        </text>

        {/* ── Dynamic Layer 2: Participant Credentials ── */}
        {(org || spec || winner.email) && (
          <text
            x="792"
            y="748"
            textAnchor="middle"
            fill="#94a3b8"
            style={{
              fontFamily: "'Plus Jakarta Sans', monospace, sans-serif",
              fontSize: '15px',
              letterSpacing: '0.04em',
            }}
          >
            {spec && <tspan fill="#cbd5e1">{spec}</tspan>}
            {spec && org && <tspan fill="#64748b"> · </tspan>}
            {org && <tspan fill="#ffffff" fontWeight="600">{org}</tspan>}
            {winner.email && <tspan fill="#64748b"> ({winner.email})</tspan>}
          </text>
        )}

        {/* ── Dynamic Layer 3: Body Sentence (Optional) ── */}
        {includeBodySentence && (
          <g>
            <text
              x="792"
              y={bodyY}
              textAnchor="middle"
              fill="#e2e8f0"
              style={{
                fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                fontSize: '20px',
                letterSpacing: '0.02em',
              }}
            >
              In recognition of your participation in the ADIPEC interactive quiz and for securing{' '}
              <tspan fill="#f43f5e" fontWeight="700">
                {placeWord}
              </tspan>
            </text>
          </g>
        )}

        {/* ── Dynamic Layer 4: Date ── */}
        {/* Centred at x=345, positioned above left date line (y=1013) */}
        <text
          x={dateX}
          y={dateY}
          textAnchor="middle"
          fill="#f1f5f9"
          style={{
            fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.03em',
          }}
        >
          {formattedDate}
        </text>

        {/* ── Distinction Medal Emblem Accent ── */}
        <text
          x="792"
          y="970"
          textAnchor="middle"
          fontSize="22"
          className="select-none pointer-events-none"
        >
          {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
        </text>
      </svg>
    </div>
  );

  // If requested inside modal
  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-neutral-950 border border-white/15 rounded-3xl p-5 md:p-7 flex flex-col gap-5 items-center shadow-2xl">
          {/* Top Bar with Place Title and Close */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-lg">
                {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
              </span>
              <div>
                <h3 className="text-base font-black text-white">
                  Official Recognition Certificate · {placeLabel} Place
                </h3>
                <p className="text-[11px] font-mono text-neutral-400">
                  {winner.name} · 1584×1224 px Native Master Template · ADIPEC 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCalibrator(!showCalibrator)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  showCalibrator
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                    : 'bg-white/5 border-white/15 text-neutral-300 hover:bg-white/10'
                }`}
                title="Calibrate X/Y text coordinates and font size"
              >
                <Icons.Sliders className="w-3.5 h-3.5" />
                <span>Nudge Positions</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center transition-all cursor-pointer"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Position Calibration Panel */}
          {showCalibrator && (
            <div className="w-full p-4 bg-neutral-900/90 border border-pink-500/30 rounded-2xl flex flex-col gap-3 text-xs text-neutral-300">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Icons.Move className="w-3.5 h-3.5 text-pink-400" />
                  Text Position Calibration (Pixels in 1584×1224 Canvas)
                </span>
                <button
                  onClick={resetToDefaults}
                  className="text-[11px] text-pink-400 hover:text-pink-300 underline cursor-pointer"
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Name Y */}
                <div className="flex flex-col gap-1 bg-black/40 p-2.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-neutral-400">Name Y (Line: 710)</span>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setNameY(y => y - 2)}
                      className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white">{nameY} px</span>
                    <button
                      onClick={() => setNameY(y => y + 2)}
                      className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Name Font Size */}
                <div className="flex flex-col gap-1 bg-black/40 p-2.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-neutral-400">Name Font Size</span>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setNameFontSize(s => Math.max(36, s - 2))}
                      className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white">{nameFontSize} px</span>
                    <button
                      onClick={() => setNameFontSize(s => Math.min(100, s + 2))}
                      className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Date Y */}
                <div className="flex flex-col gap-1 bg-black/40 p-2.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-neutral-400">Date Y (Line: 1013)</span>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setDateY(y => y - 2)}
                      className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white">{dateY} px</span>
                    <button
                      onClick={() => setDateY(y => y + 2)}
                      className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Body Sentence Toggle */}
                <div className="flex flex-col gap-1 bg-black/40 p-2.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-neutral-400">Body Sentence</span>
                  <button
                    onClick={() => setIncludeBodySentence(!includeBodySentence)}
                    className={`w-full py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                      includeBodySentence
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {includeBodySentence ? 'Included (y=820)' : 'Hidden'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Certificate Render Frame */}
          <div className="w-full flex justify-center overflow-x-auto py-1">
            {certificateContent}
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Great Vibes Font · 1584×1224 px Master Template</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={exportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-pink-500/20 transition-all disabled:opacity-50"
              >
                <Icons.FileDown className="w-4 h-4" />
                <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
              </button>

              <button
                onClick={exportPNG}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all disabled:opacity-50"
              >
                <Icons.Image className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
              >
                <Icons.Printer className="w-4 h-4" />
                <span>Print</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-white/15 text-neutral-300 hover:bg-white/5 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standalone embed
  return certificateContent;
}
