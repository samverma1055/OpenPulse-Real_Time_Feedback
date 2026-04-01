import { useState, useEffect, useRef } from "react";

const API = "http://localhost:4000/api/v4";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050507;
    --bg1: #0c0c12;
    --bg2: #121218;
    --bg3: #1a1a24;
    --glass: rgba(255,255,255,0.03);
    --glass-border: rgba(255,255,255,0.07);
    --glass-hover: rgba(255,255,255,0.06);
    --ink: #eeeaf8;
    --ink2: #9994b8;
    --ink3: #5a566e;
    --violet: #8b5cf6;
    --violet-dim: rgba(139,92,246,0.15);
    --violet-glow: rgba(139,92,246,0.3);
    --rose: #f43f8e;
    --rose-dim: rgba(244,63,142,0.12);
    --emerald: #10d9a0;
    --emerald-dim: rgba(16,217,160,0.12);
    --amber: #f59e0b;
    --red: #ef4444;
    --red-dim: rgba(239,68,68,0.12);
    --radius: 14px;
    --radius-sm: 8px;
    --radius-pill: 999px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--ink);
    font-family: 'Geist', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 10% 0%, rgba(139,92,246,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 90% 100%, rgba(244,63,142,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(16,217,160,0.04) 0%, transparent 60%);
  }

  body::after {
    content: '';
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2.5rem; height: 62px;
    background: rgba(5,5,7,0.75);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid var(--glass-border);
  }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem; letter-spacing: 0.08em;
    background: linear-gradient(90deg, var(--violet), var(--rose));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    cursor: pointer; user-select: none; flex-shrink: 0;
  }
  .nav-center {
    position: absolute; left: 50%; transform: translateX(-50%);
    display: flex; gap: 2px; background: var(--glass);
    border: 1px solid var(--glass-border); border-radius: var(--radius-pill);
    padding: 3px;
  }
  .nav-tab {
    background: none; border: none;
    color: var(--ink3); padding: 0.35rem 1rem;
    border-radius: var(--radius-pill); cursor: pointer;
    font-family: 'Geist', sans-serif; font-size: 0.82rem; font-weight: 500;
    transition: all 0.2s; white-space: nowrap;
  }
  .nav-tab:hover { color: var(--ink2); }
  .nav-tab.active { background: var(--bg3); color: var(--ink); box-shadow: 0 1px 8px rgba(0,0,0,0.4); }
  .nav-right { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
  .nav-user {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.3rem 0.8rem 0.3rem 0.3rem;
    background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: var(--radius-pill);
  }
  .nav-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, var(--violet), var(--rose));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 600; color: white;
  }
  .nav-username { font-size: 0.82rem; color: var(--ink2); }
  .btn-ghost {
    background: none; border: 1px solid var(--glass-border);
    color: var(--ink3); padding: 0.35rem 0.9rem;
    border-radius: var(--radius-pill); cursor: pointer;
    font-family: 'Geist', sans-serif; font-size: 0.8rem; transition: all 0.2s;
  }
  .btn-ghost:hover { color: var(--ink); border-color: rgba(255,255,255,0.15); }
  .btn-nav-primary {
    background: linear-gradient(135deg, var(--violet), #7c3aed);
    border: none; color: white;
    padding: 0.42rem 1.1rem; border-radius: var(--radius-pill);
    font-family: 'Geist', sans-serif; font-size: 0.82rem; font-weight: 500;
    cursor: pointer; transition: all 0.25s;
    box-shadow: 0 0 20px rgba(139,92,246,0.25);
  }
  .btn-nav-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(139,92,246,0.4); }

  /* ── Page ── */
  .page { padding-top: 62px; min-height: 100vh; position: relative; z-index: 2; }
  .container { max-width: 1080px; margin: 0 auto; padding: 0 2rem; }

  /* ─────────────── HOME ─────────────── */

  /* Hero */
  .hero {
    min-height: calc(100vh - 62px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 4rem 2rem 5rem;
    position: relative; overflow: hidden;
  }
  .hero-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(90px); }
  .hero-orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(139,92,246,0.16), transparent 70%); top: -200px; left: -200px; animation: orbFloat 10s ease-in-out infinite; }
  .hero-orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(244,63,142,0.11), transparent 70%); bottom: -100px; right: -100px; animation: orbFloat 12s ease-in-out infinite; animation-delay: -5s; }
  .hero-orb-3 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(16,217,160,0.09), transparent 70%); top: 45%; left: 35%; animation: orbFloat 8s ease-in-out infinite; animation-delay: -3s; }
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33% { transform: translate(40px,-30px) scale(1.06); }
    66% { transform: translate(-25px,20px) scale(0.96); }
  }

  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    border: 1px solid rgba(139,92,246,0.3); background: rgba(139,92,246,0.08);
    color: var(--violet); padding: 0.32rem 1rem;
    border-radius: var(--radius-pill); font-size: 0.74rem;
    font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
    margin-bottom: 2.2rem; animation: fadeUp 0.6s ease both;
  }
  .hero-eyebrow .dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--violet);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }

  .hero-headline {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4.5rem, 13vw, 10.5rem);
    line-height: 0.88; letter-spacing: 0.02em;
    margin-bottom: 1.8rem;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-headline .line-1 { display: block; color: var(--ink); }
  .hero-headline .line-2 {
    display: block;
    background: linear-gradient(90deg, var(--violet), var(--rose), #ff9c60, var(--violet));
    background-size: 300% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: shimmer 5s linear infinite;
  }
  @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:300% center} }

  .hero-sub {
    max-width: 500px; color: var(--ink2); font-size: 1.1rem;
    line-height: 1.8; margin-bottom: 3rem;
    font-family: 'Instrument Serif', serif; font-style: italic;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  .hero-cta {
    display: flex; gap: 0.9rem; flex-wrap: wrap; justify-content: center;
    margin-bottom: 5.5rem; animation: fadeUp 0.6s 0.3s ease both;
  }
  .cta-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--violet), #7c3aed);
    border: none; color: white;
    padding: 0.85rem 2.2rem; border-radius: var(--radius-pill);
    font-family: 'Geist', sans-serif; font-size: 0.95rem; font-weight: 500;
    cursor: pointer; transition: all 0.3s;
    box-shadow: 0 0 36px rgba(139,92,246,0.32), inset 0 1px 0 rgba(255,255,255,0.12);
  }
  .cta-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 48px rgba(139,92,246,0.5); }
  .cta-secondary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--glass); border: 1px solid var(--glass-border);
    color: var(--ink2); padding: 0.85rem 2.2rem; border-radius: var(--radius-pill);
    font-family: 'Geist', sans-serif; font-size: 0.95rem;
    cursor: pointer; transition: all 0.2s; backdrop-filter: blur(8px);
  }
  .cta-secondary:hover { color: var(--ink); border-color: rgba(255,255,255,0.15); background: var(--glass-hover); }

  /* Stats strip */
  .hero-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 1px; background: var(--glass-border);
    border: 1px solid var(--glass-border); border-radius: var(--radius);
    overflow: hidden; width: 100%; max-width: 720px;
    animation: fadeUp 0.6s 0.4s ease both;
  }
  .hero-stat { background: var(--bg1); padding: 1.6rem 1rem; text-align: center; transition: background 0.2s; }
  .hero-stat:hover { background: var(--bg2); }
  .hero-stat-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 0.05em;
    background: linear-gradient(135deg, var(--violet), var(--rose));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;
  }
  .hero-stat-label { color: var(--ink3); font-size: 0.7rem; margin-top: 0.35rem; letter-spacing: 0.07em; text-transform: uppercase; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

  /* ── Features Section ── */
  .section { padding: 7rem 0; position: relative; }
  .section-divider {
    width: 100%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--glass-border), transparent);
    margin: 0;
  }
  .section-tag {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--violet); margin-bottom: 1rem;
  }
  .section-tag::before { content: ''; width: 20px; height: 1px; background: var(--violet); }
  .section-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    letter-spacing: 0.02em; line-height: 0.95;
    margin-bottom: 1.2rem;
  }
  .section-body { color: var(--ink2); font-size: 1rem; line-height: 1.75; max-width: 480px; }

  /* Feature grid */
  .features-grid {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 1px; background: var(--glass-border);
    border: 1px solid var(--glass-border); border-radius: var(--radius);
    overflow: hidden; margin-top: 4rem;
  }
  .feature-card {
    background: var(--bg1); padding: 2rem 1.8rem;
    transition: background 0.25s; position: relative; overflow: hidden;
  }
  .feature-card::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(139,92,246,0.06), transparent 60%);
    opacity: 0; transition: opacity 0.3s;
  }
  .feature-card:hover { background: var(--bg2); }
  .feature-card:hover::after { opacity: 1; }
  .feature-icon {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; margin-bottom: 1.2rem;
  }
  .feature-title { font-family: 'Geist', sans-serif; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.55rem; color: var(--ink); }
  .feature-desc { font-size: 0.84rem; color: var(--ink2); line-height: 1.65; }

  /* ── How It Works ── */
  .steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-top: 4rem; }
  .step-card {
    position: relative; padding: 2rem;
    background: var(--bg1); border: 1px solid var(--glass-border);
    border-radius: var(--radius); transition: all 0.25s;
  }
  .step-card:hover { border-color: rgba(139,92,246,0.25); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
  .step-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 4rem;
    letter-spacing: 0.02em; line-height: 1;
    background: linear-gradient(135deg, var(--violet), var(--rose));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 1rem; display: block;
  }
  .step-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
  .step-desc { font-size: 0.84rem; color: var(--ink2); line-height: 1.65; }
  .step-connector {
    position: absolute; top: 2.5rem; right: -1.3rem;
    color: var(--ink3); font-size: 1.2rem; z-index: 2;
  }

  /* ── Testimonials ── */
  .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-top: 4rem; }
  .testimonial-card {
    background: var(--bg1); border: 1px solid var(--glass-border);
    border-radius: var(--radius); padding: 1.6rem;
    transition: all 0.25s;
  }
  .testimonial-card:hover { border-color: rgba(139,92,246,0.2); background: var(--bg2); }
  .testimonial-quote { font-size: 0.88rem; color: var(--ink2); line-height: 1.7; margin-bottom: 1.2rem; font-family: 'Instrument Serif', serif; font-style: italic; }
  .testimonial-author { display: flex; align-items: center; gap: 0.7rem; }
  .testimonial-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 600; color: white; flex-shrink: 0;
  }
  .testimonial-name { font-size: 0.82rem; font-weight: 500; color: var(--ink); }
  .testimonial-role { font-size: 0.72rem; color: var(--ink3); }
  .stars { color: #fbbf24; font-size: 0.75rem; margin-bottom: 0.8rem; letter-spacing: 0.1em; }

  /* ── CTA Banner ── */
  .cta-banner {
    margin: 0 0 7rem;
    background: var(--bg1); border: 1px solid var(--glass-border);
    border-radius: 20px; padding: 4rem 3rem;
    text-align: center; position: relative; overflow: hidden;
  }
  .cta-banner::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.08), transparent 70%);
    pointer-events: none;
  }
  .cta-banner-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 5vw, 3.8rem);
    letter-spacing: 0.02em; margin-bottom: 1rem;
  }
  .cta-banner-sub { color: var(--ink2); font-size: 0.95rem; max-width: 420px; margin: 0 auto 2rem; line-height: 1.7; }

  /* ── Footer ── */
  .footer {
    background: var(--bg1); border-top: 1px solid var(--glass-border);
    padding: 4rem 0 2.5rem; position: relative; z-index: 2;
  }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3.5rem; }
  .footer-brand-logo {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: 0.08em;
    background: linear-gradient(90deg, var(--violet), var(--rose));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 0.8rem;
  }
  .footer-brand-desc { color: var(--ink3); font-size: 0.84rem; line-height: 1.7; max-width: 240px; }
  .footer-social { display: flex; gap: 0.6rem; margin-top: 1.4rem; }
  .footer-social-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--glass); border: 1px solid var(--glass-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; cursor: pointer; transition: all 0.2s; color: var(--ink3);
    text-decoration: none;
  }
  .footer-social-btn:hover { border-color: rgba(139,92,246,0.3); color: var(--violet); background: var(--violet-dim); }
  .footer-col-title { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); margin-bottom: 1rem; }
  .footer-links { display: flex; flex-direction: column; gap: 0.55rem; }
  .footer-link { font-size: 0.83rem; color: var(--ink3); cursor: pointer; transition: color 0.2s; text-decoration: none; }
  .footer-link:hover { color: var(--ink2); }
  .footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 2rem; border-top: 1px solid var(--glass-border);
    flex-wrap: wrap; gap: 1rem;
  }
  .footer-copy { font-size: 0.78rem; color: var(--ink3); }
  .footer-badges { display: flex; gap: 0.5rem; }
  .footer-badge {
    padding: 0.22rem 0.65rem; border-radius: 6px;
    background: var(--glass); border: 1px solid var(--glass-border);
    font-size: 0.68rem; color: var(--ink3); letter-spacing: 0.04em;
  }

  /* ── Board ── */
  .board-header-row {
    display: flex; align-items: flex-end; justify-content: space-between;
    padding: 2.5rem 0 1.5rem; gap: 1rem; flex-wrap: wrap;
  }
  .section-label { font-size: 0.7rem; color: var(--ink3); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.4rem; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.8rem; letter-spacing: 0.03em; line-height: 1; }
  .count-pill {
    background: var(--violet-dim); border: 1px solid rgba(139,92,246,0.2);
    color: var(--violet); padding: 0.2rem 0.7rem; border-radius: var(--radius-pill); font-size: 0.78rem;
  }
  .filter-bar {
    display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;
    padding: 0.4rem; background: var(--glass);
    border: 1px solid var(--glass-border); border-radius: var(--radius-pill); width: fit-content;
  }
  .filter-chip {
    background: none; border: none; color: var(--ink3); padding: 0.3rem 0.85rem;
    border-radius: var(--radius-pill); cursor: pointer;
    font-family: 'Geist', sans-serif; font-size: 0.78rem; font-weight: 500;
    transition: all 0.18s; white-space: nowrap;
  }
  .filter-chip.active { background: var(--bg2); color: var(--ink); box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
  .filter-chip:hover:not(.active) { color: var(--ink2); }
  .feedback-list { display: flex; flex-direction: column; gap: 0.6rem; }

  .fb-card {
    position: relative; overflow: hidden; background: var(--bg1);
    border: 1px solid var(--glass-border); border-radius: var(--radius);
    padding: 1.2rem 1.4rem; transition: all 0.22s; cursor: default;
    animation: fadeUp 0.4s ease both;
  }
  .fb-card:hover { border-color: rgba(139,92,246,0.25); background: var(--bg2); transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .fb-card-glow {
    position: absolute; inset: 0; pointer-events: none; opacity: 0;
    background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.06), transparent 60%);
    transition: opacity 0.3s;
  }
  .fb-card:hover .fb-card-glow { opacity: 1; }
  .fb-meta { display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; }
  .chip {
    display: inline-flex; align-items: center;
    padding: 0.18rem 0.55rem; border-radius: 6px;
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.03em;
  }
  .chip-anon { background: var(--violet-dim); color: var(--violet); }
  .chip-general { background: rgba(99,102,241,0.12); color: #818cf8; }
  .chip-bug { background: var(--red-dim); color: #f87171; }
  .chip-suggestion { background: rgba(245,158,11,0.12); color: #fbbf24; }
  .chip-complaint { background: var(--rose-dim); color: var(--rose); }
  .chip-positive { background: var(--emerald-dim); color: var(--emerald); }
  .chip-neutral { background: rgba(148,163,184,0.1); color: #94a3b8; }
  .chip-negative { background: var(--red-dim); color: #f87171; }
  .chip-pending { background: rgba(245,158,11,0.12); color: #fbbf24; }
  .chip-reviewed { background: var(--emerald-dim); color: var(--emerald); }
  .chip-resolved { background: rgba(16,217,160,0.15); color: var(--emerald); }
  .fb-content { color: var(--ink); font-size: 0.92rem; line-height: 1.65; margin-bottom: 1rem; font-weight: 300; }
  .fb-footer { display: flex; align-items: center; justify-content: space-between; }
  .upvote {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: none; border: 1px solid var(--glass-border); color: var(--ink3);
    padding: 0.28rem 0.75rem; border-radius: var(--radius-pill); cursor: pointer;
    font-family: 'Geist', sans-serif; font-size: 0.78rem; transition: all 0.2s;
  }
  .upvote:hover { border-color: rgba(244,63,142,0.4); color: var(--rose); background: var(--rose-dim); }
  .upvote-num { font-weight: 600; font-variant-numeric: tabular-nums; }
  .fb-time { color: var(--ink3); font-size: 0.72rem; letter-spacing: 0.02em; }

  /* ── Submit ── */
  .form-wrap { max-width: 560px; margin: 0 auto; padding: 3rem 1.5rem 5rem; }
  .form-eyebrow { font-size: 0.7rem; color: var(--ink3); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .form-heading { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; letter-spacing: 0.03em; line-height: 1; margin-bottom: 0.5rem; }
  .form-desc { color: var(--ink2); font-size: 0.88rem; line-height: 1.6; margin-bottom: 2.5rem; font-family: 'Instrument Serif', serif; font-style: italic; }
  .field { margin-bottom: 1.3rem; }
  .field-label {
    display: flex; justify-content: space-between;
    font-size: 0.72rem; font-weight: 500; color: var(--ink3);
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.5rem;
  }
  .field-label span { color: var(--ink3); font-weight: 400; }

  input, textarea, select {
    width: 100%; background: var(--bg2); border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm); padding: 0.72rem 0.95rem;
    color: var(--ink); font-family: 'Geist', sans-serif; font-size: 0.9rem; font-weight: 300;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s; appearance: none;
  }
  input:focus, textarea:focus, select:focus {
    border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 3px rgba(139,92,246,0.08);
  }
  textarea { resize: vertical; min-height: 130px; }
  select option { background: var(--bg2); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.9rem 1rem; background: var(--bg2);
    border: 1px solid var(--glass-border); border-radius: var(--radius-sm);
  }
  .toggle-info h4 { font-size: 0.88rem; font-weight: 500; color: var(--ink); margin-bottom: 0.15rem; }
  .toggle-info p { font-size: 0.75rem; color: var(--ink3); }
  .toggle {
    position: relative; width: 44px; height: 24px; background: var(--bg3);
    border-radius: var(--radius-pill); cursor: pointer; border: 1px solid var(--glass-border);
    transition: background 0.25s, border-color 0.25s; flex-shrink: 0;
  }
  .toggle.on { background: var(--violet); border-color: var(--violet); }
  .toggle::after {
    content: ''; position: absolute; width: 18px; height: 18px; background: white;
    border-radius: 50%; top: 2px; left: 2px;
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
  .toggle.on::after { transform: translateX(20px); }

  .submit-btn {
    width: 100%; padding: 0.88rem;
    background: linear-gradient(135deg, var(--violet), #7c3aed);
    border: none; border-radius: var(--radius-sm); color: white;
    font-family: 'Geist', sans-serif; font-size: 0.92rem; font-weight: 500;
    cursor: pointer; transition: all 0.3s;
    box-shadow: 0 0 24px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem;
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(139,92,246,0.4); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .err { color: #f87171; font-size: 0.78rem; margin-top: 0.35rem; display: flex; align-items: center; gap: 0.3rem; }

  /* Success */
  .success-page {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 70vh; text-align: center; padding: 2rem;
    animation: fadeUp 0.5s ease;
  }
  .success-icon {
    width: 76px; height: 76px; border-radius: 50%;
    background: linear-gradient(135deg, var(--violet), var(--rose));
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; margin-bottom: 1.5rem;
    box-shadow: 0 0 48px rgba(139,92,246,0.35);
  }
  .success-title { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; letter-spacing: 0.03em; margin-bottom: 0.7rem; }
  .success-sub { color: var(--ink2); font-size: 0.92rem; max-width: 340px; line-height: 1.6; margin-bottom: 2rem; }

  /* ── AUTH SPLIT LAYOUT ── */
  .auth-page {
    min-height: 100vh; display: flex; padding-top: 62px;
    position: relative; z-index: 2;
  }
  .auth-left {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 4rem 3rem; position: relative; overflow: hidden;
    background: var(--bg1); border-right: 1px solid var(--glass-border);
    min-height: calc(100vh - 62px);
  }
  .auth-left-orb {
    position: absolute; border-radius: 50%; pointer-events: none; filter: blur(70px);
  }
  .auth-left-orb-1 { width: 400px; height: 400px; background: radial-gradient(circle,rgba(139,92,246,0.18),transparent 70%); top:-100px; left:-100px; }
  .auth-left-orb-2 { width: 300px; height: 300px; background: radial-gradient(circle,rgba(244,63,142,0.12),transparent 70%); bottom:-80px; right:-60px; }
  .auth-left-logo {
    font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 0.08em;
    background: linear-gradient(90deg, var(--violet), var(--rose));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 3rem; cursor: pointer;
  }
  .auth-left-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 4vw, 4rem);
    letter-spacing: 0.02em; line-height: 0.92; margin-bottom: 1.2rem;
  }
  .auth-left-sub { color: var(--ink2); font-size: 0.92rem; line-height: 1.7; max-width: 320px; margin-bottom: 3rem; font-family: 'Instrument Serif', serif; font-style: italic; }
  .auth-features { display: flex; flex-direction: column; gap: 1rem; }
  .auth-feature { display: flex; align-items: center; gap: 0.9rem; }
  .auth-feature-icon {
    width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 0.95rem;
  }
  .auth-feature-text h4 { font-size: 0.88rem; font-weight: 500; color: var(--ink); margin-bottom: 0.15rem; }
  .auth-feature-text p { font-size: 0.78rem; color: var(--ink3); }

  .auth-right {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    align-items: center; padding: 4rem 3rem;
    min-height: calc(100vh - 62px);
  }
  .auth-form-box { width: 100%; max-width: 400px; }
  .auth-form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
  .auth-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.6rem; letter-spacing: 0.03em; line-height: 1; }
  .auth-sub { color: var(--ink2); font-size: 0.84rem; margin-top: 0.35rem; }
  .auth-switch { font-size: 0.82rem; color: var(--ink3); text-align: right; }
  .auth-link { color: var(--violet); cursor: pointer; font-weight: 500; }
  .auth-link:hover { text-decoration: underline; }
  .auth-divider { text-align: center; color: var(--ink3); font-size: 0.78rem; margin: 1.5rem 0; position: relative; }
  .auth-divider::before, .auth-divider::after { content:''; position:absolute; top:50%; width:44%; height:1px; background:var(--glass-border); }
  .auth-divider::before { left:0; } .auth-divider::after { right:0; }

  /* ── Admin ── */
  .admin-stats { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 1rem; margin-bottom: 2rem; }
  .admin-stat-card {
    background: var(--bg1); border: 1px solid var(--glass-border);
    border-radius: var(--radius); padding: 1.3rem 1.4rem;
    position: relative; overflow: hidden;
  }
  .admin-stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background: var(--accent-grad, linear-gradient(90deg, var(--violet), var(--rose))); }
  .admin-stat-label { color: var(--ink3); font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .admin-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.6rem; letter-spacing: 0.03em; line-height: 1; }
  .admin-table-wrap { background: var(--bg1); border: 1px solid var(--glass-border); border-radius: var(--radius); overflow: hidden; }
  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th { padding: 0.8rem 1rem; text-align: left; font-size: 0.68rem; font-weight: 600; color: var(--ink3); letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid var(--glass-border); background: var(--bg2); }
  .admin-table td { padding: 0.9rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.85rem; vertical-align: middle; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: rgba(255,255,255,0.015); }
  select.status-sel { padding: 0.28rem 0.7rem; font-size: 0.78rem; width: auto; border-radius: 6px; cursor: pointer; }
  .del-btn { background: var(--red-dim); border: 1px solid rgba(239,68,68,0.2); color: #f87171; padding: 0.28rem 0.7rem; border-radius: 6px; cursor: pointer; font-family: 'Geist', sans-serif; font-size: 0.78rem; transition: all 0.2s; }
  .del-btn:hover { background: rgba(239,68,68,0.2); }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.8rem 1.2rem; border-radius: var(--radius-sm); font-size: 0.85rem;
    background: var(--bg2); border: 1px solid var(--glass-border);
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
    backdrop-filter: blur(12px);
  }
  .toast.success { border-color: rgba(16,217,160,0.3); }
  .toast.success .toast-icon { color: var(--emerald); }
  .toast.error { border-color: rgba(239,68,68,0.3); }
  .toast.error .toast-icon { color: #f87171; }
  @keyframes toastIn { from{opacity:0;transform:translateX(20px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }

  /* ── Spinner ── */
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.15); border-top-color: var(--violet); border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-wrap { display: flex; justify-content: center; align-items: center; padding: 4rem; }

  /* ── Empty ── */
  .empty-state { text-align: center; padding: 5rem 2rem; color: var(--ink3); }
  .empty-state-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.4; }
  .empty-state-text { font-size: 0.88rem; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--bg3); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--ink3); }

  @media (max-width: 860px) {
    .auth-left { display: none; }
    .auth-right { padding: 2rem 1.5rem; }
    .features-grid, .steps-grid, .testimonials-grid { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .nav-center { display: none; }
    .hero-headline { font-size: 4.5rem; }
    .hero-stats { grid-template-columns: repeat(2,1fr); }
    .grid-2 { grid-template-columns: 1fr; }
    .admin-table { font-size: 0.78rem; }
    .admin-table th, .admin-table td { padding: 0.6rem 0.5rem; }
    .section-title { font-size: 2rem; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-banner { padding: 2.5rem 1.5rem; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  if (!msg) return null;
  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">{type === "success" ? "✓" : "✕"}</span>
      <span>{msg}</span>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, user, onLogout }) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "board", label: "Board" },
    { id: "submit", label: "Submit" },
    ...(user?.role === "admin" ? [{ id: "admin", label: "Admin" }] : []),
  ];
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("home")}>OPENPULSE</div>
      <div className="nav-center">
        {tabs.map(t => (
          <button key={t.id} className={`nav-tab ${page === t.id ? "active" : ""}`} onClick={() => setPage(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <div className="nav-user">
              <div className="nav-avatar">{user.username?.[0]?.toUpperCase()}</div>
              <span className="nav-username">{user.username}</span>
            </div>
            <button className="btn-ghost" onClick={onLogout}>Sign out</button>
          </>
        ) : (
          <button className="btn-nav-primary" onClick={() => setPage("auth")}>Sign in</button>
        )}
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  const product = ["Public Board", "Submit Feedback", "How It Works", "Changelog"];
  const company = ["About", "Blog", "Careers", "Press"];
  const legal = ["Privacy Policy", "Terms of Service", "Cookie Policy"];
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo">OPENPULSE</div>
            <p className="footer-brand-desc">
              The open feedback platform for honest voices. Anonymous, real-time, and built for trust.
            </p>
            <div className="footer-social">
              {["𝕏", "G", "in", "◎"].map((s, i) => (
                <a key={i} className="footer-social-btn" href="#">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <div className="footer-links">
              {product.map(l => <span key={l} className="footer-link" onClick={() => l === "Public Board" ? setPage("board") : l === "Submit Feedback" ? setPage("submit") : null}>{l}</span>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              {company.map(l => <span key={l} className="footer-link">{l}</span>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <div className="footer-links">
              {legal.map(l => <span key={l} className="footer-link">{l}</span>)}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 OpenPulse. All rights reserved.</span>
          <div className="footer-badges">
            <span className="footer-badge">✦ Open Source</span>
            <span className="footer-badge">🔒 Privacy First</span>
            <span className="footer-badge">◎ Anonymous</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home({ setPage, stats }) {
  const features = [
    { icon: "◎", bg: "rgba(139,92,246,0.12)", color: "#a78bfa", title: "True Anonymity", desc: "No accounts required. No IP logging. Your identity is yours to keep, always." },
    { icon: "⚡", bg: "rgba(251,191,36,0.1)", color: "#fbbf24", title: "Real-Time Updates", desc: "See feedback appear live on the public board. Vote, react, and engage instantly." },
    { icon: "🏷", bg: "rgba(16,217,160,0.1)", color: "#10d9a0", title: "Smart Categorization", desc: "Auto-detect sentiment and category so every piece of feedback finds its home." },
    { icon: "↑", bg: "rgba(244,63,142,0.1)", color: "#f43f8e", title: "Community Upvotes", desc: "The community amplifies what matters most. Popular feedback rises to the top." },
    { icon: "🛡", bg: "rgba(99,102,241,0.12)", color: "#818cf8", title: "Admin Controls", desc: "Powerful moderation tools for teams. Review, resolve, and manage with ease." },
    { icon: "✦", bg: "rgba(245,158,11,0.1)", color: "#f59e0b", title: "Open Platform", desc: "Fully open-source and API-first. Integrate feedback into any workflow." },
  ];

  const steps = [
    { num: "01", title: "Write Your Thought", desc: "Type your feedback — a bug report, a suggestion, praise, or a complaint. No account, no friction." },
    { num: "02", title: "Choose Your Privacy", desc: "Toggle anonymous mode. Assign a category and sentiment. Submit in seconds." },
    { num: "03", title: "Watch It Land", desc: "Your feedback appears on the public board. The community votes. Admins act." },
  ];

  const testimonials = [
    { quote: "Finally a feedback tool that respects my privacy. I can say exactly what I think without any fear of blowback.", name: "A. Chen", role: "Product Designer", stars: 5, color: "#a78bfa" },
    { quote: "We switched our entire team's feedback loop to OpenPulse. The anonymous submissions have tripled honest input.", name: "M. Torres", role: "Engineering Lead", stars: 5, color: "#f43f8e" },
    { quote: "The real-time board is addictive. Watching upvotes roll in on a good suggestion is genuinely satisfying.", name: "R. Okafor", role: "Startup Founder", stars: 5, color: "#10d9a0" },
  ];

  return (
    <div className="page" style={{ paddingTop: "62px" }}>
      {/* Hero */}
      <div className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-eyebrow">
          <span className="dot" />
          Anonymous · Real-Time · Open Source
        </div>
        <h1 className="hero-headline">
          <span className="line-1">Feedback</span>
          <span className="line-2">Without Fear</span>
        </h1>
        <p className="hero-sub">
          Share honest, unfiltered feedback with the world. No accounts, no judgment — just raw insights that actually drive change.
        </p>
        <div className="hero-cta">
          <button className="cta-primary" onClick={() => setPage("submit")}>
            <span>✦</span> Submit Feedback
          </button>
          <button className="cta-secondary" onClick={() => setPage("board")}>
            Browse Board <span>→</span>
          </button>
        </div>
        <div className="hero-stats">
          {[
            { num: stats.total, label: "Submitted" },
            { num: stats.anonymous, label: "Anonymous" },
            { num: stats.resolved, label: "Resolved" },
            { num: stats.upvotes, label: "Upvotes" },
          ].map(s => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider" />

      {/* Features */}
      <div className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>Features</div>
            <div className="section-heading">Everything you need<br />to speak freely</div>
            <p className="section-body" style={{ margin: "0 auto" }}>
              Built around a single principle: your voice matters, and it should be heard safely.
            </p>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-divider" />

      {/* How it works */}
      <div className="section">
        <div className="container">
          <div>
            <div className="section-tag">How It Works</div>
            <div className="section-heading">Three steps.<br />Total clarity.</div>
            <p className="section-body">From thought to published feedback in under 30 seconds. No signup walls, no friction.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.num} className="step-card" style={{ position: "relative" }}>
                <span className="step-num">{s.num}</span>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
                {i < steps.length - 1 && <span className="step-connector">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-divider" />

      {/* Testimonials */}
      <div className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>Testimonials</div>
            <div className="section-heading">Trusted by teams<br />who value honesty</div>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.name} className="testimonial-card">
                <div className="stars">{"★".repeat(t.stars)}</div>
                <div className="testimonial-quote">"{t.quote}"</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-divider" />

      {/* CTA Banner */}
      <div className="container">
        <div className="cta-banner">
          <div className="cta-banner-title">Ready to speak your mind?</div>
          <p className="cta-banner-sub">Join thousands of people sharing honest feedback every day. Anonymous, free, forever.</p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="cta-primary" onClick={() => setPage("submit")}>✦ Submit Now — It's Free</button>
            <button className="cta-secondary" onClick={() => setPage("board")}>View Live Board →</button>
          </div>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────
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

  return (
    <div className="page">
      <div className="container" style={{ paddingBottom: "5rem" }}>
        <div className="board-header-row">
          <div>
            <div className="section-label">Community</div>
            <div className="section-title">Public Board</div>
          </div>
          <span className="count-pill">{feedbacks.length} entries</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <div className="filter-bar">
            {["all","general","bug","suggestion","complaint"].map(c => (
              <button key={c} className={`filter-chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <div className="filter-bar">
            {["all","positive","neutral","negative"].map(s => (
              <button key={s} className={`filter-chip ${sentiment === s ? "active" : ""}`} onClick={() => setSentiment(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <div className="empty-state-text">No feedback found. Be the first to submit.</div>
          </div>
        ) : (
          <div className="feedback-list">
            {feedbacks.map((fb, i) => <FeedbackCard key={fb._id} fb={fb} onUpvote={upvote} delay={i * 0.04} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackCard({ fb, onUpvote, delay }) {
  const cardRef = useRef();
  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    cardRef.current.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height * 100).toFixed(1)}%`);
  };
  return (
    <div ref={cardRef} className="fb-card" style={{ animationDelay: `${delay}s` }} onMouseMove={handleMouseMove}>
      <div className="fb-card-glow" />
      <div className="fb-meta">
        {fb.isAnonymous && <span className="chip chip-anon">◎ Anon</span>}
        <span className={`chip chip-${fb.category}`}>{fb.category}</span>
        <span className={`chip chip-${fb.sentiment}`}>{fb.sentiment}</span>
        <span className={`chip chip-${fb.status}`}>{fb.status}</span>
      </div>
      <div className="fb-content">{fb.content}</div>
      <div className="fb-footer">
        <button className="upvote" onClick={() => onUpvote(fb._id)}>↑ <span className="upvote-num">{fb.upvotes}</span></button>
        <span className="fb-time">{timeAgo(fb.createdAt)}</span>
      </div>
    </div>
  );
}

// ─── Submit ───────────────────────────────────────────────────────────────────
function Submit({ toast, user }) {
  const [form, setForm] = useState({ content: "", category: "general", sentiment: "neutral", isAnonymous: true });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    if (form.content.trim().length < 5) { setErr("Feedback must be at least 5 characters."); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("op_token");
      const res = await fetch(`${API}/feedback/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setSubmitted(true); toast("Feedback submitted!", "success"); }
      else setErr(data.message || "Something went wrong.");
    } catch { setErr("Server error. Is your backend running?"); }
    setLoading(false);
  };

  if (submitted) return (
    <div className="page">
      <div className="success-page">
        <div className="success-icon">✦</div>
        <div className="success-title">Voice Heard</div>
        <p className="success-sub">Your feedback has been received. {form.isAnonymous && "Your identity remains protected."}</p>
        <button className="cta-primary" onClick={() => { setSubmitted(false); setForm({ content: "", category: "general", sentiment: "neutral", isAnonymous: true }); }}>Submit Another</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="form-wrap">
        <div className="form-eyebrow">New Entry</div>
        <h2 className="form-heading">Share Feedback</h2>
        <p className="form-desc">Honest and anonymous by default. Your thoughts, unfiltered.</p>
        <div className="field">
          <div className="field-label">Your Feedback <span>{form.content.length}/500</span></div>
          <textarea placeholder="What's on your mind? Be specific, be honest..." value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })} maxLength={500} />
          {err && <div className="err">✕ {err}</div>}
        </div>
        <div className="grid-2">
          <div className="field">
            <div className="field-label">Category</div>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="general">General</option><option value="bug">Bug</option>
              <option value="suggestion">Suggestion</option><option value="complaint">Complaint</option>
            </select>
          </div>
          <div className="field">
            <div className="field-label">Sentiment</div>
            <select value={form.sentiment} onChange={e => setForm({ ...form, sentiment: e.target.value })}>
              <option value="positive">Positive</option><option value="neutral">Neutral</option><option value="negative">Negative</option>
            </select>
          </div>
        </div>
        <div className="field">
          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Submit Anonymously</h4>
              <p>Your identity will not be recorded</p>
            </div>
            <div className={`toggle ${form.isAnonymous ? "on" : ""}`} onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })} />
          </div>
        </div>
        <button className="submit-btn" onClick={submit} disabled={loading}>
          {loading ? <><span className="spinner" /> Submitting…</> : <>✦ Submit Feedback</>}
        </button>
      </div>
    </div>
  );
}

// ─── Auth (Split Layout) ──────────────────────────────────────────────────────
function Auth({ onLogin, toast, setPage }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const endpoint = mode === "login" ? "login" : "register";
      const body = mode === "login" ? { email: form.email, password: form.password } : form;
      const res = await fetch(`${API}/user/${endpoint}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { localStorage.setItem("op_token", data.token); onLogin(data.user, data.token); toast(`Welcome, ${data.user.username}!`, "success"); }
      else setErr(data.message);
    } catch { setErr("Server error. Is your backend running?"); }
    setLoading(false);
  };

  const authFeatures = [
    { icon: "◎", bg: "rgba(139,92,246,0.12)", color: "#a78bfa", title: "Anonymous by default", desc: "Submit without an account" },
    { icon: "↑", bg: "rgba(244,63,142,0.12)", color: "#f43f8e", title: "Upvote & engage", desc: "Amplify what matters most" },
    { icon: "🛡", bg: "rgba(16,217,160,0.12)", color: "#10d9a0", title: "Secure & private", desc: "Your data stays yours" },
  ];

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-orb auth-left-orb-1" />
        <div className="auth-left-orb auth-left-orb-2" />
        <div className="auth-left-logo" onClick={() => setPage("home")}>OPENPULSE</div>
        <div className="auth-left-heading">
          {mode === "login" ? <>Welcome<br />back.</> : <>Join the<br />movement.</>}
        </div>
        <p className="auth-left-sub">
          {mode === "login"
            ? "Sign in to manage your feedback, track upvotes, and access admin tools."
            : "Create an account to unlock moderation tools, track your submissions, and more."}
        </p>
        <div className="auth-features">
          {authFeatures.map(f => (
            <div key={f.title} className="auth-feature">
              <div className="auth-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
              <div className="auth-feature-text">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <div>
              <div className="auth-title">{mode === "login" ? "Sign In" : "Register"}</div>
              <div className="auth-sub">{mode === "login" ? "Access your account" : "Create your account"}</div>
            </div>
            <div className="auth-switch">
              {mode === "login" ? "New here?" : "Have an account?"}<br />
              <span className="auth-link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }}>
                {mode === "login" ? "Register →" : "Sign in →"}
              </span>
            </div>
          </div>

          {mode === "register" && (
            <div className="field">
              <div className="field-label">Username</div>
              <input placeholder="yourname" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            </div>
          )}
          <div className="field">
            <div className="field-label">Email</div>
            <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <div className="field-label">Password</div>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {mode === "register" && (
            <div className="field">
              <div className="field-label">Role</div>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          {err && <div className="err" style={{ marginBottom: "0.5rem" }}>✕ {err}</div>}
          <button className="submit-btn" onClick={submit} disabled={loading} style={{ marginTop: "0.5rem" }}>
            {loading ? <><span className="spinner" /> Please wait…</> : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
          <div className="auth-divider">or continue as guest</div>
          <button className="submit-btn" style={{ background: "var(--bg2)", boxShadow: "none", border: "1px solid var(--glass-border)", color: "var(--ink2)", marginTop: 0 }}
            onClick={() => setPage("board")}>
            Browse without account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────
function Admin({ toast, user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("op_token");
      const res = await fetch(`${API}/feedback/all`, { headers: { Authorization: `Bearer ${token}` } });
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
      if (data.success) { setFeedbacks(f => f.map(fb => fb._id === id ? { ...fb, status } : fb)); toast("Updated!", "success"); }
    } catch { toast("Failed to update", "error"); }
  };

  const deleteFb = async (id) => {
    if (!confirm("Delete this feedback?")) return;
    try {
      const token = localStorage.getItem("op_token");
      const res = await fetch(`${API}/feedback/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setFeedbacks(f => f.filter(fb => fb._id !== id)); toast("Deleted!", "success"); }
    } catch { toast("Failed to delete", "error"); }
  };

  if (!user || user.role !== "admin") return (
    <div className="page"><div className="empty-state"><div className="empty-state-icon">🔒</div><div className="empty-state-text">Admin access required.</div></div></div>
  );

  const total = feedbacks.length;
  const pending = feedbacks.filter(f => f.status === "pending").length;
  const resolved = feedbacks.filter(f => f.status === "resolved").length;
  const upvotes = feedbacks.reduce((s, f) => s + f.upvotes, 0);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div className="section-label">Control Panel</div>
          <div className="section-title">Admin Dashboard</div>
        </div>
        <div className="admin-stats">
          {[
            { label: "Total Entries", num: total, color: "var(--violet)", grad: "linear-gradient(90deg,var(--violet),#9d80ff)" },
            { label: "Pending Review", num: pending, color: "var(--amber)", grad: "linear-gradient(90deg,var(--amber),#fcd34d)" },
            { label: "Resolved", num: resolved, color: "var(--emerald)", grad: "linear-gradient(90deg,var(--emerald),#6ee7c7)" },
            { label: "Total Upvotes", num: upvotes, color: "var(--rose)", grad: "linear-gradient(90deg,var(--rose),#fb7bb5)" },
          ].map(s => (
            <div key={s.label} className="admin-stat-card" style={{ "--accent-grad": s.grad }}>
              <div className="admin-stat-label">{s.label}</div>
              <div className="admin-stat-num" style={{ color: s.color }}>{s.num}</div>
            </div>
          ))}
        </div>
        {loading ? <div className="loading-wrap"><div className="spinner" /></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Content</th><th>Category</th><th>Sentiment</th><th>Votes</th><th>Status</th><th>Date</th><th>Act</th></tr>
              </thead>
              <tbody>
                {feedbacks.map(fb => (
                  <tr key={fb._id}>
                    <td style={{ maxWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        {fb.isAnonymous && <span className="chip chip-anon" style={{ fontSize: "0.65rem" }}>◎</span>}
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 210, display: "block", color: "var(--ink2)" }}>{fb.content}</span>
                      </div>
                    </td>
                    <td><span className={`chip chip-${fb.category}`}>{fb.category}</span></td>
                    <td><span className={`chip chip-${fb.sentiment}`}>{fb.sentiment}</span></td>
                    <td style={{ color: "var(--rose)", fontWeight: 500 }}>↑ {fb.upvotes}</td>
                    <td>
                      <select className="status-sel" value={fb.status} onChange={e => updateStatus(fb._id, e.target.value)}>
                        <option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td style={{ color: "var(--ink3)" }}>{timeAgo(fb.createdAt)}</td>
                    <td><button className="del-btn" onClick={() => deleteFb(fb._id)}>Del</button></td>
                  </tr>
                ))}
                {feedbacks.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--ink3)" }}>No feedback yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
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
      setStats({ total: fbs.length, anonymous: fbs.filter(f => f.isAnonymous).length, resolved: fbs.filter(f => f.status === "resolved").length, upvotes: fbs.reduce((s, f) => s + f.upvotes, 0) });
    } catch {}
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3500);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("op_user", JSON.stringify(userData));
    setPage("board");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("op_token");
    localStorage.removeItem("op_user");
    setPage("home");
    showToast("Signed out", "success");
  };

  return (
    <>
      <style>{styles}</style>
      {page !== "auth" && <Nav page={page} setPage={setPage} user={user} onLogout={handleLogout} />}
      {page === "home" && <Home setPage={setPage} stats={stats} />}
      {page === "board" && <Board toast={showToast} />}
      {page === "submit" && <Submit toast={showToast} user={user} />}
      {page === "auth" && <Auth onLogin={handleLogin} toast={showToast} setPage={setPage} />}
      {page === "admin" && <Admin toast={showToast} user={user} />}
      {toast.msg && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />}
    </>
  );
}