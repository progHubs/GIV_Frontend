import React from 'react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  bgColor: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features, bgColor }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="text-sm text-gray-500 space-y-2">
        {features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard;
