// ============================================
// COMPLETE TEACHER MANAGEMENT COMPONENT
// WITH ALL MODALS FULLY IMPLEMENTED
// ============================================

import React, { useEffect, useState } from "react";
import {
  listTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  getStatistics,
  getDepartments,
  bulkUpdateStatus,
  bulkDelete,
} from "../../api/teacherApi";
import { listSubjects } from "../../api/subjectApi";
import { listClasses } from "../../api/classApi";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import {
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
  FaMale,
  FaFemale,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaClock,
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// Status options
const STATUS_OPTIONS = [
  { value: "Active", label: "Active", color: "green" },
  { value: "Inactive", label: "Inactive", color: "gray" },
  { value: "On Leave", label: "On Leave", color: "yellow" },
  { value: "Resigned", label: "Resigned", color: "red" },
  { value: "Terminated", label: "Terminated", color: "red" },
];

// Employment types
const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "visiting", label: "Visiting" },
];

// Blood groups
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function TeacherManagement({ isDark }) {
  const { role } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterEmploymentType, setFilterEmploymentType] = useState("");
  const [filterGender, setFilterGender] = useState("");
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
    alternatePhone: "",
    gender: "Male",
    dob: "",
    bloodGroup: "",
    nationality: "Indian",
    maritalStatus: "",
    currentAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    emergencyContacts: [], // ✅ CHANGE: Start with empty array
    qualifications: [""],
    experience: 0,
    previousSchool: "",
    employmentType: "full-time",
    department: "",
    designation: "",
    dateJoined: new Date().toISOString().split("T")[0],
    subjects: [],
    classes: [],
    isClassTeacher: false,
    classTeacherOf: "", // ✅ This will be cleaned in handleSubmit
    status: "Active",
  });

  // Fetch initial data
  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [
    pagination.page,
    searchTerm,
    filterStatus,
    filterDepartment,
    filterEmploymentType,
    filterGender,
  ]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      };

      if (filterStatus) params.status = filterStatus;
      if (filterDepartment) params.department = filterDepartment;
      if (filterEmploymentType) params.employmentType = filterEmploymentType;
      if (filterGender) params.gender = filterGender;

      const res = await listTeachers(params);
      const data = res.data || res;

      setTeachers(data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await listSubjects();
      const data = res.data || res;
      setSubjects(data.data || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await listClasses();
      const data = res.data || res;
      setClasses(data.data || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      const data = res.data || res;
      setDepartments(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const res = await getStatistics();
      setStatistics(res.data.data);
      setShowStatsModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTeacher = async (id) => {
    try {
      setLoading(true);
      const res = await getTeacherById(id);
      setViewingTeacher(res.data.data);
      setShowViewModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load teacher details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.fullName || !form.email || !form.gender) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // ✅ CLEAN UP DATA BEFORE SENDING
      const cleanedForm = {
        ...form,
        // Filter out empty qualifications
        qualifications: form.qualifications.filter((q) => q.trim() !== ""),

        // ✅ FIX: Remove empty classTeacherOf
        classTeacherOf: form.classTeacherOf || undefined,

        // ✅ FIX: Filter out empty emergency contacts
        emergencyContacts: form.emergencyContacts.filter(
          (contact) => contact.name && contact.relationship && contact.phone
        ),

        // ✅ FIX: Filter out empty arrays
        subjects: form.subjects.filter((s) => s),
        classes: form.classes.filter((c) => c),
      };

      // ✅ FIX: Remove classTeacherOf if empty
      if (!cleanedForm.classTeacherOf) {
        delete cleanedForm.classTeacherOf;
      }

      // ✅ FIX: If no emergency contacts, set to empty array
      if (cleanedForm.emergencyContacts.length === 0) {
        cleanedForm.emergencyContacts = [];
      }

      if (editingId) {
        await updateTeacher(editingId, cleanedForm);
        toast.success("Teacher updated successfully");
      } else {
        await createTeacher(cleanedForm);
        toast.success("Teacher created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchTeachers();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (teacher) => {
    setEditingId(teacher._id);
    setForm({
      fullName: teacher.fullName || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      alternatePhone: teacher.alternatePhone || "",
      gender: teacher.gender || "Male",
      dob: teacher.dob ? new Date(teacher.dob).toISOString().split("T")[0] : "",
      bloodGroup: teacher.bloodGroup || "",
      nationality: teacher.nationality || "Indian",
      maritalStatus: teacher.maritalStatus || "",
      currentAddress: teacher.currentAddress || {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      emergencyContacts:
        teacher.emergencyContacts && teacher.emergencyContacts.length > 0
          ? teacher.emergencyContacts
          : [{ name: "", relationship: "", phone: "" }],
      qualifications:
        teacher.qualifications && teacher.qualifications.length > 0
          ? teacher.qualifications
          : [""],
      experience: teacher.experience || 0,
      previousSchool: teacher.previousSchool || "",
      employmentType: teacher.employmentType || "full-time",
      department: teacher.department || "",
      designation: teacher.designation || "",
      dateJoined: teacher.dateJoined
        ? new Date(teacher.dateJoined).toISOString().split("T")[0]
        : "",
      subjects: teacher.subjects?.map((s) => s._id || s) || [],
      classes: teacher.classes?.map((c) => c._id || c) || [],
      isClassTeacher: teacher.isClassTeacher || false,
      classTeacherOf:
        teacher.classTeacherOf?._id || teacher.classTeacherOf || "",
      status: teacher.status || "Active",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    try {
      await deleteTeacher(id);
      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete teacher");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTeachers.length === 0) {
      toast.error("No teachers selected");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedTeachers.length} teacher(s)?`
      )
    )
      return;

    try {
      await bulkDelete(selectedTeachers);
      toast.success(`${selectedTeachers.length} teachers deleted successfully`);
      setSelectedTeachers([]);
      fetchTeachers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete teachers");
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedTeachers.length === 0) {
      toast.error("No teachers selected");
      return;
    }

    try {
      await bulkUpdateStatus({
        teacherIds: selectedTeachers,
        status,
        reason: `Bulk status update to ${status}`,
      });
      toast.success(`${selectedTeachers.length} teachers updated successfully`);
      setSelectedTeachers([]);
      fetchTeachers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update teachers");
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = teachers.map((teacher) => ({
        "Employee ID": teacher.employeeId || "N/A",
        Name: teacher.fullName,
        Email: teacher.email,
        Phone: teacher.phone || "N/A",
        Gender: teacher.gender,
        Department: teacher.department || "N/A",
        Designation: teacher.designation || "N/A",
        "Employment Type": teacher.employmentType,
        Experience: teacher.experience || 0,
        Qualifications: teacher.qualifications?.join(", ") || "N/A",
        Status: teacher.status,
        "Date Joined": teacher.dateJoined
          ? new Date(teacher.dateJoined).toLocaleDateString()
          : "N/A",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws["!cols"] = [
        { wch: 12 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
        { wch: 30 },
        { wch: 12 },
        { wch: 15 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Teachers");

      const filename = `Teachers_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success("Excel file exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export");
    }
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        let successCount = 0;
        let errorCount = 0;

        for (const row of jsonData) {
          try {
            const teacherData = {
              fullName: row["Name"],
              email: row["Email"],
              phone: row["Phone"],
              gender: row["Gender"] || "Male",
              department: row["Department"],
              designation: row["Designation"],
              employmentType: row["Employment Type"] || "full-time",
              experience: parseInt(row["Experience"]) || 0,
              qualifications: row["Qualifications"]
                ? row["Qualifications"].split(",").map((q) => q.trim())
                : [],
              status: row["Status"] || "Active",
            };

            await createTeacher(teacherData);
            successCount++;
          } catch (err) {
            console.error("Error importing row:", row, err);
            errorCount++;
          }
        }

        toast.success(
          `Import complete: ${successCount} success, ${errorCount} failed`
        );
        fetchTeachers();
      } catch (err) {
        console.error(err);
        toast.error("Failed to import file");
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = null; // Reset file input
  };

  const resetForm = () => {
  setEditingId(null);
  setForm({
    fullName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    gender: "Male",
    dob: "",
    bloodGroup: "",
    nationality: "Indian",
    maritalStatus: "",
    currentAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    emergencyContacts: [],  // ✅ Empty array
    qualifications: [""],
    experience: 0,
    previousSchool: "",
    employmentType: "full-time",
    department: "",
    designation: "",
    dateJoined: new Date().toISOString().split("T")[0],
    subjects: [],
    classes: [],
    isClassTeacher: false,
    classTeacherOf: "",
    status: "Active",
  });
};

  const addQualification = () => {
    setForm({
      ...form,
      qualifications: [...form.qualifications, ""],
    });
  };

  const removeQualification = (index) => {
    const newQuals = form.qualifications.filter((_, i) => i !== index);
    setForm({ ...form, qualifications: newQuals });
  };

  const updateQualification = (index, value) => {
    const newQuals = [...form.qualifications];
    newQuals[index] = value;
    setForm({ ...form, qualifications: newQuals });
  };

  const addEmergencyContact = () => {
    setForm({
      ...form,
      emergencyContacts: [
        ...form.emergencyContacts,
        { name: "", relationship: "", phone: "" },
      ],
    });
  };

  const removeEmergencyContact = (index) => {
    const newContacts = form.emergencyContacts.filter((_, i) => i !== index);
    setForm({ ...form, emergencyContacts: newContacts });
  };

  const updateEmergencyContact = (index, field, value) => {
    const newContacts = [...form.emergencyContacts];
    newContacts[index][field] = value;
    setForm({ ...form, emergencyContacts: newContacts });
  };

  const toggleSelectTeacher = (id) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTeachers.length === teachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(teachers.map((t) => t._id));
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
      yellow: isDark
        ? "bg-yellow-900/30 text-yellow-400 border-yellow-800"
        : "bg-yellow-100 text-yellow-700 border-yellow-200",
      red: isDark
        ? "bg-red-900/30 text-red-400 border-red-800"
        : "bg-red-100 text-red-700 border-red-200",
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
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                <FaChalkboardTeacher className="text-white text-2xl" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Teacher Management
                </h1>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Manage teacher information and assignments
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {selectedTeachers.length > 0 && (
                <>
                  <button
                    onClick={() => handleBulkStatusUpdate("Active")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md transition-all"
                  >
                    <FaCheckCircle />
                    Activate ({selectedTeachers.length})
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate("Inactive")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium shadow-md transition-all"
                  >
                    <FaClock />
                    Deactivate
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-md transition-all"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={fetchStatistics}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md transition-all"
              >
                <FaChartBar />
                Statistics
              </button>
              <label className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-md transition-all cursor-pointer">
                <FaUpload />
                Import
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportExcel}
                disabled={teachers.length === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-md transition-all ${
                  teachers.length === 0
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
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md transition-all"
              >
                <FaPlus />
                Add Teacher
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

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Employment Type Filter */}
            <select
              value={filterEmploymentType}
              onChange={(e) => setFilterEmploymentType(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="">All Types</option>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Gender Filter */}
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Teacher Table */}
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
                  Teachers ({pagination.total})
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Page {pagination.page} of {pagination.pages}
                </p>
              </div>

              {teachers.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.length === teachers.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p
                className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Loading teachers...
              </p>
            </div>
          ) : teachers.length === 0 ? (
            <div className="p-16 text-center">
              <FaChalkboardTeacher
                className={`mx-auto text-5xl mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                No teachers found
              </h3>
              <p
                className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {searchTerm || filterStatus || filterDepartment
                  ? "Try adjusting your filters"
                  : "Add your first teacher to get started"}
              </p>
              {!searchTerm && !filterStatus && !filterDepartment && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl shadow-md transition-all"
                >
                  <FaPlus />
                  Add Teacher
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
                          checked={selectedTeachers.length === teachers.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Teacher
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
                        Department
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Experience
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
                    {teachers.map((teacher) => (
                      <tr
                        key={teacher._id}
                        className={`transition-colors ${
                          isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedTeachers.includes(teacher._id)}
                            onChange={() => toggleSelectTeacher(teacher._id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                teacher.gender === "Male"
                                  ? isDark
                                    ? "bg-blue-900/30 text-blue-400"
                                    : "bg-blue-100 text-blue-700"
                                  : isDark
                                  ? "bg-pink-900/30 text-pink-400"
                                  : "bg-pink-100 text-pink-700"
                              }`}
                            >
                              {teacher.gender === "Male" ? (
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
                                {teacher.fullName}
                              </div>
                              <div
                                className={`text-xs flex items-center gap-1 ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                <FaIdCard className="text-xs" />
                                {teacher.employeeId || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
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
                                {teacher.email}
                              </span>
                            </div>
                            {teacher.phone && (
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
                                  {teacher.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {teacher.department || "N/A"}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {teacher.designation || ""}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaBriefcase
                              className={
                                isDark ? "text-gray-500" : "text-gray-400"
                              }
                            />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {teacher.experience || 0} years
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(teacher.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleViewTeacher(teacher._id)}
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
                              onClick={() => handleEdit(teacher)}
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
                              onClick={() => handleDelete(teacher._id)}
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

      {/* Add/Edit Teacher Modal */}
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
                  ? "border-gray-700 bg-gradient-to-r from-blue-900/20 to-cyan-900/20"
                  : "border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                    <FaChalkboardTeacher className="text-white text-xl" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingId ? "Edit Teacher" : "Add New Teacher"}
                    </h3>
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Fill in the teacher information
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
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.dob}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setForm({ ...form, dob: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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

              {/* Employment Details */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Employment Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      Designation
                    </label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={(e) =>
                        setForm({ ...form, designation: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      Employment Type
                    </label>
                    <select
                      value={form.employmentType}
                      onChange={(e) =>
                        setForm({ ...form, employmentType: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      {EMPLOYMENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
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
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.experience}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          experience: parseInt(e.target.value) || 0,
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      Date Joined
                    </label>
                    <input
                      type="date"
                      value={form.dateJoined}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setForm({ ...form, dateJoined: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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

              {/* Qualifications */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Qualifications
                  </h4>
                  <button
                    type="button"
                    onClick={addQualification}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <FaPlus />
                    Add Qualification
                  </button>
                </div>

                {form.qualifications.map((qual, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={qual}
                      onChange={(e) =>
                        updateQualification(index, e.target.value)
                      }
                      placeholder="e.g., B.Ed, M.A in English"
                      className={`flex-1 px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                    {form.qualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Address */}
              <div>
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Current Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={form.currentAddress.street}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          currentAddress: {
                            ...form.currentAddress,
                            street: e.target.value,
                          },
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      City
                    </label>
                    <input
                      type="text"
                      value={form.currentAddress.city}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          currentAddress: {
                            ...form.currentAddress,
                            city: e.target.value,
                          },
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      State
                    </label>
                    <input
                      type="text"
                      value={form.currentAddress.state}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          currentAddress: {
                            ...form.currentAddress,
                            state: e.target.value,
                          },
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={form.currentAddress.pincode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          currentAddress: {
                            ...form.currentAddress,
                            pincode: e.target.value,
                          },
                        })
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  }`}
                >
                  <FaSave />
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Teacher"
                    : "Create Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Teacher Modal */}
      {showViewModal && viewingTeacher && (
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
                  ? "border-gray-700 bg-gradient-to-r from-blue-900/20 to-cyan-900/20"
                  : "border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                      viewingTeacher.gender === "Male"
                        ? isDark
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-blue-100 text-blue-700"
                        : isDark
                        ? "bg-pink-900/30 text-pink-400"
                        : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {viewingTeacher.gender === "Male" ? (
                      <FaMale />
                    ) : (
                      <FaFemale />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {viewingTeacher.fullName}
                    </h3>
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {viewingTeacher.employeeId || "No Employee ID"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingTeacher(null);
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
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
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
                  <div className="flex items-center gap-3">
                    <FaEnvelope
                      className={isDark ? "text-gray-500" : "text-gray-400"}
                    />
                    <div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Email
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {viewingTeacher.email}
                      </div>
                    </div>
                  </div>

                  {viewingTeacher.phone && (
                    <div className="flex items-center gap-3">
                      <FaPhone
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                      <div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Phone
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {viewingTeacher.phone}
                        </div>
                      </div>
                    </div>
                  )}

                  {viewingTeacher.dateJoined && (
                    <div className="flex items-center gap-3">
                      <FaBriefcase
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                      <div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Date Joined
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {new Date(
                            viewingTeacher.dateJoined
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <FaIdCard
                      className={isDark ? "text-gray-500" : "text-gray-400"}
                    />
                    <div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Status
                      </div>
                      <div className="mt-1">
                        {getStatusBadge(viewingTeacher.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              {(viewingTeacher.department || viewingTeacher.designation) && (
                <div>
                  <h4
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Employment Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingTeacher.department && (
                      <div>
                        <div
                          className={`text-xs mb-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Department
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {viewingTeacher.department}
                        </div>
                      </div>
                    )}

                    {viewingTeacher.designation && (
                      <div>
                        <div
                          className={`text-xs mb-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Designation
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {viewingTeacher.designation}
                        </div>
                      </div>
                    )}

                    {viewingTeacher.employmentType && (
                      <div>
                        <div
                          className={`text-xs mb-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Employment Type
                        </div>
                        <div
                          className={`text-sm capitalize ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {viewingTeacher.employmentType}
                        </div>
                      </div>
                    )}

                    {viewingTeacher.experience !== undefined && (
                      <div>
                        <div
                          className={`text-xs mb-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Experience
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {viewingTeacher.experience} years
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Qualifications */}
              {viewingTeacher.qualifications &&
                viewingTeacher.qualifications.length > 0 && (
                  <div>
                    <h4
                      className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <FaGraduationCap />
                      Qualifications
                    </h4>
                    <ul
                      className={`space-y-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {viewingTeacher.qualifications.map((qual, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Address */}
              {viewingTeacher.currentAddress && (
                <div>
                  <h4
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <FaMapMarkerAlt />
                    Address
                  </h4>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {[
                      viewingTeacher.currentAddress.street,
                      viewingTeacher.currentAddress.city,
                      viewingTeacher.currentAddress.state,
                      viewingTeacher.currentAddress.pincode,
                      viewingTeacher.currentAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`p-6 border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingTeacher(null);
                  }}
                  className={`px-6 py-2.5 rounded-xl border font-medium transition-all ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingTeacher);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium shadow-md transition-all"
                >
                  <FaEdit />
                  Edit Teacher
                </button>
              </div>
            </div>
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
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-blue-900/20 to-cyan-900/20"
                  : "border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Teacher Statistics
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Overview of teacher data
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
                        isDark ? "text-blue-400" : "text-blue-600"
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
                      Total Teachers
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

              {/* Department-wise Distribution */}
              {statistics.departmentCounts &&
                statistics.departmentCounts.length > 0 && (
                  <div>
                    <h4
                      className={`text-lg font-semibold mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Department-wise Distribution
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {statistics.departmentCounts.map((item) => (
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
                              {item._id}
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
