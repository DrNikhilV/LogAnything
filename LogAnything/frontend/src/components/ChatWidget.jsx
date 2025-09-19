import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./chatwidget.css";

// simple AI-chat UI that posts to /api/ai/chat and falls back to canned answers
const cannedReplies = [
  "Hi! I can help with using LogAnything — try asking how to add a log or edit your account.",
  "Try: 'How do I add a video log?' or 'How do I change my display name?'",
  "If you provide an API on /api/ai/chat, I will forward your messages to it.",
];

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello — I'm your assistant. Ask me about the app or your workflow." },
  ]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(null); // null = unknown, true/false = known
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  // resolve API base from env (CRA uses REACT_APP_*)
  const apiBase = (process.env.REACT_APP_API_URL || "").trim();
  const makeUrl = (path) => {
    // If an explicit base is provided, always use it; otherwise prefer relative URL for CRA proxy
    if (apiBase) return `${apiBase}${path}`;
    return path; // relative, e.g., /api/ai/ping
  };

  // ping backend when the widget is opened
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        try {
          await axios.get(makeUrl('/api/ai/ping'), { timeout: 3000 });
        } catch (firstErr) {
          // If relative or custom base failed and no explicit base set, try localhost fallback
          if (!apiBase) {
            await axios.get('http://localhost:5000/api/ai/ping', { timeout: 3000 });
          } else {
            throw firstErr;
          }
        }
        if (!cancelled) setBackendAvailable(true);
      } catch (err) {
        if (!cancelled) setBackendAvailable(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open]);

  const pushMessage = (msg) => setMessages((m) => [...m, msg]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    // add user's message
    pushMessage({ from: "user", text: trimmed });
    setText("");
    setSending(true);

    // If backend known to be unavailable, return a canned reply locally
    if (backendAvailable === false) {
      // quick local "thinking" then canned reply
      pushMessage({ from: "bot", text: "Thinking..." });
      await new Promise((r) => setTimeout(r, 600));
      // choose a helpful canned reply
      const reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
      setMessages((m) => {
        const filtered = m.filter((it) => !(it.from === "bot" && it.text === "Thinking..."));
        return [...filtered, { from: "bot", text: reply }];
      });
      setSending(false);
      return;
    }

    // show transient thinking state
    pushMessage({ from: "bot", text: "Thinking..." });

    try {
      const token = localStorage.getItem("token");
      let res;
      try {
        res = await axios.post(
          makeUrl('/api/ai/chat'),
          { message: trimmed },
          token ? { headers: { "x-auth-token": token } } : {}
        );
      } catch (firstErr) {
        if (!apiBase) {
          res = await axios.post(
            'http://localhost:5000/api/ai/chat',
            { message: trimmed },
            token ? { headers: { "x-auth-token": token } } : {}
          );
        } else {
          throw firstErr;
        }
      }

      const reply = res.data.reply || "Sorry, no reply.";
      setMessages((m) => {
        const filtered = m.filter((it) => !(it.from === "bot" && it.text === "Thinking..."));
        return [...filtered, { from: "bot", text: String(reply) }];
      });
      // mark backend available after a successful call
      setBackendAvailable(true);
    } catch (err) {
      console.error("ChatWidget: backend error:", err?.response?.data || err.message || err);
      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.details ||
        err?.response?.data ||
        err.message ||
        "Unknown error contacting AI service.";

      setMessages((m) => {
        const filtered = m.filter((it) => !(it.from === "bot" && it.text === "Thinking..."));
        return [
          ...filtered,
          { from: "bot", text: `AI backend error: ${String(backendMsg).slice(0, 600)}` },
          { from: "bot", text: "Falling back to local tips: try asking how to add or edit logs." },
        ];
      });
      // mark backend as unavailable to avoid repeated failed calls
      setBackendAvailable(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`chat-widget ${open ? "open" : "closed"}`} aria-live="polite">
      {open ? (
        <div className="chat-panel" role="dialog" aria-label="AI Assistant">
          <div className="chat-header">
            <div className="chat-title"><FaRobot /> Assistant</div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat"><FaTimes /></button>
          </div>

          <div className="chat-body" ref={listRef}>
            {/* show a small banner when backend is unreachable */}
            {backendAvailable === false && (
              <div style={{ fontSize: 12, color: "#92400e", background: "#fff7ed", padding: 8, borderRadius: 8, marginBottom: 8 }}>
                AI backend unreachable — using local help tips. Check backend logs or env configuration.
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.from === "bot" ? "bot" : "user"}`}>
                <div className="msg-text">{m.text}</div>
              </div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <input
              aria-label="Message"
              placeholder="Ask me about the app or type a question..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={sending}
            />
            <button type="submit" aria-label="Send" disabled={sending || !text.trim()}>
              <FaPaperPlane />
            </button>
          </form>
          <div className="chat-note">Powered by Google's Gemini</div>
        </div>
      ) : (
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Open assistant">
          <FaRobot />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;