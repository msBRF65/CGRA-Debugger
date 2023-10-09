import '@/infrastructure/web/css/page.css';
import { CGRAUsecase, DataInfoUsecase, getVcdSignalInfoOutputType } from '@/applications/usecase';
import { CGRAConfigLoader } from '@/infrastructure/fileLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { createRef, useEffect, useState } from 'react';

import { FileUploadButton } from '../components/fileUploadButton';
import { CGRALog } from '@/domain/entity';

export const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cgraUsecase = new CGRAUsecase();
    const dataInfoUsecase = new DataInfoUsecase();

    const vcdFileUploadButtonRef = createRef<FileUploadButton>();
    const configFileUploadButtonRef = createRef<FileUploadButton>();
    const mappingFileUploadButtonRef = createRef<FileUploadButton>();

    const [vcdFilePath, setVcdFilePath] = useState('');
    const [configFilePath, setConfigFilePath] = useState('');
    const [mappingFilePath, setMappingFilePath] = useState('');
    const [vcdSignalName, setVcdSignalName] = useState<getVcdSignalInfoOutputType>([]);

    const setInitialDataPath = async () => {
        const vcdDataPathStoredData = await window.store.getData('vcd_file_path');
        const configDataPathStoredData = await window.store.getData('config_file_path');
        const mappingDataPathStoredData = await window.store.getData('mapping_file_path');
        
        if (vcdDataPathStoredData.value !== undefined) {
            setVcdFilePath(vcdDataPathStoredData.value);
            vcdFileUploadButtonRef.current?.setState({ filePath: vcdDataPathStoredData.value });
        }
        if (configDataPathStoredData.value !== undefined) {
            setConfigFilePath(configDataPathStoredData.value);
            configFileUploadButtonRef.current?.setState({ filePath: configDataPathStoredData.value });
        }
        if (mappingDataPathStoredData.value !== undefined) {
            setMappingFilePath(mappingDataPathStoredData.value);
            mappingFileUploadButtonRef.current?.setState({ filePath: mappingDataPathStoredData.value });
        }
    };

    useEffect(() => {
        setInitialDataPath();
    }, []);

    const handleReadFileClick = async () => {
        let cgraConfigData = await CGRAConfigLoader.getCGRAConfig(configFilePath);
        let cgraLog: CGRALog = await cgraUsecase.createCGRA({
            vcdPath: vcdFilePath,
            cgraConfig: cgraConfigData.config,
            peConfigArray: cgraConfigData.peConfigArray,
            inputRelativePEPositionIdArray: cgraConfigData.inputRelativePEPositionIdArray,
        });
        let cgraConfigurationData = await cgraUsecase.getCGRAConfigurationData({ mappingJsonPath: mappingFilePath });

        await window.store.setData({ name: 'vcd_file_path', value: vcdFilePath });
        await window.store.setData({ name: 'config_file_path', value: configFilePath });
        await window.store.setData({ name: 'mapping_file_path', value: mappingFilePath });

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
                <FileUploadButton
                    ref={vcdFileUploadButtonRef}
                    discription="vcd File:"
                    buttonName="open"
                    initFilePath={vcdFilePath}
                    callbackFunc={(filePath: string) => {
                        setVcdFilePath(filePath);
                    }}
                ></FileUploadButton>
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
                <FileUploadButton
                    ref={configFileUploadButtonRef}
                    discription="Configuration JSON File: "
                    buttonName="open"
                    initFilePath={configFilePath}
                    callbackFunc={(filePath: string) => {
                        setConfigFilePath(filePath);
                    }}
                ></FileUploadButton>
            </div>
            <div>
                <FileUploadButton
                    ref={mappingFileUploadButtonRef}
                    discription="Mapping Result File: "
                    buttonName="open"
                    initFilePath={mappingFilePath}
                    callbackFunc={(filePath: string) => {
                        setMappingFilePath(filePath);
                    }}
                ></FileUploadButton>
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
                            {item.signalName}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
