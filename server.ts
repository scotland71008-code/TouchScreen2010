import express from "express";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let currentFilename = "";
let currentDirname = "";
try {
  if (typeof import.meta !== "undefined" && import.meta?.url) {
    currentFilename = fileURLToPath(import.meta.url);
    currentDirname = path.dirname(currentFilename);
  }
} catch {}

if (!currentFilename) {
  currentFilename = path.resolve(process.cwd(), "server.ts");
  currentDirname = process.cwd();
}

const __filename = currentFilename;
const __dirname = currentDirname;

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

// ─── Live Quiz Game Engine ────────────────────────────────────────────────────

import {
  QUIZ_BANK,
  QUIZ_DAYS,
  DIFFICULTY_CONFIG as QUIZ_DIFF_CONFIG,
  type Difficulty,
  type QuizQuestion,
} from "./src/data/liveQuizQuestions.ts";

const DIFFICULTY_CONFIG = QUIZ_DIFF_CONFIG;
const QUIZ_DAYS_META = QUIZ_DAYS;

const TIME_PER_Q = 20;
const COLORS = ["#e74c3c","#3498db","#f1c40f","#2ecc71"];
const SHAPES = ["▲","◆","●","■"];

export interface QuizPlayer {
  id: string;
  name: string;
  organization: string; // University / Organization
  specialization: string; // Specialization \ Field
  email: string;
  score: number;
  lastSeen: number;
  answeredCurrentQ: boolean;
  currentAnswer: number | null;
  company?: string;
  position?: string;
}

export interface PlayerCapturedAnswer {
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
}

export interface CapturedQuestion {
  questionIdx: number;
  questionNumber: number;
  question: string;
  domain?: string;
  difficulty: string;
  points: number;
  options: string[];
  correctOptionIdx: number;
  correctOptionText: string;
  answers: Record<string, PlayerCapturedAnswer>;
}

interface GameState {
  status: "waiting" | "question" | "reveal" | "leaderboard" | "finished";
  currentQ: number;
  questionStartedAt: number;
  players: Record<string, QuizPlayer>;
  currentAnswers: Record<string, { idx: number; timeMs: number }>;
  selectedDay: number;
  selectedDifficulty: Difficulty;
  selectedQuestionCount: number; // 5, 10, 15, or 20
  sessionQuestions: QuizQuestion[];
  capturedQuestions: Record<number, CapturedQuestion>;
}

function generateSessionQuestions(day: number, difficulty: Difficulty, count: number): QuizQuestion[] {
  const pool = QUIZ_BANK[day]?.[difficulty] ?? QUIZ_BANK[1].EASY;
  const picked = pool.slice(0, Math.min(pool.length, count));

  // Determine balanced answer slots [0,1,2,3...] without adjacent duplicates
  const slots: number[] = [];
  for (let i = 0; i < picked.length; i++) {
    slots.push(i % 4);
  }
  for (let attempt = 0; attempt < 500; attempt++) {
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    let hasAdj = false;
    for (let i = 0; i < slots.length - 1; i++) {
      if (slots[i] === slots[i + 1]) { hasAdj = true; break; }
    }
    if (!hasAdj) break;
  }

  return picked.map((q, idx) => {
    const targetSlot = slots[idx % slots.length];
    const correctText = q.options[q.correct];
    const otherOptions = q.options.filter((_, i) => i !== q.correct);
    for (let i = otherOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherOptions[i], otherOptions[j]] = [otherOptions[j], otherOptions[i]];
    }
    const newOptions: string[] = [];
    let dIdx = 0;
    for (let i = 0; i < 4; i++) {
      if (i === targetSlot) newOptions.push(correctText);
      else newOptions.push(otherOptions[dIdx++]);
    }
    return {
      ...q,
      options: newOptions,
      correct: targetSlot,
    };
  });
}

let G: GameState = {
  status: "waiting",
  currentQ: 0,
  questionStartedAt: 0,
  players: {},
  currentAnswers: {},
  selectedDay: 1,
  selectedDifficulty: "EASY",
  selectedQuestionCount: 5,
  sessionQuestions: generateSessionQuestions(1, "EASY", 5),
  capturedQuestions: {},
};

function activeQuestions(): QuizQuestion[] {
  if (G.sessionQuestions && G.sessionQuestions.length > 0) {
    return G.sessionQuestions;
  }
  const count = Math.min(20, G.selectedQuestionCount || 5);
  G.sessionQuestions = generateSessionQuestions(G.selectedDay, G.selectedDifficulty, count);
  return G.sessionQuestions;
}

function resetGame(day?: number, difficulty?: Difficulty, questionCount?: number) {
  const chosenDay = day ?? G.selectedDay;
  const chosenDiff = difficulty ?? G.selectedDifficulty;
  const count = questionCount && [5, 10, 15, 20].includes(questionCount)
    ? questionCount
    : (G.selectedQuestionCount || 5);
  G = {
    status: "waiting",
    currentQ: 0,
    questionStartedAt: 0,
    players: {},
    currentAnswers: {},
    selectedDay: chosenDay,
    selectedDifficulty: chosenDiff,
    selectedQuestionCount: count,
    sessionQuestions: generateSessionQuestions(chosenDay, chosenDiff, count),
    capturedQuestions: {},
  };
}

function activePlayers() {
  const cutoff = Date.now() - 30_000;
  return Object.values(G.players).filter(p => p.lastSeen > cutoff);
}

function ensureCapturedQuestion(qIdx: number): CapturedQuestion {
  const Qs = activeQuestions();
  const q = Qs[qIdx];
  if (!G.capturedQuestions[qIdx]) {
    G.capturedQuestions[qIdx] = {
      questionIdx: qIdx,
      questionNumber: qIdx + 1,
      question: q?.question || `Question ${qIdx + 1}`,
      domain: QUIZ_DAYS_META.find(d => d.id === G.selectedDay)?.theme || 'Engineering',
      difficulty: q?.difficulty || G.selectedDifficulty,
      points: q?.points || DIFFICULTY_CONFIG[G.selectedDifficulty].points,
      options: q ? [...q.options] : [],
      correctOptionIdx: q?.correct ?? 0,
      correctOptionText: q ? q.options[q.correct] : '',
      answers: {},
    };
  }
  return G.capturedQuestions[qIdx];
}

function recordUnansweredPlayers(qIdx: number) {
  const captured = ensureCapturedQuestion(qIdx);
  const players = activePlayers();
  for (const p of players) {
    if (!captured.answers[p.id]) {
      captured.answers[p.id] = {
        playerId: p.id,
        name: p.name,
        organization: p.organization || p.company || '',
        specialization: p.specialization || p.position || '',
        email: p.email || '',
        selectedOptionIdx: null,
        selectedOptionText: "No Answer (Timed Out)",
        isCorrect: false,
        timeMs: TIME_PER_Q * 1000,
        pointsAwarded: 0,
      };
    }
  }
}

function leaderboard() {
  return activePlayers().sort((a, b) => b.score - a.score).map((p, i) => ({
    rank: i + 1,
    id: p.id,
    name: p.name,
    organization: p.organization || p.company || '',
    specialization: p.specialization || p.position || '',
    email: p.email || '',
    company: p.organization || p.company || '',
    position: p.specialization || p.position || '',
    score: p.score
  }));
}

