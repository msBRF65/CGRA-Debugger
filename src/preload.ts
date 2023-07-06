import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('fs', {
    readFile: (path: string) => ipcRenderer.invoke('readFile', path),
});
contextBridge.exposeInMainWorld('vcdParser', {
    parse: (path: string) => ipcRenderer.invoke('parse', path),
});

contextBridge.exposeInMainWorld('electron', {
    getWidth: () => ipcRenderer.invoke('getWidth'),
    getHeight: () => ipcRenderer.invoke('getHeight'),
});
