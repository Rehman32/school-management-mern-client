import api from "../utils/axiosInstance";
export const createTimetable = (payload) => api.post("/timetable", payload);
export const listTimetableForClass = (classId) => api.get(`/timetable/class/${classId}`);
export const getTeacherTimetable = (teacherId) => api.get(`/timetable/teacher/${teacherId}`);
export const createEntry = createTimetable;
export const listByClass = listTimetableForClass;
export const updateEntry = (id, payload) => api.put(`/timetable/${id}`, payload);
export const deleteEntry = (id) => api.delete(`/timetable/${id}`);
