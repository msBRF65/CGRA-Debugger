class CGRAWarningConfig {
    readonly input_to_exec_delay: number;
    readonly input_to_output_delay: number;

    constructor(input_to_exec_delay: number, input_to_output_delay: number) {
        this.input_to_exec_delay = input_to_exec_delay;
        this.input_to_output_delay = input_to_output_delay;
    }
}

export { CGRAWarningConfig };
