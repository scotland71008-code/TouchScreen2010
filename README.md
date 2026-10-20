# Octave Enterprise Platform

Enterprise interactive solution hub for presales architecture, digital twin modeling, and AI-powered consultation.

## Quick Start

### Prerequisites
- Node.js 18+ and npm installed on your machine

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env` (already done)
   - Add your API keys:
     - `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
     - `GOOGLE_MAPS_PLATFORM_KEY`: Get from [Google Cloud Console](https://console.cloud.google.com)

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Features

- **Interactive Architecture Builder** – Drag-and-drop digital twin canvas
- **AI Copilot** – Gemini-powered conversational architecture consultation
- **Executive KPI Simulator** – ROI and financial modeling
- **Live Quiz & Leaderboard** – Multiplayer Kahoot-style quiz with real-time scoring
- **Global Office Map** – 8 major technological centers
- **Solution Directory** – 40+ enterprise products across 4 pillars
- **Document Export** – Generate DOCX and PDF reports

## Authentication

Default credentials (development):
- Username: `ali`
- Password: `leapksa`

## Project Structure

```
src/
├── components/          # React components (14 sections)
├── data/               # Industry and solution data
├── utils/              # Export and utility functions
├── App.tsx             # Main app component
├── types.ts            # TypeScript interfaces
└── index.css           # Global styles

public/                 # Static assets
├── octave-logo.svg
└── octave-logo-mark.svg
```

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS + Motion animations
- **Visualizations:** D3, Recharts
- **AI:** Google Genai (Gemini 2.5 Flash)
- **Backend:** Express.js
- **Export:** html2canvas, jsPDF, docx

## Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Run TypeScript type check

## Live Quiz — Scoring System

The Live Quiz is a multiplayer, host-controlled quiz designed for ADIPEC 2026 exhibition use.

### Structure

| Dimension    | Options                               | Questions |
|--------------|---------------------------------------|-----------|
| Days         | Day 1 · Day 2 · Day 3 · Day 4         | —         |
| Difficulties | Easy · Medium · Hard · Difficult      | 5 each    |
| **Total**    | 4 days × 4 difficulties × 5 questions | **80**    |

### Base Points per Question

| Difficulty | Base Points | Topic Area                          |
|------------|-------------|-------------------------------------|
| Easy       | 100 pts     | Core definitions and acronyms       |
| Medium     | 200 pts     | Applied knowledge and standards     |
| Hard       | 300 pts     | Technical depth and specifics       |
| Difficult  | 400 pts     | Expert-level reasoning and nuance   |

### Speed Bonus

Every correct answer earns a speed multiplier based on how quickly the player answers within the 20-second window:

```
score = base_points × max(0.5,  1 − (timeMs / 20 000))
```

| Answer time | Multiplier | Example (Hard, 300 pts base) |
|-------------|------------|------------------------------|
| 0 s (instant) | 1.00×   | 300 pts                      |
| 5 s           | 0.75×   | 225 pts                      |
| 10 s          | 0.50×   | 150 pts                      |
| 15 s          | 0.50×   | 150 pts ← floor applies      |
| Wrong answer  | —       | 0 pts                        |

The minimum multiplier is **0.50×** — a correct answer always earns at least half the base points regardless of how long it takes.

### Maximum Possible Score (per session)

| Difficulty | 5 questions (max speed) |
|------------|------------------------|
| Easy       | 500 pts                |
| Medium     | 1 000 pts              |
| Hard       | 1 500 pts              |
| Difficult  | 2 000 pts              |

### Leaderboard & Certificates

- Real-time leaderboard is visible on the host (touchscreen) throughout the quiz.
- After the final question the **top 4 players** are awarded a certificate badge on screen.
- Players can collect their printed certificate at the touchscreen kiosk.

### Hosting Online (ngrok)

To allow players to join from the internet (e.g., via their phones at ADIPEC):

```bash
npx ngrok http 3000
```

Copy the generated URL (e.g. `abc123.ngrok-free.app`) into the IP field on the host waiting-room screen — the QR code updates automatically.

> Requires a free ngrok account: `npx ngrok config add-authtoken YOUR_TOKEN`

## License

Confidential – Octave Enterprise Technical Specification
