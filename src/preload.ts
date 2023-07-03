import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('fs', {
    readFile: (path: string) => ipcRenderer.invoke('readFile', path),
});
contextBridge.exposeInMainWorld('vcdParser', {
    parse: (path: string) => ipcRenderer.invoke('parse', path),
});
