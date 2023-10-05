import React from 'react';

interface IFileUploadButton {
    discription: string;
    buttonName: string;
    initFilePath: string;
    callbackFunc: (filePath: string) => void;
}

interface FileUploadButtonStateType {
    filePath: string;
}

class FileUploadButton extends React.Component<IFileUploadButton, FileUploadButtonStateType> {
    inputRef = React.createRef<HTMLInputElement>();

    constructor(props: IFileUploadButton) {
        super(props);
        this.state = {
            filePath: this.props.initFilePath,
        };
    }

    OnButtonClick = () => {
        console.log('OnButtonClick');
        if (this.inputRef.current !== null) {
            this.inputRef.current.click();
        }
    };

    OnFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('OnFileInputChange');
        const files = event.currentTarget.files;
        if (!files || files?.length === 0) return;
        const file = files[0];
        console.log(file.path);
        this.setState({ filePath: file.path });
        this.props.callbackFunc(file.path);
        console.log(this.state.filePath);
    };

    render() {
        return (
            <div style={{ display: 'flex' }}>
                {this.props.discription}
                <button
                    onClick={() => {
                        return this.OnButtonClick();
                    }}
                >
                    {this.props.buttonName}
                </button>

                {this.state.filePath}
                <input
                    hidden
                    ref={this.inputRef}
                    type="file"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        return this.OnFileInputChange(event);
                    }}
                ></input>
            </div>
        );
    }
}

export { FileUploadButton };
