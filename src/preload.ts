import { contextBridge, ipcRenderer } from 'electron';
import { StoreDataType } from './domain/valueObject';

contextBridge.exposeInMainWorld('fs', {
    readFile: (path: string) => ipcRenderer.invoke('readFile', path),
});

contextBridge.exposeInMainWorld('electron', {
    getWidth: () => ipcRenderer.invoke('getWidth'),
    getHeight: () => ipcRenderer.invoke('getHeight'),
});

contextBridge.exposeInMainWorld('store', {
    getData: (name: string) => ipcRenderer.invoke('getData', name),
    setData: (data: StoreDataType) => ipcRenderer.invoke('setData', data),
});
