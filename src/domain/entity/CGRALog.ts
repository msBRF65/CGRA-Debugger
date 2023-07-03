import { PELog, PESignalNameConfig, PEValue } from './PELog';

type CGRAConfig = {
    rowSize: number;
    columnSize: number;
    neighborPESize: number;
};

class CGRALog {
    readonly cgraConfig: CGRAConfig;
    readonly peLogArray: PELog[][];

    constructor(cgraConfig: CGRAConfig, peSignalNameConfigArray: PESignalNameConfig[][]) {
        this.cgraConfig = cgraConfig;
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
}

export { CGRALog, CGRAConfig };
