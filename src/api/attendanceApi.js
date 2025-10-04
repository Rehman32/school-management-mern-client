import api from "../utils/axiosInstance";

// ✅ Mark attendance for students
export const markAttendance = async (payload) => {
  const res = await api.post("/attendance/mark", payload);
  return res.data?.data || res.data;
};

// ✅ List attendance records
export const listAttendance = async (params = {}) => {
  const res = await api.get("/attendance", { params });
  return res.data?.data || [];
};

// ✅ Get attendance by ID
export const getAttendanceById = async (id) => {
  const res = await api.get(`/attendance/${id}`);
  return res.data?.data || res.data;
};

// ✅ Update a specific attendance record
export const updateAttendanceRecord = async (id, payload) => {
  const res = await api.patch(`/attendance/${id}/record`, payload);
  return res.data?.data || res.data;
};

// ✅ Delete an attendance record
export const deleteAttendance = async (id) => {
  const res = await api.delete(`/attendance/${id}`);
  return res.data?.data || res.data;
};

// ✅ Class attendance report
export const getClassReport = async (classId, params = {}) => {
  const res = await api.get(`/attendance/report/class/${classId}`, { params });
  return res.data?.data || [];
};

// ✅ Student attendance report
export const getStudentReport = async (studentId, params = {}) => {
  const res = await api.get(`/attendance/report/student/${studentId}`, { params });
  return res.data?.data || [];
};
