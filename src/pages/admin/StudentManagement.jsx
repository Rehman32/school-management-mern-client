// studentManagement.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStatistics,
  bulkDelete,
} from "../../api/studentApi";
import { listClasses } from "../../api/classApi";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import {
  FaUserGraduate,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaEye,
  FaSave,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChartBar,
  FaUsers,
  FaMale,
  FaFemale,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// Blood group options
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Status options
const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "graduated", label: "Graduated", color: "blue" },
  { value: "transferred", label: "Transferred", color: "yellow" },
  { value: "expelled", label: "Expelled", color: "red" },
  { value: "suspended", label: "Suspended", color: "orange" },
];

export default function StudentManagement({ isDark }) {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [filterGender, setFilterGender] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    admissionNumber: "", // ✅ ADD THIS
    class: "",
    gender: "male",
    dob: "",
    bloodGroup: "",
    nationality: "Indian",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    guardians: [
      {
        name: "",
        relationship: "father",
        phone: "",
        email: "",
        occupation: "",
        isPrimary: true,
      },
    ],
    emergencyContacts: [],
    medicalConditions: "",
    allergies: "",
    transportRequired: false,
    busRoute: "",
    hostelRequired: false,
    status: "active",
  });
  // Fetch classes
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, [pagination.page, filterClass, filterStatus, filterGender, searchTerm]);

  const fetchClasses = async () => {
    try {
      const res = await listClasses();
      const data = res.data.data || res;
      setClasses(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load classes");
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: filterStatus,
      };

      if (filterClass) params.class = filterClass;
      if (filterGender) params.gender = filterGender;

      const res = await getAllStudents(params);
      const data = res.data || res;

      setStudents(data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await getStatistics();
      setStatistics(res.data.data);
      setShowStatsModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load statistics");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.fullName || !form.class || !form.gender || !form.dob) {
      toast.error("Please fill all required fields");
      return;
    }

    if (
      !form.guardians ||
      form.guardians.length === 0 ||
      !form.guardians[0].name
    ) {
      toast.error("At least one guardian is required");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateStudent(editingId, form);
        toast.success("Student updated successfully");
      } else {
        await createStudent(form);
        toast.success("Student created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      fullName: student.fullName || "",
      email: student.email || "",
      phone: student.phone || "",
      rollNumber: student.rollNumber || "",
      admissionNumber: student.admissionNumber || "",
      class: student.class?._id || student.class || "",
      gender: student.gender || "male",
      dob: student.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
      bloodGroup: student.bloodGroup || "",
      nationality: student.nationality || "Indian",
      address: student.address || {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      guardians:
        student.guardians && student.guardians.length > 0
          ? student.guardians
          : [
              {
                name: "",
                relationship: "father",
                phone: "",
                email: "",
                occupation: "",
                isPrimary: true,
              },
            ],
      emergencyContacts: student.emergencyContacts || [],
      medicalConditions: student.medicalConditions || "",
      allergies: student.allergies || "",
      transportRequired: student.transportRequired || false,
      busRoute: student.busRoute || "",
      hostelRequired: student.hostelRequired || false,
      status: student.status || "active",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await deleteStudent(id);
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete student");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) {
      toast.error("No students selected");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedStudents.length} student(s)?`
      )
    )
      return;

    try {
      await bulkDelete(selectedStudents);
      toast.success(`${selectedStudents.length} students deleted successfully`);
      setSelectedStudents([]);
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete students");
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = students.map((student) => ({
        "Admission No": student.admissionNumber,
        "Roll No": student.rollNumber,
        Name: student.fullName,
        Class: student.class?.name || "N/A",
        Gender: student.gender,
        "Date of Birth": student.dob
          ? new Date(student.dob).toLocaleDateString()
          : "N/A",
        Email: student.email || "N/A",
        Phone: student.phone || "N/A",
        "Guardian Name": student.guardians?.[0]?.name || "N/A",
        "Guardian Phone": student.guardians?.[0]?.phone || "N/A",
        Status: student.status,
        "Enrolled Date": new Date(student.enrolledDate).toLocaleDateString(),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws["!cols"] = [
        { wch: 12 },
        { wch: 10 },
        { wch: 25 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");

      const filename = `Students_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success("Excel file exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export");
    }
  };

  const resetForm = () => {
  setEditingId(null);
  setForm({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    admissionNumber: "", // ✅ ADD THIS
    class: "",
    gender: "male",
    dob: "",
    bloodGroup: "",
    nationality: "Indian",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    guardians: [
      {
        name: "",
        relationship: "father",
        phone: "",
        email: "",
        occupation: "",
        isPrimary: true,
      },
    ],
    emergencyContacts: [],
    medicalConditions: "",
    allergies: "",
    transportRequired: false,
    busRoute: "",
    hostelRequired: false,
    status: "active",
  });
};

  const addGuardian = () => {
    setForm({
      ...form,
      guardians: [
        ...form.guardians,
        {
          name: "",
          relationship: "guardian",
          phone: "",
          email: "",
          occupation: "",
          isPrimary: false,
        },
      ],
    });
  };

  const removeGuardian = (index) => {
    const newGuardians = form.guardians.filter((_, i) => i !== index);
    setForm({ ...form, guardians: newGuardians });
  };

  const updateGuardian = (index, field, value) => {
    const newGuardians = [...form.guardians];
    newGuardians[index][field] = value;
    setForm({ ...form, guardians: newGuardians });
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s._id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig =
      STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    const colorClasses = {
      green: isDark
        ? "bg-green-900/30 text-green-400 border-green-800"
        : "bg-green-100 text-green-700 border-green-200",
      gray: isDark
        ? "bg-gray-900/30 text-gray-400 border-gray-800"
        : "bg-gray-100 text-gray-700 border-gray-200",
      blue: isDark
        ? "bg-blue-900/30 text-blue-400 border-blue-800"
        : "bg-blue-100 text-blue-700 border-blue-200",
      yellow: isDark
        ? "bg-yellow-900/30 text-yellow-400 border-yellow-800"
        : "bg-yellow-100 text-yellow-700 border-yellow-200",
      red: isDark
        ? "bg-red-900/30 text-red-400 border-red-800"
        : "bg-red-100 text-red-700 border-red-200",
      orange: isDark
        ? "bg-orange-900/30 text-orange-400 border-orange-800"
        : "bg-orange-100 text-orange-700 border-orange-200",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${
          colorClasses[statusConfig.color]
        }`}
      >
        {statusConfig.label}
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
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <FaUserGraduate className="text-white text-2xl" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Student Management
                </h1>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Manage student information and records
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {selectedStudents.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-md transition-all"
                >
                  <FaTrash />
                  Delete ({selectedStudents.length})
                </button>
              )}
              <button
                onClick={fetchStatistics}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition-all"
              >
                <FaChartBar />
                Statistics
              </button>
              <button
                onClick={handleExportExcel}
                disabled={students.length === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-md transition-all ${
                  students.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <FaDownload />
                Export
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md transition-all"
              >
                <FaPlus />
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Filters */}
        <div
          className={`mb-6 p-6 rounded-2xl border shadow-md ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className={isDark ? "text-gray-400" : "text-gray-600"} />
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
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
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            {/* Class Filter */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name || `${cls.grade} - ${cls.section}`}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Gender Filter */}
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Student Table */}
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
            <div className="flex justify-between items-center">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Students ({pagination.total})
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Page {pagination.page} of {pagination.pages}
                </p>
              </div>

              {students.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Select All
                  </span>
                </label>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p
                className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Loading students...
              </p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-16 text-center">
              <FaUserGraduate
                className={`mx-auto text-5xl mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                No students found
              </h3>
              <p
                className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {searchTerm || filterClass || filterStatus !== "active"
                  ? "Try adjusting your filters"
                  : "Add your first student to get started"}
              </p>
              {!searchTerm && !filterClass && filterStatus === "active" && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl shadow-md transition-all"
                >
                  <FaPlus />
                  Add Student
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table
                  className={`min-w-full divide-y ${
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  <thead className={isDark ? "bg-gray-900/50" : "bg-gray-50"}>
                    <tr>
                      <th className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.length === students.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Student
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
                        Contact
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Guardian
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
                    {students.map((student) => (
                      <tr
                        key={student._id}
                        className={`transition-colors ${
                          isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => toggleSelectStudent(student._id)}
                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                student.gender === "male"
                                  ? isDark
                                    ? "bg-blue-900/30 text-blue-400"
                                    : "bg-blue-100 text-blue-700"
                                  : isDark
                                  ? "bg-pink-900/30 text-pink-400"
                                  : "bg-pink-100 text-pink-700"
                              }`}
                            >
                              {student.gender === "male" ? (
                                <FaMale />
                              ) : (
                                <FaFemale />
                              )}
                            </div>
                            <div>
                              <div
                                className={`text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {student.fullName}
                              </div>
                              <div
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                Roll: {student.rollNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {student.class?.name || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {student.email && (
                              <div className="flex items-center gap-2 text-xs">
                                <FaEnvelope
                                  className={
                                    isDark ? "text-gray-500" : "text-gray-400"
                                  }
                                />
                                <span
                                  className={
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }
                                >
                                  {student.email}
                                </span>
                              </div>
                            )}
                            {student.phone && (
                              <div className="flex items-center gap-2 text-xs">
                                <FaPhone
                                  className={
                                    isDark ? "text-gray-500" : "text-gray-400"
                                  }
                                />
                                <span
                                  className={
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }
                                >
                                  {student.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {student.guardians &&
                            student.guardians.length > 0 && (
                              <div>
                                <div
                                  className={`text-sm ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {student.guardians[0].name}
                                </div>
                                <div
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {student.guardians[0].phone}
                                </div>
                              </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(student.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/students/${student._id}`)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                isDark
                                  ? "text-purple-400 hover:bg-purple-900/20"
                                  : "text-purple-600 hover:bg-purple-50"
                              }`}
                            >
                              <FaEye />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(student)}
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
                              onClick={() => handleDelete(student._id)}
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

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div
                  className={`px-6 py-4 border-t flex items-center justify-between ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page - 1,
                      })
                    }
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      pagination.page === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-700"
                    } ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Previous
                  </button>
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page + 1,
                      })
                    }
                    disabled={pagination.page === pagination.pages}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      pagination.page === pagination.pages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-700"
                    } ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {showModal && (
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
              className={`p-6 border-b sticky top-0 z-10 ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-purple-900/20 to-pink-900/20"
                  : "border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                    <FaUserGraduate className="text-white text-xl" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingId ? "Edit Student" : "Add New Student"}
                    </h3>
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Fill in the student information
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
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
              onSubmit={handleSubmit}
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                      Gender *
                    </label>
                    <select
                      required
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.dob}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setForm({ ...form, dob: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                      Blood Group
                    </label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) =>
                        setForm({ ...form, bloodGroup: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="">Select Blood Group</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Academic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Admission Number
                      <span className="text-xs text-gray-500 ml-2">
                        (Auto-generated)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={form.admissionNumber || ""}
                      onChange={(e) =>
                        setForm({ ...form, admissionNumber: e.target.value })
                      }
                      placeholder="Will be auto-generated if empty"
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                      Class *
                    </label>
                    <select
                      required
                      value={form.class}
                      onChange={(e) =>
                        setForm({ ...form, class: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name || `${cls.grade} - ${cls.section}`}
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
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.rollNumber}
                      onChange={(e) =>
                        setForm({ ...form, rollNumber: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Guardian Information *
                  </h4>
                  <button
                    type="button"
                    onClick={addGuardian}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <FaPlus />
                    Add Guardian
                  </button>
                </div>

                {form.guardians.map((guardian, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-4 rounded-xl border ${
                      isDark
                        ? "border-gray-600 bg-gray-700/50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h5
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Guardian {index + 1}
                      </h5>
                      {form.guardians.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGuardian(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={guardian.name}
                          onChange={(e) =>
                            updateGuardian(index, "name", e.target.value)
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                          Relationship *
                        </label>
                        <select
                          required
                          value={guardian.relationship}
                          onChange={(e) =>
                            updateGuardian(
                              index,
                              "relationship",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                            isDark
                              ? "border-gray-600 bg-gray-700 text-white"
                              : "border-gray-300 bg-white text-gray-900"
                          }`}
                        >
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="guardian">Guardian</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={guardian.phone}
                          onChange={(e) =>
                            updateGuardian(index, "phone", e.target.value)
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                          Email
                        </label>
                        <input
                          type="email"
                          value={guardian.email}
                          onChange={(e) =>
                            updateGuardian(index, "email", e.target.value)
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                          Occupation
                        </label>
                        <input
                          type="text"
                          value={guardian.occupation}
                          onChange={(e) =>
                            updateGuardian(index, "occupation", e.target.value)
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                            isDark
                              ? "border-gray-600 bg-gray-700 text-white"
                              : "border-gray-300 bg-white text-gray-900"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Medical Information */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Medical Information
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Medical Conditions
                    </label>
                    <textarea
                      value={form.medicalConditions}
                      onChange={(e) =>
                        setForm({ ...form, medicalConditions: e.target.value })
                      }
                      rows={2}
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
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
                      Allergies
                    </label>
                    <textarea
                      value={form.allergies}
                      onChange={(e) =>
                        setForm({ ...form, allergies: e.target.value })
                      }
                      rows={2}
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
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
                    setShowModal(false);
                    resetForm();
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
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-md transition-all ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  }`}
                >
                  <FaSave />
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Student"
                    : "Create Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && statistics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            className={`rounded-2xl max-w-4xl w-full shadow-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-purple-900/20 to-pink-900/20"
                  : "border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Student Statistics
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Overview of student data
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

            <div className="p-6">
              {/* Overall Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <div
                      className={`text-3xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {statistics.total}
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
                  className={`p-6 rounded-xl border border-green-200 ${
                    isDark ? "bg-green-900/20" : "bg-green-50"
                  }`}
                >
                  <div className="text-center">
                    <FaCheckCircle
                      className={`mx-auto text-3xl mb-2 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <div
                      className={`text-3xl font-bold ${
                        isDark ? "text-green-400" : "text-green-700"
                      }`}
                    >
                      {statistics.active}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      Active
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border border-blue-200 ${
                    isDark ? "bg-blue-900/20" : "bg-blue-50"
                  }`}
                >
                  <div className="text-center">
                    <FaMale
                      className={`mx-auto text-3xl mb-2 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <div
                      className={`text-3xl font-bold ${
                        isDark ? "text-blue-400" : "text-blue-700"
                      }`}
                    >
                      {statistics.male}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      Male
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border border-pink-200 ${
                    isDark ? "bg-pink-900/20" : "bg-pink-50"
                  }`}
                >
                  <div className="text-center">
                    <FaFemale
                      className={`mx-auto text-3xl mb-2 ${
                        isDark ? "text-pink-400" : "text-pink-600"
                      }`}
                    />
                    <div
                      className={`text-3xl font-bold ${
                        isDark ? "text-pink-400" : "text-pink-700"
                      }`}
                    >
                      {statistics.female}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isDark ? "text-pink-400" : "text-pink-600"
                      }`}
                    >
                      Female
                    </div>
                  </div>
                </div>
              </div>

              {/* Class-wise Distribution */}
              {statistics.classCounts && statistics.classCounts.length > 0 && (
                <div>
                  <h4
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Class-wise Distribution
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {statistics.classCounts.map((item) => (
                      <div
                        key={item._id}
                        className={`p-4 rounded-xl border ${
                          isDark
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className={`text-2xl font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.count}
                          </div>
                          <div
                            className={`text-sm mt-1 ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.className}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
