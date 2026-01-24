import React, { useEffect, useState } from "react";
import {
  listTimetableForClass,
  createTimetable,
  deleteEntry,
  updateEntry,
} from "../../api/timetableApi";
import { listSubjects } from "../../api/subjectApi";
import { listClasses } from "../../api/classApi";
import { listTeachers } from "../../api/teacherApi";
import { toast } from "react-hot-toast";
import {
  FaCalendarWeek,
  FaPlus,
  FaTimes,
  FaTrash,
  FaClock,
  FaBook,
  FaSearch,
  FaTable,
  FaUserTie,
  FaGraduationCap,
  FaEdit,
  FaSave,
} from "react-icons/fa";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_COLORS = {
  Monday: {
    light: "bg-blue-100 text-blue-700 border-blue-200",
    dark: "bg-blue-900/30 text-blue-400 border-blue-800",
  },
  Tuesday: {
    light: "bg-purple-100 text-purple-700 border-purple-200",
    dark: "bg-purple-900/30 text-purple-400 border-purple-800",
  },
  Wednesday: {
    light: "bg-green-100 text-green-700 border-green-200",
    dark: "bg-green-900/30 text-green-400 border-green-800",
  },
  Thursday: {
    light: "bg-amber-100 text-amber-700 border-amber-200",
    dark: "bg-amber-900/30 text-amber-400 border-amber-800",
  },
  Friday: {
    light: "bg-rose-100 text-rose-700 border-rose-200",
    dark: "bg-rose-900/30 text-rose-400 border-rose-800",
  },
};

// Predefined time slots
const TIME_SLOTS = [
  { period: 1, start: "08:00", end: "08:45" },
  { period: 2, start: "08:45", end: "09:30" },
  { period: 3, start: "09:30", end: "10:15" },
  { period: 4, start: "10:35", end: "11:20" }, // Break after period 3
  { period: 5, start: "11:20", end: "12:05" },
  { period: 6, start: "12:05", end: "12:50" },
  { period: 7, start: "13:35", end: "14:20" }, // Lunch break
  { period: 8, start: "14:20", end: "15:05" },
];

