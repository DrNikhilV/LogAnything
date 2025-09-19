import React from "react";
import ModernHeader from "../components/ModernHeader";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import './about.css';

const Featured = () => {
  const articles = [
    {
      id: 1,
      title: "The Habit Tracker (James Clear)",
      url: "https://jamesclear.com/habit-tracker",
      description: "A practical, beautifully simple habit tracker tool and guide from James Clear — ideas for building consistent habits and tracking progress.",
      source: "James Clear",
    },
    {
      id: 2,
      title: "Why habit tracking is such an impactful tool",
      url: "https://medium.com/betterism/why-habit-tracking-is-such-an-impactful-tool-a8743ef1c0fa",
      description: "A thoughtful Medium piece explaining the psychology behind habit tracking and why it helps with behavior change and reflection.",
      source: "Medium / Betterism",
    },
    {
      id: 3,
      title: "Habit Tracking — Developer's View",
      url: "https://smythos.com/developers/agent-development/habit-tracking/",
      description: "A developer-oriented writeup on habit tracking systems, instrumentation and practical patterns for tracking progress programmatically.",
      source: "Smythos",
    },
  ];

  const videos = [
    { id: "FNJO1pZV-I8", title: "How to Build Good Habits", url: "https://youtu.be/FNJO1pZV-I8" },
    { id: "c20j229cDGg", title: "Make Habits Stick: Simple Habit System", url: "https://youtu.be/c20j229cDGg" },
    { id: "GAYkneB2ZXo", title: "Tiny Habits - The Science of Habit Formation", url: "https://youtu.be/GAYkneB2ZXo" },
  ];

  const containerStyle = {
    padding: 24,
    minHeight: "70vh",
    background: "transparent",
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 8px 26px rgba(2,6,23,0.06)",
    minHeight: 140,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const cardHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const tagStyle = {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: 700,
  };

  const buttonPrimary = {
    background: "linear-gradient(90deg,#2563eb,#7c3aed)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
  };

  const videoCardStyle = {
    ...cardStyle,
    padding: 12,
  };

  const iframeWrapper = {
    position: "relative",
    paddingBottom: "56.25%",
    height: 0,
    overflow: "hidden",
    borderRadius: 8,
    background: "#000",
  };

  const iframeStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
  };

  return (
    <>
      <ModernHeader />
      <div style={containerStyle}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={sectionHeaderStyle}>
            <h2 style={{ margin: 0 }}>Featured — Articles</h2>
            <p style={{ margin: 0, color: "#6b7280" }}>Curated reading on habit tracking and building consistency</p>
          </div>

          <div style={gridStyle}>
            {articles.map((a) => (
              <article key={a.id} style={cardStyle}>
                <div>
                  <div style={cardHeaderStyle}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#f0f7ff,#e6eefc)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: 700 }}>
                      {a.source.split(" ")[0].charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{a.source}</div>
                    </div>
                  </div>

                  <p style={{ marginTop: 12, color: "#374151", lineHeight: 1.5 }}>{a.description}</p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" style={buttonPrimary}>Read</a>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>↗ Opens in new tab</div>
                </div>
              </article>
            ))}
          </div>

          <hr style={{ margin: "28px 0", border: 0, height: 1, background: "#eef2f7" }} />

          <div style={sectionHeaderStyle}>
            <h2 style={{ margin: 0 }}>Featured — Videos</h2>
            <p style={{ margin: 0, color: "#6b7280" }}>Short videos to help you form and keep habits</p>
          </div>

          <div style={gridStyle}>
            {videos.map((v) => (
              <div key={v.id} style={videoCardStyle}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{v.title}</div>
                <div style={iframeWrapper}>
                  <iframe
                    title={v.title}
                    src={`https://www.youtube.com/embed/${v.id}`}
                    style={iframeStyle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" style={buttonPrimary}>Watch on YouTube</a>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{/* duration unknown */}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </>
  );
};

export default Featured;
