import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const EditLogModal = ({ isOpen, log, onClose, onSave, theme }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    mood: "",
    content: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && log) {
      setFormData({
        title: log.title || "",
        type: log.type || "",
        mood: log.mood || "",
        content: typeof log.content === "object" ? JSON.stringify(log.content) : log.content || "",
        date: log.date ? new Date(log.date).toISOString().slice(0, 10) : "",
      });
    }
  }, [isOpen, log]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title,
        type: formData.type,
        mood: formData.mood,
        content: formData.content,
        date: formData.date,
      };
      const res = await axios.put(`http://localhost:5000/api/logs/${log._id}`, payload, {
        headers: { "x-auth-token": token },
      });
      setLoading(false);
      onSave(res.data.log);
    } catch (err) {
      setLoading(false);
      alert("Failed to update log");
    }
  };

  if (!isOpen || !log) return null;

  const inputStyle = {
    padding: "10px",
    marginTop: "5px",
    boxSizing: "border-box",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: theme === "dark" ? "#222" : "#fff",
          padding: "30px",
          borderRadius: "12px",
          width: "95%",
          maxWidth: "600px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "transparent",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: theme === "dark" ? "#fff" : "#333",
          }}
        >
          <FaTimes />
        </button>

        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Edit Log</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label>Entry Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <div>
            <label>Log Type:</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <div>
            <label>Mood:</label>
            <input
              type="text"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              required
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              style={{ ...inputStyle, minHeight: "120px", width: "100%" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              alignSelf: "center",
              padding: "10px 25px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLogModal;
