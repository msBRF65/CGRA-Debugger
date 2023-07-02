import './App.css';
import { useState } from 'react';
import { VCDLoader } from '@/infrastructure/fileLoader';

let vcdPath: string = '/Users/saitoumakoto/Desktop/cgra.vcd';

export const App = () => {
    const [text, setText] = useState('before read');
    const handleClick = async () => {
        var file_text = await window.myapi.read(vcdPath);
        // console.log(file_text)
        setText(file_text);
    };
    return (
        <div className="container">
            <h1>Hello.</h1>
            <div>{text}</div>
            <div>{vcdPath}</div>
            <div onClick={handleClick}>Read File</div>
        </div>
    );
};
