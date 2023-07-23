import { CGRAConfig, CGRALog, PESignalNameConfig } from '@/domain/entity';
import { SignalData, VCDLoader } from '@/infrastructure/fileLoader';

type createCGRAInputType = {
    vcdPath: string;
    cgraConfig: CGRAConfig;
    peConfigArray: PESignalNameConfig[][];
};
type createCGRAOutputType = CGRALog;

class CGRAUsecase {
    constructor() {}

    public async createCGRA(input: createCGRAInputType): Promise<createCGRAOutputType> {
        let signalData: SignalData[] = await VCDLoader.getSignalData(input.vcdPath);
        let cgraLog = new CGRALog(input.cgraConfig, input.peConfigArray);

        signalData.map((element) => {
            cgraLog.SetValueArray(element.module + '.' + element.signalName, element.waveDataArray);
        });

        return cgraLog;
    }
}

export { CGRAUsecase };