export default function TimetableManagement({ isDark }) {
  const [classId, setClassId] = useState("");
  const [entries, setEntries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    day: "Monday",
    period: 1,
    subjectId: "",
    teacherId: "",
    startTime: "08:00",
    endTime: "08:45",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load subjects
        const subjectsRes = await listSubjects();
        const subjectsData = subjectsRes?.data?.data || subjectsRes?.data || subjectsRes || [];
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);

        // Load classes
        const classesRes = await listClasses();
        const classesData = classesRes?.data?.data || classesRes?.data || classesRes || [];
        setClasses(Array.isArray(classesData) ? classesData : []);

        // Load teachers
        const teachersRes = await listTeachers();
        const teachersData = teachersRes?.data?.data || teachersRes?.data || teachersRes || [];
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
      } catch (e) {
        console.error("Data load error:", e);
        toast.error("Failed to load data");
      }
    };
    loadInitialData();
  }, []);

  // Update time slots when period changes
  useEffect(() => {
    const slot = TIME_SLOTS.find((s) => s.period === form.period);
    if (slot) {
      setForm((f) => ({ ...f, startTime: slot.start, endTime: slot.end }));
    }
  }, [form.period]);

  const load = async () => {
    if (!classId) {
      toast.error("Please select a class");
      return;
    }
    setLoading(true);
    try {
      const res = await listTimetableForClass(classId);
      const data = res.data?.data || res.data || res || [];
      setEntries(Array.isArray(data) ? data : []);
      const cls = classes.find((c) => c._id === classId);
      setSelectedClass(cls);
      toast.success("Timetable loaded successfully");
    } catch (e) {
      console.error("Load error:", e);
      toast.error(e.response?.data?.message || "Failed to load timetable");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Add to your frontend state
  const [conflicts, setConflicts] = useState([]);

  // Enhance handleSubmit with conflict detection
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId) {
      toast.error("Please select a class first");
      return;
    }

    if (!form.subjectId || !form.teacherId) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate time range on frontend too
    if (form.startTime >= form.endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        classId,
        period: Number(form.period),
      };

      if (editingId) {
        await updateEntry(editingId, payload);
        toast.success("Entry updated successfully");
        setEditingId(null);
      } else {
        await createTimetable(payload);
        toast.success("Entry added successfully");
      }

      setShowForm(false);
      setForm({
        day: "Monday",
        period: 1,
        subjectId: "",
        teacherId: "",
        startTime: "08:00",
        endTime: "08:45",
      });
      load();
    } catch (e) {
      console.error("Submit error:", e);
      const errorMsg =
        e.response?.data?.message || e.message || "Operation failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setForm({
      day: entry.day,
      period: entry.period,
      subjectId:
        typeof entry.subjectId === "object"
          ? entry.subjectId._id
          : entry.subjectId,
      teacherId:
        typeof entry.teacherId === "object"
          ? entry.teacherId._id
          : entry.teacherId,
      startTime: entry.startTime || "08:00",
      endTime: entry.endTime || "08:45",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this timetable entry?")) return;
    try {
      await deleteEntry(id);
      toast.success("Deleted successfully");
      load();
    } catch (e) {
      console.error("Delete error:", e);
      toast.error(e.response?.data?.message || "Failed to delete");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setForm({
      day: "Monday",
      period: 1,
      subjectId: "",
      teacherId: "",
      startTime: "08:00",
      endTime: "08:45",
    });
  };

  // Statistics
  const stats = {
    total: entries.length,
    byDay: DAYS.map((day) => ({
      day,
      count: entries.filter((e) => e.day === day).length,
    })),
    uniqueTeachers: new Set(
      entries.map((e) =>
        typeof e.teacherId === "object" ? e.teacherId._id : e.teacherId
      )
    ).size,
    uniqueSubjects: new Set(
      entries.map((e) =>
        typeof e.subjectId === "object" ? e.subjectId._id : e.subjectId
      )
    ).size,
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
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <FaCalendarWeek className="text-white text-2xl" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Timetable Management
                </h1>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Manage class schedules and periods with time slots
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (showForm && editingId) {
                  cancelEdit();
                } else {
                  setShowForm(!showForm);
                }
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 hover:shadow-lg"
            >
              {showForm ? (
                <FaTimes className="text-sm" />
              ) : (
                <FaPlus className="text-sm" />
              )}
              <span className="hidden sm:inline">
                {editingId ? "Cancel Edit" : showForm ? "Cancel" : "Add Entry"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Class Selection */}
        <div
          className={`p-6 rounded-2xl border shadow-md ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaGraduationCap
              className={isDark ? "text-gray-400" : "text-gray-600"}
            />
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Select Class
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setEntries([]);
                setSelectedClass(null);
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="">Choose a class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.grade} {c.section || c.name}
                </option>
              ))}
            </select>
            <button
              onClick={load}
              disabled={loading || !classId}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSearch className="text-sm" />
              {loading ? "Loading..." : "Load Timetable"}
            </button>
          </div>
          {selectedClass && (
            <div
              className={`mt-4 p-3 rounded-lg border ${
                isDark
                  ? "bg-indigo-900/20 border-indigo-800"
                  : "bg-indigo-50 border-indigo-200"
              }`}
            >
              <p
                className={`text-sm ${
                  isDark ? "text-indigo-400" : "text-indigo-700"
                }`}
              >
                <strong>Selected:</strong> {selectedClass.grade}{" "}
                {selectedClass.section || selectedClass.name}
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        {selectedClass && entries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total Periods
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.total}
                  </p>
                </div>
                <FaTable
                  className={`text-3xl ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
              </div>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Subjects
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.uniqueSubjects}
                  </p>
                </div>
                <FaBook
                  className={`text-3xl ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Teachers
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.uniqueTeachers}
                  </p>
                </div>
                <FaUserTie
                  className={`text-3xl ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Days Covered
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.byDay.filter((d) => d.count > 0).length}
                  </p>
                </div>
                <FaCalendarWeek
                  className={`text-3xl ${
                    isDark ? "text-amber-400" : "text-amber-600"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Entry Form */}
        {showForm && (
          <div
            className={`rounded-2xl border shadow-md overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
                  : "border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                  {editingId ? (
                    <FaEdit className="text-white text-xl" />
                  ) : (
                    <FaPlus className="text-white text-xl" />
                  )}
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {editingId ? "Edit Timetable Entry" : "Add Timetable Entry"}
                  </h3>
                  <p
                    className={`text-sm mt-0.5 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {editingId
                      ? "Update schedule entry"
                      : "Create a new schedule entry"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Day <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.day}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, day: e.target.value }))
                    }
                    required
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
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
                    Period <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaClock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <select
                      value={form.period}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          period: Number(e.target.value),
                        }))
                      }
                      required
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.period} value={slot.period}>
                          Period {slot.period} ({slot.start} - {slot.end})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startTime: e.target.value }))
                    }
                    required
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endTime: e.target.value }))
                    }
                    required
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.subjectId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subjectId: e.target.value }))
                    }
                    required
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
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
                    Teacher <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.teacherId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, teacherId: e.target.value }))
                    }
                    required
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.fullName || t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className={`flex justify-end gap-3 pt-4 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={cancelEdit}
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  {editingId ? (
                    <>
                      <FaSave /> Update Entry
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Entry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Timetable Display */}
        <div
          className={`rounded-2xl border shadow-md overflow-hidden ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`p-6 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaTable className={isDark ? "text-gray-400" : "text-gray-600"} />
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Weekly Schedule
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedClass
                    ? `Timetable for ${selectedClass.grade} ${
                        selectedClass.section || selectedClass.name
                      }`
                    : "Select a class to view timetable"}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p
                className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Loading timetable...
              </p>
            </div>
          ) : !classId ? (
            <div className="p-16 text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FaCalendarWeek
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
                No class selected
              </h3>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Please select a class and load the timetable
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-16 text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FaCalendarWeek
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
                No timetable entries
              </h3>
              <p
                className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Create entries to build the class schedule
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all duration-200"
              >
                <FaPlus />
                Add First Entry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className={isDark ? "bg-gray-900/50" : "bg-gray-50"}>
                  <tr>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Day
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Period
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Time
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Subject
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Teacher
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
                  {entries
                    .sort((a, b) => {
                      const dayCompare =
                        DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
                      return dayCompare === 0
                        ? a.period - b.period
                        : dayCompare;
                    })
                    .map((en) => {
                      const dayColor = DAY_COLORS[en.day];
                      return (
                        <tr
                          key={en._id}
                          className={`transition-colors duration-150 ${
                            isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${
                                isDark ? dayColor?.dark : dayColor?.light
                              }`}
                            >
                              {en.day}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FaClock
                                className={
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }
                              />
                              <span
                                className={`text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                Period {en.period}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {en.startTime} - {en.endTime}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FaBook
                                className={
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }
                              />
                              <span
                                className={`text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {en.subjectId?.name || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FaUserTie
                                className={
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }
                              />
                              <span
                                className={`text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {en.teacherId?.fullName || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(en)}
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
                                onClick={() => handleDelete(en._id)}
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
    </div>
  );
}
