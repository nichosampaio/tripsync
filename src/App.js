import { useState, useMemo, useRef, useEffect } from "react";
import React from "react";
import { supabase } from "./supabase";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap');`;

const CSS = `/* TripSync v3 */
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; background: #f0ede8; color: #1c1410; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
:root {
  --bg: #f0ede8;
  --surface: #fefcf9;
  --surface2: #f4f1eb;
  --surface3: #ece8e0;
  --border: rgba(100,70,40,0.11);
  --border-strong: rgba(100,70,40,0.20);
  --accent: #c96a28;
  --accent-hover: #b85a1e;
  --accent-soft: rgba(201,106,40,0.09);
  --accent-glow: rgba(201,106,40,0.18);
  --green: #1e7a45;
  --green-soft: rgba(30,122,69,0.09);
  --red: #c0392b;
  --red-soft: rgba(192,57,43,0.08);
  --yellow: #a07000;
  --yellow-soft: rgba(160,112,0,0.09);
  --text: #1c1410;
  --text-secondary: #3a2e24;
  --muted: #7a6a58;
  --muted-light: #a09080;
  --shadow-xs: 0 1px 3px rgba(60,30,10,0.06);
  --shadow-sm: 0 2px 8px rgba(60,30,10,0.08), 0 1px 2px rgba(60,30,10,0.04);
  --shadow-md: 0 6px 24px rgba(60,30,10,0.10), 0 2px 6px rgba(60,30,10,0.05);
  --shadow-lg: 0 16px 48px rgba(60,30,10,0.12), 0 4px 14px rgba(60,30,10,0.06);
  --shadow-xl: 0 28px 72px rgba(60,30,10,0.16), 0 8px 24px rgba(60,30,10,0.08);
  --budget-text: #1c1410;
  --budget-green: #1e7a45;
  --budget-indigo: #4a6fa5;
  --budget-orange: #c96a28;
  --r-sm: 7px; --r-md: 12px; --r-lg: 16px; --r-xl: 22px; --r-full: 980px;
}
.app { min-height: 100vh; background: var(--bg); }

/* ─── NAV ─────────────────────────────────────────────── */
.nav { display:flex; align-items:center; justify-content:space-between; padding:0 48px; height:58px; border-bottom:1px solid var(--border); background:rgba(254,252,249,0.94); backdrop-filter:saturate(180%) blur(20px); -webkit-backdrop-filter:saturate(180%) blur(20px); position:sticky; top:0; z-index:200; }
.nav-logo { font-family:'Inter',sans-serif; font-size:17px; font-weight:800; color:var(--text); letter-spacing:-0.6px; cursor:pointer; display:flex; align-items:center; gap:8px; }
.nav-logo-mark { width:26px; height:26px; border-radius:7px; background:linear-gradient(135deg,#c96a28,#e8924a); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(201,106,40,0.35); flex-shrink:0; }
.nav-logo-mark svg { width:14px; height:14px; fill:none; stroke:#fff; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round; }
.nav-tabs { display:flex; gap:1px; background:var(--surface2); padding:4px; border-radius:10px; border:1px solid var(--border); }
.nav-tab { padding:5px 16px; border-radius:7px; border:none; cursor:pointer; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; background:transparent; color:var(--muted); transition:all 0.18s; letter-spacing:-0.1px; }
.nav-tab:hover { color:var(--text); }
.nav-tab.active { background:var(--surface); color:var(--text); font-weight:600; box-shadow:var(--shadow-xs); }
.nav-user { display:flex; align-items:center; gap:10px; }
.avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#c96a28,#e8924a); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; color:#fff; box-shadow:0 2px 8px rgba(201,106,40,0.3); flex-shrink:0; }

/* ─── LANDING ─────────────────────────────────────────── */
.landing { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:calc(100vh - 58px); text-align:center; padding:80px 24px 100px; position:relative; overflow:hidden; background:linear-gradient(170deg, #f0ede8 0%, #fefcf9 55%, #f0ede8 100%); }
.landing::before { content:""; position:absolute; top:-80px; left:50%; transform:translateX(-50%); width:900px; height:600px; background:radial-gradient(ellipse 55% 50% at 50% 30%, rgba(201,106,40,0.08) 0%, rgba(232,146,74,0.04) 50%, transparent 75%); pointer-events:none; }
.landing::after { content:""; position:absolute; bottom:0; left:0; right:0; height:180px; background:linear-gradient(to top, #f0ede8, transparent); pointer-events:none; }
.landing-eyebrow { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:var(--r-full); background:rgba(201,106,40,0.07); border:1px solid rgba(201,106,40,0.18); color:var(--accent); font-size:12px; font-weight:600; letter-spacing:0.3px; margin-bottom:28px; position:relative; }
.landing-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse-dot 2s ease infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
.landing h1 { font-family:'Inter',sans-serif; font-size:clamp(42px,6vw,76px); font-weight:800; line-height:1.04; letter-spacing:-3px; color:var(--text); margin-bottom:22px; position:relative; }
.landing h1 .gradient-word { background:linear-gradient(135deg,#c96a28 0%,#e8924a 60%,#f5b07a 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.landing-sub { font-size:18px; color:var(--muted); max-width:520px; line-height:1.7; margin-bottom:44px; font-weight:400; position:relative; }
.btn-group { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; position:relative; }

/* ─── BUTTONS ─────────────────────────────────────────── */
.btn { padding:10px 20px; border-radius:var(--r-sm); border:none; cursor:pointer; font-family:'Inter',sans-serif; font-size:13px; font-weight:600; transition:all 0.18s; display:inline-flex; align-items:center; justify-content:center; gap:7px; letter-spacing:-0.1px; }
.btn-primary { background:linear-gradient(135deg,#c96a28,#b85a1e); color:#fff; box-shadow:0 2px 10px rgba(201,106,40,0.30); }
.btn-primary:hover { background:linear-gradient(135deg,#b85a1e,#a04a10); box-shadow:0 4px 16px rgba(201,106,40,0.38); transform:translateY(-1px); }
.btn-primary:active { transform:translateY(0); }
.btn-ghost { background:var(--surface2); color:var(--text); border:1px solid var(--border); }
.btn-ghost:hover { background:var(--surface3); transform:translateY(-1px); }
.btn-ghost:active { transform:translateY(0); }
.btn-sm { padding:6px 13px; font-size:12px; }
.btn-danger { background:var(--red-soft); color:var(--red); border:1px solid rgba(192,57,43,0.18); }
.btn-danger:hover { background:rgba(192,57,43,0.13); }
.btn-accent2 { background:var(--accent-soft); color:var(--accent); border:1px solid rgba(201,106,40,0.2); }
.btn-accent2:hover { background:rgba(201,106,40,0.14); }

/* ─── FEATURE CARDS ───────────────────────────────────── */
.features { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; max-width:920px; margin-top:68px; text-align:left; position:relative; z-index:1; }
.feature-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:26px; transition:all 0.22s; box-shadow:var(--shadow-xs); }
.feature-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:rgba(201,106,40,0.18); }
.feature-icon { font-size:20px; margin-bottom:14px; width:42px; height:42px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,rgba(201,106,40,0.10),rgba(232,146,74,0.07)); border-radius:11px; border:1px solid rgba(201,106,40,0.14); }
.feature-card h3 { font-family:'Inter',sans-serif; font-size:14px; font-weight:700; margin-bottom:6px; letter-spacing:-0.2px; color:var(--text); }
.feature-card p { font-size:13px; color:var(--muted); line-height:1.6; }

/* ─── DASHBOARD ───────────────────────────────────────── */
.dashboard { padding:48px; max-width:1220px; margin:0 auto; }
.trip-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(316px,1fr)); gap:16px; }
.trip-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:24px; cursor:pointer; transition:all 0.22s; position:relative; overflow:hidden; box-shadow:var(--shadow-xs); }
.trip-card::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#c96a28,#e8924a); opacity:0; transition:opacity 0.22s; }
.trip-card:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); border-color:rgba(201,106,40,0.2); }
.trip-card:hover::before { opacity:1; }
.trip-card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; }
.trip-name { font-family:'Inter',sans-serif; font-size:15px; font-weight:700; color:var(--text); letter-spacing:-0.4px; line-height:1.3; }
.badge { padding:3px 9px; border-radius:var(--r-full); font-size:11px; font-weight:600; background:var(--accent-soft); color:var(--accent); border:1px solid rgba(201,106,40,0.18); letter-spacing:0.1px; }
.badge-yellow { background:var(--yellow-soft); color:var(--yellow); border-color:rgba(160,112,0,0.18); }
.badge-green { background:var(--green-soft); color:var(--green); border-color:rgba(30,122,69,0.18); }
.trip-meta { display:flex; flex-direction:column; gap:6px; }
.trip-meta-item { display:flex; align-items:center; gap:9px; font-size:13px; color:var(--muted); line-height:1.4; }
.trip-meta-item strong { color:var(--text-secondary); font-weight:500; }
.members-row { display:flex; gap:5px; margin-top:14px; flex-wrap:wrap; align-items:center; }
.member-chip { padding:3px 9px; border-radius:var(--r-full); font-size:11px; font-weight:500; background:var(--surface2); border:1px solid var(--border); color:var(--muted-light); }

/* ─── MODAL ───────────────────────────────────────────── */
.modal-overlay { position:fixed; inset:0; background:rgba(28,20,16,0.45); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); animation:fadeOverlay 0.18s ease; }
@keyframes fadeOverlay { from{opacity:0} to{opacity:1} }
.modal { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl); padding:34px; width:100%; max-width:520px; max-height:92vh; overflow-y:auto; box-shadow:var(--shadow-xl); animation:slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1); }
.modal-lg { max-width:640px; }
.modal h3 { font-family:'Inter',sans-serif; font-size:20px; font-weight:800; margin-bottom:24px; letter-spacing:-0.5px; color:var(--text); }
@keyframes slideUp { from{opacity:0;transform:translateY(18px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

/* ─── FORMS ───────────────────────────────────────────── */
.form-group { margin-bottom:15px; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.form-label { display:block; font-size:10px; font-weight:700; color:var(--muted); margin-bottom:5px; letter-spacing:0.9px; text-transform:uppercase; font-family:'Inter',sans-serif; }
.form-input { width:100%; padding:9px 12px; border-radius:7px; background:var(--surface2); border:1.5px solid var(--border); color:var(--text); font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:all 0.18s; }
.form-input:focus { border-color:var(--accent); background:var(--surface); box-shadow:0 0 0 3px rgba(201,106,40,0.10); }
.form-input.err { border-color:var(--red); }
.form-textarea { resize:vertical; min-height:76px; }
.form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:24px; }
.err-msg { color:var(--red); font-size:12px; margin-top:5px; font-weight:500; }

/* ─── TRIP DETAIL ─────────────────────────────────────── */
.trip-detail { padding:40px 48px; max-width:1120px; margin:0 auto; }
.trip-detail-header { display:flex; align-items:center; gap:11px; margin-bottom:8px; flex-wrap:wrap; }
.back-btn { background:transparent; border:none; color:var(--accent); padding:6px 0; cursor:pointer; font-size:13px; font-weight:600; transition:opacity 0.15s; letter-spacing:-0.1px; }
.back-btn:hover { opacity:0.6; }
.trip-detail h2 { font-family:'Inter',sans-serif; font-size:26px; font-weight:800; letter-spacing:-0.8px; color:var(--text); }

/* ─── SECTION TABS ────────────────────────────────────── */
.section-tabs { display:flex; gap:0; margin:24px 0 22px; border-bottom:1px solid var(--border); flex-wrap:wrap; overflow-x:auto; }
.section-tab { padding:9px 15px; border-radius:0; border:none; cursor:pointer; font-family:'Inter',sans-serif; font-size:11.5px; font-weight:500; background:transparent; color:var(--muted); border-bottom:2px solid transparent; margin-bottom:-1px; transition:all 0.15s; white-space:nowrap; letter-spacing:0.15px; }
.section-tab:hover { color:var(--text-secondary); }
.section-tab.active { color:var(--accent); border-bottom-color:var(--accent); font-weight:700; }
.section-content { animation:fadeIn 0.2s ease; }
@keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin { to{transform:rotate(360deg)} }

/* ─── DATE PICKER ─────────────────────────────────────── */
.datepicker-wrap { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); overflow:hidden; box-shadow:var(--shadow-md); }
.dp-top { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid var(--border); }
.dp-top span { font-family:'Inter',sans-serif; font-weight:700; font-size:14px; letter-spacing:-0.2px; }
.dp-nav { background:var(--surface2); border:1px solid var(--border); color:var(--text); border-radius:7px; width:28px; height:28px; cursor:pointer; font-size:15px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
.dp-nav:hover { background:var(--surface3); }
.dp-body { padding:12px 16px; }
.dp-hdrs { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; margin-bottom:4px; }
.dp-hdr { text-align:center; font-size:10px; font-weight:700; color:var(--muted); padding:3px 0; text-transform:uppercase; letter-spacing:0.4px; }
.dp-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.dp-cell { height:32px; display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:13px; cursor:pointer; transition:all 0.12s; border:1px solid transparent; color:var(--text); }
.dp-cell:hover:not(.dp-empty):not(.dp-past) { background:var(--surface2); }
.dp-empty { cursor:default; }
.dp-past { color:var(--muted); opacity:0.3; cursor:not-allowed; }
.dp-start { background:var(--accent) !important; color:#fff !important; font-weight:700; border-radius:8px 0 0 8px !important; box-shadow:var(--shadow-blue); }
.dp-end { background:var(--accent) !important; color:#fff !important; font-weight:700; border-radius:0 8px 8px 0 !important; box-shadow:var(--shadow-blue); }
.dp-start.dp-end { border-radius:8px !important; }
.dp-in-range { background:rgba(201,106,40,0.09); border-radius:0 !important; }
.dp-footer { padding:10px 16px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; }
.dp-footer-label { font-size:13px; color:var(--muted); }
.dp-footer-label strong { color:var(--accent); }

/* ─── SCHEDULE ────────────────────────────────────────── */
.sched-layout { display:grid; grid-template-columns:196px 1fr; gap:20px; align-items:start; }
.sched-mini-cal { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); overflow:hidden; position:sticky; top:68px; box-shadow:var(--shadow-sm); }
.smc-header { display:flex; align-items:center; justify-content:space-between; padding:11px 13px; border-bottom:1px solid var(--border); }
.smc-header span { font-family:'Inter',sans-serif; font-weight:700; font-size:13px; }
.smc-nav { background:transparent; border:none; color:var(--muted); cursor:pointer; font-size:14px; padding:2px 5px; border-radius:5px; transition:color 0.15s; }
.smc-nav:hover { color:var(--accent); }
.smc-body { padding:9px 11px 11px; }
.smc-day-hdrs { display:grid; grid-template-columns:repeat(7,1fr); margin-bottom:3px; }
.smc-day-hdr { text-align:center; font-size:9px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.3px; }
.smc-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.smc-cell { height:26px; display:flex; align-items:center; justify-content:center; border-radius:6px; font-size:11px; cursor:pointer; transition:all 0.12s; border:1px solid transparent; color:var(--muted); }
.smc-cell:hover:not(.smc-empty) { background:var(--surface2); color:var(--text); }
.smc-empty { cursor:default; }
.smc-trip { background:rgba(201,106,40,0.08); border-color:rgba(201,106,40,0.16); color:var(--accent); }
.smc-trip-start { background:var(--accent) !important; color:#fff !important; font-weight:700; border-radius:6px 0 0 6px; }
.smc-trip-end { background:var(--accent) !important; color:#fff !important; font-weight:700; border-radius:0 6px 6px 0; }
.smc-trip-start.smc-trip-end { border-radius:6px !important; }
.smc-active { outline:2px solid var(--accent); outline-offset:1px; }
.smc-today { background:rgba(201,106,40,0.14); border-color:rgba(201,106,40,0.28); color:var(--accent); font-weight:700; }

/* ─── DAY BLOCKS ──────────────────────────────────────── */
.day-block { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); margin-bottom:10px; overflow:hidden; transition:all 0.18s; }
.day-block:hover { box-shadow:var(--shadow-sm); }
.day-block.active-day { border-color:var(--accent); box-shadow:0 0 0 3px rgba(201,106,40,0.09); }
.day-block.drag-over-day { border-color:var(--accent) !important; background:rgba(201,106,40,0.02); }
.day-block-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; }
.day-block-header:hover { background:rgba(0,0,0,0.012); }
.day-label { display:flex; align-items:center; gap:13px; }
.day-num { width:36px; height:36px; border-radius:50%; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; font-weight:700; font-size:13px; }
.day-num.is-today { background:linear-gradient(135deg,#c96a28,#e8924a); color:#fff; border-color:transparent; box-shadow:var(--shadow-blue); }
.day-title { font-size:15px; font-weight:700; letter-spacing:-0.2px; }
.day-sub { font-size:12px; color:var(--muted); margin-top:1px; }
.day-count-badge { font-size:11px; font-weight:600; color:var(--muted); background:var(--surface2); border:1px solid var(--border); border-radius:var(--r-full); padding:2px 10px; }
.day-body { padding:0 18px 16px; border-top:1px solid var(--border); }

/* ─── TIMELINE ────────────────────────────────────────── */
.tl-wrap { position:relative; display:flex; gap:0; margin-top:13px; }
.tl-labels { display:flex; flex-direction:column; width:44px; flex-shrink:0; }
.tl-hour-label { height:50px; display:flex; align-items:flex-start; justify-content:flex-end; padding-right:10px; font-size:10px; color:var(--muted); font-weight:500; padding-top:2px; user-select:none; }
.tl-grid { position:relative; flex:1; border-left:1px solid var(--border); }
.tl-hour-line { position:absolute; left:0; right:0; height:1px; background:var(--border); }
.tl-slot { position:absolute; left:0; right:0; height:50px; transition:background 0.12s; }
.tl-slot.drag-over-slot { background:rgba(201,106,40,0.06); }
.tl-event { position:absolute; left:5px; right:5px; border-radius:9px; padding:5px 9px; overflow:hidden; cursor:grab; transition:all 0.15s; border:1px solid transparent; z-index:2; user-select:none; }
.tl-event:hover { z-index:10; transform:scaleX(1.015); filter:brightness(0.95); }
.tl-event-name { font-size:12px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.2; }
.tl-event-time { font-size:10px; opacity:0.7; margin-top:2px; white-space:nowrap; }
.tl-event-overlap { border:1.5px dashed var(--red) !important; }
.tl-activity { background:rgba(201,106,40,0.10); border-color:rgba(201,106,40,0.22); color:#7a3a10; }
.tl-meal      { background:rgba(196,124,10,0.10); border-color:rgba(196,124,10,0.25); color:#7a4d00; }
.tl-transport { background:rgba(36,138,61,0.09);  border-color:rgba(36,138,61,0.22);  color:#145228; }
.tl-hotel     { background:rgba(110,110,115,0.09); border-color:rgba(110,110,115,0.22); color:#3a3a3c; }
.tl-note      { background:rgba(0,0,0,0.04);       border-color:rgba(0,0,0,0.08);      color:var(--muted); }
.edit-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.38); z-index:400; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(16px); animation:fadeOverlay 0.15s ease; }
.edit-modal { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl); padding:28px; width:100%; max-width:580px; max-height:92vh; overflow-y:auto; box-shadow:var(--shadow-xl); animation:slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1); }
.edit-modal h4 { font-family:'Inter',sans-serif; font-size:18px; font-weight:800; margin-bottom:20px; letter-spacing:-0.4px; color:var(--text); }
.type-tab-row { display:flex; gap:5px; margin-bottom:18px; flex-wrap:wrap; }
.type-tab { padding:5px 13px; border-radius:var(--r-sm); border:1px solid var(--border); background:transparent; color:var(--muted); font-size:12px; font-weight:500; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.15s; }
.type-tab:hover { border-color:var(--border-strong); color:var(--text-secondary); }
.type-tab.active { background:var(--accent); color:#fff; border-color:var(--accent); box-shadow:0 2px 8px rgba(201,106,40,0.28); font-weight:600; }
.view-toggle { display:flex; gap:3px; background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:3px; margin-bottom:13px; width:fit-content; }
.view-toggle-btn { padding:4px 13px; border-radius:8px; border:none; font-size:12px; font-weight:600; cursor:pointer; background:transparent; color:var(--muted); transition:all 0.15s; }
.view-toggle-btn.active { background:var(--surface); color:var(--accent); box-shadow:var(--shadow-xs); }
.overlap-warn { display:flex; align-items:center; gap:8px; padding:9px 13px; background:var(--red-soft); border:1px solid rgba(255,59,48,0.16); border-radius:9px; font-size:12px; color:var(--red); margin-bottom:11px; font-weight:500; }
.ci-list { display:flex; flex-direction:column; gap:7px; margin-top:11px; }
.ci-card { display:flex; align-items:flex-start; gap:10px; padding:11px 14px; background:var(--surface2); border:1px solid var(--border); border-radius:11px; cursor:pointer; transition:all 0.16s; user-select:none; }
.ci-card:hover { border-color:rgba(201,106,40,0.25); box-shadow:var(--shadow-xs); }
.ci-card.drag-over { border-color:var(--accent); background:var(--accent-soft); }
.ci-drag { color:var(--muted); font-size:13px; cursor:grab; padding:0 2px; flex-shrink:0; align-self:center; }
.ci-icon { font-size:16px; flex-shrink:0; margin-top:1px; }
.ci-body { flex:1; min-width:0; }
.ci-title { font-size:14px; font-weight:600; margin-bottom:1px; }
.ci-meta { font-size:12px; color:var(--muted); display:flex; gap:7px; flex-wrap:wrap; margin-top:2px; }
.ci-actions { display:flex; gap:3px; flex-shrink:0; }
.ci-btn { background:transparent; border:none; color:var(--muted); cursor:pointer; font-size:13px; padding:3px 5px; border-radius:5px; transition:color 0.15s; }
.ci-btn:hover { color:var(--accent); }
.ci-btn.del:hover { color:var(--red); }
.add-row { display:flex; gap:7px; margin-top:11px; flex-wrap:wrap; align-items:center; }
.add-input { flex:1; min-width:130px; padding:9px 13px; border-radius:10px; background:var(--surface2); border:1.5px solid var(--border); color:var(--text); font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:all 0.16s; }
.add-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(201,106,40,0.09); background:#fff; }
.add-type { padding:9px 10px; border-radius:10px; background:var(--surface2); border:1.5px solid var(--border); color:var(--text); font-family:'Inter',sans-serif; font-size:13px; }
.pill { padding:2px 8px; border-radius:5px; font-size:11px; font-weight:600; }
.pill-b { background:var(--accent-soft); color:var(--accent); border:1px solid rgba(201,106,40,0.16); }
.pill-p { background:rgba(110,110,115,0.09); color:var(--muted); border:1px solid rgba(110,110,115,0.16); }
.pill-g { background:var(--green-soft); color:var(--green); border:1px solid rgba(36,138,61,0.16); }
.pill-y { background:var(--yellow-soft); color:var(--yellow); border:1px solid rgba(196,124,10,0.16); }
.type-badge { padding:3px 9px; border-radius:var(--r-full); font-size:11px; font-weight:600; border:1px solid; display:inline-flex; align-items:center; gap:4px; }
.type-activity { background:var(--accent-soft); color:var(--accent); border-color:rgba(201,106,40,0.16); }
.type-meal     { background:var(--yellow-soft); color:var(--yellow); border-color:rgba(196,124,10,0.16); }
.type-hotel    { background:rgba(110,110,115,0.09); color:var(--muted); border-color:rgba(110,110,115,0.16); }
.type-transport{ background:var(--green-soft); color:var(--green); border-color:rgba(36,138,61,0.16); }
.type-note     { background:rgba(0,0,0,0.05); color:var(--muted); border-color:rgba(0,0,0,0.08); }
.avail-strip { display:flex; gap:5px; margin-top:8px; flex-wrap:wrap; }
.avail-chip { padding:4px 11px; border-radius:var(--r-full); font-size:12px; font-weight:500; cursor:pointer; border:1px solid var(--border); background:var(--surface2); color:var(--muted-light); transition:all 0.15s; user-select:none; }
.avail-chip.avail { background:var(--green-soft); border-color:rgba(36,138,61,0.25); color:var(--green); }
.avail-chip.unavail { background:var(--red-soft); border-color:rgba(255,59,48,0.16); color:var(--red); }
.section-hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.section-hdr h4 { font-family:'Inter',sans-serif; font-size:17px; font-weight:700; letter-spacing:-0.3px; }

/* ─── INFO PANEL ──────────────────────────────────────── */
.info-panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--shadow-sm); }
.info-panel-header { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; border-bottom:1px solid var(--border); }
.info-panel-header h4 { font-family:'Inter',sans-serif; font-size:16px; font-weight:700; letter-spacing:-0.3px; }
.info-view-grid { display:grid; grid-template-columns:1fr 1fr; }
.info-view-cell { padding:15px 24px; border-bottom:1px solid var(--border); }
.info-view-cell.full { grid-column:span 2; }
.info-view-cell:nth-child(odd):not(.full) { border-right:1px solid var(--border); }
.info-view-label { font-size:10px; color:var(--muted); letter-spacing:0.6px; font-weight:700; margin-bottom:4px; text-transform:uppercase; }
.info-view-val { font-size:14px; font-weight:500; }
.info-edit-body { padding:24px; }

/* ─── CARDS ───────────────────────────────────────────── */
.accom-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:15px; margin-top:15px; }
.accom-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:20px; transition:all 0.22s; }
.accom-card:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
.card-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:11px; }
.card-name { font-size:15px; font-weight:700; letter-spacing:-0.2px; }
.card-actions { display:flex; gap:4px; }
.card-meta { display:flex; flex-direction:column; gap:5px; }
.card-meta-row { display:flex; align-items:center; gap:7px; font-size:13px; color:var(--muted); }
.card-meta-row strong { color:var(--text-secondary); font-weight:500; }
.card-notes { margin-top:11px; font-size:13px; color:var(--muted); line-height:1.55; border-top:1px solid var(--border); padding-top:11px; }
.stars { color:#f59e0b; font-size:12px; }
.activity-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(295px,1fr)); gap:15px; margin-top:15px; }
.activity-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:20px; transition:all 0.22s; }
.activity-card:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
.activity-desc { font-size:13px; color:var(--muted); line-height:1.55; margin:6px 0 12px; }

/* ─── VOTING ──────────────────────────────────────────── */
.vote-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:22px 24px; margin-bottom:14px; box-shadow:var(--shadow-xs); }
.vote-card h4 { font-family:'Inter',sans-serif; font-size:10px; font-weight:700; margin-bottom:14px; letter-spacing:1.3px; text-transform:uppercase; color:var(--muted); padding-bottom:10px; border-bottom:1px solid var(--border); }
.vote-options { display:flex; flex-direction:column; gap:9px; }
.vote-opt { display:flex; align-items:center; justify-content:space-between; padding:11px 14px; border-radius:11px; background:var(--surface2); border:1px solid var(--border); cursor:pointer; transition:all 0.16s; }
.vote-opt:hover { border-color:rgba(201,106,40,0.25); background:rgba(201,106,40,0.02); }
.vote-opt.voted { border-color:var(--accent); background:rgba(201,106,40,0.04); }
.vbar-wrap { flex:1; margin:0 13px; }
.vbar-bg { height:4px; background:var(--surface3); border-radius:2px; overflow:hidden; }
.vbar-fill { height:100%; background:linear-gradient(90deg,var(--accent),#e8924a); border-radius:2px; transition:width 0.5s cubic-bezier(0.25,0.46,0.45,0.94); }
.vote-count { font-size:12px; color:var(--muted); min-width:44px; text-align:right; font-weight:500; }
.vote-btn { padding:4px 13px; border-radius:var(--r-full); border:1px solid var(--border); background:transparent; color:var(--muted); cursor:pointer; font-size:12px; font-weight:600; white-space:nowrap; transition:all 0.15s; }
.vote-btn.on { background:var(--accent); color:#fff; border-color:var(--accent); font-weight:600; box-shadow:0 2px 8px rgba(201,106,40,0.25); }
.act-vote-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:16px 18px; margin-bottom:9px; transition:box-shadow 0.18s; box-shadow:var(--shadow-xs); }
.act-vote-card:hover { box-shadow:var(--shadow-sm); border-color:var(--border-strong); }
.act-vote-top { display:flex; gap:12px; align-items:flex-start; }
.act-vote-emoji { font-size:20px; flex-shrink:0; margin-top:1px; }
.act-vote-info { flex:1; min-width:0; }
.act-vote-name { font-size:13.5px; font-weight:700; margin-bottom:3px; letter-spacing:-0.2px; color:var(--text); }
.act-vote-desc { font-size:12px; color:var(--muted); line-height:1.5; margin-bottom:8px; }
.act-vote-pills { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:10px; }
.act-vote-row { display:flex; align-items:center; gap:8px; border-top:1px solid var(--border); padding-top:12px; margin-top:3px; }
.vbtn-up { padding:6px 16px; border-radius:7px; border:none; background:linear-gradient(135deg,#1e7a45,#27a05c); color:#fff; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.14s; font-family:'Inter',sans-serif; box-shadow:0 2px 8px rgba(30,122,69,0.30); letter-spacing:0.1px; }
.vbtn-up:hover { box-shadow:0 4px 12px rgba(30,122,69,0.38); transform:translateY(-1px); }
.vbtn-up.on { background:linear-gradient(135deg,#166638,#1e7a45); box-shadow:0 2px 10px rgba(30,122,69,0.40); }
.vbtn-down { padding:6px 16px; border-radius:7px; border:none; background:linear-gradient(135deg,#c0392b,#d44333); color:#fff; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.14s; font-family:'Inter',sans-serif; box-shadow:0 2px 8px rgba(192,57,43,0.25); letter-spacing:0.1px; }
.vbtn-down:hover { box-shadow:0 4px 12px rgba(192,57,43,0.34); transform:translateY(-1px); }
.vbtn-down.on { background:linear-gradient(135deg,#a0281c,#c0392b); box-shadow:0 2px 10px rgba(192,57,43,0.38); }
.vote-tally { font-size:12px; color:var(--muted); margin-left:auto; font-weight:500; }

/* ─── BUDGET ──────────────────────────────────────────── */
.budget-dash { display:flex; flex-direction:column; gap:16px; }
.budget-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:22px; box-shadow:var(--shadow-xs); }
.budget-card h4 { font-family:'Inter',sans-serif; font-size:10px; font-weight:700; margin-bottom:16px; letter-spacing:1.3px; text-transform:uppercase; color:var(--muted); padding-bottom:10px; border-bottom:1px solid var(--border); }
.cat-row { display:flex; align-items:center; gap:12px; padding:8px 0; }
.cat-bar-bg { flex:1; height:4px; background:var(--surface3); border-radius:4px; overflow:hidden; }
.cat-bar-fill { height:100%; border-radius:4px; transition:width 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
.cat-icon { font-size:15px; width:22px; flex-shrink:0; text-align:center; }
.cat-label { min-width:110px; font-size:12.5px; color:var(--muted); font-weight:500; }
.cat-bar-wrap { flex:1; }
.cat-amount { min-width:60px; text-align:right; font-size:12.5px; font-weight:700; }
.budget-total-row { display:flex; justify-content:space-between; align-items:center; padding:14px 0 0; border-top:1px solid var(--border); }
.budget-total-label { font-size:15px; font-weight:700; }
.budget-total-val { font-family:'Inter',sans-serif; font-size:26px; font-weight:800; background:linear-gradient(135deg,#c96a28,#e8924a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.6px; }
.budget-status-bar { height:8px; border-radius:4px; background:var(--surface3); overflow:hidden; margin:10px 0 5px; }
.budget-status-fill { height:100%; border-radius:4px; transition:width 0.5s; }
.budget-over { color:var(--red); font-size:13px; font-weight:600; margin-top:3px; }
.budget-under { color:var(--green); font-size:13px; font-weight:600; margin-top:3px; }
.per-person-row { display:flex; justify-content:space-between; align-items:center; padding:11px 15px; background:rgba(201,106,40,0.04); border:1px solid rgba(201,106,40,0.14); border-radius:11px; margin-top:10px; }
.inline-form { background:var(--surface2); border:1px solid var(--border); border-radius:var(--r-md); padding:20px; margin-top:15px; }
.inline-form h5 { font-family:'Inter',sans-serif; font-weight:700; font-size:14px; margin-bottom:13px; color:var(--text); letter-spacing:-0.1px; }
.empty-state { text-align:center; padding:44px 24px; color:var(--muted); border:1.5px dashed var(--border); border-radius:var(--r-md); font-size:14px; }
.empty-state div { font-size:32px; margin-bottom:11px; }
.summary-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl); padding:30px; box-shadow:var(--shadow-xs); }
.summary-title { font-family:'Inter',sans-serif; font-size:26px; font-weight:800; margin-bottom:5px; letter-spacing:-0.6px; }
.summary-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px; }
.summary-item { background:var(--surface2); border:1px solid var(--border); border-radius:var(--r-md); padding:18px; }
.summary-item label { font-size:10px; color:var(--muted); font-weight:700; letter-spacing:0.6px; margin-bottom:6px; display:block; text-transform:uppercase; }
.summary-item .val { font-size:16px; font-weight:700; letter-spacing:-0.2px; }
.tag-wrap { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.tag { padding:3px 10px; border-radius:var(--r-full); font-size:12px; font-weight:500; background:var(--accent-soft); border:1px solid rgba(201,106,40,0.16); color:var(--accent); }
.tag-b { background:rgba(201,106,40,0.06); border-color:rgba(201,106,40,0.13); color:var(--accent); }
.country-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:26px; box-shadow:var(--shadow-sm); }
.info-row { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); align-items:flex-start; }
.info-row:last-child { border-bottom:none; }
.info-icon { font-size:18px; width:28px; flex-shrink:0; }
.info-lbl { font-size:10px; color:var(--muted); font-weight:700; letter-spacing:0.6px; text-transform:uppercase; }
.info-txt { font-size:14px; margin-top:2px; }
.invite-box { background:var(--surface2); border:1px solid var(--border); border-radius:13px; padding:13px 17px; display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:13px; }
.invite-link { font-family:'Inter',monospace; font-size:12px; color:var(--accent); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.members-tab { display:flex; flex-direction:column; gap:10px; }
.member-row { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); transition:all 0.16s; }
.member-row:hover { box-shadow:var(--shadow-sm); transform:translateY(-1px); }
.member-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#2a527a,#3a72aa); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:#fff; flex-shrink:0; box-shadow:0 2px 8px rgba(42,82,122,0.28); }
.member-avatar.owner { background:linear-gradient(135deg,#c96a28,#e8924a); box-shadow:0 2px 8px rgba(201,106,40,0.30); }
.member-avatar.viewer { background:linear-gradient(135deg,#6a8a6a,#4a6a4a); box-shadow:0 2px 6px rgba(74,106,74,0.22); }
.role-admin { background:linear-gradient(135deg,rgba(201,106,40,0.12),rgba(232,146,74,0.08)); color:var(--accent); border:1px solid rgba(201,106,40,0.22); padding:3px 9px; border-radius:5px; font-size:10.5px; font-weight:700; letter-spacing:0.3px; }
.role-editor { background:linear-gradient(135deg,rgba(42,82,122,0.10),rgba(58,114,170,0.07)); color:#2a527a; border:1px solid rgba(42,82,122,0.20); padding:3px 9px; border-radius:5px; font-size:10.5px; font-weight:700; letter-spacing:0.3px; }
.role-viewer { background:var(--surface2); color:var(--muted); border:1px solid var(--border); padding:3px 9px; border-radius:5px; font-size:10.5px; font-weight:600; letter-spacing:0.2px; }
.member-info { flex:1; min-width:0; }
.member-name { font-weight:600; font-size:14px; letter-spacing:-0.1px; }
.member-meta { font-size:12px; color:var(--muted); margin-top:1px; }
.role-badge { padding:3px 10px; border-radius:var(--r-full); font-size:11px; font-weight:600; border:1px solid; flex-shrink:0; }
.role-owner  { background:var(--yellow-soft); color:var(--yellow); border-color:rgba(196,124,10,0.20); }
.role-editor { background:var(--accent-soft); color:var(--accent); border-color:rgba(201,106,40,0.16); }
.role-viewer { background:rgba(110,110,115,0.08); color:var(--muted); border-color:rgba(110,110,115,0.16); }
.invite-panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:20px; margin-top:15px; }
.invite-panel h5 { font-family:'Inter',sans-serif; font-size:13px; font-weight:700; margin-bottom:12px; color:var(--text); letter-spacing:-0.1px; }
.pending-invite { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--surface2); border-radius:9px; border:1px solid var(--border); margin-top:7px; font-size:13px; }
.pending-dot { width:7px; height:7px; border-radius:50%; background:var(--yellow); display:inline-block; margin-right:6px; }
.suggested-by { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--muted); margin-top:4px; }
.sugg-avatar { width:16px; height:16px; border-radius:50%; background:linear-gradient(135deg,var(--accent),#e8924a); display:inline-flex; align-items:center; justify-content:center; font-size:8px; font-weight:700; color:#fff; flex-shrink:0; }
.flex-between { display:flex; justify-content:space-between; align-items:center; }
.mt-2{margin-top:8px} .mt-4{margin-top:16px} .mt-6{margin-top:24px}
.text-muted{color:var(--muted);font-size:14px} .text-sm{font-size:13px}
.sdp-wrap { position:relative; width:100%; }
.sdp-trigger { width:100%; padding:10px 14px; border-radius:var(--r-sm); background:var(--surface2); border:1.5px solid var(--border); color:var(--text); font-family:'Inter',sans-serif; font-size:14px; cursor:pointer; text-align:left; display:flex; align-items:center; justify-content:space-between; transition:all 0.16s; }
.sdp-trigger:hover { border-color:var(--border-strong); }
.sdp-popup { position:absolute; top:calc(100% + 6px); left:0; z-index:500; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); box-shadow:var(--shadow-lg); overflow:hidden; min-width:295px; }
.time-picker { display:flex; gap:5px; align-items:center; }
.tp-input { width:50px; padding:9px 5px; border-radius:9px; background:var(--surface2); border:1.5px solid var(--border); color:var(--text); font-family:'Inter',sans-serif; font-size:14px; outline:none; text-align:center; transition:all 0.16s; }
.tp-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(201,106,40,0.09); }
.tp-sep { color:var(--muted); font-weight:700; font-size:14px; flex-shrink:0; }
.ampm-toggle { display:flex; border-radius:9px; overflow:hidden; border:1.5px solid var(--border); flex-shrink:0; }
.ampm-btn { padding:7px 10px; background:transparent; border:none; color:var(--muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.15s; }
.ampm-btn.active { background:var(--accent); color:#fff; }
.sched-legend { display:flex; gap:13px; align-items:center; flex-wrap:wrap; font-size:12px; color:var(--muted); font-weight:500; }

/* ─── NOTIFICATIONS / INVITE ──────────────────────────── */
.notif-badge { position:absolute; top:-4px; right:-4px; width:16px; height:16px; border-radius:50%; background:var(--red); color:#fff; font-size:9px; font-weight:700; display:flex; align-items:center; justify-content:center; border:2px solid var(--bg); pointer-events:none; }
.notif-tab-wrap { position:relative; display:inline-block; }
.join-request-card { display:flex; align-items:center; gap:12px; padding:14px 17px; background:linear-gradient(135deg,rgba(201,106,40,0.04),rgba(52,170,220,0.03)); border:1px solid rgba(201,106,40,0.18); border-radius:var(--r-md); margin-bottom:10px; }
.join-request-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#6e6e73,#8e8e93); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; color:#fff; flex-shrink:0; }
.join-request-info { flex:1; min-width:0; }
.join-request-name { font-size:14px; font-weight:600; letter-spacing:-0.1px; }
.join-request-meta { font-size:12px; color:var(--muted); margin-top:2px; }
.join-request-actions { display:flex; gap:7px; flex-shrink:0; }
.invite-sent-row { display:flex; align-items:center; justify-content:space-between; padding:9px 13px; background:var(--surface2); border:1px solid var(--border); border-radius:10px; margin-top:7px; }
.invite-sent-email { font-size:13px; color:var(--text-secondary); display:flex; align-items:center; gap:7px; }
.invite-sent-status { font-size:11px; font-weight:600; padding:2px 8px; border-radius:var(--r-full); }
.invite-status-pending { background:var(--yellow-soft); color:var(--yellow); }
.invite-status-joined { background:var(--green-soft); color:var(--green); }
.join-banner { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:calc(100vh - 58px); text-align:center; padding:60px 24px; gap:20px; }
.join-banner-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl); padding:48px 40px; max-width:420px; width:100%; box-shadow:var(--shadow-lg); }
.join-banner-card h2 { font-family:'Inter',sans-serif; font-size:24px; font-weight:800; letter-spacing:-0.5px; margin-bottom:10px; }
.join-banner-card p { font-size:15px; color:var(--muted); line-height:1.6; margin-bottom:28px; }
@media(max-width:768px){
  .features,.summary-grid,.form-row{grid-template-columns:1fr}
  .nav{padding:0 20px} .nav-tabs{display:none}
  .dashboard,.trip-detail{padding:20px}
  .accom-grid,.activity-grid{grid-template-columns:1fr}
  .sched-layout{grid-template-columns:1fr}
  .sched-mini-cal{position:static}
}`

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_ABR = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const TL_START_HR = 6, TL_END_HR = 23, TL_HOURS = 17, PX_PER_HR = 50;

