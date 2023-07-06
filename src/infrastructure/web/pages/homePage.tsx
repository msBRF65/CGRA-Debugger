import '@/infrastructure/web/css/page.css';
import { CGRAUsecase } from '@/applications/usecase';
import { CGRAConfigLoader } from '@/infrastructure/fileLoader';
import { useLocation, useNavigate } from 'react-router-dom';

let vcdPath: string = '/Users/saitoumakoto/Desktop/cgra.vcd';
let configPath: string = '/Users/saitoumakoto/Desktop/cgra.json';

export const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cgraUsecase = new CGRAUsecase();

    const handleClick = async (configPath: string) => {
        var cgraConfigData = await CGRAConfigLoader.getCGRAConfig(configPath);
        let cgraLog = await cgraUsecase.createCGRA({
            path: vcdPath,
            cgraConfig: cgraConfigData.config,
            peConfigArray: cgraConfigData.peConfigArray,
        });
        navigate('/cgra', { state: { cgraLog: cgraLog } });
    };

    return (
        <div className="container">
            <h1>CGRA Debugger Home</h1>
            <div>{vcdPath}</div>
            <button
                onClick={async () => {
                    return handleClick(configPath);
                }}
            >
                Read File
            </button>
        </div>
    );
};
