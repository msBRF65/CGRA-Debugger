import path from 'node:path';
import { BrowserWindow, app, ipcMain, session } from 'electron';
import * as fs from 'fs';
import { screen } from 'electron';
import { StoreDataType } from './domain/valueObject';
import ElectronStore from 'electron-store';

type ElectronStoreType = {
    vcdFilePath: string;
    configFilePath: string;
    mappingFilePath: string;
};
const store = new ElectronStore<ElectronStoreType>();

ipcMain.handle('readFile', (event, path: string): string => {
    let text: string = fs.readFileSync(path, 'utf-8');
    return text;
});

ipcMain.handle('getWidth', (event): number => {
    return screen.getPrimaryDisplay().workAreaSize.width;
});
ipcMain.handle('getHeight', (event): number => {
    return screen.getPrimaryDisplay().workAreaSize.height;
});

ipcMain.handle('getData', (event, name: string): StoreDataType => {
    const value = store.get(name, undefined) as string | undefined;
    return {
        name: name,
        value: value,
    };
});

ipcMain.handle('setData', (event, data: StoreDataType): void => {
    store.set(data.name, data.value);
    return;
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
