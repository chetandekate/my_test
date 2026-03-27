// ─── Screen routing ────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

function enterApp() {
  showScreen('screen-app');
  initCalendar();
  buildHistoryList();
}

// ─── Onboarding chips ──────────────────────────────────────────────────
function selectPref(el) {
  document.querySelectorAll('.pref-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ─── Tab switching ─────────────────────────────────────────────────────
const tabTitles = { today: 'Today', history: 'History', insights: 'Insights' };

function switchTab(tab) {
  ['today', 'history', 'insights'].forEach(t => {
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
    document.getElementById('nav-' + t).classList.toggle('active', t === tab);
  });
  document.getElementById('app-bar-title').textContent = tabTitles[tab];
}

// ─── Date navigation ───────────────────────────────────────────────────
const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let currentDate = new Date(2026, 2, 27);

function formatDateDisplay(d) {
  return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()];
}

function changeDay(delta) {
  currentDate = new Date(currentDate);
  currentDate.setDate(currentDate.getDate() + delta);
  document.getElementById('date-display').textContent = formatDateDisplay(currentDate);
}

function switchToday(delta) {
  document.querySelectorAll('.recent-card').forEach(c => c.classList.remove('active'));
  const cards = document.querySelectorAll('.recent-card');
  const idx = delta + 3;
  if (cards[idx]) cards[idx].classList.add('active');
  changeDay(delta);
}

// ─── Mood / Energy / Sleep quality ────────────────────────────────────
const moodLabels   = ['', 'Very low', 'Low', 'Okay', 'Good', 'Great'];
const energyLabels = ['', 'Empty', 'Low', 'Moderate', 'Good', 'High'];

function setMood(val) {
  document.querySelectorAll('#mood-scale .scale-btn').forEach(b =>
    b.classList.toggle('active', +b.dataset.val === val));
  document.getElementById('mood-badge').textContent = moodLabels[val];
}

function setEnergy(val) {
  document.querySelectorAll('#energy-scale .scale-btn').forEach(b =>
    b.classList.toggle('active', +b.dataset.val === val));
  document.getElementById('energy-badge').textContent = energyLabels[val];
}

function setSleepQuality(val) {
  document.querySelectorAll('#sleep-quality .sq-btn').forEach(b =>
    b.classList.toggle('active', +b.dataset.val === val));
}

// ─── Note chips ────────────────────────────────────────────────────────
function addChip(text) {
  const inp = document.getElementById('note-input');
  const current = inp.value.trim();
  inp.value = current ? current + ', ' + text : text;
  updateCharCount(inp);
  inp.focus();
}

function updateCharCount(el) {
  document.getElementById('char-count').textContent = el.value.length + '/150';
}

// ─── Save ──────────────────────────────────────────────────────────────
function saveToday() {
  const btn = document.getElementById('save-btn');
  btn.textContent = '✓ Saved';
  btn.style.background = 'linear-gradient(135deg,#3DBFA0,#2A9A83)';
  showToast('Entry saved for today');
  setTimeout(() => {
    btn.textContent = 'Save today';
    btn.style.background = '';
  }, 2500);
}

// ─── Time picker ───────────────────────────────────────────────────────
let activeTimePicker = null;
let tpHour = 11, tpMin = 20, tpAmPm = 'PM';

function openTimePicker(field) {
  activeTimePicker = field;
  document.getElementById('tp-title').textContent = field === 'bedtime' ? 'Went to bed' : 'Woke up';
  if (field === 'bedtime') { tpHour = 11; tpMin = 20; tpAmPm = 'PM'; }
  else { tpHour = 7; tpMin = 0; tpAmPm = 'AM'; }
  syncTimePicker();
  openOverlay('time-picker-overlay');
}

function syncTimePicker() {
  document.getElementById('tp-hour').textContent = String(tpHour).padStart(2, '0');
  document.getElementById('tp-min').textContent  = String(tpMin).padStart(2, '0');
  document.getElementById('tp-ampm').textContent = tpAmPm;
}

function adjustTime(part, delta) {
  if (part === 'hour') tpHour = ((tpHour - 1 + delta + 12) % 12) + 1;
  else if (part === 'min') tpMin = (tpMin + delta * 5 + 60) % 60;
  else tpAmPm = tpAmPm === 'AM' ? 'PM' : 'AM';
  syncTimePicker();
}

function confirmTime() {
  const timeStr = String(tpHour).padStart(2,'0') + ':' + String(tpMin).padStart(2,'0') + ' ' + tpAmPm;
  if (activeTimePicker === 'bedtime') document.getElementById('bedtime-val').textContent = timeStr;
  else document.getElementById('waketime-val').textContent = timeStr;
  document.getElementById('sleep-badge').textContent = '7 h 40 min';
  closeOverlay('time-picker-overlay');
}

// ─── Calendar ──────────────────────────────────────────────────────────
let calYear = 2026, calMon = 2;

const moodData = {
  '2026-3-1':'#fff3cd','2026-3-2':'#d4edda','2026-3-3':'#d4edda','2026-3-4':'#f8d7da',
  '2026-3-5':'#fff3cd','2026-3-6':'#d4edda','2026-3-7':'#d4edda','2026-3-8':'#d4edda',
  '2026-3-9':'#f8d7da','2026-3-10':'#d4edda','2026-3-11':'#fff3cd','2026-3-12':'#d4edda',
  '2026-3-13':'#f8d7da','2026-3-14':'#d4edda','2026-3-15':'#d4edda','2026-3-16':'#fff3cd',
  '2026-3-17':'#d4edda','2026-3-18':'#f8d7da','2026-3-19':'#d4edda','2026-3-20':'#d4edda',
  '2026-3-21':'#d4edda','2026-3-22':'#fff3cd','2026-3-23':'#f8d7da','2026-3-24':'#d4edda',
  '2026-3-25':'#fff3cd','2026-3-26':'#d4edda','2026-3-27':'#d4edda',
};
const sleepData = { '2026-3-24':35,'2026-3-25':40,'2026-3-26':50,'2026-3-27':48 };

function initCalendar() { renderCalendar(calYear, calMon); }

function calMonth(delta) {
  calMon += delta;
  if (calMon > 11) { calMon = 0; calYear++; }
  if (calMon < 0)  { calMon = 11; calYear--; }
  renderCalendar(calYear, calMon);
}

function renderCalendar(y, m) {
  document.getElementById('cal-month-label').textContent = months[m] + ' ' + y;
  const grid = document.querySelector('.cal-grid');
  grid.querySelectorAll('.cal-day, .cal-empty').forEach(e => e.remove());
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = y + '-' + (m + 1) + '-' + d;
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    el.style.background = moodData[key] || '#F3F4F6';
    if (today.getFullYear() === y && today.getMonth() === m && today.getDate() === d) el.classList.add('today');
    if (sleepData[key]) {
      const bar = document.createElement('div');
      bar.className = 'sleep-bar';
      bar.style.height = sleepData[key] + '%';
      el.appendChild(bar);
    }
    el.addEventListener('click', () => showDayDetail(y, m, d));
    grid.appendChild(el);
  }
}

