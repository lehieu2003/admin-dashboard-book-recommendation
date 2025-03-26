// import api from './axios';

// export const bookApi = {
//   getBooks: async (params) => {
//     const response = await api.get('/books', { params });
//     return response.data;
//   },
  
//   getBook: async (id) => {
//     const response = await api.get(`/books/${id}`);
//     return response.data;
//   },
  
//   createBook: async (bookData) => {
//     // Use FormData to handle file uploads
//     const formData = new FormData();
    
//     Object.keys(bookData).forEach(key => {
//       if (key === 'coverImage' && bookData[key] instanceof File) {
//         formData.append(key, bookData[key]);
//       } else if (key === 'categories' && Array.isArray(bookData[key])) {
//         bookData[key].forEach(category => {
//           formData.append('categories[]', category);
//         });
//       } else {
//         formData.append(key, bookData[key]);
//       }
//     });
    
//     const response = await api.post('/books', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     return response.data;
//   },
  
//   updateBook: async (id, bookData) => {
//     // Similar to createBook, handle FormData
//     const formData = new FormData();
    
//     Object.keys(bookData).forEach(key => {
//       if (key === 'coverImage' && bookData[key] instanceof File) {
//         formData.append(key, bookData[key]);
//       } else if (key === 'categories' && Array.isArray(bookData[key])) {
//         bookData[key].forEach(category => {
//           formData.append('categories[]', category);
//         });
//       } else {
//         formData.append(key, bookData[key]);
//       }
//     });
    
//     const response = await api.put(`/books/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     return response.data;
//   },
  
//   deleteBook: async (id) => {
//     const response = await api.delete(`/books/${id}`);
//     return response.data;
//   },
// };

// src/api/bookApi.js
import { mockApiClient } from './mockApi';

export const bookApi = {
  getBooks: mockApiClient.getBooks,
  getBook: mockApiClient.getBook,
  createBook: mockApiClient.createBook,
  updateBook: mockApiClient.updateBook,
  deleteBook: mockApiClient.deleteBook,
  batchDeleteBooks: mockApiClient.batchDeleteBooks,
  restoreBook: mockApiClient.restoreBook
};