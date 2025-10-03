import api from "../utils/axiosInstance";

export const createAssignmentAPI = async ({ teacherId, subjectId, classId }) => {
  const res = await api.post("/assignments", { teacherId, subjectId, classId });
  return res.data;
};

export const listAssignmentsByClass = async (classId) => {
  const res = await api.get(`/assignments/class/${classId}`);
  return res.data;
};

export const deleteAssignmentAPI = async (id) => {
  const res = await api.delete(`/assignments/${id}`);
  return res.data;
};

export const listAssignments = async (params = {}) => {
  const res = await api.get("/assignments", { params });
  return res.data;
};
