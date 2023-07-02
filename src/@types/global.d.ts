export interface IMyAPI {
    read: (path: string) => string;
}

declare global {
    interface Window {
        myapi: IMyAPI;
    }
}
