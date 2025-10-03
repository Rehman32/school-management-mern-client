import axiosInstance from '../utils/axiosInstance';


export const getAllStudents = () => axiosInstance.get('/students/getAllStudents');
export const createStudent = (data) => axiosInstance.post('/students/createStudent', data);
export const updateStudent = (id, data) => axiosInstance.put(`/students/updateStudent/${id}`, data);
export const deleteStudent = (id) => axiosInstance.delete(`/students/deleteStudent/${id}`);