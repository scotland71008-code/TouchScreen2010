import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { QUIZ_TYPES } from './ClientKnowledgeQuiz';

interface QuizWheelSpinnerProps {
  onSelectQuiz: (quizTypeKey: string) => void;
  onSwitchToManual: () => void;
}

interface WheelSegment {
  key: string;
  name: string;
  color: string;
  icon: string;
  difficulty: string;
  description: string;
}

export default function QuizWheelSpinner({
  onSelectQuiz,
  onSwitchToManual
}: QuizWheelSpinnerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<WheelSegment | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [currentSliceIndex, setCurrentSliceIndex] = useState(0);

  // Convert QUIZ_TYPES into array of 12 segments
  const segments: WheelSegment[] = Object.entries(QUIZ_TYPES).map(([key, config]) => ({
    key,
    name: config.name,
    color: config.color,
    icon: config.icon,
    difficulty: config.difficulty,
    description: config.description
  }));

  const numSegments = segments.length; // 12
  const segmentAngle = (2 * Math.PI) / numSegments; // 30 deg each

  // Keep track of rotation in radians
  const rotationRef = useRef<number>(0);
  const lastTickSliceRef = useRef<number>(-1);
  const animFrameRef = useRef<number | null>(null);

  // Web Audio sound synthesizer for realistic wheel ticker
  const playTickSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext could be blocked or unsupported; silent fallback
    }
  };

  const playWinChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
      });
    } catch {
      // AudioContext fallback
    }
  };

  // Draw the wheel onto canvas
  const drawWheel = (rotation: number, ledPhase = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 24;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);

    // 1. Draw glowing outer rim
    ctx.beginPath();
    ctx.arc(0, 0, radius + 14, 0, 2 * Math.PI);
    ctx.fillStyle = '#080d1a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 2. Draw outer decorative LED lights
    const numLeds = 24;
    for (let i = 0; i < numLeds; i++) {
      const ledAngle = (i * 2 * Math.PI) / numLeds;
      const lx = Math.cos(ledAngle) * (radius + 7);
      const ly = Math.sin(ledAngle) * (radius + 7);
      const isLit = (i + Math.floor(ledPhase * 10)) % 2 === 0;

      ctx.beginPath();
      ctx.arc(lx, ly, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = isLit ? '#fbbf24' : '#64748b';
      if (isLit) {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 3. Draw Segments
    ctx.rotate(rotation);

    segments.forEach((seg, i) => {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Slice background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Create subtle radial gradient from center to rim
      const grad = ctx.createRadialGradient(0, 0, 40, 0, 0, radius);
      grad.addColorStop(0, '#0a0f1d');
      grad.addColorStop(0.5, `${seg.color}25`);
      grad.addColorStop(1, `${seg.color}dd`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Slice divider
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff25';
      ctx.stroke();

      // Segment text label (drawn radially)
      ctx.save();
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Draw title text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, system-ui, sans-serif';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;

      // Truncate name if too long for slice
      let displayName = seg.name;
      if (displayName.length > 17) {
        displayName = displayName.substring(0, 15) + '..';
      }
      ctx.fillText(displayName, radius - 22, 0);

      // Draw difficulty indicator dot
      ctx.beginPath();
      ctx.arc(radius - 10, 0, 3, 0, 2 * Math.PI);
      ctx.fillStyle =
        seg.difficulty === 'EXPERT'
          ? '#f43f5e'
          : seg.difficulty === 'HARD'
          ? '#fbbf24'
          : '#34d399';
      ctx.fill();

      ctx.restore();
    });

    ctx.restore(); // back to center

    // 4. Center hub (golden/metallic button with Octave pulse)
    ctx.save();
    ctx.translate(centerX, centerY);

    // Hub outer shadow
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, 2 * Math.PI);
    ctx.fillStyle = '#05070f';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Hub gradient ring
    const hubGrad = ctx.createLinearGradient(-35, -35, 35, 35);
    hubGrad.addColorStop(0, '#38bdf8');
    hubGrad.addColorStop(0.5, '#1e293b');
    hubGrad.addColorStop(1, '#6366f1');
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff80';
    ctx.stroke();

    // Inner hub core
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#090d16';
    ctx.fill();

    // Center Text: SPIN or 🎲
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 11px Inter, system-ui, sans-serif';
    ctx.fillText('SPIN', 0, -1);

    ctx.restore();

    // 5. Pointer needle at Top (12 o'clock = 3*PI/2 = -PI/2)
    ctx.save();
    ctx.translate(centerX, centerY - radius - 2);

    // Pointer shadow
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    // Needle shape pointing down into the wheel
    ctx.beginPath();
    ctx.moveTo(0, 22); // tip
    ctx.lineTo(-14, -10);
    ctx.lineTo(14, -10);
    ctx.closePath();

    const needleGrad = ctx.createLinearGradient(-14, -10, 14, 22);
    needleGrad.addColorStop(0, '#f59e0b');
    needleGrad.addColorStop(0.5, '#ef4444');
    needleGrad.addColorStop(1, '#b91c1c');
    ctx.fillStyle = needleGrad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Needle base pin
    ctx.beginPath();
    ctx.arc(0, -10, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  };

  // Redraw on mount and window resize
  useEffect(() => {
    drawWheel(rotationRef.current, 0);
  }, []);

  // Determine current slice under pointer (at top: -PI/2 or 3*PI/2)
  const getSliceAtPointer = (currentRot: number): number => {
    // Pointer is at angle -Math.PI / 2 (top)
    // The slice index is:
    // angle = (3 * Math.PI / 2 - currentRot) % (2 * Math.PI)
    let pointerAngle = ((1.5 * Math.PI - currentRot) % (2 * Math.PI));
    if (pointerAngle < 0) pointerAngle += 2 * Math.PI;
    const sliceIndex = Math.floor(pointerAngle / segmentAngle) % numSegments;
    return sliceIndex;
  };

  // Spin handler
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedResult(null);
    setConfettiActive(false);

    // Pick a random target slice
    const targetSlice = Math.floor(Math.random() * numSegments);

    // Calculate rotation to place this slice under the pointer
    // Pointer is at 1.5 * Math.PI (top). Slice center is (targetSlice + 0.5) * segmentAngle
    const sliceCenterAngle = (targetSlice + 0.5) * segmentAngle;
    const targetBaseRotation = 1.5 * Math.PI - sliceCenterAngle;

    // Add 5 to 7 full revolutions for exciting spin physics
    const fullRevolutions = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const currentRot = rotationRef.current % (2 * Math.PI);
    let delta = (targetBaseRotation - currentRot) % (2 * Math.PI);
    if (delta < 0) delta += 2 * Math.PI;

    const totalDistance = fullRevolutions + delta;
    const startRotation = rotationRef.current;
    const duration = 4600; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quintic ease-out for ultra smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 4.5);
      const currentAngle = startRotation + totalDistance * ease;
      rotationRef.current = currentAngle;

      // Track slice crossing for tick audio and visual indicator
      const activeSlice = getSliceAtPointer(currentAngle);
      if (activeSlice !== lastTickSliceRef.current) {
        lastTickSliceRef.current = activeSlice;
        setCurrentSliceIndex(activeSlice);
        playTickSound();
      }

      drawWheel(currentAngle, progress * 15);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);
        const finalSlice = segments[targetSlice];
        setSelectedResult(finalSlice);
        setCurrentSliceIndex(targetSlice);
        setConfettiActive(true);
        playWinChime();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  // Instant Random Pick without waiting
  const handleInstantRandom = () => {
    if (isSpinning) return;
    const randomSlice = segments[Math.floor(Math.random() * segments.length)];
    setSelectedResult(randomSlice);
    setConfettiActive(true);
    playWinChime();
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-6 relative">
      
      {/* Title & Introduction */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Icons.Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Fortune Wheel</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
          Spin the Wheel for a Random Quiz
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300">
          Leave it to chance! Spin the wheel to be randomly assigned one of the 12 specialized Octave certification challenges.
        </p>
      </div>

      {/* Main Wheel Area */}
      <div className="relative flex flex-col items-center justify-center p-4">
        
        {/* Ambient Backlight Glow */}
        <div className="absolute w-80 h-80 bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Canvas Wheel */}
        <div className="relative z-10 cursor-pointer select-none group" onClick={handleSpin}>
          <canvas
            ref={canvasRef}
            width={480}
            height={480}
            className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </div>

        {/* Action Controls Below Wheel */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 z-10">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl transition-all cursor-pointer ${
              isSpinning
                ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed border border-white/10'
                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-black shadow-amber-500/25 hover:scale-105 active:scale-95'
            }`}
          >
            <Icons.RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Wheel Is Spinning...' : 'Spin The Wheel'}</span>
          </button>

          <button
            onClick={handleInstantRandom}
            disabled={isSpinning}
            className="px-4 py-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Icons.Shuffle className="w-3.5 h-3.5 text-sky-400" />
            <span>Instant Random Pick</span>
          </button>

          <button
            onClick={onSwitchToManual}
            disabled={isSpinning}
            className="px-4 py-3.5 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 text-neutral-400 hover:text-neutral-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Icons.LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
            <span>View All Tracks</span>
          </button>
        </div>
      </div>

      {/* WINNING RESULT CARD */}
      {selectedResult && (
        <div className="w-full max-w-xl mx-auto bg-gradient-to-b from-[#131b2e] via-[#0d1322] to-[#090d17] border-2 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-fade-in"
          style={{ borderColor: `${selectedResult.color}80` }}
        >
          {/* Confetti / Sparkle Accents */}
          {confettiActive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-10 left-1/4 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl animate-pulse" />
            </div>
          )}

          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md"
              style={{
                backgroundColor: `${selectedResult.color}20`,
                borderColor: `${selectedResult.color}60`,
                color: selectedResult.color
              }}
            >
              <span>🎉 Landed Challenge</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {selectedResult.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
                {selectedResult.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-neutral-300 uppercase">
                Difficulty: <strong className="text-white">{selectedResult.difficulty}</strong>
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-sky-300">
                10 Specialization Questions
              </span>
            </div>

            {/* Launch CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <button
                onClick={() => onSelectQuiz(selectedResult.key)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-black flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer group"
                style={{
                  backgroundColor: selectedResult.color,
                  boxShadow: `0 10px 25px -5px ${selectedResult.color}40`
                }}
              >
                <span>Start This Quiz Challenge</span>
                <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleSpin}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icons.RotateCw className="w-3.5 h-3.5" />
                <span>Spin Again</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Live Segment Indicator (if not landed yet) */}
      {!selectedResult && (
        <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 bg-neutral-900/60 px-4 py-2 rounded-xl border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Currently pointing at: <strong className="text-white">{segments[currentSliceIndex]?.name}</strong></span>
        </div>
      )}

    </div>
  );
}
