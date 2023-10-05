import { VcdData, parse } from 'rust_vcd_wasm';

type WaveData = {
    updatedCycle: number;
    updatedValue: number;
};

type SignalData = {
    module: string;
    signalName: string;
    waveDataArray: WaveData[];
};

type SignalName = {
    module: string;
    signalName: string;
};

class VCDLoader {
    public static async getSignalData(filePath: string): Promise<SignalData[]> {
        // let vcdText: string = await window.fs.readFile(filePath);
        console.log('----- parse -----');
        const startTime = Date.now();
        console.log(filePath);
        let vcdText: string = await window.fs.readFile(filePath);
        let signalDataObject: VcdData = await window.vcdParser.parse(vcdText);

        const endTime = Date.now();
        console.log('parse time: ', endTime - startTime);

        console.log(signalDataObject.get_vcd_header);

        let signalDataArray: SignalData[] = [];

        // signalDataObject.signal.map((element: any) => {
        //     let tmpSignalData: SignalData = {
        //         module: element.module,
        //         signalName: element.signalName,
        //         waveDataArray: [],
        //     };
        //     element.wave.map((waveElement: string[]) => {
        //         let tmpWaveData: WaveData = {
        //             updatedCycle: Number(waveElement[0]),
        //             updatedValue: this.getNumberFromBitString(waveElement[1]),
        //         };
        //         tmpSignalData.waveDataArray.push(tmpWaveData);
        //     });
        //     signalDataArray.push(tmpSignalData);
        // });

        return signalDataArray;
    }

    public static async getSignalName(filePath: string): Promise<SignalName[]> {
        let vcdText: string = await window.fs.readFile(filePath);
        let signalDataObjcet: any = await window.vcdParser.parse(vcdText);
        let signalNameStringToTypeMap: { [key: string]: SignalName } = {};

        signalDataObjcet.signal.map((element: any) => {
            let key = element.module.replace(/\([^()]*\)/g, '()') + element.signalName.replace(/\([^()]*\)/g, '()');
            if (!signalNameStringToTypeMap.hasOwnProperty(key)) {
                signalNameStringToTypeMap[key] = element;
            }
        });

        return Object.values(signalNameStringToTypeMap);
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
