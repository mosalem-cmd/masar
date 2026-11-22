'use strict';
/* مسار: تطبيق شخصي للتنظيم والتعلّم والعادات. كل البيانات على الجهاز ومشفّرة. */

// ================= أدوات عامة =================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const now = () => new Date(window.__NOW ?? Date.now());
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); };
const daysBetween = (a, b) => Math.round((parseYmd(b) - parseYmd(a)) / 864e5);
const toMin = s => { const [h, m] = String(s || '0:0').split(':').map(Number); return h * 60 + (m || 0); };
const fromMin = m => { m = ((Math.round(m) % 1440) + 1440) % 1440; return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
const durMin = (a, b) => { let d = toMin(b) - toMin(a); if (d <= 0) d += 1440; return d; };
const fmtDur = m => m >= 60 ? `${Math.floor(m / 60)}${m % 60 ? ':' + pad(m % 60) : ''} س` : `${m} د`;
const DOW = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DOW_S = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const WEEK = [6, 0, 1, 2, 3, 4, 5];
const normDigits = s => String(s ?? '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const num = v => { const n = parseFloat(normDigits(v).replace(/,/g, '')); return isFinite(n) ? n : 0; };
const fmtN = n => (Math.round(n * 100) / 100).toLocaleString('en-US');
const pick = a => a[Math.floor(Math.random() * a.length)];
const sum = a => a.reduce((x, y) => x + (+y.amt || 0), 0);
const fmtSize = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' م.ب' : Math.max(1, Math.round(b / 1024)) + ' ك.ب';
const fmtGreg = d => new Intl.DateTimeFormat('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
const fmtHijri = d => { try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); } catch { return ''; } };
const fmtShort = s => { const d = parseYmd(s); return `${d.getDate()}/${d.getMonth() + 1}`; };
const nowMin = () => { const d = now(); return d.getHours() * 60 + d.getMinutes(); };
const inRange = (m, a, b) => { const x = toMin(a), y = toMin(b); return x < y ? m >= x && m < y : m >= x || m < y; };
const COLORS = ['indigo', 'cyan', 'amber', 'violet', 'teal', 'rose', 'slate'];
const W_LBL = { 1: 'صغير', 2: 'متوسط', 3: 'كبير' };
const PRIO_LBL = { high: 'عالية', mid: 'متوسطة', low: 'منخفضة' };
const PRIO_ORD = { high: 0, mid: 1, low: 2 };
const CATS = { prayer: 'صلاة', quran: 'قرآن', study: 'دراسة', sport: 'رياضة', sleep: 'نوم', project: 'مشروع', other: 'أخرى' };

let S = null, DEK = null, ACC = null, DB = null;
const R = { tab: 'today', stack: [], day: null, sub: {}, planWd: null, urge: null, rest: null, ls: {}, lastRender: 0 };
const logicalToday = () => { const d = now(); d.setHours(d.getHours() - (S?.settings.dayStart ?? 3)); return ymd(d); };

// ================= أيقونات =================
const ICONS = {
  today: '<rect x="3.5" y="5" width="17" height="15.5" rx="4.5"/><path d="M8 3v4M16 3v4M3.5 10h17M9 15l2 2 4-4"/>',
  lessons: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14.5H6.5A2.5 2.5 0 0 0 4 20z"/><path d="M4 20a2.5 2.5 0 0 0 2.5 1.5H20M9 7.5h7M9 11h5"/>',
  projects: '<path d="M12 3 3 7.5l9 4.5 9-4.5z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
  plan: '<path d="M4 6h9M4 12h16M4 18h11"/><circle cx="17.5" cy="6" r="2.5"/><circle cx="18.5" cy="18" r="2"/>',
  more: '<rect x="4" y="4" width="6.5" height="6.5" rx="2.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2.2"/><circle cx="16.75" cy="16.75" r="3.25"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  back: '<path d="m9 5 7 7-7 7"/>', chev: '<path d="m15 5-7 7 7 7"/>', next: '<path d="m15 5-7 7 7 7"/>', prev: '<path d="m9 5 7 7-7 7"/>',
  flame: '<path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3.5 2.6-5.3 3.8-8.3.4 2 1.6 3 2.7 3.6.3-2.8 1.6-5.2 3.6-7.1-.2 3.5 3.9 5.7 3.9 11.6 0 3.6-3.3 6.4-7.5 6.4z"/>',
  wave: '<path d="M2.5 12c2.5 0 2.5-4 5-4s2.5 8 5 8 2.5-8 5-8 2.5 4 4 4"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>', file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  play: '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10.5 9.5 4 2.5-4 2.5z"/>', trash: '<path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l1 12.5a2 2 0 0 0 2 1.5h5a2 2 0 0 0 2-1.5l1-12.5M9.5 7V4.5h5V7"/>',
  edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>', lock: '<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>',
  download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>', upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 20h14"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
  dumbbell: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>', bed: '<path d="M3 18.5V7M3 14.5h18v4M21 14.5V12a3 3 0 0 0-3-3h-7v5.5"/><circle cx="7" cy="11" r="1.8"/>',
  meal: '<path d="M7 3v8M5 3v4.5a2 2 0 0 0 4 0V3M7 11v10M16.5 21V3c-2 1.5-3 4-3 7.5h3"/>',
  chart: '<path d="M4 20h16M7 16v-4M12 16V8M17 16v-6"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  library: '<path d="M5 4h3v16H5zM10 4h3v16h-3z"/><path d="m15 5.5 2.8-.8 3.6 14.6-2.8.8z"/>', logout: '<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>', star: '<path d="m12 3.5 2.6 5.3 5.9.8-4.3 4.2 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.6l5.9-.8z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/>', up: '<path d="m6 15 6-6 6 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="4.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>', sparkle: '<path d="M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7z"/>',
  book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5V20"/>'
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const symHtml = (sym, color, cls = '') => {
  if (String(sym).startsWith('i:')) return `<span class="sym c-${color} ${cls}">${ic(sym.slice(2))}</span>`;
  return `<span class="sym c-${color} ${cls} ${String(sym).length > 3 ? 'long' : ''}">${esc(sym)}</span>`;
};
function ring(p, s = 64, w = 7) {
  const r = (s - w) / 2, c = 2 * Math.PI * r;
  return `<span class="ring-wrap"><svg class="ring ${p >= 100 ? 'full' : ''}" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${s / 2}" cy="${s / 2}" r="${r}" class="ring-bg" stroke-width="${w}"/><circle cx="${s / 2}" cy="${s / 2}" r="${r}" class="ring-fg" stroke-width="${w}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - Math.min(p, 100) / 100)).toFixed(2)}" transform="rotate(-90 ${s / 2} ${s / 2})"/></svg><span class="ring-tx" style="font-size:${s > 100 ? 34 : 16}px">${p}%</span></span>`;
}
const bar = (p, thin) => `<div class="bar ${thin ? 'thin' : ''}"><i style="width:${Math.min(100, Math.max(0, p))}%"></i></div>`;

// ================= تشفير وتخزين =================
const enc = new TextEncoder(), dec = new TextDecoder();
function b64(buf) { const u = buf instanceof Uint8Array ? buf : new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); }
const ub64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function kdf(secret, salt) {
  const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function aesEnc(key, bytes) { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, bytes); return { iv: b64(iv), ct: b64(ct) }; }
async function aesDec(key, o) { return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ub64(o.iv) }, key, ub64(o.ct))); }
const importDek = raw => crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
const ACC_KEY = 'masar.acc';
const accounts = () => { try { return JSON.parse(localStorage.getItem(ACC_KEY) || '{}'); } catch { return {}; } };
const setAccounts = a => localStorage.setItem(ACC_KEY, JSON.stringify(a));
async function phoneId(p) {
  const d = normDigits(p).replace(/\D/g, '');
  if (d.length < 6) throw new Error('اكتب رقماً صحيحاً');
  const h = await crypto.subtle.digest('SHA-256', enc.encode('masar:' + d));
  return [...new Uint8Array(h)].slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
}
function genCode() { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const r = crypto.getRandomValues(new Uint8Array(16)); let s = ''; r.forEach((b, i) => { s += A[b % A.length]; if (i % 4 === 3 && i < 15) s += '-'; }); return s; }
const normCode = c => String(c).toUpperCase().replace(/[^A-Z0-9]/g, '');

function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('masar', 1);
    r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('files', { keyPath: 'id' }); d.createObjectStore('kv'); };
    r.onsuccess = () => res(DB = r.result); r.onerror = () => rej(r.error);
  });
}
function idbDo(store, mode, fn) {
  return new Promise((res, rej) => { const t = DB.transaction(store, mode); const q = fn(t.objectStore(store)); t.oncomplete = () => res(q?.result); t.onerror = () => rej(t.error); });
}

async function signup(phone, name, pw) {
  const id = await phoneId(phone); const acc = accounts();
  if (acc[id]) throw new Error('يوجد حساب بهذا الرقم، سجّل الدخول');
  if (pw.length < 6) throw new Error('كلمة السر 6 أحرف على الأقل');
  const raw = crypto.getRandomValues(new Uint8Array(32)), salt = crypto.getRandomValues(new Uint8Array(16)), saltR = crypto.getRandomValues(new Uint8Array(16));
  const code = genCode();
  const w1 = await aesEnc(await kdf(pw, salt), raw), w2 = await aesEnc(await kdf(normCode(code), saltR), raw);
  const owner = !Object.values(acc).some(a => a.owner);
  acc[id] = { name, owner, salt: b64(salt), saltR: b64(saltR), w1, w2, created: Date.now() }; setAccounts(acc);
  ACC = id; DEK = await importDek(raw); S = defaultState(name, owner); await persist(); await rememberSession();
  return code;
}
async function unwrapWith(id, secret, which) {
  const a = accounts()[id]; if (!a) throw new Error('لا يوجد حساب بهذا الرقم على هذا الجهاز');
  try { return await aesDec(await kdf(secret, ub64(which === 'pw' ? a.salt : a.saltR)), which === 'pw' ? a.w1 : a.w2); }
  catch { throw new Error(which === 'pw' ? 'كلمة السر غير صحيحة' : 'رمز الاسترجاع غير صحيح'); }
}
async function login(phone, pw, remember) {
  const id = await phoneId(phone); const raw = await unwrapWith(id, pw, 'pw');
  ACC = id; DEK = await importDek(raw); await loadData(); if (remember) await rememberSession();
}
async function recover(phone, code, newPw) {
  if (newPw.length < 6) throw new Error('كلمة السر 6 أحرف على الأقل');
  const id = await phoneId(phone); const raw = await unwrapWith(id, normCode(code), 'rec');
  const acc = accounts(); const salt = crypto.getRandomValues(new Uint8Array(16));
  acc[id].salt = b64(salt); acc[id].w1 = await aesEnc(await kdf(newPw, salt), raw); setAccounts(acc);
  ACC = id; DEK = await importDek(raw); await loadData(); await rememberSession();
}
async function changePw(oldPw, newPw) {
  if (newPw.length < 6) throw new Error('كلمة السر 6 أحرف على الأقل');
  const raw = await unwrapWith(ACC, oldPw, 'pw'); const acc = accounts(); const salt = crypto.getRandomValues(new Uint8Array(16));
  acc[ACC].salt = b64(salt); acc[ACC].w1 = await aesEnc(await kdf(newPw, salt), raw); setAccounts(acc);
}
async function loadData() {
  const blob = localStorage.getItem('masar.d.' + ACC);
  const acc = accounts()[ACC];
  S = blob ? JSON.parse(dec.decode(await aesDec(DEK, JSON.parse(blob)))) : defaultState(acc?.name || '', !!acc?.owner);
  migrate();
}
async function persist() { if (!S || !DEK) return; const o = await aesEnc(DEK, enc.encode(JSON.stringify(S))); localStorage.setItem('masar.d.' + ACC, JSON.stringify(o)); }
let saveT; const save = () => { clearTimeout(saveT); saveT = setTimeout(persist, 250); };
async function rememberSession() { await idbDo('kv', 'readwrite', s => s.put({ id: ACC, key: DEK }, 'session')); }
async function logout() { await persist(); await idbDo('kv', 'readwrite', s => s.delete('session')); S = null; DEK = null; ACC = null; R.stack = []; R.tab = 'today'; showAuth('login'); }

// ================= الحالة الافتراضية =================
function defaultMoney() { return { costs: [], rev: [], deduct: true, split: false, partners: [] }; }
function card(type, prio = 'mid', pct = false) { return { type, prio, pct }; }
function healthProject(t) {
  return {
    id: 'health', name: 'الصحة والرياضة', sym: 'i:dumbbell', color: 'teal', desc: 'تمارين منزلية متوسطة، ووجبات، ونوم', start: t, due: '',
    cards: [card('daily', 'high', true), card('workout', 'high', true), card('sleep', 'mid'), card('meals', 'mid'), card('goals', 'low', true)],
    goals: [], milestones: [], money: defaultMoney(), notes: '', refs: [],
    daily: [{ id: uid(), t: 'شرب الماء (8 أكواب)' }, { id: uid(), t: 'مشي 20 دقيقة' }, { id: uid(), t: 'إطالة 5 دقائق قبل النوم' }]
  };
}
function defaultState(name, owner) {
  const t = ymd(new Date(now().getTime() - 3 * 36e5));
  const ALL = [0, 1, 2, 3, 4, 5, 6], P = [0, 10, 20, 30, 40, 50];
  const r = (name, start, end, cat, w, al, x = {}) => ({ id: uid(), name, start, end, days: ALL.slice(), cat, w, al, ...x });
  const subj = (id, name, sym, color) => ({ id, name, sym, color, lessons: id, goals: [], refs: [], done: {}, review: {} });
  return {
    v: 1, profile: { name, owner, quit: owner },
    settings: { theme: 'auto', dayStart: 3, currency: 'أوقية', appName: 'مسار', lastBackup: null },
    routine: [
      r('صلاة الفجر', '05:00', '06:00', 'prayer', 2, P), r('ورد القرآن', '06:00', '07:00', 'quran', 2, [0, 15]),
      r('رياضيات', '07:30', '09:00', 'study', 3, [-5], { subject: 'math' }), r('الإنجليزية', '10:00', '11:30', 'study', 3, [-5], { subject: 'english' }),
      r('صلاة الظهر', '13:30', '14:30', 'prayer', 2, P), r('صلاة العصر', '16:30', '17:30', 'prayer', 2, P),
      r('الرياضة', '17:30', '18:15', 'sport', 2, [-10], { project: 'health' }), r('صلاة المغرب', '18:30', '19:30', 'prayer', 2, P),
      r('صلاة العشاء', '20:00', '21:00', 'prayer', 2, P), r('النوم', '23:00', '06:00', 'sleep', 2, [-30, -20, -10, 0], { note: 'الهاتف خارج الغرفة' })
    ],
    extra: {}, log: {}, cele: {},
    subjects: [subj('math', 'الرياضيات', 'π', 'indigo'), subj('physics', 'الفيزياء', 'F=ma', 'cyan'), subj('english', 'الإنجليزية', 'Aع', 'amber')],
    projects: [healthProject(t)], library: [], exams: [],
    quit: { start: t, relapses: [], urges: [] },
    health: { start: t, sessions: {}, sleep: {}, meals: {}, mealTimes: { b: '07:15', l: '14:45', d: '20:30' } },
    lastLesson: null
  };
}
function migrate() {
  S.library ??= []; S.exams ??= []; S.cele ??= {}; S.extra ??= {}; S.log ??= {};
  S.projects.forEach(p => { p.money ??= defaultMoney(); p.refs ??= []; p.goals ??= []; p.milestones ??= []; p.cards ??= []; });
  if (!S.profile.owner) S.profile.quit = false;
}
const quitOn = () => !!(S.profile.owner && S.profile.quit);

