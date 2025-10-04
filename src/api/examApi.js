import api from "../utils/axiosInstance";

// ✅ Get list of exams (return array directly)
export const listExams = async (params) => {
  const res = await api.get("/exams", { params });
  return res.data?.data || []; // <-- fixed
};

// ✅ Create new exam
export const createExam = async (payload) => {
  const res = await api.post("/exams", payload);
  return res.data?.data || res.data;
};

// ✅ Add or update grade for an exam
export const addOrUpdateGrade = async (examId, payload) => {
  const res = await api.post(`/exams/${examId}/grades`, payload);
  return res.data?.data || res.data;
};

export const addGrade = addOrUpdateGrade;

// ✅ Get all grades for an exam
export const listGradesForExam = async (examId) => {
  const res = await api.get(`/exams/${examId}/grades`);
  return res.data?.data || [];
};

// ✅ Get grades for a specific student
export const getStudentGrades = async (studentId) => {
  const res = await api.get(`/exams/student/${studentId}`);
  return res.data?.data || [];
};