const TYPE_META = {
  activity:  { icon:"🎯", label:"Activity",  color:"#38bdf8", tlClass:"tl-activity" },
  meal:      { icon:"🍽️", label:"Meal",       color:"#fbbf24", tlClass:"tl-meal" },
  transport: { icon:"🚌", label:"Transport",  color:"#34d399", tlClass:"tl-transport" },
  hotel:     { icon:"🏨", label:"Check In/Out", color:"#4a6fa5", tlClass:"tl-hotel" },
  note:      { icon:"📝", label:"Note",       color:"#6b7fa3", tlClass:"tl-note" },
};

let _id = 500;
const uid = () => ++_id;

function toYMD(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function fromYMD(s) { if(!s)return null; const[y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function fmtDate(s) { if(!s)return""; try { const d=s.includes("T")?new Date(s):fromYMD(s); if(!d||isNaN(d.getTime()))return""; return `${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`; } catch(e){return"";} }
function fmtRange(s,e) {
  if(!s)return"No dates set"; if(!e)return fmtDate(s);
  const sd=fromYMD(s),ed=fromYMD(e);
  if(sd.getFullYear()===ed.getFullYear()&&sd.getMonth()===ed.getMonth())
    return `${MONTHS[sd.getMonth()].slice(0,3)} ${sd.getDate()}–${ed.getDate()}, ${sd.getFullYear()}`;
  return `${fmtDate(s)} – ${fmtDate(e)}`;
}
function nightsBetween(s,e) { if(!s||!e)return 0; return Math.round((fromYMD(e)-fromYMD(s))/86400000); }
function renderStars(r) { const n=Math.min(Math.round(Number(r)||0),5); return "★".repeat(n)+"☆".repeat(5-n); }
function buildTripDays(s,e) {
  if(!s||!e)return[];
  const days=[];let cur=fromYMD(s);const end=fromYMD(e);
  while(cur<=end){days.push(toYMD(cur));cur=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()+1);}
  return days;
}
function buildMonthCells(y,m) {
  const first=new Date(y,m,1).getDay(),total=new Date(y,m+1,0).getDate();
  const arr=Array(first).fill(null);
  for(let d=1;d<=total;d++)arr.push(new Date(y,m,d));
  return arr;
}
function timeStrToMin(s) { if(!s)return null; const[h,m]=s.split(":").map(Number); return h*60+(m||0); }
function minToTimeStr(m) { if(m==null)return""; const h=Math.floor(m/60)%24,mn=m%60; return `${String(h).padStart(2,"0")}:${String(mn).padStart(2,"0")}`; }
function fmtTime(s) {
  if(!s)return""; const[h,m]=s.split(":").map(Number);
  return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;
}
function tlTopPx(startMin) { return ((startMin-TL_START_HR*60)/60)*PX_PER_HR; }
function tlHeightPx(durMin) { return Math.max((durMin/60)*PX_PER_HR,22); }
function detectOverlaps(events) {
  const s=new Set();
  for(let i=0;i<events.length;i++) for(let j=i+1;j<events.length;j++){
    const a=events[i],b=events[j];
    if(a.startMin==null||b.startMin==null)continue;
    const ae=a.startMin+(a.durationMin||30),be=b.startMin+(b.durationMin||30);
    if(a.startMin<be&&ae>b.startMin){s.add(a.id);s.add(b.id);}
  }
  return s;
}

// ─── TIME PICKER ───────────────────────────────────────────────────────────────
function TimePicker({ value, onChange }) {
  const parse = v => {
    if(!v) return {h:"",m:"00",ampm:"AM"};
    const [hh,mm] = v.split(":").map(Number);
    return {h:String(hh%12||12), m:String(mm).padStart(2,"0"), ampm:hh>=12?"PM":"AM"};
  };
  const [st, setSt] = useState(() => parse(value));
  useMemo(() => setSt(parse(value)), [value]);
  const emit = next => {
    setSt(next);
    const hNum = parseInt(next.h,10);
    if(!next.h||isNaN(hNum)){onChange("");return;}
    let h24 = hNum%12; if(next.ampm==="PM") h24+=12;
    onChange(`${String(h24).padStart(2,"0")}:${next.m||"00"}`);
  };
  return (
    <div className="time-picker">
      <input className="tp-input" type="number" min={1} max={12} placeholder="12" value={st.h}
        onChange={e=>emit({...st,h:e.target.value})}
        onBlur={e=>{let v=parseInt(e.target.value,10);if(isNaN(v))return;emit({...st,h:String(Math.max(1,Math.min(12,v)))});}}/>
      <span className="tp-sep">:</span>
      <input className="tp-input" type="number" min={0} max={59} placeholder="00" value={st.m}
        onChange={e=>emit({...st,m:e.target.value})}
        onBlur={e=>{let v=parseInt(e.target.value,10);if(isNaN(v))v=0;emit({...st,m:String(Math.max(0,Math.min(59,v))).padStart(2,"0")});}}/>
      <div className="ampm-toggle">
        <button type="button" className={`ampm-btn ${st.ampm==="AM"?"active":""}`} onClick={()=>emit({...st,ampm:"AM"})}>AM</button>
        <button type="button" className={`ampm-btn ${st.ampm==="PM"?"active":""}`} onClick={()=>emit({...st,ampm:"PM"})}>PM</button>
      </div>
    </div>
  );
}

// ─── DATE PICKER ───────────────────────────────────────────────────────────────
function DatePicker({startDate,endDate,onChange,singleMode=false,minDateOverride,maxDateOverride}) {
  const today=new Date(); today.setHours(0,0,0,0);
  const init=startDate?fromYMD(startDate):new Date();
  const [view,setView] = useState({y:init.getFullYear(),m:init.getMonth()});
  const [hover,setHover] = useState(null);
  const prev=()=>setView(v=>v.m===0?{y:v.y-1,m:11}:{y:v.y,m:v.m-1});
  const next=()=>setView(v=>v.m===11?{y:v.y+1,m:0}:{y:v.y,m:v.m+1});
  const cells=useMemo(()=>{
    const first=new Date(view.y,view.m,1).getDay(),total=new Date(view.y,view.m+1,0).getDate();
    const arr=Array(first).fill(null);
    for(let d=1;d<=total;d++) arr.push(new Date(view.y,view.m,d));
    return arr;
  },[view]);
  const click=d=>{
    const ymd=toYMD(d);
    if(singleMode){onChange(ymd,null);return;}
    if(!startDate||(startDate&&endDate)){onChange(ymd,null);return;}
    if(ymd<startDate) onChange(ymd,startDate); else onChange(startDate,ymd);
  };
  const inRange=d=>{
    if(!d||!startDate||singleMode)return false;
    const ymd=toYMD(d),eff=hover||endDate;
    if(!eff)return false;
    const lo=startDate<eff?startDate:eff,hi=startDate<eff?eff:startDate;
    return ymd>lo&&ymd<hi;
  };
  const nights=nightsBetween(startDate,endDate);
  return (
    <div className="datepicker-wrap">
      <div className="dp-top">
        <button className="dp-nav" onClick={prev}>‹</button>
        <span>{MONTHS[view.m]} {view.y}</span>
        <button className="dp-nav" onClick={next}>›</button>
      </div>
      <div className="dp-body">
        <div className="dp-hdrs">{DAYS_ABR.map(d=><div key={d} className="dp-hdr">{d}</div>)}</div>
        <div className="dp-grid">
          {cells.map((d,i)=>{
            if(!d) return <div key={`e${i}`} className="dp-cell dp-empty"/>;
            const ymd=toYMD(d),past=d<today;
            const outOfRange=(minDateOverride&&ymd<minDateOverride)||(maxDateOverride&&ymd>maxDateOverride);
            const isS=ymd===startDate,isE=!singleMode&&ymd===endDate,isIn=inRange(d);
            let cls="dp-cell";
            if(past||outOfRange) cls+=" dp-past";
            else { if(isS) cls+=" dp-start"; if(isE) cls+=" dp-end"; if(isIn) cls+=" dp-in-range"; }
            return <div key={ymd} className={cls}
              onClick={()=>!(past||outOfRange)&&click(d)}
              onMouseEnter={()=>!singleMode&&startDate&&!endDate&&setHover(ymd)}
              onMouseLeave={()=>setHover(null)}
            >{d.getDate()}</div>;
          })}
        </div>
      </div>
      {!singleMode && (
        <div className="dp-footer">
          <span className="dp-footer-label">
            {startDate&&endDate?<><strong>{fmtRange(startDate,endDate)}</strong> · {nights} night{nights!==1?"s":""}</>
            :startDate?<><strong>{fmtDate(startDate)}</strong> → pick end</>:"Click a day to start"}
          </span>
          {(startDate||endDate)&&<button className="btn btn-ghost btn-sm" onClick={()=>onChange(null,null)}>Clear</button>}
        </div>
      )}
    </div>
  );
}

function SingleDatePicker({value,onChange,minDate,maxDate,placeholder,hasErr}) {
  const [open,setOpen] = useState(false);
  return (
    <div className="sdp-wrap">
      <button type="button" className={`sdp-trigger${hasErr?" err":""}`} onClick={()=>setOpen(o=>!o)}>
        <span>{value?fmtDate(value):(placeholder||"Select date")}</span>
        <span style={{fontSize:14}}>📅</span>
      </button>
      {open && (
        <div className="sdp-popup" onClick={e=>e.stopPropagation()}>
          <DatePicker startDate={value||null} endDate={null}
            onChange={s=>{onChange(s);setOpen(false);}} singleMode={true}
            minDateOverride={minDate} maxDateOverride={maxDate}/>
        </div>
      )}
    </div>
  );
}

// ─── UNIVERSAL EDIT MODAL ──────────────────────────────────────────────────────
function UniversalEditModal({ item, trip, setTrip, onClose, db }) {
  const tripDays = useMemo(()=>buildTripDays(trip.startDate,trip.endDate),[trip]);
  const [form, setForm] = useState({
    type:        item.type,
    title:       item.title,
    day:         item.day || "",
    startTime:   item.startTime || "",
    durationMin: String(item.durationMin || 30),
    location:    item.location || "",
    price:       item.price ? String(item.price) : "",
    priceType:   item.priceType || "flat",
    description: item.metadata?.description || "",
    notes:       item.metadata?.notes || "",
    checkIn:     item.metadata?.checkIn || "",
    checkOut:    item.metadata?.checkOut || "",
    transportationTime: String(item.metadata?.transportationTime || ""),
    travelTimeFromPrev: String(item.metadata?.travelTimeFromPrev || ""),
  });
  const [errs, setErrs] = useState({});

  const F = (k, ta) => ({
    value: form[k],
    onChange: e => setForm(f=>({...f,[k]:e.target.value})),
    className: `form-input${ta?" form-textarea":""}${errs[k]?" err":""}`,
  });

  const validate = () => {
    const e = {};
    if(!form.title.trim()) e.title="Title is required";
    if(form.price&&isNaN(+form.price)) e.price="Must be numeric";
    if(form.durationMin&&isNaN(+form.durationMin)) e.durationMin="Must be numeric";
    setErrs(e); return !Object.keys(e).length;
  };

  const save = () => {
    if(!validate()) return;
    const startMin = timeStrToMin(form.startTime) ?? null;
    const durMin = Math.max(+form.durationMin||30, 5);
    const updated = {
      ...item,
      type: form.type, title: form.title.trim(),
      day: form.day||null, startTime: form.startTime||null,
      startMin, durationMin: durMin,
      location: form.location, price: form.price?+form.price:0,
      priceType: form.priceType,
      metadata: {
        ...item.metadata,
        description: form.description, notes: form.notes,
        checkIn: form.checkIn||null, checkOut: form.checkOut||null,
        transportationTime: form.transportationTime?+form.transportationTime:"",
        travelTimeFromPrev: form.travelTimeFromPrev?+form.travelTimeFromPrev:0,
      }
    };
    if(db) db.updateItem(updated);
    setTrip(t=>({
      ...t,
      calendarItems: t.calendarItems.map(ci => ci.id!==item.id ? ci : updated)
    }));
    onClose();
  };

  const tm = TYPE_META[form.type];

  return (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h4>{tm.icon} Edit {tm.label}</h4>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="type-tab-row">
          {Object.entries(TYPE_META).map(([k,v])=>(
            <button key={k} className={`type-tab ${form.type===k?"active":""}`}
              onClick={()=>setForm(f=>({...f,type:k}))}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input {...F("title")} placeholder="e.g. Snorkeling at Reef"/>
          {errs.title&&<div className="err-msg">{errs.title}</div>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Day</label>
            <select {...F("day")} className="form-input">
              <option value="">— Unscheduled —</option>
              {tripDays.map((ymd,i)=>{
                const d=fromYMD(ymd);
                const dow=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
                return <option key={ymd} value={ymd}>Day {i+1} · {dow} {MONTHS[d.getMonth()].slice(0,3)} {d.getDate()}</option>;
              })}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Repeat for # of days</label>
            <input className="form-input" type="number" min="1" max="30"
              value={form.repeatDays}
              onChange={e=>setForm(f=>({...f,repeatDays:e.target.value}))}
              placeholder="1"/>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Set to 2+ to add this activity on consecutive days starting from the selected day above</div>
          </div>
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <TimePicker value={form.startTime} onChange={v=>setForm(f=>({...f,startTime:v}))}/>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input {...F("durationMin")} placeholder="e.g. 90"/>
            {errs.durationMin&&<div className="err-msg">{errs.durationMin}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Price (USD)</label>
            <input {...F("price")} placeholder="e.g. 45"/>
            {errs.price&&<div className="err-msg">{errs.price}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Price Type</label>
            <div style={{display:"flex",gap:6,marginTop:2}}>
              <button type="button"
                className={`type-tab ${form.priceType==="flat"?"active":""}`}
                onClick={()=>setForm(f=>({...f,priceType:"flat"}))}>
                👥 Whole Group
              </button>
              <button type="button"
                className={`type-tab ${form.priceType==="per_person"?"active":""}`}
                onClick={()=>setForm(f=>({...f,priceType:"per_person"}))}>
                🧍 Per Person
              </button>
            </div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:5}}>
              {form.priceType==="per_person"
                ? `Price will be multiplied by the number of members in the trip.`
                : `Price is a single flat cost split equally across all members.`}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input {...F("location")} placeholder="e.g. Cancun, Mexico"/>
        </div>
        {form.type==="hotel" && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Check-In</label>
              <SingleDatePicker value={form.checkIn||null} onChange={v=>setForm(f=>({...f,checkIn:v||""}))}
                minDate={trip.startDate||null} maxDate={trip.endDate||null} placeholder="Check-in"/>
            </div>
            <div className="form-group">
              <label className="form-label">Check-Out</label>
              <SingleDatePicker value={form.checkOut||null} onChange={v=>setForm(f=>({...f,checkOut:v||""}))}
                minDate={form.checkIn||null} maxDate={trip.endDate||null} placeholder="Check-out"/>
            </div>
          </div>
        )}
        {(form.type==="activity"||form.type==="meal") && (
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea {...F("description",true)} placeholder="Details…"/>
          </div>
        )}
        {form.type==="transport" && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Transport Time (min)</label>
              <input {...F("transportationTime")} placeholder="e.g. 45"/>
            </div>
            <div className="form-group">
              <label className="form-label">Travel from Prev (min)</label>
              <input {...F("travelTimeFromPrev")} placeholder="e.g. 15"/>
            </div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea {...F("notes",true)} placeholder="Any extra notes…"/>
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── MINI CAL ─────────────────────────────────────────────────────────────────
function MiniCal({startDate,endDate,activeDay,onSelectDay}) {
  const init=startDate?fromYMD(startDate):new Date();
  const [view,setView] = useState({y:init.getFullYear(),m:init.getMonth()});
  useMemo(()=>{if(startDate){const d=fromYMD(startDate);setView({y:d.getFullYear(),m:d.getMonth()});}},[startDate]);
  const cells=useMemo(()=>buildMonthCells(view.y,view.m),[view]);
  const today=toYMD(new Date());
  const classFor=d=>{
    if(!d) return "smc-cell smc-empty";
    const ymd=toYMD(d); let cls="smc-cell";
    if(ymd===today) cls+=" smc-today";
    if(startDate&&endDate){
      if(ymd===startDate) cls+=" smc-trip-start";
      else if(ymd===endDate) cls+=" smc-trip-end";
      else if(ymd>startDate&&ymd<endDate) cls+=" smc-trip";
    }
    if(ymd===activeDay) cls+=" smc-active";
    return cls;
  };
  const prev=()=>setView(v=>v.m===0?{y:v.y-1,m:11}:{y:v.y,m:v.m-1});
  const next=()=>setView(v=>v.m===11?{y:v.y+1,m:0}:{y:v.y,m:v.m+1});
  return (
    <div className="sched-mini-cal">
      <div className="smc-header">
        <button className="smc-nav" onClick={prev}>‹</button>
        <span>{MONTHS[view.m]} {view.y}</span>
        <button className="smc-nav" onClick={next}>›</button>
      </div>
      <div className="smc-body">
        <div className="smc-day-hdrs">{DAYS_ABR.map(d=><div key={d} className="smc-day-hdr">{d}</div>)}</div>
        <div className="smc-grid">
          {cells.map((d,i)=>{
            if(!d) return <div key={`e${i}`} className="smc-cell smc-empty"/>;
            const ymd=toYMD(d);
            const inTrip=startDate&&endDate&&ymd>=startDate&&ymd<=endDate;
            return <div key={ymd} className={classFor(d)}
              onClick={()=>inTrip&&onSelectDay(ymd)}
              style={inTrip?{cursor:"pointer"}:{}}
            >{d.getDate()}</div>;
          })}
        </div>
        {startDate&&endDate&&(
          <div style={{marginTop:10,fontSize:11,color:"var(--muted)",lineHeight:1.5}}>
            {fmtRange(startDate,endDate)}<br/>{nightsBetween(startDate,endDate)} nights
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DAY BLOCK ────────────────────────────────────────────────────────────────
function DayBlock({dayYMD,dayNum,totalDays,trip,setTrip,isOpen,onToggleOpen,onEditItem,db}) {
  const d=fromYMD(dayYMD);
  const todayYMD=toYMD(new Date());
  const isToday=dayYMD===todayYMD;

  const dayItems=useMemo(()=>
    (trip.calendarItems||[]).filter(ci=>ci.day===dayYMD)
      .sort((a,b)=>(a.startMin??9999)-(b.startMin??9999)),
    [trip.calendarItems,dayYMD]
  );

  const dayAvail=(trip.availability||{})[dayYMD]||{};
  const toggleAvail=member=>setTrip(t=>{
    const cur=((t.availability||{})[dayYMD]||{})[member]??"avail";
    return {...t,availability:{...(t.availability||{}),[dayYMD]:{...((t.availability||{})[dayYMD]||{}),[member]:cur==="avail"?"unavail":"avail"}}};
  });

  const [dayDragOver,setDayDragOver] = useState(false);
  const [slotDragOver,setSlotDragOver] = useState(null);
  const [listDragOverId,setListDragOverId] = useState(null);
  const [viewMode,setViewMode] = useState("timeline");
  const [newTitle,setNewTitle] = useState("");
  const [newType,setNewType] = useState("activity");
  const [newTime,setNewTime] = useState("");

  const dayOfWeek=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];
  const dateLabel=`${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const removeItem=id=>{ if(db) db.deleteItem(id); setTrip(t=>({...t,calendarItems:t.calendarItems.filter(ci=>ci.id!==id)})); };

  const addItem=async ()=>{
    if(!newTitle.trim()) return;
    const startMin=timeStrToMin(newTime)??null;
    const newItem={
      id:uid(),type:newType,title:newTitle.trim(),day:dayYMD,
      startTime:newTime||null,startMin,durationMin:60,
      location:"",price:0,priceType:"flat",metadata:{notes:"",description:"",upvotes:[],downvotes:[],createdBy:trip.tripMembers?.[0]?.userId||""}
    };
    const saved = db ? await db.addItem(trip.id, newItem) : newItem;
    setTrip(t=>({...t,calendarItems:[...t.calendarItems,saved]}));
    setNewTitle(""); setNewTime("");
  };

  const handleDayDragOver=e=>{e.preventDefault();setDayDragOver(true);};
  const handleDayDragLeave=()=>setDayDragOver(false);
  const handleDayDrop=e=>{
    e.preventDefault();setDayDragOver(false);setSlotDragOver(null);
    const id=e.dataTransfer.getData("ciId");
    if(!id) return;
    const ci=trip.calendarItems.find(c=>c.id===id);
    if(!ci) return;
    if(ci.day!==dayYMD) {
      supabase.from("activities")
        .update({ scheduled_date: dayYMD })
        .eq("id", id)
        .then(({error}) => { if(error) console.error("handleDayDrop:", error.message); });
    }
    setTrip(t=>({...t,calendarItems:t.calendarItems.map(c=>c.id!==id?c:{...c,day:dayYMD})}));
  };

  const handleSlotDragOver=(e,hour)=>{e.preventDefault();e.stopPropagation();setSlotDragOver(hour);};
  const handleSlotDragLeave=()=>setSlotDragOver(null);
  const handleSlotDrop=(e,hour)=>{
    e.preventDefault();e.stopPropagation();setSlotDragOver(null);
    const id=e.dataTransfer.getData("ciId");
    if(!id) return;
    const newStartMin=hour*60;
    const newTime=minToTimeStr(newStartMin);
    const ci=trip.calendarItems.find(c=>c.id===id);
    if(!ci) return;
    supabase.from("activities")
      .update({ scheduled_date: dayYMD, scheduled_time: newTime })
      .eq("id", id)
      .then(({error}) => { if(error) console.error("handleSlotDrop:", error.message); });
    setTrip(t=>({...t,calendarItems:t.calendarItems.map(c=>c.id!==id?c:{...c,day:dayYMD,startMin:newStartMin,startTime:newTime})}));
  };

  const timed=dayItems.filter(c=>c.startMin!=null);
  const overlaps=detectOverlaps(timed);
  const hasOverlaps=overlaps.size>0;
  const TI=k=>TYPE_META[k]?.icon||"📌";

  return (
    <div className={`day-block ${isOpen?"active-day":""} ${dayDragOver?"drag-over-day":""}`}
      onDragOver={handleDayDragOver} onDragLeave={handleDayDragLeave} onDrop={handleDayDrop}>
      <div className="day-block-header" onClick={onToggleOpen}>
        <div className="day-label">
          <div className={`day-num ${isToday?"is-today":""}`}>{dayNum}</div>
          <div>
            <div className="day-title">{dayOfWeek} · {dateLabel}</div>
            <div className="day-sub">Day {dayNum} of {totalDays}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {dayItems.length>0&&<span className="day-count-badge">{dayItems.length} item{dayItems.length!==1?"s":""}</span>}
          <span style={{color:"var(--muted)",fontSize:13,display:"inline-block",transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.2s"}}>›</span>
        </div>
      </div>

      {isOpen && (
        <div className="day-body">
          <div style={{marginBottom:14}}>
            <span style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600}}>Availability</span>
            <div className="avail-strip">
              {trip.members.map(m=>{
                const s=dayAvail[m]??"avail";
                return <span key={m} className={`avail-chip ${s}`} onClick={()=>toggleAvail(m)}>{m} {s==="avail"?"✓":"✗"}</span>;
              })}
            </div>
          </div>

          {hasOverlaps && <div className="overlap-warn">⚠️ Some events overlap — check the timeline for conflicts.</div>}

          {dayItems.length>0 && (
            <div className="view-toggle">
              <button className={`view-toggle-btn ${viewMode==="timeline"?"active":""}`} onClick={()=>setViewMode("timeline")}>⏱ Timeline</button>
              <button className={`view-toggle-btn ${viewMode==="list"?"active":""}`} onClick={()=>setViewMode("list")}>☰ List</button>
            </div>
          )}

          {/* TIMELINE */}
          {viewMode==="timeline" && dayItems.length>0 && (() => {
            const untimed=dayItems.filter(c=>c.startMin==null&&c.type!=="note");
            const timed=dayItems.filter(c=>c.startMin!=null);
            return (
              <div>
                {untimed.length>0 && (
                  <div style={{marginBottom:12}}>
                    <span style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600,display:"block",marginBottom:6}}>No time set</span>
                    {untimed.map(ci=>(
                      <div key={ci.id} className="ci-card"
                        draggable onDragStart={e=>{e.dataTransfer.setData("ciId",String(ci.id));e.dataTransfer.effectAllowed="move";}}
                        onClick={()=>onEditItem(ci)}>
                        <span className="ci-drag">⠿</span>
                        <span className="ci-icon">{TI(ci.type)}</span>
                        <div className="ci-body">
                          <div className="ci-title">{ci.title}</div>
                          {ci.location&&<div style={{fontSize:11,color:"var(--muted)"}}>📍 {ci.location}</div>}
                        </div>
                        <div className="ci-actions">
                          <button className="ci-btn" onClick={e=>{e.stopPropagation();onEditItem(ci);}}>✏️</button>
                          <button className="ci-btn del" onClick={e=>{e.stopPropagation();removeItem(ci.id);}}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {timed.length>0 && (
                  <div className="tl-wrap">
                    <div className="tl-labels">
                      {Array.from({length:TL_HOURS+1},(_,i)=>(
                        <div key={i} className="tl-hour-label">{String(TL_START_HR+i).padStart(2,"0")}:00</div>
                      ))}
                    </div>
                    <div className="tl-grid" style={{height:TL_HOURS*PX_PER_HR}}>
                      {Array.from({length:TL_HOURS+1},(_,i)=>(
                        <div key={i} className="tl-hour-line" style={{top:i*PX_PER_HR}}/>
                      ))}
                      {Array.from({length:TL_HOURS},(_,i)=>{
                        const hour=TL_START_HR+i;
                        return (
                          <div key={`slot-${hour}`} className={`tl-slot ${slotDragOver===hour?"drag-over-slot":""}`}
                            style={{top:i*PX_PER_HR}}
                            onDragOver={e=>handleSlotDragOver(e,hour)}
                            onDragLeave={handleSlotDragLeave}
                            onDrop={e=>handleSlotDrop(e,hour)}/>
                        );
                      })}
                      {timed.map(ci=>{
                        const top=tlTopPx(ci.startMin);
                        const height=tlHeightPx(ci.durationMin||30);
                        const endMin=ci.startMin+(ci.durationMin||30);
                        const isOverlap=overlaps.has(ci.id);
                        if(ci.startMin<TL_START_HR*60||ci.startMin>=TL_END_HR*60) return null;
                        return (
                          <div key={ci.id}
                            className={`tl-event ${TYPE_META[ci.type]?.tlClass||"tl-activity"} ${isOverlap?"tl-event-overlap":""}`}
                            draggable
                            onDragStart={e=>{e.dataTransfer.setData("ciId",String(ci.id));e.dataTransfer.effectAllowed="move";e.stopPropagation();}}
                            onClick={e=>{e.stopPropagation();onEditItem(ci);}}
                            style={{top,height}}
                            title={`Click to edit · ${ci.title}\n${minToTimeStr(ci.startMin)}–${minToTimeStr(endMin)}${isOverlap?" ⚠️ Overlaps":""}`}
                          >
                            {isOverlap&&<span style={{position:"absolute",top:3,right:5,fontSize:9}}>⚠️</span>}
                            <div className="tl-event-name">{TI(ci.type)} {ci.title}</div>
                            <div className="tl-event-time">{minToTimeStr(ci.startMin)} – {minToTimeStr(endMin)}</div>
                            {height>46&&ci.location&&<div style={{fontSize:10,opacity:0.7,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📍 {ci.location}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {dayItems.filter(c=>c.type==="note").map(ci=>(
                  <div key={ci.id} className="ci-card" style={{marginTop:6}} onClick={()=>onEditItem(ci)}>
                    <span className="ci-icon">📝</span>
                    <div className="ci-body"><div className="ci-title">{ci.title}</div></div>
                    <div className="ci-actions">
                      <button className="ci-btn" onClick={e=>{e.stopPropagation();onEditItem(ci);}}>✏️</button>
                      <button className="ci-btn del" onClick={e=>{e.stopPropagation();removeItem(ci.id);}}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* LIST */}
          {(viewMode==="list"||dayItems.length===0) && (
            <div>
              {dayItems.length===0&&<div style={{fontSize:13,color:"var(--muted)",padding:"6px 0 10px",fontStyle:"italic"}}>Nothing planned yet.</div>}
              <div className="ci-list">
                {dayItems.map(ci=>(
                  <div key={ci.id} className={`ci-card ${listDragOverId===ci.id?"drag-over":""}`}
                    draggable
                    onDragStart={e=>{e.dataTransfer.setData("ciId",String(ci.id));e.dataTransfer.effectAllowed="move";}}
                    onDragOver={e=>{e.preventDefault();setListDragOverId(ci.id);}}
                    onDragLeave={()=>setListDragOverId(null)}
                    onDrop={e=>{e.preventDefault();setListDragOverId(null);const srcId=e.dataTransfer.getData("ciId");if(srcId&&srcId!==ci.id){setTrip(t=>{const src=t.calendarItems.find(c=>c.id===srcId);if(src&&db)db.updateItem({...src,day:dayYMD});return{...t,calendarItems:t.calendarItems.map(c=>c.id!==srcId?c:{...c,day:dayYMD})};});}}}

                    onClick={()=>onEditItem(ci)}>
                    <span className="ci-drag">⠿</span>
                    <span className="ci-icon">{TI(ci.type)}</span>
                    <div className="ci-body">
                      <div className="ci-title">{ci.title}</div>
                      <div className="ci-meta">
                        <span className={`type-badge type-${ci.type}`}>{TYPE_META[ci.type]?.label}</span>
                        {ci.startTime&&<span>🕐 {fmtTime(ci.startTime)}</span>}
                        {ci.durationMin&&<span>⏱ {ci.durationMin}min</span>}
                        {ci.price>0&&<span>💵 ${ci.price}</span>}
                        {ci.location&&<span>📍 {ci.location}</span>}
                      </div>
                    </div>
                    <div className="ci-actions">
                      <button className="ci-btn" onClick={e=>{e.stopPropagation();onEditItem(ci);}}>✏️</button>
                      <button className="ci-btn del" onClick={e=>{e.stopPropagation();removeItem(ci.id);}}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="add-row" style={{marginTop:12}}>
            <select className="add-type" value={newType} onChange={e=>setNewType(e.target.value)}>
              {Object.entries(TYPE_META).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <TimePicker value={newTime} onChange={v=>setNewTime(v)}/>
            <input className="add-input" placeholder={`Add ${TYPE_META[newType]?.label||"item"}…`}
              value={newTitle} onChange={e=>setNewTitle(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addItem()}/>
            <button className="btn btn-accent2 btn-sm" onClick={addItem}>+ Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCHEDULE TAB ─────────────────────────────────────────────────────────────
function ScheduleTab({trip,setTrip,db}) {
  const {startDate,endDate} = trip;
  const tripDays=useMemo(()=>buildTripDays(startDate,endDate),[startDate,endDate]);
  const [activeDay,setActiveDay] = useState(startDate||null);
  const [openDays,setOpenDays] = useState(()=>new Set(startDate?[startDate]:[]));
  const [editingItem,setEditingItem] = useState(null);

  useMemo(()=>{if(startDate){setActiveDay(startDate);setOpenDays(new Set([startDate]));}},[startDate,endDate]);

  const toggleDay=ymd=>{
    setOpenDays(prev=>{const n=new Set(prev);n.has(ymd)?n.delete(ymd):n.add(ymd);return n;});
    setActiveDay(ymd);
  };

  if(!startDate||!endDate) {
    return (
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:40,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>📅</div>
        <h4 style={{fontFamily:"Inter",fontSize:18,fontWeight:700,marginBottom:8}}>No trip dates set</h4>
        <p style={{color:"var(--muted)",fontSize:14}}>Set dates in <strong>ℹ️ Trip Info</strong> to build your itinerary.</p>
      </div>
    );
  }

  const nights=nightsBetween(startDate,endDate);
  const totalItems=(trip.calendarItems||[]).filter(c=>c.day).length;

  return (
    <div>
      {editingItem && <UniversalEditModal item={editingItem} trip={trip} setTrip={setTrip} onClose={()=>setEditingItem(null)} db={db}/>}
      <div className="flex-between" style={{marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div>
          <h4 style={{fontFamily:"Inter",fontSize:18,fontWeight:700,marginBottom:4}}>Trip Schedule</h4>
          <p className="text-muted">{fmtRange(startDate,endDate)} · {nights} night{nights!==1?"s":""} · {tripDays.length} day{tripDays.length!==1?"s":""}</p>
        </div>
        <div className="sched-legend">
          {totalItems>0&&<span className="badge">{totalItems} item{totalItems!==1?"s":""} planned</span>}
          <span style={{fontSize:12,color:"var(--muted)"}}>Drag items between days · Drop on timeline to set time</span>
        </div>
      </div>
      <div className="sched-layout">
        <MiniCal startDate={startDate} endDate={endDate} activeDay={activeDay}
          onSelectDay={ymd=>{
            setActiveDay(ymd);
            setOpenDays(prev=>{const n=new Set(prev);n.add(ymd);return n;});
            setTimeout(()=>{const el=document.getElementById(`day-${ymd}`);if(el)el.scrollIntoView({behavior:"smooth",block:"nearest"});},50);
          }}/>
        <div>
          {tripDays.map((ymd,idx)=>(
            <div key={ymd} id={`day-${ymd}`}>
              <DayBlock dayYMD={ymd} dayNum={idx+1} totalDays={tripDays.length}
                trip={trip} setTrip={setTrip}
                isOpen={openDays.has(ymd)} onToggleOpen={()=>toggleDay(ymd)}
                onEditItem={setEditingItem} db={db}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAP TAB (Google My Maps) ─────────────────────────────────────────────────
function MapTab({trip,setTrip,db}) {
  const savedUrl = trip.googleMapsUrl || "";
  const [inputUrl,setInputUrl] = useState(savedUrl);
  const [editing,setEditing]   = useState(!savedUrl);
  const [err,setErr]           = useState("");
  const [copied,setCopied]     = useState(false);

  const parseMapId = url => {
    const match = url.match(/[?&]mid=([\w-]+)/);
    return match ? match[1] : null;
  };

  const mid       = parseMapId(savedUrl);
  const embedUrl  = mid ? `https://www.google.com/maps/d/embed?mid=${mid}`  : null;
  const editUrl   = mid ? `https://www.google.com/maps/d/edit?mid=${mid}`   : null;

  const save = () => {
    if(!inputUrl.trim()){setErr("Paste a Google My Maps URL to continue.");return;}
    const id=parseMapId(inputUrl.trim());
    if(!id){setErr("Couldn't find a map ID. Make sure you're copying from a Google My Maps link (it should contain ?mid=…).");return;}
    setErr("");
    if(db) db.updateTrip(trip.id, { google_maps_url: inputUrl.trim() });
    setTrip(t=>({...t,googleMapsUrl:inputUrl.trim()}));
    setEditing(false);
  };

  const clear=()=>{ if(db) db.updateTrip(trip.id, { google_maps_url: "" }); setTrip(t=>({...t,googleMapsUrl:""}));setInputUrl("");setEditing(true);setErr(""); };

  const copyUrl=text=>{
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  return (
    <div>
      <div className="flex-between" style={{marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <h4 style={{fontFamily:"Inter",fontSize:18,fontWeight:700,marginBottom:4}}>🗺️ Google My Maps</h4>
          <p className="text-muted">Embed your group's custom Google Map and open it directly for collaborative editing.</p>
        </div>
        {!editing && mid && (
          <div style={{display:"flex",gap:8}}>
            <a href={editUrl} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:8,background:"var(--accent)",color:"#0a0f1e",fontWeight:600,fontSize:13,textDecoration:"none"}}>
              ✏️ Edit in Google Maps
            </a>
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(true)}>🔗 Change Map</button>
          </div>
        )}
      </div>

      {/* Setup panel */}
      {editing && (
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:24,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <span style={{fontSize:28}}>🗺️</span>
            <div>
              <div style={{fontFamily:"Inter",fontSize:15,fontWeight:700}}>Connect a Google My Map</div>
              <div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>Paste any Google My Maps URL — viewer, editor, or share link all work.</div>
            </div>
          </div>
          <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:12,padding:16,marginBottom:18}}>
            <div style={{fontSize:12,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>How to get your map URL</div>
            {[
              {n:"1",t:"Go to Google My Maps",d:"Visit maps.google.com → click ☰ → Your Places → Maps"},
              {n:"2",t:"Open or create your trip map",d:"Create a new map or open an existing one for this trip"},
              {n:"3",t:"Copy the URL",d:"Copy from your browser address bar — or use Share → Copy Link"},
            ].map(s=>(
              <div key={s.n} style={{display:"flex",gap:10,marginBottom:s.n==="3"?0:10}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:"var(--accent)",color:"#0a0f1e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{s.n}</div>
                <div><div style={{fontSize:13,fontWeight:600}}>{s.t}</div><div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{s.d}</div></div>
              </div>
            ))}
          </div>
          <div className="form-group" style={{marginBottom:8}}>
            <label className="form-label">Google My Maps URL</label>
            <input className={`form-input${err?" err":""}`}
              placeholder="https://www.google.com/maps/d/edit?mid=..."
              value={inputUrl}
              onChange={e=>{setInputUrl(e.target.value);setErr("");}}
              onKeyDown={e=>e.key==="Enter"&&save()}/>
            {err && <div className="err-msg" style={{marginTop:6}}>{err}</div>}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
            {savedUrl && <button className="btn btn-ghost btn-sm" onClick={()=>{setEditing(false);setInputUrl(savedUrl);setErr("");}}>Cancel</button>}
            <button className="btn btn-primary btn-sm" onClick={save}>Connect Map →</button>
          </div>
        </div>
      )}

      {/* Connected state */}
      {!editing && mid && (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{borderRadius:16,overflow:"hidden",border:"1px solid var(--border)"}}>
            <iframe src={embedUrl} title="Google My Maps Embed"
              width="100%" height="500"
              style={{display:"block",border:"none"}}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {/* Embed URL card */}
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:18}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:20}}>🖼️</span>
                <div>
                  <div style={{fontFamily:"Inter",fontSize:14,fontWeight:700}}>Embed URL</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>For displaying the map inside another site</div>
                </div>
              </div>
              <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:9,padding:"10px 12px",fontFamily:"monospace",fontSize:11,color:"var(--accent)",wordBreak:"break-all",marginBottom:10,lineHeight:1.5}}>
                {embedUrl}
              </div>
              <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>copyUrl(embedUrl)}>
                {copied?"✓ Copied!":"📋 Copy Embed URL"}
              </button>
            </div>

            {/* Edit URL card */}
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:18}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:20}}>✏️</span>
                <div>
                  <div style={{fontFamily:"Inter",fontSize:14,fontWeight:700}}>Edit URL</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>Opens Google Maps editor — add pins, routes, layers</div>
                </div>
              </div>
              <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:9,padding:"10px 12px",fontFamily:"monospace",fontSize:11,color:"var(--accent2)",wordBreak:"break-all",marginBottom:10,lineHeight:1.5}}>
                {editUrl}
              </div>
              <a href={editUrl} target="_blank" rel="noopener noreferrer"
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"8px 16px",borderRadius:8,background:"rgba(129,140,248,0.15)",border:"1px solid rgba(129,140,248,0.3)",color:"var(--accent2)",fontWeight:600,fontSize:13,textDecoration:"none"}}>
                ↗ Open in Google Maps
              </a>
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:"var(--muted)"}}>Map ID:</span>
            <span style={{fontFamily:"monospace",fontSize:12,color:"var(--green)"}}>{mid}</span>
            <span style={{fontSize:12,color:"var(--muted)",marginLeft:"auto"}}>Changes made in Google Maps appear in the embed above on next reload.</span>
            <button className="btn btn-ghost btn-sm" style={{padding:"4px 10px",fontSize:11}} onClick={clear}>✕ Disconnect</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!editing && !mid && (
        <div className="empty-state">
          <div>🗺️</div>
          <div style={{fontWeight:600,marginBottom:6}}>No map connected yet</div>
          <div style={{marginBottom:16}}>Connect a Google My Maps link to embed and share your trip map.</div>
          <button className="btn btn-accent2 btn-sm" onClick={()=>setEditing(true)}>+ Connect Google Map</button>
        </div>
      )}
    </div>
  );
}

