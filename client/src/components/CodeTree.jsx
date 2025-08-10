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
  const [isDark, setIsDark] = React.useState(document.documentElement.classList.contains('dark'));
  
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  const Icon = isFolder ? Folder : File;
  
  const iconColor = isFolder 
    ? open 
      ? isDark ? "#DCDCAA" : "#8B7D3A"  // darker yellow for light mode
      : isDark ? "#E8AB53" : "#B8860B"  // darker orange for light mode
    : name.endsWith(".js") || name.endsWith(".ts") 
      ? isDark ? "#4EC9B0" : "#2E8B7D"  // darker teal for light mode
    : name.endsWith(".json") 
      ? isDark ? "#CE9178" : "#A0522D"  // darker brown for light mode
    : name.endsWith(".md") 
      ? isDark ? "#6A9955" : "#4A6741"  // darker green for light mode
    : isDark ? "#CCCCCC" : "#666666";   // darker gray for light mode

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
        className="tree-item cursor-pointer flex items-center py-1 px-2"
        onClick={() => isFolder && setOpen(!open)}
      >
        {isFolder && (
          <ChevronRight 
            className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} 
            color={isDark ? "#CCCCCC" : "#666666"} 
          />
        )}
        <Icon className="h-4 w-4 flex-shrink-0" color={iconColor} />
        <span className="text-sm text-foreground ml-1.5">{name}</span>
      </div>
      {open && children}
    </div>
  );
};
 const CodeTree = () => {
  return (
    <div className="bg-card border border-border rounded-md p-1 max-w-xs shadow-lg" style={{ backgroundColor: 'hsl(var(--card))' }}>
      <div className="text-sm text-muted-foreground font-medium py-2 px-3 border-b border-border">
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
