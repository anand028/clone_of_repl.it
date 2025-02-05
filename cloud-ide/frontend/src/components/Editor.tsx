import React from 'react'
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { io } from 'socket.io-client';


export default function CodeEditor() {
  const [code, setCode] = useState('# Write your code here');
  const [output, setOutput] = useState('');
  const socket = io('http://localhost:5001');
  // Listen for updates:
// useEffect(() => {socket.on('code-update', (newCode) => {setCode(newCode);});
//   }, []);

  const executeCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/execute', {
        language: 'python',
        code: code,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error executing code.');
    }
    
  };
  

  return (
    <div>
        {/* <div>
        <Editor
        height = "90 vh"
        value={code}
        onChange={(value) => setCode(value || '')}
        // ... rest of the props
      />
        </div> */}
         <Editor
      height="80vh"
      width="80vh"
      defaultLanguage="python"
      defaultValue="# Write your code here"
      theme="vs-dark"
      options={{ minimap: { enabled: false } }}
      value={code}
      onChange={(value) => {
        setCode(value || '');
        socket.emit('code-change', value);
      }}
    />
      
      
      <button onClick={executeCode}>Run</button>
      <pre>{output}</pre>
      
    </div>
  );
}