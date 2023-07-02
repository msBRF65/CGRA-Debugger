import { Wire } from '@/domain/valueObject';

class PE {
    readonly inputWireArray: Wire[];
    readonly outputWire: Wire[];
    readonly status: { [statusName: string]: Wire };

    constructor(input: { inputWireNum: number }) {
        this.inputWireArray = [];
        this.outputWire = [];
        this.status = {};
    }
}