// ================= منطق اليوم =================
function sessionKey(date) { return WORKOUT_DAYS[parseYmd(date).getDay()] || null; }
function workoutName(date) { const k = sessionKey(date); return k ? 'تمرين: ' + WORKOUTS[k].n : 'مشي خفيف 30 دقيقة'; }
function sortKey(start) { const m = toMin(start), b = (S.settings.dayStart || 0) * 60; return m < b ? m + 1440 : m; }
function busyOn(date, extra = []) {
  const wd = parseYmd(date).getDay();
  return [...S.routine.filter(r => r.days.includes(wd)), ...(S.extra[date] || []), ...extra].map(t => { const a = toMin(t.start); return [a, a + durMin(t.start, t.end)]; });
}
function findSlot(date, mins, extra = [], from = 420, to = 1320) {
  const busy = busyOn(date, extra);
  for (let t = from; t + mins <= to; t += 15) { if (!busy.some(([a, b]) => t < b + 5 && t + mins > a - 5)) return t; }
  return null;
}
function examTasks(date) {
  const out = [];
  for (const e of S.exams) {
    const dl = daysBetween(date, e.date);
    if (dl >= 1 && dl <= e.before) {
      const sub = S.subjects.find(s => s.id === e.subject); const slot = findSlot(date, e.mins, out);
      if (slot != null) out.push({ id: `ex:${e.id}:${date}`, name: `مراجعة ${sub?.name || ''}`, subtxt: `اختبار ${e.name} بعد ${dl} يوم`, start: fromMin(slot), end: fromMin(slot + e.mins), cat: 'exam', w: 3, subject: e.subject, src: 'e' });
    }
  }
  return out;
}
function dailyItems() { const o = []; S.projects.forEach(p => { if (p.cards.some(c => c.type === 'daily')) (p.daily || []).forEach(it => o.push({ id: 'd:' + it.id, name: it.t, w: 1, project: p.id })); }); return o; }
function dayTasks(date) {
  const wd = parseYmd(date).getDay();
  let t = S.routine.filter(r => r.days.includes(wd)).map(r => ({ ...r, src: 'r', subtxt: r.cat === 'sport' ? workoutName(date) : r.note }));
  t = t.concat((S.extra[date] || []).map(x => ({ ...x, src: 'x' })), examTasks(date));
  return t.sort((a, b) => sortKey(a.start) - sortKey(b.start));
}
function dayStats(date) {
  const L = S.log[date] || {}, tasks = dayTasks(date), daily = dailyItems();
  let tot = 0, done = 0;
  for (const t of [...tasks, ...daily]) { const e = L[t.id]; if (e?.ex) continue; tot += t.w; if (e?.s === 'done') done += t.w; }
  return { tasks, daily, tot, done, pct: tot ? Math.round(done / tot * 100) : 0 };
}
function setLog(date, id, val) { S.log[date] ??= {}; if (val) S.log[date][id] = val; else delete S.log[date][id]; save(); }
function checkDayComplete(date) {
  const st = dayStats(date);
  if (st.pct >= 100 && !S.cele['day:' + date]) { S.cele['day:' + date] = 1; save(); confetti(); toast('يوم كامل 100%! أحسنت', 'ok'); }
}

// ================= نسب المواد والمشاريع =================
function subjectPct(s) {
  const L = LESSONS[s.lessons] || [];
  const tot = L.length + s.goals.reduce((a, g) => a + g.w, 0); if (!tot) return 0;
  const d = L.filter(l => s.done[l.id]).length + s.goals.filter(g => g.done).reduce((a, g) => a + g.w, 0);
  return Math.round(d / tot * 100);
}
function weekStart(date) { return addDays(date, -((parseYmd(date).getDay() + 1) % 7)); }
function cardPct(p, c) {
  const today = logicalToday();
  if (c.type === 'goals') { const t = p.goals.reduce((a, g) => a + g.w, 0); return t ? Math.round(p.goals.filter(g => g.done).reduce((a, g) => a + g.w, 0) / t * 100) : null; }
  if (c.type === 'milestones') { const t = p.milestones.length; return t ? Math.round(p.milestones.filter(m => m.done).length / t * 100) : null; }
  if (c.type === 'daily') { const it = p.daily || []; if (!it.length) return null; const L = S.log[today] || {}; return Math.round(it.filter(x => L['d:' + x.id]?.s === 'done').length / it.length * 100); }
  if (c.type === 'workout') { const ws = weekStart(today); let done = 0; for (let i = 0; i < 7; i++) if (S.health.sessions[addDays(ws, i)]?.done) done++; const planned = Object.keys(WORKOUT_DAYS).length; return Math.min(100, Math.round(done / planned * 100)); }
  return null;
}
function projectPct(p) {
  const v = p.cards.filter(c => c.pct).map(c => cardPct(p, c)).filter(x => x != null);
  return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
}
function moneyCalc(m) {
  const c = sum(m.costs), r = sum(m.rev), net = m.deduct ? r - c : r;
  const shareSum = m.partners.reduce((a, p) => a + num(p.share), 0), ok = Math.abs(shareSum - 100) < 0.05;
  const me = m.partners.find(p => p.me);
  const mine = m.split ? (ok && me ? net * num(me.share) / 100 : null) : net;
  return { c, r, net, shareSum, ok, mine };
}
const money = n => fmtN(n) + ' ' + esc(S.settings.currency);

// ================= واجهة: رسائل وحركة =================
function toast(msg, kind = '') { const t = document.createElement('div'); t.className = `toast glass ${kind}`; t.textContent = msg; $('#toasts').append(t); setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = 0; setTimeout(() => t.remove(), 300); }, 2600); }
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.append(c);
  const W = innerWidth, H = innerHeight, dpr = devicePixelRatio || 1; c.width = W * dpr; c.height = H * dpr;
  const x = c.getContext('2d'); x.scale(dpr, dpr);
  const cols = ['#4F46E5', '#06B6D4', '#16A34A', '#F59E0B', '#818CF8', '#22D3EE'];
  const P = Array.from({ length: 150 }, (_, i) => ({ x: W * (.15 + Math.random() * .7), y: -20 - Math.random() * H * .4, vx: (Math.random() - .5) * 5, vy: 2 + Math.random() * 3.5, r: Math.random() * 6.3, vr: (Math.random() - .5) * .25, tl: Math.random() * 6.3, w: 6 + Math.random() * 7, h: 4 + Math.random() * 5, c: cols[i % cols.length], d: Math.random() < .3 }));
  const t0 = performance.now();
  (function f(t) {
    const e = t - t0; x.clearRect(0, 0, W, H); x.globalAlpha = e > 2300 ? Math.max(0, 1 - (e - 2300) / 500) : 1;
    for (const p of P) {
      p.vy += .07; p.vx *= .992; p.x += p.vx + Math.sin((e / 300) + p.tl) * .6; p.y += p.vy; p.r += p.vr; p.tl += .12;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.scale(1, Math.cos(p.tl)); x.fillStyle = p.c;
      if (p.d) { x.beginPath(); x.moveTo(0, -p.w / 2); x.lineTo(p.h / 2, 0); x.lineTo(0, p.w / 2); x.lineTo(-p.h / 2, 0); x.fill(); } else x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      x.restore();
    }
    if (e < 2800) requestAnimationFrame(f); else c.remove();
  })(t0);
}
let SHEET = null;
function sheet(title, body, onMount) {
  closeSheet(true);
  const o = document.createElement('div'); o.className = 'sheet-wrap';
  o.innerHTML = `<div class="scrim" data-a="closeSheet"></div><div class="sheet" role="dialog" aria-label="${esc(title)}"><div class="grab"></div><div class="sheet-h"><h3>${esc(title)}</h3><button class="icon-btn press" data-a="closeSheet" aria-label="إغلاق">${ic('x')}</button></div><div class="sheet-b">${body}</div></div>`;
  document.body.append(o); SHEET = o; requestAnimationFrame(() => requestAnimationFrame(() => o.classList.add('open'))); onMount?.(o); return o;
}
function closeSheet(instant) { const o = SHEET; if (!o) return; SHEET = null; if (instant) return o.remove(); o.classList.remove('open'); setTimeout(() => o.remove(), 300); }
function ask(msg, yes = 'تأكيد', must) {
  return new Promise(res => {
    let done = false; const fin = v => { if (done) return; done = true; res(v); };
    sheet('تأكيد', `<p style="margin-top:0;font-size:16px">${esc(msg)}</p>${must ? `<label class="field"><span>اكتب «${esc(must)}» للتأكيد</span><input class="input" id="askTxt"></label>` : ''}<div class="btns"><button class="btn" id="askNo">إلغاء</button><button class="btn bad" id="askYes">${esc(yes)}</button></div>`, o => {
      o.querySelector('#askNo').onclick = () => { fin(false); closeSheet(); };
      o.querySelector('#askYes').onclick = () => { if (must && o.querySelector('#askTxt').value.trim() !== must) return toast('الكلمة غير مطابقة', 'bad'); fin(true); closeSheet(); };
      new MutationObserver((_, ob) => { if (!o.isConnected) { fin(false); ob.disconnect(); } }).observe(document.body, { childList: true });
    });
  });
}
const chipsHtml = (name, opts, sel, type = 'radio') => `<div class="chips">${opts.map(([v, l]) => `<label class="chip"><input type="${type}" name="${name}" value="${esc(v)}" ${(Array.isArray(sel) ? sel.map(String).includes(String(v)) : String(sel) === String(v)) ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>`;
const colorChips = sel => chipsHtml('color', COLORS.map(c => [c, `<i class="c-${c}" style="width:16px;height:16px;border-radius:6px;background:var(--c);display:inline-block"></i>`]), sel);
const sw = (label, attrs, on) => `<label class="sw"><span>${label}</span><input type="checkbox" ${attrs} ${on ? 'checked' : ''}></label>`;

// ================= التنقل والعرض =================
const cur = () => R.stack.length ? R.stack[R.stack.length - 1] : { v: R.tab };
function go(v, p = {}) { R.stack.push({ v, ...p }); render(true); }
function back() { R.stack.pop(); render(true); }
function setTab(t) { R.tab = t; R.stack = []; if (t === 'today') R.day = null; render(true); }
const VIEWS = {};
function render(top) {
  if (!S) return;
  const v = cur(); const out = (VIEWS[v.v] || VIEWS.today)(v);
  document.title = S.settings.appName;
  $('#tb-title').textContent = out.title;
  const isRoot = !R.stack.length;
  $('.tb-start').innerHTML = isRoot ? '' : `<button class="icon-btn press" data-a="back" aria-label="رجوع">${ic('back')}</button>`;
  $('.tb-end').innerHTML = `${out.plus ? `<button class="plus-btn press" data-a="${out.plus}" aria-label="إضافة">${ic('plus')}</button>` : ''}<button class="icon-btn press" data-a="theme" aria-label="الوضع">${ic(isDark() ? 'sun' : 'moon')}</button>`;
  $('#view').innerHTML = out.html;
  $$('#tabbar .tab').forEach(b => b.classList.toggle('on', b.dataset.t === R.tab));
  if (top) { scrollTo(0, 0); $('#topbar').classList.remove('hide'); }
  R.lastRender = Date.now(); out.after?.();
}
function isDark() { const t = S?.settings.theme; return t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches); }
function applyTheme() { const t = S?.settings.theme || 'auto'; if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t; $('meta[name=theme-color]')?.setAttribute('content', isDark() ? '#000000' : '#F4F5F9'); }

// ---------- اليوم ----------
VIEWS.today = () => {
  const today = logicalToday(), date = R.day || today, d = parseYmd(date), st = dayStats(date), L = S.log[date] || {};
  const nm = date === today ? nowMin() : null;
  let prevEnd = -1, rows = '';
  for (const t of st.tasks) {
    const e = L[t.id], a = sortKey(t.start), b = a + durMin(t.start, t.end), overlap = a < prevEnd; prevEnd = Math.max(prevEnd, b);
    const isNow = nm != null && inRange(nm, t.start, t.end);
    const sub = e?.s === 'miss' ? `<small class="bad-tx">${esc(e.r)}${e.ex ? ' · مستثناة' : ''}</small>` : overlap ? `<small class="warn-tx">تتداخل مع ما قبلها</small>` : t.subtxt ? `<small>${esc(t.subtxt)}</small>` : isNow ? `<small class="pri-tx">الآن</small>` : '';
    rows += `<div class="tr ${e?.s === 'done' ? 'is-done' : ''} ${isNow ? 'is-now' : ''}"><button class="tn" data-a="openTask" data-id="${t.id}"><i class="cat cat-${t.cat}"></i><span><b>${esc(t.name)}</b>${sub}</span></button><div class="td">${fmtDur(durMin(t.start, t.end))}</div><div class="tt">${t.start}–${t.end}</div><div class="ta"><button class="mini ok press ${e?.s === 'done' ? 'on' : ''}" data-a="done" data-id="${t.id}" aria-label="تم">${ic('check')}</button><button class="mini no press ${e?.s === 'miss' ? 'on' : ''}" data-a="miss" data-id="${t.id}" aria-label="لم أفعل">${ic('x')}</button></div></div>`;
  }
  const daily = st.daily.length ? `<div class="card"><h3>أهداف الصحة اليومية</h3>${st.daily.map(it => { const on = L[it.id]?.s === 'done'; return `<div class="list-row"><button class="chk press ${on ? 'on' : ''}" data-a="toggleDaily" data-id="${it.id}" aria-label="تم">${ic('check')}</button><span class="grow">${esc(it.name)}</span></div>`; }).join('')}</div>` : '';
  const q = quitOn() ? quitInfo() : null;
  const backupDue = !S.settings.lastBackup || daysBetween(S.settings.lastBackup, today) >= 7;
  const tip = (quitOn() && Math.random() < .35) ? pick(QUIT_TIPS) : TIPS[(parseYmd(today).getTime() / 864e5 | 0) % TIPS.length];
  return {
    title: date === today ? 'اليوم' : (date < today ? 'يوم سابق' : 'يوم قادم'), plus: 'addExtra',
    after: () => { if (q) { const m = [...QUIT_MILESTONES].reverse().find(x => q.days >= x); if (m && !S.cele['q:' + m]) { S.cele['q:' + m] = 1; save(); setTimeout(() => { confetti(); toast(MILESTONE_MSG[m], 'ok'); }, 400); } } },
    html: `
    <div class="day-head"><div class="grow"><div class="dow">${DOW[d.getDay()]}</div><div class="dates">${fmtGreg(d)} · ${fmtHijri(d)}</div>
      <div class="day-nav"><button class="pill press" data-a="dayShift" data-n="-1">${ic('prev')}السابق</button>${date !== today ? `<button class="pill on press" data-a="dayShift" data-n="0">اليوم</button>` : ''}<button class="pill press" data-a="dayShift" data-n="1">التالي${ic('next')}</button></div></div>
      ${ring(st.pct, 78, 8)}</div>
    <div class="card ttable"><div class="th"><span>المهمة</span><span style="text-align:center">المدة</span><span style="text-align:center">من – إلى</span><span></span></div>${rows || '<div class="empty">لا مهام في هذا اليوم</div>'}
      <button class="add-row press" data-a="addExtra">${ic('plus')} مهمة لهذا اليوم</button></div>
    ${daily}
    ${q ? `<button class="big press" data-a="goQuit"><div class="row"><span class="sym c-indigo">${ic('flame')}</span><div class="grow"><h4>${q.days} ${q.days === 1 ? 'يوم' : 'أيام'} نظيفة</h4><p>أفضل سلسلة: ${q.best} · التالية: ${q.next ? q.next + ' يوماً' : 'واصل'}</p></div>${ic('chev')}</div>${q.next ? bar(Math.round(q.days / q.next * 100), true) : ''}</button>
    <button class="urge press" data-a="goUrge">${ic('wave')} أشعر برغبة</button>` : ''}
    <div class="card row"><span class="sym sm c-amber">${ic('sparkle')}</span><div class="grow"><b style="font-size:13px" class="muted">نصيحة اليوم</b><div style="font-size:15px">${esc(tip)}</div></div></div>
    ${backupDue ? `<button class="card row press" style="width:100%;text-align:right" data-a="exportBackup"><span class="sym sm c-slate">${ic('download')}</span><div class="grow"><b>حان وقت النسخة الاحتياطية</b><div class="muted" style="font-size:13px">احفظ نسخة مشفّرة في «الملفات» حتى لا تضيع بياناتك</div></div></button>` : ''}`
  };
};
function quitInfo() {
  const today = logicalToday(); const last = S.quit.relapses.length ? S.quit.relapses[S.quit.relapses.length - 1].date : S.quit.start;
  const days = Math.max(0, daysBetween(last, today));
  let best = days, prev = S.quit.start; for (const r of S.quit.relapses) { best = Math.max(best, daysBetween(prev, r.date)); prev = r.date; }
  return { days, best, next: QUIT_MILESTONES.find(m => m > days) || null, last };
}

// ---------- الدروس ----------
VIEWS.lessons = () => {
  const today = logicalToday();
  const due = []; S.subjects.forEach(s => Object.entries(s.review || {}).forEach(([lid, r]) => { if (r.next <= today) due.push([s, lid]); }));
  const last = S.lastLesson && S.subjects.find(s => s.id === S.lastLesson.s);
  const lastL = last && (LESSONS[last.lessons] || []).find(l => l.id === S.lastLesson.l);
  return {
    title: 'الدروس', plus: 'addSubject',
    html: `${lastL ? `<button class="card row press" style="width:100%;text-align:right" data-a="openLesson" data-s="${last.id}" data-l="${lastL.id}"><span class="sym sm c-${last.color}">${ic('play')}</span><div class="grow"><small class="muted">تابع من حيث توقفت</small><div><b>${esc(lastL.title)}</b></div></div>${ic('chev')}</button>` : ''}
    ${due.length ? `<button class="card row press" style="width:100%;text-align:right" data-a="goReview"><span class="sym sm c-amber">${ic('timer')}</span><div class="grow"><b>مراجعة اليوم</b><div class="muted" style="font-size:13px">${due.length} ${due.length === 1 ? 'درس' : 'دروس'} حان وقت مراجعتها</div></div>${ic('chev')}</button>` : ''}
    ${S.subjects.map(s => { const L = LESSONS[s.lessons] || [], p = subjectPct(s), n = L.filter(l => s.done[l.id]).length;
      return `<button class="big press" data-a="openSubject" data-id="${s.id}"><div class="row">${symHtml(s.sym, s.color)}<div class="grow"><h4>${esc(s.name)}</h4><p>${L.length ? `${n} من ${L.length} دروس` : 'أضف أهدافاً ومراجع'}${s.goals.length ? ` · ${s.goals.filter(g => g.done).length} من ${s.goals.length} أهداف` : ''}</p></div><span class="pct">${p}%</span></div>${bar(p)}</button>`; }).join('')}
    <button class="add-row press" data-a="addSubject">${ic('plus')} أضف مادة</button>`
  };
};
VIEWS.subject = v => {
  const s = S.subjects.find(x => x.id === v.id); if (!s) return VIEWS.lessons();
  const tab = R.sub[s.id] || 'lessons', L = LESSONS[s.lessons] || [], p = subjectPct(s), today = logicalToday();
  let body = '';
  if (tab === 'lessons') body = L.length ? `<div class="card">${L.map((l, i) => { const d = s.done[l.id]; return `<button class="list-row press" style="width:100%;text-align:right" data-a="openLesson" data-s="${s.id}" data-l="${l.id}"><span class="sym sm c-${d ? 'teal' : s.color}" style="font-family:inherit">${d ? ic('check') : i + 1}</span><span class="grow"><b>${esc(l.title)}</b><br><small class="muted">${l.mins} دقيقة · ${l.ex.length} تمارين</small></span>${d ? `<span class="tag ok">${d.score}/${l.ex.length}</span>` : '<span class="tag">لم يبدأ</span>'}</button>`; }).join('')}</div>` : `<div class="card empty">لا توجد دروس مكتوبة لهذه المادة بعد. استعمل الأهداف والمراجع.</div>`;
  if (tab === 'refs') body = refsHtml('s', s.id, s.refs);
  if (tab === 'goals') body = goalsHtml('s', s.id, s.goals);
  if (tab === 'review') { const due = Object.entries(s.review || {}).sort((a, b) => a[1].next < b[1].next ? -1 : 1); body = `<div class="card">${due.length ? due.map(([lid, r]) => { const l = L.find(x => x.id === lid); return l ? `<button class="list-row press" style="width:100%;text-align:right" data-a="openLesson" data-s="${s.id}" data-l="${lid}" data-review="1"><span class="grow"><b>${esc(l.title)}</b><br><small class="muted">المراجعة ${r.next <= today ? 'اليوم' : 'في ' + fmtShort(r.next)}</small></span><span class="tag ${r.next <= today ? 'warn' : ''}">${r.next <= today ? 'حان وقتها' : 'لاحقاً'}</span></button>` : ''; }).join('') : '<div class="empty">أنهِ درساً لتظهر مراجعته هنا في أوقات متباعدة</div>'}</div>`; }
  return {
    title: s.name,
    html: `<div class="big"><div class="row">${symHtml(s.sym, s.color)}<div class="grow"><h4>${esc(s.name)}</h4><p>التقدم الكلي</p></div><span class="pct">${p}%</span></div>${bar(p)}</div>
    <div class="seg">${[['lessons', 'الدروس'], ['refs', 'المراجع'], ['goals', 'الأهداف'], ['review', 'المراجعة']].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-a="subTab" data-k="${s.id}" data-v="${k}">${l}</button>`).join('')}</div>${body}
    <button class="btn bad block sm" style="margin-top:20px" data-a="delSubject" data-id="${s.id}">${ic('trash')} حذف المادة</button>`
  };
};
VIEWS.lesson = v => {
  const s = S.subjects.find(x => x.id === v.s), l = (LESSONS[s?.lessons] || []).find(x => x.id === v.l); if (!l) return VIEWS.lessons();
  const st = R.ls[l.id] ||= { ans: {}, review: !!v.review };
  const exHtml = l.ex.map((e, i) => {
    const a = st.ans[i] || {};
    let ctl;
    if (e.t === 'choice') ctl = e.o.map((o, j) => `<button class="opt press ${a.ok && j === e.a ? 'right' : ''} ${a.wrong === j ? 'wrong' : ''}" data-a="answerChoice" data-l="${l.id}" data-i="${i}" data-j="${j}" ${a.ok ? 'disabled' : ''}>${esc(o)}</button>`).join('');
    else ctl = `<div class="ans"><input class="input" id="ans-${i}" inputmode="${e.t === 'factors' ? 'text' : 'numeric'}" placeholder="${e.t === 'factors' ? '2×3×3' : 'الجواب'}" value="${esc(a.val || '')}" ${a.ok ? 'disabled' : ''}><button class="btn pri" data-a="answerText" data-l="${l.id}" data-i="${i}" ${a.ok ? 'disabled' : ''}>تحقق</button></div>`;
    const fb = a.ok ? `<div class="fb ok-tx">${ic('check')} صحيح${a.tries > 1 ? ' (بعد ' + a.tries + ' محاولات)' : ''}</div>` : a.tries ? `<div class="fb bad-tx">ليس بعد، حاول مرة أخرى${e.h ? ` · <span class="muted">تلميح: ${esc(e.h)}</span>` : ''}</div>` : '';
    return `<div class="ex ${a.ok ? 'solved' : ''}"><div class="q">${i + 1}. ${esc(e.q)}</div>${ctl}${fb}</div>`;
  }).join('');
  return {
    title: st.review ? 'مراجعة' : 'درس',
    html: `<div class="big"><div class="row">${symHtml(s.sym, s.color, 'sm')}<div class="grow"><h4>${esc(l.title)}</h4><p>${esc(s.name)} · ${l.mins} دقيقة</p></div></div></div>
    ${st.review ? '' : `<div class="card lesson-sec"><h3>${ic('sparkle')} مثال</h3><div class="body">${l.example}</div></div><div class="card lesson-sec"><h3>${ic('info')} الفكرة</h3><div class="body">${l.idea}</div></div>`}
    <div class="card lesson-sec"><h3>${ic('edit')} تمارين</h3>${exHtml}</div>`
  };
};
VIEWS.review = () => {
  const today = logicalToday(), items = [];
  S.subjects.forEach(s => Object.entries(s.review || {}).forEach(([lid, r]) => { const l = (LESSONS[s.lessons] || []).find(x => x.id === lid); if (l && r.next <= today) items.push({ s, l }); }));
  return { title: 'مراجعة اليوم', html: `<div class="card">${items.length ? items.map(({ s, l }) => `<button class="list-row press" style="width:100%;text-align:right" data-a="openLesson" data-s="${s.id}" data-l="${l.id}" data-review="1">${symHtml(s.sym, s.color, 'sm')}<span class="grow"><b>${esc(l.title)}</b><br><small class="muted">${esc(s.name)}</small></span>${ic('chev')}</button>`).join('') : '<div class="empty">لا مراجعات اليوم، أحسنت</div>'}</div>` };
};

