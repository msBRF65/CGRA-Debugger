import path from 'node:path';
import { BrowserWindow, app, ipcMain } from 'electron';
import * as fs from 'fs';
import { screen } from 'electron';
const VCDParser = require('vcd-parser');

ipcMain.handle('readFile', (event, path: string): string => {
    let text: string = fs.readFileSync(path, 'utf-8');
    return text;
});

ipcMain.handle('writeJsonFile', (event, path: string, contents: JSON): void => {
    return fs.writeFileSync(path, JSON.stringify(contents));
});

ipcMain.handle('existFile', (event, path: string): boolean => {
    return fs.existsSync(path);
});

ipcMain.handle('parse', (event, text: string): Promise<any> => {
    return VCDParser.parse(text);
});

ipcMain.handle('getWidth', (event): number => {
    return screen.getPrimaryDisplay().workAreaSize.width;
});
ipcMain.handle('getHeight', (event): number => {
    return screen.getPrimaryDisplay().workAreaSize.height;
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
