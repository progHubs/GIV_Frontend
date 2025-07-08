import React from 'react';

interface StatisticsCardProps {
  icon: React.ReactNode;
  number: string;
  label: string;
  bgColor: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ icon, number, label, bgColor }) => {
  return (
    <div className="text-center">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export default StatisticsCard;