// ---------- الأهداف والمراجع (مشتركة) ----------
function ownerOf(kind, id) { return kind === 's' ? S.subjects.find(x => x.id === id) : kind === 'p' ? S.projects.find(x => x.id === id) : { refs: S.library }; }
function goalsHtml(kind, id, goals) {
  return `<div class="card">${goals.length ? goals.map(g => `<div class="list-row"><button class="chk press ${g.done ? 'on' : ''}" data-a="toggleGoal" data-k="${kind}" data-o="${id}" data-id="${g.id}" aria-label="إنجاز">${ic('check')}</button><span class="grow" style="${g.done ? 'text-decoration:line-through;color:var(--tx3)' : ''}">${esc(g.t)}</span><button class="tag press" data-a="goalWeight" data-k="${kind}" data-o="${id}" data-id="${g.id}">${W_LBL[g.w]}</button>${kind === 'p' && !g.done ? `<button class="icon-btn press" style="width:34px;height:34px" data-a="scheduleGoal" data-o="${id}" data-id="${g.id}" aria-label="جدولة">${ic('cal')}</button>` : ''}<button class="icon-btn press" style="width:34px;height:34px" data-a="delGoal" data-k="${kind}" data-o="${id}" data-id="${g.id}" aria-label="حذف">${ic('trash')}</button></div>`).join('') : '<div class="empty">لا أهداف بعد</div>'}
  <form data-f="addGoal" data-k="${kind}" data-o="${id}" class="row" style="margin-top:10px"><input class="input grow" name="t" placeholder="هدف جديد" required><select class="input" name="w" style="width:96px"><option value="1">صغير</option><option value="2" selected>متوسط</option><option value="3">كبير</option></select><button class="btn pri" style="width:48px;padding:0">${ic('plus')}</button></form></div>`;
}
function refsHtml(kind, id, refs) {
  return `<div class="card">${refs.length ? refs.map(r => refRow(kind, id, r)).join('') : '<div class="empty">أضف كتب PDF أو روابط فيديو</div>'}
  <div class="btns"><label class="btn sm press">${ic('file')} ملف من الجهاز<input type="file" hidden accept="application/pdf,video/*,audio/*,image/*" data-c="pickFile" data-k="${kind}" data-o="${id}"></label><button class="btn sm press" data-a="addLink" data-k="${kind}" data-o="${id}">${ic('link')} رابط</button></div></div>`;
}
function refRow(kind, id, r, src) {
  const icn = r.type === 'file' ? (r.mime?.includes('pdf') ? 'file' : r.mime?.startsWith('video') ? 'play' : 'file') : r.video ? 'play' : 'link';
  return `<div class="list-row"><button class="row grow press" style="text-align:right" data-a="openRef" data-k="${kind}" data-o="${id}" data-id="${r.id}"><span class="sym sm c-${r.type === 'file' ? 'indigo' : 'cyan'}">${ic(icn)}</span><span class="grow" style="min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.title)}</b><small class="muted">${src ? esc(src) + ' · ' : ''}${r.type === 'file' ? fmtSize(r.size) + (r.page > 1 ? ' · وصلت ص ' + r.page : '') : r.video ? 'فيديو' : 'رابط'}</small></span></button><button class="icon-btn press" style="width:34px;height:34px" data-a="delRef" data-k="${kind}" data-o="${id}" data-id="${r.id}" aria-label="حذف">${ic('trash')}</button></div>`;
}

