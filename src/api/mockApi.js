import { mockBooks, mockCategories, mockUsers, mockDashboardStats, mockRecommendationSettings } from '../mock/mockData';

// Helper function to simulate async API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage for uploaded files
const mockUploadedFiles = [
  {
    id: 'file-1',
    name: 'cover-image-1.jpg',
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000',
    type: 'image/jpeg',
    size: 234567,
    uploadedAt: '2023-11-10T08:30:00Z'
  },
  {
    id: 'file-2',
    name: 'cover-image-2.jpg',
    url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000',
    type: 'image/jpeg',
    size: 345678,
    uploadedAt: '2023-11-11T09:15:00Z'
  }
];

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
  
  // async deleteBook(id) {
  //   await delay(600);
  //   // Find the index of the book to delete
  //   const bookIndex = mockBooks.findIndex(book => book.id === id);
    
  //   if (bookIndex !== -1) {
  //     // Create a copy of mockBooks with the book removed
  //     const updatedBooks = [...mockBooks];
  //     updatedBooks.splice(bookIndex, 1);
      
  //     // Replace the mockBooks array with the updated version
  //     // Note: In a real implementation, this would be handled by the backend
  //     mockBooks.length = 0;
  //     mockBooks.push(...updatedBooks);
      
  //     return { 
  //       success: true, 
  //       message: 'Book deleted successfully',
  //       deletedId: id
  //     };
  //   }
    
  //   throw { response: { data: { message: 'Book not found' } } };
  // },
  
  async batchDeleteBooks(bookIds) {
    await delay(800);
    
    // Filter out the books that are being deleted
    const remainingBooks = mockBooks.filter(book => !bookIds.includes(book.id));
    
    // Update the mockBooks array
    // Note: In a real implementation, this would be handled by the backend
    mockBooks.length = 0;
    mockBooks.push(...remainingBooks);
    
    return { 
      success: true,
      deletedCount: bookIds.length,
      deletedIds: bookIds,
      message: `Successfully deleted ${bookIds.length} books`
    };
  },

  async restoreBook(bookIds) {
    await delay(800);
    return {
      success: true,
      restoredCount: bookIds.length,
      message: `Successfully restored ${bookIds.length} books`
    }
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
  },

  // File Upload API
  async uploadFile(formData) {
    await delay(1000);
    
    // Extract file from FormData (simulating backend processing)
    const file = formData.get('file');
    
    if (!file) {
      throw { response: { data: { message: 'No file provided' } } };
    }
    
    // Create a mock response with file information
    const fileId = `file-${mockUploadedFiles.length + 1}`;
    const fileName = file.name || `file-${Date.now()}`;
    
    // Generate a mock URL for the uploaded file
    // In a real implementation, this would be a URL to the stored file
    const mockUrl = `https://example.com/uploads/${fileName}`;
    
    // Create a new file record
    const newFile = {
      id: fileId,
      name: fileName,
      url: mockUrl,
      type: file.type || 'application/octet-stream',
      size: file.size || 0,
      uploadedAt: new Date().toISOString()
    };
    
    // Add to mock storage
    mockUploadedFiles.push(newFile);
    
    return newFile;
  },
  
  async getUploadedFiles(params = {}) {
    await delay(600);
    
    // Apply pagination if needed
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFiles = mockUploadedFiles.slice(startIndex, endIndex);
    
    return {
      files: paginatedFiles,
      total: mockUploadedFiles.length,
      page,
      limit
    };
  },
  
  async deleteUploadedFile(fileId) {
    await delay(700);
    
    // Find the index of the file
    const fileIndex = mockUploadedFiles.findIndex(file => file.id === fileId);
    
    if (fileIndex === -1) {
      throw { response: { data: { message: 'File not found' } } };
    }
    
    // Remove the file
    const [deletedFile] = mockUploadedFiles.splice(fileIndex, 1);
    
    return {
      success: true,
      message: 'File deleted successfully',
      deletedFile
    };
  }
};