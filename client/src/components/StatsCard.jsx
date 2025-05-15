import React from 'react';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-[#1A1F2C] p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">{title}</span>
        {icon && <span className="text-[#8B5CF6]">{icon}</span>}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
};

export default StatsCard;