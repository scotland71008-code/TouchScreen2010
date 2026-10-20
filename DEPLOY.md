# Deployment Guide — Octave TouchScreen

## Why not Netlify / Vercel?

The Live Quiz keeps its game state (`players`, `scores`, `current question`) in the Express server's memory.
Serverless platforms spin up a fresh process for every request, so game state vanishes between calls.
You need a **persistent Node.js server** — the platforms below all provide one.

---

## Recommended: Railway (easiest)

Railway auto-detects Node.js, runs `npm run build` then `npm start`, and gives you a public HTTPS URL.
Free tier includes $5 of credits/month — enough for exhibition use.

### Step 1 — Push code to GitHub

```bash
cd "C:\Users\aibrahim\Documents\TouchScreen"
git init
git add .
git commit -m "Initial commit"
```

Then create a new repository on [github.com](https://github.com/new) (private is fine) and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/touchscreen.git
git push -u origin main
```

### Step 2 — Create a Railway project

1. Go to [railway.app](https://railway.app) and sign up (free).
2. Click **New Project → Deploy from GitHub repo**.
3. Select your `touchscreen` repository.
4. Railway detects Node.js automatically and queues a build.

### Step 3 — Set environment variables

In the Railway dashboard → your service → **Variables**, add:

| Variable                  | Value                          |
|---------------------------|--------------------------------|
| `GEMINI_API_KEY`           | your Gemini API key            |
| `GOOGLE_MAPS_PLATFORM_KEY` | your Maps API key              |
| `NODE_ENV`                 | `production`                   |

`PORT` is injected automatically by Railway — the server already reads it via `process.env.PORT`.

### Step 4 — Get your public URL

Railway assigns a URL like `https://touchscreen-production.up.railway.app`.
Find it under **Settings → Domains** or click **Generate Domain**.

---

## Using the public URL with the Live Quiz

Once deployed, the quiz host screen needs to know the public URL so the QR code is correct:

1. Open the app at your Railway URL.
2. Go to **Live Quiz & Leaderboard**.
3. Select a day and difficulty — you land on the Waiting Room.
4. In the **IP / URL field**, enter your Railway domain:
   ```
   touchscreen-production.up.railway.app
   ```
   (without `https://` — the app adds the protocol automatically when it detects a domain name)
5. The QR code updates to `https://touchscreen-production.up.railway.app/quiz`.
6. Players anywhere in the world scan the QR code and join on their phones.

---

## Alternative platforms

| Platform             | Free tier            | Notes                                              |
|----------------------|----------------------|----------------------------------------------------|
| **Fly.io**           | 3 small VMs free     | Excellent performance; requires CLI setup (`flyctl`) |
| **Render.com**       | Free (sleeps idle)   | Paid tier ($7/mo) stays awake — better for events  |
| **DigitalOcean App** | From $5/mo           | Very reliable; easy GitHub integration              |
| **Heroku**           | From $5/mo (Eco dyno)| Classic option; similar setup to Railway           |

For Render, Fly, or Heroku the build and start commands are identical:
- **Build:** `npm run build`
- **Start:** `npm start`

---

## Build process (reference)

```
npm run build
  └─ vite build          → dist/assets/ + dist/index.html  (React frontend)
  └─ esbuild server.ts   → dist/server.cjs                 (Express backend)

npm start
  └─ node dist/server.cjs
       ├─ Serves static files from dist/ (React SPA)
       ├─ API routes:  /api/quiz/*, /api/chat, /api/ai-review, …
       └─ Player page: /quiz  (vanilla HTML, mobile-optimised)
```

In production mode (`NODE_ENV=production`) the server skips Vite middleware and serves
the pre-built `dist/index.html` for all non-API routes.

---

## Keeping secrets safe

- `.env` is listed in `.gitignore` — it is **never committed**.
- `.env.example` documents required variables without real values.
- Set all secrets as environment variables in your chosen platform's dashboard.

---

## Local development (unchanged)

```bash
npm run dev       # Express + Vite on http://localhost:3000
```

For local multiplayer testing, run ngrok in a second terminal:

```bash
npx ngrok http 3000
```

Copy the ngrok URL into the IP field on the host waiting-room screen.
