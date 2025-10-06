
import React, { useEffect, useState } from "react";
import { 
  markAttendance, 
  markAllPresent, 
  copyFromPreviousDay,
  listAttendance, 
  getClassReport,
  getStudentReport,
  deleteAttendance,
  updateAttendanceRecord
} from "../../api/attendanceApi";
import { listClasses } from "../../api/classApi";
import { listStudents } from "../../api/studentApi";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import {
  FaUserCheck,
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDownload,
  FaChartBar,
  FaSearch,
  FaFilter,
  FaUserSlash,
  FaUndoAlt,
  FaCopy,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaUserClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// Status configurations
const STATUS_CONFIG = {
  present: {
    label: "Present",
    icon: FaCheckCircle,
    color: "green",
    lightClass: "bg-green-100 text-green-700 border-green-200",
    darkClass: "bg-green-900/30 text-green-400 border-green-800",
    buttonLight: "bg-green-500 hover:bg-green-600",
    buttonDark: "bg-green-600 hover:bg-green-700"
  },
  absent: {
    label: "Absent",
    icon: FaTimesCircle,
    color: "red",
    lightClass: "bg-red-100 text-red-700 border-red-200",
    darkClass: "bg-red-900/30 text-red-400 border-red-800",
    buttonLight: "bg-red-500 hover:bg-red-600",
    buttonDark: "bg-red-600 hover:bg-red-700"
  },
  late: {
    label: "Late",
    icon: FaClock,
    color: "yellow",
    lightClass: "bg-yellow-100 text-yellow-700 border-yellow-200",
    darkClass: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
    buttonLight: "bg-yellow-500 hover:bg-yellow-600",
    buttonDark: "bg-yellow-600 hover:bg-yellow-700"
  },
  "half-day": {
    label: "Half Day",
    icon: FaUserClock,
    color: "blue",
    lightClass: "bg-blue-100 text-blue-700 border-blue-200",
    darkClass: "bg-blue-900/30 text-blue-400 border-blue-800",
    buttonLight: "bg-blue-500 hover:bg-blue-600",
    buttonDark: "bg-blue-600 hover:bg-blue-700"
  },
  excused: {
    label: "Excused",
    icon: FaExclamationTriangle,
    color: "purple",
    lightClass: "bg-purple-100 text-purple-700 border-purple-200",
    darkClass: "bg-purple-900/30 text-purple-400 border-purple-800",
    buttonLight: "bg-purple-500 hover:bg-purple-600",
    buttonDark: "bg-purple-600 hover:bg-purple-700"
  },
  leave: {
    label: "Leave",
    icon: FaUserSlash,
    color: "gray",
    lightClass: "bg-gray-100 text-gray-700 border-gray-200",
    darkClass: "bg-gray-900/30 text-gray-400 border-gray-800",
    buttonLight: "bg-gray-500 hover:bg-gray-600",
    buttonDark: "bg-gray-600 hover:bg-gray-700"
  }
};

export default function AttendanceManagement({ isDark }) {
  const { role } = useAuth();
  const [view, setView] = useState("mark"); // mark, history, reports
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [classReport, setClassReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Get today's date as max date
  const today = new Date().toISOString().split("T")[0];

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await listClasses();
        const data = res.data.data || res;
        setClasses(data);
        if (data.length > 0) {
          setSelectedClass(data[0]._id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await listStudents({ class: selectedClass });
      const data = res.data || res;
      const activeStudents = data.filter(s => s.status === "active" || !s.status);
      setStudents(activeStudents);
      
      // Initialize attendance state with "present" as default
      const initialAttendance = {};
      activeStudents.forEach(student => {
        initialAttendance[student._id] = "present";
      });
      setAttendance(initialAttendance);
      
      // Check if attendance already exists for this date
      if (selectedDate) {
        await fetchExistingAttendance();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const res = await listAttendance({
        classId: selectedClass,
        date: selectedDate
      });
      
      const data = res.data || [];
      if (data.length > 0 && data[0].records) {
        const existingAttendance = {};
        const existingRemarks = {};
        
        data[0].records.forEach(record => {
          existingAttendance[record.student._id || record.student] = record.status;
          if (record.remark) {
            existingRemarks[record.student._id || record.student] = record.remark;
          }
        });
        
        setAttendance(existingAttendance);
        setRemarks(existingRemarks);
        toast.success("Loaded existing attendance");
      }
    } catch (err) {
      console.error(err);
      // Don't show error, just means no attendance exists yet
    }
  };

  // Handle attendance status change
  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Handle remark change
  const handleRemarkChange = (studentId, remark) => {
    setRemarks(prev => ({
      ...prev,
      [studentId]: remark
    }));
  };

  // Mark all present
  const handleMarkAllPresent = async () => {
    try {
      setSaving(true);
      await markAllPresent({
        classId: selectedClass,
        date: selectedDate
      });
      toast.success("All students marked present");
      await fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to mark all present");
    } finally {
      setSaving(false);
    }
  };

  // Mark all absent
  const handleMarkAllAbsent = () => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student._id] = "absent";
    });
    setAttendance(newAttendance);
    toast.success("All students marked absent (not saved yet)");
  };

  // Copy from previous day
  const handleCopyPrevious = async () => {
    try {
      setSaving(true);
      await copyFromPreviousDay({
        classId: selectedClass,
        date: selectedDate
      });
      toast.success("Copied attendance from previous day");
      await fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to copy attendance");
    } finally {
      setSaving(false);
    }
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error("Please select class and date");
      return;
    }

    // Validate date is not in future
    if (selectedDate > today) {
      toast.error("Cannot mark attendance for future dates");
      return;
    }

    try {
      setSaving(true);
      
      const records = students.map(student => ({
        studentId: student._id,
        status: attendance[student._id] || "present",
        remark: remarks[student._id] || "",
        checkInTime: attendance[student._id] === "present" || attendance[student._id] === "late" 
          ? new Date().toISOString() 
          : null
      }));

      await markAttendance({
        classId: selectedClass,
        date: selectedDate,
        records,
        session: "full-day"
      });

      toast.success("Attendance saved successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // Generate class report
  const handleGenerateReport = async () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    try {
      setLoading(true);
      
      // Get last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const res = await getClassReport(selectedClass, {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0]
      });
      
      setClassReport(res.data);
      setShowReportModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (!classReport || !classReport.students) {
      toast.error("No report data to export");
      return;
    }

    try {
      const exportData = classReport.students.map(student => ({
        "Roll Number": student.rollNumber,
        "Student Name": student.fullName,
        "Total Days": student.total,
        "Present": student.present,
        "Absent": student.absent,
        "Late": student.late,
        "Half Day": student.halfDay || 0,
        "Attendance %": student.percentage + "%"
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws["!cols"] = [
        { wch: 12 },
        { wch: 25 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

      const selectedClassName = classes.find(c => c._id === selectedClass)?.name || "Class";
      const filename = `Attendance_Report_${selectedClassName}_${new Date().toISOString().split("T")[0]}.xlsx`;

      XLSX.writeFile(wb, filename);
      toast.success("Report exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export report");
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.present;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${
          isDark ? config.darkClass : config.lightClass
        }`}
      >
        <Icon className="text-sm" />
        {config.label}
      </span>
    );
  };

  // Filter students
  const filteredStudents = students.filter(student =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: students.length,
    present: Object.values(attendance).filter(s => s === "present").length,
    absent: Object.values(attendance).filter(s => s === "absent").length,
    late: Object.values(attendance).filter(s => s === "late").length,
    halfDay: Object.values(attendance).filter(s => s === "half-day").length,
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b shadow-sm ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <FaUserCheck className="text-white text-2xl" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Attendance Management
                </h1>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Mark and track student attendance
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setView("mark")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === "mark"
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Mark Attendance
              </button>
              <button
                onClick={() => setView("reports")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === "reports"
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaChartBar className="inline mr-2" />
                Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {view === "mark" && (
          <>
            {/* Controls */}
            <div
              className={`mb-6 p-6 rounded-2xl border shadow-md ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Class Selector */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <FaUsers className="inline mr-2" />
                    Select Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name || `${cls.grade} - ${cls.section}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selector */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <FaCalendarAlt className="inline mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    max={today}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>

                {/* Search */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <FaSearch className="inline mr-2" />
                    Search Student
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or roll number..."
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={handleMarkAllPresent}
                  disabled={!selectedClass || saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCheckCircle />
                  Mark All Present
                </button>
                <button
                  onClick={handleMarkAllAbsent}
                  disabled={!selectedClass}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimesCircle />
                  Mark All Absent
                </button>
                <button
                  onClick={handleCopyPrevious}
                  disabled={!selectedClass || saving}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCopy />
                  Copy Previous Day
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            {selectedClass && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {stats.total}
                    </div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Total
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border border-green-200 ${
                    isDark ? "bg-green-900/20" : "bg-green-50"
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-700"}`}>
                      {stats.present}
                    </div>
                    <div className={`text-sm ${isDark ? "text-green-400" : "text-green-600"}`}>
                      Present
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border border-red-200 ${
                    isDark ? "bg-red-900/20" : "bg-red-50"
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDark ? "text-red-400" : "text-red-700"}`}>
                      {stats.absent}
                    </div>
                    <div className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
                      Absent
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border border-yellow-200 ${
                    isDark ? "bg-yellow-900/20" : "bg-yellow-50"
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDark ? "text-yellow-400" : "text-yellow-700"}`}>
                      {stats.late}
                    </div>
                    <div className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                      Late
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border border-blue-200 ${
                    isDark ? "bg-blue-900/20" : "bg-blue-50"
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                      {stats.halfDay}
                    </div>
                    <div className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                      Half Day
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Student List */}
            <div
              className={`rounded-2xl border shadow-md overflow-hidden ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`p-6 border-b flex justify-between items-center ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Students ({filteredStudents.length})
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Mark attendance for each student
                  </p>
                </div>
                <button
                  onClick={handleSaveAttendance}
                  disabled={!selectedClass || saving}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-md transition-all ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  }`}
                >
                  <FaSave />
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>

              {loading ? (
                <div className="p-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p
                    className={`mt-4 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Loading students...
                  </p>
                </div>
              ) : !selectedClass ? (
                <div className="p-16 text-center">
                  <FaUsers
                    className={`mx-auto text-5xl mb-4 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Please select a class to mark attendance
                  </p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-16 text-center">
                  <p
                    className={`text-lg ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No students found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table
                    className={`min-w-full divide-y ${
                      isDark ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    <thead className={isDark ? "bg-gray-900/50" : "bg-gray-50"}>
                      <tr>
                        <th
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Roll No.
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Student Name
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Status
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Remark
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDark
                          ? "bg-gray-800 divide-gray-700"
                          : "bg-white divide-gray-200"
                      }`}
                    >
                      {filteredStudents.map((student) => (
                        <tr
                          key={student._id}
                          className={`transition-colors ${
                            isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {student.rollNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                  isDark
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {student.fullName?.charAt(0) || "?"}
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {student.fullName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 flex-wrap">
                              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(student._id, status)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    attendance[student._id] === status
                                      ? `text-white ${isDark ? config.buttonDark : config.buttonLight}`
                                      : isDark
                                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  {config.label}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={remarks[student._id] || ""}
                              onChange={(e) =>
                                handleRemarkChange(student._id, e.target.value)
                              }
                              placeholder="Add remark..."
                              className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                                isDark
                                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                              }`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {view === "reports" && (
          <div
            className={`rounded-2xl border shadow-md p-6 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Attendance Reports
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  View detailed attendance statistics
                </p>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={!selectedClass || loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChartBar />
                Generate Report
              </button>
            </div>

            {/* Class selector for reports */}
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={`w-full md:w-1/3 px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name || `${cls.grade} - ${cls.section}`}
                  </option>
                ))}
              </select>
            </div>

            {!selectedClass ? (
              <div className="text-center py-16">
                <FaChartBar
                  className={`mx-auto text-5xl mb-4 ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-lg ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Select a class and generate report to view statistics
                </p>
              </div>
            ) : (
              <div className="text-center py-16">
                <p
                  className={`text-lg ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Click "Generate Report" to view attendance statistics for the last 30 days
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && classReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            className={`rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"
                  : "border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Attendance Report (Last 30 Days)
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {classes.find(c => c._id === selectedClass)?.name || "Class Report"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                  >
                    <FaDownload />
                    Export Excel
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Class Statistics */}
              {classReport.classStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div
                    className={`p-4 rounded-xl border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {classReport.classStats.totalDays}
                      </div>
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Total Days
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-xl border border-green-200 ${
                      isDark ? "bg-green-900/20" : "bg-green-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-700"}`}>
                        {classReport.classStats.totalPresent}
                      </div>
                      <div className={`text-sm ${isDark ? "text-green-400" : "text-green-600"}`}>
                        Total Present
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-xl border border-red-200 ${
                      isDark ? "bg-red-900/20" : "bg-red-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDark ? "text-red-400" : "text-red-700"}`}>
                        {classReport.classStats.totalAbsent}
                      </div>
                      <div className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
                        Total Absent
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-xl border border-yellow-200 ${
                      isDark ? "bg-yellow-900/20" : "bg-yellow-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDark ? "text-yellow-400" : "text-yellow-700"}`}>
                        {classReport.classStats.totalLate}
                      </div>
                      <div className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                        Total Late
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Student-wise Report */}
              <div className="overflow-x-auto">
                <table
                  className={`min-w-full divide-y ${
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  <thead className={isDark ? "bg-gray-900/50" : "bg-gray-50"}>
                    <tr>
                      <th
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Roll No.
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Student Name
                      </th>
                      <th
                        className={`px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Total
                      </th>
                      <th
                        className={`px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Present
                      </th>
                      <th
                        className={`px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Absent
                      </th>
                      <th
                        className={`px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Late
                      </th>
                      <th
                        className={`px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDark
                        ? "bg-gray-800 divide-gray-700"
                        : "bg-white divide-gray-200"
                    }`}
                  >
                    {classReport.students.map((student) => (
                      <tr key={student.studentId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {student.rollNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {student.fullName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {student.total}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-green-600 font-semibold">
                            {student.present}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-red-600 font-semibold">
                            {student.absent}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-yellow-600 font-semibold">
                            {student.late}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                              student.percentage >= 75
                                ? "bg-green-100 text-green-700"
                                : student.percentage >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