// ---------- المشاريع ----------
VIEWS.projects = () => ({
  title: 'المشاريع', plus: 'newProject',
  html: S.projects.map(p => { const pc = projectPct(p), m = p.cards.some(c => c.type === 'money') ? moneyCalc(p.money) : null;
    return `<button class="big press" data-a="openProject" data-id="${p.id}"><div class="row">${symHtml(p.sym, p.color)}<div class="grow"><h4>${esc(p.name)}</h4><p>${esc(p.desc || '')}</p>${m ? `<p class="${m.net < 0 ? 'bad-tx' : 'ok-tx'}" style="font-weight:800">الصافي ${money(m.net)}</p>` : ''}</div>${pc != null ? `<span class="pct">${pc}%</span>` : ''}</div>${pc != null ? bar(pc) : ''}</button>`; }).join('') + `<button class="add-row press" data-a="newProject">${ic('plus')} مشروع جديد</button>`
});
const CARD_T = { goals: 'الأهداف', milestones: 'الخطط والمراحل', money: 'المال', refs: 'المراجع', notes: 'ملاحظات', deadline: 'الموعد النهائي', daily: 'أهداف يومية', workout: 'التمارين', meals: 'الوجبات', sleep: 'النوم' };
const PCT_ABLE = ['goals', 'milestones', 'daily', 'workout'];
VIEWS.project = v => {
  const p = S.projects.find(x => x.id === v.id); if (!p) return VIEWS.projects();
  const pc = projectPct(p), today = logicalToday();
  const stats = [];
  if (pc != null) stats.push(['التنفيذ', pc + '%']);
  if (p.cards.some(c => c.type === 'money')) { const m = moneyCalc(p.money); stats.push(['التكاليف', money(m.c)], ['الإيرادات', money(m.r)], [p.money.deduct ? 'الصافي' : 'الأرباح', `<span class="${m.net < 0 ? 'bad-tx' : 'ok-tx'}">${money(m.net)}</span>`]); if (p.money.split) stats.push(['حصتي', m.mine == null ? '<span class="warn-tx">—</span>' : money(m.mine)]); }
  const nm = p.milestones.filter(m => !m.done).sort((a, b) => (a.date || '9') < (b.date || '9') ? -1 : 1)[0]; if (p.cards.some(c => c.type === 'milestones')) stats.push(['المرحلة التالية', nm ? esc(nm.t) : '—']);
  if (p.due) stats.push(['الموعد', daysBetween(today, p.due) >= 0 ? `بعد ${daysBetween(today, p.due)} يوم` : 'انتهى']);
  const cards = p.cards.map((c, i) => ({ c, i })).sort((a, b) => PRIO_ORD[a.c.prio] - PRIO_ORD[b.c.prio] || a.i - b.i);
  const missing = Object.keys(CARD_T).filter(t => !p.cards.some(c => c.type === t) && (p.id === 'health' || !['daily', 'workout', 'meals', 'sleep'].includes(t)));
  return {
    title: p.name,
    html: `<div class="big"><div class="row">${symHtml(p.sym, p.color)}<div class="grow"><h4>${esc(p.name)}</h4><p>${esc(p.desc || '')}</p></div>${pc != null ? `<span class="pct">${pc}%</span>` : ''}<button class="icon-btn press" data-a="editProject" data-id="${p.id}" aria-label="تعديل">${ic('edit')}</button></div>${pc != null ? bar(pc) : ''}</div>
    ${stats.length ? `<div class="strip">${stats.map(([l, v]) => `<div class="stat"><small>${l}</small><b>${v}</b></div>`).join('')}</div>` : ''}
    ${cards.map(({ c, i }) => `<div class="card"><div class="row" style="margin-bottom:8px"><h3 class="grow" style="margin:0">${CARD_T[c.type]}</h3>
      ${c.pct && cardPct(p, c) != null ? `<span class="tag ok">${cardPct(p, c)}%</span>` : ''}<button class="tag ${c.prio === 'high' ? 'pri' : ''} press" data-a="cardPrio" data-p="${p.id}" data-i="${i}">${PRIO_LBL[c.prio]}</button>
      <button class="icon-btn press" style="width:32px;height:32px" data-a="cardMenu" data-p="${p.id}" data-i="${i}" aria-label="خيارات">${ic('gear')}</button></div>${cardBody(p, c)}</div>`).join('')}
    ${missing.length ? `<button class="add-row press" data-a="addCard" data-p="${p.id}">${ic('plus')} أضف بطاقة</button>` : ''}
    ${p.id !== 'health' ? `<button class="btn bad block sm" style="margin-top:20px" data-a="delProject" data-id="${p.id}">${ic('trash')} حذف المشروع</button>` : ''}`
  };
};
function cardBody(p, c) {
  const today = logicalToday();
  switch (c.type) {
    case 'goals': return goalsHtml('p', p.id, p.goals).replace(/^<div class="card">/, '<div>');
    case 'milestones': return `${p.milestones.length ? p.milestones.map(m => `<div class="list-row"><button class="chk press ${m.done ? 'on' : ''}" data-a="toggleMs" data-p="${p.id}" data-id="${m.id}">${ic('check')}</button><span class="grow">${esc(m.t)}</span>${m.date ? `<span class="tag ${!m.done && m.date < today ? 'bad' : ''}">${fmtShort(m.date)}</span>` : ''}<button class="icon-btn press" style="width:34px;height:34px" data-a="delMs" data-p="${p.id}" data-id="${m.id}">${ic('trash')}</button></div>`).join('') : '<div class="empty">لا مراحل بعد</div>'}
      <form data-f="addMs" data-p="${p.id}" style="margin-top:10px"><input class="input" name="t" placeholder="مرحلة قادمة" required><div class="row" style="margin-top:8px"><input class="input grow" type="date" name="date"><button class="btn pri">${ic('plus')} أضف</button></div></form>`;
    case 'money': {
      const m = p.money, k = moneyCalc(m);
      const list = (arr, key, lbl) => `<div style="margin-top:6px"><b class="muted" style="font-size:13px">${lbl}</b>${arr.map(x => `<div class="list-row"><span class="grow">${esc(x.t)}</span><b>${money(x.amt)}</b><button class="icon-btn press" style="width:32px;height:32px" data-a="delMoney" data-p="${p.id}" data-key="${key}" data-id="${x.id}">${ic('trash')}</button></div>`).join('')}
        <form data-f="addMoney" data-p="${p.id}" data-key="${key}" class="row" style="margin-top:6px"><input class="input grow" name="t" placeholder="البند" required><input class="input" name="amt" inputmode="decimal" placeholder="المبلغ" style="width:110px" required><button class="btn pri" style="width:48px;padding:0">${ic('plus')}</button></form></div>`;
      return `${list(m.costs, 'costs', 'التكاليف')}${list(m.rev, 'rev', 'الإيرادات والأرباح')}
      ${sw('اخصم التكاليف من الأرباح', `data-c="moneyFlag" data-p="${p.id}" data-key="deduct"`, m.deduct)}
      ${sw('قسّم الأرباح على الشركاء', `data-c="moneyFlag" data-p="${p.id}" data-key="split"`, m.split)}
      ${m.split ? `<div>${m.partners.map(x => `<div class="list-row" style="flex-wrap:wrap"><input class="input grow" style="min-width:0" value="${esc(x.name)}" data-c="partner" data-p="${p.id}" data-id="${x.id}" data-key="name" ${x.me ? 'readonly' : ''}><input class="input" style="width:78px;text-align:center" inputmode="decimal" value="${fmtN(x.share)}" data-c="partner" data-p="${p.id}" data-id="${x.id}" data-key="share"><span>%</span>${x.me ? '<span style="width:32px"></span>' : `<button class="icon-btn press" style="width:32px;height:32px" data-a="delPartner" data-p="${p.id}" data-id="${x.id}">${ic('trash')}</button>`}<small class="muted" style="width:100%">الحصة: <b class="${k.net < 0 ? 'bad-tx' : 'ok-tx'}">${k.ok ? money(k.net * num(x.share) / 100) : '—'}</b></small></div>`).join('')}
        ${k.ok ? '' : `<div class="note danger-note">مجموع النسب ${fmtN(k.shareSum)}% ويجب أن يكون 100%</div>`}
        <div class="btns"><button class="btn sm press" data-a="addPartner" data-p="${p.id}">${ic('plus')} شريك</button><button class="btn sm press" data-a="equalSplit" data-p="${p.id}">تقسيم بالتساوي</button></div></div>` : ''}
      <div class="note">الإيرادات ${money(k.r)} − التكاليف ${money(k.c)} = <b class="${k.net < 0 ? 'bad-tx' : 'ok-tx'}">${money(k.r - k.c)}</b>${m.split && k.ok ? ` · حصتي <b>${money(k.mine)}</b>` : ''}</div>`;
    }
    case 'refs': return refsHtml('p', p.id, p.refs).replace(/^<div class="card">/, '<div>');
    case 'notes': return `<textarea class="input" data-c="notes" data-p="${p.id}" placeholder="اكتب ملاحظاتك هنا">${esc(p.notes)}</textarea>`;
    case 'deadline': { const dl = p.due ? daysBetween(today, p.due) : null; return `<div class="row"><input class="input grow" type="date" value="${p.due || ''}" data-c="due" data-p="${p.id}">${dl != null ? `<span class="tag ${dl < 0 ? 'bad' : dl < 7 ? 'warn' : 'pri'}" style="font-size:14px">${dl < 0 ? 'انتهى' : dl === 0 ? 'اليوم' : 'بعد ' + dl + ' يوم'}</span>` : ''}</div>`; }
    case 'daily': { const L = S.log[today] || {}; return `${(p.daily || []).map(it => { const on = L['d:' + it.id]?.s === 'done'; return `<div class="list-row"><button class="chk press ${on ? 'on' : ''}" data-a="toggleDaily" data-id="d:${it.id}">${ic('check')}</button><span class="grow">${esc(it.t)}</span><button class="icon-btn press" style="width:32px;height:32px" data-a="delDaily" data-p="${p.id}" data-id="${it.id}">${ic('trash')}</button></div>`; }).join('')}
      <form data-f="addDaily" data-p="${p.id}" class="row" style="margin-top:8px"><input class="input grow" name="t" placeholder="هدف يومي جديد" required><button class="btn pri" style="width:48px;padding:0">${ic('plus')}</button></form><div class="note">تدخل في نسبة اليوم وتتجدد كل يوم.</div>`; }
    case 'workout': { const k = sessionKey(today), done = S.health.sessions[today]?.done;
      return k ? `<div class="row"><span class="sym sm c-teal">${ic('dumbbell')}</span><div class="grow"><b>اليوم: ${WORKOUTS[k].n}</b><br><small class="muted">${WORKOUTS[k].ex.map(e => EXERCISES[e].n).join('، ')}</small></div></div><button class="btn ${done ? 'ok' : 'pri'} block" style="margin-top:12px" data-a="goWorkout">${done ? ic('check') + ' أنجزت حصة اليوم' : ic('play') + ' ابدأ الحصة'}</button>${isDeload(today) ? '<div class="note">أسبوع تخفيف: مجموعة أقل في كل تمرين.</div>' : ''}`
        : `<div class="row"><span class="sym sm c-cyan">${ic('heart')}</span><div class="grow"><b>يوم راحة</b><br><small class="muted">مشي خفيف 30 دقيقة وإطالة</small></div></div><button class="btn block" style="margin-top:12px" data-a="goWorkout">عرض البرنامج</button>`; }
    case 'meals': { const mt = S.health.mealTimes, md = S.health.meals[today] || {}; return [['b', 'الفطور'], ['l', 'الغداء'], ['d', 'العشاء']].map(([k, l]) => `<div class="list-row"><button class="chk press ${md[k] ? 'on' : ''}" data-a="toggleMeal" data-k="${k}">${ic('check')}</button><span class="grow">${l}<br><small class="muted">التزمت بالخطة</small></span><input class="input" type="time" style="width:120px" value="${mt[k]}" data-c="mealTime" data-k="${k}"></div>`).join('') + `<input class="input" style="margin-top:8px" placeholder="ملاحظة عن أكل اليوم" value="${esc(md.note || '')}" data-c="mealNote">`; }
    case 'sleep': { const sl = S.health.sleep[today] || {}; const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)).map(d => [d, S.health.sleep[d]]);
      const hrs = x => x?.bed && x?.wake ? durMin(x.bed, x.wake) / 60 : 0; const logged = last7.filter(([, x]) => hrs(x)); const avg = logged.length ? logged.reduce((a, [, x]) => a + hrs(x), 0) / logged.length : 0;
      return `<form data-f="saveSleep"><div class="two"><label class="field"><span>نمت</span><input class="input" type="time" name="bed" value="${sl.bed || '23:00'}"></label><label class="field"><span>استيقظت</span><input class="input" type="time" name="wake" value="${sl.wake || '06:00'}"></label></div>
      <div class="field"><span>جودة النوم</span>${chipsHtml('q', [1, 2, 3, 4, 5].map(n => [n, n]), sl.q || 3)}</div><button class="btn pri block">${sl.bed ? 'تحديث' : 'سجّل نوم الليلة'}</button></form>
      <div class="bars" style="height:90px;margin-top:14px">${last7.map(([d, x]) => `<div class="b"><i style="height:${Math.min(100, hrs(x) / 9 * 100)}%" class="${hrs(x) >= 7 ? 'full' : ''}"></i><small>${DOW_S[parseYmd(d).getDay()]}</small></div>`).join('')}</div>
      <div class="note">متوسط آخر 7 ليالٍ: <b>${avg ? avg.toFixed(1) + ' ساعة' : '—'}</b>. الهدف 7 ساعات أو أكثر.</div>`; }
  }
  return '';
}
function isDeload(date) { return Math.floor(daysBetween(S.health.start, date) / 7) % 4 === 3; }
VIEWS.workout = () => {
  const today = logicalToday(), k = sessionKey(today);
  if (!k) return { title: 'التمارين', html: `<div class="card"><h3>يوم راحة</h3><p class="muted">مشي خفيف 30 دقيقة وإطالة. الحصص: ${Object.entries(WORKOUT_DAYS).map(([d, w]) => DOW[d] + ' (' + WORKOUTS[w].n + ')').join('، ')}.</p></div>` + Object.values(WORKOUTS).map(w => `<div class="card"><h3>${w.n}</h3>${w.ex.map(e => `<button class="list-row press" style="width:100%;text-align:right" data-a="exHelp" data-id="${e}"><span class="grow">${EXERCISES[e].n}</span>${ic('info')}</button>`).join('')}</div>`).join('') };
  const W = WORKOUTS[k], ses = S.health.sessions[today] ||= { sets: {} }, dl = isDeload(today);
  const rows = W.ex.map(id => {
    const e = EXERCISES[id], n = e.sets - (dl ? 1 : 0), got = ses.sets[id] || [], u = e.unit || 'تكرار';
    return `<div class="ex-row" style="display:block"><div class="row"><button class="grow press" style="text-align:right" data-a="exHelp" data-id="${id}"><b>${e.n}</b> ${ic('info')}<br><small class="muted"><span class="ltr">${n} × ${e.reps[0]}–${e.reps[1]}</span> ${u}${e.perSide ? ' لكل جهة' : ''} · راحة ${e.rest} ث</small></button></div>
    <div class="sets">${Array.from({ length: n }, (_, i) => `<button class="set press ${got[i] != null ? 'on' : ''}" data-a="logSet" data-id="${id}" data-i="${i}">${got[i] != null ? got[i] : i + 1}</button>`).join('')}</div><div class="note" style="margin-top:8px">${esc(progressHint(id, today))}</div></div>`;
  }).join('');
  return { title: W.n, html: `<div class="card"><div class="note" style="margin:0">${WARMUP}</div></div><div class="card">${rows}</div><div class="card"><div class="note" style="margin:0">${COOLDOWN}</div></div>
    <button class="btn ${ses.done ? 'ok' : 'pri'} block" data-a="finishWorkout">${ses.done ? ic('check') + ' أنجزت الحصة' : 'أنهيت الحصة'}</button><div style="height:70px"></div>${R.rest ? restBar() : ''}`, after: () => {} };
};
function progressHint(id, today) {
  const e = EXERCISES[id]; const prev = Object.keys(S.health.sessions).filter(d => d < today && S.health.sessions[d].sets?.[id]?.length).sort().pop();
  if (!prev) return 'أول مرة: اختر عدداً تتقنه بشكل صحيح.';
  const s = S.health.sessions[prev].sets[id];
  if (s.length >= e.sets && s.every(x => x >= e.reps[1])) return `أتقنته (${s.join('، ')}). جرّب الأصعب: ${e.hard}`;
  if (s.every(x => x >= e.reps[0])) return `آخر مرة: ${s.join('، ')}. زد تكراراً أو اثنين.`;
  return `آخر مرة: ${s.join('، ')}. حافظ على الهدف، أو جرّب الأسهل: ${e.easy}`;
}
const restBar = () => `<div class="rest-bar glass" id="restBar"><span>${ic('timer')} راحة</span><b data-tick="rest" class="ltr">--</b><button class="pill press" data-a="skipRest">تخطّ</button></div>`;

// ---------- الخطة ----------
VIEWS.plan = () => {
  const today = logicalToday(), wd = R.planWd ?? parseYmd(today).getDay();
  const ws = weekStart(today), date = addDays(ws, WEEK.indexOf(wd));
  const items = S.routine.filter(r => r.days.includes(wd)).map(r => ({ ...r, src: 'r' })).concat(examTasks(date)).sort((a, b) => sortKey(a.start) - sortKey(b.start));
  const studyMin = items.filter(t => t.cat === 'study' || t.cat === 'exam').reduce((a, t) => a + durMin(t.start, t.end), 0);
  const sm = weekSummary(today);
  return {
    title: 'الخطة', plus: 'addRoutine',
    html: `<div class="seg">${WEEK.map(d => `<button class="${d === wd ? 'on' : ''}" data-a="planDay" data-d="${d}">${DOW_S[d]}</button>`).join('')}</div>
    <div class="card"><div class="row" style="margin-bottom:6px"><h3 class="grow" style="margin:0">${DOW[wd]}</h3><span class="tag pri">دراسة ${fmtDur(studyMin)}</span></div>
    ${items.map(t => `<button class="list-row press" style="width:100%;text-align:right" ${t.src === 'r' ? `data-a="editRoutine" data-id="${t.id}"` : ''}><i class="cat cat-${t.cat}"></i><span class="grow"><b>${esc(t.name)}</b><br><small class="muted">${t.cat === 'sport' ? workoutName(date) : t.subtxt ? esc(t.subtxt) : CATS[t.cat] || ''}${t.al?.length ? ' · ' + t.al.length + ' تذكير' : ''}</small></span><span class="tt">${t.start} – ${t.end}</span></button>`).join('') || '<div class="empty">لا شيء في هذا اليوم</div>'}
    <button class="add-row press" data-a="addRoutine">${ic('plus')} أضف إلى الروتين</button></div>
    <div class="sec-h"><span>الاختبارات</span><button class="pill press" data-a="addExam">${ic('plus')} اختبار</button></div>
    <div class="card">${S.exams.length ? S.exams.slice().sort((a, b) => a.date < b.date ? -1 : 1).map(e => { const s = S.subjects.find(x => x.id === e.subject), dl = daysBetween(today, e.date); return `<div class="list-row">${s ? symHtml(s.sym, s.color, 'sm') : ''}<span class="grow"><b>${esc(e.name)}</b><br><small class="muted">${esc(s?.name || '')} · ${fmtGreg(parseYmd(e.date))} · مراجعة ${e.before} أيام × ${fmtDur(e.mins)}</small></span><span class="tag ${dl < 0 ? '' : dl <= e.before ? 'warn' : 'pri'}">${dl < 0 ? 'انتهى' : dl === 0 ? 'اليوم' : 'بعد ' + dl}</span><button class="icon-btn press" style="width:34px;height:34px" data-a="delExam" data-id="${e.id}">${ic('trash')}</button></div>`; }).join('') : '<div class="empty">أضف اختباراً، فتوزَّع مراجعته تلقائياً على الأيام التي قبله في أوقات فراغك</div>'}</div>
    <div class="sec-h"><span>ملخص آخر 7 أيام</span></div>
    <div class="card"><div class="row"><div class="grow"><div style="font-size:30px;font-weight:900">${sm.avg}%</div><small class="muted">متوسط الإنجاز · ${sm.done} منجزة · ${sm.miss} فائتة</small></div>${ring(sm.avg, 64, 7)}</div>
    ${sm.reasons.length ? `<div style="margin-top:12px">${sm.reasons.map(([r, n]) => `<div class="list-row"><span class="grow">${esc(r)}</span><span class="tag bad">${n}</span></div>`).join('')}</div>` : ''}
    ${sm.tips.map(t => `<div class="note">${ic('sparkle')} ${esc(t)}</div>`).join('')}</div>
    <button class="card row press" style="width:100%;text-align:right" data-a="exportIcs"><span class="sym sm c-indigo">${ic('bell')}</span><div class="grow"><b>صدّر التذكيرات إلى التقويم</b><div class="muted" style="font-size:13px">ملف واحد يضيف تنبيهات الصلوات والدراسة والنوم إلى تقويم الآيفون</div></div></button>`
  };
};
function weekSummary(today) {
  let tot = 0, done = 0, miss = 0, pcts = []; const reasons = {}, evTired = [0, 0];
  for (let i = 1; i <= 7; i++) {
    const d = addDays(today, -i); if (d < S.quit.start && d < S.health.start) continue;
    const st = dayStats(d), L = S.log[d] || {}; if (!Object.keys(L).length) continue;
    pcts.push(st.pct);
    for (const t of st.tasks) { const e = L[t.id]; if (e?.s === 'done') done++; if (e?.s === 'miss') { miss++; reasons[e.r] = (reasons[e.r] || 0) + 1; if (e.r === 'تعب') evTired[toMin(t.start) >= 1080 ? 1 : 0]++; } }
  }
  const avg = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;
  const rs = Object.entries(reasons).sort((a, b) => b[1] - a[1]); const tips = [];
  const top = rs[0]?.[0];
  if (top === 'تعب') tips.push(evTired[1] >= evTired[0] ? 'التعب يتكرر مساءً: انقل الدراسة إلى الصباح، ونم في موعدك.' : 'التعب يتكرر صباحاً: راجع موعد نومك وجودته.');
  if (top === 'المهمة صعبة') tips.push('المهام تبدو صعبة: قسّم الدرس إلى جلستين أقصر، وابدأ بالمثال.');
  if (top === 'وقت غير كافٍ') tips.push('الوقت لا يكفي: اختصر جلسات الدراسة 15 دقيقة لأسبوع، ثم زدها تدريجياً.');
  if (top === 'نسيت') tips.push('النسيان يتكرر: صدّر التذكيرات إلى التقويم من الأسفل.');
  if (top === 'رغبة أو انتكاسة') tips.push('الرغبة عطّلت يومك: الهاتف خارج الغرفة، واستعمل زر «أشعر برغبة» فور بدايتها.');
  if (!pcts.length) tips.push('ابدأ بتأكيد مهامك يومياً ليظهر هنا ملخص واقتراحات.');
  else if (avg >= 85) tips.push('أسبوع ممتاز. حافظ على نفس الإيقاع.');
  return { avg, done, miss, reasons: rs, tips };
}

