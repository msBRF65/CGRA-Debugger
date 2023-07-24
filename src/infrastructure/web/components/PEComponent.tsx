import '@/infrastructure/web/css/page.css';
import { ConfigurationData, PELog, PEValue } from '@/domain/entity';
import React from 'react';

interface IPEComponent {
    peLog: PELog;
    size: number;
    rowId: number;
    columnId: number;
    configurationData: ConfigurationData[];
}

interface PEStateType {
    peValue: PEValue;
    configurationData: ConfigurationData;
}

class PEComponent extends React.Component<IPEComponent, PEStateType> {
    constructor(props: IPEComponent) {
        super(props);
        this.state = {
            peValue: this.props.peLog.getValueByCycle(0),
            configurationData: this.props.configurationData[0],
        };
        this.handleChangeCycle = this.handleChangeCycle.bind(this);
    }

    handleChangeCycle = (cycle: number) => {
        let newPEValue = this.props.peLog.getValueByCycle(cycle);
        this.setState({
            peValue: newPEValue,
            configurationData: this.props.configurationData[newPEValue.aluConfigId],
        });
    };

    render() {
        const triangleStyle = {
            borderTop: '10px solid',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            position: 'absolute',
        } as React.CSSProperties;

        const lineStyle = {
            position: 'absolute',
        } as React.CSSProperties;

        const squareStyle = {
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '60%',
            height: '60%',
            backgroundColor: '#ffffff',
            border: '2px solid #000000',
            overflowWrap: 'break-word',
            inlineSize: '60%',
        } as React.CSSProperties;

        const PEStyle = {
            position: 'relative',
            width: this.props.size,
            height: this.props.size,
            backgroundColor: '#ffffff',
        } as React.CSSProperties;

        const GetLineColor = (isRed: boolean): string => {
            if (isRed) return 'red';
            else return 'black';
        };

        return (
            <div style={{ ...PEStyle }}>
                {/* top */}
                <div
                    style={{
                        ...lineStyle,
                        top: '0%',
                        left: '45%',
                        width: '2px',
                        height: '20%',
                        backgroundColor: GetLineColor(
                            this.state.configurationData.UseDataFromPE(this.props.rowId - 1, this.props.columnId),
                        ),
                    }}
                ></div>
                <div
                    style={{
                        ...triangleStyle,
                        top: 'calc(20% - 10px)',
                        left: 'calc(45% - 4px)',
                        borderTopColor: GetLineColor(
                            this.state.configurationData.UseDataFromPE(this.props.rowId - 1, this.props.columnId),
                        ),
                    }}
                ></div>
                <div
                    style={{
                        ...lineStyle,
                        top: '0%',
                        left: '55%',
                        width: '2px',
                        height: '20%',
                        backgroundColor: GetLineColor(
                            this.state.configurationData.UseDataToPE(this.props.rowId - 1, this.props.columnId),
                        ),
                    }}
                ></div>
                {/* bottom */}
                <div
                    style={{
                        ...lineStyle,
                        bottom: '0%',
                        left: '45%',
                        width: '2px',
                        height: '20%',
                        backgroundColor: GetLineColor(
                            this.state.configurationData.UseDataToPE(this.props.rowId + 1, this.props.columnId),
                        ),
                    }}
                ></div>
                <div
                    style={{
                        ...lineStyle,
                        bottom: '0%',
                        left: '55%',
                        width: '2px',
                        height: '20%',
                        backgroundColor: GetLineColor(
                            this.state.configurationData.UseDataFromPE(this.props.rowId + 1, this.props.columnId),
                        ),
                    }}
                ></div>
                <div
                    style={{
                        ...triangleStyle,
                        top: 'calc(80% + 2px)',
                        left: 'calc(55% - 4px)',
                        transform: 'rotate(-180deg)',
                        borderTopColor: GetLineColor(
                            this.state.configurationData.UseDataFromPE(this.props.rowId + 1, this.props.columnId),
                        ),
                    }}
                ></div>
                {/* left */}
                <div
                    style={{
                        ...lineStyle,
                        top: '45%',
                        left: '0%',
                        height: '2px',
                        width: '20%',
                        backgroundColor: GetLineColor(
                            this.state.configurationData.UseDataFromPE(this.props.rowId, this.props.columnId - 1),
                        ),
                    }}
                ></div>
                <div
                    style={{
                        ...triangleStyle,
                        top: 'calc(45% - 4px)',
                        left: 'calc(20% - 9px)',
                        transform: 'rotate(-90deg)',
                        borderTopColor: GetLineColor(
                            this.state.configurationData.UseDataFromPE(this.props.rowId, this.props.columnId - 1),
                        ),
                    }}
                ></div>
                <div
                    style={{
                        ...lineStyle,
                        top: '55%',
                        left: '0%',
                        height: '2px',
                        width: '20%',
                        backgroundColor: GetLineColor(
                            this.state.configurationData.UseDataToPE(this.props.rowId, this.props.columnId - 1),
                        ),
                    }}
                ></div>
                {/* right */}
                <div
                    style={{
                        ...lineStyle,
                        top: '45%',
                        right: '0%',
                        height: '2px',
                        width: '20%',
                        backgroundColor: GetLineColor(
                            this.state.configurationData.UseDataToPE(this.props.rowId, this.props.columnId + 1),
                        ),
                    }}
                ></div>
                <div
                    style={{
                        ...lineStyle,
                        top: '55%',
                        right: '0%',
                        height: '2px',
                        width: '20%',
                        backgroundColor: GetLineColor(
                            this.state.configurationData.UseDataFromPE(this.props.rowId, this.props.columnId + 1),
                        ),
                    }}
                ></div>
                <div
                    style={{
                        ...triangleStyle,
                        top: 'calc(55% - 4px)',
                        left: 'calc(80% + 4px)',
                        transform: 'rotate(90deg)',
                        borderTopColor: GetLineColor(
                            this.state.configurationData.UseDataFromPE(this.props.rowId, this.props.columnId + 1),
                        ),
                    }}
                ></div>

                {/* output */}
                <div style={{ top: 'calc(20% - 20px)', left: 'calc(55% + 10px)', position: 'absolute' }}>
                    {this.state.peValue.outputValue}
                </div>
                <div style={{ bottom: 'calc(55% + 2px)', left: 'calc(80% + 10px)', position: 'absolute' }}>
                    {this.state.peValue.outputValue}
                </div>
                <div style={{ top: 'calc(80% + 2px)', right: 'calc(55% + 10px)', position: 'absolute' }}>
                    {this.state.peValue.outputValue}
                </div>
                <div style={{ top: 'calc(55% + 2px)', right: 'calc(80% + 10px)', position: 'absolute' }}>
                    {this.state.peValue.outputValue}
                </div>
                {/* input */}
                <div style={{ top: 'calc(20% - 20px)', right: 'calc(55% + 10px)', position: 'absolute' }}>
                    {this.state.peValue.inputValueArray[0]}
                </div>
                <div style={{ top: 'calc(55% + 2px)', left: 'calc(80% + 10px)', position: 'absolute' }}>
                    {this.state.peValue.inputValueArray[1]}
                </div>
                <div style={{ top: 'calc(80% + 2px)', left: 'calc(55% + 10px)', position: 'absolute' }}>
                    {this.state.peValue.inputValueArray[2]}
                </div>
                <div style={{ bottom: 'calc(55% + 2px)', right: 'calc(80% + 10px)', position: 'absolute' }}>
                    {this.state.peValue.inputValueArray[3]}
                </div>
                {/* square */}
                <div style={{ ...squareStyle }}>
                    PE({this.props.rowId}, {this.props.columnId}):{' '}
                    <span style={{ fontWeight: 'bold' }}>
                        {this.state.configurationData.operation.GetOperationString()}
                    </span>
                    {Object.keys(this.state.peValue.statusValueMap).map((key) => {
                        return (
                            <div style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                                {key}: {this.state.peValue.statusValueMap[key]}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export { PEComponent };
