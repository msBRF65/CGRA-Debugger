import { WireLog } from '@/domain/valueObject';

type PEValue = {
    inputValueArray: number[];
    outputValue: number;
    aluConfigId: number;
    statusValueMap: { [statusName: string]: number };
};

type PESignalNameConfig = {
    inputSignalNameArray: string[];
    outputSignalName: string;
    aluConfigSignalName: string;
    statusSignalNameArray: string[];
};

class PELog {
    readonly inputWireArray: WireLog[];
    readonly outputWire: WireLog;
    readonly aluConfigIdWire: WireLog;
    readonly statusMap: { [statusName: string]: WireLog };
    readonly signalNameConfig: PESignalNameConfig;

    constructor(signalNameConfig: PESignalNameConfig) {
        this.inputWireArray = [];
        signalNameConfig.inputSignalNameArray.map((_) => this.inputWireArray.push(new WireLog()));
        this.outputWire = new WireLog();
        this.aluConfigIdWire = new WireLog();
        this.statusMap = {};
        signalNameConfig.statusSignalNameArray.forEach((key) => (this.statusMap[key] = new WireLog()));

        this.signalNameConfig = signalNameConfig;
    }

    public SetValue(signalName: string, updatedCycle: number, updatedValue: number): void {
        this.signalNameConfig.inputSignalNameArray.map((element, i) => {
            if (element === signalName) this.inputWireArray[i].setValue(updatedCycle, updatedValue);
        });
        if (this.signalNameConfig.outputSignalName === signalName) this.outputWire.setValue(updatedCycle, updatedValue);
        if (this.signalNameConfig.aluConfigSignalName === signalName)
            this.aluConfigIdWire.setValue(updatedCycle, updatedValue);
        Object.keys(this.statusMap).forEach((key) => {
            if (key === signalName) this.statusMap[key].setValue(updatedCycle, updatedValue);
        });
    }

    public SetValueArray(
        signalName: string,
        updatedValueArray: { updatedCycle: number; updatedValue: number }[],
    ): void {
        updatedValueArray.map((element) => this.SetValue(signalName, element.updatedCycle, element.updatedValue));
    }

    public getValueByCycle(cycle: number): PEValue {
        let result: PEValue = {
            inputValueArray: [],
            outputValue: 0,
            aluConfigId: 0,
            statusValueMap: {},
        };

        result.inputValueArray = this.inputWireArray.map((element) => {
            return element.getValueByCycle(cycle);
        });
        result.outputValue = this.outputWire.getValueByCycle(cycle);
        Object.keys(this.statusMap).forEach((key) => {
            result.statusValueMap[key] = this.statusMap[key].getValueByCycle(cycle);
        });

        return result;
    }
}

export { PELog, PESignalNameConfig, PEValue };
