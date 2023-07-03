class Wire {
    readonly value: number;

    constructor(value?: number) {
        if (value == null) {
            this.value = 0;
        } else {
            this.value = value;
        }
    }
}

export { Wire };
