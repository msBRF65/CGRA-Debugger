import { CGRAConfig, CGRAConfigurationData, CGRALog, PESignalNameConfig } from '@/domain/entity';
import { CGRAConfigurationDataCreator, PEConfigType } from '@/domain/service/cgraConfigurationDataCreator';
import { CGRAPositionId } from '@/domain/valueObject';
import { SignalData, VCDLoader } from '@/infrastructure/fileLoader';

type createCGRAInputType = {
    vcdPath: string;
    cgraConfig: CGRAConfig;
    inputRelativePEPositionIdArray: CGRAPositionId[];
    peConfigArray: PESignalNameConfig[][];
};
type createCGRAOutputType = CGRALog;

type getCGRAConfigurationDataInputType = {
    mappingJsonPath: string;
};

type getCGRAConfigurationDataOutputType = CGRAConfigurationData;

class CGRAUsecase {
    constructor() {}

    public async createCGRA(input: createCGRAInputType): Promise<createCGRAOutputType> {
        let signalData: SignalData[] = await VCDLoader.getSignalData(input.vcdPath);
        let cgraLog = new CGRALog(input.cgraConfig, input.inputRelativePEPositionIdArray, input.peConfigArray);

        signalData.map((element) => {
            cgraLog.SetValueArray(element.signalName, element.waveDataArray);
        });

        return cgraLog;
    }

    public async getCGRAConfigurationData(
        input: getCGRAConfigurationDataInputType,
    ): Promise<getCGRAConfigurationDataOutputType> {
        let jsonText: string = await window.fs.readFile(input.mappingJsonPath);
        let jsonObject = JSON.parse(jsonText);

        let neighborPESize = -1;
        if (jsonObject.network_type == 'orthogonal') {
            neighborPESize = 4;
        }

        let cgraConfig: CGRAConfig = {
            rowSize: jsonObject.row,
            columnSize: jsonObject.column,
            contextSize: jsonObject.context_size,
            neighborPESize: neighborPESize,
        };
        let PEConfigArray: PEConfigType[] = jsonObject.PE_config;

        return CGRAConfigurationDataCreator.createCGRAConfigurationData(cgraConfig, PEConfigArray);
    }
}

export { CGRAUsecase };
