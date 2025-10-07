// classApi.js
// ENHANCED CLASS API CLIENT
// ============================================

import axiosInstance from "../utils/axiosInstance";

// CRUD Operations
export const listClasses = (params = {}) =>
  axiosInstance.get("/classes", { params });

export const getClassById = (id) =>
  axiosInstance.get(`/classes/${id}`);

export const createClass = (data) =>
  axiosInstance.post("/classes", data);

export const updateClass = (id, data) =>
  axiosInstance.put(`/classes/${id}`, data);

export const deleteClass = (id) =>
  axiosInstance.delete(`/classes/${id}`);

// Statistics & Reports
export const getClassStatistics = () =>
  axiosInstance.get("/classes/statistics");

// Operations
export const updateEnrollmentCount = (id) =>
  axiosInstance.put(`/classes/${id}/enrollment`);

export const bulkCreateClasses = (classes) =>
  axiosInstance.post("/classes/bulk-create", { classes });

// Legacy support
export const fetchClasses = listClasses;
