// ============================================
// ACADEMICS MANAGEMENT - ENHANCED VERSION
// With tabs for Exams and Subjects
// ============================================

import React, { useEffect, useState } from "react";
import { listExams, createExam, addGrade } from "../../api/examApi";
import { listClasses } from "../../api/classApi";
import { listSubjects, createSubject, deleteSubject } from "../../api/subjectApi";
import { listStudents } from "../../api/studentApi";
import GradeEntry from "../../components/admin/GradeEntry";
import { toast } from "react-hot-toast";
import useTheme from "../../context/ThemeContext";
import {
  BookOpen,
  Plus,
  X,
  Calendar,
  ClipboardList,
  Save,
  Edit,
  GraduationCap,
  Search,
  Trash2,
  Users,
  Award,
  Hash
} from "lucide-react";

const TABS = [
  { id: 'exams', label: 'Exams & Grades', icon: ClipboardList },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
];

const SUBJECT_CATEGORIES = [
  'Core',
  'Science',
  'Mathematics',
  'Languages',
  'Arts',
  'Sports',
  'Computer',
  'Islamic Studies',
  'Social Studies',
  'Other'
];

export default function AcademicsManagement() {
  const [activeTab, setActiveTab] = useState('exams');
  const { isDark } = useTheme();
  
  // Common State
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Exams State
  const [exams, setExams] = useState([]);
  const [showExamForm, setShowExamForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [gradeMap, setGradeMap] = useState({});
  const [savingGrades, setSavingGrades] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Subjects State
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [newSubject, setNewSubject] = useState({ 
    name: '', 
    code: '', 
    category: 'Core',
    description: ''
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const exRes = await listExams();
      const exData = Array.isArray(exRes) ? exRes : exRes?.data || [];
      setExams(Array.isArray(exData) ? exData : []);
      
      const clRes = await listClasses();
      const clData = clRes?.data?.data || clRes?.data || clRes || [];
      setClasses(Array.isArray(clData) ? clData : []);
      
      const subRes = await listSubjects();
      const subData = subRes?.data?.data || subRes?.data || subRes || [];
      setSubjects(Array.isArray(subData) ? subData : []);
      
      const stRes = await listStudents();
      const stData = stRes?.data?.data || stRes?.data || stRes || [];
      setStudents(Array.isArray(stData) ? stData : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // EXAM FUNCTIONS
  // ============================================
  const handleCreateExam = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      await createExam({
        title: form.get("title"),
        classId: form.get("classId"),
        subjectId: form.get("subjectId"),
        date: form.get("date"),
        totalMarks: Number(form.get("totalMarks")),
      });
      toast.success("Exam created successfully");
      setShowExamForm(false);
      fetchAll();
      e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create exam");
    }
  };

  const handleSaveGrades = async () => {
    if (!selectedExam) return toast.error("Select an exam first");
    try {
      const items = Object.entries(gradeMap).map(([studentId, marks]) => ({
        studentId,
        subjectId: selectedExam.subjectId?._id || selectedExam.subjectId,
        marksObtained: Number(marks),
      }));
      if (items.length === 0) return toast.error("No grades to save");
      setSavingGrades(true);
      await Promise.all(items.map((item) => addGrade(selectedExam._id, item)));
      toast.success("Grades saved successfully");
      setGradeMap({});
      fetchAll();
    } catch (err) {
      toast.error("Failed to save grades");
    } finally {
      setSavingGrades(false);
    }
  };

  // ============================================
  // SUBJECT FUNCTIONS
  // ============================================
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.name.trim() || !newSubject.code.trim()) {
      toast.error("Name and code are required");
      return;
    }
    try {
      await createSubject(newSubject);
      toast.success("Subject created successfully");
      setShowSubjectForm(false);
      setNewSubject({ name: '', code: '', category: 'Core', description: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create subject");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm("Delete this subject?")) return;
    try {
      await deleteSubject(id);
      toast.success("Subject deleted");
      fetchAll();
    } catch (err) {
      toast.error("Failed to delete subject");
    }
  };

  const filteredExams = exams.filter((exam) =>
    exam.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Header */}
      <div className={`border-b shadow-sm ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Academics Management
                </h1>
                <p className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Manage subjects, exams, and student grades
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
        {/* SUBJECTS TAB */}
        {/* ============================================ */}
        {activeTab === 'subjects' && (
          <div className={`rounded-xl shadow-md border overflow-hidden ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`p-6 border-b flex items-center justify-between ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Subjects
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage school subjects for timetable and exams
                </p>
              </div>
              <button
                onClick={() => setShowSubjectForm(!showSubjectForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                {showSubjectForm ? <X size={18} /> : <Plus size={18} />}
                {showSubjectForm ? 'Cancel' : 'Add Subject'}
              </button>
            </div>

            {/* Add Subject Form */}
            {showSubjectForm && (
              <form onSubmit={handleCreateSubject} className={`p-6 border-b ${
                isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mathematics"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                      required
                      className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., MATH-101"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
                      required
                      className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </label>
                    <select
                      value={newSubject.category}
                      onChange={(e) => setNewSubject({ ...newSubject, category: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      {SUBJECT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Brief description"
                      value={newSubject.description}
                      onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <Save size={18} />
                    Save Subject
                  </button>
                </div>
              </form>
            )}

            {/* Subjects List */}
            {subjects.length === 0 ? (
              <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No subjects found</p>
                <p className="text-sm mt-1">Add your first subject to get started</p>
                <button
                  onClick={() => setShowSubjectForm(true)}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium"
                >
                  <Plus size={18} className="inline mr-2" />
                  Add Subject
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isDark ? 'bg-violet-900/30' : 'bg-violet-100'
                        }`}>
                          <BookOpen className={isDark ? 'text-violet-400' : 'text-violet-600'} size={20} />
                        </div>
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {subject.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {subject.code}
                            </span>
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {subject.category || 'Core'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubject(subject._id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {subject.description && (
                      <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {subject.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* EXAMS TAB */}
        {/* ============================================ */}
        {activeTab === 'exams' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className={`rounded-xl shadow-md p-6 border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Exams</p>
                    <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {exams.length}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                    <ClipboardList className={isDark ? 'text-blue-400' : 'text-blue-600'} size={24} />
                  </div>
                </div>
              </div>

              <div className={`rounded-xl shadow-md p-6 border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subjects</p>
                    <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {subjects.length}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                    <BookOpen className={isDark ? 'text-purple-400' : 'text-purple-600'} size={24} />
                  </div>
                </div>
              </div>

              <div className={`rounded-xl shadow-md p-6 border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Students</p>
                    <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {students.length}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                    <Users className={isDark ? 'text-green-400' : 'text-green-600'} size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Exams Section */}
            <div className={`rounded-xl shadow-md border overflow-hidden ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className={`p-6 border-b flex items-center justify-between ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Exams</h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create exams and enter grades
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} size={18} />
                    <input
                      type="text"
                      placeholder="Search exams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none ${
                        isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => setShowExamForm(!showExamForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium"
                  >
                    {showExamForm ? <X size={18} /> : <Plus size={18} />}
                    {showExamForm ? 'Cancel' : 'Create Exam'}
                  </button>
                </div>
              </div>

              {/* Create Exam Form */}
              {showExamForm && (
                <form onSubmit={handleCreateExam} className={`p-6 border-b ${
                  isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Create New Exam
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Exam Title
                      </label>
                      <input
                        name="title"
                        placeholder="e.g., Midterm Exam"
                        required
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none ${
                          isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Exam Date
                      </label>
                      <input
                        name="date"
                        type="date"
                        required
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none ${
                          isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Total Marks
                      </label>
                      <input
                        name="totalMarks"
                        type="number"
                        placeholder="e.g., 100"
                        required
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none ${
                          isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Class
                      </label>
                      <select
                        name="classId"
                        required
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none ${
                          isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls._id} value={cls._id}>
                            {cls.name || `${cls.grade}-${cls.section}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Subject
                      </label>
                      <select
                        name="subjectId"
                        required
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none ${
                          isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.name} ({sub.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowExamForm(false)}
                      className={`px-6 py-2.5 border rounded-xl font-medium ${
                        isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium"
                    >
                      <Save size={18} />
                      Save Exam
                    </button>
                  </div>
                </form>
              )}

              {/* Exams Table */}
              {filteredExams.length === 0 ? (
                <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No exams found</p>
                  <p className="text-sm mt-1">
                    {searchTerm ? 'Try adjusting your search' : 'Create your first exam to get started'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowExamForm(true)}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium"
                    >
                      <Plus size={18} className="inline mr-2" />
                      Create Exam
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isDark ? 'bg-gray-900/50' : 'bg-gray-50'}>
                      <tr>
                        <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>Exam Title</th>
                        <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>Date</th>
                        <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>Marks</th>
                        <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>Class</th>
                        <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>Subject</th>
                        <th className={`px-6 py-4 text-right text-xs font-semibold uppercase ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {filteredExams.map((ex) => (
                        <tr key={ex._id} className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg mr-3 ${
                                isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                              }`}>
                                <ClipboardList className={isDark ? 'text-purple-400' : 'text-purple-600'} size={16} />
                              </div>
                              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {ex.title}
                              </span>
                            </div>
                          </td>
                          <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              {new Date(ex.date).toLocaleDateString('en-PK')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                              isDark ? 'text-blue-400 bg-blue-900/30' : 'text-blue-700 bg-blue-100'
                            }`}>
                              {ex.totalMarks} pts
                            </span>
                          </td>
                          <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {ex.classId?.name || ex.classId?.grade || '-'}
                          </td>
                          <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {ex.subjectId?.name || '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedExam(ex)}
                              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                                isDark ? 'text-violet-400 hover:bg-violet-900/20' : 'text-violet-600 hover:bg-violet-50'
                              }`}
                            >
                              <Edit size={14} />
                              Enter Grades
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Gradebook Section */}
            {selectedExam && (
              <div className={`mt-6 rounded-xl shadow-md border overflow-hidden ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className={`p-6 border-b flex items-center justify-between ${
                  isDark ? 'border-gray-700 bg-gradient-to-r from-purple-900/20 to-blue-900/20'
                        : 'border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'
                }`}>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Gradebook: {selectedExam.title}
                    </h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Enter grades for students (Total: {selectedExam.totalMarks} marks)
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedExam(null)}
                    className={`p-2 transition-colors ${
                      isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  <GradeEntry
                    students={students}
                    onChange={(map) => setGradeMap(map)}
                    isDark={isDark}
                  />

                  <div className={`mt-6 flex items-center justify-end gap-3 pt-4 border-t ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <button
                      onClick={() => setSelectedExam(null)}
                      className={`px-6 py-2.5 border rounded-xl font-medium ${
                        isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveGrades}
                      disabled={savingGrades}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium disabled:opacity-50"
                    >
                      {savingGrades ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Grades
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
