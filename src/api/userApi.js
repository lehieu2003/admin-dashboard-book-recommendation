// import api from './axios';

// export const userApi = {
//   getUsers: async (params) => {
//     const response = await api.get('/users', { params });
//     return response.data;
//   },
  
//   getUser: async (id) => {
//     const response = await api.get(`/users/${id}`);
//     return response.data;
//   },
  
//   createUser: async (userData) => {
//     const response = await api.post('/users', userData);
//     return response.data;
//   },
  
//   updateUser: async (id, userData) => {
//     const response = await api.put(`/users/${id}`, userData);
//     return response.data;
//   },
  
//   deleteUser: async (id) => {
//     const response = await api.delete(`/users/${id}`);
//     return response.data;
//   },
// };

import { mockApiClient } from './mockApi';

export const userApi = {
  getUsers: mockApiClient.getUsers,
  getUser: mockApiClient.getUser,
  createUser: mockApiClient.createUser,
  updateUser: mockApiClient.updateUser,
  deleteUser: mockApiClient.deleteUser,
  batchDeleteUsers: mockApiClient.batchDeleteUsers,
  restoreUser: mockApiClient.restoreUser,
  changeUserRole: mockApiClient.changeUserRole
};