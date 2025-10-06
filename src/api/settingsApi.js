// ============================================
// ENHANCED SETTINGS API CLIENT
// client/src/api/settingsApi.js
// ============================================

import axiosInstance from '../utils/axiosInstance';

// Profile operations
export const getProfile = () => axiosInstance.get('/school/profile');

export const updateProfile = (data) => axiosInstance.put('/school/profile', data);

export const getStatistics = () => axiosInstance.get('/school/statistics');

// Logo upload
export const uploadLogo = (file) => {
  const formData = new FormData();
  formData.append('logo', file);
  
  return axiosInstance.post('/school/upload-logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Academic year operations
export const updateAcademicYear = (data) => 
  axiosInstance.put('/school/academic-year', data);

export const deleteAcademicYear = (year) => 
  axiosInstance.delete(`/school/academic-year/${year}`);

// School timings
export const updateSchoolTimings = (timings) => 
  axiosInstance.put('/school/timings', { timings });

// Grading system
export const updateGradingSystem = (grades) => 
  axiosInstance.put('/school/grading-system', { grades });

// System settings
export const updateSystemSettings = (settings) => 
  axiosInstance.put('/school/system-settings', { settings });

// Contact persons
export const addContactPerson = (data) => 
  axiosInstance.post('/school/contact-persons', data);

export const updateContactPerson = (id, data) => 
  axiosInstance.put(`/school/contact-persons/${id}`, data);

export const deleteContactPerson = (id) => 
  axiosInstance.delete(`/school/contact-persons/${id}`);
