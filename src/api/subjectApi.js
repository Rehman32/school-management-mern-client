// subjectApi.jsx
// ENHANCED SUBJECT API CLIENT
// ============================================

import axiosInstance from "../utils/axiosInstance";

// CRUD Operations
export const listSubjects = (params = {}) =>
  axiosInstance.get("/subjects", { params });

export const getSubjectById = (id) =>
  axiosInstance.get(`/subjects/${id}`);

export const createSubject = (data) =>
  axiosInstance.post("/subjects", data);

export const updateSubject = (id, data) =>
  axiosInstance.put(`/subjects/${id}`, data);

export const deleteSubject = (id) =>
  axiosInstance.delete(`/subjects/${id}`);

// Query Operations
export const getSubjectsByCategory = (category) =>
  axiosInstance.get(`/subjects/category/${category}`);

export const getSubjectsForGrade = (grade) =>
  axiosInstance.get(`/subjects/grade/${grade}`);

// Bulk Operations
export const bulkCreateSubjects = (subjects) =>
  axiosInstance.post("/subjects/bulk-create", { subjects });

// Legacy support
export const fetchSubjects = listSubjects;
