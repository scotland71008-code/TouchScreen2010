# Octave Platform - Quick Start Guide

## 🚀 Fastest Way to Launch

### Option 1: Double-Click the Launcher (Recommended)
```
📁 TouchScreen/
  └─ START_OCTAVE.bat  ← Double-click this!
```

**That's it!** The script will:
1. ✅ Check for Node.js
2. ✅ Install dependencies (first time only)
3. ✅ Start the dev server
4. ✅ Open your browser automatically

---

## 🖥️ Create a Desktop Shortcut

**Option A: Automatic**
1. Double-click `create_desktop_shortcut.vbs`
2. A shortcut appears on your desktop
3. Click it anytime to launch

**Option B: Manual**
1. Right-click on `START_OCTAVE.bat`
2. Select "Send to" → "Desktop (create shortcut)"
3. Rename to "Octave Platform" (optional)

---

## 📋 Prerequisites

Make sure you have **Node.js** installed:

### Check Installation
Open Command Prompt and type:
```bash
node --version
npm --version
```

### If Not Installed
Download from: https://nodejs.org (LTS recommended)

---

## 🎮 After Launch

1. **Wait for the browser to open** (should show login screen)
2. **Login with:**
   - Username: `ali`
   - Password: `leapksa`
3. **Explore the app!**

### If Browser Doesn't Open
Manually go to: `http://localhost:3000`

---

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal that opened

---

## ⚙️ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Node.js not found" | Install from https://nodejs.org |
| "Port 3000 already in use" | Close other instances or use different port |
| "npm ERR!" | Delete `node_modules` folder and try again |
| Browser doesn't open | Manually go to `http://localhost:3000` |

---

## 📦 Advanced: Create Standalone .EXE

To create a single executable file (no terminal, no npm needed):

```bash
# Install pkg globally
npm install -g pkg

# Build executable
cd C:\Users\aibrahim\Documents\TouchScreen
pkg . -t win --output octave-app.exe

# Find: octave-app.exe in the project folder
```

Then you can distribute `octave-app.exe` to anyone!

---

## 📚 Full Documentation

See `DEMO_MODE.md` and `README.md` for complete guides.

---

**Questions?** Check the documentation or run the batch file again.
