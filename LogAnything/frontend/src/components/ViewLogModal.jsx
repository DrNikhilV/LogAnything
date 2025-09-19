import React from "react";
import { FaTimes } from "react-icons/fa";

const ViewLogModal = ({ isOpen, log, onClose, theme }) => {
  if (!isOpen || !log) return null;

  const getYouTubeId = (url) => {
    if (!url) return null;
    const ytRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const m = url.match(ytRegex);
    return m ? m[1] : null;
  };

  const renderVideo = (content) => {
    const url = typeof content === 'string' ? content : content?.url || "";
    const ytId = getYouTubeId(url);
    if (ytId) {
      return <iframe title="video" src={`https://www.youtube.com/embed/${ytId}`} style={{ width: "100%", height: 360, border: 0 }} allowFullScreen />;
    }
    // fallback: direct mp4 link
    if (typeof url === 'string' && url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
      return <video src={url} controls style={{ width: "100%", maxHeight: 360 }} />;
    }
    // otherwise show link
    return <a href={url} target="_blank" rel="noreferrer">{url}</a>;
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
          maxWidth: "800px",
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
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>{log.title || log.type}</h2>
        <div>
          <strong>Type:</strong> {log.type} <br />
          <strong>Mood:</strong> {log.mood} <br />
          <strong>Date:</strong> {new Date(log.date).toLocaleDateString()} <br />
          <strong>Content:</strong>
          <div style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
            {log.type === "video" ? renderVideo(log.content) :
              (typeof log.content === "object" ? JSON.stringify(log.content, null, 2) : log.content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLogModal;
