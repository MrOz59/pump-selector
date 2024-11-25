const { app, BrowserWindow, dialog, Menu } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
const appVersion = app.getVersion();
const appName = "Pump Selector " + appVersion; 

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: `${appName}`,
    icon: path.resolve(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },

  });
  mainWindow.setIcon(path.resolve(__dirname, 'assets', 'icon.ico'));
  mainWindow.loadFile('./src/index.html');
  Menu.setApplicationMenu(null);
  mainWindow.maximize();
  //mainWindow.webContents.openDevTools();

  // Garante que o título da janela permaneça fixo, mesmo após carregar uma nova página
  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault(); // Impede a alteração do título
    mainWindow.setTitle(appName); // Define novamente o título fixo
  });
}

app.on('ready', () => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    const response = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      buttons: ['Sim', 'Depois'],
      defaultId: 0,
      title: 'Atualização Disponível',
      message: 'Há uma nova atualização disponível. Deseja baixar agora?',
    });

    if (response === 0) { // 'Sim' selecionado
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-downloaded', () => {
    const response = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      buttons: ['Reiniciar Agora', 'Depois'],
      defaultId: 0,
      title: 'Atualização Pronta',
      message: 'A atualização foi baixada. Deseja reiniciar o aplicativo agora?',
    });

    if (response === 0) { // 'Reiniciar Agora' selecionado
      autoUpdater.quitAndInstall();
    }
  });
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
