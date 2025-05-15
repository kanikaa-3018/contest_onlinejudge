import React from "react";

const LeetcodeBadges = ({ badges }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {badges?.badges?.map((badge, index) => (
        <div
          key={index}
          className="flex items-center p-3 rounded-lg border border-[#403E43] bg-[#1A1F2C]"
        >
          <img 
            src={badge?.icon} 
            alt="Leetcode Badge" 
            className="h-6 w-6 rounded mr-2" 
          />
          <span className="text-white text-xs">{badge.displayName}</span>
        </div>
      ))}
    </div>
  );
};

export default LeetcodeBadges;
