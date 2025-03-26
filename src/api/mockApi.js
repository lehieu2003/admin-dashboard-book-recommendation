import { mockBooks, mockCategories, mockUsers, mockDashboardStats, mockRecommendationSettings } from '../mock/mockData';

// Helper function to simulate async API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiClient = {
  // Auth API
  async login(credentials) {
    await delay(800);
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      return {
        user: {
          id: 'user-1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        },
        token: 'mock-jwt-token'
      };
    }
    throw { response: { data: { message: 'Invalid email or password' } } };
  },

  // Books API
  async getBooks(params = {}) {
    await delay(600);
    
    let filteredBooks = [...mockBooks];
    
    // Apply filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchLower) || 
        book.author.toLowerCase().includes(searchLower)
      );
    }
    
    if (params.category) {
      filteredBooks = filteredBooks.filter(book => 
        book.categories.some(cat => cat.id === params.category)
      );
    }
    
    // Apply sorting
    if (params.sortBy) {
      filteredBooks.sort((a, b) => {
        if (params.sortOrder === 'desc') {
          return b[params.sortBy].localeCompare(a[params.sortBy]);
        }
        return a[params.sortBy].localeCompare(b[params.sortBy]);
      });
    }
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    return {
      books: paginatedBooks,
      total: filteredBooks.length,
      page,
      limit
    };
  },
  
  async getBook(id) {
    await delay(400);
    const book = mockBooks.find(book => book.id === id);
    if (!book) {
      throw { response: { data: { message: 'Book not found' } } };
    }
    return book;
  },
  
  async createBook(bookData) {
    await delay(800);
    return {
      id: `book-${mockBooks.length + 1}`,
      ...bookData,
      createdAt: new Date().toISOString()
    };
  },
  
  async updateBook(id, bookData) {
    await delay(800);
    return {
      id,
      ...bookData,
      updatedAt: new Date().toISOString()
    };
  },
  
  async deleteBook() {
    await delay(600);
    return { success: true };
  },

  // Categories API
  async getCategories(params = {}) {
    await delay(400);
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = mockCategories.slice(startIndex, endIndex);
    
    return {
      categories: paginatedCategories,
      total: mockCategories.length,
      page,
      limit
    };
  },
  
  async getCategory(id) {
    await delay(300);
    const category = mockCategories.find(cat => cat.id === id);
    if (!category) {
      throw { response: { data: { message: 'Category not found' } } };
    }
    return category;
  },
  
  async createCategory(categoryData) {
    await delay(600);
    return {
      id: `cat-${mockCategories.length + 1}`,
      ...categoryData,
      createdAt: new Date().toISOString()
    };
  },
  
  async updateCategory(id, categoryData) {
    await delay(600);
    return {
      id,
      ...categoryData,
      updatedAt: new Date().toISOString()
    };
  },
  
  async deleteCategory() {
    await delay(500);
    return { success: true };
  },

  // Users API
  async getUsers(params = {}) {
    await delay(500);
    
    let filteredUsers = [...mockUsers];
    
    // Apply filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (params.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }
    
    if (params.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status);
    }
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit
    };
  },
  
  async getUser(id) {
    await delay(300);
    const user = mockUsers.find(user => user.id === id);
    if (!user) {
      throw { response: { data: { message: 'User not found' } } };
    }
    return user;
  },
  
  async updateUser(id, userData) {
    await delay(600);
    return {
      id,
      ...userData,
      updatedAt: new Date().toISOString()
    };
  },
  
  async deleteUser() {
    await delay(500);
    return { success: true };
  },

  // Dashboard API
  async getDashboardStats() {
    await delay(700);
    return mockDashboardStats;
  },

  // Recommendation Settings API
  async getRecommendationSettings() {
    await delay(400);
    return mockRecommendationSettings;
  },
  
  async updateRecommendationSettings(settings) {
    await delay(600);
    return settings;
  }
};