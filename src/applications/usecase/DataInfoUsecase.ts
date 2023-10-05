import { VCDLoader } from '@/infrastructure/fileLoader';

type getVcdSignalInfoInputType = {
    path: string;
};

type getVcdSignalInfoOutputType = {
    signalName: string;
}[];

class DataInfoUsecase {
    constructor() {}

    public async getVcdSignalInfo(input: getVcdSignalInfoInputType): Promise<getVcdSignalInfoOutputType> {
        return VCDLoader.getSignalName(input.path);
    }
}

export { DataInfoUsecase, getVcdSignalInfoOutputType };
