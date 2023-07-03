type WaveData = {
    updatedCycle: number;
    updatedValue: number;
};

type SignalData = {
    module: string;
    signalName: string;
    waveDataArray: WaveData[];
};

class VCDLoader {
    public static async getSignalData(filePath: string): Promise<SignalData[]> {
        let vcdText: string = await window.fs.readFile(filePath);
        let signalDataObjcet: any = await window.vcdParser.parse(vcdText);
        let signalDataArray: SignalData[] = [];

        signalDataObjcet.signal.map((element: any) => {
            let tmpSignalData: SignalData = {
                module: element.module,
                signalName: element.signalName,
                waveDataArray: [],
            };
            element.wave.map((waveElement: string[]) => {
                let tmpWaveData: WaveData = {
                    updatedCycle: Number(waveElement[0]),
                    updatedValue: this.getNumberFromBitString(waveElement[1]),
                };
                tmpSignalData.waveDataArray.push(tmpWaveData);
            });
            signalDataArray.push(tmpSignalData);
        });

        return signalDataArray;
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
