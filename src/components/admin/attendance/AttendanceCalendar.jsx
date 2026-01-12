// ============================================
// ATTENDANCE CALENDAR COMPONENT
// client/src/components/admin/attendance/AttendanceCalendar.jsx
// Monthly calendar view with attendance status
// ============================================

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, AlertCircle, Clock } from 'lucide-react';
import { getStudentReport } from '../../../api/attendanceApi';

const AttendanceCalendar = ({ studentId, isDark }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, excused: 0, total: 0 });

  useEffect(() => {
    if (studentId) {
      fetchAttendance();
    }
  }, [studentId, currentDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const res = await getStudentReport(studentId, { year, month });
      
      const data = res.data || res;
      setAttendanceData(data.records || []);
      
      // Calculate stats
      const records = data.records || [];
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const late = records.filter(r => r.status === 'late').length;
      const excused = records.filter(r => r.status === 'excused').length;
      
      setStats({
        present,
        absent,
        late,
        excused,
        total: records.length,
        percentage: records.length > 0 ? ((present + late) / records.length * 100).toFixed(1) : 0
      });
    } catch (err) {
      console.error('Failed to load attendance:', err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getAttendanceForDay = (day) => {
    if (!day) return null;
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceData.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === dateStr;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white';
      case 'absent':
        return isDark ? 'bg-red-600 text-white' : 'bg-red-500 text-white';
      case 'late':
        return isDark ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white';
      case 'excused':
        return isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white';
      default:
        return isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <Check size={14} />;
      case 'absent':
        return <X size={14} />;
      case 'late':
        return <Clock size={14} />;
      case 'excused':
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Present</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{stats.present}</p>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-red-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Absent</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{stats.absent}</p>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Late</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{stats.late}</p>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Excused</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stats.excused}</p>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Attendance %</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{stats.percentage}%</p>
        </div>
      </div>

      {/* Calendar */}
      <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
          >
            <ChevronLeft size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {monthName}
          </h3>
          <button
            onClick={nextMonth}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
          >
            <ChevronRight size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div
                  key={day}
                  className={`text-center text-sm font-medium py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square"></div>;
                }

                const attendance = getAttendanceForDay(day);
                const status = attendance?.status;
                const isToday = 
                  day === new Date().getDate() && 
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                      status 
                        ? getStatusColor(status)
                        : isDark ? 'bg-gray-600' : 'bg-white'
                    } ${isToday ? 'ring-2 ring-purple-500' : ''}`}
                    title={status ? `${status} on ${day}` : `No record for ${day}`}
                  >
                    <span className={`text-sm font-medium ${
                      status ? '' : isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {day}
                    </span>
                    {status && (
                      <span className="mt-0.5">
                        {getStatusIcon(status)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Excused</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
