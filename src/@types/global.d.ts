export interface IFsAPI {
    readFile: (path: string) => string;
    writeJsonFile: (path: string, contents: JSON) => void;
    existFile: (path: string) => boolean;
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
