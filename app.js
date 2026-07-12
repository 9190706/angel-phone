/* ============================================
   Angel Phone —— app.js
   状态机 + 时间更新 + localStorage 工具函数
   以后每个 App（Chat/联系人/设置...）的逻辑
   都会作为独立的函数区块加在这个文件里
   ============================================ */

/* ---------- 系统状态机 ---------- */
const AppState = {
  current: 'home',
  stack: []
};

function openApp(screenName) {
  const from = document.querySelector('.screen.active');
  const to = document.querySelector(`.screen[data-screen="${screenName}"]`);
  if (!to || to === from) return;

  if (from) from.classList.remove('active');
  to.classList.add('active');

  AppState.stack.push(AppState.current);
  AppState.current = screenName;
}

function goHome() {
  const from = document.querySelector('.screen.active');
  const home = document.querySelector('.screen[data-screen="home"]');
  if (from) from.classList.remove('active');
  home.classList.add('active');

  AppState.current = 'home';
  AppState.stack = [];
}

/* ---------- 事件绑定 ---------- */
document.addEventListener('click', function (e) {
  const openTarget = e.target.closest('[data-open]');
  if (openTarget) {
    openApp(openTarget.getAttribute('data-open'));
    return;
  }

  const actionTarget = e.target.closest('[data-action="go-home"]');
  if (actionTarget) {
    goHome();
  }
});

/* ---------- 状态栏时间 + 主屏幕时钟 ---------- */
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;

  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dateStr = `${weekDays[now.getDay()]} · ${now.getMonth() + 1}月${now.getDate()}日`;

  const statusTimeEl = document.getElementById('status-time');
  const homeTimeEl = document.getElementById('home-time');
  const homeDateEl = document.getElementById('home-date');

  if (statusTimeEl) statusTimeEl.textContent = timeStr;
  if (homeTimeEl) homeTimeEl.textContent = timeStr;
  if (homeDateEl) homeDateEl.textContent = dateStr;
}

updateClock();
setInterval(updateClock, 10000);

/* ============================================
   本地数据存储工具函数
   所有模块以后统一通过这两个函数读写 localStorage
   key 建议加前缀，例如 'angelphone_user'、'angelphone_characters'
   ============================================ */
function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('storageGet 读取失败：', key, e);
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('storageSet 写入失败：', key, e);
    return false;
  }
}
