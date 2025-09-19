import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Account from './pages/Account';
import Analytics from './pages/Analytics'; // new
import Featured from './pages/Featured';   // new
import { useTheme } from './contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify

const App = () => {
  const { themeStyles, theme } = useTheme();

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <div style={{
      ...themeStyles[theme],
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/analytics" element={<Analytics />} />   {/* new */}
          <Route path="/featured" element={<Featured />} />     {/* new */}
          <Route path="/home" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path="/account" element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
      {/* Add ToastContainer at the root level */}
      <ToastContainer />
    </div>
  );
};

export default App;
