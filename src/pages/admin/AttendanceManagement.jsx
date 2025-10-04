import React, { useEffect, useState } from "react";
import {
  listAttendance,
  markAttendance,
  deleteAttendance,
} from "../../api/attendanceApi";
import { listClasses } from "../../api/classApi";
import { listStudents } from "../../api/studentApi";
import { Toaster, toast } from "react-hot-toast";
import {
  FaUserCheck,
  FaPlus,
  FaCalendarAlt,
  FaFilter,
  FaSync,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUsers,
  FaChartBar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
} from "react-icons/fa";

// This component receives isDark as a prop - matching your AdminDashboard pattern
export default function AttendanceManagement({ isDark }) {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ classId: "", date: "" });
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const loadLookup = async () => {
    try {
      const c = await listClasses();
      setClasses(c.data || c || []);
      const sRes = await listStudents();
      setStudents(sRes.data || sRes || []);
    } catch (err) {
      console.error("lookup load failed", err);
      toast.error("Failed to load data");
    }
  };

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.classId) params.classId = filters.classId;
      if (filters.date) params.date = filters.date;
      const res = await listAttendance(params);
      setAttendance(res.data || res || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLookup();
    loadAttendance();
  }, []);

  const openMark = (att) => {
    setSelectedAttendance(att || null);
    setShowMarkModal(true);
  };

  const handleMarkSubmit = async (payload) => {
    try {
      await markAttendance(payload);
      toast.success("Attendance saved successfully");
      setShowMarkModal(false);
      await loadAttendance();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this attendance record?")) return;
    try {
      await deleteAttendance(id);
      toast.success("Deleted successfully");
      await loadAttendance();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Calculate stats
  const totalRecords = attendance.reduce((sum, a) => sum + a.records.length, 0);
  const presentCount = attendance.reduce(
    (sum, a) => sum + a.records.filter((r) => r.status === "present").length,
    0
  );
  const absentCount = attendance.reduce(
    (sum, a) => sum + a.records.filter((r) => r.status === "absent").length,
    0
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Toaster position="top-right" />

      {/* Header - Matching AcademicsManagement pattern */}
      <div
        className={`border-b shadow-sm ${
          isDark
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg">
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
                  Track and manage student attendance records
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openMark(null)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <FaPlus className="text-sm" />
                <span className="hidden sm:inline">Mark Attendance</span>
              </button>
              <button
                onClick={loadAttendance}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all duration-200 ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FaSync className={`text-sm ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">
                  {loading ? "Loading..." : "Refresh"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div
            className={`rounded-xl shadow-md p-6 border transition-all duration-200 hover:shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Records
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {totalRecords}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <FaChartBar
                  className={`text-2xl ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl shadow-md p-6 border transition-all duration-200 hover:shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Present
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {presentCount}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark ? "bg-green-900/30" : "bg-green-100"
                }`}
              >
                <FaCheckCircle
                  className={`text-2xl ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl shadow-md p-6 border transition-all duration-200 hover:shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Absent
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {absentCount}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark ? "bg-rose-900/30" : "bg-rose-100"
                }`}
              >
                <FaTimesCircle
                  className={`text-2xl ${
                    isDark ? "text-rose-400" : "text-rose-600"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`mb-6 p-6 rounded-2xl border shadow-md ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaFilter
              className={isDark ? "text-gray-400" : "text-gray-600"}
            />
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Filters
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Select Class
              </label>
              <select
                value={filters.classId}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, classId: e.target.value }))
                }
                className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="">All classes</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.grade} {c.section || c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Select Date
              </label>
              <div className="relative">
                <FaCalendarAlt
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, date: e.target.value }))
                  }
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadAttendance}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <FaFilter className="text-sm" />
                Apply
              </button>
              <button
                onClick={() => {
                  setFilters({ classId: "", date: "" });
                  loadAttendance();
                }}
                className={`px-6 py-2.5 rounded-xl border font-medium transition-all duration-200 ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div
          className={`rounded-2xl border shadow-md overflow-hidden ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`p-6 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Attendance Records
            </h3>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              View and manage all attendance entries
            </p>
          </div>

          {attendance.length === 0 ? (
            <div className="p-16 text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FaUserCheck
                  className={`text-2xl ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                No attendance records found
              </h3>
              <p
                className={`mb-6 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Start by marking attendance for your classes
              </p>
              <button
                onClick={() => openMark(null)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-md transition-all duration-200"
              >
                <FaPlus />
                Mark Attendance
              </button>
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
                      Date
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Class
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Students
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Status
                    </th>
                    <th
                      className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Actions
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
                  {attendance.map((a) => {
                    const present = a.records.filter(
                      (r) => r.status === "present"
                    ).length;
                    const absent = a.records.filter(
                      (r) => r.status === "absent"
                    ).length;

                    return (
                      <tr
                        key={a._id}
                        className={`transition-colors duration-150 ${
                          isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt
                              className={
                                isDark ? "text-gray-500" : "text-gray-400"
                              }
                            />
                            <span
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {new Date(a.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                isDark ? "bg-purple-900/30" : "bg-purple-100"
                              }`}
                            >
                              <FaUsers
                                className={
                                  isDark ? "text-purple-400" : "text-purple-600"
                                }
                              />
                            </div>
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {a.classId
                                ? `${a.classId.grade} ${
                                    a.classId.section || ""
                                  }`
                                : "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                              isDark
                                ? "text-blue-400 bg-blue-900/30"
                                : "text-blue-700 bg-blue-100"
                            }`}
                          >
                            {a.records.length} students
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                isDark
                                  ? "text-green-400 bg-green-900/30"
                                  : "text-green-700 bg-green-100"
                              }`}
                            >
                              <FaCheckCircle /> {present}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                isDark
                                  ? "text-rose-400 bg-rose-900/30"
                                  : "text-rose-700 bg-rose-100"
                              }`}
                            >
                              <FaTimesCircle /> {absent}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openMark(a)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isDark
                                  ? "text-blue-400 hover:bg-blue-900/20"
                                  : "text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              <FaEdit />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(a._id)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isDark
                                  ? "text-rose-400 hover:bg-rose-900/20"
                                  : "text-rose-600 hover:bg-rose-50"
                              }`}
                            >
                              <FaTrash />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mark Modal */}
      {showMarkModal && (
        <MarkModal
          isOpen={showMarkModal}
          onClose={() => setShowMarkModal(false)}
          attendance={selectedAttendance}
          students={students}
          classes={classes}
          onSubmit={handleMarkSubmit}
          isDark={isDark}
        />
      )}
    </div>
  );
}

// Enhanced MarkModal component - also receives isDark as prop
function MarkModal({
  isOpen,
  onClose,
  attendance,
  students,
  classes,
  onSubmit,
  isDark,
}) {
  const [classId, setClassId] = useState(attendance?.classId?._id || "");
  const [date, setDate] = useState(
    attendance
      ? new Date(attendance.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [records, setRecords] = useState(() => {
    if (attendance && attendance.records) {
      return attendance.records.map((r) => ({
        studentId: r.student?._id || r.student,
        status: r.status,
        remark: r.remark || "",
      }));
    }
    return students.slice(0, 50).map((s) => ({
      studentId: s._id,
      status: "present",
      remark: "",
    }));
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!attendance && students.length) {
      setRecords(
        students.slice(0, 50).map((s) => ({
          studentId: s._id,
          status: "present",
          remark: "",
        }))
      );
    }
  }, [attendance, students]);

  const toggleStatus = (i, value) => {
    setRecords((rs) => {
      const copy = [...rs];
      copy[i].status = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId) {
      toast.error("Please select a class");
      return;
    }
    await onSubmit({ classId, date, records });
  };

  const filteredRecords = records.filter((r, i) => {
    const student = students.find((s) => s._id === r.studentId);
    const matchesSearch =
      !searchTerm ||
      student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className={`rounded-2xl max-w-4xl w-full shadow-2xl border overflow-hidden ${
          isDark
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-6 border-b ${
            isDark
              ? "border-gray-700 bg-gradient-to-r from-green-900/20 to-emerald-900/20"
              : "border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                <FaUserCheck className="text-white text-xl" />
              </div>
              <div>
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Mark Attendance
                </h3>
                <p
                  className={`text-sm mt-0.5 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {attendance ? "Edit existing record" : "Create new record"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Class and Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Select Class
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
                className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.grade} {c.section || c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-green-900/20 border-green-800"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaCheckCircle
                  className={isDark ? "text-green-400" : "text-green-600"}
                />
                <div>
                  <p
                    className={`text-xs font-medium ${
                      isDark ? "text-green-400" : "text-green-700"
                    }`}
                  >
                    Present
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-green-300" : "text-green-800"
                    }`}
                  >
                    {presentCount}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-rose-900/20 border-rose-800"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaTimesCircle
                  className={isDark ? "text-rose-400" : "text-rose-600"}
                />
                <div>
                  <p
                    className={`text-xs font-medium ${
                      isDark ? "text-rose-400" : "text-rose-700"
                    }`}
                  >
                    Absent
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-rose-300" : "text-rose-800"
                    }`}
                  >
                    {absentCount}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-amber-900/20 border-amber-800"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaClock
                  className={isDark ? "text-amber-400" : "text-amber-600"}
                />
                <div>
                  <p
                    className={`text-xs font-medium ${
                      isDark ? "text-amber-400" : "text-amber-700"
                    }`}
                  >
                    Late
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-amber-300" : "text-amber-800"
                    }`}
                  >
                    {lateCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          {/* Students List */}
          <div
            className={`max-h-96 overflow-y-auto border rounded-xl p-4 space-y-2 ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {filteredRecords.map((r, i) => {
              const student = students.find((s) => s._id === r.studentId);
              const originalIndex = records.findIndex(
                (rec) => rec.studentId === r.studentId
              );

              return (
                <div
                  key={r.studentId}
                  className={`flex items-center justify-between gap-4 p-3 rounded-lg transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700/50 hover:bg-gray-700"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        isDark
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {student?.fullName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <div
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student?.fullName || "Student"}
                      </div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Roll No: {student?.rollNumber || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        toggleStatus(originalIndex, e.target.value)
                      }
                      className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500 ${
                        r.status === "present"
                          ? isDark
                            ? "bg-green-900/30 border-green-700 text-green-400"
                            : "bg-green-50 border-green-300 text-green-700"
                          : r.status === "absent"
                          ? isDark
                            ? "bg-rose-900/30 border-rose-700 text-rose-400"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : isDark
                          ? "bg-amber-900/30 border-amber-700 text-amber-400"
                          : "bg-amber-50 border-amber-300 text-amber-700"
                      }`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Actions */}
          <div
            className={`flex justify-end gap-3 pt-4 border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl border font-medium transition-all duration-200 ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <FaUserCheck />
              Save Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
