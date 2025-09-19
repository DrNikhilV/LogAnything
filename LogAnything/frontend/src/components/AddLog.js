// src/components/AddLog.js
import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const LogTypes = [
  'Journal', 'Fitness', 'Food I Ate', 'Recipes', 'Movie', 'Video', 'Sleep', 'To-Do/Tasks', 'Custom'
];

const AddLog = ({ onLogAdded }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [logContent, setLogContent] = useState({});
  const [message, setMessage] = useState('');
  const { theme } = useTheme();

  const handleSelect = (type) => {
    setSelectedType(type);
    setLogContent({});
    setMessage('');
  };

  const handleChange = (e) => {
    setLogContent({ ...logContent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to add a log.');
      return;
    }

    const newLog = {
      type: selectedType,
      content: logContent,
      date: new Date().toISOString(),
    };

    try {
      // POST to the main logs endpoint
      await axios.post('http://localhost:5000/api/logs', newLog, {
        headers: { 'x-auth-token': token },
      });
      
      setMessage('Log added successfully!');
      setSelectedType(null);
      setLogContent({});
      onLogAdded();
    } catch (err) {
      console.error('Error adding log:', err.response?.data?.msg || err.message);
      setMessage(err.response?.data?.msg || 'Failed to add log.');
    }
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'Journal':
        return <textarea name="entry" placeholder="Write your journal entry..." onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}></textarea>;
      case 'Fitness':
        return (
          <>
            <input type="text" name="activity" placeholder="Activity (e.g., Running)" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
            <input type="number" name="duration" placeholder="Duration (min)" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
          </>
        );
      case 'Food I Ate':
        return <textarea name="description" placeholder="What did you eat?" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}></textarea>;
      case 'Recipes':
        return (
          <>
            <input type="text" name="name" placeholder="Recipe Name" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
            <textarea name="ingredients" placeholder="Ingredients (e.g., 2 eggs, 1 cup flour)" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}></textarea>
            <textarea name="instructions" placeholder="Instructions" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}></textarea>
          </>
        );
      case 'Movie':
        return (
          <>
            <input type="text" name="title" placeholder="Movie Title" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
            <input type="text" name="rating" placeholder="Your Rating (1-5)" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
            <textarea name="notes" placeholder="Your thoughts on the movie" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}></textarea>
          </>
        );
      case 'Video': // <-- new case
        return (
          <>
            <input type="url" name="url" placeholder="Video URL (YouTube or direct mp4)" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
            <textarea name="notes" placeholder="Notes about the video" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}></textarea>
          </>
        );
      case 'Sleep':
        return (
          <>
            <input type="number" name="hours" placeholder="Hours slept" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
            <textarea name="notes" placeholder="How was your sleep?" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}></textarea>
          </>
        );
      case 'To-Do/Tasks':
        return (
          <>
            <input type="text" name="task" placeholder="Task description" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
            <input type="date" name="dueDate" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
          </>
        );
      case 'Custom':
        return (
          <>
            <input type="text" name="title" placeholder="Custom Category Title" onChange={handleChange} style={{ width: 'calc(100% - 16px)' }} />
            <textarea name="text" placeholder="Add your custom text here..." onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}></textarea>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h3>Add a New Log</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {LogTypes.map(type => (
          <div
            key={type}
            onClick={() => handleSelect(type)}
            className={`log-type-block ${theme === 'dark' ? 'log-type-block-dark' : 'log-type-block-light'}`}
            style={{
              padding: '20px',
              border: `1px solid ${selectedType === type ? 'blue' : (theme === 'dark' ? '#666' : '#ccc')}`,
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              flex: '1 1 auto',
              maxWidth: '150px',
            }}>
            {type}
          </div>
        ))}
      </div>
      {selectedType && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {renderForm()}
          <input type="date" name="date" value={logContent.date || ''} onChange={handleChange} style={{ width: 'calc(100% - 16px)' }}/>
          <button type="submit" style={{ backgroundColor: theme === 'dark' ? '#007bff' : '#007bff', color: 'white' }}>Create Log</button>
        </form>
      )}
      {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default AddLog;