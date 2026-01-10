// ============================================
// DASHBOARD API CLIENT
// client/src/api/dashboardApi.js
// ============================================

import axiosInstance from '../utils/axiosInstance';

// Core Dashboard APIs
export const getDashboardStatistics = () => 
  axiosInstance.get('/dashboard/statistics');

export const getRecentActivities = (limit = 10) => 
  axiosInstance.get(`/dashboard/activities?limit=${limit}`);

export const getGradeDistribution = () => 
  axiosInstance.get('/dashboard/grade-distribution');

export const getTeacherSummary = () => 
  axiosInstance.get('/dashboard/teacher-summary');

// Enhanced Analytics APIs (Phase 2.2)
export const getAttendanceOverview = () => 
  axiosInstance.get('/dashboard/attendance-overview');

export const getFeeStatus = () => 
  axiosInstance.get('/dashboard/fee-status');

export const getUpcomingExams = () => 
  axiosInstance.get('/dashboard/upcoming-exams');

export const getEnrollmentTrends = (months = 12) => 
  axiosInstance.get(`/dashboard/enrollment-trends?months=${months}`);

