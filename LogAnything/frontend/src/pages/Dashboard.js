// src/pages/Dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '../components/Header'; // <-- add old header
import ChatWidget from '../components/ChatWidget'; // <-- added
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false); // for scroll animation
  const featureRef = useRef(null);
  const { theme, themeStyles } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/user', {
            headers: { 'x-auth-token': token },
          });
          setUser(res.data);
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (featureRef.current) {
        const top = featureRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (top < windowHeight - 100) {
          setVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const poppinsFont = "'Poppins', sans-serif"; // changed from robotoFont

  const sectionStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px - 52px)',
    padding: '2rem',
    fontFamily: poppinsFont,
  };

  const textContainerStyle = {
    textAlign: 'center',
    padding: '1rem',
    maxWidth: '48rem',
    margin: '0 auto',
    fontFamily: poppinsFont,
  };

  const featureSectionStyle = {
    marginTop: '4rem',
    maxWidth: '70rem',
    margin: '0 auto',
    padding: '2rem',
    opacity: visible ? 1 : 0,
    transition: 'opacity 1s ease-in-out',
    fontFamily: poppinsFont,
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
    fontFamily: poppinsFont,
  };

  const featureCardStyle = {
    padding: '1rem',
    backgroundColor: theme === 'dark' ? '#2d3748' : '#f8fafc',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    borderRadius: '0.5rem',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: poppinsFont,
  };

  const headingStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    fontFamily: poppinsFont,
  };

  const paragraphStyle = {
    fontSize: '1.125rem',
    marginTop: '1rem',
    fontFamily: poppinsFont,
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '1.5rem',
    transition: 'background-color 0.3s, transform 0.2s',
    fontFamily: poppinsFont,
  };

  const subHeadingStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '0.5rem',
    fontFamily: poppinsFont,
  };

  const scrollDownStyle = {
    marginTop: '1rem',
    fontSize: '1rem',
    fontWeight: '500',
    animation: 'bob 1.5s infinite alternate',
    fontFamily: poppinsFont,
  };

  return (
    <div style={{ ...themeStyles[theme], minHeight: '100vh', fontFamily: poppinsFont }}>
      <Header /> {/* show old header on root (/) */}
      
      <div style={{ ...sectionStyle, marginTop: '-2rem' }}>
        <div style={textContainerStyle}>
          {user ? (
            <>
              <h1 style={headingStyle}>Welcome Back, {user.firstName}</h1>
              <p style={paragraphStyle}>
                Hey! Great to have you back 😊 Your logs are safe, private, and always within reach. No rules, just your thoughts, your way. Keep logging, keep growing! 🚀✨
              </p>
              <Link to="/home" style={buttonStyle}>
                Go to Your Logs
              </Link>
            </>
          ) : (
            <>
              <h1 style={headingStyle}>Welcome to LogAnything</h1>
              <p style={paragraphStyle}>
                Hey! Great to have you here 😊 Log in to keep your logs safe, private, and always within reach. Write freely, your thoughts your way! 🚀✨
              </p>
              <Link 
                to="/login" 
                style={buttonStyle} 
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Get Started
              </Link>
              <div style={scrollDownStyle}>Scroll down to discover more ↓</div>
            </>
          )}
        </div>
      </div>

      {/* Feature Section moved below scroll text */}
      <div ref={featureRef} style={featureSectionStyle}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', paddingBottom: '1rem' }}>
          Working & Key Features
        </h2>

        <div style={gridContainerStyle}>
          <div>
            <h3 style={subHeadingStyle}>Getting Started is Simple</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div 
                style={featureCardStyle} 
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'semibold' }}>Sign Up</h4>
                <p style={{ color: theme === 'dark' ? '#a0aec0' : '#718096' }}>
                  Create a free account to start your journey. Your data is securely stored, ensuring your private thoughts remain personal.
                </p>
              </div>
              <div 
                style={featureCardStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'semibold' }}>Start Logging</h4>
                <p style={{ color: theme === 'dark' ? '#a0aec0' : '#718096' }}>
                  Log anything without limitations. Capture your thoughts and important events, and revisit them anytime.
                </p>
              </div>
              <div 
                style={featureCardStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'semibold' }}>Manage Profile</h4>
                <p style={{ color: theme === 'dark' ? '#a0aec0' : '#718096' }}>
                  Update your first name, last name, and change your password to keep your account secure and personalized.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 style={subHeadingStyle}>Features Designed for You</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div 
                style={featureCardStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'semibold' }}>Multi-Category Logging</h4>
                <p style={{ color: theme === 'dark' ? '#a0aec0' : '#718096' }}>
                  Develop a daily habit of logging different aspects of your life—fitness, food, movies, and more—all in one place.
                </p>
              </div>
              <div 
                style={featureCardStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'semibold' }}>Log Management</h4>
                <p style={{ color: theme === 'dark' ? '#a0aec0' : '#718096' }}>
                  Easily add and view entries. You can also edit and delete them as needed to keep your thoughts organized.
                </p>
              </div>
              <div 
                style={featureCardStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'semibold' }}>Secure & Private</h4>
                <p style={{ color: theme === 'dark' ? '#a0aec0' : '#718096' }}>
                  Your logs are stored securely on the cloud, ensuring that no data is lost. Manage your profile details safely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <ChatWidget />

      <style>
        {`
          @keyframes bob {
            0% { transform: translateY(0px); }
            100% { transform: translateY(8px); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
