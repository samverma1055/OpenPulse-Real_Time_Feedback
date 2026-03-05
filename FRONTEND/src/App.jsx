import { useState, useEffect } from "react";

const API = "http://localhost:4000/api/v4";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1a1a26;
    --border: #ffffff12;
    --accent: #7c6aff;
    --accent2: #ff6a9b;
    --accent3: #6affda;
    --text: #f0eeff;
    --muted: #8885aa;
    --success: #4ade80;
    --error: #ff4d6d;
    --warning: #fbbf24;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 { font-family: 'Syne', sans-serif; }

  /* Noise texture overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 2rem;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    cursor: pointer;
  }
  .nav-links { display: flex; gap: 0.5rem; align-items: center; }
  .nav-btn {
    background: none; border: 1px solid var(--border);
    color: var(--muted); padding: 0.4rem 1rem;
    border-radius: 100px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    transition: all 0.2s;
  }
  .nav-btn:hover, .nav-btn.active { border-color: var(--accent); color: var(--text); }
  .nav-btn.primary {
    background: var(--accent); border-color: var(--accent);
    color: white; font-weight: 500;
  }
  .nav-btn.primary:hover { background: #6a58ee; }

  /* ── Layout ── */
  .page { padding-top: 5rem; min-height: 100vh; }
  .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

  /* ── Hero ── */
  .hero {
    min-height: 90vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    position: relative; overflow: hidden; padding: 2rem 1.5rem;
  }
  .hero-glow {
    position: absolute; width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(124,106,255,0.15) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .hero-glow2 {
    position: absolute; width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(255,106,155,0.1) 0%, transparent 70%);
    top: 30%; right: 10%;
    pointer-events: none;
  }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(124,106,255,0.1); border: 1px solid rgba(124,106,255,0.3);
    color: var(--accent); padding: 0.3rem 0.9rem;
    border-radius: 100px; font-size: 0.8rem; font-weight: 500;
    margin-bottom: 1.5rem; letter-spacing: 0.05em;
  }
  .hero h1 {
    font-size: clamp(2.5rem, 7vw, 5.5rem);
    font-weight: 800; line-height: 1.05;
    margin-bottom: 1.2rem;
    background: linear-gradient(160deg, var(--text) 30%, var(--muted));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero h1 span {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero p {
    font-size: 1.1rem; color: var(--muted); max-width: 520px;
    line-height: 1.7; margin-bottom: 2.5rem;
  }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
  .btn {
    padding: 0.75rem 1.75rem; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    font-weight: 500; cursor: pointer; border: none;
    transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), #9b8aff);
    color: white; box-shadow: 0 0 30px rgba(124,106,255,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(124,106,255,0.5); }
  .btn-outline {
    background: transparent; color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-sm { padding: 0.5rem 1.1rem; font-size: 0.85rem; }
  .btn-danger { background: var(--error); color: white; }

  /* ── Stats ── */
  .stats-row {
    display: flex; gap: 2rem; justify-content: center;
    flex-wrap: wrap; margin-top: 4rem; padding-top: 4rem;
    border-top: 1px solid var(--border);
  }
  .stat { text-align: center; }
  .stat-num {
    font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .stat-label { color: var(--muted); font-size: 0.85rem; margin-top: 0.2rem; }

  /* ── Cards ── */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 1.5rem;
    transition: border-color 0.2s, transform 0.2s;
  }
  .card:hover { border-color: rgba(124,106,255,0.3); }

  /* ── Feedback Board ── */
  .board-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem; flex-wrap: gap;
  }
  .board-title { font-size: 1.5rem; font-weight: 700; }
  .filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .filter-btn {
    padding: 0.35rem 0.9rem; border-radius: 100px;
    border: 1px solid var(--border); background: none;
    color: var(--muted); font-size: 0.8rem; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .filter-btn.active, .filter-btn:hover {
    border-color: var(--accent); color: var(--text);
    background: rgba(124,106,255,0.1);
  }
  .feedback-grid { display: flex; flex-direction: column; gap: 1rem; }
  .feedback-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.2rem 1.4rem;
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .feedback-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--accent); border-radius: 3px 0 0 3px;
    opacity: 0; transition: opacity 0.2s;
  }
  .feedback-card:hover { border-color: rgba(124,106,255,0.3); transform: translateX(4px); }
  .feedback-card:hover::before { opacity: 1; }
  .feedback-meta { display: flex; gap: 0.6rem; align-items: center; margin-bottom: 0.7rem; flex-wrap: wrap; }
  .badge {
    padding: 0.2rem 0.6rem; border-radius: 100px;
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.03em;
  }
  .badge-anon { background: rgba(124,106,255,0.15); color: var(--accent); }
  .badge-general { background: rgba(106,255,218,0.1); color: var(--accent3); }
  .badge-bug { background: rgba(255,77,109,0.1); color: var(--error); }
  .badge-suggestion { background: rgba(251,191,36,0.1); color: var(--warning); }
  .badge-complaint { background: rgba(255,106,155,0.1); color: var(--accent2); }
  .badge-positive { background: rgba(74,222,128,0.1); color: var(--success); }
  .badge-neutral { background: rgba(136,133,170,0.15); color: var(--muted); }
  .badge-negative { background: rgba(255,77,109,0.1); color: var(--error); }
  .badge-pending { background: rgba(251,191,36,0.1); color: var(--warning); }
  .badge-reviewed { background: rgba(106,255,218,0.1); color: var(--accent3); }
  .badge-resolved { background: rgba(74,222,128,0.1); color: var(--success); }
  .feedback-content { color: var(--text); line-height: 1.6; margin-bottom: 0.8rem; }
  .feedback-footer { display: flex; align-items: center; justify-content: space-between; }
  .upvote-btn {
    display: flex; align-items: center; gap: 0.4rem;
    background: none; border: 1px solid var(--border);
    color: var(--muted); padding: 0.3rem 0.7rem;
    border-radius: 100px; cursor: pointer; font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .upvote-btn:hover { border-color: var(--accent2); color: var(--accent2); }
  .feedback-time { color: var(--muted); font-size: 0.78rem; }

  /* ── Form ── */
  .form-page {
    max-width: 520px; margin: 0 auto; padding: 2rem 1.5rem;
  }
  .form-title { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.4rem; }
  .form-subtitle { color: var(--muted); margin-bottom: 2rem; font-size: 0.95rem; }
  .form-group { margin-bottom: 1.2rem; }
  label { display: block; font-size: 0.85rem; font-weight: 500; color: var(--muted); margin-bottom: 0.4rem; letter-spacing: 0.02em; }
  input, textarea, select {
    width: 100%; background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 0.75rem 1rem;
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    outline: none; transition: border-color 0.2s;
    appearance: none;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--accent); }
  textarea { resize: vertical; min-height: 110px; }
  select option { background: var(--surface2); }
  .char-count { text-align: right; font-size: 0.78rem; color: var(--muted); margin-top: 0.3rem; }
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 0.75rem 1rem;
  }
  .toggle-label { font-size: 0.9rem; color: var(--text); }
  .toggle-sub { font-size: 0.78rem; color: var(--muted); }
  .toggle {
    width: 44px; height: 24px; background: var(--surface2);
    border-radius: 100px; cursor: pointer; position: relative;
    border: 1px solid var(--border); transition: background 0.2s;
    flex-shrink: 0;
  }
  .toggle.on { background: var(--accent); border-color: var(--accent); }
  .toggle::after {
    content: ''; position: absolute; width: 18px; height: 18px;
    background: white; border-radius: 50%; top: 2px; left: 2px;
    transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .toggle.on::after { transform: translateX(20px); }
  .form-divider {
    text-align: center; color: var(--muted); font-size: 0.85rem;
    margin: 1rem 0; position: relative;
  }
  .form-divider::before, .form-divider::after {
    content: ''; position: absolute; top: 50%; width: 42%; height: 1px;
    background: var(--border);
  }
  .form-divider::before { left: 0; }
  .form-divider::after { right: 0; }
  .form-link { color: var(--accent); cursor: pointer; text-decoration: underline; }
  .error-msg { color: var(--error); font-size: 0.82rem; margin-top: 0.3rem; }
  .success-msg { color: var(--success); font-size: 0.82rem; margin-top: 0.3rem; }

  /* ── Admin Dashboard ── */
  .dashboard-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem; margin-bottom: 2rem;
  }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.2rem 1.4rem;
  }
  .stat-card-label { color: var(--muted); font-size: 0.82rem; margin-bottom: 0.4rem; }
  .stat-card-num {
    font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800;
  }
  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th {
    text-align: left; padding: 0.7rem 1rem; font-size: 0.78rem;
    color: var(--muted); font-weight: 500; letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border); text-transform: uppercase;
  }
  .admin-table td {
    padding: 0.9rem 1rem; border-bottom: 1px solid var(--border);
    font-size: 0.88rem; vertical-align: middle;
  }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
  select.status-select {
    padding: 0.25rem 0.6rem; font-size: 0.8rem;
    width: auto; border-radius: 6px;
  }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 2rem; right: 2rem;
    background: var(--surface2); border: 1px solid var(--border);
    padding: 0.8rem 1.2rem; border-radius: 10px;
    font-size: 0.88rem; z-index: 9999; max-width: 300px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: slideUp 0.3s ease;
  }
  .toast.success { border-color: var(--success); color: var(--success); }
  .toast.error { border-color: var(--error); color: var(--error); }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }

  /* ── Loading ── */
  .spinner {
    width: 20px; height: 20px; border: 2px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg) } }
  .loading-center { display: flex; justify-content: center; padding: 3rem; }

  /* ── Empty ── */
  .empty { text-align: center; padding: 4rem 2rem; color: var(--muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .nav { padding: 0.8rem 1rem; }
    .hero h1 { font-size: 2.2rem; }
    .dashboard-grid { grid-template-columns: 1fr 1fr; }
    .admin-table { font-size: 0.8rem; }
    .admin-table th, .admin-table td { padding: 0.6rem 0.5rem; }
  }
`;

// ─── Helpers ────────────────────────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  if (!msg) return null;
  return <div className={`toast ${type}`}>{type === "success" ? "✓ " : "✕ "}{msg}</div>;
}

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, user, onLogout }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("home")}>OpenPulse</div>
      <div className="nav-links">
        <button className={`nav-btn ${page === "board" ? "active" : ""}`} onClick={() => setPage("board")}>Board</button>
        <button className={`nav-btn ${page === "submit" ? "active" : ""}`} onClick={() => setPage("submit")}>Submit</button>
        {user?.role === "admin" && (
          <button className={`nav-btn ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")}>Admin</button>
        )}
        {user ? (
          <>
            <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>@{user.username}</span>
            <button className="nav-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="nav-btn primary" onClick={() => setPage("auth")}>Login</button>
        )}
      </div>
    </nav>
  );
}

