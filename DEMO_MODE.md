# Octave Platform - Demo Mode Guide

**Status: ✅ Demo Mode Ready** — Full-featured app runs without API keys!

## What Works in Demo Mode

### ✅ Fully Functional
- **Architecture Builder** – Drag-and-drop canvas, add/connect 40+ solutions
- **Executive KPI Simulator** – ROI and financial modeling
- **Live Quiz & Leaderboard** – Multiplayer real-time quiz with speed-bonus scoring
- **Office Map** – 8 global office locations (static)
- **Solution Finder** – Browse and search all products
- **Portfolio Matrix** – View products by pillar
- **Lead Capture Modal** – Collect prospect information
- **Document Export** – Generate DOCX/PDF reports

### 🤖 AI Features (Demo Mode - Local Responses)
- **Architecture Review** – Intelligent analysis of your topology
  - Validates cross-pillar connections
  - Recommends middleware placement (e.g., Databridge Pro)
  - Compliance scoring and suggestions
  - Uses pre-built rules, not live AI

- **Presales Copilot Chat** – Interactive assistant
  - Answers Octave product questions
  - Analyzes your current architecture
  - Provides pre-sales guidance
  - Uses intelligent fallback responses

> **Demo AI Note:** Responses are generated from a built-in rule engine (not Gemini API). They're fully functional for demos and testing, but will be replaced with real Gemini responses once you add your API key.

## Login Credentials

- **Username:** `ali`
- **Password:** `leapksa`

## Running the App

### Option 1: Using `/run` Skill (Recommended)
1. Type `/run` in Claude Code
2. Select "Octave Dev Server"
3. Wait for build completion
4. Preview opens at `http://localhost:5173`

### Option 2: Manual
```bash
npm install
npm run dev
```

## Enabling Real AI Features

When ready to connect real Gemini AI:

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update `.env`:
   ```env
   GEMINI_API_KEY="your-actual-key-here"
   ```
3. Restart the dev server
4. AI Copilot and Architecture Review now use live Gemini responses

## Navigation Overview

| Section | Purpose |
|---------|---------|
| **WHO_IS_OCTAVE** | Platform overview & marketing |
| **SOLUTION_FINDER** | Search and explore products |
| **PORTFOLIO_MATRIX** | View by pillar (DESIGN/BUILD/OPERATE/PROTECT) |
| **INDUSTRIES** | Industry-specific templates |
| **BUILDER** | Drag-drop architecture canvas ⭐ |
| **COPILOT** | AI assistant chat 🤖 |
| **OFFICES** | Global presence map |
| **LIVE_QUIZ** | Multiplayer real-time quiz & leaderboard |
| **DOCUMENTATION** | System docs and reference |

## Demo Workflows

### 1. Build an Architecture (2 min)
1. Go to BUILDER
2. Click "Add Solution" → pick products from DESIGN/BUILD/OPERATE
3. Drag them around the canvas
4. Connect with protocols (REST, OData, OPC UA)
5. Click "Request Follow-Up" to test lead capture

### 2. Get Architecture Review (1 min)
1. Build an architecture (above)
2. Scroll down → "Get AI Review"
3. See intelligent analysis (demo mode responses)
4. Read suggestions for middleware and compliance

### 3. Chat with Copilot (2 min)
1. Go to COPILOT section
2. Ask about products, architectures, or industry use cases
3. Get intelligent, Octave-specific responses
4. Chat references your current canvas

### 4. Run the Live Quiz (5–10 min)
1. Go to **Live Quiz & Leaderboard**
2. Select a day tile (Day 1–4) and then a difficulty level
3. Players join by scanning the QR code on their phones → `/quiz`
4. Host controls pace: **Start → Reveal → Leaderboard → Next Question**
5. Top 4 players at the end are awarded a certificate badge

**Scoring:**
- Correct answer earns base points (Easy 100 / Medium 200 / Hard 300 / Difficult 400)
- Speed bonus: answering faster earns up to 100% of base; the floor is 50% (so a slow correct answer still scores half)
- Formula: `score = base × max(0.5, 1 − answerTimeSeconds / 20)`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5173 already in use | Kill the process: `lsof -ti:5173 \| xargs kill -9` |
| "Missing dependencies" | Run `npm install` |
| API endpoints 404 | Make sure backend server is running (port 3000) |
| Slow performance | Check browser console for errors; clear cache |
| Maps not loading | Expected in demo mode (static data used) |

## Next Steps

1. **Test the demo** – Run through all sections
2. **Gather feedback** – Share with your team
3. **Customize content** (optional) – Edit solution data in `src/data/industryData.ts`
4. **Deploy** – Push to production when ready (see README.md)
5. **Add API key** – Enable real AI when you get Gemini key

---

**Questions?** Check README.md or contact your team.
