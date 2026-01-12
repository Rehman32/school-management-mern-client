import api from "../utils/axiosInstance";

// ============================================
// INVITATION API
// ============================================

// Create invitation (admin only)
export const createInvitation = async (invitationData) => {
  const res = await api.post("/invitations", invitationData);
  return res.data;
};

// List all invitations (admin only)
export const listInvitations = async (status = null) => {
  const params = status ? { status } : {};
  const res = await api.get("/invitations", { params });
  return res.data;
};

// Verify invitation token (public)
export const verifyInvitation = async (token) => {
  const res = await api.get(`/invitations/verify/${token}`);
  return res.data;
};

// Accept invitation and create account (public)
export const acceptInvitation = async (token, name, password) => {
  const res = await api.post("/invitations/accept", { token, name, password });
  return res.data;
};

// Resend invitation (admin only)
export const resendInvitation = async (invitationId) => {
  const res = await api.post(`/invitations/${invitationId}/resend`);
  return res.data;
};

// Cancel invitation (admin only)
export const cancelInvitation = async (invitationId) => {
  const res = await api.delete(`/invitations/${invitationId}`);
  return res.data;
};
