import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  useEffect(() => {
    // Đồng bộ với localStorage khi darkMode thay đổi
    localStorage.setItem('darkMode', darkMode.toString());

    // Cập nhật thuộc tính data-theme cho body
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  // Hàm toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook để sử dụng theme context
export const useTheme = () => useContext(ThemeContext);
