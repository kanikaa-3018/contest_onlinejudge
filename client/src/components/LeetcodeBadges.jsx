import React from 'react';
import { Award } from 'lucide-react';

const LeetcodeBadges = ({ badges }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.badges.map((badge, index) => (
        <div 
          key={index} 
          className="flex items-center bg-[#1A1F2C] p-3 rounded-lg border border-[#403E43]"
        >
          <Award className="text-[#f6e58d] mr-2" size={18} />
          <span className="text-sm">{badge?.displayName}</span>
        </div>
      ))}
    </div>
  );
};

export default LeetcodeBadges;