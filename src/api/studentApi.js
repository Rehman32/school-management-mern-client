
import axiosInstance from '../utils/axiosInstance';

// ============================================
// STUDENT CRUD OPERATIONS
// ============================================

// Get all students (with filters)
export const getAllStudents = (params = {}) => 
  axiosInstance.get('/students/getAllStudents', { params });

// Get student by ID
export const getStudentById = (id) => 
  axiosInstance.get(`/students/getStudentById/${id}`);

// Create student
export const createStudent = (data) => 
  axiosInstance.post('/students/createStudent', data);

// Update student
export const updateStudent = (id, data) => 
  axiosInstance.put(`/students/updateStudent/${id}`, data);

// Delete student
export const deleteStudent = (id) => 
  axiosInstance.delete(`/students/deleteStudent/${id}`);

// Get statistics
export const getStatistics = () => 
  axiosInstance.get('/students/statistics');

// ============================================
// BULK OPERATIONS
// ============================================

// Bulk promote students
export const bulkPromote = (data) => 
  axiosInstance.post('/students/bulk-promote', data);

// Bulk delete students
export const bulkDelete = (studentIds) => 
  axiosInstance.post('/students/bulk-delete', { studentIds });

// ============================================
// LEGACY SUPPORT (for backward compatibility)
// ============================================

export const listStudents = async (params = {}) => {
  const res = await axiosInstance.get('/students/getAllStudents', { params });
  return res.data;
};
