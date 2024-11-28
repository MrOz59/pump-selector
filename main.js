const { app, BrowserWindow, session } = require('electron');
const path = require('path');


let mainWindow;
const appName = "Pump Selector";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: appName,
    icon: path.resolve(__dirname, 'assets', 'icon.ico'), // Mantém o ícone do app
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setIcon(path.resolve(__dirname, 'assets', 'icon.ico')); // Define o ícone
  mainWindow.loadURL('https://mroz59.github.io/pump-selector/'); // Carrega a URL diretamente

  // Remove o menu da aplicação
  mainWindow.setMenu(null);

  mainWindow.maximize();
}

app.on('ready', () => {
  const defaultSession = session.defaultSession;
  defaultSession.clearCache()
  .then(() => {
      console.log('Cache limpo com sucesso!');
  })
  .catch((error) => {
      console.error('Erro ao limpar o cache:', error);
  });
  defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Adiciona cabeçalho para evitar o cache
    details.responseHeaders['Cache-Control'] = ['no-store', 'no-cache', 'must-revalidate', 'proxy-revalidate'];
    callback({ cancel: false, responseHeaders: details.responseHeaders });
});

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
