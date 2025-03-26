import { create } from 'zustand';

export const useBookStore = create((set) => ({
  books: [],
  filters: {
    search: '',
    category: '',
    sortBy: 'title',
    sortOrder: 'asc',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  
  setBooks: (books) => set({ books }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, page: 1 }, // Reset to first page when filters change
  })),
  
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),
  
  resetFilters: () => set((state) => ({
    filters: {
      search: '',
      category: '',
      sortBy: 'title',
      sortOrder: 'asc',
    },
    pagination: { ...state.pagination, page: 1 },
  })),
}));