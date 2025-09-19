// src/pages/About.js
import React from 'react';
import ModernHeader from '../components/ModernHeader'; // use modern header here
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget'; // <-- added
import './about.css';

const About = () => {
  const commonFont = "'Poppins', sans-serif";
  const robotoFont = "'Roboto', sans-serif";

  return (
    <>
      <ModernHeader /> {/* removed onAddClick */}

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold', fontFamily: commonFont }}>
            Learn more about LogAnything <br />
            Your secure and trusted journaling companion.
          </p>
        </div>
      </div>

      <div className="about-container">
        <div className="about-content" style={{ fontFamily: robotoFont }}>
          <h2 className="section-title">About LogAnything</h2>

          <p className="paragraph">
            LogAnything is a secure and trusted digital journal that protects your thoughts and memories. Built for simplicity and reliability, it allows you to document your experiences with ease. DayBook prioritizes privacy and a distraction-free experience, ensuring your journaling stays personal, secure, and meaningful.
          </p>

          <hr className="section-divider" />

          <h3 className="section-subtitle">What You Can Do</h3>
          <div className="bullet-list">
            <div className="bullet-item">
              <span className="bullet-symbol">✅</span>
              <span className="bullet-text">Write &amp; Manage Entries: Effortlessly create, edit, and delete daybook entries while keeping them safe.</span>
            </div>
            <div className="bullet-item">
              <span className="bullet-symbol">📅</span>
              <span className="bullet-text">Track Your Memories: Capture experiences from any date, ensuring your journey is well-documented.</span>
            </div>
            <div className="bullet-item">
              <span className="bullet-symbol">🎨</span>
              <span className="bullet-text">Personalize Your Profile: Customize your identity while maintaining account security.</span>
            </div>
            <div className="bullet-item">
              <span className="bullet-symbol">🔒</span>
              <span className="bullet-text">Advanced Security Features: Protect your daybook entries with encrypted authentication, strong passwords, and secure cookies.</span>
            </div>
          </div>

          <hr className="section-divider" />

          <h3 className="section-subtitle">Tech Stack</h3>
          <div className="bullet-list">
            <div className="bullet-item">
              <span className="bullet-symbol">⚛️</span>
              <span className="bullet-text">
                <strong>Frontend</strong>: Frontend: React.js, React Router, React Icons, React Toastify &amp; Axios</span>
            </div>
            <div className="bullet-item">
              <span className="bullet-symbol">🖥️</span>
              <span className="bullet-text">
                <strong>Backend</strong>: Node.js &amp; Express.js</span>
            </div>
            <div className="bullet-item">
              <span className="bullet-symbol">🔑</span>
              <span className="bullet-text">
                <strong>Auth</strong>: JWT tokens &amp; bcryptjs
              </span>
            </div>
            <div className="bullet-item">
              <span className="bullet-symbol">📡</span>
              <span className="bullet-text">
                <strong>State</strong>: React Context API &amp; Local state via React hooks</span>
            </div>
            <div className="bullet-item">
              <span className="bullet-symbol">🗄️</span>
              <span className="bullet-text">
                <strong>Database</strong>: MongoDB &amp; Mongoose</span>
            </div>
          </div>

          <p className="paragraph final-paragraph">
            Start your journaling journey with LogAnything - where your memories are secure, personal, and always accessible.
          </p>
          <div style={{ textAlign: 'center' }}>
            <a 
              href="https://github.com/DrNikhilV" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-button"
            >
              Explore this code on GitHub
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
      <ChatWidget />
    </>
  );
};

export default About;