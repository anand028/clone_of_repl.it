import Editor from '@monaco-editor/react';

export default function CodeEditor() {
  return (
    <Editor
      height="90vh"
      defaultLanguage="python"
      defaultValue="# Write your code here"
      theme="vs-dark"
      options={{ minimap: { enabled: false } }}
    />
  );
}