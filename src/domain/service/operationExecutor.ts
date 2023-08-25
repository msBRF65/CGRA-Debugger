import { Operation, OperationTypeEnum } from '@/domain/valueObject';

class OperationExecutor {
    static ExecuteOperation(op: Operation, value1: number, value2: number): number {
        switch (op.operationType) {
            case OperationTypeEnum.ADD:
                return value1 + value2;
            case OperationTypeEnum.SUB:
                return value1 - value2;
            case OperationTypeEnum.MUL:
                return value1 * value2;
            case OperationTypeEnum.DIV:
                return value1 / value2;
            case OperationTypeEnum.OUTPUT:
                return value1;
            case OperationTypeEnum.ROUTE:
                return value1;
        }
        throw new Error('invalid operation type to execution');
    }
}

export { OperationExecutor };
