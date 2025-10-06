// ============================================
// TEACHER ASSIGNMENT API CLIENT
// ============================================

import axiosInstance from "../utils/axiosInstance";

// Assignment Operations
export const createAssignment = (data) =>
  axiosInstance.post("/assignments", data);

export const getAssignmentsByTeacher = (teacherId, params = {}) =>
  axiosInstance.get(`/assignments/teacher/${teacherId}`, { params });

export const getAssignmentsByClass = (classId, params = {}) =>
  axiosInstance.get(`/assignments/class/${classId}`, { params });

export const getAssignmentsBySubject = (subjectId, params = {}) =>
  axiosInstance.get(`/assignments/subject/${subjectId}`, { params });

export const getAllAssignments = (params = {}) =>
  axiosInstance.get("/assignments", { params });

export const removeAssignment = (teacherId, assignmentId, params = {}) =>
  axiosInstance.delete(`/assignments/teacher/${teacherId}/assignment/${assignmentId}`, { params });

// Timetable Operations
export const getClassTimetable = (classId, params = {}) =>
  axiosInstance.get(`/assignments/timetable/class/${classId}`, { params });

export const getTeacherTimetable = (teacherId, params = {}) =>
  axiosInstance.get(`/assignments/timetable/teacher/${teacherId}`, { params });

// Reports
export const getWorkloadSummary = (params = {}) =>
  axiosInstance.get("/assignments/workload", { params });

// Conflict Check
export const checkConflict = (params) =>
  axiosInstance.get("/assignments/check-conflict", { params });

// Bulk Operations
export const bulkAssign = (assignments) =>
  axiosInstance.post("/assignments/bulk-assign", { assignments });
