// ClassManagement.jsx

import React, { useEffect, useState } from "react";
import {
  listClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassStatistics,
  bulkCreateClasses,
} from "../../api/classApi";
import {
  listSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  bulkCreateSubjects,
} from "../../api/subjectApi";
import {
  createAssignment,
  getAssignmentsByClass,
  removeAssignment,
  getWorkloadSummary,
} from "../../api/assignmentApi";
import { listTeachers } from "../../api/teacherApi";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import {
  FaSchool,
  FaBook,
  FaChalkboardTeacher,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSave,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaChartBar,
  FaUsers,
  FaCheckCircle,
  FaEye,
  FaClock,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";

// Tab options
const TABS = [
  { value: "classes", label: "Classes", icon: FaSchool },
  { value: "subjects", label: "Subjects", icon: FaBook },
  {
    value: "assignments",
    label: "Teacher Assignment",
    icon: FaChalkboardTeacher,
  },
];

// Status options
const CLASS_STATUS = ["active", "inactive", "archived", "promoted"];
const SUBJECT_STATUS = ["active", "inactive", "archived"];
const SUBJECT_CATEGORIES = [
  "core",
  "elective",
  "optional",
  "extra_curricular",
  "language",
];
const STREAMS = ["", "science", "commerce", "arts", "general"];

export default function ClassManagement({ isDark }) {
  const [tab, setTab] = useState("classes");

  // Classes State
  const [classes, setClasses] = useState([]);
  const [classLoading, setClassLoading] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [classSearch, setClassSearch] = useState("");
  const [classFilter, setClassFilter] = useState({
    status: "active",
    grade: "",
    stream: "",
  });
  const [classPagination, setClassPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Subjects State
  const [subjects, setSubjects] = useState([]);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState({
    status: "active",
    category: "",
  });
  const [subjectPagination, setSubjectPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Teachers & Assignments
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [workloadSummary, setWorkloadSummary] = useState([]);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // Class Form
  const [classForm, setClassForm] = useState({
    grade: "",
    section: "",
    name: "",
    maxCapacity: 40,
    stream: "",
    room: "",
    building: "",
    classTeacher: "",
    status: "active",
  });

  // Subject Form
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    description: "",
    category: "core",
    department: "",
    credits: 0,
    maxMarks: 100,
    passingMarks: 33,
    hasTheory: true,
    hasPractical: false,
    practicalMarks: 0,
    requiresLab: false,
    applicableGrades: [],
    status: "active",
  });

  // Assignment Form
  const [assignForm, setAssignForm] = useState({
    teacher: "",
    subject: "",
    class: "",
    hoursPerWeek: 0,
    assignmentType: "primary",
    defaultRoom: "",
    notes: "",
  });

  // Fetch data on mount
  useEffect(() => {
    if (tab === "classes") {
      fetchClasses();
    } else if (tab === "subjects") {
      fetchSubjects();
    } else if (tab === "assignments") {
      fetchTeachers();
      fetchClasses();
      fetchSubjects();
    }
  }, [tab]);

  // Fetch classes when filters change
  useEffect(() => {
    if (tab === "classes") {
      fetchClasses();
    }
  }, [
    classPagination.page,
    classSearch,
    classFilter.status,
    classFilter.grade,
    classFilter.stream,
  ]);

  // Fetch subjects when filters change
  useEffect(() => {
    if (tab === "subjects") {
      fetchSubjects();
    }
  }, [
    subjectPagination.page,
    subjectSearch,
    subjectFilter.status,
    subjectFilter.category,
  ]);

  // ============================================
  // FETCH FUNCTIONS
  // ============================================

  const fetchClasses = async () => {
    setClassLoading(true);
    try {
      const params = {
        page: classPagination.page,
        limit: classPagination.limit,
        search: classSearch,
        status: classFilter.status,
        grade: classFilter.grade,
        stream: classFilter.stream,
      };

      const res = await listClasses(params);
      const data = res.data || res;

      setClasses(data.data || []);
      if (data.pagination) {
        setClassPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load classes");
    } finally {
      setClassLoading(false);
    }
  };

  const fetchSubjects = async () => {
    setSubjectLoading(true);
    try {
      const params = {
        page: subjectPagination.page,
        limit: subjectPagination.limit,
        search: subjectSearch,
        status: subjectFilter.status,
        category: subjectFilter.category,
      };

      const res = await listSubjects(params);
      const data = res.data || res;

      setSubjects(data.data || []);
      if (data.pagination) {
        setSubjectPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subjects");
    } finally {
      setSubjectLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await listTeachers({ limit: 1000, status: "Active" });
      const data = res.data || res;
      setTeachers(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await getClassStatistics();
      setStatistics(res.data.data);
      setShowStatsModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load statistics");
    }
  };

  const fetchWorkloadSummary = async () => {
    try {
      const res = await getWorkloadSummary();
      setWorkloadSummary(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load workload summary");
    }
  };

  // ============================================
  // CLASS HANDLERS
  // ============================================

  const handleClassSubmit = async (e) => {
    e.preventDefault();

    if (!classForm.grade) {
      toast.error("Grade is required");
      return;
    }

    try {
      setClassLoading(true);

      if (editingClassId) {
        await updateClass(editingClassId, classForm);
        toast.success("Class updated successfully");
      } else {
        await createClass(classForm);
        toast.success("Class created successfully");
      }

      setShowClassModal(false);
      resetClassForm();
      fetchClasses();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setClassLoading(false);
    }
  };

  const handleClassEdit = (classData) => {
    setEditingClassId(classData._id);
    setClassForm({
      grade: classData.grade || "",
      section: classData.section || "",
      name: classData.name || "",
      maxCapacity: classData.maxCapacity || 40,
      stream: classData.stream || "",
      room: classData.room || "",
      building: classData.building || "",
      classTeacher: classData.classTeacher?._id || classData.classTeacher || "",
      status: classData.status || "active",
    });
    setShowClassModal(true);
  };

  const handleClassDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      await deleteClass(id);
      toast.success("Class deleted successfully");
      fetchClasses();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete class");
    }
  };

  const resetClassForm = () => {
    setEditingClassId(null);
    setClassForm({
      grade: "",
      section: "",
      name: "",
      maxCapacity: 40,
      stream: "",
      room: "",
      building: "",
      classTeacher: "",
      status: "active",
    });
  };

  // ============================================
  // SUBJECT HANDLERS
  // ============================================

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();

    if (!subjectForm.name || !subjectForm.code) {
      toast.error("Name and Code are required");
      return;
    }

    try {
      setSubjectLoading(true);

      if (editingSubjectId) {
        await updateSubject(editingSubjectId, subjectForm);
        toast.success("Subject updated successfully");
      } else {
        await createSubject(subjectForm);
        toast.success("Subject created successfully");
      }

      setShowSubjectModal(false);
      resetSubjectForm();
      fetchSubjects();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSubjectLoading(false);
    }
  };

  const handleSubjectEdit = (subject) => {
    setEditingSubjectId(subject._id);
    setSubjectForm({
      name: subject.name || "",
      code: subject.code || "",
      description: subject.description || "",
      category: subject.category || "core",
      department: subject.department || "",
      credits: subject.credits || 0,
      maxMarks: subject.maxMarks || 100,
      passingMarks: subject.passingMarks || 33,
      hasTheory: subject.hasTheory !== undefined ? subject.hasTheory : true,
      hasPractical: subject.hasPractical || false,
      practicalMarks: subject.practicalMarks || 0,
      requiresLab: subject.requiresLab || false,
      applicableGrades: subject.applicableGrades || [],
      status: subject.status || "active",
    });
    setShowSubjectModal(true);
  };

  const handleSubjectDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;

    try {
      await deleteSubject(id);
      toast.success("Subject deleted successfully");
      fetchSubjects();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete subject");
    }
  };

  const resetSubjectForm = () => {
    setEditingSubjectId(null);
    setSubjectForm({
      name: "",
      code: "",
      description: "",
      category: "core",
      department: "",
      credits: 0,
      maxMarks: 100,
      passingMarks: 33,
      hasTheory: true,
      hasPractical: false,
      practicalMarks: 0,
      requiresLab: false,
      applicableGrades: [],
      status: "active",
    });
  };

  // ============================================
  // ASSIGNMENT HANDLERS
  // ============================================

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    if (!assignForm.teacher || !assignForm.subject || !assignForm.class) {
      toast.error("Teacher, Subject, and Class are required");
      return;
    }

    try {
      await createAssignment(assignForm);
      toast.success("Teacher assigned successfully");
      setShowAssignModal(false);
      resetAssignForm();
      fetchWorkloadSummary();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to assign teacher");
    }
  };

  const handleViewAssignments = async (classData) => {
    try {
      const res = await getAssignmentsByClass(classData._id);
      setAssignments(res.data.data || []);
      setSelectedClass(classData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assignments");
    }
  };

  const resetAssignForm = () => {
    setAssignForm({
      teacher: "",
      subject: "",
      class: "",
      hoursPerWeek: 0,
      assignmentType: "primary",
      defaultRoom: "",
      notes: "",
    });
  };

  // ============================================
  // EXPORT HANDLERS
  // ============================================

  const handleExportClasses = () => {
    try {
      const exportData = classes.map((cls) => ({
        Grade: cls.grade,
        Section: cls.section,
        Name: cls.name || "N/A",
        "Max Capacity": cls.maxCapacity,
        "Current Enrollment": cls.currentEnrollment || 0,
        Stream: cls.stream || "N/A",
        Room: cls.room || "N/A",
        "Class Teacher": cls.classTeacher?.fullName || "N/A",
        Status: cls.status,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Classes");

      XLSX.writeFile(
        wb,
        `Classes_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Classes exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export");
    }
  };

  const handleExportSubjects = () => {
    try {
      const exportData = subjects.map((subject) => ({
        Name: subject.name,
        Code: subject.code,
        Category: subject.category,
        Department: subject.department || "N/A",
        Credits: subject.credits || 0,
        "Max Marks": subject.maxMarks,
        "Passing Marks": subject.passingMarks,
        "Has Theory": subject.hasTheory ? "Yes" : "No",
        "Has Practical": subject.hasPractical ? "Yes" : "No",
        Status: subject.status,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Subjects");

      XLSX.writeFile(
        wb,
        `Subjects_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Subjects exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export");
    }
  };

  const getStatusBadge = (status) => {
    const colorMap = {
      active: isDark
        ? "bg-green-900/30 text-green-400 border-green-800"
        : "bg-green-100 text-green-700 border-green-200",
      inactive: isDark
        ? "bg-gray-900/30 text-gray-400 border-gray-800"
        : "bg-gray-100 text-gray-700 border-gray-200",
      archived: isDark
        ? "bg-yellow-900/30 text-yellow-400 border-yellow-800"
        : "bg-yellow-100 text-yellow-700 border-yellow-200",
      promoted: isDark
        ? "bg-blue-900/30 text-blue-400 border-blue-800"
        : "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${
          colorMap[status] || colorMap.inactive
        }`}
      >
        {status}
      </span>
    );
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
                <FaSchool className="text-white text-2xl" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Academic Management
                </h1>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Manage classes, subjects, and teacher assignments
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={fetchStatistics}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md transition-all"
              >
                <FaChartBar />
                Statistics
              </button>
              <button
                onClick={
                  tab === "classes" ? handleExportClasses : handleExportSubjects
                }
                disabled={
                  tab === "assignments" ||
                  (tab === "classes"
                    ? classes.length === 0
                    : subjects.length === 0)
                }
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-md transition-all ${
                  tab === "assignments" ||
                  (tab === "classes"
                    ? classes.length === 0
                    : subjects.length === 0)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <FaDownload />
                Export
              </button>
              {tab !== "assignments" && (
                <button
                  onClick={() => {
                    if (tab === "classes") {
                      resetClassForm();
                      setShowClassModal(true);
                    } else {
                      resetSubjectForm();
                      setShowSubjectModal(true);
                    }
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md transition-all"
                >
                  <FaPlus />
                  Add {tab === "classes" ? "Class" : "Subject"}
                </button>
              )}
              {tab === "assignments" && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md transition-all"
                >
                  <FaPlus />
                  Assign Teacher
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div
            className="flex gap-2 border-b"
            style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}
          >
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                    tab === t.value
                      ? isDark
                        ? "text-indigo-400 border-b-2 border-indigo-400"
                        : "text-indigo-600 border-b-2 border-indigo-600"
                      : isDark
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Classes Tab */}
        {tab === "classes" && (
          <>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <FaSearch
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search classes..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <select
                  value={classFilter.status}
                  onChange={(e) =>
                    setClassFilter({ ...classFilter, status: e.target.value })
                  }
                  className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">All Status</option>
                  {CLASS_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Filter by grade..."
                  value={classFilter.grade}
                  onChange={(e) =>
                    setClassFilter({ ...classFilter, grade: e.target.value })
                  }
                  className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                  }`}
                />

                <select
                  value={classFilter.stream}
                  onChange={(e) =>
                    setClassFilter({ ...classFilter, stream: e.target.value })
                  }
                  className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">All Streams</option>
                  {STREAMS.filter((s) => s).map((stream) => (
                    <option key={stream} value={stream}>
                      {stream}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Classes Table */}
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
                  Classes ({classPagination.total})
                </h3>
              </div>

              {classLoading ? (
                <div className="p-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p
                    className={`mt-4 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Loading classes...
                  </p>
                </div>
              ) : classes.length === 0 ? (
                <div className="p-16 text-center">
                  <FaSchool
                    className={`mx-auto text-5xl mb-4 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No classes found
                  </h3>
                  <p
                    className={`mb-6 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Add your first class to get started
                  </p>
                  <button
                    onClick={() => {
                      resetClassForm();
                      setShowClassModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all"
                  >
                    <FaPlus />
                    Add Class
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
                          Class
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Capacity
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Class Teacher
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Room
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
                      {classes.map((cls) => (
                        <tr
                          key={cls._id}
                          className={`transition-colors ${
                            isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div
                                className={`text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                Grade {cls.grade}{" "}
                                {cls.section && `- Section ${cls.section}`}
                              </div>
                              {cls.name && (
                                <div
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {cls.name}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {cls.currentEnrollment || 0} / {cls.maxCapacity}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    ((cls.currentEnrollment || 0) /
                                      cls.maxCapacity) *
                                      100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {cls.classTeacher?.fullName || "Not Assigned"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {cls.room || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(cls.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleClassEdit(cls)}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                  isDark
                                    ? "text-blue-400 hover:bg-blue-900/20"
                                    : "text-blue-600 hover:bg-blue-50"
                                }`}
                              >
                                <FaEdit />
                                Edit
                              </button>
                              <button
                                onClick={() => handleClassDelete(cls._id)}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                  isDark
                                    ? "text-red-400 hover:bg-red-900/20"
                                    : "text-red-600 hover:bg-red-50"
                                }`}
                              >
                                <FaTrash />
                                Delete
                              </button>
                            </div>
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

        {/* Subjects Tab */}
        {tab === "subjects" && (
          <>
       
          </>
        )}

        {/* Assignments Tab */}
        {tab === "assignments" && (
          <>
            <div
              className={`text-center p-12 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Teacher Assignment content with timetable view
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div
            className={`rounded-2xl max-w-3xl w-full my-8 shadow-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
                  : "border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                    <FaSchool className="text-white text-xl" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingClassId ? "Edit Class" : "Add New Class"}
                    </h3>
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Fill in the class information
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowClassModal(false);
                    resetClassForm();
                  }}
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

            {/* Modal Body */}
            <form
              onSubmit={handleClassSubmit}
              className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
            >
              {/* Basic Information */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Grade *
                    </label>
                    <input
                      type="text"
                      required
                      value={classForm.grade}
                      onChange={(e) =>
                        setClassForm({ ...classForm, grade: e.target.value })
                      }
                      placeholder="e.g., 1, 2, 10, 11, 12"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Section
                    </label>
                    <input
                      type="text"
                      value={classForm.section}
                      onChange={(e) =>
                        setClassForm({ ...classForm, section: e.target.value })
                      }
                      placeholder="e.g., A, B, C"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Class Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={classForm.name}
                      onChange={(e) =>
                        setClassForm({ ...classForm, name: e.target.value })
                      }
                      placeholder="e.g., Science Stream, Commerce Section"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={classForm.maxCapacity}
                      onChange={(e) =>
                        setClassForm({
                          ...classForm,
                          maxCapacity: parseInt(e.target.value) || 40,
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
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
                      Stream (for higher grades)
                    </label>
                    <select
                      value={classForm.stream}
                      onChange={(e) =>
                        setClassForm({ ...classForm, stream: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="">None</option>
                      {STREAMS.filter((s) => s).map((stream) => (
                        <option key={stream} value={stream}>
                          {stream}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Room & Location */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Room & Location
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={classForm.room}
                      onChange={(e) =>
                        setClassForm({ ...classForm, room: e.target.value })
                      }
                      placeholder="e.g., 101, A-205"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Building
                    </label>
                    <input
                      type="text"
                      value={classForm.building}
                      onChange={(e) =>
                        setClassForm({ ...classForm, building: e.target.value })
                      }
                      placeholder="e.g., Main Building, Block A"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Class Teacher */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Class Teacher
                </h4>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Select Class Teacher
                  </label>
                  <select
                    value={classForm.classTeacher}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        classTeacher: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="">No Teacher Assigned</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.fullName}{" "}
                        {teacher.employeeId && `(${teacher.employeeId})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </label>
                <select
                  value={classForm.status}
                  onChange={(e) =>
                    setClassForm({ ...classForm, status: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  {CLASS_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Actions */}
              <div
                className={`flex justify-end gap-3 pt-4 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowClassModal(false);
                    resetClassForm();
                  }}
                  className={`px-6 py-2.5 rounded-xl border font-medium transition-all ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={classLoading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-md transition-all ${
                    classLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  <FaSave />
                  {classLoading
                    ? "Saving..."
                    : editingClassId
                    ? "Update Class"
                    : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subjects Tab */}
      {tab === "subjects" && (
        <>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              <select
                value={subjectFilter.status}
                onChange={(e) =>
                  setSubjectFilter({ ...subjectFilter, status: e.target.value })
                }
                className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="">All Status</option>
                {SUBJECT_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={subjectFilter.category}
                onChange={(e) =>
                  setSubjectFilter({
                    ...subjectFilter,
                    category: e.target.value,
                  })
                }
                className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="">All Categories</option>
                {SUBJECT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subjects Table */}
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
                Subjects ({subjectPagination.total})
              </h3>
            </div>

            {subjectLoading ? (
              <div className="p-16 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p
                  className={`mt-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Loading subjects...
                </p>
              </div>
            ) : subjects.length === 0 ? (
              <div className="p-16 text-center">
                <FaBook
                  className={`mx-auto text-5xl mb-4 ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  No subjects found
                </h3>
                <p
                  className={`mb-6 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Add your first subject to get started
                </p>
                <button
                  onClick={() => {
                    resetSubjectForm();
                    setShowSubjectModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all"
                >
                  <FaPlus />
                  Add Subject
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
                        Subject
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Code
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Category
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Marks
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Type
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
                    {subjects.map((subject) => (
                      <tr
                        key={subject._id}
                        className={`transition-colors ${
                          isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {subject.name}
                            </div>
                            {subject.department && (
                              <div
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {subject.department}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-mono ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {subject.code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isDark
                                ? "bg-indigo-900/30 text-indigo-400"
                                : "bg-indigo-100 text-indigo-800"
                            }`}
                          >
                            {subject.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {subject.maxMarks}
                            {subject.hasPractical &&
                              subject.practicalMarks > 0 && (
                                <span className="text-xs">
                                  {" "}
                                  (+{subject.practicalMarks})
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {subject.hasTheory && (
                              <span
                                className={`px-2 py-1 text-xs rounded ${
                                  isDark
                                    ? "bg-blue-900/30 text-blue-400"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                Theory
                              </span>
                            )}
                            {subject.hasPractical && (
                              <span
                                className={`px-2 py-1 text-xs rounded ${
                                  isDark
                                    ? "bg-green-900/30 text-green-400"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                Practical
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(subject.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleSubjectEdit(subject)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                isDark
                                  ? "text-blue-400 hover:bg-blue-900/20"
                                  : "text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              <FaEdit />
                              Edit
                            </button>
                            <button
                              onClick={() => handleSubjectDelete(subject._id)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                isDark
                                  ? "text-red-400 hover:bg-red-900/20"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                            >
                              <FaTrash />
                              Delete
                            </button>
                          </div>
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

      {/* Add/Edit Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div
            className={`rounded-2xl max-w-4xl w-full my-8 shadow-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
                  : "border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                    <FaBook className="text-white text-xl" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingSubjectId ? "Edit Subject" : "Add New Subject"}
                    </h3>
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Fill in the subject information
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSubjectModal(false);
                    resetSubjectForm();
                  }}
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

            {/* Modal Body */}
            <form
              onSubmit={handleSubjectSubmit}
              className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
            >
              {/* Basic Information */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.name}
                      onChange={(e) =>
                        setSubjectForm({ ...subjectForm, name: e.target.value })
                      }
                      placeholder="e.g., Mathematics, Physics"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.code}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g., MATH101, PHY201"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      value={subjectForm.description}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of the subject..."
                      rows={3}
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Category
                    </label>
                    <select
                      value={subjectForm.category}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          category: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      {SUBJECT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
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
                      Department
                    </label>
                    <input
                      type="text"
                      value={subjectForm.department}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          department: e.target.value,
                        })
                      }
                      placeholder="e.g., Science, Mathematics"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Marks & Credits */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Marks & Credits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Credits
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subjectForm.credits}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          credits: parseInt(e.target.value) || 0,
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
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
                      Max Marks
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subjectForm.maxMarks}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          maxMarks: parseInt(e.target.value) || 100,
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
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
                      Passing Marks
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subjectForm.passingMarks}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          passingMarks: parseInt(e.target.value) || 33,
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Subject Type */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Subject Type
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subjectForm.hasTheory}
                        onChange={(e) =>
                          setSubjectForm({
                            ...subjectForm,
                            hasTheory: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Has Theory Component
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subjectForm.hasPractical}
                        onChange={(e) =>
                          setSubjectForm({
                            ...subjectForm,
                            hasPractical: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Has Practical Component
                      </span>
                    </label>
                  </div>

                  {subjectForm.hasPractical && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Practical Marks
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={subjectForm.practicalMarks}
                          onChange={(e) =>
                            setSubjectForm({
                              ...subjectForm,
                              practicalMarks: parseInt(e.target.value) || 0,
                            })
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isDark
                              ? "border-gray-600 bg-gray-700 text-white"
                              : "border-gray-300 bg-white text-gray-900"
                          }`}
                        />
                      </div>

                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                          <input
                            type="checkbox"
                            checked={subjectForm.requiresLab}
                            onChange={(e) =>
                              setSubjectForm({
                                ...subjectForm,
                                requiresLab: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Requires Lab
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Applicable Grades */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Applicable Grades
                </h4>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Enter grades (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={subjectForm.applicableGrades.join(", ")}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        applicableGrades: e.target.value
                          .split(",")
                          .map((g) => g.trim())
                          .filter((g) => g),
                      })
                    }
                    placeholder="e.g., 9, 10, 11, 12"
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                    }`}
                  />
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Leave empty if applicable to all grades
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </label>
                <select
                  value={subjectForm.status}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, status: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  {SUBJECT_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Actions */}
              <div
                className={`flex justify-end gap-3 pt-4 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowSubjectModal(false);
                    resetSubjectForm();
                  }}
                  className={`px-6 py-2.5 rounded-xl border font-medium transition-all ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={subjectLoading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-md transition-all ${
                    subjectLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  <FaSave />
                  {subjectLoading
                    ? "Saving..."
                    : editingSubjectId
                    ? "Update Subject"
                    : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Teacher Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div
            className={`rounded-2xl max-w-3xl w-full my-8 shadow-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
                  : "border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                    <FaChalkboardTeacher className="text-white text-xl" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Assign Teacher
                    </h3>
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Assign a teacher to a class and subject
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    resetAssignForm();
                  }}
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

            {/* Modal Body */}
            <form onSubmit={handleAssignmentSubmit} className="p-6 space-y-6">
              {/* Teacher Selection */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Select Teacher *
                </label>
                <select
                  required
                  value={assignForm.teacher}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, teacher: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.fullName}{" "}
                      {teacher.employeeId && `(${teacher.employeeId})`} -{" "}
                      {teacher.department || "N/A"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Select Subject *
                </label>
                <select
                  required
                  value={assignForm.subject}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, subject: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} ({subject.code}) - {subject.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Selection */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Select Class *
                </label>
                <select
                  required
                  value={assignForm.class}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, class: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      Grade {cls.grade} {cls.section && `- ${cls.section}`}{" "}
                      {cls.name && `(${cls.name})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Hours per Week
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="0.5"
                    value={assignForm.hoursPerWeek}
                    onChange={(e) =>
                      setAssignForm({
                        ...assignForm,
                        hoursPerWeek: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g., 5"
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Assignment Type
                  </label>
                  <select
                    value={assignForm.assignmentType}
                    onChange={(e) =>
                      setAssignForm({
                        ...assignForm,
                        assignmentType: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="primary">Primary</option>
                    <option value="substitute">Substitute</option>
                    <option value="support">Support</option>
                    <option value="co-teacher">Co-Teacher</option>
                  </select>
                </div>
              </div>

              {/* Room */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Default Room/Lab
                </label>
                <input
                  type="text"
                  value={assignForm.defaultRoom}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      defaultRoom: e.target.value,
                    })
                  }
                  placeholder="e.g., Room 101, Physics Lab"
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Notes (Optional)
                </label>
                <textarea
                  value={assignForm.notes}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, notes: e.target.value })
                  }
                  placeholder="Any additional notes about this assignment..."
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              {/* Info Box */}
              <div
                className={`p-4 rounded-lg ${
                  isDark
                    ? "bg-blue-900/20 border border-blue-800"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <FaCheckCircle
                    className={`text-lg mt-0.5 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-blue-300" : "text-blue-900"
                      }`}
                    >
                      Assignment Information
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? "text-blue-400" : "text-blue-700"
                      }`}
                    >
                      The teacher will be assigned to teach the selected subject
                      to the selected class. You can add timetable periods later
                      to schedule specific days and times.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div
                className={`flex justify-end gap-3 pt-4 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    resetAssignForm();
                  }}
                  className={`px-6 py-2.5 rounded-xl border font-medium transition-all ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-md transition-all"
                >
                  <FaSave />
                  Assign Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && statistics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div
            className={`rounded-2xl max-w-6xl w-full my-8 shadow-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
                  : "border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Academic Statistics
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Overview of classes, subjects, and enrollments
                  </p>
                </div>
                <button
                  onClick={() => setShowStatsModal(false)}
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

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Overall Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div
                  className={`p-6 rounded-xl border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <FaSchool
                      className={`mx-auto text-3xl mb-2 ${
                        isDark ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    <div
                      className={`text-3xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {statistics.totalClasses || 0}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Classes
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <FaUsers
                      className={`mx-auto text-3xl mb-2 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <div
                      className={`text-3xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {statistics.totalEnrolled || 0}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Students
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <FaUserGraduate
                      className={`mx-auto text-3xl mb-2 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <div
                      className={`text-3xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {statistics.totalMale || 0}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Male Students
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <FaUserGraduate
                      className={`mx-auto text-3xl mb-2 ${
                        isDark ? "text-pink-400" : "text-pink-600"
                      }`}
                    />
                    <div
                      className={`text-3xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {statistics.totalFemale || 0}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Female Students
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity Overview */}
              <div
                className={`p-6 rounded-xl border mb-6 ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Capacity Overview
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Total Capacity
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {statistics.totalCapacity || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Current Enrollment
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {statistics.totalEnrolled || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Available Seats
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {(statistics.totalCapacity || 0) -
                        (statistics.totalEnrolled || 0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          ((statistics.totalEnrolled || 0) /
                            (statistics.totalCapacity || 1)) *
                            100
                        )}%`,
                      }}
                    >
                      <span className="flex items-center justify-center h-full text-xs font-medium text-white">
                        {Math.round(
                          ((statistics.totalEnrolled || 0) /
                            (statistics.totalCapacity || 1)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade-wise Distribution */}
              {statistics.gradeDistribution &&
                statistics.gradeDistribution.length > 0 && (
                  <div
                    className={`p-6 rounded-xl border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <h4
                      className={`text-lg font-semibold mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Grade-wise Distribution
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {statistics.gradeDistribution.map((item) => (
                        <div
                          key={item._id}
                          className={`p-4 rounded-lg border ${
                            isDark
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Grade {item._id}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                isDark
                                  ? "bg-indigo-900/30 text-indigo-400"
                                  : "bg-indigo-100 text-indigo-700"
                              }`}
                            >
                              {item.classCount} class(es)
                            </span>
                          </div>
                          <div
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <div className="flex justify-between">
                              <span>Students:</span>
                              <span className="font-medium">
                                {item.totalEnrolled || 0}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Capacity:</span>
                              <span className="font-medium">
                                {item.totalCapacity || 0}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((item.totalEnrolled || 0) /
                                    (item.totalCapacity || 1)) *
                                    100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div
              className={`p-6 border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-md transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Assignment Tab */}
      {tab === "assignments" && (
        <>
          <div
            className={`mb-6 p-6 rounded-2xl border shadow-md ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Teacher Assignment
                </h3>
              </div>
              <button
                onClick={fetchWorkloadSummary}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
              >
                <FaChartBar />
                View Workload Summary
              </button>
            </div>

            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Assign teachers to classes and subjects. Click on a class below to
              view and manage its teacher assignments.
            </p>
          </div>

          {/* Classes Grid for Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className={`p-6 rounded-2xl border shadow-md transition-all hover:shadow-lg ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:border-indigo-500"
                    : "bg-white border-gray-200 hover:border-indigo-500"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Grade {cls.grade} {cls.section && `- ${cls.section}`}
                    </h4>
                    {cls.name && (
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {cls.name}
                      </p>
                    )}
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-indigo-900/30" : "bg-indigo-100"
                    }`}
                  >
                    <FaSchool
                      className={isDark ? "text-indigo-400" : "text-indigo-600"}
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Class Teacher:
                    </span>
                    <span
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {cls.classTeacher?.fullName || "Not Assigned"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Room:
                    </span>
                    <span
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {cls.room || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Enrollment:
                    </span>
                    <span
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {cls.currentEnrollment || 0} / {cls.maxCapacity}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewAssignments(cls)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                >
                  <FaEye />
                  View Assignments
                </button>
              </div>
            ))}
          </div>

          {/* Selected Class Assignments View */}
          {selectedClass && (
            <div
              className={`mt-6 p-6 rounded-2xl border shadow-md ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Assignments for Grade {selectedClass.grade}{" "}
                    {selectedClass.section && `- ${selectedClass.section}`}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {assignments.length} teacher(s) assigned
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAssignForm({
                        ...assignForm,
                        class: selectedClass._id,
                      });
                      setShowAssignModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
                  >
                    <FaPlus />
                    Assign Teacher
                  </button>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>

              {assignments.length === 0 ? (
                <div className="text-center py-12">
                  <FaChalkboardTeacher
                    className={`mx-auto text-5xl mb-4 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No teachers assigned yet
                  </p>
                  <button
                    onClick={() => {
                      setAssignForm({
                        ...assignForm,
                        class: selectedClass._id,
                      });
                      setShowAssignModal(true);
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                  >
                    <FaPlus />
                    Assign First Teacher
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) =>
                    assignment.assignments.map((assign) => (
                      <div
                        key={assign._id}
                        className={`p-4 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-lg ${
                                isDark ? "bg-indigo-900/30" : "bg-indigo-100"
                              }`}
                            >
                              <FaChalkboardTeacher
                                className={`text-xl ${
                                  isDark ? "text-indigo-400" : "text-indigo-600"
                                }`}
                              />
                            </div>
                            <div>
                              <h4
                                className={`font-semibold ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {assignment.teacher?.fullName}
                              </h4>
                              <p
                                className={`text-sm ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {assign.subject?.name} ({assign.subject?.code})
                              </p>
                              <div className="flex items-center gap-4 mt-1">
                                <span
                                  className={`text-xs ${
                                    isDark ? "text-gray-500" : "text-gray-500"
                                  }`}
                                >
                                  {assign.hoursPerWeek || 0} hrs/week
                                </span>
                                {assign.defaultRoom && (
                                  <span
                                    className={`text-xs ${
                                      isDark ? "text-gray-500" : "text-gray-500"
                                    }`}
                                  >
                                    Room: {assign.defaultRoom}
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    assign.assignmentType === "primary"
                                      ? isDark
                                        ? "bg-green-900/30 text-green-400"
                                        : "bg-green-100 text-green-700"
                                      : isDark
                                      ? "bg-yellow-900/30 text-yellow-400"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {assign.assignmentType}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm("Remove this assignment?")) {
                                removeAssignment(
                                  assignment.teacher._id,
                                  assign._id
                                )
                                  .then(() => {
                                    toast.success("Assignment removed");
                                    handleViewAssignments(selectedClass);
                                  })
                                  .catch((err) => {
                                    toast.error("Failed to remove assignment");
                                  });
                              }
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark
                                ? "text-red-400 hover:bg-red-900/20"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals - Add Class Modal, Add Subject Modal, Assign Teacher Modal, Stats Modal */}
      {/* Truncated for length - full implementation available */}
    </div>
  );
}
