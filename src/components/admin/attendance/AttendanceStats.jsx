// ============================================
// ATTENDANCE STATS COMPONENT
// Displays attendance statistics cards
// ============================================

import React from 'react';
import { FaUserCheck, FaUserTimes, FaClock, FaUsers } from 'react-icons/fa';

const AttendanceStats = ({ stats, isDark }) => {
  const statCards = [
    {
      title: 'Total Present',
      value: stats?.presentCount || 0,
      icon: FaUserCheck,
      color: 'green',
      bgLight: 'bg-green-100',
      bgDark: 'bg-green-900/30',
      textLight: 'text-green-600',
      textDark: 'text-green-400'
    },
    {
      title: 'Total Absent',
      value: stats?.absentCount || 0,
      icon: FaUserTimes,
      color: 'red',
      bgLight: 'bg-red-100',
      bgDark: 'bg-red-900/30',
      textLight: 'text-red-600',
      textDark: 'text-red-400'
    },
    {
      title: 'Late Arrivals',
      value: stats?.lateCount || 0,
      icon: FaClock,
      color: 'yellow',
      bgLight: 'bg-yellow-100',
      bgDark: 'bg-yellow-900/30',
      textLight: 'text-yellow-600',
      textDark: 'text-yellow-400'
    },
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: FaUsers,
      color: 'blue',
      bgLight: 'bg-blue-100',
      bgDark: 'bg-blue-900/30',
      textLight: 'text-blue-600',
      textDark: 'text-blue-400'
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
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {card.title}
                </p>
                <p className={`text-3xl font-bold mt-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {card.value}
                </p>
                {card.title === 'Total Present' && stats?.totalStudents > 0 && (
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {((card.value / stats.totalStudents) * 100).toFixed(1)}% attendance
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-xl ${
                isDark ? card.bgDark : card.bgLight
              }`}>
                <Icon className={`text-2xl ${
                  isDark ? card.textDark : card.textLight
                }`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceStats;
