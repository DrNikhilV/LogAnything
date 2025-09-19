import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AddLogModal from "../components/AddLogModal";
import EditLogModal from "../components/EditLogModal";
import ViewLogModal from "../components/ViewLogModal";
import ModernHeader from "../components/ModernHeader";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [showAddLog, setShowAddLog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showEditLog, setShowEditLog] = useState(false);
  const [showViewLog, setShowViewLog] = useState(false);
  const navigate = useNavigate();
  const { theme, themeStyles } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      try {
        const userRes = await axios.get("http://localhost:5000/api/user", {
          headers: { "x-auth-token": token },
        });
        setUser(userRes.data);

        const logsRes = await axios.get("http://localhost:5000/api/logs", {
          headers: { "x-auth-token": token },
        });
        setLogs(logsRes.data);
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/logs/${id}`, {
        headers: { "x-auth-token": token },
      });
      setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
    } catch {
      alert("Failed to delete log");
    }
  }, []);

  const handleEdit = useCallback((log) => {
    setSelectedLog(log);
    setShowEditLog(true);
  }, []);

  const handleView = useCallback((log) => {
    setSelectedLog(log);
    setShowViewLog(true);
  }, []);

  const handleEditSave = useCallback((updatedLog) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) => (log._id === updatedLog._id ? updatedLog : log))
    );
    setShowEditLog(false);
    setSelectedLog(null);
  }, []);

  // Add: format a date to local YYYY-MM-DD to avoid UTC offset issues
  const formatDateLocal = (d) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  const highlightDates = useMemo(() => {
    const s = new Set();
    logs.forEach((l) => {
      try {
        // use local date string instead of toISOString() which is UTC-based
        s.add(formatDateLocal(l.date));
      } catch {}
    });
    return s;
  }, [logs]);

  const heroImage =
    "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1400&q=80";

  const quotes = [
    {
      q: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      a: "Aristotle",
    },
    {
      q: "Small daily improvements are the key to staggering long-term results.",
      a: "James Clear",
    },
    {
      q: "The secret of your future is hidden in your daily routine.",
      a: "Mike Murdock",
    },
  ];

  const poppinsFont = "'Poppins', sans-serif";

  const IconBtn = ({ onClick, title, color, children }) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        background: color || (theme === "dark" ? "#111827" : "#f3f4f6"),
        color: theme === "dark" ? "#fff" : "#111827",
        boxShadow: "0 6px 16px rgba(2,6,23,0.08)",
        transition: "transform 140ms ease, box-shadow 140ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </button>
  );

  const LogCard = React.memo(({ log, idx }) => {
    const accent = ["#7c3aed", "#2563eb", "#06b6d4", "#34d399", "#f97316"][idx % 5];
    const cardBg = theme === "dark" ? "#081224" : "#fff";
    const textColor = theme === "dark" ? "#e6eef8" : "#0f1724";

    return (
      <article
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          background: cardBg,
          color: textColor,
          display: "flex",
          flexDirection: "column",
          minHeight: 180,
          transition: "transform 200ms ease, box-shadow 200ms ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
        }}
      >
        <div style={{ height: 8, background: accent }} />
        <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {log.title || (log.type && log.type.charAt(0).toUpperCase() + log.type.slice(1))}
              </h3>
              <div style={{ fontSize: 12, color: theme === "dark" ? "#94a3b8" : "#6b7280" }}>
                {new Date(log.date).toLocaleDateString()}
              </div>
            </div>
            <p style={{ marginTop: 10, color: theme === "dark" ? "#cbd5e1" : "#475569", lineHeight: 1.4 }}>
              {typeof log.content === "object"
                ? JSON.stringify(log.content).slice(0, 220) + "..."
                : String(log.content).slice(0, 220) + "..."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <IconBtn onClick={() => handleView(log)} title="View" color={theme === "dark" ? "#0b1220" : "#eef2ff"}>
              <FaEye />
            </IconBtn>
            <IconBtn onClick={() => handleEdit(log)} title="Edit" color="#eef6ff">
              <FaEdit style={{ color: "#2563eb" }} />
            </IconBtn>
            <IconBtn onClick={() => handleDelete(log._id)} title="Delete" color="#fff1f2">
              <FaTrash style={{ color: "#ef4444" }} />
            </IconBtn>
          </div>
        </div>
      </article>
    );
  });

  const MiniCalendar = React.memo(({ highlights = new Set() }) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const days = last.getDate();

    const dayBoxes = [];
    for (let i = 0; i < startDay; i++) {
      dayBoxes.push(<div key={`empty-${i}`} />);
    }
    for (let d = 1; d <= days; d++) {
      // build the date using local constructor and format with the same local formatter
      const dateObj = new Date(year, month, d);
      const dateStr = formatDateLocal(dateObj);
      const isHighlighted = highlights.has(dateStr);
      const isToday = dateStr === formatDateLocal(today);
      dayBoxes.push(
        <div
          key={d}
          style={{
            textAlign: "center",
            padding: "8px 4px",
            borderRadius: 6,
            background: isToday ? "#2563eb" : isHighlighted ? "#34d399" : "transparent",
            color: isToday ? "#fff" : isHighlighted ? "#065f46" : theme === "dark" ? "#cbd5e1" : "#475569",
            fontWeight: isToday ? 600 : 400,
            cursor: "default",
          }}
        >
          {d}
        </div>
      );
    }

    return (
      <div style={{ maxWidth: 220, margin: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} style={{ fontSize: 12, color: theme === "dark" ? "#94a3b8" : "#6b7280", textAlign: "center" }}>
              {day}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 4 }}>
          {dayBoxes}
        </div>
      </div>
    );
  });

  return (
    <div style={{ fontFamily: poppinsFont, background: theme === "dark" ? "#0f172a" : "#f8fafc", color: theme === "dark" ? "#e6eef8" : "#0f1724" }}>
      <ModernHeader searchValue={search} onSearch={setSearch} />

      <section style={{ position: "relative", textAlign: "center" }}>
        <img src={heroImage} alt="Hero" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 12 }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#fff" }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}>Track. Reflect. Grow.</h1>
          <p style={{ fontSize: 18, marginTop: 12, textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}>
            Keep a daily log of your activities, thoughts, and reflections. Build habits that last.
          </p>
          <button
            onClick={() => setShowAddLog(true)}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "background 200ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
          >
            Add New Log
          </button>
        </div>
      </section>

      <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, padding: "40px 20px" }}>
        {/* Left Column */}
        <div style={{ flex: "1 1 350px", maxWidth: 600 }}>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Your Logs</h2>
          {logs.length === 0 ? (
            <p style={{ color: theme === "dark" ? "#94a3b8" : "#6b7280" }}>No logs yet. Start by adding one!</p>
          ) : (
            <div style={{ display: "grid", gap: 20 }}>
              {logs
                .filter((log) => {
                  const q = search.trim().toLowerCase();
                  if (!q) return true;
                  const title = (log.title || "").toLowerCase();
                  const type = (log.type || "").toLowerCase();
                  const mood = (log.mood || "").toLowerCase();
                  const content = (typeof log.content === "object" ? JSON.stringify(log.content) : String(log.content || "")).toLowerCase();
                  return (
                    title.includes(q) ||
                    type.includes(q) ||
                    mood.includes(q) ||
                    content.includes(q)
                  );
                })
                .map((log, idx) => (
                <LogCard key={log._id} log={log} idx={idx} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ flex: "1 1 300px", maxWidth: 400 }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, marginBottom: 20 }}>This Month</h2>
            <MiniCalendar highlights={highlightDates} />
          </div>
          <div>
            <h2 style={{ fontSize: 24, marginBottom: 20 }}>Quotes to Inspire</h2>
            {quotes.map((q, idx) => (
              <blockquote
                key={idx}
                style={{
                  marginBottom: 20,
                  fontStyle: "italic",
                  background: theme === "dark" ? "#1e293b" : "#fff",
                  borderLeft: `4px solid ${["#7c3aed", "#2563eb", "#06b6d4"][idx % 3]}`,
                  padding: "12px 16px",
                  borderRadius: 8,
                  color: theme === "dark" ? "#cbd5e1" : "#475569",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 150ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                "{q.q}"
                <span style={{ fontWeight: 600, display: "block", marginTop: 8, color: theme === "dark" ? "#94a3b8" : "#6b7280" }}>
                  — {q.a}
                </span>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <ChatWidget />

      {/* Modals */}
      <AddLogModal
        isOpen={showAddLog}
        onClose={() => setShowAddLog(false)}
        onLogAdded={(newLog) => {
          setLogs((prev) => [newLog, ...prev]);
          setShowAddLog(false);
        }}
        theme={theme}
      />
      <EditLogModal isOpen={showEditLog} onClose={() => setShowEditLog(false)} log={selectedLog} onSave={handleEditSave} theme={theme} />
      <ViewLogModal isOpen={showViewLog} onClose={() => setShowViewLog(false)} log={selectedLog} theme={theme} />
    </div>
  );
};

export default HomePage;
