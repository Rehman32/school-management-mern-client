// ============================================
// ATTENDANCE TABLE COMPONENT
// Main table for marking attendance
// ============================================

import React from 'react';
import StudentAttendanceRow from './StudentAttendanceRow';
import { FaUserClock } from 'react-icons/fa';

const AttendanceTable = ({ students, attendanceMap, onStatusChange, isDark }) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <FaUserClock className={`text-2xl ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
        </div>
        <h3 className={`text-lg font-medium mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          No students found
        </h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Select a class and date to mark attendance
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${
        isDark ? 'divide-gray-700' : 'divide-gray-200'
      }`}>
        <thead className={isDark ? 'bg-gray-900/50' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Student
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Mark Status
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Current Status
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${
          isDark 
            ? 'bg-gray-800 divide-gray-700' 
            : 'bg-white divide-gray-200'
        }`}>
          {students.map((student) => (
            <StudentAttendanceRow
              key={student._id}
              student={student}
              status={attendanceMap[student._id] || 'present'}
              onStatusChange={onStatusChange}
              isDark={isDark}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
