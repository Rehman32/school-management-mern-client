// ============================================
// FEE STATS COMPONENT
// Displays financial statistics cards
// ============================================

import React from 'react';
import { 
  FaDollarSign, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaClock 
} from 'react-icons/fa';

const FeeStats = ({ stats, isDark }) => {
  const formatCurrency = (amount) => {
    return `$${(amount || 0).toFixed(2)}`;
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalPaid || 0),
      icon: FaDollarSign,
      color: 'green',
      bgLight: 'bg-green-100',
      bgDark: 'bg-green-900/30',
      textLight: 'text-green-600',
      textDark: 'text-green-400',
      subtitle: `Collected from ${stats?.totalFees || 0} fees`
    },
    {
      title: 'Pending',
      value: formatCurrency(stats?.totalPending || 0),
      icon: FaClock,
      color: 'yellow',
      bgLight: 'bg-yellow-100',
      bgDark: 'bg-yellow-900/30',
      textLight: 'text-yellow-600',
      textDark: 'text-yellow-400',
      subtitle: 'Awaiting payment'
    },
    {
      title: 'Overdue',
      value: formatCurrency(stats?.totalOverdue || 0),
      icon: FaExclamationCircle,
      color: 'red',
      bgLight: 'bg-red-100',
      bgDark: 'bg-red-900/30',
      textLight: 'text-red-600',
      textDark: 'text-red-400',
      subtitle: 'Past due date'
    },
    {
      title: 'Total Expected',
      value: formatCurrency(stats?.totalAmount || 0),
      icon: FaCheckCircle,
      color: 'blue',
      bgLight: 'bg-blue-100',
      bgDark: 'bg-blue-900/30',
      textLight: 'text-blue-600',
      textDark: 'text-blue-400',
      subtitle: `${stats?.totalFees || 0} fee records`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`rounded-xl shadow-md p-6 border transition-all duration-200 hover:shadow-lg ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${
                isDark ? card.bgDark : card.bgLight
              }`}>
                <Icon className={`text-2xl ${
                  isDark ? card.textDark : card.textLight
                }`} />
              </div>
            </div>
            <div>
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {card.title}
              </p>
              <p className={`text-2xl font-bold mt-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {card.value}
              </p>
              {card.subtitle && (
                <p className={`text-xs mt-1 ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeeStats;
