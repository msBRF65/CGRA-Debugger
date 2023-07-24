import React from 'react';
import { PEComponent } from './PEComponent';
import { CGRAConfigurationData, CGRALog } from '@/domain/entity';

interface ICGRAComponent {
    width: number;
    height: number;
    cgraLog: CGRALog;
    cgraConfigurationData: CGRAConfigurationData;
}

class CGRAComponent extends React.Component<ICGRAComponent, {}> {
    readonly refArray: any[];

    constructor(props: ICGRAComponent) {
        super(props);
        this.handleCycleChange = this.handleCycleChange.bind(this);
        this.refArray = [];
        for (let i = 0; i < this.props.cgraLog.cgraConfig.rowSize; i++) {
            let refRowArray = [];
            for (let j = 0; j < this.props.cgraLog.cgraConfig.columnSize; j++) {
                refRowArray.push(React.createRef<PEComponent>());
            }
            this.refArray.push(refRowArray);
        }
    }

    render() {
        let peSize = Math.min(this.props.width, this.props.height) / 5;
        return (
            <div>
                {Array.from({ length: this.props.cgraLog.cgraConfig.rowSize }, (_, i) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {Array.from({ length: this.props.cgraLog.cgraConfig.columnSize }, (_, j) => (
                            <PEComponent
                                ref={this.refArray[i][j]}
                                size={peSize}
                                rowId={i}
                                columnId={j}
                                peLog={this.props.cgraLog.getPELog(i, j)}
                                configurationData={this.props.cgraConfigurationData.GetCGRAConfigurationDataInPE(i, j)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    handleCycleChange = (cycle: number) => {
        this.refArray.map((refRowArray) => {
            refRowArray.map((ref: any) => {
                let tmpComponent: PEComponent = ref.current;
                tmpComponent.handleChangeCycle(cycle);
            });
        });
    };
}

export { CGRAComponent };
