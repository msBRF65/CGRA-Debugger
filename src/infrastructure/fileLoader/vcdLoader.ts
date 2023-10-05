import { parse, VcdData, VcdScopeItem, VcdValue } from 'rust_vcd_wasm';

type WaveData = {
    updatedCycle: number;
    updatedValue: number;
};

type SignalData = {
    signalName: string;
    waveDataArray: WaveData[];
};

type SignalName = {
    signalName: string;
};

class VCDLoader {
    public static async getSignalData(filePath: string): Promise<SignalData[]> {
        let vcdText: string = await window.fs.readFile(filePath);
        let getVcdSignalData: VcdData = parse(vcdText);

        const header = getVcdSignalData.get_vcd_header();

        let codeToSignalNameMap: { [key: string]: string } = {};
        let codeToBeginAndEndRange: { [key: string]: { begin: number; end: number } } = {};

        const getItemData = (input: VcdScopeItem, tmpName: string, depth: number) => {
            const varValue = input.get_var();
            const scope = input.get_scope();
            if (varValue !== undefined) {
                let signalName = tmpName + '.' + varValue.get_reference();
                if (varValue.get_index_range_begin() === varValue.get_index_range_end()) {
                    signalName += '[' + varValue.get_index_range_begin() + ']';
                } else {
                    signalName += '[' + varValue.get_index_range_begin() + ':' + varValue.get_index_range_end() + ']';
                }
                codeToSignalNameMap[varValue.get_var_code()] = signalName;
                codeToBeginAndEndRange[varValue.get_var_code()] = {
                    begin: varValue.get_index_range_begin(),
                    end: varValue.get_index_range_end(),
                };
            }
            if (scope !== undefined) {
                for (let i = 0; i < scope.get_items_size(); i++) {
                    let item = scope.get_items_data(i);
                    let updatedTmpName = '';
                    if (tmpName === '') {
                        updatedTmpName = scope.get_identifier();
                    } else {
                        updatedTmpName = tmpName + '.' + scope.get_identifier();
                    }
                    if (depth < 1) {
                        getItemData(item, updatedTmpName, depth + 1);
                    }
                }
            }
        };

        for (let i = 0; i < header.get_items_size(); i++) {
            const scopeItem = header.get_items_data(i);
            getItemData(scopeItem, '', 0);
        }

        let signalNameToWaveDataArray: { [key: string]: WaveData[] } = {};
        for (let i = 0; i < getVcdSignalData.get_vcd_signal_size(); i++) {
            const signalDataAndTime = getVcdSignalData.get_vcd_signal_data(i);
            const time = signalDataAndTime.get_time();

            for (let j = 0; j < signalDataAndTime.get_data_array_scalar_size(); j++) {
                const code: string = signalDataAndTime.get_data_array_scalar_id_code(j);
                if (!Object.keys(codeToSignalNameMap).includes(code)) continue;

                const signalName = codeToSignalNameMap[code];
                const value: VcdValue = signalDataAndTime.get_data_array_scalar_value(j);

                if (!Object.keys(signalNameToWaveDataArray).includes(signalName)) {
                    signalNameToWaveDataArray[signalName] = [];
                }
                const waveData: WaveData = {
                    updatedCycle: Number(time),
                    updatedValue: value,
                };
                signalNameToWaveDataArray[signalName].push(waveData);
            }

            for (let j = 0; j < signalDataAndTime.get_data_array_vector_size(); j++) {
                const code: string = signalDataAndTime.get_data_array_vector_id_code(j);
                if (!Object.keys(codeToSignalNameMap).includes(code)) continue;

                const signalName = codeToSignalNameMap[code];

                let value = 0;
                const beginAndEnd = codeToBeginAndEndRange[code];
                const step = beginAndEnd.begin > beginAndEnd.end ? -1 : 1;
                for (let k = 0; k < signalDataAndTime.get_data_array_vector_value_size(j); k++) {
                    const data = signalDataAndTime.get_data_array_vector_value_data(j, k);
                    value += data * Math.pow(2, beginAndEnd.begin + step * k);
                }

                if (!Object.keys(signalNameToWaveDataArray).includes(signalName)) {
                    signalNameToWaveDataArray[signalName] = [];
                }
                const waveData: WaveData = {
                    updatedCycle: Number(time),
                    updatedValue: value,
                };
                signalNameToWaveDataArray[signalName].push(waveData);
            }

            for (let j = 0; j < signalDataAndTime.get_data_array_real_size(); j++) {
                const code = signalDataAndTime.get_data_array_real_id_code(j);
                if (!Object.keys(codeToSignalNameMap).includes(code)) continue;

                const signalName = codeToSignalNameMap[code];
                const value: number = signalDataAndTime.get_data_array_real_value(j);

                if (!Object.keys(signalNameToWaveDataArray).includes(signalName)) {
                    signalNameToWaveDataArray[signalName] = [];
                }
                const waveData: WaveData = {
                    updatedCycle: Number(time),
                    updatedValue: value,
                };
                signalNameToWaveDataArray[signalName].push(waveData);
            }

            for (let j = 0; j < signalDataAndTime.get_data_array_string_size(); j++) {
                const code = signalDataAndTime.get_data_array_string_id_code(j);
                if (!Object.keys(codeToSignalNameMap).includes(code)) continue;

                const signalName = codeToSignalNameMap[code];
                const value: string = signalDataAndTime.get_data_array_string_value(j);

                if (!Object.keys(signalNameToWaveDataArray).includes(signalName)) {
                    signalNameToWaveDataArray[signalName] = [];
                }
                const waveData: WaveData = {
                    updatedCycle: Number(time),
                    updatedValue: Number(value),
                };
                signalNameToWaveDataArray[signalName].push(waveData);
            }
        }

        let signalDataArray: SignalData[] = [];
        Object.keys(signalNameToWaveDataArray).forEach((signalName) => {
            const dataArray = signalNameToWaveDataArray[signalName];
            const signalData: SignalData = {
                signalName: signalName,
                waveDataArray: dataArray,
            };
            signalDataArray.push(signalData);
        });

        return signalDataArray;
    }

