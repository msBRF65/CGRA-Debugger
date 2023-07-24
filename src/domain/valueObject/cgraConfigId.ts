class CGRAConfigId {
    readonly rowId: number;
    readonly columnId: number;
    readonly contextId: number;

    constructor(rowId: number, columnId: number, contextId: number) {
        this.rowId = rowId;
        this.columnId = columnId;
        this.contextId = contextId;
    }

    public GetRowId(): number {
        return this.rowId;
    }

    public GetColumnId(): number {
        return this.columnId;
    }

    public GetContextId(): number {
        return this.contextId;
    }
}

export { CGRAConfigId };
