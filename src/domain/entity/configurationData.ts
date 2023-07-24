import { CGRAConfigId, Operation } from '@/domain/valueObject';

class ConfigurationData {
    readonly constValue: number;
    readonly fromConfigIdArray: CGRAConfigId[];
    readonly toConfigIdArray: CGRAConfigId[];
    readonly operation: Operation;

    constructor(input: {
        constValue?: number;
        fromConfigIdArray: CGRAConfigId[];
        toConfigIdArray: CGRAConfigId[];
        operationType: string;
        operationName: string;
    }) {
        this.constValue = input.constValue == undefined ? 0 : input.constValue;
        this.fromConfigIdArray = input.fromConfigIdArray;
        this.toConfigIdArray = input.toConfigIdArray;
        this.operation = new Operation({
            operationType: input.operationType,
            operationName: input.operationName,
        });
    }

    public UseDataFromPE(rowId: number, columnId: number): boolean {
        let useDataFromPE: boolean = false;
        this.fromConfigIdArray.map((ele) => {
            if (ele.rowId == rowId && ele.columnId == columnId) useDataFromPE = true;
        });
        return useDataFromPE;
    }

    public UseDataToPE(rowId: number, columnId: number): boolean {
        let useDataToPE: boolean = false;
        this.toConfigIdArray.map((ele) => {
            if (ele.rowId == rowId && ele.columnId == columnId) useDataToPE = true;
        });
        return useDataToPE;
    }
}

export { ConfigurationData };
