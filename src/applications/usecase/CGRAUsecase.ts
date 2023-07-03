import { CGRAConfig, CGRALog, PESignalNameConfig, PEValue } from '@/domain/entity';
import { SignalData, VCDLoader } from '@/infrastructure/fileLoader';

type updateCGRAInputType = {
    path: string;
    cgraConfig: CGRAConfig;
    peConfigArray: PESignalNameConfig[][];
};
type updateCGRAOutputType = void;
type getCGRADataInputType = {
    cycle: number;
};
type getCGRADataOutputType = PEValue[][];

class CGRAUsecase {
    private cgraLog: CGRALog;

    constructor() {
        let defaultCGRAConfig: CGRAConfig = {
            rowSize: 0,
            columnSize: 0,
            neighborPESize: 0,
        };
        let defaultPESignalNameConfigArray: PESignalNameConfig[][] = [];
        this.cgraLog = new CGRALog(defaultCGRAConfig, defaultPESignalNameConfigArray);
    }

    public async updateCGRA(input: updateCGRAInputType): Promise<updateCGRAOutputType> {
        let signalData: SignalData[] = await VCDLoader.getSignalData(input.path);
        this.cgraLog = new CGRALog(input.cgraConfig, input.peConfigArray);

        signalData.map((element) => {
            console.log(element);
            this.cgraLog.SetValueArray(element.module + '.' + element.signalName, element.waveDataArray);
        });
    }

    public getCGRAData(input: getCGRADataInputType): getCGRADataOutputType {
        return this.cgraLog.getValueByCycle(input.cycle);
    }
}

export { CGRAUsecase };
