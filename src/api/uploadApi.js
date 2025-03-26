// src/api/uploadApi.js
import { mockApiClient } from './mockApi';

export const uploadApi = {
  uploadFile: mockApiClient.uploadFile,
  getUploadedFiles: mockApiClient.getUploadedFiles,
  deleteUploadedFile: mockApiClient.deleteUploadedFile
};