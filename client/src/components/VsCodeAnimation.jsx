import React from "react";

export const VsCodeAnimation = ({ className }) => {
  return (
    <div className={`bg-vscode-bg rounded-md border border-border overflow-hidden px-4 ${className}`}>
      <div className="flex items-center bg-vscode-bg border-b border-border p-2">
        <div className="flex space-x-1.5 mr-4">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-vscode-lineNumber font-medium">App.jsx</div>
      </div>
      <div className="py-4 font-mono text-sm overflow-hidden">
        <div className="code-line animate-in fade-in-50 duration-700 delay-100" data-line="1">
          <span className="text-vscode-purple">import</span> <span className="text-vscode-accent">React</span> <span className="text-vscode-purple">from</span> <span className="text-vscode-orange">'react'</span>;
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-200" data-line="2">
          <span className="text-vscode-purple">import</span> {'{'} <span className="text-vscode-accent">Routes, Route</span> {'}'} <span className="text-vscode-purple">from</span> <span className="text-vscode-orange">'react-router-dom'</span>;
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-300" data-line="3"></div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-400" data-line="4">
          <span className="text-vscode-comment">// Main application routes</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-500" data-line="5">
          <span className="text-vscode-purple">const</span> <span className="text-vscode-yellow">App</span> <span className="text-vscode-accent">=</span> () <span className="text-vscode-accent">{'=>'}</span> {'{'};
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-600" data-line="6">
          <span className="text-vscode-purple">{'  return'}</span> (
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-700" data-line="7">
          <span className="text-vscode-accent">{'    <Routes>'}</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-800" data-line="8">
          <span className="text-vscode-accent">{'      <Route path="/" element={<Home />} />'}</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-900 font-bold" data-line="9">
          <span className="text-vscode-accent">{'      <Route path="/internship" element={<Internship />} />'}</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-1000" data-line="10">
          <span className="text-vscode-accent">{'      <Route path="/profile" element={<Profile />} />'}</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-1100" data-line="11">
          <span className="text-vscode-accent">{'      <Route path="/contests" element={<Contests />} />'}</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-1200" data-line="12">
          <span className="text-vscode-accent">{'    </Routes>'}</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-1300" data-line="13">
          <span>{'  );'}</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-1400" data-line="14">
          <span>{'}};'}</span>
        </div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-1500" data-line="15"></div>
        <div className="code-line animate-in fade-in-50 duration-700 delay-1600" data-line="16">
          <span className="text-vscode-purple">export</span> <span className="text-vscode-purple">default</span> <span className="text-vscode-yellow">App</span>;
        </div>
      </div>
    </div>
  );
};

export default VsCodeAnimation;
