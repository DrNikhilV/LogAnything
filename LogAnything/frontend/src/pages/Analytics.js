import React, { useEffect, useState, useMemo } from "react";
import ModernHeader from "../components/ModernHeader";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";

const Analytics = () => {
  const { theme } = useTheme();
  const [logs, setLogs] = useState([]);
  const [highlightDates, setHighlightDates] = useState(new Set());
  const [tooltip, setTooltip] = useState(null); // {x,y,content}

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/logs", {
          headers: { "x-auth-token": token },
        });
        setLogs(res.data || []);
        const dates = new Set((res.data || []).map(l => new Date(l.date).toISOString().slice(0,10)));
        setHighlightDates(dates);
      } catch (err) {
        // ignore
      }
    };
    fetchLogs();
  }, []);

  // Calendar (current month)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startDay = firstOfMonth.getDay(); // 0-6
  const daysInMonth = lastOfMonth.getDate();

  // Simple bar data: counts by type (used across charts)
  const counts = useMemo(() => {
    return logs.reduce((acc, l) => {
      acc[l.type] = (acc[l.type] || 0) + 1;
      return acc;
    }, {});
  }, [logs]);

  const types = Object.keys(counts);
  const maxCount = Math.max(...Object.values(counts), 1);

  // Palette + map types to colors
  const palette = ["#2563eb", "#16a34a", "#ef4444", "#f59e0b", "#8b5cf6", "#e11d48", "#06b6d4", "#14b8a6"];
  const typeColor = Object.fromEntries(types.map((t, i) => [t, palette[i % palette.length]]));

  // LINE/AREA GRAPH DATA (Logs by Type as graph)
  const lineData = types.map((t) => ({ type: t, value: counts[t] }));
  // For consistent ordering, sort by type name (or keep natural order)
  lineData.sort((a, b) => a.type.localeCompare(b.type));

  // helper to build SVG path for line and area
  const buildLinePath = (points) => {
    if (!points.length) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  };
  const buildAreaPath = (points, height) => {
    if (!points.length) return "";
    const line = buildLinePath(points);
    const last = points[points.length - 1];
    const first = points[0];
    return `${line} L ${last.x} ${height} L ${first.x} ${height} Z`;
  };

  // SPARKLINE: counts for last 7 days
  const sparkData = useMemo(() => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0,10);
      map[key] = 0;
    }
    logs.forEach(l => {
      const k = new Date(l.date).toISOString().slice(0,10);
      if (k in map) map[k]++;
    });
    return Object.keys(map).map(k => ({ date: k, value: map[k] }));
  }, [logs, today]);

  // PIE / DONUT helpers
  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const a = (angleDeg - 90) * Math.PI / 180.0;
    return { x: cx + (r * Math.cos(a)), y: cy + (r * Math.sin(a)) };
  };
  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  // Styles reused
  const cardStyle = {
    padding: 16,
    borderRadius: 12,
    background: theme === "dark" ? "#0b1220" : "#fff",
    boxShadow: "0 8px 20px rgba(2,6,23,0.06)"
  };

  return (
    <>
      <ModernHeader />
      <div style={{ padding: 20, minHeight: "70vh", background: theme === "dark" ? "#111" : "#f6f8fb" }}>
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>Analytics</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={cardStyle}>
            <h3>Calendar</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginTop: 10 }}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} style={{ textAlign:"center", fontWeight:700, fontSize:12 }}>{d}</div>
              ))}
              {Array.from({length: startDay}).map((_,i)=> <div key={"pad"+i} />)}
              {Array.from({length: daysInMonth}).map((_,i) => {
                const day = i+1;
                const dateKey = new Date(year, month, day).toISOString().slice(0,10);
                const highlighted = highlightDates.has(dateKey);
                return (
                  <div key={day} style={{
                    padding:8,
                    textAlign:"center",
                    borderRadius:8,
                    background: highlighted ? (theme === "dark" ? "#15304a" : "#dbeafe") : "transparent",
                    fontWeight: highlighted ? 700 : 500,
                    cursor: highlighted ? "pointer" : "default"
                  }}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <h3>Logs by Type</h3>

            {/* Top row: graph + pie */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 12 }}>
              {/* LINE/AREA GRAPH */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ fontSize: 12, color: theme === "dark" ? "#9ca3af" : "#6b7280", marginBottom: 6 }}>Type trend (each type as a point)</div>
                <div style={{ background: theme === "dark" ? "#071224" : "#f8fafc", padding: 8, borderRadius: 8 }}>
                  {lineData.length === 0 ? <div style={{ padding: 18, color: theme === "dark" ? "#9ca3af" : "#6b7280" }}>No data</div> :
                    (() => {
                      const W = 300;
                      const H = 140;
                      const padX = 18;
                      const padY = 14;
                      const innerW = W - padX*2;
                      const innerH = H - padY*2;
                      const points = lineData.map((d, i) => {
                        const x = padX + (innerW * (i / Math.max(1, lineData.length - 1)));
                        const y = padY + innerH - ((d.value / maxCount) * innerH);
                        return { ...d, x, y };
                      });
                      const linePath = buildLinePath(points);
                      const areaPath = buildAreaPath(points, H - padY);
                      return (
                        <div style={{ position: "relative" }}>
                          <svg width={W} height={H} style={{ display: "block" }}>
                            {/* area */}
                            <path d={areaPath} fill={theme === "dark" ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.12)"} />
                            {/* line */}
                            <path d={linePath} fill="none" stroke={theme === "dark" ? "#60a5fa" : "#2563eb"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            {/* points */}
                            {points.map((p, i) => (
                              <g key={p.type}>
                                <circle
                                  cx={p.x} cy={p.y} r={6}
                                  fill={typeColor[p.type] || palette[i % palette.length]}
                                  stroke={theme === "dark" ? "#071224" : "#fff"}
                                  strokeWidth={2}
                                  style={{ cursor: "pointer", transition: "transform .12s", transformOrigin: "center" }}
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setTooltip({ x: rect.left + rect.width/2, y: rect.top - 8, content: `${p.type}: ${p.value}` });
                                  }}
                                  onMouseLeave={() => setTooltip(null)}
                                />
                                {/* subtle hover handle: invisible bigger circle to make hover easier */}
                                <circle cx={p.x} cy={p.y} r={14} fill="transparent"
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setTooltip({ x: rect.left + rect.width/2, y: rect.top - 8, content: `${p.type}: ${p.value}` });
                                  }}
                                  onMouseLeave={() => setTooltip(null)}
                                />
                              </g>
                            ))}
                          </svg>
                        </div>
                      );
                    })()
                  }
                </div>

                {/* legend */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {types.map((t, i) => (
                    <div key={t}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 8px",
                        borderRadius: 999,
                        background: theme === "dark" ? "#071224" : "#f8fafc",
                        cursor: "pointer",
                        transition: "transform .12s, box-shadow .12s"
                      }}
                      onMouseEnter={() => setTooltip({ x: 0, y: 0, content: `${t}: ${counts[t]}` })}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <span style={{ width: 10, height: 10, display: "inline-block", borderRadius: 3, background: typeColor[t] || palette[i % palette.length] }} />
                      <span style={{ fontSize: 12, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PIE / DONUT CHART */}
              <div style={{ width: 160, flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: theme === "dark" ? "#9ca3af" : "#6b7280", marginBottom: 6 }}>Distribution</div>
                <div style={{ background: theme === "dark" ? "#071224" : "#f8fafc", padding: 8, borderRadius: 8, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {types.length === 0 ? <div style={{ padding: 18, color: theme === "dark" ? "#9ca3af" : "#6b7280" }}>No data</div> :
                    (() => {
                      const total = Object.values(counts).reduce((a,b)=>a+b,0);
                      const cx = 80, cy = 80, r = 60;
                      let start = 0;
                      return (
                        <svg width={160} height={160}>
                          {types.map((t, i) => {
                            const value = counts[t];
                            const slice = (value / total) * 360;
                            const path = describeArc(cx, cy, r, start, start + slice);
                            const midAngle = start + slice/2;
                            start += slice;
                            return (
                              <g key={t}>
                                <path
                                  d={path}
                                  fill={typeColor[t] || palette[i % palette.length]}
                                  stroke={theme === "dark" ? "#071224" : "#fff"}
                                  strokeWidth={1}
                                  style={{ cursor: "pointer", transition: "transform .12s" }}
                                  onMouseEnter={(e) => {
                                    // small hover scale simulated via stroke
                                    setTooltip({ x: e.clientX, y: e.clientY - 10, content: `${t}: ${value} (${Math.round((value/total)*100)}%)` });
                                  }}
                                  onMouseLeave={() => setTooltip(null)}
                                />
                              </g>
                            );
                          })}
                          {/* donut hole */}
                          <circle cx={cx} cy={cy} r={28} fill={theme === "dark" ? "#071224" : "#f8fafc"} />
                        </svg>
                      );
                    })()
                  }
                </div>
              </div>
            </div>

            {/* Sparkline (7-day) */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: theme === "dark" ? "#9ca3af" : "#6b7280", marginBottom: 6 }}>Last 7 days</div>
              <div style={{ background: theme === "dark" ? "#071224" : "#f8fafc", padding: 8, borderRadius: 8 }}>
                {sparkData.length === 0 ? <div style={{ padding: 8, color: theme === "dark" ? "#9ca3af" : "#6b7280" }}>No data</div> :
                  (() => {
                    const W = 420, H = 48, pad = 6;
                    const maxV = Math.max(...sparkData.map(d => d.value), 1);
                    const points = sparkData.map((d, i) => {
                      const x = pad + (i * ((W - pad*2) / Math.max(1, sparkData.length - 1)));
                      const y = pad + (H - pad*2) - ((d.value / maxV) * (H - pad*2));
                      return { ...d, x, y };
                    });
                    const line = buildLinePath(points);
                    return (
                      <div style={{ position: "relative" }}>
                        <svg width={W} height={H}>
                          <path d={line} fill="none" stroke={theme === "dark" ? "#60a5fa" : "#2563eb"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          {points.map((p) => (
                            <circle key={p.date} cx={p.x} cy={p.y} r={3} fill={theme === "dark" ? "#93c5fd" : "#2563eb"}
                              onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY - 10, content: `${p.date}: ${p.value}` })}
                              onMouseLeave={() => setTooltip(null)}
                              style={{ cursor: "pointer" }}
                            />
                          ))}
                        </svg>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: theme === "dark" ? "#9ca3af" : "#6b7280" }}>
                          {sparkData.map(d => <div key={d.date} style={{ width: `${100 / sparkData.length}%`, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.date.slice(5)}</div>)}
                        </div>
                      </div>
                    );
                  })()
                }
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: theme === "dark" ? "#0b1220" : "#fff" }}>
          <h3>Recent Logs</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {logs.slice().reverse().slice(0,8).map(l => (
              <li key={l._id} style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <strong>{l.title || l.type}</strong> <span style={{ color: "#6b7280", marginLeft: 8 }}>{new Date(l.date).toLocaleString()}</span>
                <div style={{ marginTop: 6, color: theme === "dark" ? "#cbd5e1" : "#4b5563" }}>{typeof l.content === "object" ? JSON.stringify(l.content) : l.content}</div>
              </li>
            ))}
            {logs.length === 0 && <li style={{ padding: 10, color: "#6b7280" }}>No logs yet</li>}
          </ul>
        </div>
      </div>

      {/* Tooltip (absolute) */}
      {tooltip && (
        <div style={{
          position: "fixed",
          left: tooltip.x ? tooltip.x + 8 : 8,
          top: tooltip.y ? tooltip.y - 20 : 8,
          background: theme === "dark" ? "#0b1220" : "#fff",
          color: theme === "dark" ? "#e6eef8" : "#0b1220",
          padding: "6px 10px",
          borderRadius: 6,
          boxShadow: "0 6px 18px rgba(2,6,23,0.12)",
          fontSize: 12,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 9999
        }}>{tooltip.content}</div>
      )}

      <Footer />
    </>
  );
};

export default Analytics;
