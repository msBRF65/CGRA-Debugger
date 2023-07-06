export interface IFsAPI {
    readFile: (path: string) => string;
}

export interface IVcdParserAPI {
    parse: (text: string) => Promise<any>;
}

export interface IElectronAPI {
    getWidth: () => number;
    getHeight: () => number;
}

declare global {
    interface Window {
        fs: IFsAPI;
        vcdParser: IVcdParserAPI;
        electron: IElectronAPI;
    }
}
