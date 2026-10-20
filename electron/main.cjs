const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;

// Poll until the Express server is accepting connections
function waitForServer(retries = 30) {
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get('http://localhost:3000', () => resolve())
        .on('error', () => {
          if (retries-- > 0) setTimeout(check, 400);
          else reject(new Error('Express server did not start in time'));
        });
    };
    setTimeout(check, 600);
  });
}

async function startExpressServer() {
  const isPacked = app.isPackaged;

  // In packaged app:  resources/ contains dist/ and .env
  // In dev:           project root contains dist/ and .env
  const basePath = isPacked
    ? process.resourcesPath
    : path.join(__dirname, '..');

  // Must be set before requiring server so production static-file branch runs
  process.env.NODE_ENV = 'production';

  // server.ts uses process.cwd() to locate dist/ — point it at basePath
  process.chdir(basePath);

  const serverFile = path.join(basePath, 'dist', 'server.cjs');
  require(serverFile);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    backgroundColor: '#0a0a0a',
    frame: false,          // no title bar — full kiosk look
    fullscreen: false,     // maximised but not locked; set true for strict kiosk
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Disable right-click dev-tools in production
      devTools: !app.isPackaged,
    },
  });

  mainWindow.maximize();
  mainWindow.loadURL('http://localhost:3000');

  // Open external links in the default browser, not inside the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(async () => {
  try {
    await startExpressServer();
    await waitForServer();
  } catch (err) {
    console.error('[Electron] Server startup error:', err.message);
    // Load anyway — Express may still be starting
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
