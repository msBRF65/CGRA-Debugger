import { CGRAConfig } from '@/domain/entity';
import { CGRAConfigId } from '@/domain/valueObject';
import { ConfigurationData } from './configurationData';

class CGRAConfigurationData {
    readonly cgraConfig: CGRAConfig;
    readonly configurationData: ConfigurationData[][][];

    constructor(cgraConfig: CGRAConfig) {
        this.cgraConfig = cgraConfig;
        this.configurationData = new Array<ConfigurationData[][]>(cgraConfig.rowSize);
        for (var i = 0; i < cgraConfig.rowSize; i++) {
            this.configurationData[i] = new Array<ConfigurationData[]>(cgraConfig.columnSize);
            for (var j = 0; j < cgraConfig.columnSize; j++) {
                this.configurationData[i][j] = new Array<ConfigurationData>(cgraConfig.contextSize);
            }
        }
    }

    public SetCGRAConfigurationData(input: {
        configId: CGRAConfigId;
        configurationData: {
            constValue?: number;
            fromConfigIdArray: CGRAConfigId[];
            toConfigIdArray: CGRAConfigId[];
            operationType: string;
            operationName: string;
        };
    }): void {
        this.configurationData[input.configId.cgraPositionId.rowId][input.configId.cgraPositionId.columnId][
            input.configId.contextId
        ] = new ConfigurationData(input.configurationData);
    }

    public GetCGRAConfigurationData(config_id: CGRAConfigId): ConfigurationData {
        return this.configurationData[config_id.cgraPositionId.rowId][config_id.cgraPositionId.columnId][
            config_id.contextId
        ];
    }

    public GetCGRAConfigurationDataInPE(row_id: number, column_id: number): ConfigurationData[] {
        return this.configurationData[row_id][column_id];
    }
}

export { CGRAConfigurationData };
