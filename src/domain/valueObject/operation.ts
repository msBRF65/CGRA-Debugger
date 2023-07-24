enum OperationTypeEnum {
    ADD = 1,
    SUB = 2,
    MUL = 3,
    DIV = 4,
    CONST = 5,
    LOAD = 6,
    OUTPUT = 7,
    STORE = 8,
    NOP = 9,
    ROUTE = 10,
}

const GetOperationEnumFromString = (input: string): OperationTypeEnum => {
    switch (input) {
        case 'add':
            return OperationTypeEnum.ADD;
        case 'sub':
            return OperationTypeEnum.SUB;
        case 'mul':
            return OperationTypeEnum.MUL;
        case 'div':
            return OperationTypeEnum.DIV;
        case 'const':
            return OperationTypeEnum.CONST;
        case 'load':
            return OperationTypeEnum.LOAD;
        case 'output':
            return OperationTypeEnum.OUTPUT;
        case 'store':
            return OperationTypeEnum.STORE;
        case 'nop':
            return OperationTypeEnum.NOP;
        case 'route':
            return OperationTypeEnum.ROUTE;
    }
    throw new Error('Error: failed to convert string to OperationTypeEnum');
};

const GetOperationStringFromEnum = (input: OperationTypeEnum): string => {
    switch (input) {
        case OperationTypeEnum.ADD:
            return 'add';
        case OperationTypeEnum.SUB:
            return 'sub';
        case OperationTypeEnum.MUL:
            return 'mul';
        case OperationTypeEnum.DIV:
            return 'div';
        case OperationTypeEnum.CONST:
            return 'const';
        case OperationTypeEnum.LOAD:
            return 'load';
        case OperationTypeEnum.OUTPUT:
            return 'output';
        case OperationTypeEnum.STORE:
            return 'store';
        case OperationTypeEnum.NOP:
            return 'nop';
        case OperationTypeEnum.ROUTE:
            return 'route';
    }
};

class Operation {
    readonly operation: OperationTypeEnum;

    constructor(input: string) {
        this.operation = GetOperationEnumFromString(input);
    }

    public GetOperation(): OperationTypeEnum {
        return this.operation;
    }

    public GetOperationString(): String {
        return GetOperationStringFromEnum(this.operation);
    }
}

export { Operation, OperationTypeEnum };
