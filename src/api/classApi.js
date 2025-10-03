import api from "../utils/axiosInstance";
export const listClasses = async () => (await api.get("/classes")).data;
// export const createClass = async (payload) => (await api.post("/classes", payload)).data;

export const fetchClasses = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const res = await api.get("/classes", { params: { page, limit, search } });
  return res.data;
};

export const createClass = async (payload) => {
  const res = await api.post("/classes", payload);
  return res.data;
};

export const updateClass = async (id, payload) => {
  const res = await api.put(`/classes/${id}`, payload);
  return res.data;
};

export const deleteClass = async (id) => {
  const res = await api.delete(`/classes/${id}`);
  return res.data;
};
