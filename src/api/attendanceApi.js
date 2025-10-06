
import api from "../utils/axiosInstance";

// ============================================
// MARK ATTENDANCE
// ============================================

// Mark attendance for students
export const markAttendance = async (payload) => {
  const res = await api.post("/attendance/mark", payload);
  return res.data;
};

//  : Mark all students present
export const markAllPresent = async (payload) => {
  const res = await api.post("/attendance/mark-all-present", payload);
  return res.data;
};

//   : Copy from previous day
export const copyFromPreviousDay = async (payload) => {
  const res = await api.post("/attendance/copy-previous", payload);
  return res.data;
};

// ============================================
// LIST & VIEW ATTENDANCE
// ============================================

// List attendance records (with pagination)
export const listAttendance = async (params = {}) => {
  const res = await api.get("/attendance", { params });
  return res.data;
};

// Get attendance by ID
export const getAttendanceById = async (id) => {
  const res = await api.get(`/attendance/${id}`);
  return res.data;
};

// ============================================
// UPDATE ATTENDANCE
// ============================================

// Update a specific attendance record
export const updateAttendanceRecord = async (id, payload) => {
  const res = await api.patch(`/attendance/${id}/record`, payload);
  return res.data;
};

// Delete an attendance record
export const deleteAttendance = async (id) => {
  const res = await api.delete(`/attendance/${id}`);
  return res.data;
};

// ============================================
// REPORTS & ANALYTICS
// ============================================

// Class attendance report
export const getClassReport = async (classId, params = {}) => {
  const res = await api.get(`/attendance/report/class/${classId}`, { params });
  return res.data;
};

// Student attendance report
export const getStudentReport = async (studentId, params = {}) => {
  const res = await api.get(`/attendance/report/student/${studentId}`, { params });
  return res.data;
};

//  : Monthly statistics
export const getMonthlyStats = async (params = {}) => {
  const res = await api.get("/attendance/stats/monthly", { params });
  return res.data;
};
