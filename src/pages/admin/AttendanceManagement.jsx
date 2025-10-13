// ============================================
// ATTENDANCE MANAGEMENT - MAIN PAGE
// Orchestrates all attendance components
// ============================================

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useTheme from '../../context/ThemeContext';
import { listClasses } from '../../api/classApi';
import { listStudents } from '../../api/studentApi';
import { markAttendance, markAllPresent, listAttendance } from '../../api/attendanceApi';

// Components
import AttendanceStats from '../../components/admin/attendance/AttendanceStats';
import AttendanceFilters from '../../components/admin/attendance/AttendanceFilters';
import AttendanceTable from '../../components/admin/attendance/AttendanceTable';

import { 
  FaUserClock, 
  FaSave, 
  FaCheckCircle,
  FaCopy 
} from 'react-icons/fa';

export default function AttendanceManagement() {
  const { isDark } = useTheme();

  // State
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);

  // Load classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await listClasses();
      setClasses(response.data.data || []);
    } catch (err) {
      console.error('Failed to load classes:', err);
      toast.error('Failed to load classes');
    }
  };

  // Load students and attendance when class/date changes
  const handleLoadAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select class and date');
      return;
    }

    setLoading(true);
    try {
      // Fetch students
      const studentsRes = await listStudents({ class: selectedClass });
      const studentsList = studentsRes.data || [];
      setStudents(studentsList);

      // Fetch existing attendance
      const attendanceRes = await listAttendance({ 
        classId: selectedClass, 
        date: selectedDate 
      });

      const existingAttendance = attendanceRes.data?.[0];

      // Build attendance map
      const map = {};
      if (existingAttendance?.records) {
        existingAttendance.records.forEach(record => {
          map[record.student._id || record.student] = record.status;
        });
      }

      // Default all to present if no existing data
      studentsList.forEach(student => {
        if (!map[student._id]) {
          map[student._id] = 'present';
        }
      });

      setAttendanceMap(map);
      calculateStats(map);

      toast.success(`Loaded ${studentsList.length} students`);
    } catch (err) {
      console.error('Failed to load attendance:', err);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateStats = (map) => {
    const values = Object.values(map);
    setStats({
      totalStudents: values.length,
      presentCount: values.filter(s => s === 'present').length,
      absentCount: values.filter(s => s === 'absent').length,
      lateCount: values.filter(s => s === 'late').length,
    });
  };

  // Update attendance status
  const handleStatusChange = (studentId, status) => {
    const newMap = { ...attendanceMap, [studentId]: status };
    setAttendanceMap(newMap);
    calculateStats(newMap);
  };

  // Mark all present
  const handleMarkAllPresent = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select class and date');
      return;
    }

    try {
      await markAllPresent({
        classId: selectedClass,
        date: selectedDate
      });

      const newMap = {};
      students.forEach(student => {
        newMap[student._id] = 'present';
      });
      setAttendanceMap(newMap);
      calculateStats(newMap);

      toast.success('All students marked present');
    } catch (err) {
      console.error('Failed to mark all present:', err);
      toast.error('Failed to mark all present');
    }
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select class and date');
      return;
    }

    if (students.length === 0) {
      toast.error('No students to mark attendance for');
      return;
    }

    setSaving(true);
    try {
      const records = students.map(student => ({
        studentId: student._id,
        status: attendanceMap[student._id] || 'present'
      }));

      await markAttendance({
        classId: selectedClass,
        date: selectedDate,
        records
      });

      toast.success('Attendance saved successfully');
    } catch (err) {
      console.error('Failed to save attendance:', err);
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b shadow-sm ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <FaUserClock className="text-white text-2xl" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Attendance Management
              </h1>
              <p className={`mt-1 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Mark and track student attendance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        {stats && <AttendanceStats stats={stats} isDark={isDark} />}

        {/* Main Card */}
        <div className={`rounded-xl shadow-md border overflow-hidden ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          {/* Filters */}
          <AttendanceFilters
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            classes={classes}
            onSearch={handleLoadAttendance}
            isDark={isDark}
          />

          {/* Quick Actions */}
          {students.length > 0 && (
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {students.length} students loaded
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleMarkAllPresent}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isDark 
                      ? 'text-green-400 hover:bg-green-900/20' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  <FaCheckCircle />
                  Mark All Present
                </button>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <AttendanceTable
              students={students}
              attendanceMap={attendanceMap}
              onStatusChange={handleStatusChange}
              isDark={isDark}
            />
          )}

          {/* Save Button */}
          {students.length > 0 && (
            <div className={`p-6 border-t flex justify-end ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={handleSaveAttendance}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
