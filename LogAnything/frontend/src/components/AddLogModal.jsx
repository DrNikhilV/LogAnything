import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const logTypes = [
  { value: "journal", label: "📓 Journal" },
  { value: "tasks", label: "✅ Tasks" },
  { value: "fitness", label: "🏋️ Fitness" },
  { value: "food", label: "🍔 Food" },
  { value: "sleep", label: "🛌 Sleep" },
  { value: "movies", label: "🎬 Movies" },
  { value: "video", label: "🎥 Video" }, // <-- added video
  { value: "custom", label: "✏️ Custom" },
];

const moods = [
  { value: "", label: "No Mood" }, // Add this as the first option
  { value: "happy", label: "🙂 Happy" },
  { value: "sad", label: "😔 Sad" },
  { value: "normal", label: "😐 Normal" },
  { value: "angry", label: "😡 Angry" },
];

const AddLogModal = ({ isOpen, onClose, onLogAdded, theme }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    customType: "",
    mood: "",
    content: "", // used for notes/text
    videoUrl: "", // <-- new field for video URL
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [videoMode, setVideoMode] = useState('url'); // 'url' | 'upload' | 'record'
  const [uploadFile, setUploadFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordPreviewUrl, setRecordPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        type: "",
        customType: "",
        mood: "",
        content: "",
        videoUrl: "", // <-- reset video URL on open
        date: new Date().toISOString().slice(0, 10),
      });
      setVideoMode('url');
      setUploadFile(null);
      setRecording(false);
      setMediaStream(null);
      setMediaRecorder(null);
      setRecordedChunks([]);
      if (recordPreviewUrl) {
        URL.revokeObjectURL(recordPreviewUrl);
        setRecordPreviewUrl('');
      }
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const resolvedType = formData.type === "custom" ? formData.customType : formData.type;
      const fallback = {
        title: formData.title,
        type: resolvedType,
        mood: formData.mood,
        content:
          resolvedType === 'video'
            ? (videoMode === 'url' ? { url: formData.videoUrl, notes: formData.content } : { url: null, notes: formData.content })
            : formData.content,
        date: formData.date,
      };
      let res;
      if (resolvedType === 'video' && (videoMode === 'upload' || videoMode === 'record')) {
        const form = new FormData();
        form.append('title', formData.title);
        form.append('mood', formData.mood);
        form.append('notes', formData.content);
        form.append('date', formData.date);
        const fileToSend = videoMode === 'upload' ? uploadFile : new File(recordedChunks, `recording-${Date.now()}.webm`, { type: 'video/webm' });
        if (!fileToSend) throw new Error('No video file to upload');
        form.append('video', fileToSend);
        res = await axios.post("/api/logs/upload-video", form, {
          headers: { "x-auth-token": token, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const payload = {
          title: formData.title,
          type: resolvedType,
          mood: formData.mood,
          content:
            resolvedType === "video"
              ? { url: formData.videoUrl, notes: formData.content }
              : formData.content,
          date: formData.date,
        };
        res = await axios.post("/api/logs", payload, {
          headers: { "x-auth-token": token },
        });
      }
      setLoading(false);
      // normalize created log so UI doesn't show "undefined"
      const created = res.data?.log || res.data || {};
      const normalized = {
        // prefer server data, fallback to payload/defaults
        _id: created._id || created.id || undefined,
        title: typeof created.title !== "undefined" ? created.title : fallback.title || "",
        type: typeof created.type !== "undefined" ? created.type : fallback.type || "journal",
        mood: typeof created.mood !== "undefined" ? created.mood : fallback.mood || "",
        content:
          typeof created.content !== "undefined" && created.content !== null
            ? created.content
            : fallback.content,
        date: created.date ? new Date(created.date).toISOString() : new Date(fallback.date).toISOString(),
        // include other server fields if present
        ...created,
      };
      onLogAdded(normalized);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to add log");
    }
  };

  if (!isOpen) return null;

  const inputStyle = {
    padding: "10px",
    marginTop: "5px",
    boxSizing: "border-box",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontFamily: 'Poppins, sans-serif'
  };

  const labelStyle = {
    fontFamily: 'Poppins, sans-serif'
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
          fontFamily: 'Poppins, sans-serif'
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

        <h2 style={{ marginBottom: "20px", textAlign: "center", fontFamily: 'Poppins, sans-serif' }}>
          Add New Log
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Entry Title */}
          <div>
            <label style={labelStyle}>Entry Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>

          {/* Log Type Dropdown */}
          <div>
            <label style={labelStyle}>Log Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              style={{ ...inputStyle, width: "100%" }}
            >
              <option value="">Select Type</option>
              {logTypes.map((lt) => (
                <option key={lt.value} value={lt.value}>
                  {lt.label}
                </option>
              ))}
            </select>
            {formData.type === "custom" && (
              <input
                type="text"
                name="customType"
                placeholder="Enter custom type"
                value={formData.customType}
                onChange={handleChange}
                required
                style={{ ...inputStyle, width: "100%", marginTop: "5px" }}
              />
            )}
          </div>

          {/* If video selected, show options */}
          {formData.type === "video" && (
            <div>
              <label style={labelStyle}>Video Source:</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <label><input type="radio" name="videoMode" checked={videoMode==='url'} onChange={()=>setVideoMode('url')} /> URL</label>
                <label><input type="radio" name="videoMode" checked={videoMode==='upload'} onChange={()=>setVideoMode('upload')} /> Upload</label>
                <label><input type="radio" name="videoMode" checked={videoMode==='record'} onChange={()=>setVideoMode('record')} /> Record</label>
              </div>

              {videoMode === 'url' && (
                <div style={{ marginTop: 10 }}>
                  <label style={labelStyle}>Video URL (YouTube or direct MP4):</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    required
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </div>
              )}

              {videoMode === 'upload' && (
                <div style={{ marginTop: 10 }}>
                  <label style={labelStyle}>Upload Video File (.mp4, .webm, .mov, .mkv):</label>
                  <input type="file" accept="video/*" onChange={(e)=>setUploadFile(e.target.files?.[0]||null)} style={{ ...inputStyle, width: '100%' }} />
                </div>
              )}

              {videoMode === 'record' && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {!recording ? (
                      <button type="button" onClick={async ()=>{
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                          setMediaStream(stream);
                          const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
                          const chunks = [];
                          recorder.ondataavailable = (evt)=>{ if (evt.data && evt.data.size > 0) chunks.push(evt.data); };
                          recorder.onstop = ()=>{
                            setRecordedChunks(chunks);
                            const blob = new Blob(chunks, { type: 'video/webm' });
                            const url = URL.createObjectURL(blob);
                            setRecordPreviewUrl(url);
                          };
                          recorder.start();
                          setMediaRecorder(recorder);
                          setRecording(true);
                        } catch (e) {
                          alert('Could not access camera/mic');
                        }
                      }}>Start Recording</button>
                    ) : (
                      <button type="button" onClick={()=>{
                        mediaRecorder?.stop();
                        mediaStream?.getTracks().forEach(t=>t.stop());
                        setRecording(false);
                      }}>Stop Recording</button>
                    )}
                  </div>
                  {recordPreviewUrl && (
                    <video src={recordPreviewUrl} controls style={{ width: '100%', maxHeight: 240, borderRadius: 8 }} />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Date & Mood side by side */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Date */}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                style={{ ...inputStyle, width: "100%" }}
              />
            </div>

            {/* Mood */}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Mood:</label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                style={{ ...inputStyle, width: "100%" }}
              >
                {moods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content: used as notes for video or body for other types */}
          <div>
            <label style={labelStyle}>Content / Notes:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              style={{ ...inputStyle, minHeight: "120px", width: "100%" }}
            />
          </div>

          {/* Save Button */}
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
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {loading ? "Saving..." : "Save Log"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLogModal;