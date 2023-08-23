import '@/infrastructure/web/css/page.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { CGRAComponent } from '../components/CGRAComponent';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { CGRAConfigurationData, CGRALog, CGRAWarningConfig } from '@/domain/entity';

interface CGRAPageState {
    cgraLog: CGRALog;
    cgraConfigurationData: CGRAConfigurationData;
    cgraWarningConfig: CGRAWarningConfig;
}

export const CGRAPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as CGRAPageState;
    const cgraRef = useRef(null);
    const [cycle, setCycle] = useState(1000);

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleChangeCycle = (cycleStep: number) => {
        setCycle(cycle + cycleStep);
        if (cgraRef.current) {
            let currentComponent: CGRAComponent = cgraRef.current;
            currentComponent.handleCycleChange(cycle);
        }
    };

    const [windowWidth, setWindowWidth] = React.useState(0);
    const [windowHeight, setWindowHeight] = React.useState(0);
    useLayoutEffect(() => {
        (async () => {
            let [width, height] = await Promise.all([window.electron.getWidth(), window.electron.getHeight()]);
            setWindowHeight(height);
            setWindowWidth(width);
        })();
    }, []);

    return (
        <div className="container">
            <h1>CGRA Viewer</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CGRAComponent
                    ref={cgraRef}
                    width={windowWidth}
                    height={windowHeight}
                    cgraLog={state.cgraLog}
                    cgraConfigurationData={state.cgraConfigurationData}
                    cgraWarningConfig={state.cgraWarningConfig}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button
                    onClick={() => {
                        handleChangeCycle(-10);
                    }}
                    style={{ width: '40px' }}
                >
                    -10
                </button>
                <button
                    onClick={() => {
                        handleChangeCycle(-1);
                    }}
                    style={{ width: '30px' }}
                >
                    -
                </button>
                <div style={{ width: '100px', textAlign: 'center' }}>Cycle: {cycle}</div>
                <button
                    onClick={() => {
                        handleChangeCycle(1);
                    }}
                    style={{ width: '30px' }}
                >
                    +
                </button>
                <button
                    onClick={() => {
                        handleChangeCycle(10);
                    }}
                    style={{ width: '40px' }}
                >
                    +10
                </button>
            </div>
            <button onClick={handleBackToHome} style={{ fontSize: '12pt' }}>
                Back to Home
            </button>
        </div>
    );
};
