export interface IFsAPI {
    readFile: (path: string) => string;
}

export interface IVcdParserAPI {
    parse: (text: string) => Promise<any>;
}

declare global {
    interface Window {
        fs: IFsAPI;
        vcdParser: IVcdParserAPI;
    }
}
