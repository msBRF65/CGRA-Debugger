import { CGRAConfig, CGRAWarningConfig, PESignalNameConfig } from '@/domain/entity';
import { CGRAPositionId } from '@/domain/valueObject';

type CGRAConfigData = {
    config: CGRAConfig;
    peConfigArray: PESignalNameConfig[][];
    inputRelativePEPositionIdArray: CGRAPositionId[];
    cgraWarningConfig: CGRAWarningConfig;
};

class CGRAConfigLoader {
    public static async getCGRAConfig(filePath: string): Promise<CGRAConfigData> {
        let jsonText: string = await window.fs.readFile(filePath);
        let jsonObject = JSON.parse(jsonText);
        let cgraConfig: CGRAConfig = {
            rowSize: jsonObject.CGRA.row_size,
            columnSize: jsonObject.CGRA.column_size,
            contextSize: jsonObject.CGRA.context_size,
            neighborPESize: jsonObject.CGRA.neighbor_PE_size,
        };
        let peConfigArray: PESignalNameConfig[][] = [];

        // initialize peConfigArray
        for (let i = 0; i < cgraConfig.rowSize; i++) {
            let peConfigRowArray: PESignalNameConfig[] = [];
            for (let j = 0; j < cgraConfig.columnSize; j++) {
                peConfigRowArray.push({
                    inputSignalNameArray: jsonObject.PE.input_signal.map((ele: string) => {
                        return this.getSignalNameFromJson(ele, i, j);
                    }),
                    outputSignalName: this.getSignalNameFromJson(jsonObject.PE.output_signal, i, j),
                    aluConfigSignalName: this.getSignalNameFromJson(jsonObject.PE.alu_context_id, i, j),
                    statusSignalNameArray: jsonObject.PE.status_signal.map((ele: string) => {
                        return this.getSignalNameFromJson(ele, i, j);
                    }),
                });
            }
            peConfigArray.push(peConfigRowArray);
        }

        let inputRelativePEPositionIdArray: CGRAPositionId[] = jsonObject.CGRA.input_relative_PE_position_id_array.map(
            (ele: { row_id: number; column_id: number }) => {
                return new CGRAPositionId(ele.row_id, ele.column_id);
            },
        );

        if (inputRelativePEPositionIdArray.length !== cgraConfig.neighborPESize) {
            throw new Error('invalid input relative PE position id array or neighbor PE size');
        }

        let cgraWarningConfig: CGRAWarningConfig = {
            input_to_exec_delay: jsonObject.op_result_warning.input_to_exec_delay,
            input_to_output_delay: jsonObject.op_result_warning.input_to_output_delay,
        };

        return {
            config: cgraConfig,
            peConfigArray: peConfigArray,
            inputRelativePEPositionIdArray: inputRelativePEPositionIdArray,
            cgraWarningConfig: cgraWarningConfig,
        };
    }

    private static getSignalNameFromJson(jsonString: string, row_id: number, column_id: number): string {
        let signalName: string = '';
        let splitedSignalName = jsonString.split(/[${}]/);

        splitedSignalName.forEach((ele) => {
            let haveRowId: boolean = ele.match(/rowId/gi) !== null;
            let haveColumnId: boolean = ele.match(/columnId/gi) !== null;

            if (!haveRowId && !haveColumnId) {
                signalName += ele;
                return;
            }

            let splitedElement = ele.split(/[+-/*]/);
            splitedElement.map((ele, i) => {
                if (ele == 'rowId') splitedElement[i] = row_id.toString();
                if (ele == 'columnId') splitedElement[i] = column_id.toString();
            });
            let operatorElement = ele.match(/[+-/*]/gi);

            let num = Number(splitedElement[0]);

            if (operatorElement !== null) {
                for (let i = 0; i < operatorElement.length; i++) {
                    switch (operatorElement[i]) {
                        case '+':
                            num = num + Number(splitedElement[i + 1]);
                            break;
                        case '-':
                            num = num - Number(splitedElement[i + 1]);
                            break;
                        case '*':
                            num = num * Number(splitedElement[i + 1]);
                            break;
                    }
                }
            }
            signalName += num.toString();
        });

        return signalName;
    }
}

export { CGRAConfigLoader };
