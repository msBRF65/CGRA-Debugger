import path from 'node:path';
import { BrowserWindow, app, ipcMain } from 'electron';
import * as fs from 'fs';

ipcMain.handle('read', (event, path: string): string => {
    return fs.readFileSync(path, 'utf-8');
});

app.whenReady().then(() => {
    // アプリの起動イベント発火で BrowserWindow インスタンスを作成
    const mainWindow = new BrowserWindow({
        webPreferences: {
            // webpack が出力したプリロードスクリプトを読み込み
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // レンダラープロセスをロード
    mainWindow.loadFile('dist/index.html');
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());
