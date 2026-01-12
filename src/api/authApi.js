import api from "../utils/axiosInstance";

// ============================================
// AUTHENTICATION API
// ============================================

// Login user
export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// Register user (for existing admins adding users)
export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

// Register school (onboarding - creates school + admin)
export const registerSchool = async (schoolData) => {
  const res = await api.post("/auth/register-school", schoolData);
  return res.data;
};

// Logout
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

// Logout from all devices
export const logoutAll = async () => {
  const res = await api.post("/auth/logout-all");
  return res.data;
};

// Get current user
export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// Update profile
export const updateProfile = async (updates) => {
  const res = await api.put("/auth/profile", updates);
  return res.data;
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  const res = await api.post("/auth/change-password", { currentPassword, newPassword });
  return res.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const res = await api.post("/auth/reset-password", { token, password });
  return res.data;
};

// Verify email
export const verifyEmail = async (token) => {
  const res = await api.post("/auth/verify-email", { token });
  return res.data;
};

// Resend verification email
export const resendVerification = async (email) => {
  const res = await api.post("/auth/resend-verification", { email });
  return res.data;
};

// Refresh token
export const refreshToken = async () => {
  const res = await api.post("/auth/refresh");
  return res.data;
};
