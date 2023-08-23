class CGRAPositionId {
    readonly rowId: number;
    readonly columnId: number;

    constructor(rowId: number, columnId: number) {
        this.rowId = rowId;
        this.columnId = columnId;
    }
}

export { CGRAPositionId };
