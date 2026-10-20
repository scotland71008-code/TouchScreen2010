import { useState, useEffect, useCallback, useRef } from 'react';
import * as Icons from 'lucide-react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import OfficialAchievementCertificate, { Top3WinnerData } from './OfficialAchievementCertificate';

const COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
const TIME_PER_Q = 20;
const API = '';

// ─── Day Domain Metadata ───────────────────────────────────────────────────────
interface DayMeta {
  id: number;
  label: string;
  theme: string;
  subtitle: string;
  color: string;
  accentBg: string;
  glow: string;
  iconName: 'Day1Plant' | 'Day2Standards' | 'Day3Twin' | 'Day4Energy';
}

const DAY_META: DayMeta[] = [
  {
    id: 1,
    label: 'Day 1',
    theme: 'Octave Products & Portfolio',
    subtitle: 'Plant 3D Design, P&ID & Complete Asset Lifecycle',
    color: '#38bdf8',
    accentBg: 'rgba(56, 189, 248, 0.12)',
    glow: 'rgba(56, 189, 248, 0.35)',
    iconName: 'Day1Plant',
  },
  {
    id: 2,
    label: 'Day 2',
    theme: 'Industry Standards & Compliance',
    subtitle: 'ASME, API 650, ISO 55000 & OT Cybersecurity',
    color: '#34d399',
    accentBg: 'rgba(52, 211, 153, 0.12)',
    glow: 'rgba(52, 211, 153, 0.35)',
    iconName: 'Day2Standards',
  },
  {
    id: 3,
    label: 'Day 3',
    theme: 'Digital Engineering & Technology',
    subtitle: 'Digital Twins, DataBridge & AI Data Flows',
    color: '#fbbf24',
    accentBg: 'rgba(251, 191, 36, 0.12)',
    glow: 'rgba(251, 191, 36, 0.35)',
    iconName: 'Day3Twin',
  },
  {
    id: 4,
    label: 'Day 4',
    theme: 'Energy Industry & Business Value',
    subtitle: 'Energy Transition, ROI & Operational Excellence',
    color: '#f87171',
    accentBg: 'rgba(248, 113, 113, 0.12)',
    glow: 'rgba(248, 113, 113, 0.35)',
    iconName: 'Day4Energy',
  },
];

// ─── Difficulty Tiers ──────────────────────────────────────────────────────────
interface DiffOption {
  key: string;
  label: string;
  tier: string;
  color: string;
  bg: string;
  pts: number;
  desc: string;
  iconName: 'Target' | 'Sliders' | 'Zap' | 'Crown';
  pips: number;
}

const DIFF_OPTIONS: readonly DiffOption[] = [
  {
    key: 'EASY',
    label: 'Easy',
    tier: 'Tier 1',
    color: '#34d399',
    bg: '#064e3b',
    pts: 100,
    desc: 'Core fundamentals, product naming & basic engineering principles',
    iconName: 'Target',
    pips: 1,
  },
  {
    key: 'MEDIUM',
    label: 'Medium',
    tier: 'Tier 2',
    color: '#38bdf8',
    bg: '#0c4a6e',
    pts: 200,
    desc: 'Portfolio architecture, cross-discipline integration & standards',
    iconName: 'Sliders',
    pips: 2,
  },
  {
    key: 'HARD',
    label: 'Hard',
    tier: 'Tier 3',
    color: '#fbbf24',
    bg: '#78350f',
    pts: 300,
    desc: 'Technical specs, protocols (Modbus, OData) & stress codes',
    iconName: 'Zap',
    pips: 3,
  },
  {
    key: 'DIFFICULT',
    label: 'Difficult',
    tier: 'Tier 4',
    color: '#f87171',
    bg: '#7f1d1d',
    pts: 400,
    desc: 'Master challenges: architecture topologies & digital thread flows',
    iconName: 'Crown',
    pips: 4,
  },
] as const;

export const LENGTH_OPTIONS = [
  { count: 5,  label: '5 Questions',  badge: '5 Qs',  time: '~2 min sprint', desc: 'Quick Booth Sprint', tag: 'SPRINT' },
  { count: 10, label: '10 Questions', badge: '10 Qs', time: '~5 min match',  desc: 'Standard Exhibition', tag: 'POPULAR' },
  { count: 15, label: '15 Questions', badge: '15 Qs', time: '~8 min contest',desc: 'Deep Technical Test', tag: 'PRO' },
  { count: 20, label: '20 Questions', badge: '20 Qs', time: '~10 min full',  desc: 'Championship Final',  tag: 'CHAMPION' },
];

// ─── Professional Custom Vector Symbols ────────────────────────────────────────
function DayVectorIcon({ name, className = 'w-6 h-6', style }: { name?: string; className?: string; style?: React.CSSProperties }) {
  switch (name) {
    case 'Day1Plant':
    case 'Boxes':
      // Isometric 3D Process & Modular Plant Vessel
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'Day2Standards':
    case 'ShieldCheck':
      // Certified Security & Engineering Standards Shield
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" strokeWidth="2.5" />
        </svg>
      );
    case 'Day3Twin':
    case 'CircuitBoard':
      // Digital Twin Dual-Core Microprocessor & Telemetry Node
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case 'Day4Energy':
    case 'TrendingUp':
      // Energy Transition Turbine & Executive ROI Growth
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
          <path d="M12 2v8M12 18v4M4.93 4.93l5.66 5.66M17.41 17.41l3.66 3.66" />
          <circle cx="12" cy="12" r="3" />
          <path d="M16 8l5-1-1 5" strokeWidth="2.5" />
          <path d="M13 15l8-8" strokeWidth="2.5" />
        </svg>
      );
    default:
      return <Icons.Layers className={className} style={style} />;
  }
}

function DiffVectorIcon({ name, className = 'w-5 h-5', style }: { name?: string; className?: string; style?: React.CSSProperties }) {
  switch (name) {
    case 'Target':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
    case 'Sliders':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
          <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
          <circle cx="4" cy="12" r="2" fill="currentColor" />
          <circle cx="12" cy="10" r="2" fill="currentColor" />
          <circle cx="20" cy="14" r="2" fill="currentColor" />
        </svg>
      );
    case 'Zap':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'Crown':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
      );
    default:
      return <Icons.Activity className={className} style={style} />;
  }
}

function OptionShapeVector({ index, className = 'w-6 h-6 shrink-0' }: { index: number; className?: string }) {
  switch (index) {
    case 0: // Triangle (Red)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2.5a1.5 1.5 0 0 1 1.3 0.75l9 15.5a1.5 1.5 0 0 1-1.3 2.25H3a1.5 1.5 0 0 1-1.3-2.25l9-15.5A1.5 1.5 0 0 1 12 2.5z" />
        </svg>
      );
    case 1: // Diamond (Blue)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <polygon points="12,1.5 22.5,12 12,22.5 1.5,12" />
        </svg>
      );
    case 2: // Circle (Yellow)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="10.5" />
        </svg>
      );
    case 3: // Square (Green)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface DayInfo {
  id: number;
  label: string;
  theme: string;
  subtitle?: string;
  color: string;
  icon?: string;
  iconName?: string;
  questionCount: number;
}

interface HostState {
  status: 'waiting' | 'question' | 'reveal' | 'leaderboard' | 'finished';
  questionIdx: number;
  totalQuestions: number;
  selectedQuestionCount?: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  points: number;
  difficultyPoints?: number;
  timeLeft: number;
  playerCount: number;
  answeredCount: number;
  leaderboard: {
    rank: number;
    id?: string;
    name: string;
    organization?: string;
    specialization?: string;
    email?: string;
    company?: string;
    position?: string;
    score: number;
  }[];
  capturedQuestions?: {
    questionIdx: number;
    questionNumber: number;
    question: string;
    domain?: string;
    difficulty: string;
    points: number;
    options: string[];
    correctOptionIdx: number;
    correctOptionText: string;
    answers: Record<string, {
      playerId: string;
      name: string;
      organization: string;
      specialization: string;
      email: string;
      selectedOptionIdx: number | null;
      selectedOptionText: string;
      isCorrect: boolean;
      timeMs: number;
      pointsAwarded: number;
    }>;
  }[];
  answerBreakdown: number[] | null;
  selectedDay: number;
  dayLabel: string;
  dayTheme: string;
  selectedDifficulty: string;
  difficultyLabel: string;
  difficultyColor: string;
}

