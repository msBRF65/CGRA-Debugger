import './App.css';
import { useState } from 'react';
import { CGRAConfigLoader, VCDLoader } from '@/infrastructure/fileLoader';
import { CGRAUsecase } from '@/applications/usecase';
import { config } from 'process';

let vcdPath: string = '/Users/saitoumakoto/Desktop/cgra.vcd';
let configPath: string = '/Users/saitoumakoto/Desktop/cgra.json';

export const App = () => {
    const [vcd_text, setVcdText] = useState('');
    const [config_text, setConfigText] = useState('');
    const cgraUsecase = new CGRAUsecase();
    const handleClick = async () => {
        var cgraConfigData = await CGRAConfigLoader.getCGRAConfig(configPath);
        await cgraUsecase.updateCGRA({
            path: vcdPath,
            cgraConfig: cgraConfigData.config,
            peConfigArray: cgraConfigData.peConfigArray,
        });
        var cgraData = cgraUsecase.getCGRAData({ cycle: 0 });
    };
    return (
        <div className="container">
            <h1>Hello.</h1>
            <div>vcd text : {vcd_text}</div>
            <div>config text : {config_text}</div>
            <div>{vcdPath}</div>
            <div onClick={handleClick}>Read File</div>
        </div>
    );
};
