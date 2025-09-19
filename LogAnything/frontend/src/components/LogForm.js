// src/components/LogForm.js
import React, { useState } from 'react';
import axios from 'axios';

const LogForm = ({ onLogAdded }) => {
  const [logData, setLogData] = useState({
    user: 'nikhi', // You'll replace this with the logged-in user's ID later
    type: 'journal',
    content: {}, // Will be an object
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setLogData({ ...logData, type: value, content: {} });
    } else if (name === 'date') {
      setLogData({ ...logData, date: value });
    } else {
      setLogData({
        ...logData,
        content: {
          ...logData.content,
          [name]: value,
        },
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/logs', logData, {
        headers: token ? { 'x-auth-token': token } : undefined,
      });
      const created = res.data?.log || res.data;
      alert('Log added successfully!');
      if (typeof onLogAdded === 'function') onLogAdded(created); // provide created log to parent
    } catch (error) {
      console.error('There was an error adding the log!', error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Add a New Log</h3>
      <select name="type" value={logData.type} onChange={onChange}>
        <option value="journal">Journal</option>
        <option value="fitness">Fitness</option>
        <option value="food">Food</option>
        <option value="movie">Movie</option>
        <option value="video">Video</option> {/* <-- added */}
      </select>
      {logData.type === 'journal' && (
        <input type="text" name="entry" placeholder="Journal Entry" onChange={onChange} />
      )}
      {logData.type === 'fitness' && (
        <>
          <input type="text" name="activity" placeholder="Activity (e.g., Running)" onChange={onChange} />
          <input type="number" name="duration" placeholder="Duration (min)" onChange={onChange} />
        </>
      )}
      {logData.type === 'video' && (
        <>
          <input type="url" name="videoUrl" placeholder="Video URL (YouTube or mp4)" onChange={onChange} />
          <textarea name="notes" placeholder="Notes about the video" onChange={onChange} />
        </>
      )}
      <input type="date" name="date" value={logData.date} onChange={onChange} />
      <button type="submit">Add Log</button>
    </form>
  );
};

export default LogForm;