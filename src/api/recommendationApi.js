// src/api/recommendationApi.js
import { mockApiClient } from './mockApi';

export const recommendationApi = {
  getRecommendationSettings: mockApiClient.getRecommendationSettings,
  updateRecommendationSettings: mockApiClient.updateRecommendationSettings
};