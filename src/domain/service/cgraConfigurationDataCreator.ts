import { CGRAConfig, CGRAConfigurationData } from '@/domain/entity';
import { CGRAConfigId } from '../valueObject';

type PEConfigType = {
    row_id: string;
    column_id: string;
    config: ConfigType[];
};
type ConfigType = {
    context_id: string;
    operation_type: string;
    operation_name: string;
    const_value: string;
    to_config_id: ConfigIdType[] | string;
    from_config_id: ConfigIdType[] | string;
};
type ConfigIdType = { row_id: string; column_id: string; context_id: string };

class CGRAConfigurationDataCreator {
    public static createCGRAConfigurationData(
        cgraConfig: CGRAConfig,
        PEConfigArray: PEConfigType[],
    ): CGRAConfigurationData {
        let cgraConfiguraionData = new CGRAConfigurationData(cgraConfig);
        PEConfigArray.map((PEConfig: PEConfigType) => {
            PEConfig.config.map((config: ConfigType) => {
                let configId = new CGRAConfigId(
                    Number(PEConfig.row_id),
                    Number(PEConfig.column_id),
                    Number(config.context_id),
                );
                let fromConfigIdArray: CGRAConfigId[] = [];
                if (typeof config.from_config_id !== 'string') {
                    config.from_config_id.map((fromConfigId: ConfigIdType) => {
                        fromConfigIdArray.push(
                            new CGRAConfigId(
                                Number(fromConfigId.row_id),
                                Number(fromConfigId.column_id),
                                Number(fromConfigId.context_id),
                            ),
                        );
                    });
                }
                let toConfigIdArray: CGRAConfigId[] = [];
                if (typeof config.to_config_id !== 'string') {
                    config.to_config_id.map((toConfigId: ConfigIdType) => {
                        toConfigIdArray.push(
                            new CGRAConfigId(
                                Number(toConfigId.row_id),
                                Number(toConfigId.column_id),
                                Number(toConfigId.context_id),
                            ),
                        );
                    });
                }
                cgraConfiguraionData.SetCGRAConfigurationData({
                    configId: configId,
                    configurationData: {
                        constValue: Number(config.const_value),
                        fromConfigIdArray: fromConfigIdArray,
                        toConfigIdArray: toConfigIdArray,
                        operation: config.operation_type,
                    },
                });
            });
        });

        return cgraConfiguraionData;
    }
}

export { CGRAConfigurationDataCreator, PEConfigType };
