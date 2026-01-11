import api from "../utils/axiosInstance";

// ============================================
// EXAM CRUD
// ============================================

// Get list of exams
export const listExams = async (params) => {
  const res = await api.get("/exams", { params });
  return res.data?.data || [];
};

// Create new exam
export const createExam = async (payload) => {
  const res = await api.post("/exams", payload);
  return res.data?.data || res.data;
};

// ============================================
// GRADE MANAGEMENT
// ============================================

// Add or update grade for an exam
export const addOrUpdateGrade = async (examId, payload) => {
  const res = await api.post(`/exams/${examId}/grades`, payload);
  return res.data?.data || res.data;
};

export const addGrade = addOrUpdateGrade;

// Get all grades for an exam
export const listGradesForExam = async (examId) => {
  const res = await api.get(`/exams/${examId}/grades`);
  return res.data?.data || [];
};

// Get grades for a specific student
export const getStudentGrades = async (studentId) => {
  const res = await api.get(`/exams/student/${studentId}`);
  return res.data?.data || [];
};

// ============================================
// REPORT CARDS
// ============================================

// Generate student report card
export const generateReportCard = async (studentId, params = {}) => {
  const res = await api.get(`/exams/student/${studentId}/report-card`, { params });
  return res.data;
};

// ============================================
// CLASS PERFORMANCE & ANALYTICS
// ============================================

// Get class performance report
export const getClassPerformance = async (classId, params = {}) => {
  const res = await api.get(`/exams/class/${classId}/performance`, { params });
  return res.data;
};

// Get exam analytics
export const getExamAnalytics = async (examId) => {
  const res = await api.get(`/exams/${examId}/analytics`);
  return res.data;
};
