// ============================================
// ATTENDANCE MANAGEMENT - ENHANCED VERSION
// With tabs for Today, History, and Reports
// ============================================

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useTheme from '../../context/ThemeContext';
import { listClasses } from '../../api/classApi';
import { listStudents } from '../../api/studentApi';
import { 
  markAttendance, 
  markAllPresent, 
  listAttendance,
  getClassReport,
  getMonthlyStats 
} from '../../api/attendanceApi';
import { exportAttendance } from '../../utils/excelExport';

// Components
import AttendanceStats from '../../components/admin/attendance/AttendanceStats';
import AttendanceFilters from '../../components/admin/attendance/AttendanceFilters';
import AttendanceTable from '../../components/admin/attendance/AttendanceTable';

import { 
  Calendar,
  CheckCircle,
  Save,
  Download,
  History,
  BarChart3,
  Users,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const TABS = [
  { id: 'today', label: "Today's Attendance", icon: Calendar },
  { id: 'history', label: 'Past Records', icon: History },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export default function AttendanceManagement() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('today');

  // Common State
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  // Today's Attendance State
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);

  // History State
  const [historyData, setHistoryData] = useState([]);
  const [historyMonth, setHistoryMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [historyPage, setHistoryPage] = useState(1);

  // Reports State
  const [reportData, setReportData] = useState(null);
  const [reportMonth, setReportMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

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

  // ============================================
  // TODAY'S ATTENDANCE FUNCTIONS
  // ============================================
  const handleLoadAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select class and date');
      return;
    }

    setLoading(true);
    try {
      const studentsRes = await listStudents({ class: selectedClass });
      const studentsList = studentsRes.data || [];
      setStudents(studentsList);

      const attendanceRes = await listAttendance({ 
        classId: selectedClass, 
        date: selectedDate 
      });

      const existingAttendance = attendanceRes.data?.[0];
      const map = {};
      
      if (existingAttendance?.records) {
        existingAttendance.records.forEach(record => {
          map[record.student._id || record.student] = record.status;
        });
      }

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

  const calculateStats = (map) => {
    const values = Object.values(map);
    setStats({
      totalStudents: values.length,
      presentCount: values.filter(s => s === 'present').length,
      absentCount: values.filter(s => s === 'absent').length,
      lateCount: values.filter(s => s === 'late').length,
    });
  };

  const handleStatusChange = (studentId, status) => {
    const newMap = { ...attendanceMap, [studentId]: status };
    setAttendanceMap(newMap);
    calculateStats(newMap);
  };

  const handleMarkAllPresent = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select class and date');
      return;
    }

    try {
      await markAllPresent({ classId: selectedClass, date: selectedDate });
      const newMap = {};
      students.forEach(student => { newMap[student._id] = 'present'; });
      setAttendanceMap(newMap);
      calculateStats(newMap);
      toast.success('All students marked present');
    } catch (err) {
      toast.error('Failed to mark all present');
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate || students.length === 0) {
      toast.error('Please load students first');
      return;
    }

    setSaving(true);
    try {
      const records = students.map(student => ({
        studentId: student._id,
        status: attendanceMap[student._id] || 'present'
      }));

      await markAttendance({ classId: selectedClass, date: selectedDate, records });
      toast.success('Attendance saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // HISTORY FUNCTIONS
  // ============================================
  const loadHistory = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    setLoading(true);
    try {
      const [year, month] = historyMonth.split('-');
      const startDate = `${year}-${month}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const res = await listAttendance({
        classId: selectedClass,
        startDate,
        endDate,
        page: historyPage,
        limit: 10
      });

      setHistoryData(res.data || []);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // REPORTS FUNCTIONS
  // ============================================
  const loadReport = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    setLoading(true);
    try {
      const [year, month] = reportMonth.split('-');
      const res = await getClassReport(selectedClass, { year, month });
      setReportData(res.data);
    } catch (err) {
      toast.error('Failed to load report');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================
  const handleExportToday = () => {
    if (students.length === 0) {
      toast.error('No data to export');
      return;
    }

    const data = students.map(s => ({
      name: s.fullName,
      rollNumber: s.rollNumber,
      class: s.class?.name || '',
      status: attendanceMap[s._id] || 'N/A',
      date: selectedDate
    }));

    exportAttendance(data);
    toast.success('Exported to Excel');
  };

  const handleExportHistory = () => {
    if (historyData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const flatData = [];
    historyData.forEach(day => {
      (day.records || []).forEach(record => {
        flatData.push({
          date: new Date(day.date).toLocaleDateString(),
          name: record.student?.fullName || 'Unknown',
          rollNumber: record.student?.rollNumber || '',
          status: record.status
        });
      });
    });

    exportAttendance(flatData);
    toast.success('Exported to Excel');
  };

  // Get selected class name
  const selectedClassName = classes.find(c => c._id === selectedClass)?.name || '';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b shadow-sm ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Attendance Management
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Mark, track, and analyze student attendance
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : isDark
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* ============================================ */}
        {/* TODAY'S ATTENDANCE TAB */}
        {/* ============================================ */}
        {activeTab === 'today' && (
          <>
            {stats && <AttendanceStats stats={stats} isDark={isDark} />}

            <div className={`rounded-xl shadow-md border overflow-hidden mt-6 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <AttendanceFilters
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                classes={classes}
                onSearch={handleLoadAttendance}
                isDark={isDark}
              />

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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isDark ? 'text-green-400 hover:bg-green-900/20' : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <CheckCircle size={18} />
                      Mark All Present
                    </button>
                    <button
                      onClick={handleExportToday}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Download size={18} />
                      Export
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : (
                <AttendanceTable
                  students={students}
                  attendanceMap={attendanceMap}
                  onStatusChange={handleStatusChange}
                  isDark={isDark}
                />
              )}

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
                        <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Attendance
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ============================================ */}
        {/* HISTORY TAB */}
        {/* ============================================ */}
        {activeTab === 'history' && (
          <div className={`rounded-xl shadow-md border overflow-hidden ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            {/* Filters */}
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name || `${c.grade}-${c.section}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Month
                  </label>
                  <input
                    type="month"
                    value={historyMonth}
                    onChange={(e) => setHistoryMonth(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <button
                  onClick={loadHistory}
                  className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Load History
                </button>
                <button
                  onClick={handleExportHistory}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                    isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>

            {/* History List */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            ) : historyData.length === 0 ? (
              <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <History size={48} className="mx-auto mb-4 opacity-50" />
                <p>No attendance records found</p>
                <p className="text-sm mt-1">Select a class and month, then click Load History</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {historyData.map((day, idx) => (
                  <div key={idx} className={`p-4 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <Calendar size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        </div>
                        <div>
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(day.date).toLocaleDateString('en-US', { 
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {day.records?.length || 0} students
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-500">
                          ✓ {day.records?.filter(r => r.status === 'present').length || 0} Present
                        </span>
                        <span className="text-red-500">
                          ✗ {day.records?.filter(r => r.status === 'absent').length || 0} Absent
                        </span>
                        <span className="text-yellow-500">
                          ⏱ {day.records?.filter(r => r.status === 'late').length || 0} Late
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* REPORTS TAB */}
        {/* ============================================ */}
        {activeTab === 'reports' && (
          <div className={`rounded-xl shadow-md border overflow-hidden ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            {/* Filters */}
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name || `${c.grade}-${c.section}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Month
                  </label>
                  <input
                    type="month"
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <button
                  onClick={loadReport}
                  className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Generate Report
                </button>
              </div>
            </div>

            {/* Report Content */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            ) : !reportData ? (
              <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p>No report generated</p>
                <p className="text-sm mt-1">Select a class and month, then click Generate Report</p>
              </div>
            ) : (
              <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Days</div>
                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {reportData.totalDays || 0}
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
                    <div className="text-sm text-green-600">Avg. Attendance</div>
                    <div className="text-2xl font-bold text-green-600">
                      {reportData.averageAttendance || 0}%
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
                    <div className="text-sm text-red-600">Total Absents</div>
                    <div className="text-2xl font-bold text-red-600">
                      {reportData.totalAbsents || 0}
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                    <div className="text-sm text-yellow-600">Total Late</div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {reportData.totalLate || 0}
                    </div>
                  </div>
                </div>

                {/* Student-wise Report */}
                {reportData.students && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Student-wise Attendance
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                            <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Student
                            </th>
                            <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Present
                            </th>
                            <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Absent
                            </th>
                            <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Late
                            </th>
                            <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Percentage
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                          {reportData.students.map((student, idx) => (
                            <tr key={idx} className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                              <td className={`px-4 py-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {student.name}
                              </td>
                              <td className="px-4 py-3 text-center text-green-500">
                                {student.present}
                              </td>
                              <td className="px-4 py-3 text-center text-red-500">
                                {student.absent}
                              </td>
                              <td className="px-4 py-3 text-center text-yellow-500">
                                {student.late}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                  student.percentage >= 75
                                    ? 'bg-green-100 text-green-700'
                                    : student.percentage >= 50
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {student.percentage}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
