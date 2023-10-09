import { StoreDataType } from '@/domain/valueObject';

export interface IFsAPI {
    readFile: (path: string) => string;
}

export interface IElectronAPI {
    getWidth: () => number;
    getHeight: () => number;
}

export interface IStoreAPI {
    getData: (name: string) => StoreDataType;
    setData: (data: StoreDataType) => void;
}

declare global {
    interface Window {
        fs: IFsAPI;
        electron: IElectronAPI;
        store: IStoreAPI;
    }
}
