// src/pages/Account.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import Footer from '../components/Footer';
import ModernHeader from '../components/ModernHeader';
import ChatWidget from '../components/ChatWidget'; // <-- added

const Account = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // feedback message
  const [editHover, setEditHover] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const localNavigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/user', {
          headers: {
            'x-auth-token': token,
          },
        });
        setUser(res.data);
        // prefill edit inputs
        setEditFirst(res.data?.firstName || '');
        setEditLast(res.data?.lastName || '');
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditClick = () => {
    setSaveStatus('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    // reset edits to current user values
    setEditFirst(user?.firstName || '');
    setEditLast(user?.lastName || '');
    setSaveStatus('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editFirst.trim()) {
      setSaveStatus('First name cannot be empty.');
      return;
    }
    setSaveStatus('Saving...');
    try {
      const token = localStorage.getItem('token');
      const payload = { firstName: editFirst.trim(), lastName: editLast.trim() };
      const res = await axios.put('http://localhost:5000/api/user', payload, {
        headers: { 'x-auth-token': token },
      });
      // assume API returns updated user object
      const updated = res.data || {};
      setUser((prev) => ({ ...(prev || {}), ...updated }));
      setIsEditing(false);
      setSaveStatus('Saved successfully.');
      // optional: notify other components that user changed
      window.dispatchEvent(new Event('user-updated'));
    } catch (err) {
      console.error('Failed to update user:', err);
      setSaveStatus(err.response?.data?.msg || 'Failed to save changes.');
    }
  };

  const poppinsFont = "'Poppins', sans-serif"; // changed from robotoFont

  return (
    <>
      <ModernHeader />
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: poppinsFont }}>
        <h2 style={{ fontFamily: poppinsFont }}>Account Details</h2>
        {user ? (
          <div>
            {/* show editable fields when editing, otherwise display values */}
            {isEditing ? (
              <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: 6 }}>First name</label>
                <input
                  value={editFirst}
                  onChange={(e) => setEditFirst(e.target.value)}
                  style={{ padding: 8, width: '100%', marginBottom: 12, borderRadius: 6, border: '1px solid #ccc' }}
                />
                <label style={{ display: 'block', marginBottom: 6 }}>Last name</label>
                <input
                  value={editLast}
                  onChange={(e) => setEditLast(e.target.value)}
                  style={{ padding: 8, width: '100%', marginBottom: 12, borderRadius: 6, border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
                  <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none' }}>
                    Save
                  </button>
                  <button onClick={handleCancel} style={{ padding: '8px 16px', borderRadius: 6, background: '#e5e7eb', border: 'none' }}>
                    Cancel
                  </button>
                </div>
                {saveStatus && <p style={{ marginTop: 10, color: saveStatus.includes('Saved') ? 'green' : 'red' }}>{saveStatus}</p>}
              </div>
            ) : (
              <>
                <p style={{ fontFamily: poppinsFont }}>
                  <strong>Display Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p style={{ fontFamily: poppinsFont }}>
                  <strong>Email:</strong> {user.email}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
                  {/* stacked actions: edit button above logout icon */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={handleEditClick}
                      onMouseEnter={() => setEditHover(true)}
                      onMouseLeave={() => setEditHover(false)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: poppinsFont,
                        background: theme === 'dark' ? '#60a5fa' : '#3b82f6', // bluish color adapting to theme
                        color: '#fff',
                        transition: 'transform .12s ease, box-shadow .12s ease',
                        transform: editHover ? 'translateY(-2px)' : 'none',
                        boxShadow: editHover ? '0 6px 18px rgba(59,130,246,0.18)' : 'none'
                      }}
                    >
                      Edit name
                    </button>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px',
                        verticalAlign: 'middle',
                      }}
                      title="Logout"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        fill={theme === "dark" ? "#fff" : "currentColor"}
                        viewBox="0 0 24 24"
                      >
                        <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {saveStatus && <p style={{ marginTop: 10, color: saveStatus.includes('Saved') ? 'green' : 'red' }}>{saveStatus}</p>}
              </>
            )}
          </div>
        ) : (
          <p style={{ fontFamily: poppinsFont }}>Loading user data...</p>
        )}
      </div>
      <Footer />
      <ChatWidget />
    </>
  );
};

export default Account;