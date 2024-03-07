import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import io from 'socket.io-client';

const CodeEditor = () => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [pyodide, setPyodide] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const loadPyodide = async () => {
            try {
                const pyodideInstance = await window.loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/',
                });
                setPyodide(pyodideInstance);
            } catch (error) {
                console.error('Failed to load Pyodide:', error);
            }
        };

        loadPyodide();

        // Connect to the server using Socket.IO
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        // Listen for code updates from other clients
        newSocket.on('codeUpdate', (newCode) => {
            setCode(newCode);
        });

        // Listen for the initial code from the server
        newSocket.on('initialCode', (initialCode) => {
            setCode(initialCode);
        });

        // Clean up the socket connection on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socket.emit('codeChange', newCode);
    };

    const handleCodeExecution = async () => {
        if (!pyodide) {
            setOutput('Pyodide is not loaded yet.');
            return;
        }

        try {
            await pyodide.runPython(`
                import io
                import sys
                sys.stdout = io.StringIO()
            `);

            await pyodide.runPython(code);

            const output = pyodide.globals.get('sys').stdout.getvalue();

            await pyodide.runPython(`
                sys.stdout = sys.__stdout__
            `);

            setOutput(output);
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <AceEditor
                mode="python"
                theme="monokai"
                value={code}
                onChange={handleCodeChange}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
            />
            <button onClick={handleCodeExecution}>Run</button>
            <div className="output-container">
                <pre className="output">{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;

