import React, { useEffect, useState } from 'react';
import { listExams, createExam, addGrade } from '../../api/examApi';
import { listSubjects } from '../../api/subjectApi';
import { listStudents } from '../../api/studentApi';
import GradeEntry from '../../components/admin/GradeEntry';
import { toast } from 'react-hot-toast';
import useTheme from '../../context/ThemeContext';
import { 
  FaPlus, 
  FaTimes, 
  FaCalendar, 
  FaClipboardList, 
  FaSave, 
  FaEdit,
  FaBook,
  FaChartLine,
  FaSearch
} from 'react-icons/fa';

export default function AcademicsManagement() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [gradeMap, setGradeMap] = useState({});
  const [savingGrades, setSavingGrades] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get theme from context - same as AdminDashboard
  const { isDark } = useTheme();

  const fetchAll = async () => {
    try {
      const ex = await listExams();
      setExams(ex || []);
      const sub = await listSubjects();
      setSubjects(sub || []);
      const st = await listStudents();
      setStudents(st || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      await createExam({
        title: form.get('title'),
        classId: form.get('classId'),
        date: form.get('date'),
        totalMarks: Number(form.get('totalMarks')),
      });
      toast.success('Exam created successfully');
      setShowCreate(false);
      fetchAll();
      e.target.reset();
    } catch (err) { 
      toast.error('Failed to create exam'); 
    }
  };

  const handleSaveGrades = async () => {
    if (!selectedExam) return toast.error('Select an exam first');
    try {
      const items = Object.entries(gradeMap).map(([studentId, marks]) => ({ 
        studentId, 
        subjectId: subjects[0]?._id, 
        marksObtained: Number(marks) 
      }));
      if (items.length === 0) return toast.error('No grades to save');
      setSavingGrades(true);
      await Promise.all(items.map(item => addGrade(selectedExam._id, item)));
      toast.success('Grades saved successfully');
      setGradeMap({});
      fetchAll();
    } catch (err) { 
      console.error(err); 
      toast.error('Failed to save grades'); 
    } finally { 
      setSavingGrades(false); 
    }
  };

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b shadow-sm ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <FaBook className="text-white text-2xl" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Academics Management
              </h1>
              <p className={`mt-1 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Create exams, manage grades, and track student performance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`rounded-xl shadow-md p-6 border transition-all duration-200 hover:shadow-lg ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Total Exams</p>
                <p className={`text-3xl font-bold mt-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{exams.length}</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <FaClipboardList className={`text-2xl ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-md p-6 border transition-all duration-200 hover:shadow-lg ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Subjects</p>
                <p className={`text-3xl font-bold mt-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{subjects.length}</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-purple-900/30' : 'bg-purple-100'
              }`}>
                <FaBook className={`text-2xl ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-md p-6 border transition-all duration-200 hover:shadow-lg ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Students</p>
                <p className={`text-3xl font-bold mt-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{students.length}</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <FaChartLine className={`text-2xl ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Exams Section */}
        <div className={`rounded-xl shadow-md border overflow-hidden ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          {/* Section Header */}
          <div className={`p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Exams</h2>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Manage all exams and assessments</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none ${
                      isDark 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  <FaPlus className="text-sm" />
                  <span className="hidden sm:inline">Create Exam</span>
                </button>
              </div>
            </div>
          </div>

          {/* Create Exam Form */}
          {showCreate && (
            <div className={`p-6 border-b ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Create New Exam</h3>
                <button
                  onClick={() => setShowCreate(false)}
                  className={`p-2 transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleCreateExam} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Exam Title
                    </label>
                    <input
                      name="title"
                      placeholder="e.g., Midterm Exam"
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Exam Date
                    </label>
                    <div className="relative">
                      <FaCalendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <input
                        name="date"
                        type="date"
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none ${
                          isDark 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Total Marks
                    </label>
                    <input
                      name="totalMarks"
                      type="number"
                      placeholder="e.g., 100"
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Class ID
                    </label>
                    <input
                      name="classId"
                      placeholder="e.g., CS-101"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className={`px-6 py-2.5 border rounded-xl font-medium transition-all duration-200 ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    <FaSave />
                    Save Exam
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Exams Table */}
          <div className="overflow-x-auto">
            {filteredExams.length === 0 ? (
              <div className="text-center py-16">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <FaClipboardList className={`text-2xl ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className={`text-lg font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>No exams found</h3>
                <p className={`mb-6 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {searchTerm ? 'Try adjusting your search' : 'Create your first exam to get started'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-md transition-all duration-200"
                  >
                    <FaPlus />
                    Create Exam
                  </button>
                )}
              </div>
            ) : (
              <table className={`min-w-full divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                <thead className={isDark ? 'bg-gray-900/50' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Exam Title
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Date
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Total Marks
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Class ID
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDark 
                    ? 'bg-gray-800 divide-gray-700' 
                    : 'bg-white divide-gray-200'
                }`}>
                  {filteredExams.map((ex) => (
                    <tr
                      key={ex._id}
                      className={`transition-colors duration-150 ${
                        isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                          }`}>
                            <FaClipboardList className={
                              isDark ? 'text-purple-400' : 'text-purple-600'
                            } />
                          </div>
                          <span className={`text-sm font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {ex.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <FaCalendar className={`mr-2 ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                          {new Date(ex.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          isDark 
                            ? 'text-blue-400 bg-blue-900/30' 
                            : 'text-blue-700 bg-blue-100'
                        }`}>
                          {ex.totalMarks} pts
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {ex.classId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedExam(ex)}
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isDark 
                              ? 'text-purple-400 hover:bg-purple-900/20' 
                              : 'text-purple-600 hover:bg-purple-50'
                          }`}
                        >
                          <FaEdit />
                          Enter Grades
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Gradebook Section */}
        {selectedExam && (
          <div className={`mt-6 rounded-xl shadow-md border overflow-hidden ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <div className={`p-6 border-b ${
              isDark 
                ? 'border-gray-700 bg-gradient-to-r from-purple-900/20 to-blue-900/20' 
                : 'border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Gradebook: {selectedExam.title}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Enter grades for students (Total: {selectedExam.totalMarks} marks)
                  </p>
                </div>
                <button
                  onClick={() => setSelectedExam(null)}
                  className={`p-2 transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
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
                  className={`px-6 py-2.5 border rounded-xl font-medium transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGrades}
                  disabled={savingGrades}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingGrades ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Grades
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
