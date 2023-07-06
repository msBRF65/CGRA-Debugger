import '@/infrastructure/web/css/page.css';
import { CGRAUsecase } from '@/applications/usecase';
import { CGRAConfigLoader } from '@/infrastructure/fileLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cgraUsecase = new CGRAUsecase();
    const [vcdFilePath, setVcdFilePath] = useState('');
    const [configFilePath, setConfigFilePath] = useState('');

    const handleClick = async () => {
        var cgraConfigData = await CGRAConfigLoader.getCGRAConfig(configFilePath);
        let cgraLog = await cgraUsecase.createCGRA({
            path: vcdFilePath,
            cgraConfig: cgraConfigData.config,
            peConfigArray: cgraConfigData.peConfigArray,
        });
        navigate('/cgra', { state: { cgraLog: cgraLog } });
    };

    return (
        <div className="container">
            <h1>CGRA Debugger Home</h1>
            <div>
                <span style={{ marginLeft: '126px' }}>vcd File: </span>
                <input
                    type="file"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const files = event.currentTarget.files;
                        if (!files || files?.length === 0) return;
                        const file = files[0];
                        setVcdFilePath(file.path);
                    }}
                />
            </div>
            <div>
                <span style={{ marginRight: '5px' }}>configuration JSON File:</span>
                <input
                    type="file"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const files = event.currentTarget.files;
                        if (!files || files?.length === 0) return;
                        const file = files[0];
                        setConfigFilePath(file.path);
                    }}
                />
            </div>

            <br></br>
            <button
                onClick={async () => {
                    return handleClick();
                }}
                style={{ width: '100px', height: '30px', fontSize: '15px' }}
            >
                Read File
            </button>
        </div>
    );
};
