import api from '../utils/axiosInstance';

export const listTeachers = async (params = {}) => {
  const res = await api.get("/teachers", { params });
  return res.data;
};
export const listTeachersMinimal = async ({ page = 1, limit = 1000, search = "" } = {}) => {
  const res = await api.get("/teachers/minimal", { params: { page, limit, search } });
  return res.data;
};

export const getTeacherById = async (id) => {
  const res = await api.get(`/teachers/${id}`);
  return res.data;
};

export const createTeacher = async (payload) => {
  const res = await api.post("/teachers", payload);
  return res.data;
};

export const updateTeacher = async (id, payload) => {
  const res = await api.put(`/teachers/${id}`, payload);
  return res.data;
};

export const deleteTeacher = async (id) => {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};



// New assignment APIs
export const createAssignment = async (teacherId, payload) => {
  const res = await api.post(`/teachers/${teacherId}/assign`, payload);
  return res.data;
};

export const getAssignments = async (teacherId) => {
  const res = await api.get(`/teachers/${teacherId}/assignments`);
  return res.data;
};

export const updateAssignment = async (teacherId, assignmentId, payload) => {
  const res = await api.put(`/teachers/${teacherId}/assign/${assignmentId}`, payload);
  return res.data;
};

export const deleteAssignment = async (teacherId, assignmentId) => {
  const res = await api.delete(`/teachers/${teacherId}/assign/${assignmentId}`);
  return res.data;
};