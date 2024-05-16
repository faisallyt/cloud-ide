import React from "react";
import "tailwindcss/tailwind.css";

const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
      className={`ml-4 cursor-pointer ${
        isDir ? "text-blue-500" : "text-gray-700"
      }`}>
      <div className={`flex items-center ${isDir ? "font-bold" : ""}`}>
        {isDir ? (
          <span className="mr-2">📁</span>
        ) : (
          <span className="mr-2">📄</span>
        )}
        <p className={isDir ? "" : "file-node"}>{fileName}</p>
      </div>
      {nodes && fileName !== "node_modules" && (
        <ul className="ml-4">
          {Object.keys(nodes).map((child) => (
            <li key={child} className="mt-1">
              <FileTreeNode
                onSelect={onSelect}
                path={`${path}/${child}`}
                fileName={child}
                nodes={nodes[child]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree, onSelect }) => {
  return (
    <div className="p-4 border border-gray-200 rounded shadow-sm bg-white w-[400px]">
      <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />
    </div>
  );
};

export default FileTree;
