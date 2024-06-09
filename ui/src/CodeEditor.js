import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import io from 'socket.io-client';

const CodeEditor = () => {
    const [currentRoomId, setCurrentRoomId] = useState('');
    const [roomId, setRoomId] = useState('');
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
        const socket = io('http://localhost:3001');
        setSocket(socket);

        socket.on('roomCreated', (newRoomId) => {
            setRoomId(newRoomId);
            setCurrentRoomId(newRoomId);
        });

        // Listen for code updates from other clients
        socket.on('codeUpdate', (newCode) => {
            setCode(newCode);
        });

        // Listen for the initial code from the server
        socket.on('roomJoined', (res) => {
            const { roomId, data: {code, output} } = res;
            setCode(code);
            setOutput(output);
            setCurrentRoomId(roomId);
        });

        socket.on('outputUpdate', (newOutput) => {
            setOutput(newOutput);
        });

        // Clean up the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleCreateRoom = () => {
        console.log("values", code, output)
        socket.emit('createRoom', {code: code, output: output});
    };

    const handleJoinRoom = (roomIdToJoin) => {
        socket.emit('joinRoom', roomIdToJoin);
        setRoomId(roomIdToJoin);
    }

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socket.emit('codeChange', {roomId, code: newCode});
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
            socket.emit('outputChange', { roomId, output });
        } catch (error) {
            setOutput(error.message);
            socket.emit('outputChange', { roomId, 'output': error.message });
        }
    };

    return (
        <div>
            <h3>Room ID: {currentRoomId}</h3>
            <button onClick={handleCreateRoom}>Create Room</button>
            <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
            />
            <button onClick={() => handleJoinRoom(roomId)}>Join Room</button>
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

