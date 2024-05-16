import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Terminal from "./components/terminal";
import FileTree from "./components/tree";
import socket from "./socket";
import AceEditor from "react-ace";

import { getFileMode } from "./utils/getFileMode";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");

  const isSaved = selectedFileContent === code;

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);

  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  const getFileTree = async () => {
    const response = await fetch("http://localhost:4000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:4000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  return (
    <div className="playground-container flex flex-col h-screen">
      <div className="editor-container flex flex-1">
        <div className="files w-1/4 border-r border-gray-200">
          <FileTree
            onSelect={(path) => {
              setSelectedFileContent("");
              setSelectedFile(path);
            }}
            tree={fileTree}
          />
        </div>
        <div className="editor flex-1 p-4">
          {selectedFile && (
            <p className="mb-2">
              {selectedFile.replaceAll("/", " > ")}{" "}
              {isSaved ? "Saved" : "Unsaved"}
            </p>
          )}
          <AceEditor
            width="100%"
            height="calc(100% - 24px)" // Subtract the height of the file path text
            mode={getFileMode({ selectedFile })}
            value={code}
            onChange={(e) => setCode(e)}
          />
        </div>
      </div>
      <div className="terminal-container h-1/3 border-t border-gray-200">
        <Terminal />
      </div>
    </div>
  );
}

export default App;