// ---------- المزيد ----------
VIEWS.more = () => {
  const T = (a, icon, l, c) => `<button class="tile press" data-a="${a}">${`<span class="sym c-${c}">${ic(icon)}</span>`}${l}</button>`;
  return {
    title: 'المزيد',
    html: `<div class="card row"><span class="sym c-indigo" style="font-family:inherit">${esc((S.profile.name || 'م').trim()[0] || 'م')}</span><div class="grow"><h3 style="margin:0">${esc(S.profile.name || 'حسابي')}</h3><small class="muted">البيانات مشفّرة على هذا الجهاز</small></div></div>
    <div class="sec-h">الأدوات</div><div class="card"><div class="grid4">
      ${T('goLibrary', 'library', 'المكتبة', 'indigo')}${T('goStats', 'chart', 'الإحصائيات', 'cyan')}${T('goHealth', 'dumbbell', 'الصحة', 'teal')}${quitOn() ? T('goQuit', 'shield', 'عاداتي', 'violet') : ''}
      ${T('goReview', 'timer', 'المراجعة', 'amber')}${T('exportIcs', 'bell', 'التذكيرات', 'rose')}${T('goSettings', 'gear', 'الإعدادات', 'slate')}${T('exportBackup', 'download', 'نسخة احتياطية', 'slate')}
    </div></div>
    <button class="btn bad block" style="margin-top:8px" data-a="logout">${ic('logout')} تسجيل الخروج</button>
    <p class="faint" style="text-align:center;font-size:12px;margin-top:18px">${esc(S.settings.appName)} · النسخة 1</p>`
  };
};
VIEWS.library = () => {
  const f = R.sub.lib || 'all'; const all = [];
  S.subjects.forEach(s => s.refs.forEach(r => all.push(['s', s.id, r, s.name])));
  S.projects.forEach(p => p.refs.forEach(r => all.push(['p', p.id, r, p.name])));
  S.library.forEach(r => all.push(['g', 'g', r, 'عام']));
  const flt = all.filter(([, , r]) => f === 'all' || (f === 'pdf' && r.mime?.includes('pdf')) || (f === 'video' && (r.video || r.mime?.startsWith('video'))) || (f === 'link' && r.type === 'link'));
  return { title: 'المكتبة', html: `<div class="seg">${[['all', 'الكل'], ['pdf', 'PDF'], ['video', 'فيديو'], ['link', 'روابط']].map(([k, l]) => `<button class="${f === k ? 'on' : ''}" data-a="libFilter" data-v="${k}">${l}</button>`).join('')}</div>
    <div class="card">${flt.length ? flt.map(([k, o, r, src]) => refRow(k, o, r, src)).join('') : '<div class="empty">لا شيء هنا بعد</div>'}</div>${refsHtml('g', 'g', []).replace('<div class="empty">أضف كتب PDF أو روابط فيديو</div>', '<b>إضافة إلى المكتبة العامة</b>')}` };
};
VIEWS.stats = () => {
  const today = logicalToday(), days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const P = days.map(d => [d, S.log[d] && Object.keys(S.log[d]).length ? dayStats(d).pct : 0]);
  const act = P.filter(([d]) => S.log[d] && Object.keys(S.log[d]).length);
  const avg = act.length ? Math.round(act.reduce((a, [, p]) => a + p, 0) / act.length) : 0;
  let streak = 0; for (let i = 1; i <= 60; i++) { const d = addDays(today, -i); if (S.log[d] && dayStats(d).pct >= 80) streak++; else break; }
  const sm = weekSummary(today), q = quitOn() ? quitInfo() : null;
  const sl = days.slice(7).map(d => S.health.sleep[d]).filter(x => x?.bed); const sAvg = sl.length ? (sl.reduce((a, x) => a + durMin(x.bed, x.wake), 0) / sl.length / 60).toFixed(1) : '—';
  return { title: 'الإحصائيات', html: `<div class="strip"><div class="stat"><small>متوسط 14 يوماً</small><b>${avg}%</b></div><div class="stat"><small>أيام متتالية ≥80%</small><b>${streak}</b></div><div class="stat"><small>متوسط النوم</small><b>${sAvg}</b></div>${q ? `<div class="stat"><small>أيام نظيفة</small><b>${q.days}</b></div>` : ''}</div>
    <div class="card"><h3>نسبة الإنجاز اليومية</h3><div class="bars">${P.map(([d, p]) => `<div class="b"><i style="height:${p}%" class="${p >= 100 ? 'full' : ''}"></i><small>${parseYmd(d).getDate()}</small></div>`).join('')}</div></div>
    <div class="card"><h3>أسباب عدم الإنجاز (7 أيام)</h3>${sm.reasons.length ? sm.reasons.map(([r, n]) => `<div class="list-row"><span class="grow">${esc(r)}</span><span class="tag bad">${n}</span></div>`).join('') : '<div class="empty">لا شيء مسجّل</div>'}</div>
    <div class="card"><h3>الدروس</h3>${S.subjects.map(s => `<div class="list-row">${symHtml(s.sym, s.color, 'sm')}<span class="grow">${esc(s.name)}${bar(subjectPct(s), true)}</span><b>${subjectPct(s)}%</b></div>`).join('')}</div>` };
};
VIEWS.settings = () => ({
  title: 'الإعدادات', html: `<form data-f="saveSettings" class="card"><label class="field"><span>اسمك</span><input class="input" name="name" value="${esc(S.profile.name)}"></label>
    <label class="field"><span>اسم التطبيق</span><input class="input" name="appName" value="${esc(S.settings.appName)}"></label>
    <div class="field"><span>المظهر</span>${chipsHtml('theme', [['auto', 'حسب الهاتف'], ['light', 'فاتح'], ['dark', 'ليلي']], S.settings.theme)}</div>
    <label class="field"><span>العملة</span><input class="input" name="currency" value="${esc(S.settings.currency)}"></label>
    <label class="field"><span>يبدأ اليوم الجديد عند الساعة</span><select class="input" name="dayStart">${[0, 1, 2, 3, 4, 5].map(h => `<option value="${h}" ${S.settings.dayStart === h ? 'selected' : ''}>${pad(h)}:00${h === 3 ? ' (مناسب للسهر)' : ''}</option>`).join('')}</select></label>
    ${S.profile.owner ? sw('إظهار قسم عاداتي', 'name="quit"', S.profile.quit) : ''}
    <button class="btn pri block">حفظ</button></form>
    <div class="card"><h3>الأمان والبيانات</h3>
    <button class="list-row press" style="width:100%;text-align:right" data-a="changePw">${ic('lock')}<span class="grow">تغيير كلمة السر</span></button>
    <button class="list-row press" style="width:100%;text-align:right" data-a="exportBackup">${ic('download')}<span class="grow">تصدير نسخة احتياطية مشفّرة</span></button>
    <label class="list-row press" style="cursor:pointer">${ic('upload')}<span class="grow">استيراد نسخة احتياطية</span><input type="file" hidden accept=".json,application/json" data-c="importBackup"></label>
    <div class="note">النسخة الاحتياطية تشمل كل بياناتك مشفّرة بكلمة سرك، ولا تشمل ملفات PDF والفيديو (احتفظ بها في «الملفات»).</div></div>
    <button class="btn bad block" data-a="wipe">${ic('trash')} حذف كل بيانات الحساب من الجهاز</button>`
});

// ---------- عاداتي ----------
VIEWS.quit = () => {
  if (!quitOn()) return VIEWS.more();
  const q = quitInfo(), wk = addDays(logicalToday(), -6), ur = S.quit.urges.filter(u => u.date >= wk);
  return { title: 'عاداتي', html: `<div class="card" style="text-align:center">${ring(q.next ? Math.round(q.days / q.next * 100) : 100, 170, 14).replace(/>\d+%</, `>${q.days}<`)}<h3 style="margin:10px 0 0">${q.days === 1 ? 'يوم نظيف' : 'أيام نظيفة'}</h3><p class="muted" style="margin:2px 0 0">${q.next ? `الهدف التالي: ${q.next} يوماً` : 'تجاوزت كل الأهداف، واصل'}</p></div>
    <button class="urge press" data-a="goUrge">${ic('wave')} أشعر برغبة</button>
    <div class="strip"><div class="stat"><small>أفضل سلسلة</small><b>${q.best} يوم</b></div><div class="stat"><small>رغبات هذا الأسبوع</small><b>${ur.length}</b></div><div class="stat"><small>تجاوزتها</small><b class="ok-tx">${ur.filter(u => u.ok).length}</b></div><div class="stat"><small>منذ</small><b>${fmtShort(q.last)}</b></div></div>
    <div class="card"><h3>المراحل</h3><div class="chips">${QUIT_MILESTONES.map(m => `<span class="tag ${q.days >= m ? 'ok' : ''}" style="font-size:14px;padding:6px 12px">${q.days >= m ? '✓ ' : ''}${m} يوماً</span>`).join('')}</div></div>
    <div class="card"><h3>خطتي</h3>${['الهاتف خارج غرفة النوم من 22:30.', 'لا أبقى في السرير مستيقظاً مع شاشة.', 'عند الملل أو الوحدة: أخرج من الغرفة أو أبدأ مهمة صغيرة.', 'كل رغبة أسجّلها هنا، فأعرف أوقاتها وأسبابها.', 'إن انتكست: أسجّل السبب وأعدّل الخطة، دون جلد للذات.'].map(t => `<div class="list-row">${ic('check', 'ok-tx')}<span class="grow">${t}</span></div>`).join('')}</div>
    ${S.quit.relapses.length ? `<div class="card"><h3>سجل الانتكاسات</h3>${S.quit.relapses.slice(-5).reverse().map(r => `<div class="list-row"><span class="grow">${esc(r.reason)}${r.note ? `<br><small class="muted">${esc(r.note)}</small>` : ''}</span><span class="tag">${fmtShort(r.date)}</span></div>`).join('')}</div>` : ''}
    <button class="btn block" data-a="relapse">سجّلت انتكاسة</button>` };
};
VIEWS.urge = () => {
  R.urge ||= { start: Date.now(), steps: {} };
  const steps = ['قم من مكانك الآن', 'اخرج من الغرفة أو افتح الباب', 'اغسل وجهك أو توضأ', '20 قرفصاء أو مشي 5 دقائق', 'حلّ تمرين الرياضيات بالأسفل'];
  const ex = R.urge.ex ||= randomNumEx();
  return { title: 'لحظة', html: `<div class="card" style="text-align:center"><div class="timer"><svg width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" class="ring-bg" stroke-width="12"/><circle id="urgeRing" cx="100" cy="100" r="90" class="ring-fg" stroke-width="12" stroke-dasharray="565.5" stroke-dashoffset="0" transform="rotate(-90 100 100)"/></svg><span class="t" data-tick="urge">10:00</span></div>
    <p style="margin:0;font-weight:800">الرغبة موجة تعلو ثم تهبط. انتظر 10 دقائق فقط.</p></div>
    <div class="card">${steps.map((s, i) => `<div class="list-row"><button class="chk press ${R.urge.steps[i] ? 'on' : ''}" data-a="urgeStep" data-i="${i}">${ic('check')}</button><span class="grow">${s}</span></div>`).join('')}</div>
    <div class="card"><h3>تمرين</h3><div class="ex"><div class="q">${esc(ex.q)}</div><div class="ans"><input class="input" id="urgeAns" inputmode="numeric" placeholder="الجواب"><button class="btn pri" data-a="urgeAnswer">تحقق</button></div><div class="fb" id="urgeFb"></div></div></div>
    <div class="card"><h3>ما السبب؟</h3>${chipsHtml('ur', ['ملل', 'وحدة', 'تعب', 'توتر', 'ليل وسرير', 'الهاتف', 'أخرى'].map(x => [x, x]), R.urge.reason || '')}</div>
    <div class="btns"><button class="btn ok press" data-a="urgeDone" data-ok="1">${ic('check')} مرّت الرغبة</button><button class="btn press" data-a="urgeDone" data-ok="0">انتكست</button></div>` };
};
function randomNumEx() { const all = []; Object.values(LESSONS).flat().forEach(l => l.ex.forEach(e => e.t === 'num' && all.push(e))); return pick(all); }