export function buildTournamentExcelWorkbook() {
  const wb = XLSX.utils.book_new();
  const lb = leaderboard();
  const capturedList = Object.values(G.capturedQuestions).sort((a, b) => a.questionIdx - b.questionIdx);
  const totalQuestions = capturedList.length || activeQuestions().length;

  // ── Sheet 1: Tournament Standings & Participants ──
  const standingsRows = lb.map(p => {
    let correctCount = 0;
    let attemptedCount = 0;
    capturedList.forEach(q => {
      const a = q.answers[p.id];
      if (a) {
        if (a.selectedOptionIdx !== null) attemptedCount++;
        if (a.isCorrect) correctCount++;
      }
    });
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) + "%" : "0%";
    let certTier = "🎖️ Official Honors Participant";
    if (p.rank === 1) certTier = "💎 Platinum Architect Champion (1st Place)";
    else if (p.rank === 2) certTier = "🥇 Gold Architect Finalist (2nd Place)";
    else if (p.rank === 3) certTier = "🥈 Silver Specialist Finalist (3rd Place)";
    else if (p.rank === 4) certTier = "🥉 Bronze Associate Finalist (4th Place)";

    return {
      "Rank": p.rank,
      "Participant Name": p.name,
      "University / Organization": p.organization,
      "Specialization / Field": p.specialization,
      "Email": p.email,
      "Final Score (pts)": p.score,
      "Correct Answers": correctCount,
      "Total Questions": totalQuestions,
      "Accuracy Rate": accuracy,
      "Certificate Awarded": certTier,
    };
  });

  const wsStandings = XLSX.utils.json_to_sheet(standingsRows.length ? standingsRows : [
    {
      "Rank": "-",
      "Participant Name": "No participants registered",
      "University / Organization": "-",
      "Specialization / Field": "-",
      "Email": "-",
      "Final Score (pts)": 0,
      "Correct Answers": 0,
      "Total Questions": totalQuestions,
      "Accuracy Rate": "0%",
      "Certificate Awarded": "-"
    }
  ]);
  wsStandings["!cols"] = [
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
  XLSX.utils.book_append_sheet(wb, wsStandings, "Leaderboard & Standings");

  // ── Sheet 2: Participant Results Matrix ──
  const matrixRows = lb.map(p => {
    const row: Record<string, any> = {
      "Rank": p.rank,
      "Participant Name": p.name,
      "University / Organization": p.organization,
      "Specialization / Field": p.specialization,
      "Email": p.email,
      "Final Score": p.score,
    };
    capturedList.forEach(q => {
      const a = q.answers[p.id];
      const colKey = `Q${q.questionNumber}: ${q.question.slice(0, 35)}...`;
      if (!a || a.selectedOptionIdx === null) {
        row[colKey] = "Timed Out / No Answer (0 pts)";
      } else if (a.isCorrect) {
        row[colKey] = `✓ ${a.selectedOptionText} (+${a.pointsAwarded} pts)`;
      } else {
        row[colKey] = `✗ ${a.selectedOptionText} [Correct: ${q.correctOptionText}]`;
      }
    });
    return row;
  });
  const wsMatrix = XLSX.utils.json_to_sheet(matrixRows.length ? matrixRows : [
    { "Rank": "-", "Participant Name": "No participants", "University / Organization": "-", "Specialization / Field": "-", "Email": "-", "Final Score": 0 }
  ]);
  XLSX.utils.book_append_sheet(wb, wsMatrix, "Results Matrix");

  // ── Sheet 3: Captured Questions Log ──
  const questionsRows = capturedList.map(q => {
    const totalAns = Object.keys(q.answers).length;
    const correctAns = Object.values(q.answers).filter(a => a.isCorrect).length;
    const acc = totalAns > 0 ? Math.round((correctAns / totalAns) * 100) + "%" : "0%";
    return {
      "Q#": q.questionNumber,
      "Question Text": q.question,
      "Domain / Category": q.domain || "Engineering",
      "Difficulty": q.difficulty,
      "Base Points": q.points,
      "Option A": q.options[0] || "",
      "Option B": q.options[1] || "",
      "Option C": q.options[2] || "",
      "Option D": q.options[3] || "",
      "Correct Option Index": q.correctOptionIdx + 1,
      "Correct Answer Text": q.correctOptionText,
      "Total Participants Answered": totalAns,
      "Total Correct Answers": correctAns,
      "Accuracy Rate": acc,
    };
  });
  const wsQuestions = XLSX.utils.json_to_sheet(questionsRows.length ? questionsRows : [
    { "Q#": 1, "Question Text": "No questions captured yet", "Domain / Category": "-", "Difficulty": "-", "Base Points": 0, "Option A": "-", "Option B": "-", "Option C": "-", "Option D": "-", "Correct Answer Index": 1, "Correct Answer Text": "-", "Total Participants Answered": 0, "Total Correct Answers": 0, "Accuracy Rate": "0%" }
  ]);
  wsQuestions["!cols"] = [
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
  XLSX.utils.book_append_sheet(wb, wsQuestions, "Captured Questions Log");

  // ── Sheet 4: Participant Detailed Responses Audit ──
  const auditRows: any[] = [];
  capturedList.forEach(q => {
    Object.values(q.answers).forEach(a => {
      auditRows.push({
        "Question #": q.questionNumber,
        "Question Text": q.question,
        "Participant Name": a.name,
        "University / Organization": a.organization,
        "Specialization / Field": a.specialization,
        "Email": a.email,
        "Participant Answer": a.selectedOptionText,
        "Correct Answer": q.correctOptionText,
        "Result Status": a.isCorrect ? "CORRECT" : (a.selectedOptionIdx === null ? "TIMEOUT" : "INCORRECT"),
        "Response Time (sec)": (a.timeMs / 1000).toFixed(2),
        "Points Awarded": a.pointsAwarded,
      });
    });
  });
  const wsAudit = XLSX.utils.json_to_sheet(auditRows.length ? auditRows : [
    { "Question #": 1, "Question Text": "-", "Participant Name": "-", "University / Organization": "-", "Specialization / Field": "-", "Email": "-", "Participant Answer": "-", "Correct Answer": "-", "Result Status": "-", "Response Time (sec)": "0.00", "Points Awarded": 0 }
  ]);
  wsAudit["!cols"] = [
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
  XLSX.utils.book_append_sheet(wb, wsAudit, "Participant Detailed Responses");

  return wb;
}

function buildAchievementCertificatePdf(winner: {
  rank: number;
  name: string;
  organization?: string;
  specialization?: string;
  email?: string;
  score?: number;
  dateStr?: string;
  nameX?: number;
  nameY?: number;
  dateX?: number;
  dateY?: number;
  includeBody?: boolean;
}): Buffer {
  const W = 1584;
  const H = 1224;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [W, H],
    hotfixes: ["px_scaling"],
  });

  // Try to load the official blank certificate image
  const bgPath = path.join(__dirname, "public", "certificate_background.png");
  if (fs.existsSync(bgPath)) {
    try {
      const bgBuf = fs.readFileSync(bgPath);
      doc.addImage("data:image/png;base64," + bgBuf.toString("base64"), "PNG", 0, 0, W, H);
    } catch (e) {
      console.warn("Could not load certificate_background.png, using fallback rendering:", e);
      drawVectorCertificateFallback(doc, W, H);
    }
  } else {
    drawVectorCertificateFallback(doc, W, H);
  }

  // Load and register Great Vibes Google Font for recipient name
  const fontPath = path.join(__dirname, "public", "fonts", "GreatVibes-Regular.ttf");
  let hasGreatVibes = false;
  if (fs.existsSync(fontPath)) {
    try {
      const fontB64 = fs.readFileSync(fontPath).toString("base64");
      doc.addFileToVFS("GreatVibes.ttf", fontB64);
      doc.addFont("GreatVibes.ttf", "GreatVibes", "normal");
      hasGreatVibes = true;
    } catch (fontErr) {
      console.warn("Could not register GreatVibes font:", fontErr);
    }
  }

  // Coordinates matching user instructions
  // Name is centred at x=792, just above the name line (y=710)
  const nameX = typeof winner.nameX === "number" ? winner.nameX : 792;
  const nameY = typeof winner.nameY === "number" ? winner.nameY : 700;

  // Date is centred at x=345, above the left date line (y=1013)
  const dateX = typeof winner.dateX === "number" ? winner.dateX : 345;
  const dateY = typeof winner.dateY === "number" ? winner.dateY : 1000;

  // 1. Recipient Name in Great Vibes script
  doc.setTextColor(255, 255, 255);
  if (hasGreatVibes) {
    doc.setFont("GreatVibes", "normal");
    doc.setFontSize(68);
  } else {
    doc.setFont("times", "italic");
    doc.setFontSize(60);
  }
  doc.text(winner.name || "Participant Name", nameX, nameY, { align: "center" });

  // 2. Participant Credentials (Specialization · University/Org · Email)
  const org = winner.organization || "";
  const spec = winner.specialization || "";
  const credParts: string[] = [];
  if (spec) credParts.push(spec);
  if (org) credParts.push(org);
  if (winner.email) credParts.push(`(${winner.email})`);
  const credLine = credParts.join(" · ");

  if (credLine) {
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(credLine, 792, 748, { align: "center" });
  }

  // 3. Body sentence — two segments so "1st/2nd/3rd place" renders in pink
  if (winner.includeBody !== false) {
    const placeWord = winner.rank === 1 ? "1st place" : winner.rank === 2 ? "2nd place" : winner.rank === 3 ? "3rd place" : `${winner.rank}th place`;
    const before = `In recognition of your participation in the ADIPEC interactive quiz and for securing `;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    const beforeW = doc.getTextWidth(before);
    const highlightW = doc.getTextWidth(placeWord);
    const startX = 792 - (beforeW + highlightW) / 2;
    doc.setTextColor(226, 232, 240);
    doc.text(before, startX, 820, { align: "left" });
    doc.setTextColor(244, 63, 94);
    doc.setFont("helvetica", "bold");
    doc.text(placeWord, startX + beforeW, 820, { align: "left" });
  }

  // 4. Date: centred at x=345, above y=1013
  const dateText = winner.dateStr || new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setTextColor(241, 245, 249);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(18);
  doc.text(dateText, dateX, dateY, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

function drawVectorCertificateFallback(doc: any, W: number, H: number) {
  doc.setFillColor(17, 18, 23);
  doc.rect(0, 0, W, H, "F");

  // Waves
  doc.setDrawColor(224, 36, 125);
  doc.setLineWidth(2);
  doc.line(820, 0, W, 450);
  doc.line(0, 770, 630, H);

  // Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("OCTAVE", W - 140, 100, { align: "center" });

  // Headings
  doc.setFontSize(54);
  doc.text("C E R T I F I C A T E", W / 2, 330, { align: "center" });
  doc.setTextColor(224, 36, 125);
  doc.setFontSize(22);
  doc.text("O F   A C H I E V E M E N T", W / 2, 400, { align: "center" });

  doc.setTextColor(203, 213, 225);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(20);
  doc.text("This certificate is proudly presented to", W / 2, 510, { align: "center" });

  // Divider lines
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2.5);
  doc.line(442, 710, 1142, 710); // Name line

  doc.setLineWidth(2);
  doc.line(215, 1013, 475, 1013); // Date line
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(15);
  doc.text("DATE", 345, 1052, { align: "center" });

  doc.line(1109, 1013, 1369, 1013); // Signature line
  doc.text("SIGNATURE", 1239, 1052, { align: "center" });
  doc.setFont("times", "italic");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("Octave Committee", 1239, 995, { align: "center" });
}

// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ── Quiz CORS (allow React dev server on any port to call these routes) ──────
  const quizCors = (_req: any, res: any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  };
  app.options('/api/quiz/*', quizCors, (_req: any, res: any) => res.sendStatus(204));

  // ── Quiz: select day (stores day, awaits difficulty selection) ─────────────
  app.post("/api/quiz/select-day", quizCors, (req, res) => {
    const day = parseInt(req.body.day, 10);
    const meta = QUIZ_DAYS_META.find(d => d.id === day);
    if (!meta || !QUIZ_BANK[day]) return res.status(400).json({ error: "Invalid day" });
    G.selectedDay = day;
    res.json({ ok: true, day, label: meta.label, theme: meta.theme });
  });

  // ── Quiz: select difficulty (stores difficulty and resets game) ─────────────
  app.post("/api/quiz/select-difficulty", quizCors, (req, res) => {
    const diff = (req.body.difficulty || "").toUpperCase() as Difficulty;
    const count = parseInt(req.body.questionCount || "5", 10);
    const validCount = [5, 10, 15, 20].includes(count) ? count : 5;
    if (!["EASY","MEDIUM","HARD","DIFFICULT"].includes(diff)) return res.status(400).json({ error: "Invalid difficulty" });
    if (!QUIZ_BANK[G.selectedDay]?.[diff]) return res.status(400).json({ error: "No questions for this day/difficulty" });
    resetGame(G.selectedDay, diff, validCount);
    const cfg = DIFFICULTY_CONFIG[diff];
    res.json({
      ok: true,
      difficulty: diff,
      label: cfg.label,
      questionCount: activeQuestions().length,
      availablePoolSize: QUIZ_BANK[G.selectedDay][diff].length,
    });
  });

  // ── Quiz: select length (5, 10, 15, or 20 questions) ────────────────────────
  app.post("/api/quiz/select-length", quizCors, (req, res) => {
    const count = parseInt(req.body.questionCount, 10);
    if (![5, 10, 15, 20].includes(count)) {
      return res.status(400).json({ error: "Allowed counts are 5, 10, 15, or 20" });
    }
    G.selectedQuestionCount = count;
    G.sessionQuestions = generateSessionQuestions(G.selectedDay, G.selectedDifficulty, count);
    res.json({ ok: true, questionCount: count, totalQuestions: activeQuestions().length });
  });

  // ── Quiz: list days ─────────────────────────────────────────────────────────
  app.get("/api/quiz/days", quizCors, (_req, res) => {
    res.json(QUIZ_DAYS_META.map(d => ({
      id: d.id, label: d.label, theme: d.theme, color: d.color, icon: d.icon,
      questionCount: Object.values(QUIZ_BANK[d.id]).reduce((s, qs) => s + qs.length, 0),
    })));
  });

  // ── Quiz: server info (returns local IP for QR code auto-population) ─────────
  app.get('/api/quiz/server-info', quizCors, (req, res) => {
    const nets = os.networkInterfaces();
    let localIP = 'localhost';
    for (const name of Object.keys(nets)) {
      const netList = nets[name];
      if (netList) {
        for (const net of netList) {
          if (net.family === 'IPv4' && !net.internal && net.address.startsWith('192.168')) {
            localIP = net.address;
            break;
          }
        }
      }
      if (localIP !== 'localhost') break;
    }
    const hostHeader = req.get('host');
    const isLocal = !hostHeader || hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1');
    const playerURL = !isLocal && hostHeader
      ? `${req.protocol}://${hostHeader}/quiz`
      : `http://${localIP}:3000/quiz`;
    res.json({ ip: !isLocal && hostHeader ? hostHeader : localIP, port: 3000, playerURL });
  });

  // ── Quiz: join ──────────────────────────────────────────────────────────────
  app.post("/api/quiz/join", quizCors, (req, res) => {
    const name = (req.body.name || "").trim().slice(0, 50);
    const organization = (req.body.organization || req.body.university || req.body.company || "").trim().slice(0, 70);
    const specialization = (req.body.specialization || req.body.field || req.body.position || req.body.title || "").trim().slice(0, 70);
    const email = (req.body.email || "").trim().slice(0, 80);

    if (!name) return res.status(400).json({ error: "Full Name is mandatory" });
    if (!organization) return res.status(400).json({ error: "University / Organization is mandatory" });
    if (!specialization) return res.status(400).json({ error: "Specialization / Field is mandatory" });
    if (!email || !email.includes("@")) return res.status(400).json({ error: "Valid Email is mandatory" });

    const id = Math.random().toString(36).slice(2, 10);
    G.players[id] = {
      id,
      name,
      organization,
      specialization,
      email,
      company: organization,
      position: specialization,
      score: 0,
      lastSeen: Date.now(),
      answeredCurrentQ: false,
      currentAnswer: null
    };
    res.json({ playerId: id, playerCount: activePlayers().length });
  });

  // ── Quiz: player state poll ─────────────────────────────────────────────────
  app.get("/api/quiz/player-state", quizCors, (req, res) => {
    const pid = req.query.pid as string;
    const player = pid ? G.players[pid] : null;
    if (player) { player.lastSeen = Date.now(); }
    const timeLeft = G.status === "question"
      ? Math.max(0, TIME_PER_Q - Math.floor((Date.now() - G.questionStartedAt) / 1000))
      : 0;
    const q = activeQuestions()[G.currentQ];
    const dayMeta = QUIZ_DAYS_META.find(d => d.id === G.selectedDay) ?? QUIZ_DAYS_META[0];
    const diffCfg = DIFFICULTY_CONFIG[G.selectedDifficulty];
    res.json({
      status: G.status,
      questionIdx: G.currentQ,
      totalQuestions: activeQuestions().length,
      selectedQuestionCount: G.selectedQuestionCount || 5,
      selectedDay: G.selectedDay,
      dayLabel: dayMeta.label,
      dayTheme: dayMeta.theme,
      selectedDifficulty: G.selectedDifficulty,
      difficultyLabel: diffCfg.label,
      difficultyColor: diffCfg.color,
      difficultyPoints: diffCfg.points,
      question: G.status === "question" || G.status === "reveal" ? q?.question : null,
      options: G.status === "question" || G.status === "reveal" ? q?.options : null,
      correctAnswer: G.status === "reveal" || G.status === "leaderboard" || G.status === "finished" ? q?.correct : null,
      timeLeft,
      myAnswer: player?.currentAnswer ?? null,
      wasCorrect: (G.status === "reveal" || G.status === "leaderboard") && player?.currentAnswer != null ? player.currentAnswer === q?.correct : null,
      myScore: player?.score ?? 0,
      hasAnswered: player?.answeredCurrentQ ?? false,
      playerCount: activePlayers().length,
      leaderboard: G.status === "leaderboard" || G.status === "finished" ? leaderboard() : null,
    });
  });

  // ── Quiz: host state poll ───────────────────────────────────────────────────
  app.get("/api/quiz/host-state", quizCors, (_req, res) => {
    const Qs = activeQuestions();
    const q = Qs[G.currentQ];
    const active = activePlayers();
    const answered = active.filter(p => p.answeredCurrentQ).length;
    const timeLeft = G.status === "question"
      ? Math.max(0, TIME_PER_Q - Math.floor((Date.now() - G.questionStartedAt) / 1000))
      : TIME_PER_Q;
    const dayMeta = QUIZ_DAYS_META.find(d => d.id === G.selectedDay) ?? QUIZ_DAYS_META[0];
    const diffCfg = DIFFICULTY_CONFIG[G.selectedDifficulty];
    res.json({
      status: G.status,
      questionIdx: G.currentQ,
      totalQuestions: Qs.length,
      selectedQuestionCount: G.selectedQuestionCount || 5,
      selectedDay: G.selectedDay,
      dayLabel: dayMeta.label,
      dayTheme: dayMeta.theme,
      selectedDifficulty: G.selectedDifficulty,
      difficultyLabel: diffCfg.label,
      difficultyColor: diffCfg.color,
      difficultyPoints: diffCfg.points,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct,
      difficulty: q.difficulty,
      points: q.points,
      timeLeft,
      playerCount: active.length,
      answeredCount: answered,
      leaderboard: leaderboard(),
      capturedQuestions: Object.values(G.capturedQuestions),
      answerBreakdown: G.status === "reveal" || G.status === "leaderboard"
        ? q.options.map((_, i) => Object.values(G.currentAnswers).filter(a => a.idx === i).length)
        : null,
    });
  });

  // ── Quiz: submit answer ─────────────────────────────────────────────────────
  app.post("/api/quiz/answer", quizCors, (req, res) => {
    const { playerId, answerIdx } = req.body;
    const player = G.players[playerId];
    if (!player || G.status !== "question" || player.answeredCurrentQ) return res.status(400).json({ error: "Cannot answer now" });
    const timeMs = Date.now() - G.questionStartedAt;
    G.currentAnswers[playerId] = { idx: answerIdx, timeMs };
    player.answeredCurrentQ = true;
    player.currentAnswer = answerIdx;
    player.lastSeen = Date.now();
    const q = activeQuestions()[G.currentQ];
    const isCorrect = answerIdx === q.correct;
    let pointsAwarded = 0;
    if (isCorrect) {
      // Speed bonus: faster = more points (min 50% of base)
      const speedFactor = Math.max(0.5, 1 - timeMs / (TIME_PER_Q * 1000));
      pointsAwarded = Math.round(q.points * speedFactor);
      player.score += pointsAwarded;
    }

    const captured = ensureCapturedQuestion(G.currentQ);
    captured.answers[playerId] = {
      playerId,
      name: player.name,
      organization: player.organization,
      specialization: player.specialization,
      email: player.email,
      selectedOptionIdx: answerIdx,
      selectedOptionText: q.options[answerIdx] || '',
      isCorrect,
      timeMs,
      pointsAwarded,
    };

    res.json({ ok: true, myScore: player.score });
  });

  // ── Quiz: host control ──────────────────────────────────────────────────────
  app.post("/api/quiz/control", quizCors, (req, res) => {
    const { action } = req.body;
    if (action === "start") {
      Object.values(G.players).forEach(p => { p.answeredCurrentQ = false; p.currentAnswer = null; });
      G.currentAnswers = {};
      G.status = "question";
      G.questionStartedAt = Date.now();
      ensureCapturedQuestion(G.currentQ);
    } else if (action === "reveal") {
      G.status = "reveal";
      recordUnansweredPlayers(G.currentQ);
    } else if (action === "leaderboard") {
      G.status = "leaderboard";
      recordUnansweredPlayers(G.currentQ);
    } else if (action === "next") {
      recordUnansweredPlayers(G.currentQ);
      if (G.currentQ < activeQuestions().length - 1) {
        G.currentQ++;
        Object.values(G.players).forEach(p => { p.answeredCurrentQ = false; p.currentAnswer = null; });
        G.currentAnswers = {};
        G.status = "question";
        G.questionStartedAt = Date.now();
        ensureCapturedQuestion(G.currentQ);
      } else {
        G.status = "finished";
      }
    } else if (action === "reset") {
      resetGame();
    }
    res.json({ ok: true, status: G.status });
  });

  // ── Quiz: export excel ──────────────────────────────────────────────────────
  app.get("/api/quiz/export-excel", quizCors, (_req, res) => {
    try {
      const wb = buildTournamentExcelWorkbook();
      const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      const filename = `Octave_Tournament_Results_ADIPEC2026_${new Date().toISOString().slice(0, 10)}.xlsx`;
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.send(buf);
    } catch (err: any) {
      console.error("Failed to generate Excel export:", err);
      res.status(500).json({ error: "Failed to export Excel file", details: err?.message });
    }
  });

  // ── Quiz: export individual certificate PDF ────────────────────────────────
  app.get("/api/quiz/certificate-pdf", quizCors, (req, res) => {
    try {
      const rank = parseInt(String(req.query.rank || "1"), 10) || 1;
      let name = String(req.query.name || "").trim();
      let organization = String(req.query.organization || req.query.company || "").trim();
      let specialization = String(req.query.specialization || req.query.position || "").trim();
      let email = String(req.query.email || "").trim();
      let score = parseInt(String(req.query.score || "0"), 10) || 0;

      const playerId = String(req.query.playerId || "");
      if (playerId && G.players[playerId]) {
        const p = G.players[playerId];
        name = name || p.name;
        organization = organization || p.organization;
        specialization = specialization || p.specialization;
        email = email || p.email;
        score = score || p.score;
      }

      if (!name) {
        const lb = leaderboard();
        const p = lb[rank - 1];
        if (p) {
          name = p.name;
          organization = organization || p.organization;
          specialization = specialization || p.specialization;
          email = email || p.email;
          score = score || p.score;
        } else {
          name = `Winner (Rank ${rank})`;
        }
      }

      const nameX = req.query.nameX ? parseInt(String(req.query.nameX), 10) : undefined;
      const nameY = req.query.nameY ? parseInt(String(req.query.nameY), 10) : undefined;
      const dateX = req.query.dateX ? parseInt(String(req.query.dateX), 10) : undefined;
      const dateY = req.query.dateY ? parseInt(String(req.query.dateY), 10) : undefined;
      const includeBody = req.query.includeBody !== "false";

      const pdfBuf = buildAchievementCertificatePdf({
        rank,
        name,
        organization,
        specialization,
        email,
        score,
        nameX,
        nameY,
        dateX,
        dateY,
        includeBody,
      });

      const placeLabel = rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : `${rank}th`;
      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const filename = `Octave_Certificate_${placeLabel}_Place_${safeName}.pdf`;

      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Length", String(pdfBuf.length));
      res.send(pdfBuf);
    } catch (err: any) {
      console.error("Failed to generate certificate PDF:", err);
      res.status(500).json({ error: "Failed to generate certificate PDF", details: err?.message });
    }
  });
  app.get("/api/quiz/export-data", quizCors, (_req, res) => {
    res.json({
      tournament: {
        day: G.selectedDay,
        dayMeta: QUIZ_DAYS_META.find(d => d.id === G.selectedDay),
        difficulty: G.selectedDifficulty,
        totalQuestions: activeQuestions().length,
        status: G.status,
      },
      leaderboard: leaderboard(),
      capturedQuestions: Object.values(G.capturedQuestions),
    });
  });

  // ── Quiz: serve mobile player page ─────────────────────────────────────────
  app.get("/quiz", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<title>Octave Live Quiz · ADIPEC 2026</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
:root{
  --bg:#070b12;
  --card-bg:rgba(15,23,42,0.85);
  --border:rgba(255,255,255,0.12);
  --accent:#38bdf8;
  --accent-glow:rgba(56,189,248,0.3);
}
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  background:radial-gradient(ellipse at 50% -20%, #0c2d48 0%, #070b12 70%);
  color:#f8fafc;
  min-height:100dvh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
}
.screen{
  display:none;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  flex:1;
  padding:24px 20px;
  text-align:center;
  gap:16px;
}
.screen.active{display:flex;}
.brand-pill{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:4px 12px;
  background:rgba(56,189,248,0.12);
  border:1px solid rgba(56,189,248,0.3);
  border-radius:999px;
  font-size:11px;
  font-weight:800;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:#38bdf8;
  margin-bottom:6px;
}
h1{font-size:24px;font-weight:900;letter-spacing:-0.02em;line-height:1.2;color:#ffffff;}
p.sub{font-size:14px;color:#94a3b8;line-height:1.5;max-width:320px;}
.input-wrap{width:100%;max-width:340px;position:relative;}
input{
  width:100%;
  padding:16px 20px;
  background:rgba(15,23,42,0.9);
  border:2px solid rgba(255,255,255,0.15);
  border-radius:16px;
  color:#fff;
  font-size:16px;
  font-weight:700;
  outline:none;
  text-align:center;
  transition:all .2s;
  box-shadow:0 8px 24px rgba(0,0,0,0.4);
}
input:focus{
  border-color:#38bdf8;
  box-shadow:0 0 20px var(--accent-glow);
}
.btn{
  width:100%;
  max-width:340px;
  padding:16px 24px;
  background:linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  color:#04131f;
  font-weight:900;
  font-size:15px;
  border:none;
  border-radius:16px;
  cursor:pointer;
  letter-spacing:.04em;
  transition:transform .15s, box-shadow .15s;
  box-shadow:0 8px 24px rgba(56,189,248,0.3);
}
.btn:active{transform:scale(0.98);}
.btn:disabled{background:#1e293b;color:#64748b;cursor:not-allowed;box-shadow:none;}

/* Icon pods */
.icon-pod{
  width:84px;
  height:84px;
  border-radius:24px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:8px;
  position:relative;
}
.icon-pod.waiting{
  background:rgba(56,189,248,0.12);
  border:1.5px solid rgba(56,189,248,0.3);
  box-shadow:0 0 30px rgba(56,189,248,0.25);
  animation:breathe 2s ease-in-out infinite;
}
.icon-pod.locked{
  background:rgba(168,85,247,0.12);
  border:1.5px solid rgba(168,85,247,0.3);
  box-shadow:0 0 30px rgba(168,85,247,0.25);
}
.icon-pod.correct{
  background:rgba(34,197,94,0.15);
  border:1.5px solid rgba(34,197,94,0.4);
  box-shadow:0 0 35px rgba(34,197,94,0.35);
  animation:pop .35s ease-out;
}
.icon-pod.wrong{
  background:rgba(239,68,68,0.15);
  border:1.5px solid rgba(239,68,68,0.4);
  box-shadow:0 0 35px rgba(239,68,68,0.35);
  animation:shake .4s ease-out;
}
.icon-pod.timeout{
  background:rgba(245,158,11,0.15);
  border:1.5px solid rgba(245,158,11,0.4);
  box-shadow:0 0 35px rgba(245,158,11,0.35);
}
@keyframes breathe{0%,100%{transform:scale(1);opacity:0.9;}50%{transform:scale(1.06);opacity:1;}}
@keyframes pop{0%{transform:scale(0.85);}50%{transform:scale(1.12);}100%{transform:scale(1);}}
@keyframes shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-6px);}40%,80%{transform:translateX(6px);}}

/* Question layout */
.q-header{
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:14px 18px;
  background:rgba(15,23,42,0.95);
  border-bottom:1px solid rgba(255,255,255,0.08);
  backdrop-filter:blur(10px);
}
.q-track{
  display:flex;
  align-items:center;
  gap:8px;
  font-size:12px;
  font-weight:800;
  color:#94a3b8;
  letter-spacing:.05em;
}
.q-badge{
  font-size:10px;
  font-weight:900;
  text-transform:uppercase;
  padding:3px 8px;
  border-radius:6px;
  background:rgba(56,189,248,0.12);
  border:1px solid rgba(56,189,248,0.25);
  color:#38bdf8;
}
.q-score{
  font-size:14px;
  font-weight:900;
  color:#38bdf8;
  font-variant-numeric:tabular-nums;
}
.timer-bar{width:100%;height:5px;background:#0f172a;}
.timer-fill{height:100%;background:#38bdf8;transition:width 1s linear;transform-origin:left;}
.timer-fill.danger{background:#ef4444;}
.question-box{flex:1;display:flex;align-items:center;justify-content:center;padding:18px;width:100%;}
.question-text{font-size:18px;font-weight:800;line-height:1.4;max-width:440px;color:#f8fafc;}

/* Option tiles */
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:440px;padding:16px;}
.tile{
  padding:20px 14px;
  border-radius:18px;
  font-size:15px;
  font-weight:800;
  border:none;
  cursor:pointer;
  color:#fff;
  display:flex;
  align-items:center;
  gap:12px;
  transition:transform .12s, box-shadow .15s, opacity .15s;
  text-align:left;
  position:relative;
  overflow:hidden;
  box-shadow:0 6px 16px rgba(0,0,0,0.3);
}
.tile:active{transform:scale(.95);}
.tile.selected{outline:3px solid #ffffff;box-shadow:0 0 24px rgba(255,255,255,0.5);}
.tile:disabled{cursor:default;}
.tile-shape{
  width:32px;
  height:32px;
  border-radius:10px;
  background:rgba(0,0,0,0.25);
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
}
.tile-text{flex:1;line-height:1.3;font-size:14px;}

/* Leaderboard */
.lb-list{width:100%;max-width:420px;display:flex;flex-direction:column;gap:10px;max-height:55vh;overflow-y:auto;padding-right:2px;}
.lb-row{
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px 16px;
  background:rgba(15,23,42,0.85);
  border-radius:16px;
  border:1px solid rgba(255,255,255,0.08);
  transition:all .2s;
}
.lb-row.is-me{
  background:rgba(56,189,248,0.15);
  border-color:rgba(56,189,248,0.45);
  box-shadow:0 0 20px rgba(56,189,248,0.2);
}
.lb-rank{
  width:32px;
  height:32px;
  border-radius:50%;
  background:rgba(255,255,255,0.08);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:12px;
  font-weight:900;
  flex-shrink:0;
  color:#94a3b8;
}
.lb-rank.gold{background:linear-gradient(135deg, #fbbf24, #d97706);color:#000;box-shadow:0 0 12px rgba(251,191,36,0.4);}
.lb-rank.silver{background:linear-gradient(135deg, #cbd5e1, #94a3b8);color:#000;}
.lb-rank.bronze{background:linear-gradient(135deg, #d97706, #78350f);color:#fff;}
.lb-name{flex:1;font-size:14px;font-weight:800;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;align-items:center;gap:6px;}
.you-pill{font-size:9px;font-weight:900;letter-spacing:.08em;padding:2px 6px;border-radius:4px;background:#38bdf8;color:#04131f;}
.lb-score{font-size:14px;font-weight:900;color:#38bdf8;font-variant-numeric:tabular-nums;}
.cert-chip{
  display:inline-flex;
  align-items:center;
  gap:4px;
  padding:3px 8px;
  background:rgba(251,191,36,0.15);
  border:1px solid rgba(251,191,36,0.35);
  border-radius:6px;
  font-size:10px;
  font-weight:800;
  color:#fbbf24;
}
</style>
</head>
<body>
<!-- JOIN -->
<div class="screen active" id="s-join">
  <div class="brand-pill">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    <span>OCTAVE · ADIPEC 2026</span>
  </div>
  <h1>Join Live Tournament</h1>
  <p class="sub">Enter your mandatory participant details to compete and qualify for official certificates</p>
  <div class="input-wrap" style="display:flex;flex-direction:column;gap:10px;text-align:left;">
    <div>
      <label style="font-size:11px;font-weight:700;color:#94a3b8;display:block;margin-bottom:4px;">Name <span style="color:#f87171;">*</span></label>
      <input id="inp-name" placeholder="Enter your full name" value="" maxlength="50" autocomplete="off"/>
    </div>
    <div>
      <label style="font-size:11px;font-weight:700;color:#94a3b8;display:block;margin-bottom:4px;">University / Organization <span style="color:#f87171;">*</span></label>
      <input id="inp-organization" placeholder="e.g. Khalifa University or ADNOC" value="" maxlength="70" autocomplete="off"/>
    </div>
    <div>
      <label style="font-size:11px;font-weight:700;color:#94a3b8;display:block;margin-bottom:4px;">Specialization / Field <span style="color:#f87171;">*</span></label>
      <input id="inp-specialization" placeholder="e.g. Petroleum Engineering, Data Science..." value="" maxlength="70" autocomplete="off"/>
    </div>
    <div>
      <label style="font-size:11px;font-weight:700;color:#94a3b8;display:block;margin-bottom:4px;">Email <span style="color:#f87171;">*</span></label>
      <input id="inp-email" type="email" placeholder="e.g. participant@domain.com" value="" maxlength="80" autocomplete="off"/>
    </div>
  </div>
  <button class="btn" id="btn-join">Enter Tournament →</button>
  <p id="join-err" style="color:#f87171;font-size:12px;font-weight:700;min-height:18px;"></p>
</div>

<!-- WAITING -->
<div class="screen" id="s-wait">
  <div class="brand-pill">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    <span>OCTAVE TOURNAMENT LOBBY</span>
  </div>
  <div class="icon-pod waiting">
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
      <circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
    </svg>
  </div>
  <h1 id="wait-title">Waiting for Host to Launch</h1>
  <p class="sub" id="wait-count">Connected to live session</p>
  <div id="wait-info-chip" style="margin-top:4px;"></div>
</div>

<!-- QUESTION -->
<div class="screen" id="s-question" style="padding:0;justify-content:flex-start;">
  <div class="q-header">
    <div class="q-track">
      <span class="q-badge" id="q-track-badge">ADIPEC 2026</span>
      <span id="q-num">Q 1 / 10</span>
    </div>
    <span class="q-score" id="q-score">0 pts</span>
  </div>
  <div class="timer-bar"><div class="timer-fill" id="timer-fill" style="width:100%"></div></div>
  <div class="question-box"><div class="question-text" id="q-text"></div></div>
  <div class="tiles" id="q-tiles"></div>
</div>

<!-- ANSWER RESULT -->
<div class="screen" id="s-result">
  <div class="icon-pod" id="r-pod"></div>
  <div id="r-text" style="font-size:22px;font-weight:900;color:#fff;"></div>
  <div id="r-sub" class="sub" style="margin-top:2px;"></div>
  <div id="r-score" style="color:#38bdf8;font-size:20px;font-weight:900;margin-top:6px;"></div>
</div>

<!-- LEADERBOARD -->
<div class="screen" id="s-lb">
  <div class="brand-pill">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
    <span id="lb-header-tag">TOURNAMENT STANDINGS</span>
  </div>
  <h1 id="lb-title">Leaderboard</h1>
  <div class="lb-list" id="lb-list"></div>
</div>

<script>
const COLORS = ["#e74c3c", "#3498db", "#f59e0b", "#10b981"];
const SHAPES_SVG = [
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 21h20L12 3z"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>'
];

let pid = null, myScore = 0, lastStatus = null, pollTimer = null;

function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function triggerHaptic(type){
  if(navigator.vibrate){
    if(type==='tap') navigator.vibrate(30);
    else if(type==='correct') navigator.vibrate([40, 60, 80]);
    else if(type==='wrong') navigator.vibrate([80, 50, 80]);
  }
}

document.getElementById('btn-join').onclick = async () => {
  const name = document.getElementById('inp-name').value.trim();
  const organization = document.getElementById('inp-organization').value.trim();
  const specialization = document.getElementById('inp-specialization').value.trim();
  const email = document.getElementById('inp-email').value.trim();

  if(!name){
    document.getElementById('join-err').textContent = 'Please enter your Name';
    return;
  }
  if(!organization){
    document.getElementById('join-err').textContent = 'Please enter your University / Organization';
    return;
  }
  if(!specialization){
    document.getElementById('join-err').textContent = 'Please enter your Specialization / Field';
    return;
  }
  if(!email || !email.includes('@')){
    document.getElementById('join-err').textContent = 'Please enter a valid Email address';
    return;
  }

  document.getElementById('btn-join').disabled = true;
  triggerHaptic('tap');
  try {
    const r = await fetch('/api/quiz/join', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, organization, specialization, email })
    });
    const d = await r.json();
    if(d.error){
      document.getElementById('join-err').textContent = d.error;
      document.getElementById('btn-join').disabled = false;
      return;
    }
    pid = d.playerId;
    document.getElementById('wait-count').textContent = d.playerCount + ' participant' + (d.playerCount === 1 ? '' : 's') + ' registered';
    show('s-wait');
    startPolling();
  } catch(e) {
    document.getElementById('join-err').textContent = 'Cannot connect to arena server';
    document.getElementById('btn-join').disabled = false;
  }
};

['inp-name', 'inp-organization', 'inp-specialization', 'inp-email'].forEach(id => {
  const el = document.getElementById(id);
  if(el){
    el.addEventListener('keydown', e => {
      if(e.key === 'Enter') document.getElementById('btn-join').click();
    });
  }
});

function startPolling(){
  if(pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(poll, 1500);
  poll();
}

async function poll(){
  if(!pid) return;
  try {
    const r = await fetch('/api/quiz/player-state?pid=' + pid);
    const d = await r.json();
    handleState(d);
  } catch(e){}
}

function handleState(d){
  if(d.status === lastStatus && d.status === 'question' && d.hasAnswered){
    updateTimer(d.timeLeft);
    return;
  }

  if(d.status === 'waiting'){
    document.getElementById('wait-title').textContent = 'Waiting for Host to Launch…';
    document.getElementById('wait-count').textContent = (d.playerCount || 0) + ' engineer' + (d.playerCount === 1 ? '' : 's') + ' in live lobby';
    if(d.dayLabel && d.difficultyLabel){
      document.getElementById('wait-info-chip').innerHTML =
        '<span class="cert-chip">' + d.dayLabel + ' · ' + d.difficultyLabel + ' (' + d.totalQuestions + ' Questions)</span>';
    }
    if(lastStatus !== 'waiting') show('s-wait');
  }
  else if(d.status === 'question' && !d.hasAnswered){
    renderQuestion(d);
    show('s-question');
    updateTimer(d.timeLeft);
  }
  else if(d.status === 'question' && d.hasAnswered){
    show('s-result');
    const pod = document.getElementById('r-pod');
    pod.className = 'icon-pod locked';
    pod.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    document.getElementById('r-text').textContent = 'Answer Locked In!';
    document.getElementById('r-sub').textContent = 'Awaiting reveal from touchscreen host…';
    document.getElementById('r-score').textContent = (d.myScore || 0) + ' pts';
    updateTimer(d.timeLeft);
  }
  else if(d.status === 'reveal'){
    renderReveal(d);
    show('s-result');
  }
  else if(d.status === 'leaderboard' || d.status === 'finished'){
    renderLeaderboard(d);
    show('s-lb');
  }
  lastStatus = d.status;
  myScore = d.myScore || 0;
}

function renderQuestion(d){
  document.getElementById('q-track-badge').textContent = (d.dayLabel || 'ADIPEC') + ' · ' + (d.difficultyLabel || '');
  document.getElementById('q-num').textContent = 'Q ' + (d.questionIdx + 1) + ' / ' + d.totalQuestions;
  document.getElementById('q-score').textContent = (d.myScore || 0) + ' pts';
  document.getElementById('q-text').textContent = d.question;
  const tiles = document.getElementById('q-tiles');
  tiles.innerHTML = '';
  d.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'tile';
    b.style.background = COLORS[i];
    b.innerHTML = '<div class="tile-shape">' + SHAPES_SVG[i] + '</div><span class="tile-text">' + opt + '</span>';
    b.onclick = () => submitAnswer(i, d);
    tiles.appendChild(b);
  });
}

async function submitAnswer(idx, d){
  triggerHaptic('tap');
  document.querySelectorAll('.tile').forEach((t, i) => {
    t.disabled = true;
    if(i === idx) t.classList.add('selected');
    else t.style.opacity = '.45';
  });
  await fetch('/api/quiz/answer', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ playerId: pid, answerIdx: idx })
  });
  const pod = document.getElementById('r-pod');
  pod.className = 'icon-pod locked';
  pod.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  document.getElementById('r-text').textContent = 'Answer Locked In!';
  document.getElementById('r-sub').textContent = 'Awaiting reveal from touchscreen host…';
  document.getElementById('r-score').textContent = '';
  show('s-result');
}

function renderReveal(d){
  const correct = d.wasCorrect;
  const myAns = d.myAnswer;
  const pod = document.getElementById('r-pod');

  if(myAns === null){
    pod.className = 'icon-pod timeout';
    pod.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    document.getElementById('r-text').textContent = 'Time’s Up!';
    document.getElementById('r-sub').textContent = 'Correct answer: ' + d.options[d.correctAnswer];
    triggerHaptic('wrong');
  } else if(correct){
    pod.className = 'icon-pod correct';
    pod.innerHTML = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    document.getElementById('r-text').textContent = 'Correct Answer!';
    document.getElementById('r-sub').textContent = d.options[d.correctAnswer];
    triggerHaptic('correct');
  } else {
    pod.className = 'icon-pod wrong';
    pod.innerHTML = '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    document.getElementById('r-text').textContent = 'Incorrect!';
    document.getElementById('r-sub').textContent = 'Correct was: ' + d.options[d.correctAnswer];
    triggerHaptic('wrong');
  }
  document.getElementById('r-score').textContent = (d.myScore || 0) + ' pts total';
}

function renderLeaderboard(d){
  const isFinal = d.status === 'finished';
  document.getElementById('lb-header-tag').textContent = isFinal ? 'EXHIBITION GRAND FINALE' : 'LIVE STANDINGS';
  document.getElementById('lb-title').textContent = isFinal ? 'Tournament Results' : 'Leaderboard';
  const list = document.getElementById('lb-list');
  list.innerHTML = '';

  const myEnteredName = (document.getElementById('inp-name') ? document.getElementById('inp-name').value.trim() : '');

  if (isFinal) {
    const thanksCard = document.createElement('div');
    thanksCard.style.cssText = 'background:linear-gradient(135deg, rgba(224,36,125,0.15), rgba(56,189,248,0.12));border:1px solid rgba(224,36,125,0.35);border-radius:16px;padding:16px;margin-bottom:14px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.3);';
    thanksCard.innerHTML =
      '<div style="font-size:24px;margin-bottom:6px;">🏆 🤝</div>' +
      '<div style="font-size:15px;font-weight:900;color:#fff;margin-bottom:4px;">Thank You for Participating in the Live Quiz!</div>' +
      '<div style="font-size:12px;color:#cbd5e1;line-height:1.4;">We appreciate your engagement in today’s Octave Tournament at ADIPEC 2026. Official Achievement Certificates are awarded to the Top 3 finalists!</div>';
    list.appendChild(thanksCard);
  }

  (d.leaderboard || []).forEach((p, i) => {
    const div = document.createElement('div');
    const isMe = (pid && p.id === pid) || (p.name && myEnteredName && p.name.trim().toLowerCase() === myEnteredName.toLowerCase());
    div.className = 'lb-row' + (isMe ? ' is-me' : '');
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';

    const certTiers = [
      { label: '🥇 1st Place Certificate', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.35)' },
      { label: '🥈 2nd Place Certificate', color: '#cbd5e1', bg: 'rgba(203,213,225,0.15)', border: 'rgba(203,213,225,0.35)' },
      { label: '🥉 3rd Place Certificate', color: '#f97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.35)' }
    ];

    let cert = '';
    if (i < 3 && isFinal) {
      const ct = certTiers[i];
      cert = '<span class="cert-chip" style="color:' + ct.color + ';background:' + ct.bg + ';border-color:' + ct.border + ';">' + ct.label + '</span>';
    }

    const youPill = isMe ? '<span class="you-pill">YOU</span>' : '';

    let rankIcon = '' + (i + 1);
    if(i === 0) rankIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>';
    else if(i === 1) rankIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>';
    else if(i === 2) rankIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>';

    const org = p.organization || p.company || '';
    const spec = p.specialization || p.position || '';
    const email = p.email || '';
    const subDetail = (org || spec || email)
      ? '<div style="font-size:10px;color:#94a3b8;font-weight:500;margin-top:2px;">' +
          (org ? '<span style="color:#38bdf8;">' + org + '</span>' : '') +
          (spec ? (org ? ' · ' : '') + '<span style="color:#cbd5e1;">' + spec + '</span>' : '') +
          (email ? (org || spec ? ' · ' : '') + '<span style="color:#64748b;font-size:9px;">' + email + '</span>' : '') +
        '</div>'
      : '';

    div.innerHTML =
      '<div class="lb-rank ' + rankClass + '">' + rankIcon + '</div>' +
      '<div class="lb-name" style="flex-direction:column;align-items:flex-start;gap:1px;flex:1;text-align:left;">' +
        '<div style="display:flex;align-items:center;gap:6px;"><span>' + p.name + '</span>' + youPill + '</div>' +
        subDetail +
      '</div>' +
      cert +
      '<div class="lb-score">' + p.score + '</div>';
    list.appendChild(div);
  });

  if (isFinal) {
    let myRank = -1;
    let myPlayer = null;

    (d.leaderboard || []).forEach((p, idx) => {
      const isMe = (pid && p.id === pid) || (p.name && myEnteredName && p.name.trim().toLowerCase() === myEnteredName.toLowerCase());
      if (isMe) {
        myRank = idx + 1;
        myPlayer = p;
      }
    });

    if (myRank >= 1 && myRank <= 3 && myPlayer) {
      const certDiv = document.createElement('div');
      certDiv.style.cssText = 'margin-top:16px;text-align:center;padding:18px 14px;background:linear-gradient(135deg, rgba(224,36,125,0.22), rgba(18,19,25,0.95));border:1.5px solid #e0247d;border-radius:18px;box-shadow:0 10px 28px rgba(224,36,125,0.3);';
      const placeBadge = myRank === 1 ? '🥇 1st Place Champion' : myRank === 2 ? '🥈 2nd Place Finalist' : '🥉 3rd Place Finalist';
      const placeWord = myRank === 1 ? '1st place' : myRank === 2 ? '2nd place' : '3rd place';
      const certPdfUrl = '/api/quiz/certificate-pdf?rank=' + myRank +
        '&name=' + encodeURIComponent(myPlayer.name) +
        '&organization=' + encodeURIComponent(myPlayer.organization || myPlayer.company || '') +
        '&specialization=' + encodeURIComponent(myPlayer.specialization || myPlayer.position || '') +
        '&email=' + encodeURIComponent(myPlayer.email || '') +
        '&score=' + (myPlayer.score || 0);

      certDiv.innerHTML =
        '<div style="font-size:11px;font-weight:900;color:#f472b6;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">' + placeBadge + '</div>' +
        '<div style="font-size:17px;font-weight:900;color:#fff;margin-bottom:6px;">Congratulations ' + myPlayer.name + '!</div>' +
        '<div style="font-size:12px;color:#cbd5e1;margin-bottom:14px;line-height:1.4;">In recognition of your outstanding performance and securing <strong>' + placeWord + '</strong>, your official Certificate of Achievement is ready.</div>' +
        '<a href="' + certPdfUrl + '" download style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 22px;background:linear-gradient(90deg, #e0247d, #f43f5e);color:#fff;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;border-radius:12px;text-decoration:none;box-shadow:0 4px 16px rgba(224,36,125,0.45);">' +
          '🎓 Download Official Certificate (PDF)' +
        '</a>';
      list.appendChild(certDiv);
    } else {
      const thankDiv = document.createElement('div');
      thankDiv.style.cssText = 'margin-top:16px;text-align:center;padding:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;';
      thankDiv.innerHTML =
        '<div style="font-size:13px;font-weight:700;color:#94a3b8;">Thank you for participating in the Octave Live Quiz!</div>' +
        '<div style="font-size:11px;color:#64748b;margin-top:4px;">ADIPEC 2026 Exhibition Arena · Booth 401</div>';
      list.appendChild(thankDiv);
    }
  }
}

function updateTimer(t){
  const fill = document.getElementById('timer-fill');
  if(!fill) return;
  const pct = Math.round((t / 20) * 100);
  fill.style.width = pct + '%';
  fill.className = 'timer-fill' + (t <= 5 ? ' danger' : '');
}
</script>
</body>
</html>`);
  });

  // Helper to construct a local architectural review fallback when no key is set
  function getLocalReview(components: any[], integrations: any[], systemScenario: string) {
    const hasForte = components.some(c => c.solutionId === 'node-forte');
    const hasDatabridge = components.some(c => c.solutionId === 'node-databridge');
    const hasAttune = components.some(c => c.solutionId === 'node-attune');
    const hasOnCall = components.some(c => c.solutionId === 'node-oncall');
    const hasCyber = components.some(c => c.solutionId === 'node-cyber');

    let complianceRating = "Standard Architecture";
    let complianceScore = 75;
    let suggestions = "Consider adding Databridge Pro to safely isolate cross-pillar workflows.";

    if (hasForte && hasAttune && !hasDatabridge) {
      complianceRating = "Direct Cross-Pillar Connection (Unrecommended)";
      complianceScore = 45;
      suggestions = "Critical Rule Violated: Octave Forte (Design) and Octave Attune (Operate) are connected directly. For security and reliable message delivery, direct queries bypass standard middleware. We recommend placing **Databridge Pro** between them.";
    } else if (hasForte && hasAttune && hasDatabridge) {
      const connectForteToBridge = integrations.some(i => 
        (i.sourceId === 'node-forte' && i.targetId === 'node-databridge') ||
        (i.sourceId === 'node-databridge' && i.targetId === 'node-forte')
      );
      const connectBridgeToAttune = integrations.some(i => 
        (i.sourceId === 'node-attune' && i.targetId === 'node-databridge') ||
        (i.sourceId === 'node-databridge' && i.targetId === 'node-attune')
      );
      if (connectForteToBridge && connectBridgeToAttune) {
        complianceRating = "High Interoperability Architecture";
        complianceScore = 98;
        suggestions = "Excellent! You are leveraging **Databridge Pro** to orchestrate real-time synchronization between Design Engineering (Forte) and Enterprise Asset Management (Attune). This layout secures REST and OData pipelines flawlessly.";
      }
    } else if (hasOnCall && hasCyber) {
      complianceRating = "Resilient Public Safety & OT Infrastructure";
      complianceScore = 90;
      suggestions = "Integrating Octave OnCall with Octave Cyber Integrity creates a unified response. When a cyber threat or hardware anomaly is flagged in the OT network, a dispatch record can be triggered immediately.";
    }

    return `
### [Local Fallback Engine] Architecture Review

*Note: Showing locally computed analysis because the system's live Gemini AI connection is pending secret configuration.*

#### 1. Architecture Viability: **${complianceRating} (${complianceScore}/100)**
You have arranged **${components.length} components** with **${integrations.length} data bindings** on the stage. 
- ${suggestions}

#### 2. Portfolio Integration Insights
- **Active Pillars**: ${Array.from(new Set(components.map(c => c.pillar))).join(', ') || 'None selected'}.
- **Integration Protocols**: ${Array.from(new Set(integrations.map(i => i.protocol))).join(', ') || 'No active bindings'}.

#### 3. Strategic Pre-Sales Value Proposition
This configuration optimizes enterprise operations. By combining specialized Octave systems, you replace legacy software (such as ${hasForte ? 'Smart 3D' : ''} ${hasAttune ? 'HxGN EAM' : ''}) with unified cloud-native dashboards. This increases cross-department visibility by up to **42%** and minimizes manual data-entry delays.
    `;
  }

  // Helper to generate content with Gemini model fallback
  async function generateWithFallback(ai: GoogleGenAI, contents: any, systemInstruction?: string) {
    const candidateModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-flash"];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const config: any = {};
        if (systemInstruction) config.systemInstruction = systemInstruction;

        const response = await ai.models.generateContent({
          model,
          contents,
          config: Object.keys(config).length > 0 ? config : undefined
        });

        if (response && response.text) return response.text;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} returned ${err?.status || err?.message || 'error'}, trying next...`);
      }
    }
    throw lastError || new Error("All Gemini models failed");
  }

  // API Route: Quiz Leaderboard — proxies Google Sheets CSV to avoid browser CORS issues
  const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vShade1-zUHbs4UTFjfqAy4Lz-5p7eOA-khugnKIWf1jlPwxVGpUe4TasdhIl-WvNfscvZXHpbZzPHs/pub?gid=0&single=true&output=csv';
  app.get('/api/quiz-leaderboard', async (_req, res) => {
    try {
      const response = await fetch(SHEETS_CSV_URL);
      if (!response.ok) throw new Error(`Sheets returned ${response.status}`);
      const csv = await response.text();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Cache-Control', 'no-store');
      res.send(csv);
    } catch (err: any) {
      console.error('[quiz-leaderboard] fetch failed:', err.message);
      res.status(502).send('Could not fetch leaderboard data');
    }
  });

  // API Route: AI Review
  app.post("/api/ai-review", async (req, res) => {
    const { components, integrations, systemScenario } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "demo-mode") {
      const localReview = getLocalReview(components, integrations, systemScenario);
      return res.json({ synopsis: localReview, isFallback: true });
    }

    try {
      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

      const prompt = `
You are an expert Pre-Sales Solution Architect for "Octave", a premium enterprise engineering, operations, and public safety technology portfolio.
A user is building an integration architecture in our interactive "Octave System Architecture Builder".

Scenario context: ${systemScenario || 'Custom Integration'}
Components on canvas: ${JSON.stringify(components, null, 2)}
Integrations established: ${JSON.stringify(integrations, null, 2)}

Provide a highly professional pre-sales technical synopsis (3-4 paragraphs, Markdown):
1. **Architecture Viability & Score**: Integration quality, middleware usage, compliance score 0-100.
2. **Data Pipeline Analysis**: Data flow across Design/Build/Operate/Protect pillars, protocols used.
3. **Strategic Value Proposition**: Business efficiency and how it replaces legacy products with Octave equivalents.

Be professional, direct, and concise. Use precise engineering terminology.
`;

      const synopsisText = await generateWithFallback(ai, prompt);
      res.json({ synopsis: synopsisText, isFallback: false });
    } catch (error: any) {
      console.warn("Gemini AI Review unavailable, utilizing built-in solution review engine.");
      const localReview = getLocalReview(components, integrations, systemScenario);
      res.json({ synopsis: localReview, isFallback: true });
    }
  });

  function getPreSalesCopilotResponse(message: string, components: any[] = [], integrations: any[] = [], quizResult: any = null): string {
    const msgLower = (message || "").toLowerCase().trim();

    // Zero Hallucination & Competitor Check
    if (
      (msgLower.includes("competitor") && (msgLower.includes("recommend") || msgLower.includes("standalone") || msgLower.includes("better than octave"))) ||
      msgLower.includes("autocad consumer") ||
      msgLower.includes("salesforce standalone") ||
      msgLower.includes("photoshop") ||
      msgLower.includes("unsupported capability")
    ) {
      return "That capability falls outside the current validated Octave ecosystem.";
    }

    // Octave Forte (Design / 3D)
    if (msgLower.includes("forte") || msgLower.includes("smart 3d") || msgLower.includes("3d plant") || msgLower.includes("spatial modeling") || msgLower.includes("clash detection")) {
      return `**Octave Forte is our flagship next-generation 3D spatial plant and marine design solution, directly modernizing and superseding Intergraph Smart 3D and Smart Review.**

| Technical Dimension | Legacy Smart 3D / CAD | Octave Forte Standard | Presales Value Metric |
| :--- | :--- | :--- | :--- |
| **Modeling Architecture** | Heavy workstation-bound database | High-performance multi-user data-centric 3D core | **40% faster** multi-discipline design reviews |
| **Clash Detection** | Batch overnight collision checks | Continuous real-time spatial clash resolution | **Zero field rework** from physical interference |
| **Information Backbone Link** | Manual model export/import | Native direct connector to **Octave InConcert** | Synchronous 3D tag & line consistency |
| **Discipline Integration** | Disconnected piping/structural tools | Unified piping, structural, HVAC, and electrical raceway | Single multi-discipline spatial project canvas |

* **Legacy Modernization**: Seamless migration pathways for existing Smart 3D catalogs, specs, and design archives.
* **Direct Digital Twin Integration**: Pushes verified 3D assets directly into **Octave InConcert** without third-party middleware.`;
    }

    // Octave Facets (Design / 2D)
    if (msgLower.includes("facets") || msgLower.includes("smartplant p&id") || msgLower.includes("p&id") || msgLower.includes("schematic") || msgLower.includes("smartplant instrumentation")) {
      return `**Octave Facets delivers intelligent 2D engineering schematics, P&IDs, electrical wiring, and instrumentation design, replacing legacy SmartPlant P&ID, Instrumentation, and Electrical.**

| Engineering Module | Legacy Equivalent | Octave Facets Capability | Integration Endpoint |
| :--- | :--- | :--- | :--- |
| **Intelligent P&ID** | SmartPlant P&ID | Rule-based process schematic authoring with tag validation | **Octave InConcert** (Direct) |
| **Instrumentation & Control** | SmartPlant Instrumentation (SPI/INtools) | Complete loop diagrams, marshalling racks, and I/O assignments | **Octave InConcert** & **Octave Forte** |
| **Electrical Engineering** | SmartPlant Electrical (SPEL) | Single-line diagrams, load lists, and motor control centers | **Octave InConcert** (Direct) |

* **Zero Data Mismatch**: Real-time cross-checking between 2D process schematics (**Octave Facets**) and 3D spatial models (**Octave Forte**).
* **Automated Deliverables**: Instant batch generation of datasheets, loop sheets, and instrument index schedules.`;
    }

    // Octave InConcert (Build / Information Management Backbone)
    if (msgLower.includes("inconcert") || msgLower.includes("information management") || msgLower.includes("sdx") || msgLower.includes("smartplant foundation") || msgLower.includes("single source of truth") || msgLower.includes("direct connector")) {
      return `**Octave InConcert serves as the central Information Management and Digital Twin backbone, connecting directly with Octave Forte (3D) and Octave Facets (2D) without intermediate middleware.**

| Architecture Layer | Octave Product | Connector Type | Primary Information Function |
| :--- | :--- | :--- | :--- |
| **Central Information Core** | **Octave InConcert** | Core Repository | Single source of truth for engineering tags, documents, and 1D/2D/3D digital twins |
| **3D Spatial Design** | **Octave Forte** | Native Direct Hook | Direct publishing of 3D spatial models, piping spools, and structural geometry |
| **2D Schematic & Instrumentation** | **Octave Facets** | Native Direct Hook | Real-time tag synchronization for P&IDs, single-line diagrams, and loop sheets |
| **Enterprise Integration** | **Octave Databridge Pro** | REST / OData Broker | Cross-pillar orchestration to external ERP (SAP/Oracle) and maintenance tools |

* **Zero Data Duplication**: Direct native connectors write directly into **Octave InConcert's** unified data schema.
* **Tag Governance**: Changes in 2D schematics (**Octave Facets**) instantly reconcile against 3D spatial models (**Octave Forte**).`;
    }

    // Octave Tempo (Operate / Operations Management & Shift Handover)
    if (msgLower.includes("tempo") || msgLower.includes("shift handover") || msgLower.includes("operator log") || msgLower.includes("alarm rationalization") || msgLower.includes("j5") || msgLower.includes("acceleratorkms") || msgLower.includes("plantstate")) {
      return `**Octave Tempo unifies electronic shift handovers, digital operator logbooks, standard operating procedures, and control room alarm rationalization into a single operational interface.**

| Operational Capability | Heritage Solution | Modern Octave Tempo Feature | Regulatory Standard |
| :--- | :--- | :--- | :--- |
| **Shift Handover & Logbooks** | **j5 Operations Management** | Structured digital shift handovers with mandatory sign-offs | OSHA 1910.119 PSM |
| **Standard Operating Procedures** | **AcceleratorKMS** | Digital procedure lifecycle, operator walkthroughs & execution | ISO 9001 / GMP |
| **Alarm Rationalization** | **PAS PlantState Integrity** | Dynamic alarm flood suppression & nuisance alarm elimination | ISA-18.2 / IEC 62682 |
| **Automation Integrity** | **PAS Automation Integrity** | Control system configuration tracking & boundary protection | IEC 61511 / SIS |

* **Alarm Flood Mitigation**: Decreases control room alarm fatigue by up to 75% through systematic EEMUA 191 / ISA-18.2 rationalization.
* **Operational Handover Integrity**: Eliminates verbal or unverified handover gaps during crew rotation.`;
    }

    // Octave Attune (Operate / EAM & APM)
    if (msgLower.includes("attune") || msgLower.includes("asset reliability") || msgLower.includes("hxgn eam") || msgLower.includes("hxgn apm") || msgLower.includes("maintenance") || msgLower.includes("work order")) {
      return `**Octave Attune is recommended because it unifies Enterprise Asset Management (EAM) and Asset Performance Management (APM) with real-time digital twin telemetry from Octave InConcert.**

| Functional Capability | Legacy Approach | Octave Attune Standard | Value Metric |
| :--- | :--- | :--- | :--- |
| **Asset Health Indexing** | Periodic calendar schedules | Dynamic condition-based APM analytics | **30% reduction** in unplanned downtime |
| **Digital Twin Correlation** | Disconnected CMMS work orders | Click-to-highlight 3D asset in **Octave InConcert** | **45% faster** field technician wrench time |
| **Failure Mode Analytics** | Reactive post-incident review | Predictive AI-assisted Weibull curve modeling | Extended mean time between failures (MTBF) |
| **Mobile Field Execution** | Paper checklists & spreadsheets | Offline-capable mobile work order execution | Zero manual data reentry errors |

* **APM + EAM Co-Existence**: Seamless transition from predictive anomaly alerts to automated work orders.
* **Octave InConcert Federation**: Maintenance technicians view real-time operating telemetry superimposed on engineering 3D/2D models.`;
    }

    // Octave Databridge Pro (Integrate / Middleware & ERP)
    if (msgLower.includes("databridge") || msgLower.includes("sap") || msgLower.includes("oracle") || msgLower.includes("erp") || msgLower.includes("middleware") || msgLower.includes("integration bus")) {
      return `**Octave Databridge Pro integrates bidirectionally with SAP PM/MM, Oracle ERP, and plant historians via native OData, REST, and IDoc/RFC connectors without replacing your core transactional system.**

| Enterprise Domain | Legacy / External System | Octave Solution | Integration Protocol | Data Exchanged |
| :--- | :--- | :--- | :--- | :--- |
| **Enterprise Asset Mgmt** | **SAP PM / Oracle EAM** | **Octave Attune** | OData / REST | Maintenance orders, equipment tags, asset hierarchy |
| **Procurement & Materials** | **SAP MM** | **Octave Loop** | RFC / BAPI / JSON | Material masters, BOM line items, requisition status |
| **Central Engineering Core** | **Documentum / OpenText** | **Octave InConcert** | REST / CMIS | Engineering deliverables, CAD models, transmittals |
| **Integration Bus** | **Custom Point-to-Point** | **Octave Databridge Pro** | REST / SOAP / Event Bus | Real-time payload transformation & schema governance |

* **Zero Custom Code**: Direct pre-built adapters eliminate fragile point-to-point scripts.
* **Bi-directional Synchronization**: Engineering revisions in **Octave InConcert** automatically populate maintenance master records in **SAP/Oracle**.`;
    }

    // Octave Aspect (Design / Engineering Analysis Suite)
    if (msgLower.includes("aspect") || msgLower.includes("caesar") || msgLower.includes("pv elite") || msgLower.includes("gt strudl") || msgLower.includes("stress") || msgLower.includes("pipe stress")) {
      return `**Octave Aspect unifies pipe stress analysis, pressure vessel mechanical design, and finite element structural modeling under a single engineering suite.**

| Analysis Module | Heritage Standard | Core Engineering Scope | Compliance Standard |
| :--- | :--- | :--- | :--- |
| **Aspect Pipe Stress** | **CAESAR II** | Thermal flexibility & pipe stress analysis | ASME B31.1, B31.3, B31.4, B31.8 |
| **Aspect Pressure Vessel** | **PV Elite** | Wall thickness, nozzle reinforcement & heat exchangers | ASME Section VIII, EN 13445, PD 5500 |
| **Aspect Structural FEM** | **GT STRUDL** | Structural frame & offshore platform FEA | AISC, Eurocode, API RP 2A |
| **Aspect Nuclear Stress** | **PIPESTRESS** | Nuclear safety-class piping & seismic dynamics | ASME Section III Class 1, 2 & 3 |
| **Aspect Storage Tank** | **TANK** | Welded steel storage tank calculation | API 650, API 653, API 620 |

* **Direct Bi-Directional CAD Hook**: Native stress geometry import/export with **Octave Forte** (3D) without intermediate PCF translation errors.`;
    }

    // Octave Cyber Integrity (Protect / OT/ICS Cybersecurity)
    if (msgLower.includes("cyber") || msgLower.includes("pas cyber") || msgLower.includes("ot security") || msgLower.includes("ics") || msgLower.includes("iec 62443") || msgLower.includes("nerc cip")) {
      return `**Octave Cyber Integrity secures industrial OT/ICS environments through automated asset discovery, configuration baselining, and vulnerability management across heterogeneous control systems.**

| OT Security Dimension | Conventional IT Tool Deficit | Octave Cyber Integrity Standard | Presales Benefit |
| :--- | :--- | :--- | :--- |
| **Multi-Vendor DCS/PLC** | Cannot parse proprietary OT backplanes | Deep native visibility into Emerson, Honeywell, Yokogawa, Siemens, Schneider | 100% automated asset inventory across Level 1 & 2 |
| **Configuration Baseline** | Blind to controller logic changes | Real-time ladder logic, firmware, and setpoint change detection | Instant detection of unauthorized OT tampering |
| **Vulnerability Scoring** | Causes DCS network broadcast storms | Passive and non-disruptive OT vulnerability correlation | Continuous IEC 62443 & NERC CIP compliance |

* **Zero Disruptive Scans**: Built specifically for live industrial processes without risking controller trips.`;
    }

    // Octave OnCall (Protect / Critical Incident Dispatch)
    if (msgLower.includes("oncall") || msgLower.includes("i/cad") || msgLower.includes("dispatch") || msgLower.includes("public safety") || msgLower.includes("emergency")) {
      return `**Octave OnCall delivers mission-critical multi-agency incident management, CAD dispatch, and command center visualization, modernizing legacy I/CAD deployments.**

* **Unified CAD Core**: Cloud-ready emergency call-taking, unit recommendation, and multi-agency response orchestration.
* **Spatial Situational Awareness**: Deep integration with **LUCIAD** and spatial mapping for real-time fleet positioning and live telemetry.
* **Resilient Architecture**: High-availability failover designed for 99.999% uptime in public safety and critical industrial plant security centers.`;
    }

    // Octave Loop (Build / Material Management & Procurement)
    if (msgLower.includes("loop") || msgLower.includes("materials") || msgLower.includes("smartplant materials") || msgLower.includes("procurement") || msgLower.includes("supply chain")) {
      return `**Octave Loop orchestrates end-to-end capital project material management, supplier qualification, and site fabrication tracking, replacing legacy SmartPlant Materials.**

* **BOM Synchronization**: Automatically consumes engineering Bill of Materials directly from **Octave Forte** and **Octave InConcert**.
* **ERP Integration**: Exchanges purchase orders, requisitions, and goods receipts seamlessly with **SAP MM** via **Octave Databridge Pro**.
* **Site Delivery Tracking**: Prevents construction delays with RFID/barcode-enabled site laydown yard tracking.`;
    }

    // Replacement & Modernization Overview
    if (msgLower.includes("replace") || msgLower.includes("legacy") || msgLower.includes("modernize") || msgLower.includes("predecessor")) {
      return `**Octave solutions modernize and directly replace legacy Intergraph and fragmented 3rd-party engineering tools into a unified asset lifecycle ecosystem.**

| Legacy / Predecessor Product | Modern Octave Solution | Portfolio Pillar | Core Architectural Advantage |
| :--- | :--- | :--- | :--- |
| **Smart 3D / SmartPlant 3D / Smart Review** | **Octave Forte** | DESIGN | Cloud-native multi-discipline 3D modeling with real-time clash resolution |
| **SmartPlant Foundation / SDx** | **Octave InConcert** | BUILD / OPERATE | Centralized single-source-of-truth tag registry and digital twin repository |
| **SmartPlant P&ID / SPI / SPEL** | **Octave Facets** | DESIGN | Intelligent 2D schematics, instrumentation loops & electrical single-lines |
| **j5 Operations / AcceleratorKMS / PAS PSI** | **Octave Tempo** | OPERATE | Unified electronic shift handovers, operator rounds & alarm rationalization |
| **HxGN EAM / HxGN APM** | **Octave Attune** | OPERATE | Predictive asset performance, AI-driven failure curves & work management |
| **SmartPlant Materials** | **Octave Loop** | BUILD | End-to-end capital project material management & fabrication logistics |
| **CAESAR II / PV Elite / GT STRUDL** | **Octave Aspect** | DESIGN | Integrated pipe stress, pressure vessel mechanics & structural FEM |
| **PAS Cyber Integrity** | **Octave Cyber Integrity** | PROTECT | Automated ICS/OT asset discovery, vulnerability scoring & backup baselines |
| **HxGN OnCall / I/CAD** | **Octave OnCall** | PROTECT | Mission-critical multi-agency incident dispatch & command visualization |
| **GeoMedia / ImageStation / LUCIAD** | **Octave Spatial Intelligence** | CROSS-PILLAR | High-performance 2D/3D/4D geospatial intelligence & situational awareness |`;
    }

    // General Portfolio Overview
    return `**The Octave unified portfolio spans Design, Build, Operate, and Protect across the complete asset lifecycle.**

| Portfolio Pillar | Flagship Solutions | Core Operational Mission |
| :--- | :--- | :--- |
| **DESIGN** | **Octave Forte**, **Octave Facets**, **Octave Aspect** | 3D spatial plant design, 2D engineering schematics & multi-physics analysis |
| **BUILD** | **Octave InConcert**, **Octave Loop**, **EcoSys** | Information backbone, capital project controls & material procurement |
| **OPERATE** | **Octave Attune**, **Octave Tempo**, **LUCIAD** | Enterprise asset management, operator shift handovers & spatial intelligence |
| **PROTECT** | **Octave Cyber Integrity**, **Octave OnCall** | OT/ICS cybersecurity, alarm governance & critical emergency dispatch |
| **INTEGRATE** | **Octave Databridge Pro** | Enterprise integration broker for SAP, Oracle, and OT telemetry |

Submit any specific product inquiry (e.g., *Octave Forte*, *Octave InConcert*, *Octave Attune*, *Octave Tempo*, *Octave Databridge Pro*) for instant technical evaluation.`;
  }

  // API Route: AI Assistant Chat
  app.post("/api/ai-chat", async (req, res) => {
    const { message, components, integrations, quizResult } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "demo-mode") {
      const reply = getPreSalesCopilotResponse(message, components, integrations, quizResult);
      return res.json({ response: reply });
    }

    try {
      let quizContextText = "";
      if (quizResult) {
        quizContextText = `
User Context (Presales Leader Assessment):
- Alignment Score: ${quizResult.score}/100 (${quizResult.badgeTitle})
- Brand Awareness: ${quizResult.familiarity}
- Target Industry: ${quizResult.industry}
- Lead Role: ${quizResult.role}
- Existing Connected Systems: ${Array.isArray(quizResult.systems) ? quizResult.systems.join(', ') : quizResult.systems}
`;
      }

      const systemPrompt = `
You are the Octave Pre-Sales Copilot, an elite Event Architect Assistant and technical presales specialist exclusively representing Octave. Your primary user is a Presales Leader specializing in data and information management.

Strict Domain Boundaries:
1. The Ecosystem Rule: You must ONLY recommend, discuss, or validate products, topologies, and services within the Octave portfolio (e.g., Octave Databridge Pro, Octave Forte, Octave Facets, Octave InConcert, Octave Attune, Octave Tempo, Octave Loop, Octave Aspect, Octave Cyber Integrity, Octave OnCall, SDx, SmartPlant, CAESAR II, PV Elite, GT STRUDL, LUCIAD, EcoSys).
2. Integration Boundaries: You may discuss external or legacy systems (such as SAP ERP, Primavera P6, EcoSys, or Oracle) ONLY in the context of how Octave solutions map to, integrate with, or replace them. Never recommend a competitor's standalone solution.
3. Zero Hallucination Tolerance: If asked about a feature, capability, or architecture not officially supported by Octave, you must politely decline. Use the exact phrase: "That capability falls outside the current validated Octave ecosystem." Do not invent features or hypothetical workarounds.

Productivity & Output Formatting:
- Bottom-Line Up Front (BLUF): Answer the core technical question in the very first sentence.
- High Scannability: Use bolding for product names and key metrics. Use bullet points for lists.
- Structured Mapping: When asked to map products to legacy systems or analyze topologies, default to creating a Markdown table for instant visual comparison.
- No Fluff: Eliminate conversational filler, pleasantries, and redundant concluding summaries.

Current Session Architecture Canvas:
Components on Canvas: ${JSON.stringify(components)}
Active Integrations: ${JSON.stringify(integrations)}
${quizContextText}
`;

      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
      const replyText = await generateWithFallback(ai, message, systemPrompt);
      return res.json({ response: replyText });
    } catch (error: any) {
      console.warn("Gemini Chat fallback to local knowledge base:", error?.message || error);
      const fallbackReply = getPreSalesCopilotResponse(message, components, integrations, quizResult);
      return res.json({ response: fallbackReply });
    }
  });

  // Guard: any /api/* route that wasn't handled above → JSON 404 (prevents Vite SPA fallback from serving HTML for API paths)
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Unknown API endpoint' });
  });

  // Production static file serving or development Vite middleware
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));

  if (process.env.NODE_ENV === "production" || hasDist) {
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  server.on("error", (err: any) => {
    console.error(`Server listen error on 0.0.0.0:${PORT}:`, err);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
