// import api from './axios';

// export const categoryApi = {
//   getCategories: async (params) => {
//     const response = await api.get('/categories', { params });
//     return response.data;
//   },
  
//   getCategory: async (id) => {
//     const response = await api.get(`/categories/${id}`);
//     return response.data;
//   },
  
//   createCategory: async (categoryData) => {
//     const response = await api.post('/categories', categoryData);
//     return response.data;
//   },
  
//   updateCategory: async (id, categoryData) => {
//     const response = await api.put(`/categories/${id}`, categoryData);
//     return response.data;
//   },
  
//   deleteCategory: async (id) => {
//     const response = await api.delete(`/categories/${id}`);
//     return response.data;
//   },
// };

// src/api/categoryApi.js
import { mockApiClient } from './mockApi';

export const categoryApi = {
  getCategories: mockApiClient.getCategories,
  getCategoriesDropdown: mockApiClient.getCategoriesDropdown,
  getCategory: mockApiClient.getCategory,
  createCategory: mockApiClient.createCategory,
  updateCategory: mockApiClient.updateCategory,
  deleteCategory: mockApiClient.deleteCategory
};