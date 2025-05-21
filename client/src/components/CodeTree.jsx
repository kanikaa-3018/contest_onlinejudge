import React from "react";
import { ChevronRight, File, Folder } from "lucide-react";

const TreeItem = ({ 
  name, 
  isFolder = false, 
  isOpen = false, 
  level = 0, 
  delay = 0,
  children 
}) => {
  const [open, setOpen] = React.useState(isOpen);
  const Icon = isFolder ? Folder : File;
  const iconColor = isFolder 
    ? open ? "#DCDCAA" : "#E8AB53" 
    : name.endsWith(".js") || name.endsWith(".ts") ? "#4EC9B0" 
    : name.endsWith(".json") ? "#CE9178"
    : name.endsWith(".md") ? "#6A9955"
    : "#CCCCCC";

  return (
    <div
      className="opacity-0 animate-in fade-in duration-700"
      style={{ 
        paddingLeft: `${level * 16}px`,
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards"
      }}
    >
      <div 
        className="tree-item cursor-pointer"
        onClick={() => isFolder && setOpen(!open)}
      >
        {isFolder && (
          <ChevronRight 
            className={`mr-1 h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} 
            color="#CCCCCC" 
          />
        )}
        <Icon className="mr-1.5 h-4 w-4" color={iconColor} />
        <span className="text-sm">{name}</span>
      </div>
      {open && children}
    </div>
  );
};
 const CodeTree = () => {
  return (
    <div className="bg-vscode-bg border border-border rounded-md p-1 max-w-xs">
      <div className="text-sm text-vscode-lineNumber font-medium py-2 px-3 border-b border-border">
        EXPLORER
      </div>
      <div className="py-2">
        <TreeItem name="PROJECT" isFolder isOpen level={0} delay={100}>
          <TreeItem name="src" isFolder isOpen level={1} delay={200}>
            <TreeItem name="components" isFolder isOpen level={2} delay={300}>
              <TreeItem name="Hero.jsx" level={3} delay={400} />
              <TreeItem name="Navigation.jsx" level={3} delay={500} />
            </TreeItem>
            <TreeItem name="pages" isFolder isOpen level={2} delay={700}>
              <TreeItem name="Index.jsx" level={3} delay={800} />
              <TreeItem name="Internship.jsx" level={3} delay={900} />
             
            </TreeItem>
          </TreeItem>
          <TreeItem name="package.json" level={1} delay={1700} />
          <TreeItem name="README.md" level={1} delay={1800} />
        </TreeItem>
      </div>
    </div>
  );
};

export default CodeTree;
