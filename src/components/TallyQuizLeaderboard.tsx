import { useState, useEffect, useRef, useCallback } from 'react';
import * as Icons from 'lucide-react';

// ─── Config ────────────────────────────────────────────────────────────────
// Replace TALLY_FORM_ID with your real Tally form ID (6-8 chars from your form URL)
// e.g. if your form is https://tally.so/r/wbY4zE  →  TALLY_FORM_ID = 'wbY4zE'
const TALLY_FORM_ID = 'WOvXAL';
const TALLY_EMBED_URL =
  `https://tally.so/embed/${TALLY_FORM_ID}` +
  '?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1';
const TALLY_DIRECT_URL = `https://tally.so/r/${TALLY_FORM_ID}`;

// Proxied through Express to avoid CORS — Google Sheets URL is configured in server.ts
const POLL_URL = '/api/quiz-leaderboard';
const POLL_INTERVAL_MS = 5000;
const CARD_H = 64; // px — card height
const CARD_GAP = 8; // px — gap between cards

interface Player {
  id: string;        // stable key = player name
  name: string;
  score: number;
  timestamp: string;
  rank: number;
}

// ─── CSV parser ────────────────────────────────────────────────────────────
// Splits a single CSV/TSV line respecting quoted fields
function splitLine(line: string): string[] {
  const result: string[] = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; continue; }
    if ((ch === ',' || ch === '\t') && !inQ) { result.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  result.push(cur.trim());
  return result;
}

function parseCSV(raw: string): Player[] {
  const lines = raw.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];

  const headers = splitLine(lines[0]).map(h => h.toLowerCase());

  // Locate columns by header keywords (flexible — works regardless of column order)
  const nameIdx  = headers.findIndex(h => h.includes('name') && !h.includes('university') && !h.includes('company'));
  const tsIdx    = headers.findIndex(h => h.includes('submitted') || h.includes('timestamp') || h.includes('date'));
  const scoreIdx = headers.findIndex(h => h.includes('score') || h.includes('points') || h.includes('result'));

  // Columns that look like quiz questions — skip all metadata/personal info columns
  const metaKeywords = ['name','university','college','school','email','company','id','submitted','timestamp','date','respondent','phone','city','country'];
  const questionIdxs = headers.reduce<number[]>((acc, h, i) => {
    if (i > 2 && !metaKeywords.some(kw => h.includes(kw))) acc.push(i);
    return acc;
  }, []);

  const rows: Player[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = splitLine(lines[i]);
    const name  = nameIdx  >= 0 ? parts[nameIdx]  || `Participant ${i}` : `Participant ${i}`;
    const ts    = tsIdx    >= 0 ? parts[tsIdx]    || '' : '';

    let score = 0;
    if (scoreIdx >= 0) {
      // Use the dedicated score column (appears when Tally quiz scoring is enabled)
      score = Math.round(parseFloat(parts[scoreIdx] || '0'));
    } else {
      // Fallback: each answered question = 10 pts (until quiz scoring is enabled in Tally)
      score = questionIdxs.filter(ci => parts[ci]?.trim()).length * 10;
    }

    if (!name.trim()) continue;
    rows.push({ id: name + ts, name, score, timestamp: ts, rank: 0 });
  }

  rows.sort((a, b) => b.score - a.score);
  rows.forEach((p, idx) => { p.rank = idx + 1; });
  return rows.slice(0, 10);
}

// ─── Rank badge ────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-sm shrink-0">
      <Icons.Crown className="w-4 h-4" />
    </span>
  );
  if (rank === 2) return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-400/20 border border-slate-400/40 text-slate-300 font-black text-sm shrink-0">2</span>
  );
  if (rank === 3) return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-700/20 border border-orange-700/40 text-orange-300 font-black text-sm shrink-0">3</span>
  );
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono text-xs shrink-0">
      {rank}
    </span>
  );
}

