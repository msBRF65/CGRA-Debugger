class CGRAPositionId {
    readonly rowId: number;
    readonly columnId: number;

    constructor(rowId: number, columnId: number) {
        this.rowId = rowId;
        this.columnId = columnId;
    }

    public add(positionId: CGRAPositionId): CGRAPositionId {
        return new CGRAPositionId(this.rowId + positionId.rowId, this.columnId + positionId.columnId);
    }

    public equal(positionId: CGRAPositionId): boolean {
        return this.rowId === positionId.rowId && this.columnId === positionId.columnId;
    }
}

export { CGRAPositionId };
