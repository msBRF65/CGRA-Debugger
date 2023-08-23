import { ConfigurationData, PELog } from '@/domain/entity';
import { OperationExecutor } from './operationExecutor';
import { CGRAPositionId } from '../valueObject';
import { exec } from 'child_process';

class LogChecker {
    static VerifyOperationResult(
        peLog: PELog,
        peConfigurationData: ConfigurationData[],
        inputRelativePEPositionIdArray: CGRAPositionId[],
        output_time: number,
        input_time: number,
        exec_time: number,
    ): boolean {
        const input_pe_value = peLog.getValueByCycle(input_time);
        const output_pe_value = peLog.getValueByCycle(output_time);
        const exec_pe_value = peLog.getValueByCycle(exec_time);

        const exec_config = peConfigurationData[exec_pe_value.aluConfigId];

        let input_data_1: number = 0;
        let input_data_2: number = 0;
        inputRelativePEPositionIdArray.forEach((relativePEPositionId, index: number) => {
            let tmpPositionId = peLog.positionId.add(relativePEPositionId);
            if (exec_config.fromConfigIdArray.length >= 1) {
                exec_config.fromConfigIdArray[0].cgraPositionId.equal(tmpPositionId);
                input_data_1 = input_pe_value.inputValueArray[index];
            } else if (exec_config.fromConfigIdArray.length == 2) {
                exec_config.fromConfigIdArray[1].cgraPositionId.equal(tmpPositionId);
                input_data_2 = input_pe_value.inputValueArray[index];
            }
        });

        let output_data = output_pe_value.outputValue;
        let result = OperationExecutor.ExecuteOperation(exec_config.operation, input_data_1, input_data_2);
        if (result === output_data) {
            return true;
        }
        return false;
    }
}

export { LogChecker };
