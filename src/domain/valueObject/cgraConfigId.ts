import { CGRAPositionId } from '@/domain/valueObject';

class CGRAConfigId {
    readonly cgraPositionId: CGRAPositionId;
    readonly contextId: number;

    constructor(rowId: number, columnId: number, contextId: number) {
        this.cgraPositionId = new CGRAPositionId(rowId, columnId);
        this.contextId = contextId;
    }
}

export { CGRAConfigId };
