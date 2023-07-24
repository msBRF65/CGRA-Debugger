class CGRAConfigId {
    readonly rowId: number;
    readonly columnId: number;
    readonly contextId: number;

    constructor(rowId: number, columnId: number, contextId: number) {
        this.rowId = rowId;
        this.columnId = columnId;
        this.contextId = contextId;
    }
}

export { CGRAConfigId };
