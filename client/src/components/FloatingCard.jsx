import React from "react";

 const FloatingCard = ({ 
  icon, 
  title, 
  description, 
  color,
  animationDelay = 0
}) => {
  return (
    <div 
      className="bg-[#1e1e1e]/80 backdrop-blur-sm p-4 rounded-lg border border-border relative overflow-hidden animate-float-slow"
      style={{ 
        animationDelay: `${animationDelay}ms` 
      }}
    >
      <div 
        className="absolute inset-0 opacity-10 animate-pulse-slow" 
        style={{ 
          background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)`,
          animationDelay: `${animationDelay + 200}ms` 
        }}
      ></div>
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="rounded-full bg-v[#1e1e1e] p-3 mb-2 animate-pulse-slow" style={{ color, animationDelay: `${animationDelay + 400}ms` }}>
          {icon}
        </div>
        <h3 className="font-medium text-lg" style={{ color }}>{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};


export default FloatingCard;
