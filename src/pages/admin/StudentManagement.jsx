import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  BookOpen,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileText,
  UserCheck,
} from "lucide-react";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../api/studentApi";

const StudentManagement = ({ isDark }) => {
  // Remove mockStudents and use API data
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    className: "",
    phone: "",
    gender: "",
    dob: "",
    address: "", // <-- use 'address'
    guardianName: "",
    guardianPhoneNumber: "",
  });

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getAllStudents();

      setStudents(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch students.");
    }
    setLoading(false);
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNumber.toString().includes(searchTerm)
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(
        (student) => student.className === selectedClass
      );
    }

    if (selectedGender) {
      filtered = filtered.filter(
        (student) => student.gender === selectedGender
      );
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedGender, students]);

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Get unique classes and genders for filters
  const uniqueClasses = [
    ...new Set(students.map((student) => student.className)),
  ];
  const uniqueGenders = [...new Set(students.map((student) => student.gender))];

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      rollNumber: "",
      className: "",
      phone: "",
      gender: "",
      dob: "",
      address: "",
      guardianName: "",
      guardianPhoneNumber: "",
    });
  };

  // CREATE
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createStudent(formData);
      setStudents([res.data, ...students]);
      setSuccess("Student added successfully!");
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to add student. Please try again.");
    }

    setLoading(false);
  };

  // UPDATE
  const handleEditStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateStudent(selectedStudent._id, formData);
      const updatedStudents = students.map((student) =>
        student._id === selectedStudent._id ? res.data : student
      );
      setStudents(updatedStudents);
      setSuccess("Student updated successfully!");
      setShowEditModal(false);
      setSelectedStudent(null);
      resetForm();
    } catch (err) {
      setError("Failed to update student. Please try again.");
    }
    setLoading(false);
  };

  // DELETE
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setLoading(true);
      try {
        await deleteStudent(studentId);
        setStudents(students.filter((student) => student._id !== studentId));
        setSuccess("Student deleted successfully!");
      } catch (err) {
        setError("Failed to delete student. Please try again.");
      }
      setLoading(false);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      rollNumber: student.rollNumber,
      className: student.className,
      phone: student.phone,
      gender: student.gender,
      dob: student.dob,
      address: student.address,
      guardianName: student.guardianName,
      guardianPhoneNumber: student.guardianPhoneNumber,
    });
    setShowEditModal(true);
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header Section */}
      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b p-6`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Student Management
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Manage student records, enrollment, and information
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium cursor-pointer"
            >
              <Plus size={20} />
              Add Student
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium">
              <Upload size={20} />
              Import
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium">
              <Download size={20} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {(success || error) && (
        <div
          className={`mx-6 mt-4 p-4 rounded-xl ${
            success
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700"
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-700"
          }`}
        >
          <div className="flex items-center">
            {success ? (
              <Check className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span
              className={`${
                success
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {success || error}
            </span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div
        className={`mx-6 mt-6 p-6 rounded-2xl shadow-sm ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDark ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-colors ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
              } focus:ring-2 focus:border-transparent`}
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className={`px-4 py-2 rounded-lg border cursor-pointer ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <option value="">All Classes</option>
            {uniqueClasses.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className={`px-4 py-2 rounded-lg border cursor-pointer ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <option value="">All Genders</option>
            {uniqueGenders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedClass("");
                setSelectedGender("");
              }}
              className={`px-4 py-2 rounded-lg border cursor-pointer ${
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

      {/* Students Table */}
      <div
        className={`mx-6 mt-6 rounded-2xl shadow-sm overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Student
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Roll Number
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Class
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Contact
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Enrolled
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {currentStudents.map((student) => (
                <tr
                  key={student._id}
                  className={`transition-colors ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <User
                          className={`h-5 w-5 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="ml-4">
                        <div
                          className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {student.fullName}
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isDark
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {student.className}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    <div>{student.phone}</div>
                    <div className="text-xs">{student.gender}</div>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {new Date(student.enrolledDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(student)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(student)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-green-400 hover:bg-green-900/20"
                            : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between px-6 py-3 border-t ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Showing {indexOfFirstStudent + 1} to{" "}
              {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? isDark
                      ? "text-gray-600"
                      : "text-gray-400"
                    : isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : isDark
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? isDark
                      ? "text-gray-600"
                      : "text-gray-400"
                    : isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add New Student
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddStudent} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
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
                    type="number"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Class Name
                  </label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  >
                    <option value="">Select Gender</option>
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
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Guardian Phone
                  </label>
                  <input
                    type="tel"
                    name="guardianPhoneNumber"
                    value={formData.guardianPhoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Address
                  </label>
                  <textarea
                    name="adress" // Corrected from 'address' to 'adress' to match schema
                    value={formData.adress}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Student"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className={`px-6 py-3 rounded-xl border font-medium transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Edit Student
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudent(null);
                    resetForm();
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditStudent} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
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
                    type="number"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Class
                  </label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="e.g., 10-A"
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  >
                    <option value="">Select Gender</option>
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
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Guardian Phone
                  </label>
                  <input
                    type="tel"
                    name="guardianPhoneNumber"
                    value={formData.guardianPhoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:border-transparent`}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Student"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudent(null);
                    resetForm();
                  }}
                  className={`px-6 py-3 rounded-xl border font-medium transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Student Details
                </h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedStudent(null);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 text-center mb-6">
                  <div
                    className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <User
                      className={`w-12 h-12 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.fullName}
                  </h3>
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Roll Number: {selectedStudent.rollNumber}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Mail
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.email}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <BookOpen
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Class
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.className}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Phone
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Phone
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <User
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Gender
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.gender || "Not specified"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Calendar
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Date of Birth
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.dob
                      ? new Date(selectedStudent.dob).toLocaleDateString()
                      : "Not provided"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Calendar
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Enrolled Date
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {new Date(
                      selectedStudent.enrolledDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <UserCheck
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Guardian Name
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.guardianName || "Not provided"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Phone
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Guardian Phone
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.guardianPhoneNumber || "Not provided"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    <MapPin
                      className={`w-5 h-5 mr-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Address
                    </span>
                  </div>
                  <p
                    className={`ml-7 ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedStudent.address || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedStudent);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Edit Student
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedStudent(null);
                  }}
                  className={`px-6 py-3 rounded-xl border font-medium transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
