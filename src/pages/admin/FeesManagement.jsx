import React, { useEffect, useState } from "react";
import { getFees, createFee, updateFee, deleteFee } from "../../api/feesApi";
import { listStudents } from "../../api/studentApi";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx"; // ✅ NEW: Excel export library
import {
  FaMoneyBillWave,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaDollarSign,
  FaCalendarAlt,
  FaUser,
  FaReceipt,
  FaDownload, // ✅ NEW: Download icon
  FaSave,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// ✅ NEW: Month options for dropdown
const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// ✅ NEW: Helper function to format month display
const formatMonth = (monthStr) => {
  if (!monthStr) return "N/A";
  const [year, month] = monthStr.split("-");
  const monthName = MONTHS.find(m => m.value === month)?.label || "";
  return `${monthName} ${year}`;
};

export default function FeesManagement({ isDark }) {
  const { role, user } = useAuth();
  const [fees, setFees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // ✅ NEW: Track editing
  const [form, setForm] = useState({ 
    student: "", 
    amount: "", 
    dueDate: "", 
    month: "", // ✅ NEW: Month field
    feeType: "tuition", // ✅ NEW: Fee type field
    status: "pending" 
  });
  const [loading, setLoading] = useState(false);
  const [studentsMap, setStudentsMap] = useState({});
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all"); // ✅ NEW: Month filter

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await getFees();
      const data = res.data || res;
      setFees(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await listStudents();
      const arr = res.data || res;
      setStudents(arr || []);
      const map = {};
      (arr || []).forEach((s) => {
        map[s._id] = s;
      });
      setStudentsMap(map);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ NEW: Generate current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const payload = {
        amount: parseFloat(form.amount),
        dueDate: form.dueDate,
        month: form.month, // ✅ NEW: Include month
        feeType: form.feeType, // ✅ NEW: Include fee type
        status: form.status,
      };
      
      if (role !== "student") {
        if (!form.student) {
          toast.error("Please select a student");
          return;
        }
        payload.student = form.student;
      }

      if (editingId) {
        // ✅ NEW: Update existing fee
        await updateFee(editingId, payload);
        toast.success("Fee record updated successfully");
        setEditingId(null);
      } else {
        // Create new fee
        await createFee(payload);
        toast.success("Fee record created successfully");
      }

      setShowModal(false);
      setForm({ 
        student: "", 
        amount: "", 
        dueDate: "", 
        month: "",
        feeType: "tuition",
        status: "pending" 
      });
      fetchFees();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save fee");
    }
  };

  // ✅ NEW: Handle edit button click
  const handleEdit = (fee) => {
    setEditingId(fee._id);
    setForm({
      student: fee.student?._id || "",
      amount: fee.amount,
      dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : "",
      month: fee.month || "",
      feeType: fee.feeType || "tuition",
      status: fee.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this fee record?")) return;
    try {
      await deleteFee(id);
      toast.success("Deleted successfully");
      fetchFees();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to delete");
    }
  };

  // ✅ NEW: Export to Excel function
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredFees.map((fee) => {
        const student = fee.student; // ✅ FIXED: Use fee.student directly
        return {
          "Student Name": student?.fullName || "N/A",
          "Roll Number": student?.rollNumber || "N/A",
          "Fee Type": fee.feeType || "N/A",
          "Month": formatMonth(fee.month),
          "Amount": `$${parseFloat(fee.amount).toFixed(2)}`,
          "Paid Amount": `$${parseFloat(fee.paidAmount || 0).toFixed(2)}`,
          "Balance": `$${(fee.amount - (fee.paidAmount || 0)).toFixed(2)}`,
          "Due Date": fee.dueDate
            ? new Date(fee.dueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A",
          "Status": fee.status,
          "Created At": new Date(fee.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        };
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      ws["!cols"] = [
        { wch: 20 }, // Student Name
        { wch: 12 }, // Roll Number
        { wch: 12 }, // Fee Type
        { wch: 15 }, // Month
        { wch: 12 }, // Amount
        { wch: 12 }, // Paid Amount
        { wch: 12 }, // Balance
        { wch: 15 }, // Due Date
        { wch: 10 }, // Status
        { wch: 15 }, // Created At
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Fee Records");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `Fee_Records_${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export to Excel");
    }
  };

  // Calculate stats
  const totalAmount = fees.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
  const paidAmount = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
  const pendingAmount = fees
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
  const overdueAmount = fees
    .filter((f) => f.status === "overdue")
    .reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);

  // ✅ FIXED: Filter fees - use fee.student instead of fee.studentId
  const filteredFees = fees.filter((fee) => {
    const student = fee.student; // ✅ FIXED: Access populated student object
    const matchesSearch =
      !searchTerm ||
      student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || fee.status === filterStatus;
    const matchesMonth = filterMonth === "all" || fee.month === filterMonth; // ✅ NEW: Month filter
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const getStatusBadge = (status) => {
    const configs = {
      paid: {
        icon: FaCheckCircle,
        text: "Paid",
        lightClass: "bg-green-100 text-green-700 border-green-200",
        darkClass: "bg-green-900/30 text-green-400 border-green-800",
      },
      pending: {
        icon: FaClock,
        text: "Pending",
        lightClass: "bg-yellow-100 text-yellow-700 border-yellow-200",
        darkClass: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
      },
      partial: { // ✅ NEW: Partial status
        icon: FaClock,
        text: "Partial",
        lightClass: "bg-blue-100 text-blue-700 border-blue-200",
        darkClass: "bg-blue-900/30 text-blue-400 border-blue-800",
      },
      overdue: {
        icon: FaExclamationCircle,
        text: "Overdue",
        lightClass: "bg-rose-100 text-rose-700 border-rose-200",
        darkClass: "bg-rose-900/30 text-rose-400 border-rose-800",
      },
      waived: { // ✅ NEW: Waived status
        icon: FaCheckCircle,
        text: "Waived",
        lightClass: "bg-gray-100 text-gray-700 border-gray-200",
        darkClass: "bg-gray-900/30 text-gray-400 border-gray-800",
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${
          isDark ? config.darkClass : config.lightClass
        }`}
      >
        <Icon className="text-sm" />
        {config.text}
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
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                <FaMoneyBillWave className="text-white text-2xl" />
              </div>
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Fee Management
                </h1>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Track and manage student fee payments
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {/* ✅ NEW: Export to Excel button */}
              <button
                onClick={exportToExcel}
                disabled={filteredFees.length === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 ${
                  filteredFees.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg"
                }`}
              >
                <FaDownload className="text-sm" />
                <span className="hidden sm:inline">Export Excel</span>
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ 
                    student: "", 
                    amount: "", 
                    dueDate: "", 
                    month: getCurrentMonth(), // ✅ NEW: Set current month as default
                    feeType: "tuition",
                    status: "pending" 
                  });
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <FaPlus className="text-sm" />
                <span className="hidden sm:inline">Add Fee Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                  Total Amount
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <FaDollarSign
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
                  Paid
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${paidAmount.toFixed(2)}
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
                  Pending
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${pendingAmount.toFixed(2)}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark ? "bg-yellow-900/30" : "bg-yellow-100"
                }`}
              >
                <FaClock
                  className={`text-2xl ${
                    isDark ? "text-yellow-400" : "text-yellow-600"
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
                  Overdue
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${overdueAmount.toFixed(2)}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark ? "bg-rose-900/30" : "bg-rose-100"
                }`}
              >
                <FaExclamationCircle
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
            <FaFilter className={isDark ? "text-gray-400" : "text-gray-600"} />
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Filters
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search by student name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
              <option value="waived">Waived</option>
            </select>
            {/* ✅ NEW: Month filter */}
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className={`px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="all">All Months</option>
              {MONTHS.map((m) => {
                const currentYear = new Date().getFullYear();
                const monthValue = `${currentYear}-${m.value}`;
                return (
                  <option key={monthValue} value={monthValue}>
                    {m.label} {currentYear}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Fee Records Table */}
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
            <div className="flex justify-between items-center">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Fee Records
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {filteredFees.length} record{filteredFees.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p
                className={`mt-4 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Loading...
              </p>
            </div>
          ) : filteredFees.length === 0 ? (
            <div className="p-16 text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FaReceipt
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
                No fee records found
              </h3>
              <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {searchTerm || filterStatus !== "all" || filterMonth !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first fee record to get started"}
              </p>
              {!searchTerm && filterStatus === "all" && filterMonth === "all" && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm({ 
                      student: "", 
                      amount: "", 
                      dueDate: "", 
                      month: getCurrentMonth(),
                      feeType: "tuition",
                      status: "pending" 
                    });
                    setShowModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md transition-all duration-200"
                >
                  <FaPlus />
                  Add Fee Record
                </button>
              )}
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
                      Student
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Fee Type
                    </th>
                    {/* ✅ NEW: Month column */}
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Month
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Amount
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Due Date
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
                  {filteredFees.map((fee) => {
                    // ✅ FIXED: Use fee.student directly (populated object)
                    const student = fee.student;
                    return (
                      <tr
                        key={fee._id}
                        className={`transition-colors duration-150 ${
                          isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                isDark
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {student?.fullName?.charAt(0) || "?"}
                            </div>
                            <div>
                              <div
                                className={`text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {student?.fullName || "N/A"}
                              </div>
                              <div
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {student?.rollNumber || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm capitalize ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {fee.feeType || "N/A"}
                          </span>
                        </td>
                        {/* ✅ NEW: Display month */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {formatMonth(fee.month)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaDollarSign
                              className={
                                isDark ? "text-gray-500" : "text-gray-400"
                              }
                            />
                            <span
                              className={`text-sm font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              ${parseFloat(fee.amount).toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt
                              className={
                                isDark ? "text-gray-500" : "text-gray-400"
                              }
                            />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {fee.dueDate
                                ? new Date(fee.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(fee.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex gap-2">
                            {/* ✅ NEW: Edit button */}
                            <button
                              onClick={() => handleEdit(fee)}
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
                              onClick={() => handleDelete(fee._id)}
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

      {/* Add/Edit Fee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            className={`rounded-2xl max-w-2xl w-full shadow-2xl border overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-emerald-900/20 to-teal-900/20"
                  : "border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                    <FaMoneyBillWave className="text-white text-xl" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingId ? "Edit Fee Record" : "Add Fee Record"}
                    </h3>
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {editingId ? "Update fee information" : "Create a new fee entry for a student"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
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

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {role !== "student" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Select Student *
                  </label>
                  <select
                    value={form.student}
                    onChange={(e) => setForm((f) => ({ ...f, student: e.target.value }))}
                    required
                    disabled={editingId} // Don't allow changing student when editing
                    className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    } ${editingId ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <option value="">Choose a student</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.fullName} - {s.rollNumber}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ✅ NEW: Fee Type dropdown */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Fee Type *
                </label>
                <select
                  value={form.feeType}
                  onChange={(e) => setForm((f) => ({ ...f, feeType: e.target.value }))}
                  required
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="tuition">Tuition Fee</option>
                  <option value="transport">Transport Fee</option>
                  <option value="library">Library Fee</option>
                  <option value="lab">Lab Fee</option>
                  <option value="sports">Sports Fee</option>
                  <option value="exam">Exam Fee</option>
                  <option value="admission">Admission Fee</option>
                  <option value="annual">Annual Charges</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* ✅ NEW: Month selector */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Fee Month *
                </label>
                <select
                  value={form.month}
                  onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
                  required
                  className={`w-full px-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isDark
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="">Select month</option>
                  {MONTHS.map((m) => {
                    const currentYear = new Date().getFullYear();
                    const monthValue = `${currentYear}-${m.value}`;
                    return (
                      <option key={monthValue} value={monthValue}>
                        {m.label} {currentYear}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Amount ($) *
                </label>
                <div className="relative">
                  <FaDollarSign
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    required
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Due Date *
                </label>
                <div className="relative">
                  <FaCalendarAlt
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dueDate: e.target.value }))
                    }
                    required
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div
                className={`flex justify-end gap-3 pt-4 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  {editingId ? <FaSave /> : <FaPlus />}
                  {editingId ? "Update Fee Record" : "Create Fee Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
