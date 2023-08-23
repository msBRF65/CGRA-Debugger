import { PELog, PESignalNameConfig, PEValue } from '@/domain/entity';
import { CGRAPositionId } from '../valueObject';

type CGRAConfig = {
    rowSize: number;
    columnSize: number;
    contextSize: number;
    neighborPESize: number;
};

class CGRALog {
    readonly cgraConfig: CGRAConfig;
    readonly inputRelativePEPositionIdArray: CGRAPositionId[];
    readonly peLogArray: PELog[][];

    constructor(
        cgraConfig: CGRAConfig,
        inputRelativePEPositionIdArray: CGRAPositionId[],
        peSignalNameConfigArray: PESignalNameConfig[][],
    ) {
        this.cgraConfig = cgraConfig;
        this.inputRelativePEPositionIdArray = inputRelativePEPositionIdArray;
        this.peLogArray = [];
        for (let i = 0; i < cgraConfig.rowSize; i++) {
            let peLogRow: PELog[] = [];
            for (let j = 0; j < cgraConfig.columnSize; j++) {
                peLogRow.push(new PELog(peSignalNameConfigArray[i][j]));
            }
            this.peLogArray.push(peLogRow);
        }
    }

    public SetValue(signalName: string, updatedCycle: number, updatedValue: number): void {
        for (let i = 0; i < this.cgraConfig.rowSize; i++) {
            for (let j = 0; j < this.cgraConfig.columnSize; j++) {
                this.peLogArray[i][j].SetValue(signalName, updatedCycle, updatedValue);
            }
        }
    }

    public SetValueArray(
        signalName: string,
        updatedValueArray: { updatedCycle: number; updatedValue: number }[],
    ): void {
        for (let i = 0; i < this.cgraConfig.rowSize; i++) {
            for (let j = 0; j < this.cgraConfig.columnSize; j++) {
                this.peLogArray[i][j].SetValueArray(signalName, updatedValueArray);
            }
        }
    }

    public getValueByCycle(cycle: number): PEValue[][] {
        let result: PEValue[][] = [];

        for (let i = 0; i < this.cgraConfig.rowSize; i++) {
            let tmpPEValueRow: PEValue[] = [];
            for (let j = 0; j < this.cgraConfig.columnSize; j++) {
                tmpPEValueRow.push(this.peLogArray[i][j].getValueByCycle(cycle));
            }
            result.push(tmpPEValueRow);
        }

        return result;
    }

    public getPELog(rowId: number, columnId: number): PELog {
        return this.peLogArray[rowId][columnId];
    }
}

export { CGRALog, CGRAConfig };
