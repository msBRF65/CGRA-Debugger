import '@/infrastructure/web/css/page.css';
import { CGRAUsecase, DataInfoUsecase, getVcdSignalInfoOutputType } from '@/applications/usecase';
import { CGRAConfigLoader } from '@/infrastructure/fileLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { createRef, useEffect, useState } from 'react';

import { FileUploadButton } from '../components/fileUploadButton';
import { CGRALog } from '@/domain/entity';

const prevDataPath = 'src/infrastructure/web/datas/prev_path.json';
type PrevFileData = {
    vcdFilePath: string;
    configFilePath: string;
    mappingFilePath: string;
};

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
        let existPrevDataFile: boolean = await window.fs.existFile(prevDataPath);
        if (existPrevDataFile) {
            const prevDataString: string = await window.fs.readFile(prevDataPath);
            const prevDataJson: { [name: string]: string } = JSON.parse(prevDataString);
            setVcdFilePath(prevDataJson['vcdFilePath']);
            setConfigFilePath(prevDataJson['configFilePath']);
            setMappingFilePath(prevDataJson['mappingFilePath']);

            vcdFileUploadButtonRef.current?.setState({
                filePath: prevDataJson['vcdFilePath'],
            });
            configFileUploadButtonRef.current?.setState({
                filePath: prevDataJson['configFilePath'],
            });
            mappingFileUploadButtonRef.current?.setState({
                filePath: prevDataJson['mappingFilePath'],
            });
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

        const newPrevData: PrevFileData = {
            vcdFilePath: vcdFilePath,
            configFilePath: configFilePath,
            mappingFilePath: mappingFilePath,
        };

        const newPrevDataJson: JSON = JSON.parse(JSON.stringify(newPrevData));
        if (process.env.NODE_ENV === "production") {
            await window.fs.writeJsonFile(prevDataPath, newPrevDataJson);
        }

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
