import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeStyles = {
    dark: {
      backgroundColor: '#333',
      color: 'white',
      minHeight: '100vh', // Ensures background covers full height
      fontFamily: "'Poppins', sans-serif", // changed to Poppins
    },
    light: {
      backgroundColor: 'white',
      color: '#333',
      minHeight: '100vh', // Ensures background covers full height
      fontFamily: "'Poppins', sans-serif", // changed to Poppins
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};