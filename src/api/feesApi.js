import api from "../utils/axiosInstance";

// ✅ Get fees (with filters)
export const getFees = async (params = {}) => {
  const res = await api.get("/fees", { params });
  return res.data;
};

// ✅ Get statistics
export const getFeeStats = async (params = {}) => {
  const res = await api.get("/fees/stats", { params });
  return res.data;
};

// ✅ Get student fees
export const getStudentFees = async (studentId) => {
  const res = await api.get(`/fees/student/${studentId}`);
  return res.data;
};

// ✅ Create a new fee
export const createFee = async (payload) => {
  const res = await api.post("/fees", payload);
  return res.data;
};

// ✅ Bulk generate fees for a class
export const bulkGenerateFees = async (payload) => {
  const res = await api.post("/fees/bulk-generate", payload);
  return res.data;
};

// ✅ Update fee
export const updateFee = async (id, payload) => {
  const res = await api.put(`/fees/${id}`, payload);
  return res.data;
};

// ✅ Delete a fee record
export const deleteFee = async (id) => {
  const res = await api.delete(`/fees/${id}`);
  return res.data;
};

// ✅ Record a payment
export const recordPayment = async (feeId, payload) => {
  const res = await api.post(`/fees/${feeId}/payments`, payload);
  return res.data;
};

// ✅ Delete a payment record
export const deletePayment = async (feeId, paymentId) => {
  const res = await api.delete(`/fees/${feeId}/payments/${paymentId}`);
  return res.data;
};
