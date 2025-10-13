// ============================================
// ATTENDANCE FILTERS COMPONENT
// Date and class filter controls
// ============================================

import React from 'react';
import { FaCalendar, FaSchool, FaSearch } from 'react-icons/fa';

const AttendanceFilters = ({ 
  selectedClass, 
  setSelectedClass, 
  selectedDate, 
  setSelectedDate,
  classes,
  onSearch,
  isDark 
}) => {
  return (
    <div className={`p-6 border-b ${
      isDark ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Class Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Select Class
          </label>
          <div className="relative">
            <FaSchool className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${
                isDark 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name || `${cls.grade}${cls.section ? `-${cls.section}` : ''}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Select Date
          </label>
          <div className="relative">
            <FaCalendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${
                isDark 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={onSearch}
            disabled={!selectedClass || !selectedDate}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSearch />
            Load Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;