// ─── ACTIVITIES TAB ───────────────────────────────────────────────────────────
function ActivityTab({trip,setTrip,user,db}) {
  const [editingItem,setEditingItem] = useState(null);
  const [showAdd,setShowAdd] = useState(false);
  const [form,setForm] = useState({type:"activity",title:"",location:"",description:"",startTime:"",durationMin:"60",price:"",priceType:"flat",notes:"",day:"",repeatDays:"1"});
  const [errs,setErrs] = useState({});
  const tripDays=useMemo(()=>buildTripDays(trip.startDate,trip.endDate),[trip]);
  const items=trip.calendarItems||[];

  const validate=()=>{
    const e={};
    if(!form.title.trim()) e.title="Title required";
    if(form.price&&isNaN(+form.price)) e.price="Numeric";
    setErrs(e); return !Object.keys(e).length;
  };

  const addItem=async ()=>{
    if(!validate()) return;
    const startMin=timeStrToMin(form.startTime)??null;
    const repeatCount = Math.max(1, Math.min(30, parseInt(form.repeatDays)||1));
    const baseItem={
      type:form.type, title:form.title.trim(),
      startTime:form.startTime||null, startMin,
      durationMin:+form.durationMin||60, location:form.location,
      price:form.price?+form.price:0,
      priceType:form.priceType||"flat",
      metadata:{description:form.description,notes:form.notes,upvotes:[],downvotes:[],createdBy:user}
    };
    // Build list of days to repeat across
    const savedItems = [];
    if(repeatCount === 1 || !form.day) {
      // Single item
      const saved = await db.addItem(trip.id, { id:uid(), ...baseItem, day:form.day||null });
      savedItems.push(saved);
    } else {
      // Repeat across consecutive days starting from selected day
      const tripDaysList = buildTripDays(trip.startDate, trip.endDate);
      const startIdx = tripDaysList.findIndex(d => d === form.day);
      for(let i=0; i<repeatCount; i++) {
        const dayIdx = startIdx + i;
        const day = dayIdx >= 0 && dayIdx < tripDaysList.length ? tripDaysList[dayIdx] : null;
        const label = repeatCount > 1 ? `${baseItem.title} (Day ${i+1})` : baseItem.title;
        const saved = await db.addItem(trip.id, { id:uid(), ...baseItem, title:label, day });
        savedItems.push(saved);
      }
    }
    setTrip(t=>({...t,calendarItems:[...t.calendarItems,...savedItems]}));
    setForm({type:"activity",title:"",location:"",description:"",startTime:"",durationMin:"60",price:"",priceType:"flat",notes:"",day:"",repeatDays:"1"});
    setShowAdd(false);
  };

  const del=id=>{ db.deleteItem(id); setTrip(t=>({...t,calendarItems:t.calendarItems.filter(c=>c.id!==id)})); };
  const F=k=>({value:form[k],onChange:e=>setForm(f=>({...f,[k]:e.target.value})),className:"form-input"});

  return (
    <div>
      {editingItem && <UniversalEditModal item={editingItem} trip={trip} setTrip={setTrip} onClose={()=>setEditingItem(null)} db={db}/>}
      <div className="section-hdr">
        <h4>🎯 All Trip Items</h4>
        <button className="btn btn-accent2 btn-sm" onClick={()=>setShowAdd(v=>!v)}>+ Add Item</button>
      </div>
      <p className="text-muted" style={{marginBottom:14}}>All trip items — activities, meals, transport, hotels, notes. Click any to edit.</p>

      {showAdd && (
        <div className="inline-form">
          <h5>✦ New Item</h5>
          <div className="type-tab-row">
            {Object.entries(TYPE_META).map(([k,v])=>(
              <button key={k} className={`type-tab ${form.type===k?"active":""}`} onClick={()=>setForm(f=>({...f,type:k}))}>{v.icon} {v.label}</button>
            ))}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input {...F("title")} placeholder="e.g. Snorkeling at Reef"/>
              {errs.title&&<div className="err-msg">{errs.title}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Day</label>
              <select {...F("day")} className="form-input">
                <option value="">Unscheduled</option>
                {tripDays.map((ymd,i)=>{const d=fromYMD(ymd);return <option key={ymd} value={ymd}>Day {i+1} · {MONTHS[d.getMonth()].slice(0,3)} {d.getDate()}</option>;})}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <TimePicker value={form.startTime} onChange={v=>setForm(f=>({...f,startTime:v}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input {...F("durationMin")} placeholder="60"/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input {...F("location")} placeholder="e.g. Cancun, Mexico"/>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea {...F("description")} className="form-input form-textarea" placeholder="Details…"/>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (USD)</label>
              <input {...F("price")} placeholder="e.g. 45"/>
              {errs.price&&<div className="err-msg">{errs.price}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Price Type</label>
              <div style={{display:"flex",gap:6,marginTop:2}}>
                <button type="button"
                  className={`type-tab ${form.priceType==="flat"?"active":""}`}
                  onClick={()=>setForm(f=>({...f,priceType:"flat"}))}>
                  👥 Group
                </button>
                <button type="button"
                  className={`type-tab ${form.priceType==="per_person"?"active":""}`}
                  onClick={()=>setForm(f=>({...f,priceType:"per_person"}))}>
                  🧍 Per Person
                </button>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={addItem}>Add Item</button>
          </div>
        </div>
      )}

      {items.length===0&&!showAdd
        ?<div className="empty-state"><div>🎯</div>No items yet. Add your first trip item above!</div>
        :<div className="activity-grid">
          {items.map(ci=>{
            const tm=TYPE_META[ci.type]||TYPE_META.activity;
            return (
              <div key={ci.id} className="activity-card" style={{cursor:"pointer"}} onClick={()=>setEditingItem(ci)}>
                <div className="card-head">
                  <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                    <div className="card-name">{ci.title}</div>
                    <span className={`type-badge type-${ci.type}`}>{tm.icon} {tm.label}</span>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-ghost btn-sm" style={{padding:"4px 9px"}} onClick={e=>{e.stopPropagation();setEditingItem(ci);}}>✏️</button>
                    <button className="btn btn-danger btn-sm" style={{padding:"4px 9px"}} onClick={e=>{e.stopPropagation();del(ci.id);}}>🗑</button>
                  </div>
                </div>
                {ci.location&&<div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>📍 {ci.location}</div>}
                {ci.metadata?.description&&<div className="activity-desc">{ci.metadata.description}</div>}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                  {ci.startTime&&<span className="pill pill-p">🕐 {fmtTime(ci.startTime)}</span>}
                  {ci.durationMin&&<span className="pill pill-b">⏱ {ci.durationMin}min</span>}
                  {ci.price>0&&<span className="pill pill-g">💵 ${ci.price}</span>}
                  {ci.day&&<span className="pill pill-y">📅 {fmtDate(ci.day)}</span>}
                </div>
                {ci.metadata?.notes&&<div style={{fontSize:12,color:"var(--muted)",marginTop:8,padding:"7px 10px",background:"rgba(255,255,255,0.03)",borderRadius:7,borderLeft:"2px solid var(--border)"}}>📝 {ci.metadata.notes}</div>}
                {((ci.metadata?.upvotes||[]).length>0||(ci.metadata?.downvotes||[]).length>0)&&(()=>{
                  const upV=(ci.metadata?.upvotes||[]).length, downV=(ci.metadata?.downvotes||[]).length, netV=upV-downV;
                  return (
                    <div className="card-meta-row" style={{marginTop:8,fontSize:12}}>
                      🗳️ <strong style={{color:"var(--green)"}}>{upV} yes</strong>
                      <span style={{color:"var(--muted)"}}>·</span>
                      <strong style={{color:"var(--red)"}}>{downV} no</strong>
                      {netV!==0&&<span style={{color:netV>0?"var(--green)":"var(--red)",fontWeight:600,marginLeft:4}}>({netV>0?"+":""}{netV} net)</span>}
                    </div>
                  );
                })()}
                {ci.metadata?.createdBy&&(()=>{
                  const raw = ci.metadata.createdBy;
                  // If it looks like a UUID, resolve to display name via tripMembers
                  const isUuid = /^[0-9a-f-]{36}$/i.test(raw);
                  const member = isUuid ? (trip.tripMembers||[]).find(m=>m.userId===raw) : null;
                  const displayName = member?.name || (isUuid ? "Unknown" : raw);
                  return <div className="suggested-by"><span className="sugg-avatar">{displayName[0]?.toUpperCase()||"?"}</span>By {displayName}</div>;
                })()}
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}

// ─── VOTING TAB ───────────────────────────────────────────────────────────────
function VotingTab({trip,setTrip,user,userId,db}) {
  // Use UUID for DB storage, fall back to display name for demo
  const voteUserId = userId || user;

  // ── Destination yes/no vote — persists to trips.country_info.destination_votes ──
  const voteSection=(section,id,dir)=>{
    const updated=trip[section].map(item=>{
      if(item.id!==id) return item;
      const up=item.upvotes||[],down=item.downvotes||[];
      let newUp,newDown;
      if(dir==="up"){const has=up.includes(voteUserId);newUp=has?up.filter(u=>u!==voteUserId):[...up,voteUserId];newDown=down.filter(u=>u!==voteUserId);}
      else{const has=down.includes(voteUserId);newDown=has?down.filter(u=>u!==voteUserId):[...down,voteUserId];newUp=up.filter(u=>u!==voteUserId);}
      return {...item,upvotes:newUp,downvotes:newDown};
    });
    const newTrip={...trip,[section]:updated};
    setTrip(newTrip);
    if(!db?.isMock){
      const destVotes=updated.map(d=>({id:d.id,name:d.name,upvotes:d.upvotes||[],downvotes:d.downvotes||[]}));
      supabase.from("trips").update({country_info:{...(trip.country||{}),destination_votes:destVotes}}).eq("id",trip.id)
        .then(({error})=>{ if(error) console.error("voteSection supabase error:",error); });
    }
  };

  // ── Vehicle yes/no vote ──
  const voteVehicle=(id,dir)=>{
    const newRentals=(trip.vehicleRentals||[]).map(v=>{
      if(v.id!==id) return v;
      const up=v.upvotes||[],down=v.downvotes||[];
      let newUp,newDown;
      if(dir==="up"){const has=up.includes(voteUserId);newUp=has?up.filter(u=>u!==voteUserId):[...up,voteUserId];newDown=down.filter(u=>u!==voteUserId);}
      else{const has=down.includes(voteUserId);newDown=has?down.filter(u=>u!==voteUserId):[...down,voteUserId];newUp=up.filter(u=>u!==voteUserId);}
      return {...v,upvotes:newUp,downvotes:newDown};
    });
    setTrip({...trip,vehicleRentals:newRentals});
    if(!db?.isMock){
      const v=newRentals.find(x=>x.id===id);
      if(v) supabase.from("vehicle_rentals").update({upvotes:v.upvotes,downvotes:v.downvotes}).eq("id",id)
        .then(({error})=>{ if(error) console.error("voteVehicle supabase error:",error); });
    }
  };

  // ── Accommodation yes/no vote ──
  const voteAccom=(id,dir)=>{
    const newAccoms=trip.accommodationOptions.map(a=>{
      if(a.id!==id) return a;
      const up=a.upvotes||[],down=a.downvotes||[];
      let newUp,newDown;
      if(dir==="up"){const has=up.includes(voteUserId);newUp=has?up.filter(u=>u!==voteUserId):[...up,voteUserId];newDown=down.filter(u=>u!==voteUserId);}
      else{const has=down.includes(voteUserId);newDown=has?down.filter(u=>u!==voteUserId):[...down,voteUserId];newUp=up.filter(u=>u!==voteUserId);}
      return {...a,upvotes:newUp,downvotes:newDown};
    });
    setTrip({...trip,accommodationOptions:newAccoms});
    if(!db?.isMock){
      const a=newAccoms.find(x=>x.id===id);
      if(a) supabase.from("accommodations").update({upvotes:a.upvotes,downvotes:a.downvotes}).eq("id",id)
        .then(({error})=>{ if(error) console.error("voteAccom supabase error:",error); });
    }
  };

  // ── Activity yes/no vote ──
  const voteCI=(id,dir)=>{
    const newItems=trip.calendarItems.map(ci=>{
      if(ci.id!==id) return ci;
      const up=ci.metadata?.upvotes||[],down=ci.metadata?.downvotes||[];
      let newUp,newDown;
      if(dir==="up"){const has=up.includes(voteUserId);newUp=has?up.filter(u=>u!==voteUserId):[...up,voteUserId];newDown=down.filter(u=>u!==voteUserId);}
      else{const has=down.includes(voteUserId);newDown=has?down.filter(u=>u!==voteUserId):[...down,voteUserId];newUp=up.filter(u=>u!==voteUserId);}
      return{...ci,metadata:{...ci.metadata,upvotes:newUp,downvotes:newDown}};
    });
    setTrip({...trip,calendarItems:newItems});
    if(!db?.isMock){
      const ci=newItems.find(x=>x.id===id);
      if(ci) supabase.from("activities").update({upvotes:ci.metadata.upvotes,downvotes:ci.metadata.downvotes}).eq("id",id)
        .then(({error})=>{ if(error) console.error("voteCI supabase error:",error); });
    }
  };

  // ── Shared Yes/No card renderer ──
  const YesNoCard=({children,up,down,hasUp,hasDown,onUp,onDown})=>{
    const net=up-down;
    return(
      <div className="act-vote-card">
        <div className="act-vote-top">
          <div className="act-vote-info" style={{width:"100%"}}>
            {children}
          </div>
        </div>
        <div className="act-vote-row">
          <button className={`vbtn-up ${hasUp?"on":""}`} onClick={onUp}>👍 Yes{up>0?` (${up})`:""}</button>
          <button className={`vbtn-down ${hasDown?"on":""}`} onClick={onDown}>👎 No{down>0?` (${down})`:""}</button>
          <div className="vote-tally">
            <span style={{color:net>0?"var(--green)":net<0?"var(--red)":"var(--muted)",fontWeight:600}}>{net>0?`+${net}`:net} net</span>
          </div>
        </div>
      </div>
    );
  };

  const sortByNet = (arr) => [...arr].sort((a,b)=>
    ((b.upvotes||[]).length-(b.downvotes||[]).length) -
    ((a.upvotes||[]).length-(a.downvotes||[]).length)
  );

  const votable=[...trip.calendarItems].sort((a,b)=>
    ((b.metadata?.upvotes||[]).length-(b.metadata?.downvotes||[]).length)-
    ((a.metadata?.upvotes||[]).length-(a.metadata?.downvotes||[]).length)
  );

  const VTYPE={car:"🚗",suv:"🚙",van:"🚐",motorcycle:"🏍️",scooter:"🛵",bus:"🚌"};

  return (
    <div>
      {/* ── Destinations ── */}
      {trip.destinations.length > 0 && (
        <div className="vote-card">
          <h4>📍 Destination</h4>
          {sortByNet(trip.destinations).map(dest=>{
            const up=(dest.upvotes||[]).length, down=(dest.downvotes||[]).length;
            const hasUp=(dest.upvotes||[]).includes(voteUserId), hasDown=(dest.downvotes||[]).includes(voteUserId);
            return(
              <YesNoCard key={dest.id} up={up} down={down} hasUp={hasUp} hasDown={hasDown}
                onUp={()=>voteSection("destinations",dest.id,"up")}
                onDown={()=>voteSection("destinations",dest.id,"down")}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{dest.name}</div>
              </YesNoCard>
            );
          })}
        </div>
      )}

      {/* ── Vehicle Rentals ── */}
      {(trip.vehicleRentals||[]).length > 0 && (
        <div className="vote-card">
          <h4>🚗 Vehicle Rentals ({(trip.vehicleRentals||[]).length})</h4>
          {sortByNet(trip.vehicleRentals||[]).map(v=>{
            const up=(v.upvotes||[]).length, down=(v.downvotes||[]).length;
            const hasUp=(v.upvotes||[]).includes(voteUserId), hasDown=(v.downvotes||[]).includes(voteUserId);
            const ppd=parseFloat(v.price||v.pricePerDay)||0;
            const days=calcVehicleDays(v);
            const total=calcVehicleTotal(v);
            return(
              <YesNoCard key={v.id} up={up} down={down} hasUp={hasUp} hasDown={hasDown}
                onUp={()=>voteVehicle(v.id,"up")}
                onDown={()=>voteVehicle(v.id,"down")}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{VTYPE[v.vehicleType]||"🚗"} {v.company}{v.model&&` — ${v.model}`}</div>
                <div className="act-vote-pills">
                  {v.priceType==="full" && ppd>0 && (
                    <span className="pill" style={{background:"rgba(249,115,22,0.10)",color:"#f97316",border:"1px solid rgba(249,115,22,0.25)"}}>🧾 ${ppd.toLocaleString()} full price</span>
                  )}
                  {v.priceType!=="full" && ppd>0 && days>0 && (
                    <span className="pill" style={{background:"rgba(249,115,22,0.10)",color:"#f97316",border:"1px solid rgba(249,115,22,0.25)"}}>💰 ${ppd}/day × {days}d = ${total.toLocaleString()} total</span>
                  )}
                  {v.priceType!=="full" && ppd>0 && days===0 && (
                    <span className="pill" style={{background:"rgba(249,115,22,0.10)",color:"#f97316",border:"1px solid rgba(249,115,22,0.25)"}}>💰 ${ppd}/day</span>
                  )}
                  {v.pickupDate&&v.returnDate&&<span className="pill pill-b">📅 {fmtDate(v.pickupDate)} – {fmtDate(v.returnDate)}</span>}
                  {v.seats&&<span className="pill pill-b">💺 {v.seats} seats</span>}
                </div>
              </YesNoCard>
            );
          })}
        </div>
      )}

      {/* ── Accommodations ── */}
      {(trip.accommodationOptions||[]).length > 0 && (
        <div className="vote-card">
          <h4>🏨 Accommodations ({(trip.accommodationOptions||[]).length})</h4>
          {sortByNet(trip.accommodationOptions||[]).map(a=>{
            const up=(a.upvotes||[]).length, down=(a.downvotes||[]).length;
            const hasUp=(a.upvotes||[]).includes(voteUserId), hasDown=(a.downvotes||[]).includes(voteUserId);
            const ppn=parseFloat(a.pricePerNight)||0;
            const nights=calcAccomNights(a);
            const total=calcAccomTotal(a);
            const isFull=a.priceType==="full";
            return(
              <YesNoCard key={a.id} up={up} down={down} hasUp={hasUp} hasDown={hasDown}
                onUp={()=>voteAccom(a.id,"up")}
                onDown={()=>voteAccom(a.id,"down")}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{a.name}</div>
                <div className="act-vote-pills">
                  {isFull && total>0 && (
                    <span className="pill" style={{background:"rgba(129,140,248,0.10)",color:"#4a6fa5",border:"1px solid rgba(74,111,165,0.22)"}}>🧾 ${total.toLocaleString()} full price</span>
                  )}
                  {!isFull && ppn>0 && nights>0 && (
                    <span className="pill" style={{background:"rgba(129,140,248,0.10)",color:"#4a6fa5",border:"1px solid rgba(74,111,165,0.22)"}}>🏨 ${ppn}/night × {nights}n = ${total.toLocaleString()} total</span>
                  )}
                  {!isFull && ppn>0 && nights===0 && (
                    <span className="pill" style={{background:"rgba(129,140,248,0.10)",color:"#4a6fa5",border:"1px solid rgba(74,111,165,0.22)"}}>💰 ${ppn}/night</span>
                  )}
                  {a.checkIn&&a.checkOut&&<span className="pill pill-b">📅 {fmtDate(a.checkIn)} – {fmtDate(a.checkOut)}</span>}
                  {a.address&&<span className="pill pill-b">📍 {a.address}</span>}
                </div>
              </YesNoCard>
            );
          })}
        </div>
      )}

      {/* ── Activities & Items ── */}
      <div className="vote-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h4>🗳️ Activities & Items ({votable.length})</h4>
        </div>
        {votable.length===0
          ?<div style={{textAlign:"center",padding:"20px 0",color:"var(--muted)",fontSize:14}}>No items yet — add some in the <strong>🎯 Items</strong> tab.</div>
          :votable.map(ci=>{
            const tm=TYPE_META[ci.type]||TYPE_META.activity;
            const up=(ci.metadata?.upvotes||[]).length,down=(ci.metadata?.downvotes||[]).length;
            const hasUp=(ci.metadata?.upvotes||[]).includes(voteUserId),hasDown=(ci.metadata?.downvotes||[]).includes(voteUserId);
            return(
              <YesNoCard key={ci.id} up={up} down={down} hasUp={hasUp} hasDown={hasDown}
                onUp={()=>voteCI(ci.id,"up")}
                onDown={()=>voteCI(ci.id,"down")}>
                <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
                  <span style={{fontSize:18,flexShrink:0}}>{tm.icon}</span>
                  <div className="act-vote-name">{ci.title}</div>
                  <span className={`type-badge type-${ci.type}`}>{tm.icon} {tm.label}</span>
                </div>
                {ci.location&&<div style={{fontSize:12,color:"var(--muted)",marginBottom:4}}>📍 {ci.location}</div>}
                {ci.metadata?.description&&<div className="act-vote-desc">{ci.metadata.description}</div>}
                <div className="act-vote-pills">
                  {ci.durationMin&&<span className="pill pill-b">⏱ {ci.durationMin}min</span>}
                  {ci.price>0&&(
                    ci.priceType==="per_person"
                      ? <span className="pill pill-g">💵 ${ci.price}/person</span>
                      : <span className="pill pill-g">💵 ${ci.price} total</span>
                  )}
                </div>
              </YesNoCard>
            );
          })
        }
      </div>
    </div>
  );
}

// ─── ACCOMMODATION COST HELPERS ───────────────────────────────────────────────
// Single source of truth for all accommodation cost math.
function calcAccomNights(a) {
  if(!a.checkIn||!a.checkOut) return 0;
  const n = nightsBetween(a.checkIn, a.checkOut);
  return Math.max(n, 0);
}
function calcAccomTotal(a) {
  if(a.priceType === "full") return parseFloat(a.totalPrice) || 0;
  const nights = calcAccomNights(a);
  const ppn = parseFloat(a.pricePerNight) || 0;
  return ppn * nights;
}
function calcAllAccomTotal(accommodationOptions) {
  return (accommodationOptions||[]).reduce((s,a) => s + calcAccomTotal(a), 0);
}
function calcVehicleDays(v) {
  if(!v.pickupDate || !v.returnDate) return 0;
  return Math.max(nightsBetween(v.pickupDate, v.returnDate), 0);
}
function calcVehicleTotal(v) {
  const p = parseFloat(v.price || v.pricePerDay) || 0;
  if(v.priceType === "full") return p;
  const days = calcVehicleDays(v);
  return p * days;
}
function calcAllVehicleTotal(vehicleRentals) {
  return (vehicleRentals||[]).reduce((s,v) => s + calcVehicleTotal(v), 0);
}

// ─── BUDGET TAB ───────────────────────────────────────────────────────────────
function BudgetTab({trip, setTrip, user, onSaveBudget}) {
  const memberCount = trip.members.length || 1;
  const items = trip.calendarItems || [];

  // ── Personal budget (stored per user in trip.personalBudgets map) ──
  const personalBudgets = trip.personalBudgets || {};
  const myBudget = personalBudgets[user] ?? null;
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(myBudget != null ? String(myBudget) : "");

  const saveBudget = () => {
    const val = budgetInput ? +budgetInput : null;
    setTrip(t => ({ ...t, personalBudgets: { ...(t.personalBudgets||{}), [user]: val } }));
    if(onSaveBudget) onSaveBudget(val);
    setEditingBudget(false);
  };

  // ── Compute effective cost of each item ──
  // per_person → price × memberCount, flat → price as-is
  const effectiveCost = ci => {
    const p = ci.price || 0;
    return ci.priceType === "per_person" ? p * memberCount : p;
  };

  const sumType = type => items.filter(c=>c.type===type).reduce((s,c)=>s+effectiveCost(c), 0);

  const actTotal       = sumType("activity");
  const mealTotal      = sumType("meal");
  const transportTotal = sumType("transport");
  const noteTotal      = sumType("note");
  const accomOptions   = trip.accommodationOptions || [];
  const accomTotal     = calcAllAccomTotal(accomOptions);
  const vehicleOptions = trip.vehicleRentals || [];
  const vehicleTotal   = calcAllVehicleTotal(vehicleOptions);

  const grandTotal  = actTotal + mealTotal + transportTotal + accomTotal + vehicleTotal + noteTotal;
  const myShare     = memberCount > 0 ? grandTotal / memberCount : 0;

  const cats = [
    {icon:"🎯", label:"Activities",    total:actTotal,       color:"#2a7a55"},
    {icon:"🚌", label:"Transport",     total:transportTotal, color:"#5a8a6a"},
    {icon:"🍽️", label:"Meals",         total:mealTotal,      color:"#c4a030"},
    {icon:"🏨", label:"Accommodation", total:accomTotal,     color:"#4a6fa5"},
    {icon:"🚗", label:"Vehicles",       total:vehicleTotal,  color:"#c96a28"},
  ];
  const maxCat = Math.max(...cats.map(c=>c.total), 1);

  // ── Budget status ──
  const budgetSet   = myBudget != null && myBudget > 0;
  const spent       = myShare;
  const remaining   = budgetSet ? myBudget - spent : null;
  const pct         = budgetSet ? Math.min((spent / myBudget) * 100, 100) : 0;
  const over        = budgetSet && spent > myBudget;

  return (
    <div className="budget-dash">

      {/* ── My Personal Budget ── */}
      <div className="budget-card">
        <h4>👤 My Budget</h4>
        {!editingBudget && myBudget == null && (
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <p className="text-muted" style={{flex:1}}>You haven't set a personal budget yet.</p>
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditingBudget(true)}>+ Set Budget</button>
          </div>
        )}
        {(editingBudget || myBudget != null) && (
          <div>
            {editingBudget ? (
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:16,color:"var(--muted)"}}>$</span>
                <input className="form-input" style={{maxWidth:140}} type="number" min={0}
                  value={budgetInput} onChange={e=>setBudgetInput(e.target.value)} autoFocus/>
                <button className="btn btn-primary btn-sm" onClick={saveBudget}>Save</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>setEditingBudget(false)}>Cancel</button>
              </div>
            ) : (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:14,color:"var(--muted)"}}>
                  My budget: <strong style={{color:"var(--text)"}}>${(+myBudget).toLocaleString()}</strong>
                </span>
                <button className="btn btn-ghost btn-sm" onClick={()=>{setBudgetInput(String(myBudget));setEditingBudget(true);}}>✏️ Edit</button>
              </div>
            )}

            {budgetSet && !editingBudget && (
              <>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}>
                  <span>My share: ${Math.ceil(spent).toLocaleString()}</span>
                  <span>Budget: ${(+myBudget).toLocaleString()}</span>
                </div>
                <div className="budget-status-bar">
                  <div className="budget-status-fill" style={{
                    width:`${pct}%`,
                    background: over ? "var(--red)" : pct > 80 ? "var(--yellow)" : "var(--green)"
                  }}/>
                </div>
                {over
                  ? <div className="budget-over">⚠️ Over budget by ${Math.ceil(spent - myBudget).toLocaleString()}</div>
                  : <div className="budget-under">✓ ${Math.floor(remaining).toLocaleString()} remaining ({Math.round(100-pct)}% left)</div>
                }
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Trip Cost Breakdown ── */}
      <div className="budget-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h4 style={{margin:0}}>💰 Trip Cost Breakdown</h4>
          <span style={{fontSize:12,color:"var(--muted)"}}>👥 {memberCount} member{memberCount!==1?"s":""}</span>
        </div>
        {cats.map(cat=>(
          <div key={cat.label} className="cat-row">
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
            <div className="cat-bar-wrap">
              <div className="cat-bar-bg">
                <div className="cat-bar-fill" style={{width:`${Math.round((cat.total/maxCat)*100)}%`,background:cat.color}}/>
              </div>
            </div>
            <span className="cat-amount" style={{color:cat.color}}>${cat.total.toLocaleString()}</span>
          </div>
        ))}
        <div className="budget-total-row">
          <span className="budget-total-label" style={{color:"#1d1d1f"}}>Total (all members)</span>
          <span className="budget-total-val">${grandTotal.toLocaleString()}</span>
        </div>
        <div className="per-person-row">
          <span style={{fontSize:13,color:"var(--muted)"}}>My equal share ({memberCount} member{memberCount!==1?"s":""})</span>
          <span style={{fontFamily:"Inter",fontSize:18,fontWeight:800,color:"#248a3d"}}>${Math.ceil(myShare).toLocaleString()}</span>
        </div>
      </div>

      {/* ── Item-by-item cost breakdown ── */}
      <div className="budget-card">
        <h4>🧾 Item Cost Detail</h4>
        {items.length === 0 ? (
          <p className="text-muted" style={{fontSize:13}}>No items added yet.</p>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
            {items.filter(ci=>ci.price>0).map(ci => {
              const effective = effectiveCost(ci);
              const myPart    = memberCount > 0 ? effective / memberCount : 0;
              const tm        = TYPE_META[ci.type];
              return (
                <div key={ci.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)"}}>
                  <span style={{fontSize:16,flexShrink:0}}>{tm?.icon}</span>
                  <span style={{flex:1,fontSize:13,fontWeight:500}}>{ci.title}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    {ci.priceType==="per_person" ? (
                      <span style={{fontSize:11,background:"rgba(56,189,248,0.12)",color:"var(--accent)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:20,padding:"2px 8px"}}>
                        🧍 ${ci.price}/person
                      </span>
                    ) : (
                      <span style={{fontSize:11,background:"rgba(74,111,165,0.10)",color:"#4a6fa5",border:"1px solid rgba(74,111,165,0.22)",borderRadius:20,padding:"2px 8px"}}>
                        👥 ${ci.price} flat
                      </span>
                    )}
                    <span style={{fontSize:13,fontWeight:700,color:"#248a3d",minWidth:60,textAlign:"right"}}>
                      ${Math.ceil(myPart).toLocaleString()}<span style={{fontSize:11,fontWeight:400,color:"var(--muted)"}}> /me</span>
                    </span>
                  </div>
                </div>
              );
            })}
            {items.filter(ci=>ci.price>0).length === 0 && (
              <p className="text-muted" style={{fontSize:13}}>No priced items yet.</p>
            )}
            {items.filter(ci=>ci.price>0).length > 0 && (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,marginTop:4,borderTop:"1px solid var(--border)"}}>
                <span style={{fontSize:15,fontWeight:700,color:"#1d1d1f"}}>Total</span>
                <span style={{fontFamily:"Inter",fontSize:18,fontWeight:800,color:"#248a3d"}}>${(actTotal+mealTotal+transportTotal+noteTotal).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Accommodation detail ── */}
      <div className="budget-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h4 style={{margin:0}}>🏨 Accommodation Detail</h4>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:13,fontWeight:700,color:"#1d1d1f"}}>Total:</span>
            <span style={{fontSize:13,fontWeight:700,color:"#248a3d"}}>${accomTotal.toLocaleString()}</span>
          </div>
        </div>
        {accomOptions.length === 0 ? (
          <p className="text-muted" style={{fontSize:13}}>No accommodations added yet — go to <strong>🏨 Stays</strong> to add options.</p>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {accomOptions.map(a => {
              const nights   = calcAccomNights(a);
              const ppn      = parseFloat(a.pricePerNight) || 0;
              const totalFull= parseFloat(a.totalPrice) || 0;
              const total    = calcAccomTotal(a);
              const myPart   = memberCount > 0 ? total / memberCount : 0;
              const isFull   = a.priceType === "full";
              const hasData  = isFull ? totalFull > 0 : (a.checkIn && a.checkOut && ppn > 0);
              return (
                <div key={a.id} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:12,padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:14}}>{a.name}</div>
                      {a.address && <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>📍 {a.address}</div>}
                    </div>
                    {hasData && <div style={{fontFamily:"Inter",fontSize:16,fontWeight:800,color:"#4a6fa5",flexShrink:0,marginLeft:12}}>${total.toLocaleString()}</div>}
                  </div>
                  {hasData ? (
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                      {isFull ? (
                        <span style={{fontSize:12,background:"rgba(74,111,165,0.10)",color:"#4a6fa5",border:"1px solid rgba(74,111,165,0.22)",borderRadius:20,padding:"3px 10px"}}>🧾 ${totalFull.toLocaleString()} full price</span>
                      ) : (<>
                        <span style={{fontSize:12,background:"rgba(74,111,165,0.10)",color:"#4a6fa5",border:"1px solid rgba(74,111,165,0.22)",borderRadius:20,padding:"3px 10px"}}>${ppn.toLocaleString()}/night</span>
                        <span style={{fontSize:12,color:"var(--muted)"}}>×</span>
                        <span style={{fontSize:12,background:"rgba(56,189,248,0.12)",color:"var(--accent)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:20,padding:"3px 10px"}}>{nights} night{nights!==1?"s":""}</span>
                        <span style={{fontSize:12,color:"var(--muted)"}}>→</span>
                      </>)}
                      <span style={{fontSize:12,fontWeight:700,color:"#248a3d"}}>${total.toLocaleString()}</span>
                      {memberCount > 1 && <span style={{fontSize:12,color:"var(--muted)",marginLeft:"auto"}}>${Math.ceil(myPart).toLocaleString()}/person</span>}
                    </div>
                  ) : (
                    <div style={{fontSize:12,color:"var(--yellow)",display:"flex",alignItems:"center",gap:6}}>
                      ⚠️ {isFull ? "Missing total price" : !a.checkIn||!a.checkOut ? "Missing check-in or check-out dates" : "Missing nightly rate"} — edit in Stays tab
                    </div>
                  )}
                  {(a.checkIn||a.checkOut) && <div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>🗓️ {a.checkIn?fmtDate(a.checkIn):"?"} → {a.checkOut?fmtDate(a.checkOut):"?"}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Vehicle Rental Detail ── */}
      <div className="budget-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h4 style={{margin:0}}>🚗 Vehicle Rental Detail</h4>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:13,fontWeight:700,color:"#1d1d1f"}}>Total:</span>
            <span style={{fontSize:13,fontWeight:700,color:"#248a3d"}}>${vehicleTotal.toLocaleString()}</span>
          </div>
        </div>
        {vehicleOptions.length === 0 ? (
          <p className="text-muted" style={{fontSize:13}}>No vehicle rentals added yet — go to <strong>🚗 Vehicles</strong> to add options.</p>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {vehicleOptions.map(v => {
              const total  = calcVehicleTotal(v);
              const ppd    = parseFloat(v.pricePerDay) || 0;
              const myPart = memberCount > 0 ? total / memberCount : 0;
              const VTYPE  = {car:"🚗",suv:"🚙",van:"🚐",motorcycle:"🏍️",scooter:"🛵",bus:"🚌"};
              const days = calcVehicleDays(v);
              return (
                <div key={v.id} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:12,padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:14}}>{VTYPE[v.vehicleType]||"🚗"} {v.company}{v.model&&` — ${v.model}`}</div>
                      {v.pickupLocation && <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>📍 {v.pickupLocation}</div>}
                      {(v.pickupDate||v.returnDate)&&<div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>📅 {v.pickupDate?fmtDate(v.pickupDate):"?"} → {v.returnDate?fmtDate(v.returnDate):"?"}</div>}
                    </div>
                    {total > 0 && <div style={{fontFamily:"Inter",fontSize:16,fontWeight:800,color:"#f97316",flexShrink:0,marginLeft:12}}>${total.toLocaleString()}</div>}
                  </div>
                  {total > 0 ? (
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                      {v.priceType==="full" ? (
                        <span style={{fontSize:12,background:"rgba(249,115,22,0.12)",color:"#f97316",border:"1px solid rgba(249,115,22,0.25)",borderRadius:20,padding:"3px 10px"}}>🧾 Full price</span>
                      ) : (<>
                        <span style={{fontSize:12,background:"rgba(249,115,22,0.12)",color:"#f97316",border:"1px solid rgba(249,115,22,0.25)",borderRadius:20,padding:"3px 10px"}}>${ppd.toLocaleString()}/day</span>
                        <span style={{fontSize:12,color:"var(--muted)"}}>×</span>
                        <span style={{fontSize:12,background:"rgba(56,189,248,0.12)",color:"var(--accent)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:20,padding:"3px 10px"}}>{days} day{days!==1?"s":""}</span>
                        <span style={{fontSize:12,color:"var(--muted)"}}>→</span>
                      </>)}
                      <span style={{fontSize:12,fontWeight:700,color:"#248a3d"}}>${total.toLocaleString()}</span>
                      {memberCount > 1 && <span style={{fontSize:12,color:"var(--muted)",marginLeft:"auto"}}>${Math.ceil(myPart).toLocaleString()}/person</span>}
                    </div>
                  ) : (
                    <div style={{fontSize:12,color:"var(--yellow)",display:"flex",alignItems:"center",gap:6}}>
                      ⚠️ Missing pickup/return dates or daily rate — edit in Vehicles tab
                    </div>
                  )}
                  {v.transmission && <div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>⚙️ {v.transmission}{v.seats&&` · ${v.seats} seats`}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── ACCOMMODATION TAB ────────────────────────────────────────────────────────
const BLANK_A={name:"",address:"",priceType:"nightly",pricePerNight:"",totalPrice:"",rating:"",checkIn:"",checkOut:"",notes:""};
const BLANK_V={company:"",model:"",vehicleType:"car",pickupDate:"",returnDate:"",priceType:"daily",price:"",rating:"",pickupLocation:"",dropoffLocation:"",seats:"",transmission:"automatic",notes:"",upvotes:[],downvotes:[]};
function AccommodationTab({trip,setTrip,db}) {
  const [show,setShow] = useState(false);
  const [editId,setEditId] = useState(null);
  const [form,setForm] = useState(BLANK_A);
  const [errs,setErrs] = useState({});

  const validate=()=>{
    const e={};
    if(!form.name.trim()) e.name="Name required";
    if(form.priceType==="nightly"&&form.pricePerNight&&isNaN(Number(form.pricePerNight))) e.pricePerNight="Numeric";
    if(form.priceType==="full"&&form.totalPrice&&isNaN(Number(form.totalPrice))) e.totalPrice="Numeric";
    if(form.rating&&(isNaN(Number(form.rating))||+form.rating<1||+form.rating>5)) e.rating="1–5";
    setErrs(e); return !Object.keys(e).length;
  };

  const openAdd=()=>{setForm(BLANK_A);setEditId(null);setErrs({});setShow(true);};
  const openEdit=a=>{setForm({name:a.name,address:a.address||"",priceType:a.priceType||"nightly",pricePerNight:String(a.pricePerNight||""),totalPrice:String(a.totalPrice||""),rating:String(a.rating||""),checkIn:a.checkIn||"",checkOut:a.checkOut||"",notes:a.notes||""});setEditId(a.id);setErrs({});setShow(true);};

  const save=async ()=>{
    if(!validate()) return;
    const formatted={...form,pricePerNight:form.priceType==="nightly"&&form.pricePerNight?+form.pricePerNight:"",totalPrice:form.priceType==="full"&&form.totalPrice?+form.totalPrice:"",rating:form.rating?+form.rating:""};
    if(editId){
      const updated={...trip.accommodationOptions.find(a=>a.id===editId),...formatted};
      if(db) db.updateAccom(updated);
      setTrip(t=>({...t,accommodationOptions:t.accommodationOptions.map(a=>a.id===editId?updated:a)}));
    } else {
      const newAccom={id:uid(),tripId:trip.id,...formatted};
      const saved = db ? await db.addAccom(trip.id, newAccom) : newAccom;
      setTrip(t=>({...t,accommodationOptions:[...t.accommodationOptions,saved]}));
    }
    setShow(false);
  };

  const del=id=>{ if(db) db.deleteAccom(id); setTrip(t=>({...t,accommodationOptions:t.accommodationOptions.filter(a=>a.id!==id)})); };
  const F=k=>({value:form[k],onChange:e=>setForm(f=>({...f,[k]:e.target.value})),className:`form-input${errs[k]?" err":""}`});

  return (
    <div>
      <div className="section-hdr">
        <h4>🏨 Accommodation Options</h4>
        <button className="btn btn-accent2 btn-sm" onClick={openAdd}>+ Add Option</button>
      </div>
      <p className="text-muted" style={{marginBottom:14}}>Compare lodging options — these also appear in voting.</p>
      {show && (
        <div className="inline-form">
          <h5>{editId?"Edit Accommodation":"New Accommodation"}</h5>
          <div className="form-group"><label className="form-label">Name *</label><input {...F("name")} placeholder="e.g. Beachside Airbnb"/>{errs.name&&<div className="err-msg">{errs.name}</div>}</div>
          <div className="form-group"><label className="form-label">Address</label><input {...F("address")} placeholder="e.g. Zona Hotelera, Cancun"/></div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pricing</label>
              <div style={{display:"flex",gap:8}}>
                <button type="button"
                  className={`btn btn-sm ${form.priceType==="nightly"?"btn-primary":"btn-ghost"}`}
                  style={{flex:1}}
                  onClick={()=>setForm(f=>({...f,priceType:"nightly"}))}>
                  🌙 Per Night
                </button>
                <button type="button"
                  className={`btn btn-sm ${form.priceType==="full"?"btn-primary":"btn-ghost"}`}
                  style={{flex:1}}
                  onClick={()=>setForm(f=>({...f,priceType:"full"}))}>
                  🧾 Full Price
                </button>
              </div>
            </div>
            {form.priceType==="nightly" ? (
              <div className="form-group">
                <label className="form-label">Price/Night ($)</label>
                <input {...F("pricePerNight")} placeholder="180"/>
                {errs.pricePerNight&&<div className="err-msg">{errs.pricePerNight}</div>}
                {form.pricePerNight&&calcAccomNights({checkIn:form.checkIn,checkOut:form.checkOut})>0&&(
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>
                    ~${(+(form.pricePerNight||0)*calcAccomNights({checkIn:form.checkIn,checkOut:form.checkOut})).toLocaleString()} total for {calcAccomNights({checkIn:form.checkIn,checkOut:form.checkOut})} nights
                  </div>
                )}
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Total Price ($)</label>
                <input {...F("totalPrice")} placeholder="e.g. 800"/>
                {errs.totalPrice&&<div className="err-msg">{errs.totalPrice}</div>}
              </div>
            )}
            <div className="form-group"><label className="form-label">Rating (1–5)</label><input {...F("rating")} placeholder="4.5"/>{errs.rating&&<div className="err-msg">{errs.rating}</div>}</div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Check-In</label><SingleDatePicker value={form.checkIn||null} onChange={v=>setForm(f=>({...f,checkIn:v||""}))} minDate={trip.startDate||null} maxDate={trip.endDate||null} placeholder="Check-in"/></div>
            <div className="form-group"><label className="form-label">Check-Out</label><SingleDatePicker value={form.checkOut||null} onChange={v=>setForm(f=>({...f,checkOut:v||""}))} minDate={form.checkIn||null} maxDate={trip.endDate||null} placeholder="Check-out"/></div>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><textarea {...F("notes")} className={`form-input form-textarea`} placeholder="Pool, breakfast, distance to beach…"/></div>
          <div className="form-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setShow(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={save}>{editId?"Save Changes":"Add Accommodation"}</button>
          </div>
        </div>
      )}
      {!trip.accommodationOptions.length&&!show
        ?<div className="empty-state"><div>🏨</div>No accommodations yet.</div>
        :<div className="accom-grid">
          {trip.accommodationOptions.map(a=>(
            <div key={a.id} className="accom-card">
              <div className="card-head">
                <div className="card-name">{a.name}</div>
                <div className="card-actions">
                  <button className="btn btn-ghost btn-sm" style={{padding:"4px 9px"}} onClick={()=>openEdit(a)}>✏️</button>
                  <button className="btn btn-danger btn-sm" style={{padding:"4px 9px"}} onClick={()=>del(a.id)}>🗑</button>
                </div>
              </div>
              <div className="card-meta">
                {a.address&&<div className="card-meta-row">📍 <strong>{a.address}</strong></div>}
                {a.priceType==="full"&&a.totalPrice!==""&&<div className="card-meta-row">🧾 <strong>${parseFloat(a.totalPrice).toLocaleString()} full price</strong></div>}
                {a.priceType!=="full"&&a.pricePerNight!==""&&<div className="card-meta-row">💰 <strong>${a.pricePerNight}/night</strong>{calcAccomNights(a)>0&&<> × {calcAccomNights(a)}n = <strong>${calcAccomTotal(a).toLocaleString()}</strong></>}</div>}
                {a.rating!==""&&<div className="card-meta-row"><span className="stars">{renderStars(a.rating)}</span></div>}
                {(a.checkIn||a.checkOut)&&<div className="card-meta-row">🗓️ <strong>{a.checkIn?fmtDate(a.checkIn):"?"}</strong> → <strong>{a.checkOut?fmtDate(a.checkOut):"?"}</strong></div>}
                {((a.upvotes||[]).length>0||(a.downvotes||[]).length>0)&&(()=>{
                  const upV=(a.upvotes||[]).length, downV=(a.downvotes||[]).length, netV=upV-downV;
                  return (
                    <div className="card-meta-row" style={{fontSize:12}}>
                      🗳️ <strong style={{color:"var(--green)"}}>{upV} yes</strong>
                      <span style={{color:"var(--muted)"}}>·</span>
                      <strong style={{color:"var(--red)"}}>{downV} no</strong>
                      {netV!==0&&<span style={{color:netV>0?"var(--green)":"var(--red)",fontWeight:600,marginLeft:4}}>({netV>0?"+":""}{netV} net)</span>}
                    </div>
                  );
                })()}
              </div>
              {a.notes&&<div className="card-notes">{a.notes}</div>}
            </div>
          ))}
        </div>
      }
    </div>
  );
}


// ─── VEHICLE RENTAL TAB ──────────────────────────────────────────────────────
function VehicleTab({trip,setTrip,db}) {
  const [show,setShow]   = useState(false);
  const [editId,setEditId] = useState(null);
  const [form,setForm]   = useState(BLANK_V);
  const [errs,setErrs]   = useState({});
  const rentals = trip.vehicleRentals || [];

  const validate = () => {
    const e = {};
    if(!form.company.trim()) e.company = "Company required";
    if(form.pickupDate && form.returnDate && form.returnDate <= form.pickupDate) e.returnDate = "Must be after pickup";
    if(form.pricePerDay && isNaN(+form.pricePerDay)) e.pricePerDay = "Numeric";
    if(form.rating && (isNaN(+form.rating)||+form.rating<1||+form.rating>5)) e.rating = "1–5";
    if(form.seats && isNaN(+form.seats)) e.seats = "Numeric";
    setErrs(e); return !Object.keys(e).length;
  };

  const openAdd  = () => { setForm(BLANK_V); setEditId(null); setErrs({}); setShow(true); };
  const openEdit = v => {
    setForm({ company:v.company, model:v.model||"", vehicleType:v.vehicleType||"car",
      pickupDate:v.pickupDate||"", returnDate:v.returnDate||"",
      priceType:v.priceType||"daily", price:String(v.price||v.pricePerDay||""),
      rating:String(v.rating||""), pickupLocation:v.pickupLocation||"",
      dropoffLocation:v.dropoffLocation||"", seats:String(v.seats||""),
      transmission:v.transmission||"automatic", notes:v.notes||"", upvotes:v.upvotes||[], downvotes:v.downvotes||[] });
    setEditId(v.id); setErrs({}); setShow(true);
  };

  const save = async () => {
    if(!validate()) return;
    const fmt = { ...form, price:form.price?+form.price:"", pricePerDay:form.price?+form.price:"",
      rating:form.rating?+form.rating:"", seats:form.seats?+form.seats:"" };
    if(editId) {
      const updated = { ...rentals.find(v=>v.id===editId), ...fmt };
      if(db) db.updateVehicle(updated);
      setTrip(t=>({...t, vehicleRentals:t.vehicleRentals.map(v=>v.id===editId?updated:v)}));
    } else {
      const newV = { id:uid(), ...fmt, upvotes:[], downvotes:[] };
      const saved = db ? await db.addVehicle(trip.id, newV) : newV;
      setTrip(t=>({...t, vehicleRentals:[...(t.vehicleRentals||[]), saved]}));
    }
    setShow(false);
  };

  const del = id => {
    if(db) db.deleteVehicle(id);
    setTrip(t=>({...t, vehicleRentals:t.vehicleRentals.filter(v=>v.id!==id)}));
  };

  const F = k => ({ value:form[k], onChange:e=>setForm(f=>({...f,[k]:e.target.value})), className:`form-input${errs[k]?" err":""}` });

  const totalCost = v => v.pricePerDay && v.days ? (v.pricePerDay * v.days).toFixed(0) : null;

  return (
    <div>
      <div className="section-hdr">
        <h4>🚗 Vehicle Rentals</h4>
        <button className="btn btn-accent2 btn-sm" onClick={openAdd}>+ Add Option</button>
      </div>
      <p className="text-muted" style={{marginBottom:14}}>Compare rental options — these also appear in voting.</p>
      {show && (
        <div className="inline-form">
          <h5>{editId?"Edit Vehicle":"New Vehicle Rental"}</h5>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Company *</label><input {...F("company")} placeholder="e.g. Hertz, Enterprise"/>{errs.company&&<div className="err-msg">{errs.company}</div>}</div>
            <div className="form-group"><label className="form-label">Model</label><input {...F("model")} placeholder="e.g. Toyota Corolla"/></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select {...F("vehicleType")} className="form-input">
                <option value="car">🚗 Car</option>
                <option value="suv">🚙 SUV</option>
                <option value="van">🚐 Van</option>
                <option value="motorcycle">🏍️ Motorcycle</option>
                <option value="scooter">🛵 Scooter</option>
                <option value="bus">🚌 Bus/Minibus</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Transmission</label>
              <select {...F("transmission")} className="form-input">
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pickup Date</label>
              <SingleDatePicker value={form.pickupDate||null} onChange={v=>setForm(f=>({...f,pickupDate:v||""}))} minDate={trip.startDate||null} maxDate={trip.endDate||null} placeholder="Pickup date"/>
            </div>
            <div className="form-group">
              <label className="form-label">Return Date</label>
              <SingleDatePicker value={form.returnDate||null} onChange={v=>setForm(f=>({...f,returnDate:v||""}))} minDate={form.pickupDate||trip.startDate||null} maxDate={trip.endDate||null} placeholder="Return date"/>
              {errs.returnDate&&<div className="err-msg">{errs.returnDate}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pricing</label>
              <div style={{display:"flex",gap:8}}>
                <button type="button"
                  className={`btn btn-sm ${form.priceType==="daily"?"btn-primary":"btn-ghost"}`}
                  style={{flex:1}}
                  onClick={()=>setForm(f=>({...f,priceType:"daily"}))}>
                  💰 Daily Rate
                </button>
                <button type="button"
                  className={`btn btn-sm ${form.priceType==="full"?"btn-primary":"btn-ghost"}`}
                  style={{flex:1}}
                  onClick={()=>setForm(f=>({...f,priceType:"full"}))}>
                  🧾 Full Price
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{form.priceType==="full"?"Total Price ($)":"Price/Day ($)"}</label>
              <input {...F("price")} placeholder={form.priceType==="full"?"e.g. 350":"e.g. 45"}/>
              {form.priceType==="daily"&&calcVehicleDays({pickupDate:form.pickupDate,returnDate:form.returnDate})>0&&(
                <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>
                  ~${(+(form.price||0)*calcVehicleDays({pickupDate:form.pickupDate,returnDate:form.returnDate})).toLocaleString()} total for {calcVehicleDays({pickupDate:form.pickupDate,returnDate:form.returnDate})} days
                </div>
              )}
            </div>
            <div className="form-group"><label className="form-label">Rating (1–5)</label><input {...F("rating")} placeholder="4.5"/>{errs.rating&&<div className="err-msg">{errs.rating}</div>}</div>
            <div className="form-group"><label className="form-label">Seats</label><input {...F("seats")} placeholder="5"/>{errs.seats&&<div className="err-msg">{errs.seats}</div>}</div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Pickup Location</label><input {...F("pickupLocation")} placeholder="e.g. Airport Terminal 2"/></div>
            <div className="form-group"><label className="form-label">Drop-off Location</label><input {...F("dropoffLocation")} placeholder="Same or different"/></div>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><textarea {...F("notes")} className="form-input form-textarea" placeholder="Unlimited mileage, insurance included, fuel policy…"/></div>
          <div className="form-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setShow(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={save}>{editId?"Save Changes":"Add Rental"}</button>
          </div>
        </div>
      )}
      {rentals.length === 0 && !show
        ? <div className="empty-state"><div>🚗</div>No vehicle options yet. Add your first rental above!</div>
        : <div className="accom-grid">
            {rentals.map(v => {
              const cost = totalCost(v);
              const VTYPE = {car:"🚗",suv:"🚙",van:"🚐",motorcycle:"🏍️",scooter:"🛵",bus:"🚌"};
              return (
                <div key={v.id} className="accom-card">
                  <div className="card-head">
                    <div className="card-name">{VTYPE[v.vehicleType]||"🚗"} {v.company}{v.model&&` — ${v.model}`}</div>
                    <div className="card-actions">
                      <button className="btn btn-ghost btn-sm" style={{padding:"4px 9px"}} onClick={()=>openEdit(v)}>✏️</button>
                      <button className="btn btn-danger btn-sm" style={{padding:"4px 9px"}} onClick={()=>del(v.id)}>🗑</button>
                    </div>
                  </div>
                  <div className="card-meta">
                    {v.pickupLocation&&<div className="card-meta-row">📍 <strong>{v.pickupLocation}</strong>{v.dropoffLocation&&v.dropoffLocation!==v.pickupLocation&&<> → <strong>{v.dropoffLocation}</strong></>}</div>}
                    {(v.pickupDate||v.returnDate)&&<div className="card-meta-row">📅 <strong>{v.pickupDate?fmtDate(v.pickupDate):"?"}</strong> → <strong>{v.returnDate?fmtDate(v.returnDate):"?"}</strong></div>}
                  <div className="card-meta-row" style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                      {calcVehicleDays(v)>0&&<span>📆 <strong>{calcVehicleDays(v)} day{calcVehicleDays(v)!==1?"s":""}</strong></span>}
                      {(v.price||v.pricePerDay)>0&&<span>💰 <strong>${v.price||v.pricePerDay}{v.priceType==="full"?" total":"/day"}</strong></span>}
                      {v.priceType==="daily"&&calcVehicleTotal(v)>0&&<span>🧾 <strong>~${calcVehicleTotal(v).toLocaleString()} total</strong></span>}
                    </div>
                    {v.seats&&<div className="card-meta-row">💺 <strong>{v.seats} seats</strong> · {v.transmission}</div>}
                    {v.rating&&<div className="card-meta-row"><span className="stars">{renderStars(v.rating)}</span></div>}
                    {((v.upvotes||[]).length>0||(v.downvotes||[]).length>0)&&(()=>{
                      const upV=(v.upvotes||[]).length, downV=(v.downvotes||[]).length, netV=upV-downV;
                      return (
                        <div className="card-meta-row" style={{fontSize:12}}>
                          🗳️ <strong style={{color:"var(--green)"}}>{upV} yes</strong>
                          <span style={{color:"var(--muted)"}}>·</span>
                          <strong style={{color:"var(--red)"}}>{downV} no</strong>
                          {netV!==0&&<span style={{color:netV>0?"var(--green)":"var(--red)",fontWeight:600,marginLeft:4}}>({netV>0?"+":""}{netV} net)</span>}
                        </div>
                      );
                    })()}
                  </div>
                  {v.notes&&<div className="card-notes">{v.notes}</div>}
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}

// ─── TRIP INFO TAB ────────────────────────────────────────────────────────────
function TripInfoTab({trip,setTrip,db}) {
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState({name:trip.name,destination:trip.destinations[0]?.name||"",startDate:trip.startDate||"",endDate:trip.endDate||"",description:trip.description||"",status:trip.status||"planning"});
  const [errs,setErrs] = useState({});
  useMemo(()=>setForm({name:trip.name,destination:trip.destinations[0]?.name||"",startDate:trip.startDate||"",endDate:trip.endDate||"",description:trip.description||"",status:trip.status||"planning"}),[trip.id]);

  const validate=()=>{
    const e={};
    if(!form.name.trim()) e.name="Required";
    if(!form.destination.trim()) e.destination="Required";
    if(!form.startDate) e.dates="Start date required";
    else if(!form.endDate) e.dates="End date required";
    else if(form.endDate<=form.startDate) e.dates="End must be after start";
    setErrs(e); return !Object.keys(e).length;
  };

  const save=()=>{
    if(!validate()) return;
    if(db) db.updateTrip(trip.id, {
      title:       form.name.trim(),
      destination: form.destination.trim() || null,
      start_date:  form.startDate,
      end_date:    form.endDate,
      description: form.description,
      status:      form.status,
    });
    setTrip(t=>({...t,name:form.name.trim(),startDate:form.startDate,endDate:form.endDate,description:form.description,status:form.status,
      destinations:t.destinations.map((d,i)=>i===0?{...d,name:form.destination.trim()}:d)}));
    setEditing(false);
  };
  const cancel=()=>{setForm({name:trip.name,destination:trip.destinations[0]?.name||"",startDate:trip.startDate||"",endDate:trip.endDate||"",description:trip.description||"",status:trip.status||"planning"});setErrs({});setEditing(false);};

  return (
    <div>
      <div className="info-panel">
        <div className="info-panel-header">
          <h4>ℹ️ Trip Information</h4>
          {!editing
            ?<button className="btn btn-ghost btn-sm" onClick={()=>setEditing(true)}>✏️ Edit</button>
            :<div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost btn-sm" onClick={cancel}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={save}>Save Changes</button>
            </div>
          }
        </div>
        {!editing?(
          <div className="info-view-grid">
            <div className="info-view-cell"><div className="info-view-label">Trip Name</div><div className="info-view-val">{trip.name}</div></div>
            <div className="info-view-cell"><div className="info-view-label">Destination</div><div className="info-view-val">{trip.destinations[0]?.name||"—"}</div></div>
            <div className="info-view-cell"><div className="info-view-label">Start Date</div><div className="info-view-val">{trip.startDate?fmtDate(trip.startDate):"—"}</div></div>
            <div className="info-view-cell"><div className="info-view-label">End Date</div><div className="info-view-val">{trip.endDate?fmtDate(trip.endDate):"—"}</div></div>
            <div className="info-view-cell"><div className="info-view-label">Duration</div><div className="info-view-val">{trip.startDate&&trip.endDate?`${nightsBetween(trip.startDate,trip.endDate)} nights`:"-"}</div></div>
            <div className="info-view-cell"><div className="info-view-label">Status</div><div className="info-view-val">
              {trip.status==="confirmed"
                ? <span className="badge badge-green">✓ Confirmed</span>
                : <span className="badge badge-yellow">⏳ Planning</span>}
            </div></div>
            <div className="info-view-cell full"><div className="info-view-label">Members</div><div className="members-row" style={{marginTop:8}}>{trip.members.map(m=><span key={m} className="member-chip">{m}</span>)}</div></div>
          </div>
        ):(
          <div className="info-edit-body">
            <div className="form-group"><label className="form-label">Trip Name *</label><input className={`form-input${errs.name?" err":""}`} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Spring Break 2026"/>{errs.name&&<div className="err-msg">{errs.name}</div>}</div>
            <div className="form-group"><label className="form-label">Destination *</label><input className={`form-input${errs.destination?" err":""}`} value={form.destination} onChange={e=>setForm(f=>({...f,destination:e.target.value}))} placeholder="e.g. Cancun, Mexico"/>{errs.destination&&<div className="err-msg">{errs.destination}</div>}</div>
            <div className="form-group"><label className="form-label">Trip Dates *</label>{errs.dates&&<div className="err-msg" style={{marginBottom:8}}>{errs.dates}</div>}<DatePicker startDate={form.startDate||null} endDate={form.endDate||null} onChange={(s,e)=>setForm(f=>({...f,startDate:s||"",endDate:e||""}))}/></div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <div style={{display:"flex",gap:8}}>
                {[
                  {value:"planning",  label:"⏳ Planning"},
                  {value:"confirmed", label:"✓ Confirmed"},
                ].map(s=>(
                  <button
                    key={s.value}
                    type="button"
                    onClick={()=>setForm(f=>({...f,status:s.value}))}
                    style={{
                      padding:"7px 20px",
                      borderRadius:7,
                      border:"1.5px solid",
                      cursor:"pointer",
                      fontFamily:"Inter,sans-serif",
                      fontSize:13,
                      fontWeight:600,
                      transition:"all 0.15s",
                      ...(form.status===s.value
                        ? s.value==="planning"
                          ? {background:"rgba(160,112,0,0.12)",color:"#a07000",borderColor:"rgba(160,112,0,0.30)"}
                          : {background:"rgba(30,122,69,0.12)",color:"#1e7a45",borderColor:"rgba(30,122,69,0.28)"}
                        : {background:"transparent",color:"var(--muted)",borderColor:"var(--border)"}),
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input form-textarea" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Any notes…"/></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COUNTRY TAB ─────────────────────────────────────────────────────────────
function CountryTab({trip,setTrip,db,user}) {
  const c=trip.country||{};
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState({visa:c.visa||"",passport:c.passport||"",advisory:c.advisory||"",currency:c.currency||"",language:c.language||"",notes:c.notes||""});
  useMemo(()=>{const cc=trip.country||{};setForm({visa:cc.visa||"",passport:cc.passport||"",advisory:cc.advisory||"",currency:cc.currency||"",language:cc.language||"",notes:cc.notes||""});},[trip.id]);

  // ── Documents state ──
  const [docs, setDocs] = useState(trip.documents||[]);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef(null);
  useMemo(()=>setDocs(trip.documents||[]),[trip.id]);

  const save=()=>{
    if(db) db.updateTrip(trip.id, { country_info: {...form, destination_votes: trip.country?.destination_votes} });
    setTrip(t=>({...t,country:{...(t.country||{}),...form}}));
    setEditing(false);
  };

  // ── Upload handler ──
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const allowed = ["image/jpeg","image/png","image/gif","image/webp","application/pdf"];
    if(!allowed.includes(file.type)) { setUploadErr("Only images (JPG, PNG, GIF, WebP) and PDFs are supported."); return; }
    if(file.size > 20 * 1024 * 1024) { setUploadErr("File must be under 20MB."); return; }
    setUploadErr(""); setUploading(true); setUploadSuccess("");
    try {
      if(!db?.isMock) {
        const ext = file.name.split(".").pop();
        const path = `${trip.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
        const { error: upErr } = await supabase.storage.from("trip-files").upload(path, file, { upsert: false });
        if(upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("trip-files").getPublicUrl(path);
        const newDoc = { id: uid(), name: file.name, size: file.size, type: file.type, path, url: publicUrl, uploadedBy: user, uploadedAt: new Date().toISOString() };
        const updatedDocs = [...docs, newDoc];
        await supabase.from("trips").update({ documents: updatedDocs }).eq("id", trip.id);
        setDocs(updatedDocs);
        setTrip(t=>({...t, documents: updatedDocs}));
        setUploadSuccess(`"${file.name}" uploaded successfully.`);
        setTimeout(()=>setUploadSuccess(""),3500);
      } else {
        // Demo mode — store as blob URL
        const url = URL.createObjectURL(file);
        const newDoc = { id: uid(), name: file.name, size: file.size, type: file.type, path: file.name, url, uploadedBy: user, uploadedAt: new Date().toISOString() };
        const updatedDocs = [...docs, newDoc];
        setDocs(updatedDocs);
        setTrip(t=>({...t, documents: updatedDocs}));
        setUploadSuccess(`"${file.name}" uploaded successfully.`);
        setTimeout(()=>setUploadSuccess(""),3500);
      }
    } catch(err) {
      setUploadErr(`Upload failed: ${err.message||"Please try again."}`);
    } finally {
      setUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (doc) => {
    const updatedDocs = docs.filter(d=>d.id!==doc.id);
    if(!db?.isMock) {
      await supabase.storage.from("trip-files").remove([doc.path]);
      await supabase.from("trips").update({ documents: updatedDocs }).eq("id", trip.id);
    }
    setDocs(updatedDocs);
    setTrip(t=>({...t, documents: updatedDocs}));
  };

  const fmtSize = (bytes) => {
    if(bytes < 1024) return `${bytes} B`;
    if(bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/(1024*1024)).toFixed(1)} MB`;
  };

  const FIELDS=[{key:"visa",icon:"🛂",label:"Visa Requirements"},{key:"passport",icon:"📘",label:"Passport Validity"},{key:"advisory",icon:"⚠️",label:"Travel Advisory"},{key:"currency",icon:"💱",label:"Currency"},{key:"language",icon:"🗣️",label:"Language"}];

  return (
    <div>
      {/* ── Entry Requirements ── */}
      <div className="country-card" style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h4 style={{fontFamily:"Inter",fontSize:18,fontWeight:700,margin:0}}>🌍 Entry Requirements and Documents</h4>
          {!editing && <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(true)}>✏️ Edit</button>}
          {editing && <div style={{display:"flex",gap:8}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={save}>Save</button>
          </div>}
        </div>
        {!editing && FIELDS.map(f=>(
          <div key={f.key} className="info-row"><span className="info-icon">{f.icon}</span><div><div className="info-lbl">{f.label}</div><div className="info-txt">{form[f.key]||<span style={{color:"var(--muted)",fontStyle:"italic"}}>Not set</span>}</div></div></div>
        ))}
        {editing && <>
          {FIELDS.map(f=>(
            <div key={f.key} className="form-group"><label className="form-label">{f.icon} {f.label}</label><input className="form-input" value={form[f.key]} onChange={e=>setForm(ff=>({...ff,[f.key]:e.target.value}))} placeholder={`Enter ${f.label.toLowerCase()}…`}/></div>
          ))}
          <div className="form-group"><label className="form-label">📝 Notes</label><textarea className="form-input form-textarea" value={form.notes} onChange={e=>setForm(ff=>({...ff,notes:e.target.value}))} placeholder="Additional details…"/></div>
        </>}
      </div>

      {/* ── Documents ── */}
      <div className="country-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h4 style={{fontFamily:"Inter",fontSize:18,fontWeight:700,margin:0}}>📎 Trip Documents</h4>
          <span style={{fontSize:12,color:"var(--muted)"}}>Images & PDFs · visible to all members</span>
        </div>

        {/* Upload area */}
        <div
          onClick={()=>!uploading&&fileInputRef.current?.click()}
          style={{
            border:"2px dashed var(--border-strong)",borderRadius:12,padding:"28px 20px",
            textAlign:"center",cursor:uploading?"not-allowed":"pointer",
            background:uploading?"var(--surface2)":"var(--surface)",
            transition:"all 0.18s",marginBottom:16,
          }}
          onMouseEnter={e=>{if(!uploading)e.currentTarget.style.borderColor="var(--accent)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border-strong)";}}
        >
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={handleUpload} disabled={uploading}/>
          <div style={{fontSize:28,marginBottom:8}}>{uploading?"⏳":"📤"}</div>
          <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>
            {uploading?"Uploading…":"Click to upload a file"}
          </div>
          <div style={{fontSize:12,color:"var(--muted)"}}>Images (JPG, PNG, GIF, WebP) or PDF · max 20MB · one at a time</div>
        </div>

        {uploadErr && <div style={{fontSize:12,color:"var(--red)",background:"var(--red-soft)",border:"1px solid rgba(192,57,43,0.18)",borderRadius:8,padding:"8px 12px",marginBottom:12}}>⚠️ {uploadErr}</div>}
        {uploadSuccess && <div style={{fontSize:12,color:"var(--green)",background:"var(--green-soft)",border:"1px solid rgba(30,122,69,0.18)",borderRadius:8,padding:"8px 12px",marginBottom:12}}>✅ {uploadSuccess}</div>}

        {/* File list */}
        {docs.length === 0
          ? <div style={{textAlign:"center",padding:"20px 0",color:"var(--muted)",fontSize:13}}>No documents uploaded yet.</div>
          : <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {docs.map(doc=>{
                const isPdf = doc.type==="application/pdf" || doc.name.toLowerCase().endsWith(".pdf");
                return (
                  <div key={doc.id} style={{display:"flex",alignItems:"center",gap:12,background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"11px 14px"}}>
                    <div style={{fontSize:24,flexShrink:0}}>{isPdf?"📄":"🖼️"}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>
                        {fmtSize(doc.size)} · by {doc.uploadedBy} · {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ""}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:7,flexShrink:0}}>
                      <a href={doc.url} target="_blank" rel="noreferrer" download={doc.name}
                        style={{padding:"5px 12px",borderRadius:7,background:"var(--accent-soft)",color:"var(--accent)",border:"1px solid rgba(201,106,40,0.2)",fontSize:11,fontWeight:600,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4}}>
                        ⬇️ Download
                      </a>
                      <button onClick={()=>handleDelete(doc)}
                        style={{padding:"5px 10px",borderRadius:7,background:"var(--red-soft)",color:"var(--red)",border:"1px solid rgba(192,57,43,0.16)",fontSize:11,fontWeight:600,cursor:"pointer"}}>
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
        }
      </div>
    </div>
  );
}

// ─── MEMBERS TAB ─────────────────────────────────────────────────────────────
function MembersTab({trip,setTrip,user,db,onLeave,authUserId,joinRequests,onAcceptRequest,onRejectRequest}) {
  const [emailInput,setEmailInput] = useState("");
  const [emailErr,setEmailErr] = useState("");
  const [invitedEmails,setInvitedEmails] = useState([]);
  const [copied,setCopied] = useState(false);
  const [sendingInvite,setSendingInvite] = useState(false);
  const [inviteSuccess,setInviteSuccess] = useState("");

  const tripLink = `${window.location.origin}/join/${trip.id}`;

  // Safely build members list
  const members = (trip.tripMembers && trip.tripMembers.length > 0)
    ? trip.tripMembers
    : (trip.members || []).map((name, i) => ({
        userId: name, name, role: i === 0 ? "admin" : "member",
        joinedAt: trip.startDate || "2026-01-01"
      }));

  const isOwner = members.find(m => m.userId === authUserId)?.role === "admin";

  const sendInvite = async () => {
    const email = emailInput.trim().toLowerCase();
    if(!email) { setEmailErr("Enter an email address"); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr("Enter a valid email address"); return; }
    if(invitedEmails.find(i => i.email === email)) { setEmailErr("Already invited"); return; }
    setEmailErr(""); setSendingInvite(true); setInviteSuccess("");

    if(!db?.isMock) {
      // Insert invite notification — the invited user will see this when they log in
      const { error } = await supabase.from("notifications").insert({
        user_id:  authUserId,
        trip_id:  trip.id,
        type:     "member_joined",
        message:  `Invite sent to ${email} for "${trip.name}"`,
        metadata: { invited_email: email, invited_by: user, invite_type: "email", trip_name: trip.name, status: "pending" },
      });
      if(error) { setEmailErr("Failed to send invite. Try again."); setSendingInvite(false); return; }
    }

    setInvitedEmails(prev => [...prev, { id: uid(), email, status: "pending" }]);
    setEmailInput("");
    setInviteSuccess(`Invite sent to ${email}!`);
    setTimeout(() => setInviteSuccess(""), 3000);
    setSendingInvite(false);
  };

  const removeInvite = (id) => setInvitedEmails(prev => prev.filter(i => i.id !== id));

  const copyLink = () => {
    navigator.clipboard.writeText(tripLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const pendingRequests = (joinRequests || []).filter(r => r.tripId === trip.id);

  return (
    <div>
      {/* ── Join Requests (owner only) ── */}
      {isOwner && pendingRequests.length > 0 && (
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:12}}>
            <h4 style={{fontFamily:"'Inter',sans-serif",fontSize:16,fontWeight:700,margin:0}}>🔔 Join Requests</h4>
            <span style={{padding:"2px 8px",borderRadius:"var(--r-full)",background:"var(--red-soft)",color:"var(--red)",fontSize:11,fontWeight:700,border:"1px solid rgba(255,59,48,0.18)"}}>{pendingRequests.length}</span>
          </div>
          {pendingRequests.map(req => (
            <div key={req.id} className="join-request-card">
              <div className="join-request-avatar">{(req.requesterName||req.requesterEmail||"?")[0].toUpperCase()}</div>
              <div className="join-request-info">
                <div className="join-request-name">{req.requesterName || req.requesterEmail}</div>
                <div className="join-request-meta">{req.requesterEmail} · Requested {fmtDate(req.requestedAt)}</div>
              </div>
              <div className="join-request-actions">
                <button className="btn btn-sm" style={{background:"var(--green-soft)",color:"var(--green)",border:"1px solid rgba(36,138,61,0.22)",fontWeight:600}}
                  onClick={() => onAcceptRequest(req)}>✓ Accept</button>
                <button className="btn btn-sm" style={{background:"var(--red-soft)",color:"var(--red)",border:"1px solid rgba(255,59,48,0.18)",fontWeight:600}}
                  onClick={() => onRejectRequest(req)}>✕ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Members List ── */}
      <div className="section-hdr" style={{marginBottom:14}}>
        <h4>👥 Trip Members</h4>
        <span className="badge">{members.length}</span>
      </div>
      <div className="members-tab">
        {members.map(m => {
          const isMe = m.userId === (authUserId || user);
          const isOwnerMember = m.role === "admin";
          const otherCount = members.filter(x => x.userId !== m.userId).length;
          const canLeave = !isOwnerMember || otherCount === 0;
          const leaveLabel = isOwnerMember ? "Leave & Delete" : "Leave Trip";
          const leaveTitle = isOwnerMember && otherCount > 0
            ? `Remove all ${otherCount} member(s) before leaving`
            : isOwnerMember ? "Leaving will delete this trip"
            : "Leave this trip";
          return (
            <div key={m.userId} className="member-row">
              <div className={`member-avatar ${m.role==="admin"?"owner":m.role==="viewer"?"viewer":""}`}>{(m.name||m.userId||"?")[0].toUpperCase()}</div>
              <div className="member-info">
                <div className="member-name">{m.name||m.userId}{isMe&&<span style={{fontSize:11,color:"var(--muted)",fontWeight:400}}> (you)</span>}</div>
                <div className="member-meta">Joined {m.joinedAt?fmtDate(m.joinedAt):"recently"}</div>
              </div>
              <span className={`role-badge role-${m.role}`}>{m.role==="admin"?"👑 Owner":m.role==="member"?"👤 Member":"👁 Viewer"}</span>
              {isMe && (
                <button className="btn btn-danger btn-sm"
                  style={{marginLeft:8,padding:"3px 10px",fontSize:12,opacity:canLeave?1:0.45,cursor:canLeave?"pointer":"not-allowed"}}
                  title={leaveTitle}
                  onClick={() => { if(!canLeave){alert(leaveTitle);return;} onLeave&&onLeave(); }}>
                  {leaveLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Invite by Email ── */}
      <div className="invite-panel" style={{marginTop:22}}>
        <h5>✉️ Invite by Email</h5>
        {members.length >= 10 && (
          <div style={{display:"flex",alignItems:"flex-start",gap:8,background:"rgba(196,124,10,0.08)",border:"1px solid rgba(196,124,10,0.22)",borderRadius:10,padding:"10px 13px",marginBottom:12}}>
            <span style={{fontSize:16,flexShrink:0}}>💡</span>
            <p style={{fontSize:13,color:"var(--yellow)",margin:0,lineHeight:1.5}}>
              <strong>Large groups can be harder to coordinate</strong> — TripSync works best for groups under 10. You can still invite more, but decisions may take longer to reach consensus.
            </p>
          </div>
        )}
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:12,lineHeight:1.5}}>Invited members can join the trip immediately from their home page.</p>
        <div style={{display:"flex",gap:8,marginBottom:4}}>
          <input
            className={`form-input${emailErr?" err":""}`}
            style={{flex:1}}
            placeholder="friend@email.com"
            value={emailInput}
            onChange={e=>{setEmailInput(e.target.value);setEmailErr("");}}
            onKeyDown={e=>e.key==="Enter"&&sendInvite()}
          />
          <button className="btn btn-primary btn-sm" onClick={sendInvite} disabled={sendingInvite}>
            {sendingInvite?"Sending…":"Send Invite"}
          </button>
        </div>
        {emailErr && <div className="err-msg">{emailErr}</div>}
        {inviteSuccess && <div style={{fontSize:12,color:"var(--green)",fontWeight:600,marginTop:4}}>✓ {inviteSuccess}</div>}
        {invitedEmails.length > 0 && (
          <div style={{marginTop:12}}>
            {invitedEmails.map(inv => (
              <div key={inv.id} className="invite-sent-row">
                <span className="invite-sent-email">
                  <span style={{fontSize:14}}>✉️</span> {inv.email}
                </span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className={`invite-sent-status ${inv.status==="joined"?"invite-status-joined":"invite-status-pending"}`}>
                    {inv.status==="joined"?"✓ Joined":"Pending"}
                  </span>
                  {inv.status!=="joined" && (
                    <button className="ci-btn del" onClick={()=>removeInvite(inv.id)} title="Cancel invite">✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Share Link ── */}
      <div className="invite-panel" style={{marginTop:12}}>
        <h5>🔗 Share Trip Link</h5>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:12,lineHeight:1.5}}>Anyone with the link can request to join. You'll see their request above and can accept or reject it.</p>
        <div className="invite-box">
          <span className="invite-link">{tripLink}</span>
          <button className="btn btn-ghost btn-sm" onClick={copyLink}>
            {copied?"✓ Copied!":"Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SUMMARY TAB ─────────────────────────────────────────────────────────────
function SummaryTab({trip}) {
  const topDest=[...trip.destinations].sort((a,b)=>
    ((b.upvotes||[]).length-(b.downvotes||[]).length) -
    ((a.upvotes||[]).length-(a.downvotes||[]).length)
  )[0];
  const nights=nightsBetween(trip.startDate,trip.endDate);
  const items=trip.calendarItems||[];
  const ciTotal=items.reduce((s,c)=>s+(c.price||0),0);
  const accomTotal=calcAllAccomTotal(trip.accommodationOptions||[]);
  const vehicleTotal=calcAllVehicleTotal(trip.vehicleRentals||[]);
  const grandTotal=ciTotal+accomTotal+vehicleTotal;
  const VTYPE={car:"🚗",suv:"🚙",van:"🚐",motorcycle:"🏍️",scooter:"🛵",bus:"🚌"};
  return (
    <div className="summary-card">
      <div className="flex-between" style={{marginBottom:6}}>
        <div>
          <p style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Final Trip Summary</p>
          <h3 className="summary-title">{trip.name}</h3>
        </div>
        <span className={`badge ${trip.status==="confirmed"?"badge-green":"badge-yellow"}`}>{trip.status==="confirmed"?"✓ Confirmed":"⏳ Planning"}</span>
      </div>
      <div className="summary-grid">
        <div className="summary-item"><label>📍 Destination</label><div className="val">{topDest?.name}</div></div>
        <div className="summary-item"><label>📅 Dates</label><div className="val" style={{fontSize:14}}>{fmtRange(trip.startDate,trip.endDate)}</div>{nights>0&&<div className="text-sm" style={{color:"var(--muted)",marginTop:4}}>{nights} nights</div>}</div>
        <div className="summary-item"><label>💰 Total Cost</label><div className="val">${grandTotal.toLocaleString()}</div><div className="text-sm" style={{color:"var(--muted)",marginTop:4}}>${Math.ceil(grandTotal/(trip.members.length||1))}/person</div></div>
        <div className="summary-item"><label>🎯 Items Planned</label><div className="val">{items.length}</div></div>
      </div>
      {trip.accommodationOptions?.length>0&&<div className="mt-6"><label style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1}}>🏨 Accommodations</label><div className="tag-wrap">{trip.accommodationOptions.map(a=><span key={a.id} className="tag" style={{background:"rgba(129,140,248,0.08)",borderColor:"rgba(74,111,165,0.22)",color:"#4a6fa5"}}>{a.name}{a.priceType==="full"&&a.totalPrice?` · $${parseFloat(a.totalPrice).toLocaleString()} full`:a.pricePerNight?` · $${a.pricePerNight}/night`:""}{a.priceType!=="full"&&calcAccomNights(a)>0?` × ${calcAccomNights(a)}n`:""}{calcAccomTotal(a)>0?` = $${calcAccomTotal(a).toLocaleString()}`:""}</span>)}</div></div>}
      {(trip.vehicleRentals||[]).length>0&&<div className="mt-6"><label style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1}}>🚗 Vehicle Rentals</label><div className="tag-wrap">{(trip.vehicleRentals||[]).map(v=>{const ppd=parseFloat(v.price||v.pricePerDay)||0;const days=calcVehicleDays(v);const tot=calcVehicleTotal(v);return(<span key={v.id} className="tag" style={{borderColor:"rgba(249,115,22,0.25)",color:"#f97316",background:"rgba(249,115,22,0.08)"}}>{VTYPE[v.vehicleType]||"🚗"} {v.company}{v.model?` — ${v.model}`:""}{v.priceType==="full"&&ppd>0?` · $${ppd} full`:ppd>0&&days>0?` · $${ppd}/day × ${days}d = $${tot.toLocaleString()}`:ppd>0?` · $${ppd}/day`:""}</span>);})}</div></div>}
      {items.length>0&&<div className="mt-6"><label style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1}}>🎯 All Items</label><div className="tag-wrap">{items.map(c=><span key={c.id} className="tag">{TYPE_META[c.type]?.icon} {c.title}{c.price>0?` · $${c.price}${c.priceType==="per_person"?"/person":" total"}`:""}</span>)}</div></div>}
      <div className="mt-6"><label style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1}}>👥 Members</label><div className="members-row mt-2">{trip.members.map(m=><span key={m} className="member-chip">{m}</span>)}</div></div>
    </div>
  );
}

// ─── NEW TRIP MODAL ───────────────────────────────────────────────────────────
function NewTripModal({onClose,onCreate,user}) {
  const [form,setForm] = useState({name:"",destinations:"",budget:""});
  const [startDate,setStart] = useState(null);
  const [endDate,setEnd] = useState(null);
  const [errs,setErrs] = useState({});
  const [busy,setBusy] = useState(false);
  const [submitErr,setSubmitErr] = useState("");
  const submit=async()=>{
    const e={};
    if(!form.name.trim()) e.name="Required";
    if(!startDate) e.dates="Select start date";
    else if(!endDate) e.dates="Select end date";
    setErrs(e); if(Object.keys(e).length) return;
    setSubmitErr(""); setBusy(true);
    const dests=form.destinations.split(",").map(d=>d.trim()).filter(Boolean).map((d,i)=>({id:i+1,name:d,upvotes:[],downvotes:[]}));
    try {
      await onCreate({
        id:uid(),name:form.name.trim(),status:"planning",
        startDate,endDate,budgetLimit:null,
        members:[user],
        tripMembers:[{userId:user,name:user,role:"admin",joinedAt:toYMD(new Date())}],
        destinations:dests.length?dests:[{id:1,name:"TBD",upvotes:[],downvotes:[]}],
        budgets:{"$300–500":0,"$500–800":0,"$800+":0},
        accommodations:[],accommodationOptions:[],calendarItems:[],
        availability:{},country:null,googleMapsUrl:""
      });
    } catch(err) {
      setSubmitErr("Failed to create trip — check your connection and try again.");
      setBusy(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
        <h3>✦ Create New Trip</h3>
        <div className="form-group"><label className="form-label">Trip Name *</label><input className={`form-input${errs.name?" err":""}`} placeholder="e.g. Spring Break 2026" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>{errs.name&&<div className="err-msg">{errs.name}</div>}</div>
        <div className="form-group"><label className="form-label">Destinations (comma separated)</label><input className="form-input" placeholder="e.g. Miami, Cancun" value={form.destinations} onChange={e=>setForm(f=>({...f,destinations:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Trip Dates *</label>{errs.dates&&<div className="err-msg" style={{marginBottom:8}}>{errs.dates}</div>}<DatePicker startDate={startDate} endDate={endDate} onChange={(s,e)=>{setStart(s);setEnd(e);}}/></div>
        {submitErr&&<div className="err-msg" style={{marginBottom:8,textAlign:"center"}}>{submitErr}</div>}
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={busy}>{busy?"Creating…":"Create Trip →"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
// ── Demo trip shown to every new user so they can explore the app ──
const DEMO_TRIP = {
  id:"demo-barcelona", name:"Study Abroad Weekend – Barcelona", status:"confirmed", isDemo:true,
  startDate:"2025-10-17", endDate:"2025-10-21",
  budgetLimit:1500, googleMapsUrl:"https://www.google.com/maps/d/embed?mid=1BwLTXJGSLCYBDaWQFsrJIqX5tFjZGzo",
  members:["Alex","Jamie","Sam","Taylor","Morgan"],
  tripMembers:[
    {userId:"Alex",name:"Alex",role:"admin",joinedAt:"2025-06-01"},
    {userId:"Jamie",name:"Jamie",role:"editor",joinedAt:"2025-06-02"},
    {userId:"Sam",name:"Sam",role:"editor",joinedAt:"2025-06-03"},
    {userId:"Taylor",name:"Taylor",role:"editor",joinedAt:"2025-06-04"},
    {userId:"Morgan",name:"Morgan",role:"viewer",joinedAt:"2025-06-05"},
  ],
  destinations:[
    {id:1,name:"Barcelona 🇪🇸",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[]},
    {id:2,name:"Madrid 🏛️",upvotes:["Morgan","Taylor"],downvotes:["Alex","Jamie"]},
    {id:3,name:"Seville 🌺",upvotes:["Jamie"],downvotes:["Sam"]},
  ],
  budgets:{"$300–500":1,"$500–800":2,"$800+":2},
  personalBudgets:{Alex:900,Jamie:750,Sam:800,Taylor:950,Morgan:700},
  accommodations:[],
  accommodationOptions:[
    {id:30,name:"Eixample Design Apartment",address:"Carrer de Provença 200, Barcelona",pricePerNight:210,rating:4.9,checkIn:"2025-10-17",checkOut:"2025-10-21",notes:"Rooftop terrace, sleeps 5, near Sagrada Família. VOTED FAVOURITE ✓",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[]},
    {id:31,name:"Gothic Quarter Hostel — Private Room",address:"Carrer dels Escudellers 18, Barcelona",pricePerNight:95,rating:4.3,checkIn:"2025-10-17",checkOut:"2025-10-21",notes:"Central location, breakfast included, tight on space.",upvotes:["Jamie","Sam"],downvotes:["Alex","Taylor","Morgan"]},
    {id:32,name:"Barceloneta Beach Hotel",address:"Passeig de Joan de Borbó 80, Barcelona",pricePerNight:185,rating:4.6,checkIn:"2025-10-17",checkOut:"2025-10-21",notes:"Ocean views, rooftop pool, 5 min walk to beach.",upvotes:["Alex","Taylor","Morgan"],downvotes:["Jamie"]},
  ],
  calendarItems:[
    // ── Day 1: Arrival — Oct 17 ──
    {id:50,type:"transport",title:"Flight Arrival — El Prat Airport (T1)",day:"2025-10-17",startTime:"11:30",startMin:690,durationMin:30,location:"Barcelona–El Prat Airport, Terminal 1",price:0,metadata:{notes:"All 5 meeting at arrivals. Alex lands 11:30, others 12:00.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Alex",transportationTime:30}},
    {id:51,type:"transport",title:"Aerobus to City Centre",day:"2025-10-17",startTime:"12:30",startMin:750,durationMin:35,location:"Plaça Catalunya, Barcelona",price:6,metadata:{notes:"Runs every 5 min, drops at Plaça Catalunya.",upvotes:["Alex","Sam","Taylor"],downvotes:[],createdBy:"Alex",transportationTime:35}},
    {id:52,type:"hotel",title:"Check-In — Eixample Design Apartment",day:"2025-10-17",startTime:"15:00",startMin:900,durationMin:30,location:"Carrer de Provença 200, Barcelona",price:210,metadata:{checkIn:"2025-10-17",checkOut:"2025-10-21",notes:"4 nights. Host sends code at 14:00.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Alex"}},
    {id:53,type:"meal",title:"Welcome Dinner — Bodega Sepúlveda",day:"2025-10-17",startTime:"20:30",startMin:1230,durationMin:105,location:"Carrer de Sepúlveda 173, Barcelona",price:32,metadata:{notes:"Reservation under Alex, 5 pax. Try the patatas bravas.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Jamie"}},
    // ── Day 2: Gaudí & Gothic — Oct 18 ──
    {id:40,type:"activity",title:"Sagrada Família — Guided Tour",day:"2025-10-18",startTime:"09:30",startMin:570,durationMin:150,location:"Carrer de Mallorca 401, Barcelona",price:26,metadata:{description:"Gaudí's unfinished masterpiece — book tower access in advance.",notes:"Skip-the-line tickets purchased. Tower access extra €14.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Alex"}},
    {id:54,type:"meal",title:"Brunch — Federal Café",day:"2025-10-18",startTime:"12:30",startMin:750,durationMin:60,location:"Carrer del Parlament 39, Barcelona",price:18,metadata:{notes:"Famous avocado toast. Arrive early — gets busy.",upvotes:["Jamie","Sam","Morgan"],downvotes:[],createdBy:"Jamie"}},
    {id:41,type:"activity",title:"Gothic Quarter & El Born Walk",day:"2025-10-18",startTime:"14:00",startMin:840,durationMin:180,location:"Barri Gòtic, Barcelona",price:0,metadata:{description:"Self-guided walk through 2000 years of history. Pick up a map at the apartment.",notes:"Free — just walking. Stop at Mercat de Santa Caterina.",upvotes:["Alex","Taylor","Morgan"],downvotes:[],createdBy:"Jamie"}},
    {id:55,type:"activity",title:"Picasso Museum",day:"2025-10-18",startTime:"15:00",startMin:900,durationMin:90,location:"Carrer de Montcada 15-23, Barcelona",price:14,metadata:{description:"World's best collection of early Picasso works.",notes:"Free on Thursday evenings after 18:00.",upvotes:["Jamie","Sam"],downvotes:["Alex","Taylor"],createdBy:"Taylor"}},
    {id:60,type:"meal",title:"Tapas Dinner — El Xampanyet",day:"2025-10-18",startTime:"20:00",startMin:1200,durationMin:90,location:"Carrer del Montcada 22, Barcelona",price:28,metadata:{notes:"Legendary cava bar in El Born. No reservations — arrive early or wait.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Jamie"}},
    // ── Day 3: Beach & Nightlife — Oct 19 ──
    {id:42,type:"activity",title:"La Barceloneta Beach Morning",day:"2025-10-19",startTime:"10:00",startMin:600,durationMin:180,location:"Barceloneta Beach, Barcelona",price:0,metadata:{description:"City beach — rent sun loungers or bring a towel.",upvotes:["Sam","Jamie","Morgan"],downvotes:[],createdBy:"Sam"}},
    {id:56,type:"meal",title:"Seafood Lunch — La Cova Fumada",day:"2025-10-19",startTime:"13:30",startMin:810,durationMin:90,location:"Carrer del Baluard 56, Barcelona",price:22,metadata:{notes:"Cash only. Birthplace of the bombas — a Barcelona must.",upvotes:["Alex","Sam","Taylor"],downvotes:[],createdBy:"Sam"}},
    {id:57,type:"activity",title:"Camp Nou Stadium Tour",day:"2025-10-19",startTime:"16:00",startMin:960,durationMin:120,location:"Carrer d'Aristides Maillol, Barcelona",price:30,metadata:{description:"FC Barcelona's iconic stadium — largest in Europe.",notes:"Tour includes museum & pitch access.",upvotes:["Alex","Taylor","Morgan"],downvotes:["Jamie"],createdBy:"Morgan"}},
    {id:58,type:"activity",title:"Sunset at Bunkers del Carmel",day:"2025-10-19",startTime:"18:30",startMin:1110,durationMin:90,location:"Turó de la Rovira, Barcelona",price:0,metadata:{description:"Best 360° panoramic view of Barcelona — a hidden gem.",notes:"Bring snacks and drinks. 20 min uphill walk.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Alex"}},
    {id:59,type:"meal",title:"Dinner — Cervecería Catalana",day:"2025-10-19",startTime:"21:00",startMin:1260,durationMin:90,location:"Carrer de Mallorca 236, Barcelona",price:30,metadata:{notes:"Best pintxos in Eixample. Reservation recommended.",upvotes:["Alex","Jamie","Taylor"],downvotes:[],createdBy:"Taylor"}},
    // ── Day 4: Montjuïc & Park Güell — Oct 20 ──
    {id:43,type:"activity",title:"Park Güell — Monumental Zone",day:"2025-10-20",startTime:"09:00",startMin:540,durationMin:120,location:"Carrer d'Olot, Barcelona",price:13,metadata:{description:"Gaudí's mosaic terrace park with sweeping city views.",notes:"Timed entry tickets required for main terrace — book online.",upvotes:["Alex","Sam","Taylor","Morgan"],downvotes:["Jamie"],createdBy:"Taylor"}},
    {id:62,type:"activity",title:"Montjuïc Castle & Cable Car",day:"2025-10-20",startTime:"12:00",startMin:720,durationMin:150,location:"Ctra. de Montjuïc 66, Barcelona",price:16,metadata:{description:"Historic fortress with panoramic harbour views. Take the Teleféric cable car up.",notes:"Cable car €12.70 return. Castle entry included.",upvotes:["Jamie","Sam","Morgan"],downvotes:[],createdBy:"Jamie"}},
    {id:63,type:"meal",title:"Farewell Dinner — Tickets (Albert Adrià)",day:"2025-10-20",startTime:"20:00",startMin:1200,durationMin:120,location:"Avinguda del Paral·lel 164, Barcelona",price:75,metadata:{notes:"Michelin-starred tapas bar. Reservation made 2 months in advance — DO NOT MISS.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Alex"}},
    // ── Day 5: Departure — Oct 21 ──
    {id:64,type:"hotel",title:"Check-Out — Eixample Apartment",day:"2025-10-21",startTime:"10:00",startMin:600,durationMin:30,location:"Carrer de Provença 200, Barcelona",price:0,metadata:{notes:"Luggage drop-off available until 14:00.",upvotes:[],downvotes:[],createdBy:"Alex"}},
    {id:65,type:"meal",title:"Last Breakfast — Bar Calders",day:"2025-10-21",startTime:"09:00",startMin:540,durationMin:45,location:"Carrer del Parlament 25, Barcelona",price:12,metadata:{notes:"Classic neighbourhood café, best croissants in Sant Antoni.",upvotes:["Jamie","Sam","Morgan"],downvotes:[],createdBy:"Jamie"}},
    {id:61,type:"transport",title:"Aerobus to Airport — Departure",day:"2025-10-21",startTime:"13:00",startMin:780,durationMin:35,location:"Plaça Catalunya → El Prat Airport",price:6,metadata:{notes:"Alex & Sam 15:45 flight. Others 17:20. All depart together.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Alex",transportationTime:35}},
  ],
  availability:{
    "2025-10-17":{Alex:"avail",Jamie:"avail",Sam:"avail",Taylor:"avail",Morgan:"avail"},
    "2025-10-18":{Alex:"avail",Jamie:"avail",Sam:"avail",Taylor:"avail",Morgan:"unavail"},
    "2025-10-19":{Alex:"avail",Jamie:"avail",Sam:"avail",Taylor:"unavail",Morgan:"avail"},
    "2025-10-20":{Alex:"avail",Jamie:"unavail",Sam:"avail",Taylor:"avail",Morgan:"avail"},
    "2025-10-21":{Alex:"avail",Jamie:"avail",Sam:"avail",Taylor:"avail",Morgan:"avail"},
  },
  country:{name:"Spain",visa:"No visa required for US citizens (Schengen Zone, under 90 days)",passport:"Must be valid for at least 3 months beyond departure date",advisory:"Level 1 — Exercise Normal Precautions (US State Dept)",currency:"Euro (€) — approx. $1.08 USD per €1",language:"Spanish (Castilian) & Catalan — English widely spoken in tourist areas",emergency:"112 (EU emergency number)"},
};
const INITIAL_TRIPS = [DEMO_TRIP];

// ─── APP ──────────────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if(this.state.error) return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0ede8",fontFamily:"Inter,sans-serif",padding:24}}>
        <div style={{background:"#fff",border:"1px solid rgba(100,70,40,0.15)",borderRadius:16,padding:36,maxWidth:540,width:"100%",boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:32,marginBottom:16}}>⚠️</div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:8,color:"#1c1410"}}>Something went wrong</h2>
          <p style={{fontSize:13,color:"#7a6a58",marginBottom:16,lineHeight:1.6}}>TripSync hit an unexpected error. Please refresh the page to try again.</p>
          <pre style={{fontSize:11,background:"#f4f1eb",borderRadius:8,padding:12,overflowX:"auto",color:"#c0392b",marginBottom:16}}>{this.state.error?.message}</pre>
          <button onClick={()=>window.location.reload()} style={{padding:"8px 18px",borderRadius:7,background:"#c96a28",color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:13}}>Refresh Page</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

function AppInner() {
  const [page,setPage]         = useState("landing");
  const [trips,setTrips]       = useState([]);
  const [tripsLoading,setTripsLoading] = useState(false);
  const [active,setActive]     = useState(null);
  const [tripLoading,setTripLoading] = useState(false);
  const [tab,setTab]           = useState("schedule");
  const [showNew,setShowNew]   = useState(false);

  // ── Real Supabase Auth state ──
  const [authUser,setAuthUser]     = useState(null);   // Supabase user object (null = logged out)
  const [authLoading,setAuthLoading] = useState(true); // true while we wait for session check on load
  const authUserIdRef = useRef(null); // tracks the last user ID so token refreshes don't re-trigger loadTrips
  const loggedIn = !!authUser;
  const user = authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || "Traveler";

  // ── Auth modal state ──
  const [showLogin,setShowLogin]   = useState(false);
  const [authMode,setAuthMode]     = useState("login"); // "login" | "signup" | "forgot"
  const [loginForm,setLoginForm]   = useState({name:"",email:"",password:"",confirmPassword:""});
  const [authError,setAuthError]   = useState("");
  const [authBusy,setAuthBusy]     = useState(false);

  // ── Reset password page state (used when user lands on /reset-password) ──
  const isResetPage = window.location.pathname === "/reset-password";
  const [resetPassword,setResetPassword]           = useState("");
  const [resetConfirmPassword,setResetConfirmPassword] = useState("");
  const [resetError,setResetError]                 = useState("");
  const [resetBusy,setResetBusy]                   = useState(false);
  const [resetDone,setResetDone]                   = useState(false);

  // ── Join request state ──
  const [joinRequests,setJoinRequests] = useState([]);      // pending requests for trips I own
  const isJoinPage = window.location.pathname.startsWith("/join/");
  const joinTripId  = isJoinPage ? window.location.pathname.split("/join/")[1] : null;
  const [joinTripInfo,setJoinTripInfo]   = useState(null);  // trip info for the join page
  const [joinRequesting,setJoinRequesting] = useState(false);
  const [joinDone,setJoinDone]           = useState(false);
  const [joinError,setJoinError]         = useState("");

  // ── On mount: restore session + listen for auth changes ──
  useEffect(() => {
    // Check if there's already a session stored in the browser (e.g. returning user)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      if(session?.user) setPage(p => p === "landing" ? "dashboard" : p);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthUser(prev => {
        const incoming = session?.user ?? null;
        if(prev?.id === incoming?.id) return prev;
        return incoming;
      });
      setAuthLoading(false);
      if(event === "SIGNED_IN") {
        setPage(p => p === "landing" ? "dashboard" : p);
      } else if(event === "SIGNED_OUT") {
        setPage("landing"); setActive(null);
        sessionStorage.removeItem("tripsync_active_id");
        sessionStorage.removeItem("tripsync_active_tab");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Sign Up ──
  const handleSignUp = async () => {
    setAuthError("");
    if(!loginForm.name.trim()) { setAuthError("Please enter your name."); return; }
    if(!loginForm.email.trim()) { setAuthError("Please enter your email."); return; }
    if(loginForm.password.length < 6) { setAuthError("Password must be at least 6 characters."); return; }
    if(loginForm.password !== loginForm.confirmPassword) { setAuthError("Passwords do not match."); return; }
    setAuthBusy(true);
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: loginForm.email.trim(),
      password: loginForm.password,
      options: { data: { full_name: loginForm.name.trim() } },
    });
    setAuthBusy(false);
    if(error) { setAuthError(error.message); return; }
    // Insert profile row — required because activities/trips/trip_members all FK to profiles(id)
    if(signUpData?.user) {
      await supabase.from("profiles").upsert({
        id:        signUpData.user.id,
        full_name: loginForm.name.trim(),
        email:     loginForm.email.trim(),
      }, { onConflict: "id" });
    }
    // Sign out immediately so the user is not auto-logged in after signup.
    // They must sign in manually after account creation.
    await supabase.auth.signOut();
    setAuthUser(null);
    setAuthError("✅ Account created! You can now sign in.");
    setAuthMode("login");
    setLoginForm(f => ({ ...f, password: "", confirmPassword: "" }));
  };

  // ── Sign In ──
  const handleSignIn = async () => {
    setAuthError("");
    if(!loginForm.email.trim()) { setAuthError("Please enter your email."); return; }
    if(!loginForm.password) { setAuthError("Please enter your password."); return; }
    setAuthBusy(true);
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });
    setAuthBusy(false);
    if(error) { setAuthError(error.message); return; }
    // Ensure profile row exists — upsert on every login as a safety net
    if(signInData?.user) {
      await supabase.from("profiles").upsert({
        id:        signInData.user.id,
        full_name: signInData.user.user_metadata?.full_name || loginForm.email.split("@")[0],
        email:     signInData.user.email,
      }, { onConflict: "id" });
    }
    // onAuthStateChange will fire and set authUser — no manual setAuthUser needed here
    setShowLogin(false);
    setLoginForm({name:"",email:"",password:"",confirmPassword:""});
    setPage("dashboard");
  };

  // ── Sign Out ──
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setPage("landing");
    setActive(null);
    setJoinRequests([]);
  };

  // ── Process pending email invites for the logged-in user ──
  // When a user logs in, check if anyone invited their email — if so, auto-add them as trip member
  const processPendingInvites = async (userId, userEmail) => {
    if(!userId || !userEmail) return;
    // Fetch all member_joined notifications and filter by email in JS
    // (Supabase JSONB deep-key filtering is unreliable across all versions)
    const { data: invites } = await supabase
      .from("notifications")
      .select("*")
      .eq("type", "member_joined");

    if(!invites?.length) return;

    // Filter to invites addressed to this user's email that are still pending
    const myInvites = invites.filter(n =>
      n.metadata?.invite_type === "email" &&
      n.metadata?.invited_email?.toLowerCase() === userEmail.toLowerCase() &&
      n.metadata?.status === "pending"
    );

    if(!myInvites.length) return;

    for(const invite of myInvites) {
      // Check not already a member first
      const { data: existing } = await supabase
        .from("trip_members")
        .select("id")
        .eq("trip_id", invite.trip_id)
        .eq("user_id", userId)
        .maybeSingle();
      if(existing) continue;

      // Add user to trip_members
      const { error } = await supabase.from("trip_members").insert({
        trip_id:   invite.trip_id,
        user_id:   userId,
        role:      "member",
        joined_at: new Date().toISOString().slice(0,10),
      });
      if(!error) {
        // Mark invite as processed — update full metadata to preserve all fields
        await supabase.from("notifications").update({
          metadata: { ...invite.metadata, status: "joined" }
        }).eq("id", invite.id);
      }
    }
    // Reload trips to show newly joined trips
    loadTrips(userId);
  };

  // ── Load pending join requests for trips I own ──
  const loadJoinRequests = async (userId) => {
    if(!userId) return;
    // Get trips I own
    const { data: myTrips } = await supabase
      .from("trip_members")
      .select("trip_id")
      .eq("user_id", userId)
      .eq("role", "admin");

    if(!myTrips?.length) { setJoinRequests([]); return; }
    const tripIds = myTrips.map(t => t.trip_id);

    // Get all trip_invite notifications for those trips, filter pending in JS
    const { data: requests } = await supabase
      .from("notifications")
      .select("*")
      .eq("type", "trip_invite")
      .in("trip_id", tripIds);

    if(!requests?.length) { setJoinRequests([]); return; }

    const pending = requests.filter(r => r.metadata?.status === "pending");
    if(!pending.length) { setJoinRequests([]); return; }

    setJoinRequests(pending.map(r => ({
      id:             r.id,
      tripId:         r.trip_id,
      requesterId:    r.metadata?.requester_id || "",
      requesterEmail: r.metadata?.requester_email || "",
      requesterName:  r.metadata?.requester_name || r.metadata?.requester_email || "",
      requestedAt:    r.created_at,
    })));
  };

  // ── Accept a join request ──
  const handleAcceptRequest = async (req) => {
    // Add to trip_members
    const { error } = await supabase.from("trip_members").insert({
      trip_id:   req.tripId,
      user_id:   req.requesterId,
      role:      "member",
      joined_at: new Date().toISOString().slice(0,10),
    });
    if(error) { console.error("acceptRequest:", error); return; }
    // Mark notification as accepted
    await supabase.from("notifications").update({
      metadata: { status: "accepted" }
    }).eq("id", req.id);
    // Remove from local state
    setJoinRequests(prev => prev.filter(r => r.id !== req.id));
    // Reload current trip members
    if(active?.id === req.tripId) loadTripDetails(active);
    loadTrips(authUser.id);
  };

  // ── Reject a join request ──
  const handleRejectRequest = async (req) => {
    await supabase.from("notifications").update({
      metadata: { status: "rejected" }
    }).eq("id", req.id);
    setJoinRequests(prev => prev.filter(r => r.id !== req.id));
  };

  // ── Submit a join request (from the /join/:tripId page) ──
  const handleRequestJoin = async () => {
    if(!authUser || !joinTripId) return;
    setJoinRequesting(true); setJoinError("");
    // Check not already a member
    const { data: existing } = await supabase
      .from("trip_members")
      .select("id")
      .eq("trip_id", joinTripId)
      .eq("user_id", authUser.id)
      .single();
    if(existing) { setJoinDone(true); setJoinRequesting(false); loadTrips(authUser.id); return; }
    // Insert join request notification — trip_id + type:"trip_invite" + requester info
    const { error } = await supabase.from("notifications").insert({
      user_id:  authUser.id,
      trip_id:  joinTripId,
      type:     "trip_invite",
      message:  `${user} requested to join your trip`,
      metadata: {
        requester_id:    authUser.id,
        requester_email: authUser.email,
        requester_name:  user,
        status:          "pending",
      },
    });
    setJoinRequesting(false);
    if(error) { setJoinError("Failed to send request. Try again."); return; }
    setJoinDone(true);
  };

  // ── Load join page trip info ──
  useEffect(() => {
    if(!isJoinPage || !joinTripId) return;
    supabase.from("trips").select("id,title,destination").eq("id", joinTripId).single()
      .then(({ data }) => { if(data) setJoinTripInfo(data); });
  }, [joinTripId]);

  // ── Poll for join requests + process invites when user logs in ──
  useEffect(() => {
    if(!authUser) return;
    const email = authUser.email?.toLowerCase();
    processPendingInvites(authUser.id, email);
    loadJoinRequests(authUser.id);
    // Poll every 30s for new join requests
    const interval = setInterval(() => loadJoinRequests(authUser.id), 30000);
    return () => clearInterval(interval);
  }, [authUser?.id]);

  // ── Forgot Password — sends reset email ──
  const handleForgotPassword = async () => {
    setAuthError("");
    if(!loginForm.email.trim()) { setAuthError("Please enter your email address."); return; }
    setAuthBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(loginForm.email.trim(), {
      redirectTo: "https://tripsync-orpin.vercel.app/reset-password",
    });
    setAuthBusy(false);
    if(error) { setAuthError(error.message); return; }
    setAuthError("✅ Reset link sent! Check your email.");
  };

  // ── Reset Password — saves new password after user clicks email link ──
  const handleResetPassword = async () => {
    setResetError("");
    if(resetPassword.length < 6) { setResetError("Password must be at least 6 characters."); return; }
    if(resetPassword !== resetConfirmPassword) { setResetError("Passwords do not match."); return; }
    setResetBusy(true);
    const { error } = await supabase.auth.updateUser({ password: resetPassword });
    setResetBusy(false);
    if(error) { setResetError(error.message); return; }
    setResetDone(true);
    // Redirect to landing after 3 seconds
    setTimeout(() => { window.location.href = "/"; }, 3000);
  };

  // ── Load trips for the logged-in user ──
  const loadTrips = async (userId) => {
    const uid = userId || authUserIdRef.current;
    if(!uid) { setTripsLoading(false); return; }
    setTripsLoading(true);
    const { data, error } = await supabase
      .from("trips")
      .select(`
        id, title, destination, status, start_date, end_date, description,
        google_maps_url, country_info, documents,
        trip_members!inner ( user_id, role, joined_at, profiles ( full_name ) ),
        activities ( id )
      `)
      .eq("trip_members.user_id", uid)
      .order("created_at", { ascending: false });

    if(error) { console.error("loadTrips:", error); setTripsLoading(false); return; }

    const buildTrip = (t, existing) => ({
      id:          t.id,
      name:        t.title,
      status:      t.status || "planning",
      startDate:   t.start_date,
      endDate:     t.end_date,
      members:     (t.trip_members||[]).map(m => m.profiles?.full_name || m.user_id),
      tripMembers: (t.trip_members||[]).map(m => ({
        userId:   m.user_id,
        name:     m.profiles?.full_name || m.user_id,
        role:     m.role,
        joinedAt: m.joined_at,
      })),
      destinations:        (()=>{
        const savedVotes = t.country_info?.destination_votes;
        const baseName = t.destination || t.country_info?.destination;
        if(savedVotes && Array.isArray(savedVotes) && savedVotes.length>0) return savedVotes.map(d=>({id:d.id,name:d.name,upvotes:Array.isArray(d.upvotes)?d.upvotes:[],downvotes:Array.isArray(d.downvotes)?d.downvotes:[]}));
        return baseName ? [{id:1,name:baseName,upvotes:[],downvotes:[]}] : [];
      })(),
      // Preserve full loaded data if this trip is already open — never overwrite with empty shells
      activityCount:       (t.activities||[]).length,
      calendarItems:       existing?.calendarItems      ?? [],
      vehicleRentals:      existing?.vehicleRentals     ?? [],
      accommodationOptions:existing?.accommodationOptions ?? [],
      availability:        existing?.availability        ?? {},
      personalBudgets:     existing?.personalBudgets     ?? {},
      country:             t.country_info || null,
      documents:           Array.isArray(t.documents) ? t.documents : [],
      googleMapsUrl:       t.google_maps_url || "",
      description:         t.description || "",
    });

    setTrips(prev => {
      const existingMap = Object.fromEntries(prev.map(t => [t.id, t]));
      const freshTrips = (data||[]).map(t => buildTrip(t, existingMap[t.id]));
      return data?.length ? [DEMO_TRIP, ...freshTrips] : [DEMO_TRIP];
    });

    // If a trip is currently open, keep it in sync without wiping its data
    setActive(prev => {
      if(!prev || prev.id === "demo-barcelona") return prev;
      const fresh = (data||[]).find(t => t.id === prev.id);
      if(!fresh) return prev;
      return buildTrip(fresh, prev);
    });

    // Restore previously open trip after page reload
    const savedId  = sessionStorage.getItem("tripsync_active_id");
    const savedTab = sessionStorage.getItem("tripsync_active_tab");
    if(savedId && (data||[]).find(t => t.id === savedId)) {
      const rawRow = (data||[]).find(t => t.id === savedId);
      const shell = buildTrip(rawRow, null);
      if(savedTab) setTab(savedTab);
      // Set shell immediately so trip page renders right away
      setActive(shell);
      setPage("trip");
      // Load full details — called directly here so authUser is in scope
      // loadTripDetails updates active with calendarItems + accommodations
      loadTripDetails(shell);
    }

    setTripsLoading(false);
  };

  // ── Load full trip details when a trip is opened ──
  const loadTripDetails = async (trip) => {
    setTripLoading(true);

    // Load calendar items (activities)
    const { data: items } = await supabase
      .from("activities")
      .select("*")
      .eq("trip_id", trip.id)
      .order("created_at", { ascending: true });

    // Load accommodations
    const { data: accoms } = await supabase
      .from("accommodations")
      .select("*")
      .eq("trip_id", trip.id);

    const calendarItems = (items||[]).map(a => ({
      id:          a.id,
      type:        fromDbCategory(a.category),
      title:       a.title,
      day:         a.scheduled_date || null,
      startTime:   a.scheduled_time || null,
      startMin:    a.scheduled_time ? timeStrToMin(a.scheduled_time) : null,
      durationMin: 60,
      location:    "",
      price:       parseFloat(a.cost) || 0,
      priceType:   a.price_type || "flat",
      metadata: {
        description: "",
        notes:       "",
        upvotes:     Array.isArray(a.upvotes) ? a.upvotes : [],
        downvotes:   Array.isArray(a.downvotes) ? a.downvotes : [],
        createdBy:   a.created_by || "",
        checkIn:     null,
        checkOut:    null,
        transportationTime: "",
      },
    }));

    const accommodationOptions = (accoms||[]).map(a => ({
      id:            a.id,
      name:          a.name,
      address:       a.address || "",
      priceType:     a.price_type || "nightly",
      pricePerNight: parseFloat(a.cost_per_night) || 0,
      totalPrice:    parseFloat(a.total_price) || 0,
      rating:        "",
      checkIn:       a.check_in || "",
      checkOut:      a.check_out || "",
      notes:         "",
      upvotes:       Array.isArray(a.upvotes) ? a.upvotes : [],
      downvotes:     Array.isArray(a.downvotes) ? a.downvotes : [],
    }));

    // Load personal budget — guard against authUser being null during restore
    const currentUserId = authUser?.id || authUserIdRef.current;
    const { data: profile } = currentUserId ? await supabase
      .from("profiles")
      .select("personal_budget")
      .eq("id", currentUserId)
      .single() : { data: null };

    // Load vehicle rentals
    const { data: vehicles } = await supabase
      .from("vehicle_rentals")
      .select("*")
      .eq("trip_id", trip.id);

    const vehicleRentals = (vehicles||[]).map(v => ({
      id:              v.id,
      company:         v.company,
      model:           v.model || "",
      vehicleType:     v.vehicle_type || "car",
      pickupDate:      v.pickup_date || "",
      returnDate:      v.return_date || "",
      pricePerDay:     parseFloat(v.price_per_day) || 0,
      price:           parseFloat(v.price_per_day) || 0,
      priceType:       v.price_type || "daily",
      rating:          v.rating || "",
      pickupLocation:  v.pickup_location || "",
      dropoffLocation: v.dropoff_location || "",
      seats:           v.seats || "",
      transmission:    v.transmission || "automatic",
      notes:           v.notes || "",
      upvotes:         Array.isArray(v.upvotes) ? v.upvotes : [],
      downvotes:       Array.isArray(v.downvotes) ? v.downvotes : [],
    }));

    const fullTrip = {
      ...trip,
      calendarItems,
      accommodationOptions,
      vehicleRentals,
      personalBudgets: { [user]: profile?.personal_budget ?? null },
    };

    setActive(fullTrip);
    setTrips(ts => ts.map(t => t.id === trip.id ? fullTrip : t));
    setTripLoading(false);
  };

  // ── Load trips when user logs in ──
  useEffect(() => {
    const newId = authUser?.id ?? null;
    // Only reload trips when the actual user ID changes (login/logout),
    // not when Supabase silently refreshes the token and re-emits the authUser object.
    if(newId === authUserIdRef.current) return;
    authUserIdRef.current = newId;
    if(newId) loadTrips(newId);
    else { setTrips([]); setActive(null); }
  }, [authUser]);

  // ── Save personal budget to Supabase profiles table ──
  const savePersonalBudgetToDb = async (amount) => {
    await supabase
      .from("profiles")
      .update({ personal_budget: amount })
      .eq("id", authUser.id);
  };

  // ── Centralized DB write helpers — passed as `db` prop to all tabs ──
  const isMock = trips.length > 0 && typeof trips[0].id === "number";

  // Map app activity types to valid DB category enum values
  const toDbCategory = (type) => ({
    activity:  "sightseeing",
    meal:      "food",
    transport: "transport",
    hotel:     "accommodation",
    note:      "general",
    food:      "food",
    sightseeing: "sightseeing",
    entertainment: "entertainment",
    shopping:  "shopping",
    general:   "general",
  }[type] || "general");

  // Map DB category back to app type
  const fromDbCategory = (cat) => ({
    food:          "meal",
    transport:     "transport",
    accommodation: "hotel",
    sightseeing:   "activity",
    entertainment: "activity",
    shopping:      "activity",
    general:       "note",
  }[cat] || "activity");

  const db = {
    isMock,
    // ── Activities (calendar items) ──
    addItem: async (tripId, item) => {
      if(isMock) return item;
      const { data, error } = await supabase.from("activities").insert({
        trip_id:        tripId,
        title:          item.title,
        category:       toDbCategory(item.type),
        scheduled_date: item.day || null,
        scheduled_time: item.startTime || null,
        cost:           item.price || 0,
        price_type:     item.priceType || "flat",
        status:         "proposed",
        created_by:     item.metadata?.createdBy || null,
      }).select().single();
      if(error) { console.error("db.addItem:", error); return item; }
      return { ...item, id: data.id };
    },

    updateItem: async (item) => {
      if(isMock) return;
      await supabase.from("activities").update({
        title:          item.title,
        category:       toDbCategory(item.type),
        scheduled_date: item.day || null,
        scheduled_time: item.startTime || null,
        cost:           item.price || 0,
        price_type:     item.priceType || "flat",
      }).eq("id", item.id);
    },

    deleteItem: async (id) => {
      if(isMock) return;
      await supabase.from("activities").delete().eq("id", id);
    },

    updateVotes: async (itemId, upvotes, downvotes) => {
      if(isMock) return;
      await supabase.from("activities").update({ upvotes, downvotes }).eq("id", itemId);
    },

    // ── Votes table (destination/budget votes) ──
    upsertVote: async (tripId, itemType, itemId, userId, value) => {
      if(isMock) return;
      if(itemType !== "activities") return;
      await supabase.from("votes").upsert({
        activity_id: itemId,
        user_id:     userId,
        value:       value ? 1 : -1,
      }, { onConflict: "activity_id,user_id" });
    },

    // ── Accommodations ──
    addAccom: async (tripId, accom) => {
      if(isMock) return accom;
      const { data, error } = await supabase.from("accommodations").insert({
        trip_id:        tripId,
        name:           accom.name,
        address:        accom.address || "",
        price_type:     accom.priceType || "nightly",
        cost_per_night: accom.priceType === "full" ? 0 : (accom.pricePerNight || 0),
        total_price:    accom.priceType === "full" ? (accom.totalPrice || 0) : 0,
        check_in:       accom.checkIn || new Date().toISOString().slice(0,10),
        check_out:      accom.checkOut || new Date().toISOString().slice(0,10),
        created_by:     null,
      }).select().single();
      if(error) { console.error("db.addAccom:", error); return accom; }
      return { ...accom, id: data.id };
    },

    updateAccom: async (accom) => {
      if(isMock) return;
      await supabase.from("accommodations").update({
        name:           accom.name,
        address:        accom.address || "",
        price_type:     accom.priceType || "nightly",
        cost_per_night: accom.priceType === "full" ? 0 : (accom.pricePerNight || 0),
        total_price:    accom.priceType === "full" ? (accom.totalPrice || 0) : 0,
        check_in:       accom.checkIn || null,
        check_out:      accom.checkOut || null,
      }).eq("id", accom.id);
    },

    deleteAccom: async (id) => {
      if(isMock) return;
      await supabase.from("accommodations").delete().eq("id", id);
    },

    // ── Vehicle Rentals ──
    addVehicle: async (tripId, v) => {
      if(isMock) return v;
      const { data, error } = await supabase.from("vehicle_rentals").insert({
        trip_id:          tripId,
        company:          v.company,
        model:            v.model || "",
        vehicle_type:     v.vehicleType || "car",
        pickup_date:      v.pickupDate || null,
        return_date:      v.returnDate || null,
        price_per_day:    parseFloat(v.price || v.pricePerDay) || 0,
        price_type:       v.priceType || "daily",
        rating:           parseFloat(v.rating) || null,
        pickup_location:  v.pickupLocation || "",
        dropoff_location: v.dropoffLocation || "",
        seats:            parseInt(v.seats) || null,
        transmission:     v.transmission || "automatic",
        notes:            v.notes || "",
        created_by:       authUser?.id || null,
      }).select().single();
      if(error) { console.error("db.addVehicle:", error.message, error.code); return v; }
      return { ...v, id: data.id };
    },
    updateVehicle: async (v) => {
      if(isMock) return;
      await supabase.from("vehicle_rentals").update({
        company:          v.company,
        model:            v.model || "",
        vehicle_type:     v.vehicleType || "car",
        pickup_date:      v.pickupDate || null,
        return_date:      v.returnDate || null,
        price_per_day:    parseFloat(v.price || v.pricePerDay) || 0,
        price_type:       v.priceType || "daily",
        rating:           parseFloat(v.rating) || null,
        pickup_location:  v.pickupLocation || "",
        dropoff_location: v.dropoffLocation || "",
        seats:            parseInt(v.seats) || null,
        transmission:     v.transmission || "automatic",
        notes:            v.notes || "",
      }).eq("id", v.id);
    },
    deleteVehicle: async (id) => {
      if(isMock) return;
      await supabase.from("vehicle_rentals").delete().eq("id", id);
    },

    // ── Trip metadata (name, dates, status, destination, map URL, country info) ──
    updateTrip: async (tripId, fields) => {
      if(isMock) return;
      await supabase.from("trips").update(fields).eq("id", tripId);
    },
  };

  // ── Trip handlers ──
  useEffect(() => {
    if(active?.id && active.id !== "demo-barcelona") {
      sessionStorage.setItem("tripsync_active_id", active.id);
      sessionStorage.setItem("tripsync_active_tab", tab);
    } else if(!active) {
      sessionStorage.removeItem("tripsync_active_id");
      sessionStorage.removeItem("tripsync_active_tab");
    }
  }, [active?.id, tab]);

  const updateTrip = t => { setTrips(ts=>ts.map(x=>x.id===t.id?t:x)); setActive(t); };

  const openTrip = t => {
    setTab("schedule");
    setPage("trip");
    // Demo trip has all data pre-loaded — just set it directly
    if(t.isDemo) {
      setActive(t);
      return;
    }
    // Supabase trips have UUID string ids; mock trips have numeric ids
    if(typeof t.id === "string") {
      loadTripDetails(t);
    } else {
      setActive(t);
    }
  };

  const createTrip = async (t) => {
    // If currently showing mock data (numeric ids), stay in mock mode
    if(trips.length > 0 && typeof trips[0].id === "number") {
      setTrips(ts=>[...ts,t]);
      setShowNew(false); setActive(t); setTab("schedule"); setPage("trip");
      return;
    }
    // Insert into Supabase — do NOT chain .select() here because the SELECT policy
    // requires trip_members to exist first, which causes a 403 before we can add ourselves
    const { error: insertError } = await supabase
      .from("trips")
      .insert({ title: t.name, destination: t.destinations?.[0]?.name || t.name || "TBD", status: "planning", start_date: t.startDate || null, end_date: t.endDate || null, created_by: authUser.id });
    if(insertError) { console.error("createTrip insert:", insertError); throw new Error(insertError.message); }

    // Fetch the trip we just created by matching created_by + title + created_at order
    const { data: newTrip, error: fetchError } = await supabase
      .from("trips")
      .select("id")
      .eq("created_by", authUser.id)
      .eq("title", t.name)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if(fetchError) { console.error("createTrip fetch:", fetchError); throw new Error(fetchError.message); }

    // Add creator as member — this makes the SELECT policy work for future fetches
    await supabase.from("trip_members").insert({
      trip_id: newTrip.id, user_id: authUser.id, role: "admin",
    });
    // Build trip locally — never call loadTrips() here as it races with setActive
    // and was querying with null userId, returning empty results that wiped trip data
    const fullNewTrip = {
      ...t, id: newTrip.id, calendarItems: [], accommodationOptions: [], vehicleRentals: [],
      tripMembers: [{ userId: authUser.id, name: user, role: "admin", joinedAt: new Date().toISOString().slice(0,10) }],
    };
    setTrips(ts => {
      const exists = ts.find(x => x.id === newTrip.id);
      return exists ? ts.map(x => x.id === newTrip.id ? fullNewTrip : x) : [...ts, fullNewTrip];
    });
    setActive(fullNewTrip); setShowNew(false); setTab("schedule"); setPage("trip");
  };
  const deleteTrip = async (tripId) => {
    if(tripId === "demo-barcelona") {
      setTrips(ts => ts.filter(t => t.id !== tripId));
      if(active?.id === tripId) { setActive(null); setPage("dashboard"); }
      return;
    }
    const tripToDelete = trips.find(t => t.id === tripId);
    const myMembership = (tripToDelete?.tripMembers || []).find(m => m.userId === authUser.id);
    if(!myMembership || myMembership.role !== "admin") { alert("Only the trip owner can delete this trip."); return; }
    const otherMembers = (tripToDelete?.tripMembers || []).filter(m => m.userId !== authUser.id);
    if(otherMembers.length > 0) { alert(`You must remove all ${otherMembers.length} member(s) before deleting this trip.`); return; }
    const { error } = await supabase.from("trips").delete().eq("id", tripId);
    if(error) { console.error("deleteTrip:", error); return; }
    setTrips(ts => ts.filter(t => t.id !== tripId));
    if(active?.id === tripId) { setActive(null); setPage("dashboard"); }
  };

  const leaveTrip = async (tripId) => {
    if(tripId === "demo-barcelona") {
      setTrips(ts => ts.filter(t => t.id !== tripId));
      if(active?.id === tripId) { setActive(null); setPage("dashboard"); }
      return;
    }
    const tripToLeave = trips.find(t => t.id === tripId);
    // Safety guard: if tripMembers hasn't loaded yet, don't proceed — prevents false "owner alone" deletes
    if(!tripToLeave?.tripMembers?.length) {
      alert("Trip membership data is still loading. Please try again in a moment.");
      return;
    }
    const myMembership = (tripToLeave?.tripMembers || []).find(m => m.userId === authUser.id);
    const otherMembers = (tripToLeave?.tripMembers || []).filter(m => m.userId !== authUser.id);
    const isOwner = myMembership?.role === "admin";
    if(isOwner && otherMembers.length > 0) {
      alert(`You created this trip. You can only leave once all ${otherMembers.length} other member(s) have left.`);
      return;
    }
    if(isOwner && otherMembers.length === 0) {
      if(!window.confirm(`You're the only one left. Leaving will permanently delete "${tripToLeave.name}". Continue?`)) return;
      const { error } = await supabase.from("trips").delete().eq("id", tripId);
      if(error) { console.error("leaveTrip (delete):", error); return; }
      setTrips(ts => ts.filter(t => t.id !== tripId));
      if(active?.id === tripId) { setActive(null); setPage("dashboard"); }
      return;
    }
    if(!window.confirm(`Leave "${tripToLeave.name}"? You'll need to be re-invited to rejoin.`)) return;
    const { error } = await supabase.from("trip_members")
      .delete()
      .eq("trip_id", tripId)
      .eq("user_id", authUser.id);
    if(error) { console.error("leaveTrip (member):", error); return; }
    setTrips(ts => ts.filter(t => t.id !== tripId));
    if(active?.id === tripId) { setActive(null); setPage("dashboard"); }
  };

  if(authLoading) return (
    <>
      <style>{FONT+CSS}</style>
      <div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
        <div style={{color:"var(--muted)",fontSize:15}}>Loading TripSync…</div>
      </div>
    </>
  );

  // ── /reset-password page — shown when user arrives from the reset email link ──
  if(isResetPage) return (
    <>
      <style>{FONT+CSS}</style>
      <div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20}}>
        <div className="modal" style={{maxWidth:440}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:36,marginBottom:12}}>🔐</div>
            <h3 style={{marginBottom:6}}>Set a new password</h3>
            <p style={{fontSize:14,color:"var(--muted)"}}>Choose a new password for your TripSync account.</p>
          </div>

          {resetDone ? (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:32,marginBottom:12}}>✅</div>
              <p style={{color:"var(--green)",fontWeight:600,marginBottom:8}}>Password updated!</p>
              <p style={{fontSize:13,color:"var(--muted)"}}>Redirecting you to TripSync…</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={resetPassword} onChange={e=>setResetPassword(e.target.value)}/>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:5}}>Minimum 6 characters</div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={resetConfirmPassword} onChange={e=>setResetConfirmPassword(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleResetPassword()}/>
              </div>

              {resetError && (
                <div style={{
                  padding:"10px 14px",borderRadius:9,marginBottom:16,fontSize:13,
                  background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",
                  color:"var(--red)",
                }}>
                  {resetError}
                </div>
              )}

              <button className="btn btn-primary" disabled={resetBusy}
                style={{width:"100%",justifyContent:"center"}}
                onClick={handleResetPassword}>
                {resetBusy ? "Saving…" : "Save New Password →"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );

  const TABS = [
    {id:"info",l:"ℹ️ Trip Info"},{id:"members",l:"👥 Members"},{id:"schedule",l:"📅 Schedule"},
    {id:"map",l:"🗺️ Map"},{id:"accommodations",l:"🏨 Stays"},{id:"vehicles",l:"🚗 Vehicles"},
    {id:"activities",l:"🎯 Items"},{id:"budget",l:"💰 Budget"},{id:"country",l:"🌍 Entry"},
    {id:"voting",l:"🗳️ Vote"},{id:"summary",l:"✅ Summary"},
  ];

  // Count join requests for the active trip
  const activeRequestCount = active ? (joinRequests||[]).filter(r => r.tripId === active.id).length : 0;

  // ── Route protection: if not logged in, only the landing page is accessible ──
  const safePage = loggedIn ? page : "landing";

  // ── /join/:tripId page — shown when user arrives from a shared link ──
  if(isJoinPage) return (
    <>
      <style>{FONT+CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" onClick={()=>setPage(loggedIn?"dashboard":"landing")}><div className="nav-logo-mark"><svg viewBox="0 0 14 14" style={{width:14,height:14,fill:"none",stroke:"#fff",strokeWidth:2.2,strokeLinecap:"round",strokeLinejoin:"round"}}><path d="M2 7 L5 10 L12 3"/></svg></div>TripSync</div>
          <div className="nav-user">
            {loggedIn
              ? <><div className="avatar">{user[0].toUpperCase()}</div><span style={{fontSize:14,fontWeight:500}}>{user}</span><button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Sign Out</button></>
              : <button className="btn btn-primary btn-sm" onClick={()=>{setAuthMode("login");setAuthError("");setShowLogin(true);}}>Sign In</button>
            }
          </div>
        </nav>
        <div className="join-banner">
          <div className="join-banner-card">
            <div style={{fontSize:40,marginBottom:16}}>✈️</div>
            <h2>{joinTripInfo?.title || "You've been invited!"}</h2>
            <p>
              {joinTripInfo?.destination ? `Join the trip to ${joinTripInfo.destination}` : "You've been invited to join a trip on TripSync"}.
              {!loggedIn && " Sign in or create an account first to request access."}
            </p>
            {!loggedIn ? (
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn btn-primary" onClick={()=>{setAuthMode("signup");setAuthError("");setShowLogin(true);}}>Create Account</button>
                <button className="btn btn-ghost" onClick={()=>{setAuthMode("login");setAuthError("");setShowLogin(true);}}>Sign In</button>
              </div>
            ) : joinDone ? (
              <div style={{background:"var(--green-soft)",border:"1px solid rgba(36,138,61,0.22)",borderRadius:"var(--r-md)",padding:"14px 18px",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:8}}>✅</div>
                <p style={{color:"var(--green)",fontWeight:600,fontSize:15,margin:0}}>Request sent!</p>
                <p style={{color:"var(--muted)",fontSize:13,marginTop:4}}>The trip owner will review your request.</p>
                <button className="btn btn-ghost btn-sm" style={{marginTop:12}} onClick={()=>{ window.location.href="/"; }}>Go to My Trips</button>
              </div>
            ) : (
              <>
                {joinError && <div className="err-msg" style={{marginBottom:12}}>{joinError}</div>}
                <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={handleRequestJoin} disabled={joinRequesting}>
                  {joinRequesting ? "Sending request…" : "Request to Join Trip →"}
                </button>
              </>
            )}
          </div>
        </div>
        {showLogin && (
          <div className="modal-overlay" onClick={()=>{setShowLogin(false);setAuthError("");}}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",gap:4,marginBottom:24,background:"var(--surface2)",borderRadius:10,padding:4}}>
                <button className="btn" style={{flex:1,padding:"8px 0",borderRadius:8,fontSize:14,background:authMode==="login"?"var(--accent)":"transparent",color:authMode==="login"?"#fff":"var(--muted)"}} onClick={()=>{setAuthMode("login");setAuthError("");}}>Sign In</button>
                <button className="btn" style={{flex:1,padding:"8px 0",borderRadius:8,fontSize:14,background:authMode==="signup"?"var(--accent)":"transparent",color:authMode==="signup"?"#fff":"var(--muted)"}} onClick={()=>{setAuthMode("signup");setAuthError("");}}>Create Account</button>
              </div>
              <h3 style={{marginBottom:20}}>{authMode==="login"?"Welcome back 👋":"Join TripSync ✦"}</h3>
              {authMode==="signup"&&<div className="form-group"><label className="form-label">Your Name</label><input className="form-input" placeholder="e.g. Maria" value={loginForm.name} onChange={e=>setLoginForm(f=>({...f,name:e.target.value}))}/></div>}
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@email.com" value={loginForm.email} onChange={e=>setLoginForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={loginForm.password} onChange={e=>setLoginForm(f=>({...f,password:e.target.value}))}/></div>
              {authMode==="signup"&&<div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" placeholder="••••••••" value={loginForm.confirmPassword} onChange={e=>setLoginForm(f=>({...f,confirmPassword:e.target.value}))}/></div>}
              {authError&&<div style={{padding:"10px 14px",borderRadius:9,marginBottom:16,fontSize:13,background:authError.startsWith("✅")?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)",border:authError.startsWith("✅")?"1px solid rgba(52,211,153,0.3)":"1px solid rgba(248,113,113,0.3)",color:authError.startsWith("✅")?"var(--green)":"var(--red)"}}>{authError}</div>}
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={()=>{setShowLogin(false);setAuthError("");}}>Cancel</button>
                <button className="btn btn-primary" disabled={authBusy} onClick={authMode==="login"?handleSignIn:handleSignUp}>{authBusy?"Please wait…":authMode==="login"?"Sign In →":"Create Account →"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <style>{FONT+CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" onClick={()=>setPage(loggedIn?"dashboard":"landing")}><div className="nav-logo-mark"><svg viewBox="0 0 14 14" style={{width:14,height:14,fill:"none",stroke:"#fff",strokeWidth:2.2,strokeLinecap:"round",strokeLinejoin:"round"}}><path d="M2 7 L5 10 L12 3"/></svg></div>TripSync</div>
          {loggedIn && (
            <div className="nav-tabs">
              <button className={`nav-tab ${safePage==="dashboard"?"active":""}`} onClick={()=>setPage("dashboard")}>My Trips</button>
              <button className="nav-tab" onClick={()=>setShowNew(true)}>+ New Trip</button>
            </div>
          )}
          <div className="nav-user">
            {loggedIn
              ?<>
                <div className="avatar">{user[0].toUpperCase()}</div>
                <span style={{fontSize:14,fontWeight:500}}>{user}</span>
                <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Sign Out</button>
               </>
              :<button className="btn btn-primary btn-sm" onClick={()=>{setAuthMode("login");setAuthError("");setShowLogin(true);}}>Sign In</button>
            }
          </div>
        </nav>

        {safePage==="landing" && (
          <div className="landing">
            <div className="landing-eyebrow">
              <span className="landing-eyebrow-dot"/>
              Collaborative trip planning, reimagined
            </div>
            <h1>Plan trips together,<br/><span className="gradient-word">without the chaos.</span></h1>
            <p className="landing-sub">TripSync helps groups align on dates, destinations, budgets, and activities — turning group planning into something that actually works.</p>
            <div className="btn-group">
              <button className="btn btn-primary" style={{padding:"13px 28px",fontSize:15}} onClick={()=>{setAuthMode("signup");setAuthError("");setShowLogin(true);}}>✦ Get Started Free</button>
              <button className="btn btn-ghost" style={{padding:"13px 28px",fontSize:15}} onClick={()=>{setAuthMode("login");setAuthError("");setShowLogin(true);}}>Sign In →</button>
            </div>
            <div className="features">
              {[
                {icon:"📅",title:"Unified Calendar",desc:"Every item type lives in one data model. Edit, drag, and schedule anything the same way."},
                {icon:"✏️",title:"Universal Edit",desc:"Click any item to open a smart panel that adapts its fields based on type."},
                {icon:"↔️",title:"Drag & Drop",desc:"Drag items across days to move them. Drop on the timeline to set a precise start time."},
                {icon:"🗺️",title:"Google My Maps",desc:"Embed your group's custom map and open it directly for collaborative pin editing."},
                {icon:"🗳️",title:"Group Voting",desc:"Vote on any item type. Results ranked by net score in real time."},
                {icon:"💰",title:"Smart Budget",desc:"Costs roll up automatically from all item types."},
              ].map(f=><div key={f.title} className="feature-card"><div className="feature-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>)}
            </div>
          </div>
        )}

        {safePage==="dashboard" && (
          <div className="dashboard">
            <div style={{marginBottom:32}} className="flex-between">
              <div><h2 style={{fontFamily:"'Inter',sans-serif",fontSize:28,fontWeight:800,marginBottom:6,letterSpacing:"-0.7px"}}>My Trips</h2><p style={{color:"var(--muted)",fontSize:15}}>Welcome back, {user}.</p></div>
              <button className="btn btn-primary" onClick={()=>setShowNew(true)}>+ New Trip</button>
            </div>
            {tripsLoading ? (
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 0",gap:12}}>
                <div style={{width:22,height:22,border:"3px solid var(--border)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                <span style={{color:"var(--muted)",fontSize:14}}>Loading your trips…</span>
              </div>
            ) : (
            <div className="trip-grid">
              {trips.map(trip=>(
                <div key={trip.id} className="trip-card" onClick={()=>openTrip(trip)} style={{position:"relative"}}>
                  {trip.isDemo&&<div style={{position:"absolute",top:12,left:12,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--accent)",background:"rgba(94,234,212,0.1)",border:"1px solid rgba(94,234,212,0.25)",borderRadius:6,padding:"2px 7px"}}>Example Trip</div>}
{(()=>{
                    const myRole=(trip.tripMembers||[]).find(m=>m.userId===authUser?.id)?.role;
                    const otherCount=(trip.tripMembers||[]).filter(m=>m.userId!==authUser?.id).length;
                    if(myRole!=="owner") return null;
                    const canDelete=otherCount===0;
                    const tip=canDelete?"Delete trip":`Remove all ${otherCount} member(s) first`;
                    return(
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{position:"absolute",top:10,right:10,padding:"4px 8px",fontSize:13,color:canDelete?"var(--muted)":"var(--border)",zIndex:2,cursor:canDelete?"pointer":"not-allowed"}}
                        onClick={e=>{e.stopPropagation();if(!canDelete){alert(tip);return;}if(window.confirm(`Delete "${trip.name}"? This cannot be undone.`))deleteTrip(trip.id);}}
                        title={tip}
                      >✕</button>
                    );
                  })()}
                  <div className="trip-card-header" style={{marginTop: trip.isDemo ? 20 : 0}}>
                    <div className="trip-name">{trip.name}</div>
                    <span className={`badge ${trip.status==="confirmed"?"badge-green":"badge-yellow"}`}>{trip.status==="confirmed"?"✓ Confirmed":"⏳ Planning"}</span>
                  </div>
                  <div className="trip-meta">
                    <div className="trip-meta-item">📍 <strong>{trip.destinations[0]?.name}</strong></div>
                    <div className="trip-meta-item">📅 <strong>{fmtRange(trip.startDate,trip.endDate)}</strong></div>
                    <div className="trip-meta-item">🎯 <strong>{trip.activityCount ?? (trip.calendarItems||[]).length} item{(trip.activityCount ?? (trip.calendarItems||[]).length)!==1?"s":""}</strong></div>
                    <div className="trip-meta-item">👥 <strong>{trip.members.length} members</strong></div>
                  </div>
                  <div className="members-row">
                    {trip.members.slice(0,5).map(m=><span key={m} className="member-chip">{m}</span>)}
                    {trip.members.length>5&&<span className="member-chip">+{trip.members.length-5}</span>}
                  </div>
                </div>
              ))}
              <div className="trip-card" style={{border:"1px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",minHeight:200,cursor:"pointer"}} onClick={()=>setShowNew(true)}>
                <div style={{textAlign:"center"}}><div style={{fontSize:36,marginBottom:8}}>+</div><div style={{color:"var(--muted)",fontSize:14}}>Create new trip</div></div>
              </div>
            </div>
            )}
          </div>
        )}

        {safePage==="trip" && active && (
          <div className="trip-detail">
            <div className="trip-detail-header">
              <button className="back-btn" onClick={()=>setPage("dashboard")}>← Back</button>
              <h2>{active.name}</h2>
              <span className={`badge ${active.status==="confirmed"?"badge-green":"badge-yellow"}`}>{active.status==="confirmed"?"✓ Confirmed":"⏳ Planning"}</span>
              {active.startDate&&<span className="badge" style={{fontSize:12}}>📅 {fmtRange(active.startDate,active.endDate)}</span>}
              <button className="btn btn-ghost btn-sm" style={{marginLeft:"auto"}} onClick={()=>setTab("info")}>✏️ Edit Trip</button>
            </div>
            {tripLoading ? (
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 0",gap:12}}>
                <div style={{width:22,height:22,border:"3px solid var(--border)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                <span style={{color:"var(--muted)",fontSize:14}}>Loading trip details…</span>
              </div>
            ) : (
            <>
            <div className="section-tabs">
              {TABS.map(t=>(
                <button key={t.id} className={`section-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                  {t.id==="members" && activeRequestCount>0
                    ? <span className="notif-tab-wrap">{t.l}<span className="notif-badge">{activeRequestCount}</span></span>
                    : t.l}
                </button>
              ))}
            </div>
            <div className="section-content">
              {tab==="info"           && <TripInfoTab trip={active} setTrip={updateTrip} db={db}/>}
              {tab==="schedule"       && <ScheduleTab trip={active} setTrip={updateTrip} db={db}/>}
              {tab==="map"            && <MapTab trip={active} setTrip={updateTrip} db={db}/>}
              {tab==="voting"         && <VotingTab trip={active} setTrip={updateTrip} user={user} userId={authUser?.id} db={db}/>}
              {tab==="budget"         && <BudgetTab trip={active} setTrip={updateTrip} user={user} onSaveBudget={savePersonalBudgetToDb}/>}
              {tab==="accommodations" && <AccommodationTab trip={active} setTrip={updateTrip} db={db}/>}
              {tab==="activities"     && <ActivityTab trip={active} setTrip={updateTrip} user={user} db={db}/>}
              {tab==="vehicles"       && <VehicleTab trip={active} setTrip={updateTrip} db={db}/>}
              {tab==="members"        && <MembersTab trip={active} setTrip={updateTrip} user={user} db={db} onLeave={()=>leaveTrip(active.id)} authUserId={authUser?.id} joinRequests={joinRequests} onAcceptRequest={handleAcceptRequest} onRejectRequest={handleRejectRequest}/>}
              {tab==="country"        && <CountryTab trip={active} setTrip={updateTrip} db={db} user={user}/>}
              {tab==="summary"        && <SummaryTab trip={active}/>}
            </div>
            </>
            )}
          </div>
        )}

        {showNew && <NewTripModal onClose={()=>setShowNew(false)} onCreate={createTrip} user={user}/>}

        {showLogin && (
          <div className="modal-overlay" onClick={()=>{setShowLogin(false);setAuthError("");setLoginForm({name:"",email:"",password:"",confirmPassword:""});setAuthMode("login");}}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              {/* Tab toggle: Sign In / Sign Up */}
              <div style={{display:"flex",gap:4,marginBottom:24,background:"var(--surface2)",borderRadius:10,padding:4}}>
                <button
                  className="btn"
                  style={{flex:1,padding:"8px 0",borderRadius:8,fontSize:14,
                    background:authMode==="login"?"var(--accent)":"transparent",
                    color:authMode==="login"?"#fff":"var(--muted)"}}
                  onClick={()=>{setAuthMode("login");setAuthError("");}}>
                  Sign In
                </button>
                <button
                  className="btn"
                  style={{flex:1,padding:"8px 0",borderRadius:8,fontSize:14,
                    background:authMode==="signup"?"var(--accent)":"transparent",
                    color:authMode==="signup"?"#fff":"var(--muted)"}}
                  onClick={()=>{setAuthMode("signup");setAuthError("");}}>
                  Create Account
                </button>
              </div>

              <h3 style={{marginBottom:20}}>
                {authMode==="login" ? "Welcome back 👋" : authMode==="signup" ? "Join TripSync ✦" : "Reset your password 🔑"}
              </h3>

              {authMode==="signup" && (
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" placeholder="e.g. Maria" value={loginForm.name}
                    onChange={e=>setLoginForm(f=>({...f,name:e.target.value}))}/>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="you@email.com" value={loginForm.email}
                  onChange={e=>setLoginForm(f=>({...f,email:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&authMode==="forgot"&&handleForgotPassword()}/>
                {authMode==="forgot" && (
                  <div style={{fontSize:12,color:"var(--muted)",marginTop:5}}>
                    We'll send a reset link to this address.
                  </div>
                )}
              </div>

              {(authMode==="login"||authMode==="signup") && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={loginForm.password}
                    onChange={e=>setLoginForm(f=>({...f,password:e.target.value}))}
                    onKeyDown={e=>e.key==="Enter"&&(authMode==="login"?handleSignIn():handleSignUp())}/>
                  {authMode==="signup" && <div style={{fontSize:12,color:"var(--muted)",marginTop:5}}>Minimum 6 characters</div>}
                </div>
              )}

              {authMode==="signup" && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={loginForm.confirmPassword}
                    onChange={e=>setLoginForm(f=>({...f,confirmPassword:e.target.value}))}
                    onKeyDown={e=>e.key==="Enter"&&handleSignUp()}/>
                </div>
              )}

              {authMode==="login" && (
                <div style={{marginTop:-8,marginBottom:16,textAlign:"right"}}>
                  <button type="button"
                    style={{background:"none",border:"none",color:"var(--accent)",fontSize:12,cursor:"pointer",padding:0}}
                    onClick={()=>{setAuthMode("forgot");setAuthError("");}}>
                    Forgot your password?
                  </button>
                </div>
              )}

              {authMode==="forgot" && (
                <div style={{marginTop:-8,marginBottom:16,textAlign:"right"}}>
                  <button type="button"
                    style={{background:"none",border:"none",color:"var(--muted)",fontSize:12,cursor:"pointer",padding:0}}
                    onClick={()=>{setAuthMode("login");setAuthError("");}}>
                    ← Back to sign in
                  </button>
                </div>
              )}

              {authError && (
                <div style={{
                  padding:"10px 14px",borderRadius:9,marginBottom:16,fontSize:13,
                  background: authError.startsWith("✅") ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                  border: authError.startsWith("✅") ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)",
                  color: authError.startsWith("✅") ? "var(--green)" : "var(--red)",
                }}>
                  {authError}
                </div>
              )}

              <div className="form-actions">
                <button className="btn btn-ghost" onClick={()=>{setShowLogin(false);setAuthError("");setLoginForm({name:"",email:"",password:"",confirmPassword:""});setAuthMode("login");}}>Cancel</button>
                {authMode==="forgot"
                  ? <button className="btn btn-primary" disabled={authBusy} onClick={handleForgotPassword}>
                      {authBusy ? "Sending…" : "Send Reset Link →"}
                    </button>
                  : <button className="btn btn-primary" disabled={authBusy}
                      onClick={authMode==="login"?handleSignIn:handleSignUp}>
                      {authBusy ? "Please wait…" : authMode==="login" ? "Sign In →" : "Create Account →"}
                    </button>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
