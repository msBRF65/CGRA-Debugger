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

    render() {
        const OnButtonClick = () => {
            if (this.inputRef.current !== null) {
                this.inputRef.current.click();
            }
        };

        const OnFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.currentTarget.files;
            if (!files || files?.length === 0) return;
            const file = files[0];
            this.setState({ filePath: file.path });
            this.props.callbackFunc(file.path);
        };

        return (
            <div style={{ display: 'flex' }}>
                {this.props.discription}
                <button
                    onClick={() => {
                        return OnButtonClick();
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
                        return OnFileInputChange(event);
                    }}
                ></input>
            </div>
        );
    }
}

export { FileUploadButton };
