require('babel-register');

const express = require('express');
const fs      = require('fs');
const getPort = require('get-port');
const path    = require('path');
const url     = require('url');

const codeTransform = require('../../src/code-transform/').default;

const { BrowserWindow, app, ipcMain } = require('electron');

const LIB_URL    = "//cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.7/p5.js";
const SLEEP_TIME = 100;

const log = (args) => console.log(JSON.stringify({
  message: args,
  level:   args.error ? 'error' : 'info',
  colors:  {
    error: args.error ? 'red' : 'green'
  }
}));

let server, mainWindow;

const displayFile = (port, path, callback) => {
  const formated = url.format({
    host:     `127.0.0.1:${port}`,
    path:     '/',
    protocol: 'http',
    query:    {
      file: path,
      t:    (new Date()).getTime()
    }
  });

  mainWindow.webContents.loadURL(formated);
};

const createServer = (port) => {
  server = express();

  server.get('/', (req, res) => {
    const { file } = req.query;

    const { code, error } = codeTransform(fs.readFileSync(file));

    log(error ? { file, error: `${error}` } : { file });

    res.send(`
      <style>
      * { margin: 0; padding: 0; }
      </style>

      <script type="text/javascript" src="${LIB_URL}"></script>

      <script type="text/javascript">
        const { ipcRenderer } = require('electron');

        window.send = ipcRenderer.send;

        window.sendError = (e) => {
          window.send('failure', {
            error: e,
            file:  \`${file}\`,
            code:  \`${code}\`
          });
        };

        window.onerror = (e) => {
          window.sendError(e);
          return true;
        };
      </script>

      <script type="text/javascript">
        try {
          eval(\`
            ${code}
          \`);
        }
        catch (e) {
          window.sendError(e);
        }

        window.send('done');
      </script>
    `);
  });

  server.listen(port);
};

const createWindow = (port) => {
  createServer(port);

  mainWindow = new BrowserWindow({
    width:     600,
    height:    600,
    resizable: false
  });

  const mainDir = process.argv[2]
  const files   = fs.readdirSync(mainDir);
  let idx       = 0;

  const displayNext = () => {
    displayFile(port, path.join(mainDir, files[idx]));
    idx++;
  };

  displayNext();

  ipcMain.on('done', () => {
    setTimeout(displayNext, SLEEP_TIME);
  });

  ipcMain.on('failure', (_, { error, file }) => {
    log({ error: `${error}`, file });
    setTimeout(displayNext, SLEEP_TIME);
  });

  mainWindow.on('closed', () => {
    mainWindow = null
  });
};

const start = (port) => {
  app.on('ready', () => createWindow(port));

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
};

getPort().then(port => start(port));
