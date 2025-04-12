const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Crea una ventana de Electron
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Carga tu frontend que ya está corriendo en localhost:80
  mainWindow.loadURL('http://localhost:80');

  // Abre las DevTools (opcional, útil para desarrollo)
  mainWindow.webContents.openDevTools();

  // Evento cuando la ventana se cierra
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Cuando Electron esté listo, crea la ventana
app.whenReady().then(createWindow);

// Cierra la app cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Si la app se reactiva en macOS (cuando se hace clic en el dock)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});