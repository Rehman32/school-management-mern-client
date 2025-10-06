// teacherApi.js

import axiosInstance from "../utils/axiosInstance";

// ============================================
// TEACHER CRUD OPERATIONS
// ============================================

// List teachers (with filters)
export const listTeachers = (params = {}) =>
  axiosInstance.get("/teachers", { params });


// Get teacher by ID
export const getTeacherById = (id) =>
  axiosInstance.get(`/teachers/${id}`);

// Create teacher
export const createTeacher = (data) =>
  axiosInstance.post("/teachers", data);

// Update teacher
export const updateTeacher = (id, data) =>
  axiosInstance.put(`/teachers/${id}`, data);

// Delete teacher
export const deleteTeacher = (id) =>
  axiosInstance.delete(`/teachers/${id}`);

// Get statistics
export const getStatistics = () =>
  axiosInstance.get("/teachers/statistics");

// Get departments
export const getDepartments = () =>
  axiosInstance.get("/teachers/departments");

// ============================================
// BULK OPERATIONS
// ============================================

// Bulk update status
export const bulkUpdateStatus = (data) =>
  axiosInstance.post("/teachers/bulk-update-status", data);

// Bulk delete teachers
export const bulkDelete = (teacherIds) =>
  axiosInstance.post("/teachers/bulk-delete", { teacherIds });
