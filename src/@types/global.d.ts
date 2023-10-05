import { VcdData } from 'rust_vcd_wasm';

export interface IFsAPI {
    readFile: (path: string) => string;
    writeJsonFile: (path: string, contents: JSON) => void;
    existFile: (path: string) => boolean;
}

export interface IElectronAPI {
    getWidth: () => number;
    getHeight: () => number;
}

declare global {
    interface Window {
        fs: IFsAPI;
        electron: IElectronAPI;
    }
}
