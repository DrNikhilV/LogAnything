import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  const footerStyles = {
    backgroundColor: theme === 'dark' ? '#222' : '#333',
    color: 'white',
    textAlign: 'center',
    padding: '0.25rem 0', // Further reduced vertical padding
    fontSize: '0.75rem', // Smaller font size
    width: '100%',
    boxSizing: 'border-box',
    marginTop: 'auto',
  };

  return (
    <footer style={footerStyles}>
      <p>&copy; {new Date().getFullYear()} LogAnything  | A𝑛𝔠𝑖𝑒𝑛𝑡 𝐶𝑟𝑒𝑎𝑡𝑖𝑜𝑛</p>
    </footer>
  );
};

export default Footer;