interface Props {
  isDayMode?: boolean;
}

export default function LiveQuizHost({ isDayMode = false }: Props) {
  const [days, setDays] = useState<DayInfo[]>([]);
  const [state, setState] = useState<HostState | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [serverIP, setServerIP] = useState(() => (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.host : 'localhost'));
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'day-select' | 'diff-select' | 'game'>('day-select');
  const [pendingDay, setPendingDay] = useState<DayInfo | null>(null);
  const [selectedLength, setSelectedLength] = useState<number>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeCertWinner, setActiveCertWinner] = useState<{
    name: string;
    organization?: string;
    specialization?: string;
    email?: string;
    company?: string;
    position?: string;
    rank: number;
    score: number;
  } | null>(null);

  // Dedicated Official Achievement Certificate (attached template) for Top 3
  const [selectedAchievementWinner, setSelectedAchievementWinner] = useState<Top3WinnerData | null>(null);
  const [isExportingAll, setIsExportingAll] = useState<boolean>(false);

  const cert1Ref = useRef<HTMLDivElement>(null);
  const cert2Ref = useRef<HTMLDivElement>(null);
  const cert3Ref = useRef<HTMLDivElement>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastStateStatusRef = useRef<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const isNgrok = serverIP.includes('ngrok') || serverIP.includes('.app') || serverIP.includes('.io') || serverIP.startsWith('http');
  const playerURL = isNgrok
    ? `https://${serverIP.replace(/^https?:\/\//, '')}/quiz`
    : `http://${serverIP}:3000/quiz`;

  // ── Audio FX (Synthesized via Web Audio API) ─────────────────────────────────
  const playTone = useCallback((type: 'tick' | 'reveal' | 'fanfare') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'reveal') {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      } else if (type === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
        });
      }
    } catch {}
  }, [soundEnabled]);

  // Auto-detect IP + load days
  useEffect(() => {
    fetch(`${API}/api/quiz/server-info`)
      .then(r => r.json()).then(d => { if (d.ip && d.ip !== 'localhost') setServerIP(d.ip); })
      .catch(() => {});
    fetch(`${API}/api/quiz/days`)
      .then(r => r.json()).then(setDays)
      .catch(() => {});
  }, []);

  const poll = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/quiz/host-state`);
      if (r.ok) {
        const nextState: HostState = await r.json();
        if (nextState.status !== lastStateStatusRef.current) {
          if (nextState.status === 'reveal') playTone('reveal');
          else if (nextState.status === 'finished') playTone('fanfare');
          lastStateStatusRef.current = nextState.status;
        }
        setState(nextState);
        setApiError(null);
      } else {
        setApiError(`Server error ${r.status} — restart: npm run dev`);
      }
    } catch {
      setApiError('Cannot connect to server on port 3000.\nRun: npm run dev');
    }
  }, [playTone]);

  useEffect(() => {
    poll();
    pollRef.current = setInterval(poll, 1500);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [poll]);

  // Audio countdown ticks during final 5 seconds of question
  useEffect(() => {
    if (state?.status === 'question' && state.timeLeft > 0 && state.timeLeft <= 5) {
      playTone('tick');
    }
  }, [state?.status, state?.timeLeft, playTone]);

  const control = async (action: string) => {
    setLoading(true);
    try {
      await fetch(`${API}/api/quiz/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      await poll();
    } finally {
      setLoading(false);
    }
  };

  const exportTournamentToExcel = () => {
    if (!state) return;
    try {
      const wb = XLSX.utils.book_new();
      const lb = state.leaderboard || [];
      const capturedList = state.capturedQuestions && state.capturedQuestions.length > 0
        ? [...state.capturedQuestions].sort((a, b) => a.questionIdx - b.questionIdx)
        : [];
      const totalQuestions = capturedList.length || state.totalQuestions || 5;

      // ── Sheet 1: Leaderboard & Standings ──
      const standingsRows = lb.map(p => {
        let correctCount = 0;
        let attemptedCount = 0;
        capturedList.forEach(q => {
          const a = (p.id && q.answers?.[p.id]) || Object.values(q.answers || {}).find((ans: any) => ans.name === p.name);
          if (a) {
            if (a.selectedOptionIdx !== null) attemptedCount++;
            if (a.isCorrect) correctCount++;
          }
        });
        const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) + '%' : '0%';
        let certTier = '🎖️ Official Honors Participant';
        if (p.rank === 1) certTier = '💎 Platinum Architect Champion (1st Place)';
        else if (p.rank === 2) certTier = '🥇 Gold Architect Finalist (2nd Place)';
        else if (p.rank === 3) certTier = '🥈 Silver Specialist Finalist (3rd Place)';
        else if (p.rank === 4) certTier = '🥉 Bronze Associate Finalist (4th Place)';

        return {
          'Rank': p.rank,
          'Participant Name': p.name,
          'University / Organization': p.organization || p.company || '',
          'Specialization / Field': p.specialization || p.position || '',
          'Email': p.email || '',
          'Final Score (pts)': p.score,
          'Correct Answers': correctCount,
          'Total Questions': totalQuestions,
          'Accuracy Rate': accuracy,
          'Certificate Awarded': certTier,
        };
      });

      const wsStandings = XLSX.utils.json_to_sheet(standingsRows.length ? standingsRows : [
        {
          'Rank': 1,
          'Participant Name': 'No participants registered',
          'University / Organization': '-',
          'Specialization / Field': '-',
          'Email': '-',
          'Final Score (pts)': 0,
          'Correct Answers': 0,
          'Total Questions': totalQuestions,
          'Accuracy Rate': '0%',
          'Certificate Awarded': '-'
        }
      ]);
      wsStandings['!cols'] = [
        { wch: 8 },
        { wch: 28 },
        { wch: 32 },
        { wch: 32 },
        { wch: 32 },
        { wch: 18 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 42 },
      ];
      XLSX.utils.book_append_sheet(wb, wsStandings, 'Leaderboard & Standings');

      // ── Sheet 2: Participant Results Matrix ──
      const matrixRows = lb.map(p => {
        const row: Record<string, any> = {
          'Rank': p.rank,
          'Participant Name': p.name,
          'University / Organization': p.organization || p.company || '',
          'Specialization / Field': p.specialization || p.position || '',
          'Email': p.email || '',
          'Final Score': p.score,
        };
        capturedList.forEach(q => {
          const a = (p.id && q.answers?.[p.id]) || Object.values(q.answers || {}).find((ans: any) => ans.name === p.name);
          const colKey = `Q${q.questionNumber}: ${q.question.slice(0, 35)}...`;
          if (!a || a.selectedOptionIdx === null) {
            row[colKey] = 'Timed Out / No Answer (0 pts)';
          } else if (a.isCorrect) {
            row[colKey] = `✓ ${a.selectedOptionText} (+${a.pointsAwarded} pts)`;
          } else {
            row[colKey] = `✗ ${a.selectedOptionText} [Correct: ${q.correctOptionText}]`;
          }
        });
        return row;
      });
      const wsMatrix = XLSX.utils.json_to_sheet(matrixRows.length ? matrixRows : [
        { 'Rank': '-', 'Participant Name': 'No participants', 'University / Organization': '-', 'Specialization / Field': '-', 'Email': '-', 'Final Score': 0 }
      ]);
      XLSX.utils.book_append_sheet(wb, wsMatrix, 'Results Matrix');

      // ── Sheet 3: Captured Questions Log ──
      const questionsRows = capturedList.map(q => {
        const totalAns = Object.keys(q.answers || {}).length;
        const correctAns = Object.values(q.answers || {}).filter((a: any) => a.isCorrect).length;
        const acc = totalAns > 0 ? Math.round((correctAns / totalAns) * 100) + '%' : '0%';
        return {
          'Q#': q.questionNumber,
          'Question Text': q.question,
          'Domain / Category': q.domain || state.dayLabel || 'Engineering',
          'Difficulty': q.difficulty,
          'Base Points': q.points,
          'Option A': q.options[0] || '',
          'Option B': q.options[1] || '',
          'Option C': q.options[2] || '',
          'Option D': q.options[3] || '',
          'Correct Option Index': q.correctOptionIdx + 1,
          'Correct Answer Text': q.correctOptionText,
          'Total Participants Answered': totalAns,
          'Total Correct Answers': correctAns,
          'Accuracy Rate': acc,
        };
      });
      const wsQuestions = XLSX.utils.json_to_sheet(questionsRows.length ? questionsRows : [
        { 'Q#': 1, 'Question Text': state.question || 'No questions captured yet', 'Domain / Category': state.dayLabel, 'Difficulty': state.difficultyLabel, 'Base Points': state.points, 'Option A': state.options?.[0] || '', 'Option B': state.options?.[1] || '', 'Option C': state.options?.[2] || '', 'Option D': state.options?.[3] || '', 'Correct Option Index': (state.correctAnswer || 0) + 1, 'Correct Answer Text': state.options?.[state.correctAnswer] || '', 'Total Participants Answered': 0, 'Total Correct Answers': 0, 'Accuracy Rate': '0%' }
      ]);
      wsQuestions['!cols'] = [
        { wch: 6 },
        { wch: 45 },
        { wch: 24 },
        { wch: 14 },
        { wch: 14 },
        { wch: 28 },
        { wch: 28 },
        { wch: 28 },
        { wch: 28 },
        { wch: 20 },
        { wch: 30 },
        { wch: 26 },
        { wch: 20 },
        { wch: 16 },
      ];
      XLSX.utils.book_append_sheet(wb, wsQuestions, 'Captured Questions Log');

      // ── Sheet 4: Participant Detailed Responses Audit ──
      const auditRows: any[] = [];
      capturedList.forEach(q => {
        Object.values(q.answers || {}).forEach((a: any) => {
          auditRows.push({
            'Question #': q.questionNumber,
            'Question Text': q.question,
            'Participant Name': a.name,
            'University / Organization': a.organization,
            'Specialization / Field': a.specialization,
            'Email': a.email,
            'Participant Answer': a.selectedOptionText,
            'Correct Answer': q.correctOptionText,
            'Result Status': a.isCorrect ? 'CORRECT' : (a.selectedOptionIdx === null ? 'TIMEOUT' : 'INCORRECT'),
            'Response Time (sec)': (a.timeMs / 1000).toFixed(2),
            'Points Awarded': a.pointsAwarded,
          });
        });
      });
      const wsAudit = XLSX.utils.json_to_sheet(auditRows.length ? auditRows : [
        { 'Question #': 1, 'Question Text': '-', 'Participant Name': '-', 'University / Organization': '-', 'Specialization / Field': '-', 'Email': '-', 'Participant Answer': '-', 'Correct Answer': '-', 'Result Status': '-', 'Response Time (sec)': '0.00', 'Points Awarded': 0 }
      ]);
      wsAudit['!cols'] = [
        { wch: 12 },
        { wch: 40 },
        { wch: 26 },
        { wch: 30 },
        { wch: 30 },
        { wch: 30 },
        { wch: 28 },
        { wch: 28 },
        { wch: 16 },
        { wch: 20 },
        { wch: 16 },
      ];
      XLSX.utils.book_append_sheet(wb, wsAudit, 'Participant Detailed Responses');

      const fileName = `Octave_Tournament_Results_ADIPEC2026_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error('Excel export error:', e);
      window.open(`${API}/api/quiz/export-excel`, '_blank');
    }
  };

  // Export single top 3 certificate to PDF via reliable endpoint
  const exportWinnerCertificatePDF = async (winner: Top3WinnerData) => {
    try {
      const place = winner.rank === 1 ? '1st' : winner.rank === 2 ? '2nd' : winner.rank === 3 ? '3rd' : `${winner.rank}th`;
      const safeName = (winner.name || `Rank_${winner.rank}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Octave_Certificate_${place}_Place_${safeName}.pdf`;
      const org = winner.organization || winner.company || '';
      const spec = winner.specialization || winner.position || '';
      const pdfUrl = `/api/quiz/certificate-pdf?rank=${winner.rank}&name=${encodeURIComponent(winner.name || '')}&organization=${encodeURIComponent(org)}&specialization=${encodeURIComponent(spec)}&email=${encodeURIComponent(winner.email || '')}&score=${winner.score || 0}`;

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
      } else {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to export certificate PDF:', err);
    }
  };

  // Export all 3 top winner certificates to PDF
  const exportAllTop3Certificates = async () => {
    if (!state) return;
    setIsExportingAll(true);
    try {
      const top3List: Top3WinnerData[] = [];
      if (state.leaderboard[0]) {
        top3List.push({
          rank: 1,
          name: state.leaderboard[0].name,
          organization: state.leaderboard[0].organization || state.leaderboard[0].company,
          specialization: state.leaderboard[0].specialization || state.leaderboard[0].position,
          email: state.leaderboard[0].email,
          score: state.leaderboard[0].score,
        });
      }
      if (state.leaderboard[1]) {
        top3List.push({
          rank: 2,
          name: state.leaderboard[1].name,
          organization: state.leaderboard[1].organization || state.leaderboard[1].company,
          specialization: state.leaderboard[1].specialization || state.leaderboard[1].position,
          email: state.leaderboard[1].email,
          score: state.leaderboard[1].score,
        });
      }
      if (state.leaderboard[2]) {
        top3List.push({
          rank: 3,
          name: state.leaderboard[2].name,
          organization: state.leaderboard[2].organization || state.leaderboard[2].company,
          specialization: state.leaderboard[2].specialization || state.leaderboard[2].position,
          email: state.leaderboard[2].email,
          score: state.leaderboard[2].score,
        });
      }

      for (let i = 0; i < top3List.length; i++) {
        await exportWinnerCertificatePDF(top3List[i]);
        await new Promise(res => setTimeout(res, 600));
      }
    } catch (err) {
      console.error('Failed to export all certificates:', err);
    } finally {
      setIsExportingAll(false);
    }
  };

  // Export all: Excel spreadsheet + Top 3 Certificates
  const exportAllTournamentAndCertificates = async () => {
    exportTournamentToExcel();
    await exportAllTop3Certificates();
  };

  const selectDay = async (day: DayInfo) => {
    setLoading(true);
    try {
      await fetch(`${API}/api/quiz/select-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: day.id })
      });
      setPendingDay(day);
      setView('diff-select');
    } finally {
      setLoading(false);
    }
  };

  const selectDifficulty = async (difficulty: string, count: number = selectedLength) => {
    setLoading(true);
    try {
      await fetch(`${API}/api/quiz/select-difficulty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, questionCount: count })
      });
      await poll();
      setView('game');
    } finally {
      setLoading(false);
    }
  };

  // Direct length switcher (can be toggled in lobby without kicking players)
  const setTournamentLength = async (count: number) => {
    setSelectedLength(count);
    setLoading(true);
    try {
      await fetch(`${API}/api/quiz/select-length`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionCount: count })
      });
      await poll();
    } finally {
      setLoading(false);
    }
  };

  const t = {
    border: isDayMode ? 'border-slate-200' : 'border-white/10',
    text:   isDayMode ? 'text-slate-900'   : 'text-neutral-100',
    sub:    isDayMode ? 'text-slate-500'   : 'text-neutral-400',
    card:   isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-white/10',
    input:  isDayMode ? 'bg-white border-slate-300 text-slate-700' : 'bg-neutral-900 border-white/10 text-neutral-300',
  };

  // ── ERROR / LOADING ──────────────────────────────────────────────────────────
  if (!state) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      {apiError ? (
        <>
          <Icons.AlertTriangle className="w-10 h-10 text-amber-400" />
          <p className="text-amber-300 font-bold text-sm max-w-md whitespace-pre-wrap">{apiError}</p>
          <button onClick={poll} className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs rounded-lg cursor-pointer">Retry</button>
        </>
      ) : (
        <Icons.Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      )}
    </div>
  );

  // ── DAY SELECTOR ────────────────────────────────────────────────────────────
  if (view === 'day-select') {
    const displayDays = DAY_META.map(dm => {
      const loaded = days.find(d => d.id === dm.id);
      return {
        ...dm,
        questionCount: loaded?.questionCount ?? 80,
      };
    });

    return (
      <div className="flex-1 flex flex-col items-center justify-between gap-6 p-6 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mt-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 backdrop-blur-md mb-3">
            <Icons.Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-sky-300">
              Octave Live Exhibition Arena · ADIPEC 2026
            </span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${t.text}`}>
            Select Today's Quiz Session
          </h1>
          <p className={`text-sm md:text-base mt-2 ${t.sub}`}>
            Choose the conference day session, then customize tournament length (5, 10, 15, or 20 questions)
          </p>
        </div>

        {/* 2x2 Grid of Executive Day Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl">
          {displayDays.map((day) => (
            <button
              key={day.id}
              onClick={() => selectDay(day as any)}
              disabled={loading}
              className={`group relative flex flex-col text-left rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer disabled:opacity-50 select-none ${
                isDayMode
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl'
                  : 'bg-neutral-900/90 border-white/10 hover:border-white/25 hover:shadow-2xl'
              }`}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 14px 34px -8px ${day.color}35, 0 0 0 1px ${day.color}50`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Top Accent Gradient Bar */}
              <div
                className="h-1.5 w-full shrink-0"
                style={{
                  background: `linear-gradient(90deg, ${day.color}, ${day.color}50)`
                }}
              />

              <div className="flex flex-col gap-4 p-6 flex-1">
                {/* Header Row: Vector Icon Pod + Day Identifier + Touch Action */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3.5">
                    {/* Glowing Vector Icon Pod */}
                    <div
                      className="w-13 h-13 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: `${day.color}15`,
                        borderColor: `${day.color}35`,
                        boxShadow: `0 0 20px -4px ${day.color}30`
                      }}
                    >
                      <DayVectorIcon name={day.iconName} className="w-6 h-6" style={{ color: day.color }} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                          ADIPEC 2026
                        </span>
                        <span className="w-1 h-1 rounded-full bg-neutral-600" />
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                          Session 0{day.id}
                        </span>
                      </div>
                      <p className="text-2xl font-black tracking-tight" style={{ color: day.color }}>
                        {day.label}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Touch Affordance */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:translate-x-1"
                    style={{
                      borderColor: `${day.color}30`,
                      background: `${day.color}10`,
                      color: day.color
                    }}
                  >
                    <Icons.ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Day Theme Title & Subtitle */}
                <div>
                  <h3 className={`text-base font-bold leading-snug tracking-tight ${t.text}`}>
                    {day.theme}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${t.sub}`}>
                    {day.subtitle}
                  </p>
                </div>

                {/* Question Bank Depth & Length Flexibility Preview */}
                <div className="pt-3 border-t border-white/5 mt-auto">
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono text-neutral-500">
                    <span className="uppercase tracking-wider text-[10px]">Configurable Length</span>
                    <span className="text-[10px] text-sky-400 font-bold">5, 10, 15, or 20 Questions</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DIFF_OPTIONS.map(d => (
                      <div
                        key={d.key}
                        className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border text-center transition-colors"
                        style={{
                          background: `${d.color}0a`,
                          borderColor: `${d.color}25`
                        }}
                      >
                        <span className="text-[10px] font-bold tracking-tight" style={{ color: d.color }}>
                          {d.label}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400 font-medium">
                          {d.pts} pts/Q
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Feature Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-3 rounded-2xl border border-white/5 bg-neutral-900/60 backdrop-blur-md text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <Icons.Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>4 Conference Days</span>
          </div>
          <span className="text-white/20">·</span>
          <div className="flex items-center gap-2">
            <Icons.Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>320 Question Bank (20 per tier)</span>
          </div>
          <span className="text-white/20">·</span>
          <div className="flex items-center gap-2">
            <Icons.SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>5, 10, 15 or 20 Qs per Session</span>
          </div>
          <span className="text-white/20">·</span>
          <div className="flex items-center gap-2">
            <Icons.Award className="w-3.5 h-3.5 text-rose-400" />
            <span>Top 4 Win Official Certificate</span>
          </div>
        </div>
      </div>
    );
  }

  // ── DIFFICULTY & LENGTH SELECTOR ────────────────────────────────────────────
  if (view === 'diff-select') {
    const pd = pendingDay ?? (DAY_META[0] as any);
    return (
      <div className="flex-1 flex flex-col items-center justify-between gap-6 p-6 md:p-8 overflow-y-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between self-start max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setView('day-select')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                isDayMode
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'border-white/10 text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icons.ChevronLeft className="w-4 h-4" /> All Conference Days
            </button>
            <Icons.ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border"
              style={{
                background: `${pd.color}15`,
                borderColor: `${pd.color}35`,
                color: pd.color,
              }}
            >
              <DayVectorIcon name={pd.iconName || pd.icon} className="w-3.5 h-3.5" />
              <span>{pd.label}: {pd.theme}</span>
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
              soundEnabled
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                : 'bg-neutral-900 border-white/10 text-neutral-500'
            }`}
          >
            {soundEnabled ? <Icons.Volume2 className="w-3.5 h-3.5" /> : <Icons.VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'FX On' : 'Muted'}</span>
          </button>
        </div>

        {/* Section Title */}
        <div className="text-center max-w-2xl">
          <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-1.5 text-neutral-400">
            {pd.theme}
          </p>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${t.text}`}>
            Configure Tournament Length
          </h1>
          <p className={`text-sm md:text-base mt-2 ${t.sub}`}>
            Select question length (5, 10, 15, or 20 questions), then tap a difficulty tier to open the lobby
          </p>
        </div>

        {/* Interactive Session Length Selector (5, 10, 15, or 20 questions) */}
        <div className="flex flex-col items-center gap-3 w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-2">
              <Icons.SlidersHorizontal className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                Choose Session Length
              </span>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {selectedLength} Questions Selected (Speed bonus up to 100%)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
            {LENGTH_OPTIONS.map((opt) => {
              const isSelected = selectedLength === opt.count;
              return (
                <button
                  key={opt.count}
                  type="button"
                  onClick={() => setSelectedLength(opt.count)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all cursor-pointer text-left select-none ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-xl shadow-sky-500/20 scale-[1.02]'
                      : isDayMode
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-neutral-900/80 border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 w-full justify-between">
                    <span className="text-base font-black">{opt.label}</span>
                    <span
                      className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-sky-400 text-black' : 'bg-white/10 text-neutral-400'
                      }`}
                    >
                      {opt.tag}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 w-full">{opt.time}</span>
                  <span className="text-[10px] text-neutral-500 w-full mt-0.5">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2x2 Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl">
          {DIFF_OPTIONS.map(d => (
            <button
              key={d.key}
              onClick={() => selectDifficulty(d.key, selectedLength)}
              disabled={loading}
              className={`group relative flex flex-col text-left rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer disabled:opacity-50 select-none ${
                isDayMode
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl'
                  : 'bg-neutral-900/90 border-white/10 hover:border-white/25 hover:shadow-2xl'
              }`}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 14px 34px -8px ${d.color}35, 0 0 0 1px ${d.color}50`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Top Accent Gradient */}
              <div
                className="h-1.5 w-full shrink-0"
                style={{
                  background: `linear-gradient(90deg, ${d.color}, ${d.color}50)`
                }}
              />

              <div className="flex flex-col gap-4 p-6 flex-1">
                {/* Top Row: Icon Pod + Tier Info + Chevron */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3.5">
                    {/* Glowing Vector Icon Pod */}
                    <div
                      className="w-13 h-13 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: `${d.color}15`,
                        borderColor: `${d.color}35`,
                        boxShadow: `0 0 20px -4px ${d.color}30`
                      }}
                    >
                      <DiffVectorIcon name={d.iconName} className="w-6 h-6" style={{ color: d.color }} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                          {d.tier}
                        </span>
                        {/* Pips indicator */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: i < d.pips ? d.color : 'rgba(255,255,255,0.15)'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-2xl font-black tracking-tight" style={{ color: d.color }}>
                        {d.label}
                      </p>
                    </div>
                  </div>

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:translate-x-1"
                    style={{
                      borderColor: `${d.color}30`,
                      background: `${d.color}10`,
                      color: d.color
                    }}
                  >
                    <Icons.ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <p className={`text-sm leading-relaxed ${t.sub}`}>
                  {d.desc}
                </p>

                {/* Dynamic Score & Question Volume Info */}
                <div className="pt-3 border-t border-white/5 mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-md border"
                      style={{
                        background: `${d.color}15`,
                        borderColor: `${d.color}30`,
                        color: d.color,
                      }}
                    >
                      {selectedLength} Questions · Up to {d.pts * selectedLength} pts
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {d.pts} pts/Q
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                    <Icons.Zap className="w-3.5 h-3.5" />
                    <span>Speed Bonus</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Speed notice */}
        <p className="text-[11px] font-mono text-neutral-500 tracking-wider flex items-center gap-2">
          <Icons.Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>SPEED BONUS: FASTER CORRECT ANSWERS MULTIPLY BASE POINTS UP TO 100% (MIN 50%)</span>
        </p>
      </div>
    );
  }

  // ── WAITING ROOM (LOBBY WITH LIVE LENGTH SWITCHER) ──────────────────────────
  if (state.status === 'waiting') return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 overflow-y-auto">
      {/* Top action row */}
      <div className="flex items-center justify-between w-full max-w-4xl">
        <button
          onClick={() => { control('reset'); setView('day-select'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
            isDayMode ? 'border-slate-300 text-slate-600 hover:bg-slate-100' : 'border-white/10 text-neutral-400 hover:bg-white/5'
          }`}
        >
          <Icons.ChevronLeft className="w-3.5 h-3.5" /> Change Conference Day
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
              soundEnabled
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                : 'bg-neutral-900 border-white/10 text-neutral-500'
            }`}
          >
            {soundEnabled ? <Icons.Volume2 className="w-3.5 h-3.5" /> : <Icons.VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Title & Badges */}
      <div className="text-center max-w-xl">
        <div className="flex items-center justify-center gap-2.5 mb-2.5 flex-wrap">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-black border"
            style={{
              borderColor: (DAY_META.find(d => d.id === state.selectedDay)?.color ?? '#38bdf8') + '60',
              color: DAY_META.find(d => d.id === state.selectedDay)?.color ?? '#38bdf8',
              background: (DAY_META.find(d => d.id === state.selectedDay)?.color ?? '#38bdf8') + '18'
            }}
          >
            <DayVectorIcon name={DAY_META.find(d => d.id === state.selectedDay)?.iconName} className="w-4 h-4" />
            <span>{state.dayLabel}</span>
          </div>

          {state.selectedDifficulty && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-black border"
              style={{
                borderColor: `${state.difficultyColor}60`,
                color: state.difficultyColor,
                background: `${state.difficultyColor}18`
              }}
            >
              <DiffVectorIcon name={DIFF_OPTIONS.find(d => d.key === state.selectedDifficulty)?.iconName} className="w-4 h-4" />
              <span>{state.difficultyLabel} ({state.difficultyPoints || 200} pts/Q)</span>
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border border-sky-500/40 bg-sky-500/10 text-sky-400 font-mono">
            <Icons.HelpCircle className="w-3.5 h-3.5" />
            <span>{state.totalQuestions} Questions</span>
          </div>
        </div>

        <h1 className={`text-4xl font-black ${t.text}`}>Waiting for Attendees</h1>
        <p className={`text-sm mt-1.5 ${t.sub}`}>
          Scan the QR code with any smartphone to enter the live tournament lobby
        </p>
      </div>

      {/* Interactive In-Lobby Question Length Switcher (5, 10, 15, or 20 Qs) */}
      <div className={`p-3.5 rounded-2xl border max-w-2xl w-full flex flex-col gap-2 shadow-lg ${
        isDayMode ? 'bg-white border-slate-200' : 'bg-neutral-900/90 border-white/10'
      }`}>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Icons.SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
              Interactive Length Switcher (Toggle without losing joined players)
            </span>
          </div>
          <span className="text-[11px] font-mono text-sky-400 font-bold">
            Max {state.totalQuestions * (state.difficultyPoints || 200)} pts + Speed
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {LENGTH_OPTIONS.map((opt) => {
            const isActive = state.totalQuestions === opt.count;
            return (
              <button
                key={opt.count}
                type="button"
                onClick={() => setTournamentLength(opt.count)}
                disabled={loading}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-sky-500/25 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20 scale-[1.02]'
                    : isDayMode
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-neutral-950/60 border-white/5 text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xs font-black">{opt.count} Questions</span>
                <span className="text-[10px] font-mono text-neutral-400">{opt.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QR Code & Player Registration Counter */}
      <div className="flex flex-wrap gap-10 items-center justify-center">
        {/* QR Code Container */}
        <div
          className={`p-6 rounded-2xl border flex flex-col items-center gap-3.5 shadow-2xl ${
            isDayMode ? 'bg-white border-slate-200' : 'bg-neutral-900/90 border-white/10'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-white shadow-inner">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(playerURL)}&bgcolor=ffffff&color=000000&margin=2`}
              alt="QR"
              width={180}
              height={180}
              className="rounded-lg"
            />
          </div>
          <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${t.sub}`}>SCAN SMARTPHONE TO PLAY</p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 max-w-xs">
            <Icons.Link className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="text-sky-400 text-[11px] font-mono font-bold truncate">{playerURL}</span>
          </div>
        </div>

        {/* Player Count & Controls */}
        <div className="flex flex-col items-center gap-5">
          <div
            className={`flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 shadow-xl ${
              isDayMode ? 'border-sky-400 bg-sky-50' : 'border-sky-500 bg-sky-500/10'
            }`}
          >
            <span className={`text-5xl font-black ${t.text}`}>{state.playerCount}</span>
            <span className={`text-[11px] font-mono font-bold uppercase ${t.sub}`}>Players</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className={`text-[10px] font-mono ${t.sub}`}>Network IP / Custom URL:</p>
            <input
              value={serverIP}
              onChange={e => setServerIP(e.target.value)}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border w-64 text-center ${t.input}`}
              placeholder="192.168.x.x or domain"
            />
          </div>

          <div className="flex flex-col gap-2 w-64">
            <button
              onClick={() => control('start')}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-black text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Icons.Play className="w-4 h-4 fill-current" />
              <span>{state.playerCount === 0 ? `Start Solo (${state.totalQuestions} Qs)` : `Start Match (${state.playerCount} Players)`}</span>
            </button>
            <a
              href={`${API}/quiz`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isDayMode ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Icons.ExternalLink className="w-3.5 h-3.5" />
              <span>Open Phone View in New Tab</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  // ── QUESTION VIEW ───────────────────────────────────────────────────────────
  if (state.status === 'question') return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Meta Bar */}
      <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${t.border}`}>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`text-xs font-mono font-bold ${t.sub}`}>Q {state.questionIdx + 1} of {state.totalQuestions}</span>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
            state.difficulty === 'EASY'   ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            state.difficulty === 'MEDIUM' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
            state.difficulty === 'HARD'   ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {state.difficultyLabel || state.difficulty} · {state.points} pts
          </span>
          <span className={`text-[10px] font-mono ${t.sub}`}>{state.dayLabel}</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Icons.Zap className="w-3 h-3" /> Speed Multiplier (100% → 50%)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${
              soundEnabled ? 'text-sky-400 border-sky-500/30' : 'text-neutral-500 border-white/10'
            }`}
          >
            {soundEnabled ? <Icons.Volume2 className="w-3 h-3" /> : <Icons.VolumeX className="w-3 h-3" />}
          </button>

          <div className="flex items-center gap-2">
            <Icons.Users className={`w-4 h-4 ${t.sub}`} />
            <span className={`text-sm font-black ${t.text}`}>{state.answeredCount}/{state.playerCount}</span>
          </div>

          <button
            onClick={() => control('reveal')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase rounded-lg cursor-pointer transition-all"
          >
            <span>Reveal Answer</span>
            <Icons.ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Dots/Segments across all questions (5, 10, 15, or 20) */}
      <div className="flex items-center gap-1 px-6 py-1.5 bg-neutral-950/40 border-b border-white/5 overflow-x-auto">
        {Array.from({ length: state.totalQuestions }).map((_, idx) => {
          const isDone = idx < state.questionIdx;
          const isCurrent = idx === state.questionIdx;
          return (
            <div
              key={idx}
              className={`h-1.5 rounded-full flex-1 min-w-[12px] transition-all duration-300 ${
                isDone ? 'bg-emerald-500' : isCurrent ? 'bg-sky-400 shadow-sm shadow-sky-400' : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>

      {/* Timer Bar */}
      <div className="h-2 bg-neutral-900 shrink-0">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${state.timeLeft <= 5 ? 'bg-rose-500' : 'bg-sky-500'}`}
          style={{ width: `${(state.timeLeft / TIME_PER_Q) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8 min-h-0">
        <div className="flex items-center gap-5">
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full border-4 font-black text-2xl shrink-0 shadow-lg ${
              state.timeLeft <= 5 ? 'border-rose-500 text-rose-400 bg-rose-500/10 animate-pulse' : 'border-sky-500 text-sky-400 bg-sky-500/10'
            }`}
          >
            {state.timeLeft}
          </div>
          <h2 className={`text-3xl md:text-4xl font-black leading-tight max-w-2xl text-center ${t.text}`}>
            {state.question}
          </h2>
        </div>

        {/* 4 Colored Option Cards with Crisp Vector Shapes */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
          {state.options.map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white font-bold text-base shadow-xl"
              style={{ background: COLORS[i] }}
            >
              <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center shrink-0">
                <OptionShapeVector index={i} className="w-5 h-5 text-white" />
              </div>
              <span className="leading-snug">{opt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── REVEAL VIEW ─────────────────────────────────────────────────────────────
  if (state.status === 'reveal') return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${t.border}`}>
        <div className="flex items-center gap-2">
          <Icons.CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className={`text-sm font-black ${t.text}`}>Q {state.questionIdx + 1}/{state.totalQuestions} — Answer Revealed</span>
        </div>
        <button
          onClick={() => control('leaderboard')}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-black text-xs uppercase rounded-lg cursor-pointer transition-all"
        >
          <span>View Standings</span>
          <Icons.ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <h2 className={`text-2xl md:text-3xl font-black text-center max-w-2xl ${t.text}`}>
          {state.question}
        </h2>

        <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
          {state.options.map((opt, i) => {
            const isCorrect = i === state.correctAnswer;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-base transition-all ${
                  isCorrect ? 'text-white ring-4 ring-white scale-105 shadow-2xl' : 'text-white/40 opacity-45'
                }`}
                style={{ background: isCorrect ? COLORS[i] : `${COLORS[i]}40` }}
              >
                <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center shrink-0">
                  {isCorrect ? (
                    <Icons.Check className="w-6 h-6 text-white stroke-[3]" />
                  ) : (
                    <OptionShapeVector index={i} className="w-5 h-5 text-white/60" />
                  )}
                </div>
                <span className="flex-1 leading-snug">{opt}</span>
                {state.answerBreakdown && (
                  <span className="text-sm font-black opacity-90 px-2 py-0.5 rounded-md bg-black/30 shrink-0">
                    {state.answerBreakdown[i]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── LEADERBOARD / FINISHED GRAND FINALE PODIUM ──────────────────────────────
  const isFinished = state.status === 'finished';
  const maxScoreScale = Math.max(500, state.totalQuestions * (state.difficultyPoints || 200) * 1.5);
  const top1 = state.leaderboard[0];
  const top2 = state.leaderboard[1];
  const top3 = state.leaderboard[2];
  const top4 = state.leaderboard[3];
  const rest = state.leaderboard.slice(3, 10);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Top Header */}
      <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${t.border}`}>
        <div className="flex items-center gap-3">
          <Icons.Trophy className="w-5 h-5 text-amber-400" />
          <span className={`text-sm font-black ${t.text}`}>
            {isFinished ? `Exhibition Grand Finale — Winners Podium (${state.totalQuestions} Questions)` : `Live Leaderboard (Q ${state.questionIdx + 1}/${state.totalQuestions})`}
          </span>
          <span className={`text-[10px] font-mono ${t.sub}`}>· {state.dayLabel} ({state.difficultyLabel})</span>
        </div>

        <div className="flex gap-3">
          {isFinished && (
            <button
              onClick={exportAllTournamentAndCertificates}
              disabled={isExportingAll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-90 text-white font-black text-xs uppercase rounded-lg cursor-pointer transition-all shadow-md shadow-pink-500/25 disabled:opacity-50"
              title="Export both Excel results and Top 3 Recognition Certificates"
            >
              <Icons.Sparkles className="w-4 h-4" />
              <span>{isExportingAll ? 'Exporting...' : 'Export Results & Top 3 Certs'}</span>
            </button>
          )}

          <button
            onClick={exportTournamentToExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase rounded-lg cursor-pointer transition-all shadow-md shadow-emerald-600/30"
            title="Export captured questions and participant results to Excel (.xlsx)"
          >
            <Icons.FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          {!isFinished && (
            <button
              onClick={() => control('next')}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase rounded-lg cursor-pointer transition-all"
            >
              <span>{state.questionIdx + 1 < state.totalQuestions ? 'Next Question' : 'Finish Tournament'}</span>
              <Icons.ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => { control('reset'); setView('day-select'); }}
            disabled={loading}
            className={`flex items-center gap-1.5 px-4 py-2 font-black text-xs uppercase rounded-lg cursor-pointer border transition-all ${
              isDayMode ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-neutral-300 hover:bg-white/5'
            }`}
          >
            <Icons.RotateCcw className="w-3.5 h-3.5" />
            <span>New Quiz Session</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Thank You & Official Honors Banner on Finish */}
        {isFinished && (
          <>
            <div className="max-w-4xl mx-auto mb-6 p-5 rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-amber-500/15 text-center shadow-2xl">
              <div className="inline-flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider mb-1">
                <Icons.HeartHandshake className="w-5 h-5 text-sky-400" />
                <span>Thank You for Participating in the Octave Live Quiz Tournament!</span>
              </div>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl mx-auto leading-relaxed">
                We thank all participating engineers, delegates, and guests at ADIPEC 2026. In recognition of your outstanding performance, official certificates of achievement are awarded to the top 3 finalists with high-resolution export along with the complete tournament spreadsheet.
              </p>
            </div>

            {/* ── Official Recognition & Top 3 Certificates Showcase ──────────────── */}
            <div className="max-w-4xl mx-auto mb-8 p-6 rounded-3xl border border-pink-500/40 bg-gradient-to-b from-[#1a121e] via-[#121319] to-black shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Icons.Award className="w-3.5 h-3.5 text-pink-400" />
                    Official Tournament Honors · Top 3 Recognition
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    ADIPEC 2026 Achievement Certificates
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                    Official certificates formatted with recipient name, University / Organization, Specialization / Field, final score, date, and committee signature.
                  </p>
                </div>

                {/* Export Master Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={exportAllTournamentAndCertificates}
                    disabled={isExportingAll}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-90 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-pink-500/25 transition-all disabled:opacity-50"
                    title="Export complete Excel spreadsheet and all 3 PDF certificates together"
                  >
                    <Icons.Sparkles className="w-4 h-4" />
                    <span>{isExportingAll ? 'Generating All...' : 'Export All (Excel + Top 3 Certs)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportTournamentToExcel}
                    className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-emerald-600/25 transition-all"
                    title="Download 4-sheet tournament results Excel workbook"
                  >
                    <Icons.FileSpreadsheet className="w-4 h-4" />
                    <span>Excel (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportAllTop3Certificates}
                    disabled={isExportingAll}
                    className="flex items-center gap-2 px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer border border-white/10 transition-all disabled:opacity-50"
                    title="Download all 3 winner certificates as PDF files"
                  >
                    <Icons.Download className="w-4 h-4" />
                    <span>{isExportingAll ? 'Downloading...' : 'Top 3 PDFs'}</span>
                  </button>
                </div>
              </div>

              {/* Top 3 Winner Recognition Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {/* 1st Place Card */}
                {top1 ? (
                  <div className="p-4 rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-950/30 to-black/70 flex flex-col justify-between gap-3 shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-black uppercase flex items-center gap-1">
                          🥇 1st Place Champion
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300">{top1.score} pts</span>
                      </div>
                      <h4 className="text-base font-black text-white truncate">{top1.name}</h4>
                      <p className="text-xs text-sky-300 font-semibold truncate mt-0.5">
                        {top1.organization || top1.company || 'University / Organization'}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {top1.specialization || top1.position || 'Specialization / Field'}
                      </p>
                      {top1.email && <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">{top1.email}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAchievementWinner({
                        rank: 1,
                        name: top1.name,
                        organization: top1.organization || top1.company,
                        specialization: top1.specialization || top1.position,
                        email: top1.email,
                        score: top1.score,
                      })}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wide rounded-xl cursor-pointer shadow-md transition-all"
                    >
                      <Icons.Award className="w-4 h-4" />
                      <span>View 1st Place Cert</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-center text-xs text-neutral-500 flex items-center justify-center">
                    1st Place Pending
                  </div>
                )}

                {/* 2nd Place Card */}
                {top2 ? (
                  <div className="p-4 rounded-2xl border border-slate-300/40 bg-gradient-to-b from-slate-800/30 to-black/70 flex flex-col justify-between gap-3 shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-300/20 border border-slate-300/40 text-slate-200 font-mono text-[10px] font-black uppercase flex items-center gap-1">
                          🥈 2nd Place Finalist
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-200">{top2.score} pts</span>
                      </div>
                      <h4 className="text-base font-black text-white truncate">{top2.name}</h4>
                      <p className="text-xs text-sky-300 font-semibold truncate mt-0.5">
                        {top2.organization || top2.company || 'University / Organization'}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {top2.specialization || top2.position || 'Specialization / Field'}
                      </p>
                      {top2.email && <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">{top2.email}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAchievementWinner({
                        rank: 2,
                        name: top2.name,
                        organization: top2.organization || top2.company,
                        specialization: top2.specialization || top2.position,
                        email: top2.email,
                        score: top2.score,
                      })}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-white text-black font-black text-xs uppercase tracking-wide rounded-xl cursor-pointer shadow-md transition-all"
                    >
                      <Icons.Award className="w-4 h-4" />
                      <span>View 2nd Place Cert</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-center text-xs text-neutral-500 flex items-center justify-center">
                    2nd Place Pending
                  </div>
                )}

                {/* 3rd Place Card */}
                {top3 ? (
                  <div className="p-4 rounded-2xl border border-amber-700/40 bg-gradient-to-b from-amber-950/25 to-black/70 flex flex-col justify-between gap-3 shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-700/20 border border-amber-600/40 text-amber-300 font-mono text-[10px] font-black uppercase flex items-center gap-1">
                          🥉 3rd Place Finalist
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300">{top3.score} pts</span>
                      </div>
                      <h4 className="text-base font-black text-white truncate">{top3.name}</h4>
                      <p className="text-xs text-sky-300 font-semibold truncate mt-0.5">
                        {top3.organization || top3.company || 'University / Organization'}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {top3.specialization || top3.position || 'Specialization / Field'}
                      </p>
                      {top3.email && <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">{top3.email}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAchievementWinner({
                        rank: 3,
                        name: top3.name,
                        organization: top3.organization || top3.company,
                        specialization: top3.specialization || top3.position,
                        email: top3.email,
                        score: top3.score,
                      })}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wide rounded-xl cursor-pointer shadow-md transition-all"
                    >
                      <Icons.Award className="w-4 h-4" />
                      <span>View 3rd Place Cert</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-center text-xs text-neutral-500 flex items-center justify-center">
                    3rd Place Pending
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* 3D Olympic Podium for Grand Finale */}
        {isFinished && state.leaderboard.length > 0 && (
          <div className="max-w-3xl mx-auto mb-10 flex items-end justify-center gap-4 pt-6">
            {/* 2nd Place Podium: Silver Finalist */}
            {top2 ? (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-slate-300/20 border-2 border-slate-300 flex items-center justify-center text-slate-200 shadow-lg mb-2">
                  <Icons.Medal className="w-7 h-7 text-slate-200" />
                </div>
                <p className="font-black text-sm text-center truncate max-w-[150px] text-slate-200">{top2.name}</p>
                <p className="text-[11px] font-semibold text-sky-200 truncate max-w-[150px]">
                  {top2.organization || top2.company || 'University / Organization'}
                </p>
                <p className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                  {top2.specialization || top2.position || 'Specialization / Field'}
                </p>
                {top2.email && (
                  <p className="text-[9px] text-neutral-500 font-mono truncate max-w-[150px]">{top2.email}</p>
                )}
                <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">{top2.score} pts</p>
                <button
                  type="button"
                  onClick={() => setSelectedAchievementWinner({
                    rank: 2,
                    name: top2.name,
                    organization: top2.organization || top2.company,
                    specialization: top2.specialization || top2.position,
                    email: top2.email,
                    score: top2.score
                  })}
                  className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-300/20 border border-slate-300/50 text-[10px] font-mono font-bold text-slate-200 hover:bg-slate-300/30 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Icons.Award className="w-3 h-3 text-slate-300" /> 🥈 2nd Place Certificate
                </button>
                {/* Silver Pedestal */}
                <div className="w-full h-28 mt-2 rounded-t-2xl bg-gradient-to-t from-slate-600/30 to-slate-400/20 border-t-3 border-x-2 border-slate-300/50 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-200">2</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold">2nd Place</span>
                </div>
              </div>
            ) : <div className="flex-1" />}

            {/* 1st Place Podium: Gold Champion */}
            {top1 ? (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-18 h-18 rounded-full bg-amber-400/20 border-3 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-400/30 mb-2 relative">
                  <Icons.Crown className="w-9 h-9 text-amber-300" />
                  <span className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-black text-[9px] uppercase tracking-wider shadow">
                    1st Place Champion
                  </span>
                </div>
                <p className="font-black text-base text-center truncate max-w-[170px] text-white">{top1.name}</p>
                <p className="text-[12px] font-semibold text-amber-200 truncate max-w-[170px]">
                  {top1.organization || top1.company || 'University / Organization'}
                </p>
                <p className="text-[10px] text-neutral-300 truncate max-w-[170px]">
                  {top1.specialization || top1.position || 'Specialization / Field'}
                </p>
                {top1.email && (
                  <p className="text-[9px] text-neutral-400 font-mono truncate max-w-[170px]">{top1.email}</p>
                )}
                <p className="text-sm font-mono font-black text-amber-400 mt-0.5">{top1.score} pts</p>
                <button
                  type="button"
                  onClick={() => setSelectedAchievementWinner({
                    rank: 1,
                    name: top1.name,
                    organization: top1.organization || top1.company,
                    specialization: top1.specialization || top1.position,
                    email: top1.email,
                    score: top1.score
                  })}
                  className="mt-1 px-3 py-1 rounded-full bg-amber-400/25 border border-amber-400/60 text-[10px] font-mono font-black text-amber-200 hover:bg-amber-400/40 flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20 transition-all"
                >
                  <Icons.Award className="w-3.5 h-3.5 text-amber-400" /> 🥇 1st Place Certificate
                </button>
                {/* Gold Pedestal */}
                <div className="w-full h-36 mt-2 rounded-t-2xl bg-gradient-to-t from-amber-600/40 via-yellow-500/20 to-amber-400/30 border-t-3 border-x-2 border-amber-400/60 shadow-[0_0_30px_rgba(251,191,36,0.35)] flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-amber-300">1</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-200 font-bold">1st Place</span>
                </div>
              </div>
            ) : <div className="flex-1" />}

            {/* 3rd Place Podium: Bronze Finalist */}
            {top3 ? (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-amber-700/20 border-2 border-amber-600 flex items-center justify-center text-amber-300 shadow-lg mb-2">
                  <Icons.Medal className="w-7 h-7 text-amber-400" />
                </div>
                <p className="font-black text-sm text-center truncate max-w-[150px] text-amber-200">{top3.name}</p>
                <p className="text-[11px] font-semibold text-amber-300 truncate max-w-[150px]">
                  {top3.organization || top3.company || 'University / Organization'}
                </p>
                <p className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                  {top3.specialization || top3.position || 'Specialization / Field'}
                </p>
                {top3.email && (
                  <p className="text-[9px] text-neutral-500 font-mono truncate max-w-[150px]">{top3.email}</p>
                )}
                <p className="text-xs font-mono font-bold text-amber-300 mt-0.5">{top3.score} pts</p>
                <button
                  type="button"
                  onClick={() => setSelectedAchievementWinner({
                    rank: 3,
                    name: top3.name,
                    organization: top3.organization || top3.company,
                    specialization: top3.specialization || top3.position,
                    email: top3.email,
                    score: top3.score
                  })}
                  className="mt-1 px-2.5 py-0.5 rounded-full bg-amber-700/20 border border-amber-600/50 text-[10px] font-mono font-bold text-amber-300 hover:bg-amber-700/30 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Icons.Award className="w-3 h-3 text-amber-500" /> 🥉 3rd Place Certificate
                </button>
                {/* Bronze Pedestal */}
                <div className="w-full h-22 mt-2 rounded-t-2xl bg-gradient-to-t from-amber-900/30 to-amber-700/20 border-t-2 border-x-2 border-amber-600/40 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-amber-300">3</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">3rd Place</span>
                </div>
              </div>
            ) : <div className="flex-1" />}
          </div>
        )}

        {/* 4th Place Bronze Certificate Spotlight */}
        {isFinished && top4 && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl border border-amber-600/40 bg-gradient-to-r from-amber-950/30 to-black/60 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-700/20 border-2 border-amber-600 flex items-center justify-center text-sm font-black text-amber-500">
                4
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-white">{top4.name}</p>
                  <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-600/20 border border-amber-600/40">
                    🥉 Bronze Tier Finalist
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-300 block mt-0.5">
                  <span className="text-amber-200 font-semibold">{top4.organization || top4.company || 'University / Organization'}</span>
                  <span> · {top4.specialization || top4.position || 'Specialization / Field'}</span>
                  {top4.email && <span className="text-neutral-400"> · {top4.email}</span>}
                  <span className="text-amber-400 font-bold"> · {top4.score} pts</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveCertWinner({
                name: top4.name,
                organization: top4.organization,
                specialization: top4.specialization,
                email: top4.email,
                company: top4.company,
                position: top4.position,
                rank: 4,
                score: top4.score
              })}
              className="px-3.5 py-1.5 bg-amber-600/20 border border-amber-600/40 hover:bg-amber-600/30 rounded-lg text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Icons.Award className="w-3.5 h-3.5" />
              <span>🥉 Bronze Certificate</span>
            </button>
          </div>
        )}

        {/* Standings List (During game or for positions 5-10) */}
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {state.leaderboard.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm font-mono">
              No attendees currently registered. Scan the QR code to join!
            </div>
          ) : (
            (isFinished ? rest : state.leaderboard.slice(0, 10)).map((p, i) => {
              const actualRank = isFinished ? i + 4 : i + 1;
              return (
                <div key={p.name} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${t.card}`}>
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-full font-black text-xs shrink-0 shadow-md ${
                      actualRank === 1 ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-300' :
                      actualRank === 2 ? 'bg-slate-300/20 border-2 border-slate-300 text-slate-200' :
                      actualRank === 3 ? 'bg-amber-700/20 border-2 border-amber-500 text-amber-300' :
                      'bg-white/5 border border-white/10 text-neutral-400'
                    }`}
                  >
                    {actualRank === 1 ? (
                      <Icons.Crown className="w-4 h-4 text-amber-300" />
                    ) : actualRank === 2 ? (
                      <Icons.Medal className="w-4 h-4 text-slate-200" />
                    ) : actualRank === 3 ? (
                      <Icons.Medal className="w-4 h-4 text-amber-400" />
                    ) : (
                      actualRank
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm truncate ${t.text}`}>{p.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate flex items-center gap-1.5 mt-0.5">
                      {(p.organization || p.company) && (
                        <span className="text-sky-300 font-semibold">{p.organization || p.company}</span>
                      )}
                      {(p.specialization || p.position) && (
                        <span>· {p.specialization || p.position}</span>
                      )}
                      {p.email && (
                        <span className="text-neutral-500 font-mono">({p.email})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-36 shrink-0">
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          actualRank === 1 ? 'bg-amber-400' : actualRank === 2 ? 'bg-slate-300' : actualRank === 3 ? 'bg-amber-500' : 'bg-sky-500'
                        }`}
                        style={{ width: `${Math.min(100, (p.score / maxScoreScale) * 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-black font-mono tabular-nums ${t.text}`}>{p.score}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Official Achievement Certificate Modal for Top 3 (Attached Certificate) ── */}
      {(selectedAchievementWinner || activeCertWinner) && (
        <OfficialAchievementCertificate
          winner={(selectedAchievementWinner || activeCertWinner)!}
          onClose={() => {
            setSelectedAchievementWinner(null);
            setActiveCertWinner(null);
          }}
        />
      )}

      {/* ── Hidden Offscreen Renderers for Instant Batch PDF Certificate Export ── */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '960px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        {top1 && (
          <div ref={cert1Ref} style={{ width: '960px', height: '678px' }}>
            <OfficialAchievementCertificate
              winner={{
                rank: 1,
                name: top1.name,
                organization: top1.organization || top1.company,
                specialization: top1.specialization || top1.position,
                email: top1.email,
                score: top1.score,
              }}
              showModal={false}
            />
          </div>
        )}
        {top2 && (
          <div ref={cert2Ref} style={{ width: '960px', height: '678px' }}>
            <OfficialAchievementCertificate
              winner={{
                rank: 2,
                name: top2.name,
                organization: top2.organization || top2.company,
                specialization: top2.specialization || top2.position,
                email: top2.email,
                score: top2.score,
              }}
              showModal={false}
            />
          </div>
        )}
        {top3 && (
          <div ref={cert3Ref} style={{ width: '960px', height: '678px' }}>
            <OfficialAchievementCertificate
              winner={{
                rank: 3,
                name: top3.name,
                organization: top3.organization || top3.company,
                specialization: top3.specialization || top3.position,
                email: top3.email,
                score: top3.score,
              }}
              showModal={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
