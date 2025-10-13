// ============================================
// STUDENT ATTENDANCE ROW COMPONENT
// Individual student row with status controls
// ============================================

import React from 'react';
import { FaUser } from 'react-icons/fa';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', color: 'green' },
  { value: 'absent', label: 'Absent', color: 'red' },
  { value: 'late', label: 'Late', color: 'yellow' },
  { value: 'half-day', label: 'Half Day', color: 'orange' },
  { value: 'excused', label: 'Excused', color: 'blue' },
  { value: 'leave', label: 'Leave', color: 'purple' }
];

const StudentAttendanceRow = ({ student, status, onStatusChange, isDark }) => {
  const getStatusColor = (statusValue) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === statusValue);
    return statusOption?.color || 'gray';
  };

  const statusColor = getStatusColor(status);

  return (
    <tr className={`transition-colors duration-150 ${
      isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
    }`}>
      {/* Student Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${
            isDark ? 'bg-blue-900/30' : 'bg-blue-100'
          }`}>
            <FaUser className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          <div>
            <div className={`text-sm font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {student.fullName}
            </div>
            <div className={`text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Roll: {student.rollNumber}
            </div>
          </div>
        </div>
      </td>

      {/* Status Selector */}
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={status}
          onChange={(e) => onStatusChange(student._id, e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${
            isDark 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          statusColor === 'green' 
            ? (isDark ? 'text-green-400 bg-green-900/30' : 'text-green-700 bg-green-100')
            : statusColor === 'red'
            ? (isDark ? 'text-red-400 bg-red-900/30' : 'text-red-700 bg-red-100')
            : statusColor === 'yellow'
            ? (isDark ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-700 bg-yellow-100')
            : (isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-700 bg-gray-100')
        }`}>
          {STATUS_OPTIONS.find(opt => opt.value === status)?.label || status}
        </span>
      </td>
    </tr>
  );
};

export default StudentAttendanceRow;
