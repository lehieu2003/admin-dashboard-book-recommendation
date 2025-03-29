// src/contexts/ThemeContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Lấy thông tin từ localStorage hoặc dùng light mode làm mặc định
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Cập nhật localStorage khi thay đổi mode
  // Trong ThemeContext.js, thêm effect để đồng bộ với localStorage
useEffect(() => {
  // Đồng bộ với localStorage khi darkMode thay đổi
  localStorage.setItem('darkMode', darkMode.toString());
  
  // Cập nhật thuộc tính data-theme cho body
  document.body.dataset.theme = darkMode ? 'dark' : 'light';
}, [darkMode]);

  // Hàm toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook để sử dụng theme context
export const useTheme = () => useContext(ThemeContext);