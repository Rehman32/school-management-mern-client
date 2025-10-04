import axiosInstance from '../utils/axiosInstance';


export const getAllStudents = () => axiosInstance.get('/students/getAllStudents');
export const createStudent = (data) => axiosInstance.post('/students/createStudent', data);
export const updateStudent = (id, data) => axiosInstance.put(`/students/updateStudent/${id}`, data);
export const deleteStudent = (id) => axiosInstance.delete(`/students/deleteStudent/${id}`);
export const listStudents = async (params = {}) => {
  const res = await axiosInstance.get('/students/getAllStudents', { params });
  return res.data;
};