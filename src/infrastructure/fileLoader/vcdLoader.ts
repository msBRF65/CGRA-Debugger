import * as fs from 'fs';
const VCDParser = require('vcd-parser');

class VCDLoader {
    readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public getText(): string {
        console.log('before read');
        let text: string = fs.readFileSync(this.filePath, 'utf-8');
        console.log('after read');
        return text;
    }
}

export { VCDLoader };
