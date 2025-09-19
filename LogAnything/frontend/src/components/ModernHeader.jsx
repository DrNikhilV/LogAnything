import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";
import "./ModernHeader.css";

const ModernHeader = ({ searchValue, onSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [hasNew, setHasNew] = useState(false);
  const [logsCount, setLogsCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState([]);
  const [showNotifyPanel, setShowNotifyPanel] = useState(false);
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/user", {
          headers: { "x-auth-token": token },
        });
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Poll logs count to detect new logs
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/logs", {
          headers: { "x-auth-token": token },
        });
        if (!mounted) return;
        const count = Array.isArray(res.data) ? res.data.length : 0;
        const stored = parseInt(localStorage.getItem("logsCount") || "0", 10);

        // initialize stored count if absent
        if (!localStorage.getItem("logsCount")) {
          localStorage.setItem("logsCount", String(count));
          setHasNew(false);
        } else if (count > stored) {
          setHasNew(true);
        } else {
          setHasNew(false);
        }
        setLogsCount(count);
      } catch (err) {
        // ignore polling errors silently
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 10000); // poll every 10s
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Click outside to close notify panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifyPanel(false);
      }
    };
    if (showNotifyPanel) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifyPanel]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // mark logs read when logging out
    localStorage.setItem("logsCount", String(logsCount || 0));
    setUser(null);
    navigate("/login");
  };

  const openNotifyPanel = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowNotifyPanel(true);
      setRecentLogs([]);
      setHasNew(false);
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/logs", {
        headers: { "x-auth-token": token },
      });
      const logs = Array.isArray(res.data) ? res.data.slice().reverse().slice(0, 10) : [];
      setRecentLogs(logs);
      setShowNotifyPanel(true);
      setHasNew(false);
      localStorage.setItem("logsCount", String(res.data.length || 0));
      setLogsCount(res.data.length || 0);
    } catch (err) {
      // show panel empty on error
      setRecentLogs([]);
      setShowNotifyPanel(true);
      setHasNew(false);
    }
  };

  const handleNotifyClick = () => {
    if (showNotifyPanel) {
      setShowNotifyPanel(false);
      return;
    }
    openNotifyPanel();
  };

  const handleViewLog = (logId) => {
    // navigate to home where user can view/edit logs; hide panel
    setShowNotifyPanel(false);
    navigate("/home");
  };

  const markAllRead = () => {
    localStorage.setItem("logsCount", String(logsCount || 0));
    setHasNew(false);
  };

  // helper to render initials
  const initials = user ? (user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()) : "";

  return (
    <header className={`modern-header ${theme === "dark" ? "dark" : "light"}`} role="banner">
      <div className="mh-left">
        <Link to="/home" className="mh-logo" aria-label="LogAnything home">
          <svg className="mh-logo-icon" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.08" />
            <path d="M7 12.5c0-2.5 2.5-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9l2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="mh-logo-text">LogAnything</span>
        </Link>

        <div className="mh-search" role="search">
          <input
            aria-label="Search logs"
            placeholder="Search logs, types..."
            value={searchValue || ""}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mh-center" role="navigation" aria-label="Main navigation">
        <nav className="mh-nav">
          <Link to="/home" className="mh-nav-link">Home</Link>
          <Link to="/analytics" className="mh-nav-link">Analytics</Link>
          <Link to="/featured" className="mh-nav-link">Featured</Link>
          {/* Profile removed from center nav per request */}
          <Link to="/about" className="mh-nav-link">About</Link>
        </nav>
      </div>

      <div className="mh-right">
        <div className="mh-notify-wrapper" ref={panelRef}>
          <button
            className={`mh-notify ${hasNew ? "unread" : ""}`}
            onClick={handleNotifyClick}
            title="Notifications"
            aria-haspopup="true"
            aria-expanded={showNotifyPanel}
            aria-label={hasNew ? `You have new logs` : `No new logs`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" fill="currentColor"/>
              <path d="M18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
            </svg>
            {hasNew && <span className="mh-badge" aria-hidden />}
          </button>

          {showNotifyPanel && (
            <div className={`mh-notify-panel ${theme === "dark" ? "dark" : "light"}`} role="dialog" aria-label="Notifications panel">
              <div className="mh-notify-header">
                <strong>Notifications</strong>
                <button onClick={markAllRead} className="mh-mark-read" aria-label="Mark all as read">Mark all</button>
              </div>
              <div className="mh-notify-list">
                {recentLogs.length === 0 ? (
                  <div className="mh-notify-empty">No notifications</div>
                ) : (
                  recentLogs.map((lg) => (
                    <div key={lg._id} className="mh-notify-item" onClick={() => handleViewLog(lg._id)} role="button" tabIndex={0}>
                      <div className="mh-notify-title">{lg.title || lg.type}</div>
                      <div className="mh-notify-meta">{new Date(lg.date).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="mh-theme" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <div className="mh-user" title={`Signed in as ${user.firstName || user.email}`}>
            <div className="mh-avatar" aria-hidden>{initials}</div>
            <Link to="/account" className="mh-user-name" aria-label="Go to profile">
              {user.firstName || user.email}
            </Link>
            <button className="mh-logout" onClick={handleLogout} title="Logout" aria-label="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M16 13v-2H7V8l-5 4 5 4v-3z" fill="currentColor"/>
                <path d="M20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="mh-auth">
            <Link to="/login" className="mh-login-link">Log in</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default ModernHeader;