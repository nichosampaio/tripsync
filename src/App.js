import { useState, useMemo, useRef, useEffect } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');`;

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #0a0f1e; color: #e8eaf6; }
:root {
  --bg: #0a0f1e; --surface: #111827; --surface2: #1a2236; --border: #1e2d45;
  --accent: #38bdf8; --accent2: #818cf8; --green: #34d399; --red: #f87171;
  --yellow: #fbbf24; --text: #e8eaf6; --muted: #6b7fa3;
}
.app { min-height: 100vh; background: var(--bg); }
.nav { display:flex; align-items:center; justify-content:space-between; padding:18px 40px; border-bottom:1px solid var(--border); background:rgba(10,15,30,0.95); backdrop-filter:blur(12px); position:sticky; top:0; z-index:100; }
.nav-logo { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:var(--accent); letter-spacing:-0.5px; cursor:pointer; }
.nav-logo span { color:var(--accent2); }
.nav-tabs { display:flex; gap:4px; }
.nav-tab { padding:8px 18px; border-radius:8px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; background:transparent; color:var(--muted); transition:all 0.2s; }
.nav-tab:hover { color:var(--text); background:var(--surface2); }
.nav-tab.active { background:var(--accent); color:#0a0f1e; font-weight:600; }
.nav-user { display:flex; align-items:center; gap:10px; }
.avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; color:#0a0f1e; }
.landing { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:90vh; text-align:center; padding:60px 20px; background:radial-gradient(ellipse 80% 60% at 50% -20%,rgba(56,189,248,0.12),transparent),radial-gradient(ellipse 60% 40% at 80% 80%,rgba(129,140,248,0.08),transparent); }
.landing h1 { font-family:'Syne',sans-serif; font-size:clamp(42px,7vw,80px); font-weight:800; line-height:1.05; letter-spacing:-2px; background:linear-gradient(135deg,#e8eaf6 30%,var(--accent) 70%,var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:20px; }
.landing p { font-size:18px; color:var(--muted); max-width:540px; line-height:1.7; margin-bottom:40px; }
.btn-group { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; }
.btn { padding:14px 28px; border-radius:10px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; transition:all 0.2s; display:inline-flex; align-items:center; gap:8px; }
.btn-primary { background:var(--accent); color:#0a0f1e; }
.btn-primary:hover { background:#7dd3fc; transform:translateY(-1px); }
.btn-ghost { background:var(--surface2); color:var(--text); border:1px solid var(--border); }
.btn-ghost:hover { border-color:var(--accent); color:var(--accent); }
.btn-sm { padding:8px 16px; font-size:13px; border-radius:8px; }
.btn-danger { background:rgba(248,113,113,0.12); color:var(--red); border:1px solid rgba(248,113,113,0.3); }
.btn-accent2 { background:rgba(129,140,248,0.15); color:var(--accent2); border:1px solid rgba(129,140,248,0.3); }
.features { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; max-width:900px; margin-top:60px; text-align:left; }
.feature-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; }
.feature-icon { font-size:28px; margin-bottom:12px; }
.feature-card h3 { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; margin-bottom:8px; }
.feature-card p { font-size:13px; color:var(--muted); line-height:1.6; }
.dashboard { padding:40px; max-width:1200px; margin:0 auto; }
.trip-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
.trip-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; cursor:pointer; transition:all 0.2s; }
.trip-card:hover { border-color:var(--accent); transform:translateY(-2px); }
.trip-card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.trip-name { font-family:'Syne',sans-serif; font-size:19px; font-weight:700; }
.badge { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; background:rgba(56,189,248,0.15); color:var(--accent); }
.badge-yellow { background:rgba(251,191,36,0.15); color:var(--yellow); }
.badge-green { background:rgba(52,211,153,0.15); color:var(--green); }
.trip-meta { display:flex; flex-direction:column; gap:6px; }
.trip-meta-item { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--muted); }
.trip-meta-item strong { color:var(--text); }
.members-row { display:flex; gap:4px; margin-top:14px; flex-wrap:wrap; }
.member-chip { padding:4px 10px; border-radius:20px; font-size:12px; background:var(--surface2); border:1px solid var(--border); color:var(--muted); }
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
.modal { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:32px; width:100%; max-width:540px; max-height:92vh; overflow-y:auto; }
.modal-lg { max-width:640px; }
.modal h3 { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; margin-bottom:24px; }
.form-group { margin-bottom:18px; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.form-label { display:block; font-size:12px; font-weight:600; color:var(--muted); margin-bottom:7px; text-transform:uppercase; letter-spacing:0.5px; }
.form-input { width:100%; padding:11px 14px; border-radius:10px; background:var(--surface2); border:1px solid var(--border); color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border-color 0.2s; }
.form-input:focus { border-color:var(--accent); }
.form-input.err { border-color:var(--red); }
.form-textarea { resize:vertical; min-height:70px; }
.form-actions { display:flex; gap:12px; justify-content:flex-end; margin-top:24px; }
.err-msg { color:var(--red); font-size:12px; margin-top:5px; }
.trip-detail { padding:40px; max-width:1100px; margin:0 auto; }
.trip-detail-header { display:flex; align-items:center; gap:12px; margin-bottom:8px; flex-wrap:wrap; }
.back-btn { background:var(--surface2); border:1px solid var(--border); color:var(--muted); border-radius:8px; padding:8px 14px; cursor:pointer; font-size:14px; }
.back-btn:hover { color:var(--text); border-color:var(--accent); }
.trip-detail h2 { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; }
.section-tabs { display:flex; gap:2px; margin:26px 0 22px; border-bottom:1px solid var(--border); flex-wrap:wrap; }
.section-tab { padding:10px 16px; border-radius:8px 8px 0 0; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; background:transparent; color:var(--muted); border-bottom:2px solid transparent; margin-bottom:-1px; transition:all 0.15s; white-space:nowrap; }
.section-tab:hover { color:var(--text); }
.section-tab.active { color:var(--accent); border-bottom-color:var(--accent); background:rgba(56,189,248,0.05); }
.section-content { animation:fadeIn 0.2s ease; }
@keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.datepicker-wrap { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
.dp-top { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--border); }
.dp-top span { font-family:'Syne',sans-serif; font-weight:700; font-size:15px; }
.dp-nav { background:var(--surface2); border:1px solid var(--border); color:var(--text); border-radius:7px; width:30px; height:30px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; }
.dp-body { padding:14px 18px; }
.dp-hdrs { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; margin-bottom:4px; }
.dp-hdr { text-align:center; font-size:11px; font-weight:600; color:var(--muted); padding:4px 0; text-transform:uppercase; }
.dp-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
.dp-cell { height:34px; display:flex; align-items:center; justify-content:center; border-radius:7px; font-size:13px; cursor:pointer; transition:all 0.1s; border:1px solid transparent; color:var(--text); }
.dp-cell:hover:not(.dp-empty):not(.dp-past) { background:var(--surface2); }
.dp-empty { cursor:default; }
.dp-past { color:var(--muted); opacity:0.35; cursor:not-allowed; }
.dp-start { background:var(--accent) !important; color:#0a0f1e !important; font-weight:700; border-radius:7px 0 0 7px !important; }
.dp-end { background:var(--accent) !important; color:#0a0f1e !important; font-weight:700; border-radius:0 7px 7px 0 !important; }
.dp-start.dp-end { border-radius:7px !important; }
.dp-in-range { background:rgba(56,189,248,0.13); border-radius:0 !important; }
.dp-footer { padding:10px 18px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; }
.dp-footer-label { font-size:13px; color:var(--muted); }
.dp-footer-label strong { color:var(--accent); }
.sched-layout { display:grid; grid-template-columns:200px 1fr; gap:20px; align-items:start; }
.sched-mini-cal { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; position:sticky; top:80px; }
.smc-header { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--border); }
.smc-header span { font-family:'Syne',sans-serif; font-weight:700; font-size:13px; }
.smc-nav { background:transparent; border:none; color:var(--muted); cursor:pointer; font-size:15px; padding:2px 6px; border-radius:5px; }
.smc-nav:hover { color:var(--accent); }
.smc-body { padding:10px 12px 12px; }
.smc-day-hdrs { display:grid; grid-template-columns:repeat(7,1fr); margin-bottom:3px; }
.smc-day-hdr { text-align:center; font-size:9px; font-weight:600; color:var(--muted); text-transform:uppercase; }
.smc-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.smc-cell { height:26px; display:flex; align-items:center; justify-content:center; border-radius:5px; font-size:11px; cursor:pointer; transition:all 0.1s; border:1px solid transparent; color:var(--muted); }
.smc-cell:hover:not(.smc-empty) { background:var(--surface2); color:var(--text); }
.smc-empty { cursor:default; }
.smc-trip { background:rgba(56,189,248,0.12); border-color:rgba(56,189,248,0.2); color:var(--accent); }
.smc-trip-start { background:var(--accent) !important; color:#0a0f1e !important; font-weight:700; border-radius:5px 0 0 5px; }
.smc-trip-end { background:var(--accent) !important; color:#0a0f1e !important; font-weight:700; border-radius:0 5px 5px 0; }
.smc-trip-start.smc-trip-end { border-radius:5px !important; }
.smc-active { outline:2px solid var(--accent2); outline-offset:1px; }
.smc-today { background:rgba(129,140,248,0.15); border-color:rgba(129,140,248,0.4); color:var(--accent2); font-weight:700; }
.day-block { background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom:12px; overflow:hidden; transition:border-color 0.15s; }
.day-block.active-day { border-color:var(--accent); }
.day-block.drag-over-day { border-color:var(--accent2) !important; background:rgba(129,140,248,0.04); }
.day-block-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; }
.day-block-header:hover { background:rgba(255,255,255,0.02); }
.day-label { display:flex; align-items:center; gap:12px; }
.day-num { width:34px; height:34px; border-radius:50%; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; }
.day-num.is-today { background:var(--accent2); color:#0a0f1e; border-color:var(--accent2); }
.day-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; }
.day-sub { font-size:12px; color:var(--muted); margin-top:1px; }
.day-count-badge { font-size:11px; color:var(--muted); background:var(--surface2); border:1px solid var(--border); border-radius:20px; padding:2px 10px; }
.day-body { padding:0 18px 16px; border-top:1px solid var(--border); }
.tl-wrap { position:relative; display:flex; gap:0; margin-top:14px; }
.tl-labels { display:flex; flex-direction:column; width:44px; flex-shrink:0; }
.tl-hour-label { height:50px; display:flex; align-items:flex-start; justify-content:flex-end; padding-right:10px; font-size:10px; color:var(--muted); font-weight:500; padding-top:2px; user-select:none; }
.tl-grid { position:relative; flex:1; border-left:1px solid var(--border); }
.tl-hour-line { position:absolute; left:0; right:0; height:1px; background:var(--border); opacity:0.5; }
.tl-slot { position:absolute; left:0; right:0; height:50px; transition:background 0.1s; }
.tl-slot.drag-over-slot { background:rgba(129,140,248,0.12); }
.tl-event { position:absolute; left:4px; right:4px; border-radius:8px; padding:5px 8px; overflow:hidden; cursor:grab; transition:filter 0.15s; border:1px solid transparent; z-index:2; user-select:none; }
.tl-event:hover { filter:brightness(1.15); z-index:10; }
.tl-event-name { font-size:12px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.2; }
.tl-event-time { font-size:10px; opacity:0.8; margin-top:2px; white-space:nowrap; }
.tl-event-overlap { border:1.5px dashed var(--red) !important; }
.tl-activity { background:rgba(56,189,248,0.22); border-color:rgba(56,189,248,0.5); color:var(--accent); }
.tl-meal      { background:rgba(251,191,36,0.22);  border-color:rgba(251,191,36,0.5);  color:var(--yellow); }
.tl-transport { background:rgba(52,211,153,0.22);  border-color:rgba(52,211,153,0.5);  color:var(--green); }
.tl-hotel     { background:rgba(129,140,248,0.22); border-color:rgba(129,140,248,0.5); color:var(--accent2); }
.tl-note      { background:rgba(107,127,163,0.22); border-color:rgba(107,127,163,0.4); color:var(--muted); }
.edit-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.72); z-index:400; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(5px); }
.edit-modal { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:28px; width:100%; max-width:580px; max-height:92vh; overflow-y:auto; }
.edit-modal h4 { font-family:'Syne',sans-serif; font-size:19px; font-weight:800; margin-bottom:20px; }
.type-tab-row { display:flex; gap:4px; margin-bottom:18px; flex-wrap:wrap; }
.type-tab { padding:6px 13px; border-radius:20px; border:1px solid var(--border); background:transparent; color:var(--muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; }
.type-tab.active { background:var(--accent); color:#0a0f1e; border-color:var(--accent); }
.view-toggle { display:flex; gap:4px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:3px; margin-bottom:14px; width:fit-content; }
.view-toggle-btn { padding:5px 12px; border-radius:6px; border:none; font-size:12px; font-weight:600; cursor:pointer; background:transparent; color:var(--muted); }
.view-toggle-btn.active { background:var(--surface); color:var(--accent); }
.overlap-warn { display:flex; align-items:center; gap:8px; padding:8px 12px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.3); border-radius:8px; font-size:12px; color:var(--red); margin-bottom:10px; }
.ci-list { display:flex; flex-direction:column; gap:8px; margin-top:12px; }
.ci-card { display:flex; align-items:flex-start; gap:10px; padding:11px 13px; background:var(--surface2); border:1px solid var(--border); border-radius:10px; cursor:pointer; transition:all 0.15s; user-select:none; }
.ci-card:hover { border-color:var(--accent2); }
.ci-card.drag-over { border-color:var(--accent); background:rgba(56,189,248,0.06); }
.ci-drag { color:var(--muted); font-size:14px; cursor:grab; padding:0 3px; flex-shrink:0; align-self:center; }
.ci-icon { font-size:17px; flex-shrink:0; margin-top:1px; }
.ci-body { flex:1; min-width:0; }
.ci-title { font-size:14px; font-weight:600; margin-bottom:2px; }
.ci-meta { font-size:12px; color:var(--muted); display:flex; gap:8px; flex-wrap:wrap; margin-top:3px; }
.ci-actions { display:flex; gap:4px; flex-shrink:0; }
.ci-btn { background:transparent; border:none; color:var(--muted); cursor:pointer; font-size:14px; padding:3px 6px; border-radius:5px; }
.ci-btn:hover { color:var(--accent); }
.ci-btn.del:hover { color:var(--red); }
.add-row { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; align-items:center; }
.add-input { flex:1; min-width:140px; padding:9px 12px; border-radius:9px; background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; outline:none; }
.add-input:focus { border-color:var(--accent); }
.add-type { padding:9px 10px; border-radius:9px; background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; }
.pill { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:500; }
.pill-b { background:rgba(56,189,248,0.12); color:var(--accent); border:1px solid rgba(56,189,248,0.25); }
.pill-p { background:rgba(129,140,248,0.12); color:var(--accent2); border:1px solid rgba(129,140,248,0.25); }
.pill-g { background:rgba(52,211,153,0.12); color:var(--green); border:1px solid rgba(52,211,153,0.25); }
.pill-y { background:rgba(251,191,36,0.12); color:var(--yellow); border:1px solid rgba(251,191,36,0.25); }
.type-badge { padding:3px 9px; border-radius:20px; font-size:11px; font-weight:600; border:1px solid; display:inline-flex; align-items:center; gap:4px; }
.type-activity { background:rgba(56,189,248,0.12); color:var(--accent); border-color:rgba(56,189,248,0.3); }
.type-meal     { background:rgba(251,191,36,0.12);  color:var(--yellow); border-color:rgba(251,191,36,0.3); }
.type-hotel    { background:rgba(129,140,248,0.12); color:var(--accent2); border-color:rgba(129,140,248,0.3); }
.type-transport{ background:rgba(52,211,153,0.12);  color:var(--green);  border-color:rgba(52,211,153,0.3); }
.type-note     { background:rgba(107,127,163,0.12); color:var(--muted);  border-color:rgba(107,127,163,0.3); }
.avail-strip { display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; }
.avail-chip { padding:4px 10px; border-radius:20px; font-size:12px; cursor:pointer; border:1px solid var(--border); background:var(--surface2); color:var(--muted); transition:all 0.15s; user-select:none; }
.avail-chip.avail { background:rgba(52,211,153,0.15); border-color:rgba(52,211,153,0.4); color:var(--green); }
.avail-chip.unavail { background:rgba(248,113,113,0.08); border-color:rgba(248,113,113,0.3); color:var(--red); opacity:0.7; }
.section-hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
.section-hdr h4 { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; }
.info-panel { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
.info-panel-header { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-bottom:1px solid var(--border); }
.info-panel-header h4 { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; }
.info-view-grid { display:grid; grid-template-columns:1fr 1fr; }
.info-view-cell { padding:15px 22px; border-bottom:1px solid var(--border); }
.info-view-cell.full { grid-column:span 2; }
.info-view-cell:nth-child(odd):not(.full) { border-right:1px solid var(--border); }
.info-view-label { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:0.8px; font-weight:600; margin-bottom:4px; }
.info-view-val { font-size:15px; font-weight:500; }
.info-edit-body { padding:22px; }
.accom-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:16px; margin-top:16px; }
.accom-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px; }
.accom-card:hover { border-color:var(--accent2); }
.card-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
.card-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; }
.card-actions { display:flex; gap:5px; }
.card-meta { display:flex; flex-direction:column; gap:5px; }
.card-meta-row { display:flex; align-items:center; gap:7px; font-size:13px; color:var(--muted); }
.card-meta-row strong { color:var(--text); }
.card-notes { margin-top:10px; font-size:13px; color:var(--muted); line-height:1.5; border-top:1px solid var(--border); padding-top:10px; }
.stars { color:var(--yellow); font-size:12px; }
.activity-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:16px; margin-top:16px; }
.activity-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px; }
.activity-card:hover { border-color:var(--accent2); }
.activity-desc { font-size:13px; color:var(--muted); line-height:1.5; margin:6px 0 12px; }
.vote-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; margin-bottom:16px; }
.vote-card h4 { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; margin-bottom:16px; }
.vote-options { display:flex; flex-direction:column; gap:10px; }
.vote-opt { display:flex; align-items:center; justify-content:space-between; padding:11px 14px; border-radius:10px; background:var(--surface2); border:1px solid var(--border); cursor:pointer; }
.vote-opt.voted { border-color:var(--accent); background:rgba(56,189,248,0.08); }
.vbar-wrap { flex:1; margin:0 14px; }
.vbar-bg { height:5px; background:var(--border); border-radius:3px; overflow:hidden; }
.vbar-fill { height:100%; background:linear-gradient(90deg,var(--accent),var(--accent2)); border-radius:3px; transition:width 0.4s; }
.vote-count { font-size:12px; color:var(--muted); min-width:50px; text-align:right; }
.vote-btn { padding:5px 13px; border-radius:6px; border:1px solid var(--border); background:transparent; color:var(--muted); cursor:pointer; font-size:12px; white-space:nowrap; }
.vote-btn.on { background:var(--accent); color:#0a0f1e; border-color:var(--accent); font-weight:600; }
.act-vote-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px; margin-bottom:10px; }
.act-vote-top { display:flex; gap:12px; align-items:flex-start; }
.act-vote-emoji { font-size:22px; flex-shrink:0; margin-top:1px; }
.act-vote-info { flex:1; min-width:0; }
.act-vote-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:3px; }
.act-vote-desc { font-size:13px; color:var(--muted); line-height:1.4; margin-bottom:8px; }
.act-vote-pills { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:10px; }
.act-vote-row { display:flex; align-items:center; gap:8px; border-top:1px solid var(--border); padding-top:12px; margin-top:4px; }
.vbtn-up { padding:6px 16px; border-radius:8px; border:1px solid rgba(52,211,153,0.35); background:rgba(52,211,153,0.08); color:var(--green); font-size:13px; font-weight:600; cursor:pointer; }
.vbtn-up.on { background:rgba(52,211,153,0.22); border-color:var(--green); }
.vbtn-down { padding:6px 16px; border-radius:8px; border:1px solid rgba(248,113,113,0.3); background:rgba(248,113,113,0.06); color:var(--red); font-size:13px; font-weight:600; cursor:pointer; }
.vbtn-down.on { background:rgba(248,113,113,0.18); border-color:var(--red); }
.vote-tally { font-size:12px; color:var(--muted); margin-left:auto; }
.budget-dash { display:flex; flex-direction:column; gap:16px; }
.budget-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px; }
.budget-card h4 { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; margin-bottom:16px; }
.cat-row { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
.cat-icon { font-size:18px; width:26px; flex-shrink:0; text-align:center; }
.cat-label { min-width:115px; font-size:13px; color:var(--muted); }
.cat-bar-wrap { flex:1; }
.cat-bar-bg { height:8px; background:var(--surface2); border-radius:4px; overflow:hidden; border:1px solid var(--border); }
.cat-bar-fill { height:100%; border-radius:4px; transition:width 0.5s; }
.cat-amount { min-width:68px; text-align:right; font-size:13px; font-weight:600; }
.budget-total-row { display:flex; justify-content:space-between; align-items:center; padding:14px 0 0; border-top:1px solid var(--border); }
.budget-total-label { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; }
.budget-total-val { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:var(--accent); }
.budget-status-bar { height:10px; border-radius:5px; background:var(--surface2); border:1px solid var(--border); overflow:hidden; margin:10px 0 4px; }
.budget-status-fill { height:100%; border-radius:5px; transition:width 0.4s; }
.budget-over { color:var(--red); font-size:13px; font-weight:600; margin-top:4px; }
.budget-under { color:var(--green); font-size:13px; font-weight:600; margin-top:4px; }
.per-person-row { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:rgba(56,189,248,0.06); border:1px solid rgba(56,189,248,0.2); border-radius:10px; margin-top:10px; }
.inline-form { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:20px; margin-top:16px; }
.inline-form h5 { font-family:'Syne',sans-serif; font-weight:700; font-size:15px; margin-bottom:14px; color:var(--accent2); }
.empty-state { text-align:center; padding:40px 20px; color:var(--muted); border:1px dashed var(--border); border-radius:14px; font-size:14px; }
.empty-state div { font-size:32px; margin-bottom:10px; }
.summary-card { background:linear-gradient(135deg,var(--surface),var(--surface2)); border:1px solid var(--border); border-radius:20px; padding:30px; }
.summary-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; margin-bottom:6px; }
.summary-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:22px; }
.summary-item { background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:12px; padding:16px; }
.summary-item label { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block; }
.summary-item .val { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; }
.tag-wrap { display:flex; flex-wrap:wrap; gap:7px; margin-top:8px; }
.tag { padding:4px 11px; border-radius:20px; font-size:12px; background:rgba(129,140,248,0.15); border:1px solid rgba(129,140,248,0.3); color:var(--accent2); }
.tag-b { background:rgba(56,189,248,0.12); border-color:rgba(56,189,248,0.3); color:var(--accent); }
.country-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; }
.info-row { display:flex; gap:12px; padding:11px 0; border-bottom:1px solid var(--border); align-items:flex-start; }
.info-row:last-child { border-bottom:none; }
.info-icon { font-size:20px; width:30px; flex-shrink:0; }
.info-lbl { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px; }
.info-txt { font-size:14px; margin-top:2px; }
.invite-box { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:13px 17px; display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:14px; }
.invite-link { font-family:monospace; font-size:13px; color:var(--accent); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.members-tab { display:flex; flex-direction:column; gap:12px; }
.member-row { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--surface); border:1px solid var(--border); border-radius:12px; }
.member-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:15px; color:#0a0f1e; flex-shrink:0; }
.member-avatar.owner { background:linear-gradient(135deg,var(--yellow),#f97316); }
.member-avatar.viewer { background:linear-gradient(135deg,var(--muted),#4b5a75); }
.member-info { flex:1; min-width:0; }
.member-name { font-weight:600; font-size:14px; }
.member-meta { font-size:12px; color:var(--muted); margin-top:2px; }
.role-badge { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; border:1px solid; flex-shrink:0; }
.role-owner  { background:rgba(251,191,36,0.15); color:var(--yellow); border-color:rgba(251,191,36,0.35); }
.role-editor { background:rgba(56,189,248,0.12); color:var(--accent); border-color:rgba(56,189,248,0.3); }
.role-viewer { background:rgba(107,127,163,0.12); color:var(--muted); border-color:rgba(107,127,163,0.25); }
.invite-panel { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px; margin-top:16px; }
.invite-panel h5 { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:14px; color:var(--accent2); }
.pending-invite { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; background:var(--surface2); border-radius:9px; border:1px solid var(--border); margin-top:8px; font-size:13px; }
.pending-dot { width:7px; height:7px; border-radius:50%; background:var(--yellow); display:inline-block; margin-right:6px; }
.suggested-by { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--muted); margin-top:5px; }
.sugg-avatar { width:16px; height:16px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:inline-flex; align-items:center; justify-content:center; font-size:8px; font-weight:700; color:#0a0f1e; flex-shrink:0; }
.flex-between { display:flex; justify-content:space-between; align-items:center; }
.mt-2{margin-top:8px} .mt-4{margin-top:16px} .mt-6{margin-top:24px}
.text-muted{color:var(--muted);font-size:14px} .text-sm{font-size:13px}
.sdp-wrap { position:relative; width:100%; }
.sdp-trigger { width:100%; padding:10px 14px; border-radius:10px; background:var(--surface2); border:1px solid var(--border); color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; cursor:pointer; text-align:left; display:flex; align-items:center; justify-content:space-between; }
.sdp-trigger:hover { border-color:var(--accent); }
.sdp-popup { position:absolute; top:calc(100% + 6px); left:0; z-index:500; background:var(--surface); border:1px solid var(--border); border-radius:14px; box-shadow:0 12px 40px rgba(0,0,0,0.5); overflow:hidden; min-width:300px; }
.time-picker { display:flex; gap:5px; align-items:center; }
.tp-input { width:52px; padding:10px 6px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; outline:none; text-align:center; }
.tp-input:focus { border-color:var(--accent); }
.tp-sep { color:var(--muted); font-weight:700; font-size:15px; flex-shrink:0; }
.ampm-toggle { display:flex; border-radius:8px; overflow:hidden; border:1px solid var(--border); flex-shrink:0; }
.ampm-btn { padding:8px 11px; background:transparent; border:none; color:var(--muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; }
.ampm-btn.active { background:var(--accent2); color:#0a0f1e; }
.sched-legend { display:flex; gap:14px; align-items:center; flex-wrap:wrap; font-size:12px; color:var(--muted); }
@media(max-width:768px){
  .features,.summary-grid,.form-row{grid-template-columns:1fr}
  .nav{padding:14px 20px} .nav-tabs{display:none}
  .dashboard,.trip-detail{padding:20px}
  .accom-grid,.activity-grid{grid-template-columns:1fr}
  .sched-layout{grid-template-columns:1fr}
  .sched-mini-cal{position:static}
}
`;

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_ABR = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const TL_START_HR = 6, TL_END_HR = 23, TL_HOURS = 17, PX_PER_HR = 50;

const TYPE_META = {
  activity:  { icon:"🎯", label:"Activity",  color:"#38bdf8", tlClass:"tl-activity" },
  meal:      { icon:"🍽️", label:"Meal",       color:"#fbbf24", tlClass:"tl-meal" },
  transport: { icon:"🚌", label:"Transport",  color:"#34d399", tlClass:"tl-transport" },
  hotel:     { icon:"🏨", label:"Hotel/Stay", color:"#818cf8", tlClass:"tl-hotel" },
  note:      { icon:"📝", label:"Note",       color:"#6b7fa3", tlClass:"tl-note" },
};

let _id = 500;
const uid = () => ++_id;

function toYMD(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function fromYMD(s) { if(!s)return null; const[y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function fmtDate(s) { if(!s)return""; const d=fromYMD(s); return `${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`; }
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
function UniversalEditModal({ item, trip, setTrip, onClose }) {
  const tripDays = useMemo(()=>buildTripDays(trip.startDate,trip.endDate),[trip]);
  const [form, setForm] = useState({
    type:        item.type,
    title:       item.title,
    day:         item.day || "",
    startTime:   item.startTime || "",
    durationMin: String(item.durationMin || 30),
    location:    item.location || "",
    price:       item.price ? String(item.price) : "",
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
    setTrip(t=>({
      ...t,
      calendarItems: t.calendarItems.map(ci => ci.id!==item.id ? ci : {
        ...ci,
        type: form.type, title: form.title.trim(),
        day: form.day||null, startTime: form.startTime||null,
        startMin, durationMin: durMin,
        location: form.location, price: form.price?+form.price:0,
        metadata: {
          ...ci.metadata,
          description: form.description, notes: form.notes,
          checkIn: form.checkIn||null, checkOut: form.checkOut||null,
          transportationTime: form.transportationTime?+form.transportationTime:"",
          travelTimeFromPrev: form.travelTimeFromPrev?+form.travelTimeFromPrev:0,
        }
      })
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
function DayBlock({dayYMD,dayNum,totalDays,trip,setTrip,isOpen,onToggleOpen,onEditItem}) {
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

  const removeItem=id=>setTrip(t=>({...t,calendarItems:t.calendarItems.filter(ci=>ci.id!==id)}));

  const addItem=()=>{
    if(!newTitle.trim()) return;
    const startMin=timeStrToMin(newTime)??null;
    setTrip(t=>({...t,calendarItems:[...t.calendarItems,{
      id:uid(),type:newType,title:newTitle.trim(),day:dayYMD,
      startTime:newTime||null,startMin,durationMin:60,
      location:"",price:0,metadata:{notes:"",description:""}
    }]}));
    setNewTitle(""); setNewTime("");
  };

  const handleDayDragOver=e=>{e.preventDefault();setDayDragOver(true);};
  const handleDayDragLeave=()=>setDayDragOver(false);
  const handleDayDrop=e=>{
    e.preventDefault();setDayDragOver(false);setSlotDragOver(null);
    const id=parseInt(e.dataTransfer.getData("ciId"));
    if(!id) return;
    setTrip(t=>({...t,calendarItems:t.calendarItems.map(ci=>ci.id!==id?ci:{...ci,day:dayYMD})}));
  };

  const handleSlotDragOver=(e,hour)=>{e.preventDefault();e.stopPropagation();setSlotDragOver(hour);};
  const handleSlotDragLeave=()=>setSlotDragOver(null);
  const handleSlotDrop=(e,hour)=>{
    e.preventDefault();e.stopPropagation();setSlotDragOver(null);
    const id=parseInt(e.dataTransfer.getData("ciId"));
    if(!id) return;
    const newStartMin=hour*60;
    setTrip(t=>({...t,calendarItems:t.calendarItems.map(ci=>ci.id!==id?ci:{...ci,day:dayYMD,startMin:newStartMin,startTime:minToTimeStr(newStartMin)})}));
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
                    onDrop={e=>{e.preventDefault();setListDragOverId(null);const srcId=parseInt(e.dataTransfer.getData("ciId"));if(srcId&&srcId!==ci.id){setTrip(t=>({...t,calendarItems:t.calendarItems.map(c=>c.id!==srcId?c:{...c,day:dayYMD})}));}}}
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
function ScheduleTab({trip,setTrip}) {
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
        <h4 style={{fontFamily:"Syne",fontSize:18,fontWeight:700,marginBottom:8}}>No trip dates set</h4>
        <p style={{color:"var(--muted)",fontSize:14}}>Set dates in <strong>ℹ️ Trip Info</strong> to build your itinerary.</p>
      </div>
    );
  }

  const nights=nightsBetween(startDate,endDate);
  const totalItems=(trip.calendarItems||[]).filter(c=>c.day).length;

  return (
    <div>
      {editingItem && <UniversalEditModal item={editingItem} trip={trip} setTrip={setTrip} onClose={()=>setEditingItem(null)}/>}
      <div className="flex-between" style={{marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div>
          <h4 style={{fontFamily:"Syne",fontSize:18,fontWeight:700,marginBottom:4}}>Trip Schedule</h4>
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
                onEditItem={setEditingItem}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAP TAB (Google My Maps) ─────────────────────────────────────────────────
function MapTab({trip,setTrip}) {
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
    setTrip(t=>({...t,googleMapsUrl:inputUrl.trim()}));
    setEditing(false);
  };

  const clear=()=>{setTrip(t=>({...t,googleMapsUrl:""}));setInputUrl("");setEditing(true);setErr("");};

  const copyUrl=text=>{
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  return (
    <div>
      <div className="flex-between" style={{marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <h4 style={{fontFamily:"Syne",fontSize:18,fontWeight:700,marginBottom:4}}>🗺️ Google My Maps</h4>
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
              <div style={{fontFamily:"Syne",fontSize:15,fontWeight:700}}>Connect a Google My Map</div>
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
                  <div style={{fontFamily:"Syne",fontSize:14,fontWeight:700}}>Embed URL</div>
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
                  <div style={{fontFamily:"Syne",fontSize:14,fontWeight:700}}>Edit URL</div>
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
function ActivityTab({trip,setTrip,user}) {
  const [editingItem,setEditingItem] = useState(null);
  const [showAdd,setShowAdd] = useState(false);
  const [form,setForm] = useState({type:"activity",title:"",location:"",description:"",startTime:"",durationMin:"60",price:"",notes:"",day:""});
  const [errs,setErrs] = useState({});
  const tripDays=useMemo(()=>buildTripDays(trip.startDate,trip.endDate),[trip]);
  const items=trip.calendarItems||[];

  const validate=()=>{
    const e={};
    if(!form.title.trim()) e.title="Title required";
    if(form.price&&isNaN(+form.price)) e.price="Numeric";
    setErrs(e); return !Object.keys(e).length;
  };

  const addItem=()=>{
    if(!validate()) return;
    const startMin=timeStrToMin(form.startTime)??null;
    setTrip(t=>({...t,calendarItems:[...t.calendarItems,{
      id:uid(),type:form.type,title:form.title.trim(),
      day:form.day||null,startTime:form.startTime||null,startMin,
      durationMin:+form.durationMin||60,location:form.location,
      price:form.price?+form.price:0,
      metadata:{description:form.description,notes:form.notes,upvotes:[],downvotes:[],createdBy:user}
    }]}));
    setForm({type:"activity",title:"",location:"",description:"",startTime:"",durationMin:"60",price:"",notes:"",day:""});
    setShowAdd(false);
  };

  const del=id=>setTrip(t=>({...t,calendarItems:t.calendarItems.filter(c=>c.id!==id)}));
  const F=k=>({value:form[k],onChange:e=>setForm(f=>({...f,[k]:e.target.value})),className:"form-input"});

  return (
    <div>
      {editingItem && <UniversalEditModal item={editingItem} trip={trip} setTrip={setTrip} onClose={()=>setEditingItem(null)}/>}
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
              <label className="form-label">Notes</label>
              <input {...F("notes")} placeholder="e.g. Book in advance"/>
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
                {ci.metadata?.createdBy&&<div className="suggested-by"><span className="sugg-avatar">{ci.metadata.createdBy[0]}</span>By {ci.metadata.createdBy}</div>}
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}

// ─── VOTING TAB ───────────────────────────────────────────────────────────────
function VotingTab({trip,setTrip,user}) {
  const voteItem=(section,id)=>setTrip(t=>({
    ...t,[section]:t[section].map(item=>item.id!==id?item:{...item,votes:item.votes.includes(user)?item.votes.filter(v=>v!==user):[...item.votes,user]})
  }));

  const voteCI=(id,dir)=>setTrip(t=>({
    ...t,calendarItems:t.calendarItems.map(ci=>{
      if(ci.id!==id) return ci;
      const up=ci.metadata?.upvotes||[],down=ci.metadata?.downvotes||[];
      if(dir==="up"){const has=up.includes(user);return{...ci,metadata:{...ci.metadata,upvotes:has?up.filter(u=>u!==user):[...up.filter(u=>u!==user),user],downvotes:down.filter(u=>u!==user)}};}
      else{const has=down.includes(user);return{...ci,metadata:{...ci.metadata,downvotes:has?down.filter(u=>u!==user):[...down.filter(u=>u!==user),user],upvotes:up.filter(u=>u!==user)}};}
    })
  }));

  const renderSection=(title,items,key,emoji)=>{
    const max=Math.max(...items.map(i=>i.votes.length),1);
    return (
      <div className="vote-card">
        <h4>{emoji} {title}</h4>
        <div className="vote-options">
          {[...items].sort((a,b)=>b.votes.length-a.votes.length).map(item=>{
            const v=item.votes.includes(user);
            return (
              <div key={item.id} className={`vote-opt ${v?"voted":""}`} onClick={()=>voteItem(key,item.id)}>
                <span style={{fontSize:13,fontWeight:v?600:400,minWidth:130,flexShrink:0}}>{item.name}</span>
                <div className="vbar-wrap"><div className="vbar-bg"><div className="vbar-fill" style={{width:`${Math.round((item.votes.length/max)*100)}%`}}/></div></div>
                <span className="vote-count">{item.votes.length} 👍</span>
                <button className={`vote-btn ${v?"on":""}`}>{v?"✓":"Vote"}</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const votable=[...trip.calendarItems].sort((a,b)=>
    ((b.metadata?.upvotes||[]).length-(b.metadata?.downvotes||[]).length)-
    ((a.metadata?.upvotes||[]).length-(a.metadata?.downvotes||[]).length)
  );

  return (
    <div>
      {renderSection("Destination",trip.destinations,"destinations","📍")}
      <div className="vote-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h4>🗳️ Activities & Items ({votable.length})</h4>
        </div>
        {votable.length===0
          ?<div style={{textAlign:"center",padding:"20px 0",color:"var(--muted)",fontSize:14}}>No items yet — add some in the <strong>🎯 Items</strong> tab.</div>
          :votable.map(ci=>{
            const tm=TYPE_META[ci.type]||TYPE_META.activity;
            const up=(ci.metadata?.upvotes||[]).length,down=(ci.metadata?.downvotes||[]).length;
            const hasUp=(ci.metadata?.upvotes||[]).includes(user),hasDown=(ci.metadata?.downvotes||[]).includes(user);
            const net=up-down;
            return (
              <div key={ci.id} className="act-vote-card">
                <div className="act-vote-top">
                  <span className="act-vote-emoji">{tm.icon}</span>
                  <div className="act-vote-info">
                    <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
                      <div className="act-vote-name">{ci.title}</div>
                      <span className={`type-badge type-${ci.type}`}>{tm.icon} {tm.label}</span>
                    </div>
                    {ci.location&&<div style={{fontSize:12,color:"var(--muted)",marginBottom:4}}>📍 {ci.location}</div>}
                    {ci.metadata?.description&&<div className="act-vote-desc">{ci.metadata.description}</div>}
                    <div className="act-vote-pills">
                      {ci.durationMin&&<span className="pill pill-b">⏱ {ci.durationMin}min</span>}
                      {ci.price>0&&<span className="pill pill-g">💵 ${ci.price}</span>}
                    </div>
                  </div>
                </div>
                <div className="act-vote-row">
                  <button className={`vbtn-up ${hasUp?"on":""}`} onClick={()=>voteCI(ci.id,"up")}>👍 Yes{up>0?` (${up})`:""}</button>
                  <button className={`vbtn-down ${hasDown?"on":""}`} onClick={()=>voteCI(ci.id,"down")}>👎 No{down>0?` (${down})`:""}</button>
                  <div className="vote-tally">
                    <span style={{color:net>0?"var(--green)":net<0?"var(--red)":"var(--muted)",fontWeight:600}}>{net>0?`+${net}`:net} net</span>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// ─── BUDGET TAB ───────────────────────────────────────────────────────────────
function BudgetTab({trip,setTrip}) {
  const [limitInput,setLimitInput] = useState(String(trip.budgetLimit||""));
  const [editingLimit,setEditingLimit] = useState(false);
  const memberCount=trip.members.length||1;
  const items=trip.calendarItems||[];
  const sum=type=>items.filter(c=>c.type===type).reduce((s,c)=>s+(c.price||0),0);
  const actTotal=sum("activity"),mealTotal=sum("meal"),transportTotal=sum("transport"),hotelTotal=sum("hotel");
  const grandTotal=actTotal+mealTotal+transportTotal+hotelTotal;
  const perPerson=memberCount>0?grandTotal/memberCount:0;
  const budgetLimit=trip.budgetLimit?+trip.budgetLimit:null;
  const cats=[
    {icon:"🎯",label:"Activities",total:actTotal,color:"#38bdf8"},
    {icon:"🚌",label:"Transport",total:transportTotal,color:"#34d399"},
    {icon:"🍽️",label:"Meals",total:mealTotal,color:"#fbbf24"},
    {icon:"🏨",label:"Hotels/Stays",total:hotelTotal,color:"#818cf8"},
  ];
  const maxCat=Math.max(...cats.map(c=>c.total),1);
  const saveLimit=()=>{setTrip(t=>({...t,budgetLimit:limitInput?+limitInput:null}));setEditingLimit(false);};

  return (
    <div className="budget-dash">
      <div className="budget-card">
        <h4>💰 Trip Cost Breakdown</h4>
        {cats.map(cat=>(
          <div key={cat.label} className="cat-row">
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
            <div className="cat-bar-wrap"><div className="cat-bar-bg"><div className="cat-bar-fill" style={{width:`${Math.round((cat.total/maxCat)*100)}%`,background:cat.color}}/></div></div>
            <span className="cat-amount" style={{color:cat.color}}>${cat.total.toLocaleString()}</span>
          </div>
        ))}
        <div className="budget-total-row">
          <span className="budget-total-label">Total</span>
          <span className="budget-total-val">${grandTotal.toLocaleString()}</span>
        </div>
        <div className="per-person-row">
          <span style={{fontSize:13,color:"var(--muted)"}}>👥 {memberCount} member{memberCount!==1?"s":""} · per person</span>
          <span style={{fontFamily:"Syne",fontSize:18,fontWeight:800,color:"var(--accent2)"}}>${Math.ceil(perPerson).toLocaleString()}</span>
        </div>
      </div>
      <div className="budget-card">
        <h4>🎯 Budget Limit</h4>
        {!editingLimit&&!budgetLimit&&(
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <p className="text-muted" style={{flex:1}}>Set a target spend limit.</p>
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditingLimit(true)}>+ Set Limit</button>
          </div>
        )}
        {(editingLimit||budgetLimit)&&(
          <div>
            {editingLimit?(
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:16,color:"var(--muted)"}}>$</span>
                <input className="form-input" style={{maxWidth:140}} type="number" min={0} value={limitInput} onChange={e=>setLimitInput(e.target.value)} autoFocus/>
                <button className="btn btn-primary btn-sm" onClick={saveLimit}>Save</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>setEditingLimit(false)}>Cancel</button>
              </div>
            ):(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:14,color:"var(--muted)"}}>Limit: <strong style={{color:"var(--text)"}}>${(+budgetLimit).toLocaleString()}</strong></span>
                <button className="btn btn-ghost btn-sm" onClick={()=>{setLimitInput(String(budgetLimit));setEditingLimit(true);}}>✏️ Edit</button>
              </div>
            )}
            {budgetLimit&&!editingLimit&&(()=>{
              const pct=Math.min((grandTotal/+budgetLimit)*100,100);
              const over=grandTotal>+budgetLimit;
              const diff=Math.abs(grandTotal-+budgetLimit);
              return (
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}>
                    <span>Current: ${grandTotal.toLocaleString()}</span>
                    <span>Limit: ${(+budgetLimit).toLocaleString()}</span>
                  </div>
                  <div className="budget-status-bar">
                    <div className="budget-status-fill" style={{width:`${pct}%`,background:over?"var(--red)":pct>80?"var(--yellow)":"var(--green)"}}/>
                  </div>
                  {over?<div className="budget-over">⚠️ Exceeded by ${diff.toLocaleString()}</div>
                      :<div className="budget-under">✓ ${diff.toLocaleString()} remaining</div>}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ACCOMMODATION TAB ────────────────────────────────────────────────────────
const BLANK_A={name:"",address:"",pricePerNight:"",rating:"",checkIn:"",checkOut:"",notes:""};
function AccommodationTab({trip,setTrip}) {
  const [show,setShow] = useState(false);
  const [editId,setEditId] = useState(null);
  const [form,setForm] = useState(BLANK_A);
  const [errs,setErrs] = useState({});

  const validate=()=>{
    const e={};
    if(!form.name.trim()) e.name="Name required";
    if(form.pricePerNight&&isNaN(Number(form.pricePerNight))) e.pricePerNight="Numeric";
    if(form.rating&&(isNaN(Number(form.rating))||+form.rating<1||+form.rating>5)) e.rating="1–5";
    setErrs(e); return !Object.keys(e).length;
  };

  const openAdd=()=>{setForm(BLANK_A);setEditId(null);setErrs({});setShow(true);};
  const openEdit=a=>{setForm({name:a.name,address:a.address||"",pricePerNight:String(a.pricePerNight||""),rating:String(a.rating||""),checkIn:a.checkIn||"",checkOut:a.checkOut||"",notes:a.notes||""});setEditId(a.id);setErrs({});setShow(true);};

  const save=()=>{
    if(!validate()) return;
    if(editId){
      setTrip(t=>({...t,accommodationOptions:t.accommodationOptions.map(a=>a.id===editId?{...a,...form,pricePerNight:form.pricePerNight?+form.pricePerNight:"",rating:form.rating?+form.rating:""}:a)}));
    } else {
      setTrip(t=>({...t,accommodationOptions:[...t.accommodationOptions,{id:uid(),tripId:t.id,...form,pricePerNight:form.pricePerNight?+form.pricePerNight:"",rating:form.rating?+form.rating:""}]}));
    }
    setShow(false);
  };

  const del=id=>setTrip(t=>({...t,accommodationOptions:t.accommodationOptions.filter(a=>a.id!==id)}));
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
            <div className="form-group"><label className="form-label">Price/Night ($)</label><input {...F("pricePerNight")} placeholder="180"/>{errs.pricePerNight&&<div className="err-msg">{errs.pricePerNight}</div>}</div>
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
                {a.pricePerNight!==""&&<div className="card-meta-row">💰 <strong>${a.pricePerNight}/night</strong></div>}
                {a.rating!==""&&<div className="card-meta-row"><span className="stars">{renderStars(a.rating)}</span></div>}
                {(a.checkIn||a.checkOut)&&<div className="card-meta-row">🗓️ <strong>{a.checkIn?fmtDate(a.checkIn):"?"}</strong> → <strong>{a.checkOut?fmtDate(a.checkOut):"?"}</strong></div>}
              </div>
              {a.notes&&<div className="card-notes">{a.notes}</div>}
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// ─── TRIP INFO TAB ────────────────────────────────────────────────────────────
function TripInfoTab({trip,setTrip}) {
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState({name:trip.name,destination:trip.destinations[0]?.name||"",startDate:trip.startDate||"",endDate:trip.endDate||"",description:trip.description||""});
  const [errs,setErrs] = useState({});
  useMemo(()=>setForm({name:trip.name,destination:trip.destinations[0]?.name||"",startDate:trip.startDate||"",endDate:trip.endDate||"",description:trip.description||""}),[trip.id]);

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
    setTrip(t=>({...t,name:form.name.trim(),startDate:form.startDate,endDate:form.endDate,description:form.description,
      destinations:t.destinations.map((d,i)=>i===0?{...d,name:form.destination.trim()}:d)}));
    setEditing(false);
  };
  const cancel=()=>{setForm({name:trip.name,destination:trip.destinations[0]?.name||"",startDate:trip.startDate||"",endDate:trip.endDate||"",description:trip.description||""});setErrs({});setEditing(false);};

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
            <div className="info-view-cell"><div className="info-view-label">Status</div><div className="info-view-val"><span className={`badge ${trip.status==="confirmed"?"badge-green":"badge-yellow"}`}>{trip.status==="confirmed"?"✓ Confirmed":"⏳ Planning"}</span></div></div>
            <div className="info-view-cell full"><div className="info-view-label">Members</div><div className="members-row" style={{marginTop:8}}>{trip.members.map(m=><span key={m} className="member-chip">{m}</span>)}</div></div>
          </div>
        ):(
          <div className="info-edit-body">
            <div className="form-group"><label className="form-label">Trip Name *</label><input className={`form-input${errs.name?" err":""}`} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Spring Break 2026"/>{errs.name&&<div className="err-msg">{errs.name}</div>}</div>
            <div className="form-group"><label className="form-label">Destination *</label><input className={`form-input${errs.destination?" err":""}`} value={form.destination} onChange={e=>setForm(f=>({...f,destination:e.target.value}))} placeholder="e.g. Cancun, Mexico"/>{errs.destination&&<div className="err-msg">{errs.destination}</div>}</div>
            <div className="form-group"><label className="form-label">Trip Dates *</label>{errs.dates&&<div className="err-msg" style={{marginBottom:8}}>{errs.dates}</div>}<DatePicker startDate={form.startDate||null} endDate={form.endDate||null} onChange={(s,e)=>setForm(f=>({...f,startDate:s||"",endDate:e||""}))}/></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input form-textarea" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Any notes…"/></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COUNTRY TAB ─────────────────────────────────────────────────────────────
function CountryTab({trip,setTrip}) {
  const c=trip.country||{};
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState({visa:c.visa||"",passport:c.passport||"",advisory:c.advisory||"",currency:c.currency||"",language:c.language||"",notes:c.notes||""});
  useMemo(()=>{const cc=trip.country||{};setForm({visa:cc.visa||"",passport:cc.passport||"",advisory:cc.advisory||"",currency:cc.currency||"",language:cc.language||"",notes:cc.notes||""});},[trip.id]);
  const save=()=>{setTrip(t=>({...t,country:{...(t.country||{}),...form}}));setEditing(false);};
  const FIELDS=[{key:"visa",icon:"🛂",label:"Visa Requirements"},{key:"passport",icon:"📘",label:"Passport Validity"},{key:"advisory",icon:"⚠️",label:"Travel Advisory"},{key:"currency",icon:"💱",label:"Currency"},{key:"language",icon:"🗣️",label:"Language"}];
  if(!editing) return (
    <div className="country-card">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h4 style={{fontFamily:"Syne",fontSize:18,fontWeight:700,margin:0}}>🌍 Entry Requirements</h4>
        <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(true)}>✏️ Edit</button>
      </div>
      {FIELDS.map(f=>(
        <div key={f.key} className="info-row"><span className="info-icon">{f.icon}</span><div><div className="info-lbl">{f.label}</div><div className="info-txt">{form[f.key]||<span style={{color:"var(--muted)",fontStyle:"italic"}}>Not set</span>}</div></div></div>
      ))}
    </div>
  );
  return (
    <div className="country-card">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h4 style={{fontFamily:"Syne",fontSize:18,fontWeight:700,margin:0}}>✏️ Edit Entry Info</h4>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Save</button>
        </div>
      </div>
      {FIELDS.map(f=>(
        <div key={f.key} className="form-group"><label className="form-label">{f.icon} {f.label}</label><input className="form-input" value={form[f.key]} onChange={e=>setForm(ff=>({...ff,[f.key]:e.target.value}))} placeholder={`Enter ${f.label.toLowerCase()}…`}/></div>
      ))}
      <div className="form-group"><label className="form-label">📝 Notes</label><textarea className="form-input form-textarea" value={form.notes} onChange={e=>setForm(ff=>({...ff,notes:e.target.value}))} placeholder="Additional details…"/></div>
    </div>
  );
}

// ─── MEMBERS TAB ─────────────────────────────────────────────────────────────
function MembersTab({trip,setTrip,user}) {
  const [emailInput,setEmailInput] = useState("");
  const [emailErr,setEmailErr] = useState("");
  const [invitations,setInvitations] = useState([]);
  const [copied,setCopied] = useState(false);
  const [link] = useState(()=>`tripsync.app/join/${Math.random().toString(36).slice(2,8)}`);
  const members=trip.tripMembers||trip.members.map((name,i)=>({userId:name,name,role:i===0?"owner":"editor",joinedAt:trip.startDate||"2026-01-01"}));
  const sendInvite=()=>{
    if(!emailInput.trim()){setEmailErr("Enter email");return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())){setEmailErr("Invalid email");return;}
    setEmailErr("");setInvitations(prev=>[...prev,{id:uid(),email:emailInput.trim()}]);setEmailInput("");
  };
  return (
    <div>
      <div className="section-hdr" style={{marginBottom:14}}>
        <h4>👥 Trip Members</h4>
        <span className="badge">{members.length}</span>
      </div>
      <div className="members-tab">
        {members.map(m=>(
          <div key={m.userId} className="member-row">
            <div className={`member-avatar ${m.role==="owner"?"owner":m.role==="viewer"?"viewer":""}`}>{(m.name||m.userId||"?")[0].toUpperCase()}</div>
            <div className="member-info">
              <div className="member-name">{m.name||m.userId}{(m.name||m.userId)===user&&<span style={{fontSize:11,color:"var(--muted)",fontWeight:400}}> (you)</span>}</div>
              <div className="member-meta">Joined {m.joinedAt?fmtDate(m.joinedAt):"recently"}</div>
            </div>
            <span className={`role-badge role-${m.role}`}>{m.role==="owner"?"👑 Owner":m.role==="editor"?"✏️ Editor":"👁 Viewer"}</span>
          </div>
        ))}
      </div>
      <div className="invite-panel">
        <h5>✉️ Invite Friends</h5>
        <div style={{display:"flex",gap:8,marginBottom:4}}>
          <input className={`form-input${emailErr?" err":""}`} style={{flex:1}} placeholder="friend@email.com" value={emailInput} onChange={e=>{setEmailInput(e.target.value);setEmailErr("");}} onKeyDown={e=>e.key==="Enter"&&sendInvite()}/>
          <button className="btn btn-accent2 btn-sm" onClick={sendInvite}>Send</button>
        </div>
        {emailErr&&<div className="err-msg">{emailErr}</div>}
        {invitations.map(inv=>(
          <div key={inv.id} className="pending-invite">
            <span><span className="pending-dot"/>{inv.email}</span>
            <button className="btn btn-danger btn-sm" style={{padding:"3px 9px",fontSize:11}} onClick={()=>setInvitations(p=>p.filter(i=>i.id!==inv.id))}>✕</button>
          </div>
        ))}
        <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid var(--border)"}}>
          <div className="invite-box">
            <span className="invite-link">🔗 {link}</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}}>{copied?"✓ Copied!":"Copy"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUMMARY TAB ─────────────────────────────────────────────────────────────
function SummaryTab({trip}) {
  const topDest=[...trip.destinations].sort((a,b)=>b.votes.length-a.votes.length)[0];
  const nights=nightsBetween(trip.startDate,trip.endDate);
  const items=trip.calendarItems||[];
  const grandTotal=items.reduce((s,c)=>s+(c.price||0),0);
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
      {trip.accommodationOptions?.length>0&&<div className="mt-6"><label style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1}}>🏨 Accommodations</label><div className="tag-wrap">{trip.accommodationOptions.map(a=><span key={a.id} className="tag tag-b">{a.name}{a.pricePerNight?` · $${a.pricePerNight}/night`:""}</span>)}</div></div>}
      {items.length>0&&<div className="mt-6"><label style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1}}>🎯 All Items</label><div className="tag-wrap">{items.map(c=><span key={c.id} className="tag">{TYPE_META[c.type]?.icon} {c.title}{c.price>0?` · $${c.price}`:""}</span>)}</div></div>}
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
  const submit=()=>{
    const e={};
    if(!form.name.trim()) e.name="Required";
    if(!startDate) e.dates="Select start date";
    else if(!endDate) e.dates="Select end date";
    setErrs(e); if(Object.keys(e).length) return;
    const dests=form.destinations.split(",").map(d=>d.trim()).filter(Boolean).map((d,i)=>({id:i+1,name:d,votes:[]}));
    onCreate({
      id:uid(),name:form.name.trim(),status:"planning",
      startDate,endDate,budgetLimit:null,
      members:[user],
      tripMembers:[{userId:user,name:user,role:"owner",joinedAt:toYMD(new Date())}],
      destinations:dests.length?dests:[{id:1,name:"TBD",votes:[]}],
      budgets:{"$300–500":0,"$500–800":0,"$800+":0},
      accommodations:[],accommodationOptions:[],calendarItems:[],
      availability:{},country:null,googleMapsUrl:""
    });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
        <h3>✦ Create New Trip</h3>
        <div className="form-group"><label className="form-label">Trip Name *</label><input className={`form-input${errs.name?" err":""}`} placeholder="e.g. Spring Break 2026" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>{errs.name&&<div className="err-msg">{errs.name}</div>}</div>
        <div className="form-group"><label className="form-label">Destinations (comma separated)</label><input className="form-input" placeholder="e.g. Miami, Cancun" value={form.destinations} onChange={e=>setForm(f=>({...f,destinations:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Trip Dates *</label>{errs.dates&&<div className="err-msg" style={{marginBottom:8}}>{errs.dates}</div>}<DatePicker startDate={startDate} endDate={endDate} onChange={(s,e)=>{setStart(s);setEnd(e);}}/></div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Create Trip →</button>
        </div>
      </div>
    </div>
  );
}

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL_TRIPS = [
  {
    id:1, name:"Spring Break 2026", status:"planning",
    startDate:"2026-03-14", endDate:"2026-03-18",
    budgetLimit:4000, googleMapsUrl:"",
    members:["Alex","Jamie","Sam","Taylor","Morgan","Riley","Drew","Casey"],
    tripMembers:[
      {userId:"Alex",name:"Alex",role:"owner",joinedAt:"2026-01-10"},
      {userId:"Jamie",name:"Jamie",role:"editor",joinedAt:"2026-01-11"},
      {userId:"Sam",name:"Sam",role:"editor",joinedAt:"2026-01-12"},
      {userId:"Taylor",name:"Taylor",role:"editor",joinedAt:"2026-01-12"},
      {userId:"Morgan",name:"Morgan",role:"editor",joinedAt:"2026-01-14"},
      {userId:"Riley",name:"Riley",role:"editor",joinedAt:"2026-01-15"},
      {userId:"Drew",name:"Drew",role:"viewer",joinedAt:"2026-01-16"},
      {userId:"Casey",name:"Casey",role:"viewer",joinedAt:"2026-01-18"},
    ],
    destinations:[
      {id:1,name:"Cancun 🇲🇽",votes:["Alex","Jamie","Sam","Taylor","Morgan"]},
      {id:2,name:"Miami 🌴",votes:["Riley","Drew","Casey"]},
      {id:3,name:"Puerto Rico 🏝️",votes:["Alex","Sam"]},
    ],
    budgets:{"$300–500":3,"$500–800":5,"$800+":2},
    accommodations:[],
    accommodationOptions:[
      {id:10,name:"Beachside Airbnb",address:"Zona Hotelera, Cancun",pricePerNight:180,rating:4.8,checkIn:"2026-03-14",checkOut:"2026-03-18",notes:"Private pool, sleeps 8"},
      {id:11,name:"Marriott Resort",address:"Blvd Kukulcan Km 14.5",pricePerNight:240,rating:4.5,checkIn:"2026-03-14",checkOut:"2026-03-18",notes:"All-inclusive option"},
    ],
    calendarItems:[
      {id:20,type:"activity",title:"Snorkeling at Reef",day:"2026-03-15",startTime:"09:00",startMin:540,durationMin:180,location:"Mesoamerican Barrier Reef, Cancun",price:55,metadata:{description:"Guided snorkeling tour.",notes:"Reservation recommended.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan"],downvotes:[],createdBy:"Alex"}},
      {id:21,type:"activity",title:"Catamaran Boat Tour",day:"2026-03-16",startTime:"08:00",startMin:480,durationMin:480,location:"Marina Cancun",price:85,metadata:{description:"Full-day sailing with open bar.",notes:"Book 48hrs ahead.",upvotes:["Alex","Sam","Riley"],downvotes:["Casey"],createdBy:"Jamie"}},
      {id:22,type:"activity",title:"Chichen Itza Day Trip",day:null,startTime:"07:00",startMin:420,durationMin:600,location:"Chichen Itza, Yucatan",price:70,metadata:{description:"UNESCO World Heritage Site.",notes:"Very hot — bring water.",upvotes:["Jamie","Taylor"],downvotes:["Morgan","Drew"],createdBy:"Taylor"}},
      {id:23,type:"activity",title:"Beach Club Day",day:"2026-03-17",startTime:"11:00",startMin:660,durationMin:360,location:"Zona Hotelera, Cancun",price:40,metadata:{description:"Premium beachfront club with pools.",notes:"Free entry before 11am.",upvotes:["Alex","Jamie","Sam","Taylor","Morgan","Riley","Drew"],downvotes:[],createdBy:"Morgan"}},
      {id:50,type:"meal",title:"Welcome Dinner — La Habichuela",day:"2026-03-14",startTime:"19:00",startMin:1140,durationMin:90,location:"Downtown Cancun",price:35,metadata:{notes:"Reservation needed.",upvotes:[],downvotes:[],createdBy:"Alex"}},
      {id:51,type:"hotel",title:"Check-In — Beachside Airbnb",day:"2026-03-14",startTime:"15:00",startMin:900,durationMin:30,location:"Zona Hotelera, Cancun",price:0,metadata:{checkIn:"2026-03-14",checkOut:"2026-03-18",notes:"4 nights",upvotes:[],downvotes:[],createdBy:"Alex"}},
      {id:52,type:"transport",title:"Airport Transfer — Uber XL",day:"2026-03-18",startTime:"10:00",startMin:600,durationMin:45,location:"Cancun Airport",price:25,metadata:{notes:"Book in advance.",upvotes:[],downvotes:[],createdBy:"Alex",transportationTime:45}},
    ],
    availability:{},
    country:{name:"Mexico",visa:"No visa required for US citizens (under 180 days)",passport:"Valid for duration of stay",advisory:"Normal precautions in tourist zones",currency:"Mexican Peso — ~17 MXN per USD",language:"Spanish"},
  },
  {
    id:2, name:"Study Abroad Weekend – Barcelona", status:"confirmed",
    startDate:"2026-10-18", endDate:"2026-10-20",
    budgetLimit:1200, googleMapsUrl:"",
    members:["Alex","Jamie","Sam","Taylor"],
    tripMembers:[
      {userId:"Alex",name:"Alex",role:"owner",joinedAt:"2026-06-01"},
      {userId:"Jamie",name:"Jamie",role:"editor",joinedAt:"2026-06-02"},
      {userId:"Sam",name:"Sam",role:"editor",joinedAt:"2026-06-03"},
      {userId:"Taylor",name:"Taylor",role:"viewer",joinedAt:"2026-06-04"},
    ],
    destinations:[{id:1,name:"Barcelona 🇪🇸",votes:["Alex","Jamie","Sam","Taylor"]}],
    budgets:{"$300–500":1,"$500–800":2,"$800+":1},
    accommodations:[],
    accommodationOptions:[
      {id:30,name:"Eixample Apartment",address:"Carrer de Provença 200, Barcelona",pricePerNight:210,rating:4.9,checkIn:"2026-10-18",checkOut:"2026-10-20",notes:"Rooftop terrace, near Sagrada Família"},
    ],
    calendarItems:[
      {id:40,type:"activity",title:"Sagrada Família",day:"2026-10-18",startTime:"10:00",startMin:600,durationMin:120,location:"Carrer de Mallorca 401, Barcelona",price:26,metadata:{description:"Gaudí's iconic basilica.",notes:"Tower access extra.",upvotes:["Alex","Jamie","Sam","Taylor"],downvotes:[],createdBy:"Alex"}},
      {id:41,type:"activity",title:"Gothic Quarter Walk",day:"2026-10-18",startTime:"13:00",startMin:780,durationMin:180,location:"Barri Gòtic, Barcelona",price:0,metadata:{description:"2000 years of history on foot.",notes:"Free self-guided.",upvotes:["Alex","Taylor"],downvotes:[],createdBy:"Jamie"}},
      {id:42,type:"activity",title:"La Barceloneta Beach",day:"2026-10-19",startTime:"12:00",startMin:720,durationMin:240,location:"Barceloneta, Barcelona",price:15,metadata:{description:"City beach with chiringuitos.",upvotes:["Sam","Jamie"],downvotes:[],createdBy:"Sam"}},
      {id:43,type:"activity",title:"Park Güell",day:"2026-10-20",startTime:"10:30",startMin:630,durationMin:120,location:"Carrer d'Olot, Barcelona",price:13,metadata:{description:"Gaudí's mosaic terrace park.",notes:"Tickets required for main terrace.",upvotes:["Alex","Sam"],downvotes:["Jamie"],createdBy:"Taylor"}},
      {id:60,type:"meal",title:"Tapas Dinner — El Xampanyet",day:"2026-10-18",startTime:"20:00",startMin:1200,durationMin:90,location:"Carrer del Montcada 22, Barcelona",price:28,metadata:{notes:"Legendary cava bar in El Born.",upvotes:[],downvotes:[],createdBy:"Jamie"}},
      {id:61,type:"transport",title:"Aerobus to Airport",day:"2026-10-20",startTime:"08:30",startMin:510,durationMin:35,location:"Plaça Catalunya",price:6,metadata:{notes:"Direct to T1/T2.",upvotes:[],downvotes:[],createdBy:"Alex"}},
    ],
    availability:{},
    country:{name:"Spain",visa:"No visa required (Schengen, under 90 days)",passport:"Valid 3 months after departure",advisory:"Normal precautions",currency:"Euro — ~0.92 EUR per USD",language:"Spanish / Catalan"},
  }
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]         = useState("landing");
  const [trips,setTrips]       = useState(INITIAL_TRIPS);
  const [active,setActive]     = useState(null);
  const [tab,setTab]           = useState("schedule");
  const [showNew,setShowNew]   = useState(false);
  const [loggedIn,setLoggedIn] = useState(false);
  const [user,setUser]         = useState("Alex");
  const [showLogin,setShowLogin] = useState(false);
  const [loginForm,setLoginForm] = useState({name:"",email:"",password:""});

  const updateTrip = t => { setTrips(ts=>ts.map(x=>x.id===t.id?t:x)); setActive(t); };
  const openTrip   = t => { setActive(t); setTab("schedule"); setPage("trip"); };
  const createTrip = t => { setTrips(ts=>[...ts,t]); setShowNew(false); setActive(t); setTab("schedule"); setPage("trip"); };

  const TABS = [
    {id:"info",l:"ℹ️ Trip Info"},{id:"schedule",l:"📅 Schedule"},{id:"map",l:"🗺️ Map"},
    {id:"voting",l:"🗳️ Vote"},{id:"budget",l:"💰 Budget"},{id:"accommodations",l:"🏨 Stays"},
    {id:"activities",l:"🎯 Items"},{id:"members",l:"👥 Members"},{id:"country",l:"🌍 Entry"},
    {id:"summary",l:"✅ Summary"},
  ];

  return (
    <>
      <style>{FONT+CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" onClick={()=>setPage(loggedIn?"dashboard":"landing")}>Trip<span>Sync</span></div>
          {loggedIn && (
            <div className="nav-tabs">
              <button className={`nav-tab ${page==="dashboard"?"active":""}`} onClick={()=>setPage("dashboard")}>My Trips</button>
              <button className="nav-tab" onClick={()=>setShowNew(true)}>+ New Trip</button>
            </div>
          )}
          <div className="nav-user">
            {loggedIn
              ?<><div className="avatar">{user[0]}</div><span style={{fontSize:14,fontWeight:500}}>{user}</span></>
              :<button className="btn btn-primary btn-sm" onClick={()=>setShowLogin(true)}>Sign In</button>
            }
          </div>
        </nav>

        {page==="landing" && (
          <div className="landing">
            <h1>Plan trips together,<br/>without the chaos.</h1>
            <p>TripSync helps groups align on dates, destinations, budgets, and activities — turning group planning into something that actually works.</p>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={()=>{setLoggedIn(true);setPage("dashboard");}}>✦ Get Started Free</button>
              <button className="btn btn-ghost" onClick={()=>{setLoggedIn(true);setPage("dashboard");}}>View Demo</button>
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

        {page==="dashboard" && (
          <div className="dashboard">
            <div style={{marginBottom:32}} className="flex-between">
              <div><h2 style={{fontFamily:"Syne",fontSize:28,fontWeight:800,marginBottom:6}}>My Trips 🗺️</h2><p style={{color:"var(--muted)",fontSize:15}}>Welcome back, {user}.</p></div>
              <button className="btn btn-primary" onClick={()=>setShowNew(true)}>+ New Trip</button>
            </div>
            <div className="trip-grid">
              {trips.map(trip=>(
                <div key={trip.id} className="trip-card" onClick={()=>openTrip(trip)}>
                  <div className="trip-card-header">
                    <div className="trip-name">{trip.name}</div>
                    <span className={`badge ${trip.status==="confirmed"?"badge-green":"badge-yellow"}`}>{trip.status==="confirmed"?"Confirmed ✓":"Planning ⏳"}</span>
                  </div>
                  <div className="trip-meta">
                    <div className="trip-meta-item">📍 <strong>{trip.destinations[0]?.name}</strong></div>
                    <div className="trip-meta-item">📅 <strong>{fmtRange(trip.startDate,trip.endDate)}</strong></div>
                    <div className="trip-meta-item">🎯 <strong>{(trip.calendarItems||[]).length} item{(trip.calendarItems||[]).length!==1?"s":""}</strong></div>
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
          </div>
        )}

        {page==="trip" && active && (
          <div className="trip-detail">
            <div className="trip-detail-header">
              <button className="back-btn" onClick={()=>setPage("dashboard")}>← Back</button>
              <h2>{active.name}</h2>
              <span className={`badge ${active.status==="confirmed"?"badge-green":"badge-yellow"}`}>{active.status==="confirmed"?"Confirmed":"Planning"}</span>
              {active.startDate&&<span className="badge" style={{fontSize:12}}>📅 {fmtRange(active.startDate,active.endDate)}</span>}
              <button className="btn btn-ghost btn-sm" style={{marginLeft:"auto"}} onClick={()=>setTab("info")}>✏️ Edit Trip</button>
            </div>
            <div className="section-tabs">
              {TABS.map(t=><button key={t.id} className={`section-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.l}</button>)}
            </div>
            <div className="section-content">
              {tab==="info"           && <TripInfoTab trip={active} setTrip={updateTrip}/>}
              {tab==="schedule"       && <ScheduleTab trip={active} setTrip={updateTrip}/>}
              {tab==="map"            && <MapTab trip={active} setTrip={updateTrip}/>}
              {tab==="voting"         && <VotingTab trip={active} setTrip={updateTrip} user={user}/>}
              {tab==="budget"         && <BudgetTab trip={active} setTrip={updateTrip}/>}
              {tab==="accommodations" && <AccommodationTab trip={active} setTrip={updateTrip}/>}
              {tab==="activities"     && <ActivityTab trip={active} setTrip={updateTrip} user={user}/>}
              {tab==="members"        && <MembersTab trip={active} setTrip={updateTrip} user={user}/>}
              {tab==="country"        && <CountryTab trip={active} setTrip={updateTrip}/>}
              {tab==="summary"        && <SummaryTab trip={active}/>}
            </div>
          </div>
        )}

        {showNew && <NewTripModal onClose={()=>setShowNew(false)} onCreate={createTrip} user={user}/>}

        {showLogin && (
          <div className="modal-overlay" onClick={()=>setShowLogin(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h3>Sign in to TripSync</h3>
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Your name" value={loginForm.name} onChange={e=>setLoginForm(f=>({...f,name:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@email.com" value={loginForm.email} onChange={e=>setLoginForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={loginForm.password} onChange={e=>setLoginForm(f=>({...f,password:e.target.value}))}/></div>
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={()=>setShowLogin(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={()=>{if(loginForm.name)setUser(loginForm.name);setLoggedIn(true);setShowLogin(false);setPage("dashboard");}}>Sign In</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
