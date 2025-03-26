// src/mock/mockData.js
export const mockBooks = Array.from({ length: 20 }).map((_, index) => ({
  id: `book-${index + 1}`,
  title: `Book Title ${index + 1}`,
  author: `Author ${index + 1}`,
  isbn: `978-3-16-148410-${index}`,
  description: `This is a detailed description for Book ${index + 1}. It contains information about the plot, characters, and themes of the book.`,
  publisher: `Publisher ${index % 5 + 1}`,
  publishedDate: `202${index % 5}-0${index % 9 + 1}-0${index % 20 + 1}`,
  categories: [
    { id: `cat-${index % 5 + 1}`, name: `Category ${index % 5 + 1}` },
    { id: `cat-${(index + 2) % 5 + 1}`, name: `Category ${(index + 2) % 5 + 1}` }
  ],
  coverImage: `https://picsum.photos/seed/book${index}/200/300`,
  rating: (Math.random() * 5).toFixed(1),
}));

export const mockCategories = Array.from({ length: 10 }).map((_, index) => ({
  id: `cat-${index + 1}`,
  name: `Category ${index + 1}`,
  description: `Description for category ${index + 1}`,
  booksCount: Math.floor(Math.random() * 30)
}));

export const mockUsers = Array.from({ length: 15 }).map((_, index) => ({
  id: `user-${index + 1}`,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  role: index < 2 ? 'admin' : 'user',
  status: index % 5 === 0 ? 'inactive' : 'active',
  createdAt: `2023-${(index % 12) + 1}-${(index % 28) + 1}`,
  lastLogin: index % 3 === 0 ? null : `2023-${(index % 12) + 1}-${(index % 28) + 1}`
}));

export const mockDashboardStats = {
  totalBooks: 256,
  totalUsers: 184,
  totalCategories: 12,
  totalReviews: 873,
  topCategories: [
    { name: 'Fiction', count: 78 },
    { name: 'Science Fiction', count: 52 },
    { name: 'Mystery', count: 43 },
    { name: 'History', count: 38 },
    { name: 'Biography', count: 25 }
  ],
  userActivity: [
    { month: 'Jan', newUsers: 24, recommendations: 156 },
    { month: 'Feb', newUsers: 18, recommendations: 132 },
    { month: 'Mar', newUsers: 29, recommendations: 187 },
    { month: 'Apr', newUsers: 32, recommendations: 205 },
    { month: 'May', newUsers: 25, recommendations: 178 },
    { month: 'Jun', newUsers: 30, recommendations: 192 }
  ]
};

export const mockRecommendationSettings = {
  algorithmType: 'hybrid',
  similarityThreshold: 0.6,
  maxRecommendations: 15,
  includeRatings: true,
  includeGenres: true,
  includePopularity: true,
  recencyWeight: 0.4,
  popularityWeight: 0.3,
  ratingWeight: 0.3,
  refreshInterval: 24,
};