// ============================================
// SEARCH API
// client/src/api/searchApi.js
// ============================================

import axiosInstance from '../utils/axiosInstance';

/**
 * Global search across students, teachers, classes
 * @param {string} query - Search query
 * @param {string} type - Filter type: 'all', 'students', 'teachers', 'classes'
 * @param {number} limit - Max results
 */
export const globalSearch = (query, type = 'all', limit = 10) => 
  axiosInstance.get('/search', { 
    params: { q: query, type, limit } 
  });

/**
 * Get quick stats for dashboard
 */
export const getQuickStats = () => 
  axiosInstance.get('/search/quick-stats');
