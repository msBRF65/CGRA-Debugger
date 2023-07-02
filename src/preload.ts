import { contextBridge, ipcRenderer } from 'electron';

console.log('preloaded!');

contextBridge.exposeInMainWorld('myapi', {
    read: (path: string) => ipcRenderer.invoke('read', path),
});