    public static async getSignalName(filePath: string): Promise<SignalName[]> {
        let vcdText: string = await window.fs.readFile(filePath);
        let getVcdSignalData: VcdData = parse(vcdText);

        const header = getVcdSignalData.get_vcd_header();
        let codeToSignalNameMap: { [key: string]: SignalName } = {};

        const getItemData = (input: VcdScopeItem, tmpName: string, depth: number) => {
            const varValue = input.get_var();
            const scope = input.get_scope();
            if (varValue !== undefined) {
                let signalName = tmpName + '.' + varValue.get_reference();
                if (varValue.get_index_range_begin() === varValue.get_index_range_end()) {
                    signalName += '[' + varValue.get_index_range_begin() + ']';
                } else {
                    signalName += '[' + varValue.get_index_range_begin() + ':' + varValue.get_index_range_end() + ']';
                }
                codeToSignalNameMap[varValue.get_var_code()] = { signalName: signalName };
            }
            if (scope !== undefined) {
                for (let i = 0; i < scope.get_items_size(); i++) {
                    let item = scope.get_items_data(i);
                    let updatedTmpName = '';
                    if (tmpName === '') {
                        updatedTmpName = scope.get_identifier();
                    } else {
                        updatedTmpName = tmpName + '.' + scope.get_identifier();
                    }
                    if (depth < 1) {
                        getItemData(item, updatedTmpName, depth + 1);
                    }
                }
            }
        };

        for (let i = 0; i < header.get_items_size(); i++) {
            const scopeItem = header.get_items_data(i);
            getItemData(scopeItem, '', 0);
        }

        return Object.values(codeToSignalNameMap);
    }

    private static getNumberFromBitString(input: string): number {
        let stringArray: string[] = [...input];
        let result = 0;
        stringArray.forEach((ele) => {
            result *= 2;
            result += Number(ele);
        });
        return result;
    }
}

export { VCDLoader, SignalData };
