
import axiosInstance from '../utils/axiosInstance';

// ============================================
// STUDENT CRUD OPERATIONS
// studentApi.js
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
// PHOTO MANAGEMENT
// ============================================

// Upload student photo
export const uploadStudentPhoto = (studentId, photoFile) => {
  const formData = new FormData();
  formData.append('photo', photoFile);
  return axiosInstance.post(`/students/${studentId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Delete student photo
export const deleteStudentPhoto = (studentId) => 
  axiosInstance.delete(`/students/${studentId}/photo`);

// ============================================
// DOCUMENT MANAGEMENT
// ============================================

// Get student documents
export const getStudentDocuments = (studentId) => 
  axiosInstance.get(`/students/${studentId}/documents`);

// Upload student document
export const uploadStudentDocument = (studentId, file, documentType, documentName) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('documentType', documentType);
  formData.append('documentName', documentName);
  return axiosInstance.post(`/students/${studentId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Delete student document
export const deleteStudentDocument = (studentId, documentId) => 
  axiosInstance.delete(`/students/${studentId}/documents/${documentId}`);

// ============================================
// LEGACY SUPPORT
// ============================================

export const listStudents = async (params = {}) => {
  const res = await axiosInstance.get('/students/getAllStudents', { params });
  return res.data;
};
