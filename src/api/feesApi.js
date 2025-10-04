import api from "../utils/axiosInstance";

// ✅ Fetch all fees
export const listFees = async (params = {}) => {
  const res = await api.get("/fees", { params });
  return res.data?.data || res.data || [];
};

// ✅ Create a new fee
export const createFee = async (payload) => {
  const res = await api.post("/fees", payload);
  return res.data?.data || res.data;
};

// ✅ Update fee info
export const updateFee = async (id, payload) => {
  const res = await api.put(`/fees/${id}`, payload);
  return res.data?.data || res.data;
};

// ✅ Update only fee status
export const updateFeeStatus = async (id, status) => {
  const res = await api.put(`/fees/${id}`, { status });
  return res.data?.data || res.data;
};

// ✅ Delete a fee record
export const deleteFee = async (id) => {
  const res = await api.delete(`/fees/${id}`);
  return res.data?.data || res.data;
};

export const getFees = async (params = {}) => {
  const res = await api.get("/fees", { params });
  return res.data?.data || res.data || [];
};