// ================= نموذج المهمة والإضافات =================
function taskFormHtml(t = {}, isRoutine) {
  return `<label class="field"><span>اسم المهمة</span><input class="input" name="name" value="${esc(t.name || '')}" required></label>
  <div class="two"><label class="field"><span>من</span><input class="input" type="time" name="start" value="${t.start || '09:00'}" required></label><label class="field"><span>إلى</span><input class="input" type="time" name="end" value="${t.end || '10:00'}" required></label></div>
  ${isRoutine ? `<div class="field"><span>الأيام</span>${chipsHtml('days', WEEK.map(d => [d, DOW_S[d]]), t.days || [0, 1, 2, 3, 4, 5, 6], 'checkbox')}</div>` : ''}
  <div class="two"><label class="field"><span>النوع</span><select class="input" name="cat">${Object.entries(CATS).map(([k, l]) => `<option value="${k}" ${(t.cat || 'other') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
  <label class="field"><span>الأهمية (الوزن)</span><select class="input" name="w">${[1, 2, 3].map(w => `<option value="${w}" ${(t.w || 2) == w ? 'selected' : ''}>${W_LBL[w]}</option>`).join('')}</select></label></div>
  <label class="field"><span>المادة المرتبطة</span><select class="input" name="subject"><option value="">بلا</option>${S.subjects.map(s => `<option value="${s.id}" ${t.subject === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
  ${isRoutine ? `<label class="field"><span>التذكيرات (دقائق من البداية، والسالب قبلها)</span><input class="input ltr" style="display:block" name="al" value="${(t.al || []).join(', ')}" placeholder="0, 10, 20"></label>` : ''}`;
}
function readTask(fd, isRoutine) {
  const t = { name: fd.get('name').trim(), start: fd.get('start'), end: fd.get('end'), cat: fd.get('cat'), w: +fd.get('w') };
  if (fd.get('subject')) t.subject = fd.get('subject');
  if (isRoutine) { t.days = fd.getAll('days').map(Number); t.al = String(fd.get('al') || '').split(/[,،\s]+/).map(x => parseInt(normDigits(x))).filter(x => !isNaN(x)); }
  return t;
}

// ================= الإجراءات =================
const A = {
  back, closeSheet: () => closeSheet(),
  tab: d => setTab(d.t),
  theme: () => { S.settings.theme = isDark() ? 'light' : 'dark'; applyTheme(); save(); render(); },
  dayShift: d => { const n = +d.n; R.day = n === 0 ? null : addDays(R.day || logicalToday(), n); if (R.day === logicalToday()) R.day = null; render(); },
  done: d => {
    const date = R.day || logicalToday(), e = (S.log[date] || {})[d.id];
    if (e?.s === 'done') { setLog(date, d.id, null); render(); return; }
    setLog(date, d.id, { s: 'done', t: Date.now() }); render(); toast(pick(CHEERS), 'ok'); checkDayComplete(date);
  },
  miss: d => {
    const date = R.day || logicalToday(), e = (S.log[date] || {})[d.id];
    if (e?.s === 'miss') { setLog(date, d.id, null); render(); return; }
    const reasons = ['تعب', 'نسيت', 'المهمة صعبة', 'وقت غير كافٍ', ...(quitOn() ? ['رغبة أو انتكاسة'] : []), 'مرض أو عذر', 'سبب آخر'];
    sheet('لماذا لم تُنجزها؟', `<form data-f="saveMiss" data-id="${d.id}" data-date="${date}">${chipsHtml('r', reasons.map(r => [r, r]), '')}<label class="field" style="margin-top:12px"><span>تفاصيل (اختياري)</span><input class="input" name="note" placeholder="ما الذي حدث؟"></label><div class="note">«مرض أو عذر» لا يُحسب ضدك في النسبة.</div><button class="btn pri block" style="margin-top:12px">حفظ</button></form>`);
  },
  toggleDaily: d => { const date = R.day || logicalToday(); const on = (S.log[date] || {})[d.id]?.s === 'done'; setLog(date, d.id, on ? null : { s: 'done', t: Date.now() }); render(); if (!on) checkDayComplete(date); },
  openTask: d => {
    const date = R.day || logicalToday(); const t = [...dayTasks(date)].find(x => x.id === d.id); if (!t) return;
    if (t.cat === 'sport') return go('workout');
    if (t.subject && (t.cat === 'study' || t.cat === 'exam')) return go('subject', { id: t.subject });
    if (t.cat === 'sleep') return go('project', { id: 'health' });
    if (t.src === 'r') return A.editRoutine({ id: t.id });
    if (t.src === 'x') sheet('تعديل المهمة', `<form data-f="saveExtra" data-id="${t.id}" data-date="${date}">${taskFormHtml(t)}<div class="btns"><button type="button" class="btn bad" data-a="delExtra" data-id="${t.id}" data-date="${date}">حذف</button><button class="btn pri">حفظ</button></div></form>`);
  },
  addExtra: () => {
    const date = R.day || logicalToday(); const s = findSlot(date, 60) ?? 600;
    sheet('مهمة لهذا اليوم', `<form data-f="saveExtra" data-date="${date}">${taskFormHtml({ start: fromMin(s), end: fromMin(s + 60), cat: 'other' })}<div class="note">اقترحت لك أول وقت فارغ في يومك.</div><button class="btn pri block" style="margin-top:12px">إضافة</button></form>`);
  },
  delExtra: d => { S.extra[d.date] = (S.extra[d.date] || []).filter(x => x.id !== d.id); save(); closeSheet(); render(); },
  addRoutine: () => sheet('إضافة إلى الروتين', `<form data-f="saveRoutine">${taskFormHtml({ start: '15:00', end: '16:00', cat: 'study', al: [-5] }, true)}<button class="btn pri block">إضافة</button></form>`),
  editRoutine: d => { const r = S.routine.find(x => x.id === d.id); if (!r) return; sheet('تعديل', `<form data-f="saveRoutine" data-id="${r.id}">${taskFormHtml(r, true)}<div class="btns"><button type="button" class="btn bad" data-a="delRoutine" data-id="${r.id}">حذف</button><button class="btn pri">حفظ</button></div></form>`); },
  delRoutine: async d => { if (!(await ask('حذف هذه المهمة من الروتين؟', 'حذف'))) return; S.routine = S.routine.filter(x => x.id !== d.id); save(); closeSheet(); render(); },
  planDay: d => { R.planWd = +d.d; render(); },
  addExam: () => sheet('اختبار جديد', `<form data-f="saveExam"><label class="field"><span>المادة</span><select class="input" name="subject">${S.subjects.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label><label class="field"><span>اسم الاختبار</span><input class="input" name="name" placeholder="الاختبار النصفي" required></label><label class="field"><span>التاريخ</span><input class="input" type="date" name="date" required min="${addDays(logicalToday(), 1)}"></label><div class="two"><label class="field"><span>أيام المراجعة قبله</span><input class="input" name="before" type="number" value="5" min="1" max="30"></label><label class="field"><span>دقائق يومياً</span><input class="input" name="mins" type="number" value="60" min="15" step="15"></label></div><div class="note">توزَّع المراجعة تلقائياً في أول وقت فارغ من كل يوم، وتتغير تلقائياً إن غيّرت جدولك.</div><button class="btn pri block" style="margin-top:12px">حفظ</button></form>`),
  delExam: d => { S.exams = S.exams.filter(x => x.id !== d.id); save(); render(); },
  // الدروس
  addSubject: () => sheet('مادة جديدة', `<form data-f="saveSubject"><label class="field"><span>اسم المادة</span><input class="input" name="name" required placeholder="الفرنسية"></label><label class="field"><span>الرمز (حتى 4 أحرف)</span><input class="input" name="sym" maxlength="4" placeholder="Fr"></label><div class="field"><span>اللون</span>${colorChips('violet')}</div><button class="btn pri block">إضافة</button></form>`),
  delSubject: async d => { if (!(await ask('حذف المادة وأهدافها ومراجعها؟', 'حذف'))) return; S.subjects = S.subjects.filter(x => x.id !== d.id); S.routine.forEach(r => { if (r.subject === d.id) delete r.subject; }); save(); back(); },
  openSubject: d => go('subject', { id: d.id }),
  subTab: d => { R.sub[d.k] = d.v; render(); },
  openLesson: d => { S.lastLesson = { s: d.s, l: d.l }; save(); if (d.review) delete R.ls[d.l]; R.ls[d.l] = R.ls[d.l] && !d.review ? R.ls[d.l] : { ans: {}, review: !!d.review }; go('lesson', { s: d.s, l: d.l, review: !!d.review }); },
  goReview: () => go('review'),
  answerChoice: d => { const l = findLesson(d.l), e = l.ex[d.i], st = R.ls[d.l], a = st.ans[d.i] ||= { tries: 0 }; if (a.ok) return; a.tries++; if (+d.j === e.a) { a.ok = true; delete a.wrong; } else a.wrong = +d.j; afterAnswer(l, st); },
  answerText: d => {
    const l = findLesson(d.l), e = l.ex[d.i], st = R.ls[d.l], a = st.ans[d.i] ||= { tries: 0 }; const val = $('#ans-' + d.i).value; if (!val.trim()) return toast('اكتب جوابك أولاً');
    a.val = val; a.tries++;
    if (e.t === 'factors') { const got = normDigits(val).split(/[^0-9]+/).filter(Boolean).map(Number).sort((x, y) => x - y); a.ok = got.join(',') === e.a.slice().sort((x, y) => x - y).join(','); }
    else a.ok = e.a.includes(normDigits(val).replace(/[\s,]/g, ''));
    afterAnswer(l, st);
  },
  // المشاريع
  newProject: () => sheet('مشروع جديد', projectForm()),
  editProject: d => { const p = S.projects.find(x => x.id === d.id); sheet('تعديل المشروع', `<form data-f="saveProjectEdit" data-id="${p.id}"><label class="field"><span>الاسم</span><input class="input" name="name" value="${esc(p.name)}" required></label><label class="field"><span>الوصف</span><input class="input" name="desc" value="${esc(p.desc || '')}"></label>${p.sym.startsWith('i:') ? '' : `<label class="field"><span>الرمز</span><input class="input" name="sym" maxlength="4" value="${esc(p.sym)}"></label>`}<div class="field"><span>اللون</span>${colorChips(p.color)}</div><button class="btn pri block">حفظ</button></form>`); },
  openProject: d => go('project', { id: d.id }),
  delProject: async d => { if (!(await ask('حذف المشروع بكل بياناته؟', 'حذف'))) return; S.projects = S.projects.filter(x => x.id !== d.id); save(); back(); },
  cardPrio: d => { const c = S.projects.find(x => x.id === d.p).cards[d.i]; c.prio = { high: 'mid', mid: 'low', low: 'high' }[c.prio]; save(); render(); },
  cardMenu: d => { const p = S.projects.find(x => x.id === d.p), c = p.cards[d.i];
    sheet(CARD_T[c.type], `${PCT_ABLE.includes(c.type) ? sw('احسب نسبتها ضمن المشروع', `data-c="cardPct" data-p="${p.id}" data-i="${d.i}"`, c.pct) : '<div class="note">هذه البطاقة لا تدخل في نسبة المشروع.</div>'}
    <div class="field" style="margin-top:10px"><span>الأولوية</span>${chipsHtml('prio-' + d.i, Object.entries(PRIO_LBL), c.prio).replace(/<input /g, `<input data-c="cardPrioSet" data-p="${p.id}" data-i="${d.i}" `)}</div>
    <div class="btns"><button class="btn" data-a="cardMove" data-p="${p.id}" data-i="${d.i}" data-n="-1">${ic('up')} للأعلى</button><button class="btn" data-a="cardMove" data-p="${p.id}" data-i="${d.i}" data-n="1">${ic('down')} للأسفل</button></div>
    <button class="btn bad block" style="margin-top:10px" data-a="cardRemove" data-p="${p.id}" data-i="${d.i}">إزالة البطاقة</button>`); },
  cardMove: d => { const p = S.projects.find(x => x.id === d.p), i = +d.i, j = i + +d.n; if (j < 0 || j >= p.cards.length) return; [p.cards[i], p.cards[j]] = [p.cards[j], p.cards[i]]; save(); closeSheet(); render(); },
  cardRemove: d => { const p = S.projects.find(x => x.id === d.p); p.cards.splice(+d.i, 1); save(); closeSheet(); render(); },
  addCard: d => { const p = S.projects.find(x => x.id === d.p); const miss = Object.keys(CARD_T).filter(t => !p.cards.some(c => c.type === t) && (p.id === 'health' || !['daily', 'workout', 'meals', 'sleep'].includes(t)));
    sheet('أضف بطاقة', miss.map(t => `<button class="list-row press" style="width:100%;text-align:right" data-a="addCardType" data-p="${p.id}" data-t="${t}">${ic('plus')}<span class="grow">${CARD_T[t]}</span></button>`).join('')); },
  addCardType: d => { const p = S.projects.find(x => x.id === d.p); p.cards.push(card(d.t, 'mid', PCT_ABLE.includes(d.t))); if (d.t === 'daily') p.daily ||= []; save(); closeSheet(); render(); },
  toggleGoal: d => { const o = ownerOf(d.k, d.o), g = o.goals.find(x => x.id === d.id); g.done = !g.done; save(); render(); if (g.done) { toast(pick(CHEERS), 'ok'); celebrateIfComplete(d.k, o); } },
  goalWeight: d => { const g = ownerOf(d.k, d.o).goals.find(x => x.id === d.id); g.w = g.w % 3 + 1; save(); render(); },
  delGoal: d => { const o = ownerOf(d.k, d.o); o.goals = o.goals.filter(x => x.id !== d.id); save(); render(); },
  scheduleGoal: d => { const p = S.projects.find(x => x.id === d.o), g = p.goals.find(x => x.id === d.id);
    for (let i = 1; i <= 14; i++) { const date = addDays(logicalToday(), i), s = findSlot(date, 60); if (s != null) { (S.extra[date] ||= []).push({ id: uid(), name: g.t, start: fromMin(s), end: fromMin(s + 60), cat: 'project', w: 2, project: p.id }); save(); toast(`جُدول في ${DOW[parseYmd(date).getDay()]} ${fromMin(s)}`, 'ok'); return; } }
    toast('لم أجد وقتاً فارغاً في الأسبوعين القادمين', 'bad'); },
  toggleMs: d => { const m = S.projects.find(x => x.id === d.p).milestones.find(x => x.id === d.id); m.done = !m.done; save(); render(); if (m.done) toast(pick(CHEERS), 'ok'); },
  delMs: d => { const p = S.projects.find(x => x.id === d.p); p.milestones = p.milestones.filter(x => x.id !== d.id); save(); render(); },
  delMoney: d => { const m = S.projects.find(x => x.id === d.p).money; m[d.key] = m[d.key].filter(x => x.id !== d.id); save(); render(); },
  addPartner: d => { const m = S.projects.find(x => x.id === d.p).money; m.partners.push({ id: uid(), name: 'شريك ' + (m.partners.length + 1), share: 0 }); equalize(m); save(); render(); },
  delPartner: d => { const m = S.projects.find(x => x.id === d.p).money; m.partners = m.partners.filter(x => x.id !== d.id); equalize(m); save(); render(); },
  equalSplit: d => { equalize(S.projects.find(x => x.id === d.p).money); save(); render(); },
  delDaily: d => { const p = S.projects.find(x => x.id === d.p); p.daily = p.daily.filter(x => x.id !== d.id); save(); render(); },
  toggleMeal: d => { const t = logicalToday(); const m = S.health.meals[t] ||= {}; m[d.k] = !m[d.k]; save(); render(); },
  // المراجع
  addLink: d => sheet('رابط جديد', `<form data-f="saveLink" data-k="${d.k}" data-o="${d.o}"><label class="field"><span>العنوان</span><input class="input" name="title" required placeholder="شرح الأعداد الأولية"></label><label class="field"><span>الرابط</span><input class="input ltr" style="display:block" name="url" type="url" required placeholder="https://"></label>${sw('فيديو', 'name="video"', true)}<div class="note">فيديو يوتيوب نزّلته من زر التنزيل داخل تطبيق يوتيوب يعمل دون إنترنت عند فتحه من هنا.</div><button class="btn pri block" style="margin-top:12px">حفظ</button></form>`),
  openRef: async d => {
    const o = ownerOf(d.k, d.o), r = o.refs.find(x => x.id === d.id); if (!r) return;
    if (r.type === 'link') return window.open(r.url, '_blank', 'noopener');
    const f = await idbDo('files', 'readonly', s => s.get(r.fileId)); if (!f) return toast('الملف غير موجود على هذا الجهاز', 'bad');
    const url = URL.createObjectURL(f.blob), v = document.createElement('div'); v.className = 'viewer';
    const isPdf = r.mime?.includes('pdf'), isVid = r.mime?.startsWith('video'), isAud = r.mime?.startsWith('audio');
    v.innerHTML = `<header><button class="icon-btn press" data-a="closeViewer" aria-label="إغلاق">${ic('x')}</button><b class="grow" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.title)}</b>${isPdf ? `<label class="row" style="gap:6px"><small>وصلت ص</small><input class="input" style="width:72px;min-height:40px;text-align:center" inputmode="numeric" value="${r.page || 1}" data-c="refPage" data-k="${d.k}" data-o="${d.o}" data-id="${r.id}"></label><a class="icon-btn" href="${url}" target="_blank" aria-label="فتح">${ic('back')}</a>` : ''}</header>
      ${isPdf ? `<iframe src="${url}#page=${r.page || 1}" title="${esc(r.title)}"></iframe>` : isVid ? `<video src="${url}" controls playsinline></video>` : isAud ? `<audio src="${url}" controls style="margin:20px"></audio>` : `<img src="${url}" alt="${esc(r.title)}">`}`;
    v.dataset.url = url; document.body.append(v);
  },
  closeViewer: () => { const v = $('.viewer'); if (v) { URL.revokeObjectURL(v.dataset.url); v.remove(); render(); } },
  delRef: async d => { if (!(await ask('حذف هذا المرجع؟', 'حذف'))) return; const o = ownerOf(d.k, d.o), r = o.refs.find(x => x.id === d.id); if (r?.fileId) await idbDo('files', 'readwrite', s => s.delete(r.fileId)); o.refs.splice(o.refs.indexOf(r), 1); save(); render(); },
  confirmFile: async () => { const f = R.pendingFile; if (!f) return; closeSheet(); const id = uid(); await idbDo('files', 'readwrite', s => s.put({ id, acc: ACC, blob: f.file, name: f.file.name })); ownerOf(f.k, f.o).refs.push({ id: uid(), type: 'file', fileId: id, title: f.file.name.replace(/\.[^.]+$/, ''), size: f.file.size, mime: f.file.type, page: 1 }); R.pendingFile = null; save(); render(); toast('أُضيف الملف', 'ok'); },
  libFilter: d => { R.sub.lib = d.v; render(); },
  // الصحة
  goWorkout: () => go('workout'), goHealth: () => go('project', { id: 'health' }),
  exHelp: d => { const e = EXERCISES[d.id]; sheet(e.n, `<p class="muted" style="margin-top:0">العضلات: ${e.m}</p><h3>الخطوات</h3>${e.steps.map((s, i) => `<div class="list-row"><span class="tag pri">${i + 1}</span><span class="grow">${s}</span></div>`).join('')}<h3 style="margin-top:12px">أخطاء شائعة</h3>${e.err.map(s => `<div class="list-row">${ic('x', 'bad-tx')}<span class="grow">${s}</span></div>`).join('')}<div class="two" style="margin-top:12px"><div class="note"><b>أسهل:</b> ${e.easy}</div><div class="note"><b>أصعب:</b> ${e.hard}</div></div><div class="note">توقف إن شعرت بألم حاد، واستشر مختصاً.</div>`); },
  logSet: d => { const e = EXERCISES[d.id], t = logicalToday(), ses = S.health.sessions[t] ||= { sets: {} }, cur0 = (ses.sets[d.id] || [])[d.i];
    const def = cur0 ?? (ses.sets[d.id]?.[d.i - 1] ?? e.reps[0]);
    sheet(`${e.n} · المجموعة ${+d.i + 1}`, `<form data-f="saveSet" data-id="${d.id}" data-i="${d.i}"><label class="field"><span>كم ${e.unit === 'ث' ? 'ثانية' : 'تكراراً'} أنجزت؟</span><input class="input" style="font-size:28px;text-align:center;font-weight:900" name="n" inputmode="numeric" value="${def}" required></label>${chipsHtml('q', Array.from({ length: 5 }, (_, i) => Math.round(e.reps[0] + (e.reps[1] - e.reps[0]) * i / 4)).map(n => [n, n]), '').replace(/<input /g, '<input data-c="setQuick" ')}<div class="btns">${cur0 != null ? '<button type="button" class="btn bad" data-a="clearSet" data-id="' + d.id + '" data-i="' + d.i + '">مسح</button>' : ''}<button class="btn pri">حفظ وابدأ الراحة</button></div></form>`); },
  clearSet: d => { const ses = S.health.sessions[logicalToday()]; ses.sets[d.id][d.i] = null; ses.sets[d.id] = ses.sets[d.id].filter((x, i, a) => i < a.length - 1 || x != null); save(); closeSheet(); render(); },
  skipRest: () => { R.rest = null; $('#restBar')?.remove(); },
  finishWorkout: () => { const t = logicalToday(), ses = S.health.sessions[t] ||= { sets: {} }; if (ses.done) return; ses.done = true;
    const sp = S.routine.find(r => r.cat === 'sport' && r.days.includes(parseYmd(t).getDay())); if (sp) setLog(t, sp.id, { s: 'done', t: Date.now() });
    save(); R.rest = null; render(); confetti(); toast('حصة منجزة! جسمك يشكرك', 'ok'); checkDayComplete(t); },
  // عاداتي
  goQuit: () => go('quit'), goUrge: () => { R.urge = null; go('urge'); },
  urgeStep: d => { R.urge.steps[d.i] = !R.urge.steps[d.i]; render(); },
  urgeAnswer: () => { const v = normDigits($('#urgeAns').value).trim(), ok = R.urge.ex.a.includes(v); $('#urgeFb').innerHTML = ok ? `<span class="ok-tx">صحيح! ذهنك معك</span>` : `<span class="bad-tx">حاول مرة أخرى${R.urge.ex.h ? ' · ' + esc(R.urge.ex.h) : ''}</span>`; if (ok) { R.urge.ex = randomNumEx(); R.urge.steps[4] = true; setTimeout(render, 900); } },
  urgeDone: d => {
    const reason = $('input[name=ur]:checked')?.value || 'غير محدد', t = logicalToday();
    S.quit.urges.push({ date: t, time: fromMin(nowMin()), reason, ok: d.ok === '1', mins: Math.round((Date.now() - R.urge.start) / 60000) });
    save(); R.urge = null;
    if (d.ok === '1') { back(); toast('أحسنت! تجاوزت موجة كاملة', 'ok'); confetti(); } else { back(); A.relapse({ reason }); }
  },
  relapse: d => sheet('تسجيل انتكاسة', `<form data-f="saveRelapse"><p class="muted" style="margin-top:0">لا لوم. الانتكاس معلومة تساعدنا على تعديل الخطة.</p><div class="field"><span>السبب</span>${chipsHtml('reason', ['ملل', 'وحدة', 'تعب', 'توتر', 'ليل وسرير', 'الهاتف', 'أخرى'].map(x => [x, x]), d?.reason || '')}</div><label class="field"><span>ما الذي سأغيّره؟</span><input class="input" name="note" placeholder="مثلاً: الشاحن خارج الغرفة"></label><button class="btn pri block">حفظ وابدأ من جديد</button></form>`),
  // عام
  goLibrary: () => go('library'), goStats: () => go('stats'), goSettings: () => go('settings'),
  logout: async () => { if (await ask('تسجيل الخروج؟ ستحتاج كلمة السر للدخول.', 'خروج')) logout(); },
  changePw: () => sheet('تغيير كلمة السر', `<form data-f="savePw"><label class="field"><span>كلمة السر الحالية</span><input class="input" type="password" name="old" required></label><label class="field"><span>الجديدة</span><input class="input" type="password" name="n1" required minlength="6"></label><label class="field"><span>تأكيد الجديدة</span><input class="input" type="password" name="n2" required></label><div class="err" id="pwErr"></div><button class="btn pri block">حفظ</button></form>`),
  exportBackup: async () => { await persist(); const data = { app: 'masar', v: 1, id: ACC, acc: accounts()[ACC], data: localStorage.getItem('masar.d.' + ACC), at: new Date().toISOString() };
    download(`masar-backup-${logicalToday()}.json`, JSON.stringify(data), 'application/json'); S.settings.lastBackup = logicalToday(); save(); toast('احفظ الملف في «الملفات»', 'ok'); if (cur().v === 'today') render(); },
  exportIcs: () => { download('masar-reminders.ics', buildIcs(), 'text/calendar'); sheet('التذكيرات', `<div class="note" style="margin-top:0">افتح الملف من التنزيلات واختر «إضافة الكل» ليضيف الآيفون التنبيهات إلى التقويم، فتصلك حتى والتطبيق مغلق ودون إنترنت.</div><div class="note">لنغمة هادئة: الإعدادات ← الأصوات ← تنبيهات التقويم.</div><div class="note">إن غيّرت أوقاتك، احذف تقويم «${esc(S.settings.appName)}» القديم ثم صدّر من جديد.</div>`); },
  wipe: async () => { if (!(await ask('سيُحذف حسابك وكل بياناته من هذا الجهاز نهائياً.', 'حذف نهائي', 'احذف'))) return; const acc = accounts(); delete acc[ACC]; setAccounts(acc); localStorage.removeItem('masar.d.' + ACC); const id = ACC; S = null; await idbDo('kv', 'readwrite', s => s.delete('session')); const all = await idbDo('files', 'readonly', s => s.getAll()); for (const f of all || []) if (f.acc === id) await idbDo('files', 'readwrite', s => s.delete(f.id)); DEK = null; ACC = null; showAuth(Object.keys(accounts()).length ? 'login' : 'signup'); },
  authMode: d => showAuth(d.m)
};
function findLesson(id) { return Object.values(LESSONS).flat().find(l => l.id === id); }
function afterAnswer(l, st) {
  render();
  if (l.ex.every((_, i) => st.ans[i]?.ok) && !st.finished) {
    st.finished = true; const s = S.subjects.find(x => (LESSONS[x.lessons] || []).includes(l)); const score = l.ex.filter((_, i) => st.ans[i].tries === 1).length;
    const today = logicalToday(), STEPS = [1, 3, 7, 16, 35];
    if (st.review) { const r = s.review[l.id] ||= { step: 0 }; r.step = score >= l.ex.length * .8 ? Math.min(r.step + 1, STEPS.length - 1) : 0; r.next = addDays(today, STEPS[r.step]); toast(score >= l.ex.length * .8 ? 'مراجعة ممتازة، تُعاد بعد ' + STEPS[r.step] + ' أيام' : 'نعيدها قريباً لتثبت', 'ok'); }
    else { s.done[l.id] = { date: today, score: Math.max(score, s.done[l.id]?.score || 0) }; s.review[l.id] ||= { step: 0, next: addDays(today, 1) }; toast(`أنهيت الدرس: ${score} من ${l.ex.length} من أول محاولة`, 'ok'); }
    save(); confetti(); setTimeout(render, 50);
  }
}
function celebrateIfComplete(k, o) { if (k === 'p' && projectPct(o) === 100 && !S.cele['p:' + o.id]) { S.cele['p:' + o.id] = 1; save(); confetti(); toast('اكتمل المشروع 100%!', 'ok'); } }
function equalize(m) { const n = m.partners.length; if (!n) return; m.partners.forEach(p => p.share = 100 / n); }
function projectForm() {
  const types = [['goals', 'الأهداف', 1], ['milestones', 'الخطط والمراحل', 0], ['money', 'المال', 0], ['refs', 'المراجع', 0], ['notes', 'ملاحظات', 0], ['deadline', 'الموعد النهائي', 0]];
  return `<form data-f="saveProject"><label class="field"><span>اسم المشروع</span><input class="input" name="name" required></label><label class="field"><span>وصف قصير</span><input class="input" name="desc"></label>
  <div class="two"><label class="field"><span>الرمز</span><input class="input" name="sym" maxlength="4" placeholder="Ms"></label><label class="field"><span>البدء</span><input class="input" type="date" name="start" value="${logicalToday()}"></label></div>
  <div class="field"><span>اللون</span>${colorChips('indigo')}</div>
  <div class="field"><span>البطاقات</span>${chipsHtml('cards', types.map(([v, l]) => [v, l]), types.filter(t => t[2]).map(t => t[0]), 'checkbox').replace('value="money"', 'value="money" data-c="toggleMoneyFields"')}</div>
  <div id="moneyFields" hidden class="card" style="background:var(--card2)"><div class="two"><label class="field"><span>التكاليف</span><input class="input" name="cost" inputmode="decimal" placeholder="0"></label><label class="field"><span>الأرباح</span><input class="input" name="rev" inputmode="decimal" placeholder="0"></label></div>
  <label class="field"><span>عدد الشركاء (معك)</span><input class="input" name="partners" type="number" min="1" value="1"></label>${sw('اخصم التكاليف من الأرباح', 'name="deduct"', true)}${sw('قسّم الأرباح على الشركاء', 'name="split"', false)}</div>
  ${sw('أضف أهدافاً أولى مقترحة', 'name="suggest"', true)}<button class="btn pri block" style="margin-top:10px">إنشاء المشروع</button></form>`;
}
function download(name, content, type) { const b = new Blob([content], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
function buildIcs() {
  const today = logicalToday(), stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const BY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const fold = line => { const out = []; let cur = '', len = 0; for (const ch of line) { const l = enc.encode(ch).length; if (len + l > 73) { out.push(cur); cur = ' '; len = 1; } cur += ch; len += l; } out.push(cur); return out.join('\r\n'); };
  const escT = s => String(s).replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const dt = (date, hm) => date.replace(/-/g, '') + 'T' + hm.replace(':', '') + '00';
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Masar//AR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:' + escT(S.settings.appName)];
  for (const r of S.routine) {
    if (!r.al?.length || !r.days.length) continue;
    const endDate = toMin(r.end) <= toMin(r.start) ? addDays(today, 1) : today;
    L.push('BEGIN:VEVENT', 'UID:' + r.id + '@masar', 'DTSTAMP:' + stamp, 'DTSTART:' + dt(today, r.start), 'DTEND:' + dt(endDate, r.end), 'RRULE:FREQ=WEEKLY;BYDAY=' + r.days.map(d => BY[d]).join(','), 'SUMMARY:' + escT(r.name), 'TRANSP:TRANSPARENT');
    for (const a of r.al) L.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + escT(r.name), 'TRIGGER:' + (a < 0 ? '-' : '') + 'PT' + Math.abs(a) + 'M', 'END:VALARM');
    L.push('END:VEVENT');
  }
  for (const e of S.exams) { const sub = S.subjects.find(s => s.id === e.subject); L.push('BEGIN:VEVENT', 'UID:exam-' + e.id + '@masar', 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + e.date.replace(/-/g, ''), 'SUMMARY:' + escT('اختبار ' + e.name + ' · ' + (sub?.name || '')), 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + escT('اختبار ' + e.name), 'TRIGGER:-PT12H', 'END:VALARM', 'END:VEVENT'); }
  L.push('END:VCALENDAR'); return L.map(fold).join('\r\n') + '\r\n';
}

// ================= النماذج =================
const F = {
  saveMiss: (fd, f) => { const r = fd.get('r'); if (!r) return toast('اختر سبباً'); const note = fd.get('note').trim(); setLog(f.dataset.date, f.dataset.id, { s: 'miss', r: note ? `${r}: ${note}` : r, ex: r === 'مرض أو عذر', t: Date.now() }); closeSheet(); render(); toast(pick(MISS_MSG)); if (r === 'رغبة أو انتكاسة' && quitOn()) setTimeout(() => go('quit'), 600); checkDayComplete(f.dataset.date); },
  saveExtra: (fd, f) => { const t = readTask(fd), date = f.dataset.date, list = S.extra[date] ||= []; if (f.dataset.id) Object.assign(list.find(x => x.id === f.dataset.id), t); else list.push({ id: uid(), ...t }); save(); closeSheet(); render(); },
  saveRoutine: (fd, f) => { const t = readTask(fd, true); if (!t.days.length) return toast('اختر يوماً واحداً على الأقل'); if (f.dataset.id) { const r = S.routine.find(x => x.id === f.dataset.id); Object.assign(r, t); if (!fd.get('subject')) delete r.subject; } else S.routine.push({ id: uid(), ...t }); save(); closeSheet(); render(); toast('حُفظ. صدّر التذكيرات من جديد إن تغيّرت الأوقات'); },
  saveExam: fd => { S.exams.push({ id: uid(), subject: fd.get('subject'), name: fd.get('name').trim(), date: fd.get('date'), before: Math.max(1, +fd.get('before') || 5), mins: Math.max(15, +fd.get('mins') || 60) }); save(); closeSheet(); render(); toast('وُزّعت المراجعة على الأيام السابقة', 'ok'); },
  saveSubject: fd => { const name = fd.get('name').trim(); S.subjects.push({ id: uid(), name, sym: fd.get('sym').trim() || name[0], color: fd.get('color') || 'violet', lessons: null, goals: [], refs: [], done: {}, review: {} }); save(); closeSheet(); render(); },
  addGoal: (fd, f) => { const o = ownerOf(f.dataset.k, f.dataset.o); const before = f.dataset.k === 'p' ? projectPct(o) : subjectPct(o); o.goals.push({ id: uid(), t: fd.get('t').trim(), w: +fd.get('w'), done: false }); save(); const after = f.dataset.k === 'p' ? projectPct(o) : subjectPct(o); render(); if (before != null && before !== after) toast(`كانت ${before}% وصارت ${after}% بعد إضافة الهدف`); },
  addMs: (fd, f) => { S.projects.find(x => x.id === f.dataset.p).milestones.push({ id: uid(), t: fd.get('t').trim(), date: fd.get('date') || '', done: false }); save(); render(); },
  addMoney: (fd, f) => { const amt = num(fd.get('amt')); if (!amt) return toast('اكتب مبلغاً صحيحاً'); S.projects.find(x => x.id === f.dataset.p).money[f.dataset.key].push({ id: uid(), t: fd.get('t').trim(), amt }); save(); render(); },
  addDaily: (fd, f) => { S.projects.find(x => x.id === f.dataset.p).daily.push({ id: uid(), t: fd.get('t').trim() }); save(); render(); },
  saveProject: fd => {
    const name = fd.get('name').trim(), cards = fd.getAll('cards'); if (!cards.length) cards.push('goals');
    const p = { id: uid(), name, desc: fd.get('desc').trim(), sym: fd.get('sym').trim() || name.slice(0, 2), color: fd.get('color') || 'indigo', start: fd.get('start'), due: '', cards: cards.map((t, i) => card(t, i === 0 ? 'high' : 'mid', PCT_ABLE.includes(t))), goals: [], milestones: [], money: defaultMoney(), notes: '', refs: [] };
    if (cards.includes('money')) { const m = p.money, c = num(fd.get('cost')), r = num(fd.get('rev')), n = Math.max(1, parseInt(fd.get('partners')) || 1); if (c) m.costs.push({ id: uid(), t: 'تكاليف أولية', amt: c }); if (r) m.rev.push({ id: uid(), t: 'أرباح', amt: r }); m.deduct = !!fd.get('deduct'); m.split = !!fd.get('split') || n > 1; m.partners = [{ id: uid(), name: 'أنا', share: 100, me: true }]; for (let i = 2; i <= n; i++) m.partners.push({ id: uid(), name: 'شريك ' + i, share: 0 }); equalize(m); }
    if (fd.get('suggest') && cards.includes('goals')) p.goals = ['تحديد نطاق المشروع وما سيُنجز', 'إنجاز أول نسخة أو خطوة ملموسة', 'مراجعة النتيجة وتحديد التالي'].map((t, i) => ({ id: uid(), t, w: i === 1 ? 3 : 2, done: false }));
    S.projects.push(p); save(); closeSheet(); go('project', { id: p.id }); toast('أُنشئ المشروع ونُظّمت بطاقاته', 'ok');
  },
  saveProjectEdit: (fd, f) => { const p = S.projects.find(x => x.id === f.dataset.id); p.name = fd.get('name').trim(); p.desc = fd.get('desc').trim(); if (fd.has('sym')) p.sym = fd.get('sym').trim() || p.sym; p.color = fd.get('color') || p.color; save(); closeSheet(); render(); },
  saveLink: (fd, f) => { let url = fd.get('url').trim(); if (!/^https?:\/\//i.test(url)) return toast('الرابط يجب أن يبدأ بـ https://', 'bad'); ownerOf(f.dataset.k, f.dataset.o).refs.push({ id: uid(), type: 'link', title: fd.get('title').trim(), url, video: !!fd.get('video') }); save(); closeSheet(); render(); },
  saveSleep: fd => { const t = logicalToday(); S.health.sleep[t] = { bed: fd.get('bed'), wake: fd.get('wake'), q: +fd.get('q') || 3 }; save(); render(); const h = durMin(fd.get('bed'), fd.get('wake')) / 60; toast(h >= 7 ? `نمت ${h.toFixed(1)} ساعة، ممتاز` : `نمت ${h.toFixed(1)} ساعة. حاول النوم أبكر الليلة`, h >= 7 ? 'ok' : ''); },
  saveSet: (fd, f) => { const n = parseInt(normDigits(fd.get('n'))); if (!(n >= 0)) return toast('اكتب رقماً'); const t = logicalToday(), ses = S.health.sessions[t] ||= { sets: {} }, arr = ses.sets[f.dataset.id] ||= []; arr[+f.dataset.i] = n; for (let i = 0; i < arr.length; i++) if (arr[i] === undefined) arr[i] = null; save(); closeSheet(); R.rest = { end: Date.now() + EXERCISES[f.dataset.id].rest * 1000 }; render(); },
  saveRelapse: fd => { const reason = fd.get('reason') || 'غير محدد'; S.quit.relapses.push({ date: logicalToday(), reason, note: fd.get('note').trim() }); Object.keys(S.cele).filter(k => k.startsWith('q:')).forEach(k => delete S.cele[k]); save(); closeSheet(); render(); toast('سُجّل. يوم جديد يبدأ الآن، وأنت أقوى بما عرفته'); },
  savePw: async fd => { if (fd.get('n1') !== fd.get('n2')) { $('#pwErr').textContent = 'كلمتا السر غير متطابقتين'; return; } try { await changePw(fd.get('old'), fd.get('n1')); closeSheet(); toast('تغيّرت كلمة السر', 'ok'); } catch (e) { $('#pwErr').textContent = e.message; } },
  saveSettings: fd => { S.profile.name = fd.get('name').trim(); S.settings.appName = fd.get('appName').trim() || 'مسار'; S.settings.theme = fd.get('theme') || 'auto'; S.settings.currency = fd.get('currency').trim() || 'أوقية'; S.settings.dayStart = +fd.get('dayStart'); if (S.profile.owner) S.profile.quit = !!fd.get('quit'); const acc = accounts(); if (acc[ACC]) { acc[ACC].name = S.profile.name; setAccounts(acc); } applyTheme(); save(); render(); toast('حُفظت الإعدادات', 'ok'); }
};
const C = {
  pickFile: el => { const file = el.files[0]; el.value = ''; if (!file) return; R.pendingFile = { file, k: el.dataset.k, o: el.dataset.o }; sheet('إضافة ملف', `<div class="list-row">${ic('file')}<span class="grow"><b>${esc(file.name)}</b><br><small class="muted">${fmtSize(file.size)}</small></span></div><div class="note">سيُحفظ داخل التطبيق ويأخذ ${fmtSize(file.size)} من مساحة هاتفك، ويعمل دون إنترنت.</div><button class="btn pri block" style="margin-top:12px" data-a="confirmFile">أضف الملف</button>`); },
  moneyFlag: el => { const m = S.projects.find(x => x.id === el.dataset.p).money; m[el.dataset.key] = el.checked; if (el.dataset.key === 'split' && el.checked && !m.partners.length) m.partners = [{ id: uid(), name: 'أنا', share: 100, me: true }]; save(); render(); },
  partner: el => { const x = S.projects.find(p => p.id === el.dataset.p).money.partners.find(p => p.id === el.dataset.id); x[el.dataset.key] = el.dataset.key === 'share' ? num(el.value) : el.value; save(); render(); },
  notes: el => { S.projects.find(x => x.id === el.dataset.p).notes = el.value; save(); },
  due: el => { S.projects.find(x => x.id === el.dataset.p).due = el.value; save(); render(); },
  cardPct: el => { S.projects.find(x => x.id === el.dataset.p).cards[el.dataset.i].pct = el.checked; save(); render(); },
  cardPrioSet: el => { S.projects.find(x => x.id === el.dataset.p).cards[el.dataset.i].prio = el.value; save(); render(); },
  mealTime: el => { S.health.mealTimes[el.dataset.k] = el.value; save(); },
  mealNote: el => { (S.health.meals[logicalToday()] ||= {}).note = el.value; save(); },
  refPage: el => { const r = ownerOf(el.dataset.k, el.dataset.o).refs.find(x => x.id === el.dataset.id); r.page = Math.max(1, parseInt(normDigits(el.value)) || 1); save(); toast('حُفظت الصفحة ' + r.page, 'ok'); },
  setQuick: el => { const i = el.closest('form').querySelector('[name=n]'); if (i) i.value = el.value; },
  toggleMoneyFields: el => { $('#moneyFields').hidden = !el.checked; },
  importBackup: async el => {
    const f = el.files[0]; el.value = ''; if (!f) return;
    try { const o = JSON.parse(await f.text()); if (o.app !== 'masar' || !o.acc || !o.data) throw 0; if (!(await ask('سيُستبدل الحساب المطابق على هذا الجهاز بالنسخة الاحتياطية.', 'استيراد'))) return;
      const acc = accounts(); acc[o.id] = o.acc; setAccounts(acc); localStorage.setItem('masar.d.' + o.id, o.data); toast('استُوردت النسخة. سجّل الدخول بكلمة سرها', 'ok'); await idbDo('kv', 'readwrite', s => s.delete('session')); S = null; DEK = null; showAuth('login');
    } catch { toast('الملف ليس نسخة احتياطية صالحة', 'bad'); }
  }
};

// ================= الدخول =================
function showAuth(mode) {
  $('#app').hidden = true; const a = $('#auth'); a.hidden = false; closeSheet(true); applyTheme();
  const has = Object.keys(accounts()).length; if (mode === 'login' && !has) mode = 'signup';
  const logo = `<img class="auth-wordmark" src="icons/logo.png" alt="MASAR">`;
  const phone = `<label class="field"><span>رقم الهاتف</span><input class="input ltr" style="display:block;text-align:left" name="phone" inputmode="tel" autocomplete="username" required placeholder="22xxxxxx"></label>`;
  const forms = {
    login: `<form data-f="authLogin">${phone}<label class="field"><span>كلمة السر</span><input class="input" type="password" name="pw" autocomplete="current-password" required></label>${sw('تذكرني على هذا الجهاز', 'name="remember"', true)}<div class="err" id="authErr"></div><button class="btn pri block">دخول</button></form><div class="btns" style="justify-content:space-between"><button class="link" data-a="authMode" data-m="recover">نسيت كلمة السر</button><button class="link" data-a="authMode" data-m="signup">حساب جديد</button></div>`,
    signup: `<form data-f="authSignup"><label class="field"><span>الاسم</span><input class="input" name="name" required></label>${phone}<label class="field"><span>كلمة السر (6 أحرف على الأقل)</span><input class="input" type="password" name="pw" autocomplete="new-password" required minlength="6"></label><label class="field"><span>تأكيد كلمة السر</span><input class="input" type="password" name="pw2" required></label><div class="err" id="authErr"></div><button class="btn pri block">إنشاء الحساب</button></form>${has ? '<div class="btns"><button class="link" data-a="authMode" data-m="login">لدي حساب</button></div>' : '<div class="note">بياناتك تبقى على هذا الهاتف فقط ومشفّرة بكلمة سرك.</div>'}`,
    recover: `<form data-f="authRecover">${phone}<label class="field"><span>رمز الاسترجاع</span><input class="input ltr" style="display:block" name="code" required placeholder="XXXX-XXXX-XXXX-XXXX"></label><label class="field"><span>كلمة سر جديدة</span><input class="input" type="password" name="pw" required minlength="6"></label><div class="err" id="authErr"></div><button class="btn pri block">استرجاع</button></form><div class="btns"><button class="link" data-a="authMode" data-m="login">رجوع</button></div>`
  };
  a.innerHTML = `<div class="auth-card">${logo}<p class="sub">${mode === 'signup' ? 'أنشئ حسابك' : mode === 'recover' ? 'استرجاع الحساب' : 'أهلاً بعودتك'}</p><div class="card">${forms[mode]}</div></div>`;
}
const AUTH = {
  authLogin: async fd => { const b = $('#auth button.pri'); b.disabled = true; try { await login(fd.get('phone'), fd.get('pw'), !!fd.get('remember')); enterApp(); } catch (e) { $('#authErr').textContent = e.message; } b.disabled = false; },
  authSignup: async fd => { if (fd.get('pw') !== fd.get('pw2')) return $('#authErr').textContent = 'كلمتا السر غير متطابقتين'; const b = $('#auth button.pri'); b.disabled = true;
    try { const code = await signup(fd.get('phone'), fd.get('name').trim(), fd.get('pw')); $('#auth .card').innerHTML = `<h3>رمز الاسترجاع</h3><p class="muted" style="margin-top:0">إن نسيت كلمة السر فهذا الرمز هو الطريقة الوحيدة لاسترجاع بياناتك. التقط له صورة أو اكتبه في مكان آمن.</p><div class="code-box">${code}</div><button class="btn pri block" data-a="enter">حفظته، ادخل</button>`; } catch (e) { $('#authErr').textContent = e.message; b.disabled = false; } },
  authRecover: async fd => { try { await recover(fd.get('phone'), fd.get('code'), fd.get('pw')); enterApp(); toast('تغيّرت كلمة السر', 'ok'); } catch (e) { $('#authErr').textContent = e.message; } }
};
A.enter = () => enterApp();
function enterApp() { $('#auth').hidden = true; $('#app').hidden = false; applyTheme(); R.stack = []; R.tab = 'today'; R.day = null; render(true); }

// ================= الأحداث =================
document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (!el || el.disabled) return; const fn = A[el.dataset.a]; if (fn) { e.preventDefault(); fn(el.dataset, el, e); } });
document.addEventListener('submit', e => { const f = e.target.closest('form[data-f]'); if (!f) return; e.preventDefault(); const fn = F[f.dataset.f] || AUTH[f.dataset.f]; fn?.(new FormData(f), f); });
document.addEventListener('change', e => { const el = e.target.closest('[data-c]'); if (el) C[el.dataset.c]?.(el); });
let lastY = 0;
addEventListener('scroll', () => { const y = scrollY, tb = $('#topbar'); if (!tb) return; if (y > lastY + 6 && y > 70) tb.classList.add('hide'); else if (y < lastY - 6 || y < 40) tb.classList.remove('hide'); lastY = y; }, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); else if (S && cur().v === 'today' && !SHEET) render(); });
setInterval(() => {
  if (!S) return;
  const v = cur().v;
  if (v === 'urge' && R.urge) { const left = Math.max(0, 600 - (Date.now() - R.urge.start) / 1000), el = $('[data-tick=urge]'); if (el) el.textContent = `${pad(Math.floor(left / 60))}:${pad(Math.floor(left % 60))}`; const rg = $('#urgeRing'); if (rg) rg.setAttribute('stroke-dashoffset', (565.5 * (1 - left / 600)).toFixed(1)); }
  if (R.rest) { const left = Math.ceil((R.rest.end - Date.now()) / 1000), el = $('[data-tick=rest]'); if (left <= 0) { R.rest = null; $('#restBar')?.remove(); if (navigator.vibrate) navigator.vibrate(200); toast('انتهت الراحة، المجموعة التالية', 'ok'); } else if (el) el.textContent = `${Math.floor(left / 60)}:${pad(left % 60)}`; }
  if (v === 'today' && !SHEET && !document.activeElement?.matches('input,textarea,select') && Date.now() - R.lastRender > 60000) render();
}, 1000);

// ================= التشغيل =================
async function boot() {
  $('#tabbar').innerHTML = [['today', 'اليوم'], ['lessons', 'الدروس'], ['projects', 'المشاريع'], ['plan', 'الخطة'], ['more', 'المزيد']].map(([t, l]) => `<button class="tab press" data-a="tab" data-t="${t}">${ic(t)}<span>${l}</span></button>`).join('');
  if (!window.crypto?.subtle) { $('#auth').hidden = false; $('#auth').innerHTML = '<div class="card">يجب فتح التطبيق من رابط آمن (https).</div>'; return; }
  await idb();
  try { const s = await idbDo('kv', 'readonly', st => st.get('session')); if (s && accounts()[s.id]) { ACC = s.id; DEK = s.key; await loadData(); return enterApp(); } } catch (e) { console.warn(e); }
  showAuth('login');
}
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(() => {});
boot();
