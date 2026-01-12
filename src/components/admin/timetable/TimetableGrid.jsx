// ============================================
// VISUAL TIMETABLE COMPONENT
// client/src/components/admin/timetable/TimetableGrid.jsx
// Weekly timetable display grid
// ============================================

import React from 'react';
import { Clock, BookOpen, User } from 'lucide-react';

const TimetableGrid = ({ timetable, isDark }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);
  
  // Color palette for subjects
  const subjectColors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
  ];

  const getSubjectColor = (subjectName) => {
    if (!subjectName) return 'from-gray-400 to-gray-500';
    const hash = subjectName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return subjectColors[hash % subjectColors.length];
  };

  const getPeriodForDay = (day, period) => {
    if (!timetable || !timetable.length) return null;
    
    return timetable.find(slot => 
      slot.day?.toLowerCase() === day.toLowerCase() && 
      slot.period === period
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Default period times
  const periodTimes = [
    { start: '08:00', end: '08:45' },
    { start: '08:45', end: '09:30' },
    { start: '09:30', end: '10:15' },
    { start: '10:30', end: '11:15' }, // After break
    { start: '11:15', end: '12:00' },
    { start: '12:00', end: '12:45' },
    { start: '13:30', end: '14:15' }, // After lunch
    { start: '14:15', end: '15:00' },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header Row - Days */}
        <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-2 mb-2">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Clock size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          {days.map(day => (
            <div
              key={day}
              className={`p-3 rounded-lg text-center font-semibold ${
                isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Period Rows */}
        {periods.map((period, periodIndex) => (
          <div key={period} className="grid grid-cols-[80px_repeat(6,1fr)] gap-2 mb-2">
            {/* Period Time */}
            <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Period {period}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {formatTime(periodTimes[periodIndex]?.start)}
              </p>
            </div>

            {/* Class Slots */}
            {days.map(day => {
              const slot = getPeriodForDay(day, period);
              
              if (!slot) {
                return (
                  <div
                    key={`${day}-${period}`}
                    className={`p-3 rounded-lg border-2 border-dashed ${
                      isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <p className={`text-xs text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      Free
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={`${day}-${period}`}
                  className={`p-3 rounded-lg bg-gradient-to-br ${getSubjectColor(slot.subject?.name || slot.subjectName)} text-white shadow-md hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start gap-2">
                    <BookOpen size={14} className="flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {slot.subject?.name || slot.subjectName || 'Subject'}
                      </p>
                      <p className="text-xs opacity-80 truncate flex items-center gap-1 mt-1">
                        <User size={10} />
                        {slot.teacher?.fullName || slot.teacherName || 'TBA'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Break Indicators */}
        <div className={`mt-4 p-3 rounded-lg text-center ${isDark ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
          <p className="text-sm">☕ Break: 10:15 - 10:30 | 🍽️ Lunch: 12:45 - 13:30</p>
        </div>
      </div>

      {/* Empty State */}
      {(!timetable || timetable.length === 0) && (
        <div className="text-center py-12">
          <Clock size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No timetable data available</p>
        </div>
      )}
    </div>
  );
};

export default TimetableGrid;
