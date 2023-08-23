import '@/infrastructure/web/css/page.css';
import { CGRAUsecase, DataInfoUsecase, getVcdSignalInfoOutputType } from '@/applications/usecase';
import { CGRAConfigLoader } from '@/infrastructure/fileLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cgraUsecase = new CGRAUsecase();
    const dataInfoUsecase = new DataInfoUsecase();
    const [vcdFilePath, setVcdFilePath] = useState('');
    const [configFilePath, setConfigFilePath] = useState('');
    const [mappingFilePath, setMappingFilePath] = useState('');
    const [vcdSignalName, setVcdSignalName] = useState<getVcdSignalInfoOutputType>([]);

    const handleReadFileClick = async () => {
        let cgraConfigData = await CGRAConfigLoader.getCGRAConfig(configFilePath);
        let cgraLog = await cgraUsecase.createCGRA({
            vcdPath: vcdFilePath,
            cgraConfig: cgraConfigData.config,
            peConfigArray: cgraConfigData.peConfigArray,
            inputRelativePEPositionIdArray: cgraConfigData.inputRelativePEPositionIdArray,
        });
        let cgraConfigurationData = await cgraUsecase.getCGRAConfigurationData({ mappingJsonPath: mappingFilePath });
        navigate('/cgra', {
            state: {
                cgraLog: cgraLog,
                cgraConfigurationData: cgraConfigurationData,
                cgraWarningConfig: cgraConfigData.cgraWarningConfig,
            },
        });
    };

    const handleCheckSignalNameClick = async () => {
        let vcdSignalNameFromVcd = await dataInfoUsecase.getVcdSignalInfo({ path: vcdFilePath });
        setVcdSignalName(vcdSignalNameFromVcd);
    };

    return (
        <div
            className="container"
            style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'center' }}
        >
            <div>
                <h1>CGRA Debugger Home</h1>
            </div>
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
                <button
                    onClick={async () => {
                        return handleCheckSignalNameClick();
                    }}
                    style={{ width: '200px', height: '30px', fontSize: '15px' }}
                >
                    Check Signal Name
                </button>
            </div>
            <div></div>
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
            <div>
                <span style={{ marginRight: '5px' }}>Mapping Result File:</span>
                <input
                    type="file"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const files = event.currentTarget.files;
                        if (!files || files?.length === 0) return;
                        const file = files[0];
                        setMappingFilePath(file.path);
                    }}
                />
            </div>
            <div>
                <button
                    onClick={async () => {
                        return handleReadFileClick();
                    }}
                    style={{ width: '100px', height: '30px', fontSize: '15px' }}
                >
                    Read File
                </button>
            </div>
            <div>
                信号名一覧
                <ul>
                    {vcdSignalName.map((item, index) => (
                        <li key={index} style={{ textAlign: 'left' }}>
                            {item.module}.{item.signalName}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
