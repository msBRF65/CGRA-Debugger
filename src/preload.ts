import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('fs', {
    readFile: (path: string) => ipcRenderer.invoke('readFile', path),
    existFile: (path: string) => ipcRenderer.invoke('existFile', path),
    writeJsonFile: (path: string, contents: JSON) => ipcRenderer.invoke('writeJsonFile', path, contents),
});
contextBridge.exposeInMainWorld('vcdParser', {
    parse: (path: string) => ipcRenderer.invoke('parse', path),
});

contextBridge.exposeInMainWorld('electron', {
    getWidth: () => ipcRenderer.invoke('getWidth'),
    getHeight: () => ipcRenderer.invoke('getHeight'),
});
