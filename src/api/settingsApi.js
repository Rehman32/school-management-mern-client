import api from "../utils/axiosInstance";
export const getProfile = () => api.get("/school/profile");
export const updateProfile = (payload) => api.put("/school/profile", payload);