// ─── Score bar ─────────────────────────────────────────────────────────────
function ScoreBar({ score, rank }: { score: number; rank: number }) {
  const color =
    rank === 1 ? 'bg-amber-400' :
    rank === 2 ? 'bg-slate-300' :
    rank === 3 ? 'bg-orange-400' :
    'bg-sky-500';
  return (
    <div className="flex-1 flex items-center gap-3 min-w-0">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-black font-mono shrink-0 ${
        rank === 1 ? 'text-amber-300' :
        rank === 2 ? 'text-slate-300' :
        rank === 3 ? 'text-orange-300' :
        'text-sky-300'
      }`}>{score}</span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
interface Props {
  isDayMode?: boolean;
}

export default function TallyQuizLeaderboard({ isDayMode = false }: Props) {
  const [players, setPlayers]         = useState<Player[]>([]);
  const [status, setStatus]           = useState<'loading' | 'live' | 'error'>('loading');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pulse, setPulse]             = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // refs for FLIP animation
  const containerRef = useRef<HTMLDivElement>(null);
  const prevTops     = useRef<Map<string, number>>(new Map());
  const cardRefs     = useRef<Map<string, HTMLDivElement>>(new Map());

  // ── snapshot positions before React commits new DOM ──────────────────────
  const snapshotPositions = useCallback(() => {
    cardRefs.current.forEach((el, id) => {
      prevTops.current.set(id, el.offsetTop);
    });
  }, []);

  // ── run FLIP after DOM update ─────────────────────────────────────────────
  const playFlip = useCallback(() => {
    cardRefs.current.forEach((el, id) => {
      const prev = prevTops.current.get(id);
      if (prev === undefined) return;
      const next  = el.offsetTop;
      const delta = prev - next;
      if (delta === 0) return;
      el.style.transition = 'none';
      el.style.transform  = `translateY(${delta}px)`;
      requestAnimationFrame(() => {
        el.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.transform  = 'translateY(0)';
      });
    });
  }, []);

  // ── fetch + parse ─────────────────────────────────────────────────────────
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(POLL_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const csv = await res.text();
      const next = parseCSV(csv);

      snapshotPositions();
      setPlayers(next);
      setStatus('live');
      setLastUpdated(new Date());

      // trigger FLIP after React re-renders
      requestAnimationFrame(() => requestAnimationFrame(playFlip));

      // pulse the indicator
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } catch {
      setStatus('error');
    }
  }, [snapshotPositions, playFlip]);

  useEffect(() => {
    fetchLeaderboard();
    const id = setInterval(fetchLeaderboard, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchLeaderboard]);

  // ── theme tokens ──────────────────────────────────────────────────────────
  const t = {
    card:    isDayMode ? 'bg-white border-slate-200 shadow-sm'   : 'bg-neutral-900/80 border-white/8',
    inner:   isDayMode ? 'bg-slate-50 border-slate-200'          : 'bg-neutral-950/60 border-white/6',
    header:  isDayMode ? 'text-slate-800'                        : 'text-neutral-100',
    sub:     isDayMode ? 'text-slate-500'                        : 'text-neutral-500',
    row:     isDayMode ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-100' : 'bg-neutral-900/50 border-white/5 hover:bg-white/4',
    name:    isDayMode ? 'text-slate-800'                        : 'text-neutral-100',
    divider: isDayMode ? 'border-slate-200'                      : 'border-white/8',
  };

  const listHeight = players.length * (CARD_H + CARD_GAP) - CARD_GAP;

  return (
    <div className="flex flex-col gap-0 h-full min-h-0 w-full overflow-hidden">

      {/* ── page header ─────────────────────────────────────────────────── */}
      <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${t.divider}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Icons.Gamepad2 className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${t.header}`}>LIVE QUIZ & LEADERBOARD</h2>
            <p className={`text-[10px] font-mono uppercase tracking-widest ${t.sub}`}>Tally Quiz · Real-time Rankings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* live indicator */}
          <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono font-bold uppercase border transition-all ${
            status === 'live'  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            status === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === 'live'  ? `bg-emerald-400 ${pulse ? 'scale-125' : 'scale-100'} transition-transform` :
              status === 'error' ? 'bg-red-400' : 'bg-neutral-400 animate-pulse'
            }`} />
            {status === 'live' ? 'LIVE' : status === 'error' ? 'OFFLINE' : 'LOADING'}
          </span>
          {lastUpdated && (
            <span className={`text-[10px] font-mono ${t.sub}`}>
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* ── two-column body ──────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 gap-0 overflow-hidden">

        {/* ── LEFT: Tally iframe ─────────────────────────────────────────── */}
        <div className={`flex-1 min-w-0 flex flex-col border-r ${t.divider} overflow-hidden`}>
          <div className={`flex items-center gap-2 px-4 py-2 border-b shrink-0 ${t.divider}`}>
            <Icons.ClipboardList className={`w-3.5 h-3.5 ${t.sub}`} />
            <span className={`text-[11px] font-mono font-bold uppercase tracking-widest ${t.sub}`}>Quiz Form</span>
            <span className={`ml-auto text-[10px] font-mono ${t.sub}`}>Powered by Tally</span>
          </div>
          <div className="flex-1 min-h-0 relative">
            {iframeBlocked ? (
              /* Fallback: show QR + direct link when iframe is blocked */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                <div className={`p-6 rounded-2xl border text-center space-y-4 max-w-sm w-full ${isDayMode ? 'bg-white border-slate-200' : 'bg-neutral-900/80 border-white/10'}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 mx-auto">
                    <Icons.QrCode className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                      Scan to take the quiz
                    </p>
                    <p className={`text-xs mt-1 ${isDayMode ? 'text-slate-500' : 'text-neutral-400'}`}>
                      The quiz form cannot be embedded directly.<br />Open it on your phone instead.
                    </p>
                  </div>
                  {/* QR code via Google Charts API */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(TALLY_DIRECT_URL)}&bgcolor=ffffff&color=000000&margin=2`}
                    alt="QR code to Tally quiz"
                    className="mx-auto rounded-xl"
                    width={180}
                    height={180}
                  />
                  <a
                    href={TALLY_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-sky-400 underline font-mono"
                  >
                    <Icons.ExternalLink className="w-3 h-3" />
                    Open quiz in browser
                  </a>
                </div>
                <p className={`text-[10px] font-mono ${isDayMode ? 'text-slate-400' : 'text-neutral-600'}`}>
                  Update TALLY_FORM_ID in TallyQuizLeaderboard.tsx with your real form ID
                </p>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={TALLY_EMBED_URL}
                title="Octave Quiz"
                className="absolute inset-0 w-full h-full border-0"
                style={{ background: 'transparent' }}
                allow="camera; microphone; autoplay; clipboard-write"
                onError={() => setIframeBlocked(true)}
                onLoad={() => {
                  // detect blank/blocked load after 3s
                  setTimeout(() => {
                    try {
                      const doc = iframeRef.current?.contentDocument;
                      if (!doc || doc.body?.innerHTML === '') setIframeBlocked(true);
                    } catch {
                      // cross-origin — assume it loaded fine
                    }
                  }, 3000);
                }}
              />
            )}
          </div>
        </div>

        {/* ── RIGHT: Leaderboard ─────────────────────────────────────────── */}
        <div className="w-80 xl:w-96 flex flex-col shrink-0 overflow-hidden">

          {/* leaderboard header */}
          <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${t.divider}`}>
            <div className="flex items-center gap-2">
              <Icons.Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className={`text-[11px] font-mono font-bold uppercase tracking-widest ${t.sub}`}>Top 10</span>
            </div>
            <button
              onClick={fetchLeaderboard}
              className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border transition-all cursor-pointer ${
                isDayMode
                  ? 'border-slate-300 text-slate-500 hover:bg-slate-100'
                  : 'border-white/10 text-neutral-500 hover:bg-white/5'
              }`}
              title="Refresh now"
            >
              <Icons.RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          {/* cards list */}
          <div ref={containerRef} className="flex-1 overflow-y-auto px-3 py-3">
            {status === 'loading' && players.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <Icons.Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
                <span className={`text-xs font-mono ${t.sub}`}>Fetching scores…</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <Icons.WifiOff className="w-6 h-6 text-red-400" />
                <span className={`text-xs font-mono text-red-400`}>Could not load scores</span>
                <button onClick={fetchLeaderboard} className="text-[11px] text-sky-400 underline font-mono cursor-pointer">
                  Retry
                </button>
              </div>
            )}

            {/* animated position list */}
            <div
              className="relative"
              style={{ height: listHeight > 0 ? `${listHeight}px` : 'auto' }}
            >
              {players.map((player, idx) => (
                <div
                  key={player.id}
                  ref={el => {
                    if (el) cardRefs.current.set(player.id, el);
                    else     cardRefs.current.delete(player.id);
                  }}
                  className={`absolute w-full flex items-center gap-3 px-3 rounded-lg border cursor-default select-none ${t.row}`}
                  style={{
                    top:    `${idx * (CARD_H + CARD_GAP)}px`,
                    height: `${CARD_H}px`,
                    willChange: 'transform',
                  }}
                >
                  <RankBadge rank={player.rank} />
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <span className={`text-xs font-bold leading-none truncate ${t.name}`}>{player.name}</span>
                    <ScoreBar score={player.score} rank={player.rank} />
                  </div>
                </div>
              ))}
            </div>

            {players.length === 0 && status !== 'loading' && status !== 'error' && (
              <div className="flex flex-col items-center justify-center h-48 gap-2">
                <Icons.Users className={`w-8 h-8 ${t.sub}`} />
                <span className={`text-xs font-mono ${t.sub}`}>No submissions yet</span>
              </div>
            )}
          </div>

          {/* footer */}
          <div className={`px-4 py-2 border-t shrink-0 flex items-center justify-between ${t.divider}`}>
            <span className={`text-[10px] font-mono ${t.sub}`}>
              {players.length} player{players.length !== 1 ? 's' : ''} ranked
            </span>
            <span className={`text-[10px] font-mono ${t.sub}`}>
              Refreshes every {POLL_INTERVAL_MS / 1000}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