function showDayDetail(y, m, d) {
  document.getElementById('dd-date').textContent = days[new Date(y, m, d).getDay()] + ', ' + d + ' ' + months[m];
  openOverlay('day-detail-overlay');
}

function openDayFromSheet() {
  closeOverlay('day-detail-overlay');
  switchTab('today');
}

// ─── History list ──────────────────────────────────────────────────────
const listItems = [
  { date: 'Fri 27 Mar', sleep: '7h 40min', mood: '😊 Good',  energy: '⚡ Moderate', note: 'Calm evening, early dinner' },
  { date: 'Thu 26 Mar', sleep: '7h 48min', mood: '😊 Good',  energy: '⚡ Good',     note: 'Evening walk, calm day' },
  { date: 'Wed 25 Mar', sleep: '7h 06min', mood: '😐 Okay',  energy: '🔋 Moderate', note: 'Stress at work, skipped gym' },
  { date: 'Tue 24 Mar', sleep: '6h 12min', mood: '😕 Low',   energy: '🔋 Low',      note: 'Late Netflix, heavy dinner' },
  { date: 'Mon 23 Mar', sleep: '7h 30min', mood: '😊 Good',  energy: '⚡ Good',     note: 'Morning run, productive day' },
  { date: 'Sun 22 Mar', sleep: '8h 20min', mood: '😄 Great', energy: '✨ High',     note: 'Rest day, good sleep in' },
  { date: 'Sat 21 Mar', sleep: '7h 55min', mood: '😊 Good',  energy: '⚡ Good',     note: 'Relaxed, no work' },
];

function buildHistoryList() {
  const container = document.getElementById('hist-list');
  container.innerHTML = '';
  listItems.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'hist-item';
    const parts = item.date.split(' ');
    el.innerHTML = `
      <div class="hist-date-col">
        <div class="hist-day">${parts[0]}</div>
        <div class="hist-num">${parts[1]}</div>
      </div>
      <div class="hist-body">
        <div class="hist-stats">${item.sleep} · ${item.mood} · ${item.energy}</div>
        <div class="hist-note">"${item.note}"</div>
      </div>
      <div class="hist-chevron">›</div>`;
    el.addEventListener('click', () => {
      document.getElementById('dd-date').textContent = item.date;
      openOverlay('day-detail-overlay');
    });
    container.appendChild(el);
  });
}

function switchHistoryView(view) {
  document.getElementById('seg-cal').classList.toggle('active', view === 'cal');
  document.getElementById('seg-list').classList.toggle('active', view === 'list');
  document.getElementById('history-cal').style.display  = view === 'cal'  ? 'block' : 'none';
  document.getElementById('history-list').style.display = view === 'list' ? 'block' : 'none';
}

// ─── Insights ──────────────────────────────────────────────────────────
function switchInsightPeriod(period) {
  ['week','30','all'].forEach(p =>
    document.getElementById('seg-' + p).classList.toggle('active', p === period));
}

function toggleGraph(id) {
  const el = document.getElementById(id);
  const btn = el.previousElementSibling.querySelector('.insight-show-graph');
  const visible = el.style.display !== 'none';
  el.style.display = visible ? 'none' : 'block';
  if (btn) btn.textContent = visible ? 'Show graph ↓' : 'Hide graph ↑';
}

function toggleWhy(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display !== 'none' ? 'none' : 'block';
}

function startExperiment() {
  document.getElementById('experiment-card').style.display = 'none';
  document.getElementById('exp-banner').style.display = 'flex';
  showToast('Experiment started! Check back in 7 days.');
}

function dismissExperiment() {
  document.getElementById('experiment-card').style.display = 'none';
}

function scrollToExperiment() {
  const el = document.getElementById('experiment-card');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ─── Overlays ──────────────────────────────────────────────────────────
function openOverlay(id)  { document.getElementById(id).classList.add('open'); }
function closeOverlay(id) { document.getElementById(id).classList.remove('open'); }
function showSettings()   { openOverlay('settings-overlay'); }

// ─── Toast ─────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ─── Init ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('date-display').textContent = formatDateDisplay(currentDate);
});
