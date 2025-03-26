// src/api/dashboardApi.js
import { mockApiClient } from './mockApi';

export const dashboardApi = {
  getDashboardStats: mockApiClient.getDashboardStats,
  getBasicStats: mockApiClient.getBasicStats,
  getRecentData: mockApiClient.getRecentData
};