// ─── Home ───────────────────────────────────────────────────────────────────
function Home({ setPage, stats }) {
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-tag">📡 Real-Time · Anonymous · Open</div>
        <h1>Feedback without<br /><span>fear or filters</span></h1>
        <p>OpenPulse lets you share honest feedback anonymously. No accounts needed. No judgment. Just raw, real insights.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setPage("submit")}>
            ✦ Submit Feedback
          </button>
          <button className="btn btn-outline" onClick={() => setPage("board")}>
            View Public Board →
          </button>
        </div>
        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">{stats.total}</div>
            <div className="stat-label">Feedbacks Submitted</div>
          </div>
          <div className="stat">
            <div className="stat-num">{stats.anonymous}</div>
            <div className="stat-label">Anonymous Submissions</div>
          </div>
          <div className="stat">
            <div className="stat-num">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat">
            <div className="stat-num">{stats.upvotes}</div>
            <div className="stat-label">Total Upvotes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Board ──────────────────────────────────────────────────────────────────
function Board({ toast }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sentiment, setSentiment] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      let url = `${API}/feedback/all?`;
      if (filter !== "all") url += `category=${filter}&`;
      if (sentiment !== "all") url += `sentiment=${sentiment}`;
      const res = await fetch(url);
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch { toast("Failed to load feedback", "error"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter, sentiment]);

  const upvote = async (id) => {
    try {
      const res = await fetch(`${API}/feedback/upvote/${id}`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(f => f.map(fb => fb._id === id ? { ...fb, upvotes: data.upvotes } : fb));
        toast("Upvoted!", "success");
      }
    } catch { toast("Failed to upvote", "error"); }
  };

  const categories = ["all", "general", "bug", "suggestion", "complaint"];
  const sentiments = ["all", "positive", "neutral", "negative"];

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="board-header">
          <h2 className="board-title">Public Feedback Board</h2>
          <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{feedbacks.length} submissions</span>
        </div>

        <div className="filters">
          {categories.map(c => (
            <button key={c} className={`filter-btn ${filter === c ? "active" : ""}`}
              onClick={() => setFilter(c)}>{c.charAt(0).toUpperCase() + c.slice(1)}</button>
          ))}
          <span style={{ color: "var(--border)", padding: "0 0.3rem" }}>|</span>
          {sentiments.map(s => (
            <button key={s} className={`filter-btn ${sentiment === s ? "active" : ""}`}
              onClick={() => setSentiment(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : feedbacks.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <div>No feedback found. Be the first to submit!</div>
          </div>
        ) : (
          <div className="feedback-grid">
            {feedbacks.map(fb => (
              <div key={fb._id} className="feedback-card">
                <div className="feedback-meta">
                  {fb.isAnonymous && <span className="badge badge-anon">👤 Anonymous</span>}
                  <span className={`badge badge-${fb.category}`}>{fb.category}</span>
                  <span className={`badge badge-${fb.sentiment}`}>{fb.sentiment}</span>
                  <span className={`badge badge-${fb.status}`}>{fb.status}</span>
                </div>
                <div className="feedback-content">{fb.content}</div>
                <div className="feedback-footer">
                  <button className="upvote-btn" onClick={() => upvote(fb._id)}>
                    ↑ {fb.upvotes} upvotes
                  </button>
                  <span className="feedback-time">{timeAgo(fb.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Submit ──────────────────────────────────────────────────────────────────
function Submit({ toast, user }) {
  const [form, setForm] = useState({
    content: "", category: "general", sentiment: "neutral", isAnonymous: true
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (form.content.trim().length < 5) { toast("Feedback too short (min 5 chars)", "error"); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("op_token");
      const res = await fetch(`${API}/feedback/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setSubmitted(true); toast("Feedback submitted!", "success"); }
      else toast(data.message, "error");
    } catch { toast("Server error", "error"); }
    setLoading(false);
  };

  if (submitted) return (
    <div className="page">
      <div className="form-page" style={{ textAlign: "center", paddingTop: "4rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✦</div>
        <h2 style={{ marginBottom: "0.7rem" }}>Feedback Received!</h2>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          Your voice has been heard. {form.isAnonymous ? "Your identity is protected." : ""}
        </p>
        <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ content: "", category: "general", sentiment: "neutral", isAnonymous: true }); }}>
          Submit Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="form-page">
        <h2 className="form-title">Share Feedback</h2>
        <p className="form-subtitle">Your thoughts matter. Anonymous by default.</p>

        <div className="form-group">
          <label>YOUR FEEDBACK</label>
          <textarea
            placeholder="What's on your mind? Be honest, be specific..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            maxLength={500}
          />
          <div className="char-count">{form.content.length}/500</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label>CATEGORY</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="general">General</option>
              <option value="bug">Bug</option>
              <option value="suggestion">Suggestion</option>
              <option value="complaint">Complaint</option>
            </select>
          </div>
          <div className="form-group">
            <label>SENTIMENT</label>
            <select value={form.sentiment} onChange={e => setForm({ ...form, sentiment: e.target.value })}>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="toggle-row">
            <div>
              <div className="toggle-label">Submit Anonymously</div>
              <div className="toggle-sub">Your identity will not be recorded</div>
            </div>
            <div className={`toggle ${form.isAnonymous ? "on" : ""}`}
              onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
          onClick={submit} disabled={loading}>
          {loading ? <><span className="spinner" /> Submitting...</> : "✦ Submit Feedback"}
        </button>
      </div>
    </div>
  );
}

// ─── Auth ────────────────────────────────────────────────────────────────────
function Auth({ onLogin, toast }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "login" : "register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const res = await fetch(`${API}/user/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("op_token", data.token);
        onLogin(data.user, data.token);
        toast(`Welcome, ${data.user.username}!`, "success");
      } else setError(data.message);
    } catch { setError("Server error. Is your backend running?"); }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="form-page">
        <h2 className="form-title">{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p className="form-subtitle">{mode === "login" ? "Sign in to your OpenPulse account" : "Join OpenPulse today"}</p>

        {mode === "register" && (
          <div className="form-group">
            <label>USERNAME</label>
            <input placeholder="yourname" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
        )}
        <div className="form-group">
          <label>EMAIL</label>
          <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>PASSWORD</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        {mode === "register" && (
          <div className="form-group">
            <label>ROLE</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        {error && <div className="error-msg">✕ {error}</div>}

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
          onClick={submit} disabled={loading}>
          {loading ? <><span className="spinner" /> Please wait...</> : mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <div className="form-divider" style={{ marginTop: "1.5rem" }}>or</div>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.88rem", marginTop: "1rem" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span className="form-link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── Admin ───────────────────────────────────────────────────────────────────
function Admin({ toast, user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("op_token");
      const res = await fetch(`${API}/feedback/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch { toast("Failed to load", "error"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("op_token");
      const res = await fetch(`${API}/feedback/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(f => f.map(fb => fb._id === id ? { ...fb, status } : fb));
        toast("Status updated!", "success");
      }
    } catch { toast("Failed to update", "error"); }
  };

  const deleteFb = async (id) => {
    if (!confirm("Delete this feedback?")) return;
    try {
      const token = localStorage.getItem("op_token");
      const res = await fetch(`${API}/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(f => f.filter(fb => fb._id !== id));
        toast("Deleted!", "success");
      }
    } catch { toast("Failed to delete", "error"); }
  };

  if (!user || user.role !== "admin") return (
    <div className="page">
      <div className="empty">
        <div className="empty-icon">🔒</div>
        <div>Admin access required</div>
      </div>
    </div>
  );

  const total = feedbacks.length;
  const pending = feedbacks.filter(f => f.status === "pending").length;
  const resolved = feedbacks.filter(f => f.status === "resolved").length;
  const totalUpvotes = feedbacks.reduce((s, f) => s + f.upvotes, 0);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 700 }}>Admin Dashboard</h2>

        <div className="dashboard-grid">
          {[
            { label: "Total Feedback", num: total, color: "var(--accent)" },
            { label: "Pending", num: pending, color: "var(--warning)" },
            { label: "Resolved", num: resolved, color: "var(--success)" },
            { label: "Total Upvotes", num: totalUpvotes, color: "var(--accent2)" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-num" style={{ color: s.color }}>{s.num}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Category</th>
                  <th>Sentiment</th>
                  <th>Upvotes</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map(fb => (
                  <tr key={fb._id}>
                    <td style={{ maxWidth: "220px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        {fb.isAnonymous && <span style={{ fontSize: "0.7rem", color: "var(--accent)" }}>👤</span>}
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", display: "block" }}>
                          {fb.content}
                        </span>
                      </div>
                    </td>
                    <td><span className={`badge badge-${fb.category}`}>{fb.category}</span></td>
                    <td><span className={`badge badge-${fb.sentiment}`}>{fb.sentiment}</span></td>
                    <td style={{ color: "var(--accent2)" }}>↑ {fb.upvotes}</td>
                    <td>
                      <select className="status-select" value={fb.status}
                        onChange={e => updateStatus(fb._id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td style={{ color: "var(--muted)" }}>{timeAgo(fb.createdAt)}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteFb(fb._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {feedbacks.length === 0 && (
              <div className="empty"><div className="empty-icon">📭</div><div>No feedback yet</div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [stats, setStats] = useState({ total: 0, anonymous: 0, resolved: 0, upvotes: 0 });

  useEffect(() => {
    const token = localStorage.getItem("op_token");
    const savedUser = localStorage.getItem("op_user");
    if (token && savedUser) setUser(JSON.parse(savedUser));
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch(`${API}/feedback/all`);
      const data = await res.json();
      const fbs = data.feedbacks || [];
      setStats({
        total: fbs.length,
        anonymous: fbs.filter(f => f.isAnonymous).length,
        resolved: fbs.filter(f => f.status === "resolved").length,
        upvotes: fbs.reduce((s, f) => s + f.upvotes, 0),
      });
    } catch {}
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3200);
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem("op_user", JSON.stringify(userData));
    setPage("board");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("op_token");
    localStorage.removeItem("op_user");
    setPage("home");
    showToast("Logged out", "success");
  };

  return (
    <>
      <style>{styles}</style>
      <Nav page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      {page === "home" && <Home setPage={setPage} stats={stats} />}
      {page === "board" && <Board toast={showToast} />}
      {page === "submit" && <Submit toast={showToast} user={user} />}
      {page === "auth" && <Auth onLogin={handleLogin} toast={showToast} />}
      {page === "admin" && <Admin toast={showToast} user={user} />}
      {toast.msg && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />}
    </>
  );
}