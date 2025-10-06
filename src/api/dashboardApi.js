// ============================================
// DASHBOARD API CLIENT
// client/src/api/dashboardApi.js
// ============================================

import axiosInstance from '../utils/axiosInstance';

export const getDashboardStatistics = () => 
  axiosInstance.get('/dashboard/statistics');

export const getRecentActivities = (limit = 10) => 
  axiosInstance.get(`/dashboard/activities?limit=${limit}`);

export const getGradeDistribution = () => 
  axiosInstance.get('/dashboard/grade-distribution');

export const getTeacherSummary = () => 
  axiosInstance.get('/dashboard/teacher-summary');
