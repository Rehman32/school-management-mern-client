// ============================================
// NOTIFICATION API
// client/src/api/notificationApi.js
// ============================================

import axiosInstance from '../utils/axiosInstance';

/**
 * Get notifications for current user
 * @param {Object} options - { limit, skip, unreadOnly }
 */
export const getNotifications = (options = {}) => 
  axiosInstance.get('/notifications', { params: options });

/**
 * Get unread notification count
 */
export const getUnreadCount = () => 
  axiosInstance.get('/notifications/unread-count');

/**
 * Mark notification as read
 * @param {string} id - Notification ID
 */
export const markAsRead = (id) => 
  axiosInstance.put(`/notifications/${id}/read`);

/**
 * Mark all notifications as read
 */
export const markAllAsRead = () => 
  axiosInstance.put('/notifications/read-all');

/**
 * Delete notification
 * @param {string} id - Notification ID
 */
export const deleteNotification = (id) => 
  axiosInstance.delete(`/notifications/${id}`);

/**
 * Clear all notifications
 */
export const clearAllNotifications = () => 
  axiosInstance.delete('/notifications/clear-all');

/**
 * Create notification (admin only)
 * @param {Object} data - Notification data
 */
export const createNotification = (data) => 
  axiosInstance.post('/notifications', data);
