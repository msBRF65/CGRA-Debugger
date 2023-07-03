type UpdatedCycleAndValue = {
    updatedCycle: number;
    updatedValue: number;
};

class WireLog {
    readonly timeValueArray: UpdatedCycleAndValue[];

    constructor() {
        this.timeValueArray = [];
    }

    public setValue(updatedCycle: number, updatedValue: number) {
        var tmpValue: UpdatedCycleAndValue = {
            updatedCycle: updatedCycle,
            updatedValue: updatedValue,
        };
        if (
            this.timeValueArray.length !== 0 &&
            this.timeValueArray[this.timeValueArray.length - 1].updatedCycle > updatedCycle
        ) {
            throw new Error('WireLog: unordered set value');
        }
        this.timeValueArray.push(tmpValue);
    }

    public getValueByCycle(cycle: number) {
        for (let i = 0; i < this.timeValueArray.length - 1; i++) {
            if (this.timeValueArray[i].updatedCycle <= cycle && cycle < this.timeValueArray[i + 1].updatedCycle) {
                return this.timeValueArray[i].updatedValue;
            }
        }

        if (this.timeValueArray.length == 0) return -1;
        return this.timeValueArray[this.timeValueArray.length - 1].updatedValue;
    }
}

export { WireLog };
