import api from "../utils/axiosInstance";
export const listSubjects = async () => {
  const res = await api.get("/subjects");
  return res.data;
};
// export const createSubject = async (payload) => (await api.post("/subjects", payload)).data;

export const fetchSubjects = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const res = await api.get("/subjects", { params: { page, limit, search } });
  return res.data;
};

export const createSubject = async (payload) => {
  const res = await api.post("/subjects", payload);
  return res.data;
};

export const updateSubject = async (id, payload) => {
  const res = await api.put(`/subjects/${id}`, payload);
  return res.data;
};

export const deleteSubject = async (id) => {
  const res = await api.delete(`/subjects/${id}`);
  return res.data;
};
