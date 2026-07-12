/* ============================================
   Angel Phone —— app.js
   状态机 + 时间更新 + localStorage 工具函数
   以后每个 App 的逻辑都作为独立函数区块加在这个文件里
   ============================================ */

/* ---------- 系统状态机 ---------- */
const AppState = { current: 'home', stack: [] };

function openApp(screenName) {
  const from = document.querySelector('.screen.active');
  const to = document.querySelector(`.screen[data-screen="${screenName}"]`);
  if (!to || to === from) return;
  if (from) from.classList.remove('active');
  to.classList.add('active');
  AppState.stack.push(AppState.current);
  AppState.current = screenName;

  if (screenName === 'chat') enterChatApp();
}

function goHome() {
  const from = document.querySelector('.screen.active');
  const home = document.querySelector('.screen[data-screen="home"]');
  if (from) from.classList.remove('active');
  home.classList.add('active');
  AppState.current = 'home';
  AppState.stack = [];
}

/* ---------- 事件绑定（系统级） ---------- */
document.addEventListener('click', function (e) {
  const openTarget = e.target.closest('[data-open]');
  if (openTarget) { openApp(openTarget.getAttribute('data-open')); return; }

  const actionTarget = e.target.closest('[data-action="go-home"]');
  if (actionTarget) { goHome(); return; }

  const chatTabTarget = e.target.closest('[data-chat-tab]');
  if (chatTabTarget) { switchChatTab(chatTabTarget.getAttribute('data-chat-tab')); return; }
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
   ============================================ */
function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) { console.warn('storageGet 读取失败：', key, e); return fallback; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { console.warn('storageSet 写入失败：', key, e); return false; }
}

/* ============================================
   Chat App
   数据结构：
   angelphone_user        -> { name, avatar }  avatar 为 dataURL 或 null
   angelphone_characters  -> [ { id, name, avatar } ]
   ============================================ */
const DEFAULT_AVATAR_SVG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8.5" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 19C5.8 15.8 8.2 14 12 14C15.8 14 18.2 15.8 19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

let pendingUserAvatar = null;
let pendingCharacterAvatar = null;

function loadUser() { return storageGet('angelphone_user', null); }
function saveUser(user) { storageSet('angelphone_user', user); }
function loadCharacters() { return storageGet('angelphone_characters', []); }
function saveCharacters(list) { storageSet('angelphone_characters', list); }

function setAvatarPreview(el, dataUrl) {
  if (dataUrl) {
    el.style.backgroundImage = `url(${dataUrl})`;
    el.innerHTML = '';
  } else {
    el.style.backgroundImage = 'none';
    el.innerHTML = DEFAULT_AVATAR_SVG;
  }
}

function switchChatView(viewName) {
  document.querySelectorAll('.chat-sub').forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('data-chat-view') === viewName);
  });
}

function switchChatTab(tabName) {
  document.querySelectorAll('.chat-tab-content').forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('data-tab') === tabName);
  });
  document.querySelectorAll('.nav-item').forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('data-chat-tab') === tabName);
  });
  if (tabName === 'profile') renderProfileTab();
}

function enterChatApp() {
  const user = loadUser();
  const characters = loadCharacters();

  if (!user) { switchChatView('onboarding-user'); return; }
  if (!characters || characters.length === 0) { switchChatView('onboarding-character'); return; }

  switchChatView('main');
  switchChatTab('contacts');
  renderContactsList();
}

function renderContactsList() {
  const listEl = document.getElementById('contacts-list');
  const characters = loadCharacters();
  if (!characters || characters.length === 0) {
    listEl.innerHTML = '<div class="contacts-empty">暂无联系人，请先创建 Character</div>';
    return;
  }
  listEl.innerHTML = characters.map(function (c) {
    const avatarStyle = c.avatar ? `style="background-image:url(${c.avatar})"` : '';
    const avatarInner = c.avatar ? '' : DEFAULT_AVATAR_SVG;
    return `<div class="contact-card" data-character-id="${c.id}">
      <div class="avatar-circle avatar-sm" ${avatarStyle}>${avatarInner}</div>
      <div>
        <div class="contact-name">${escapeHtml(c.name)}</div>
        <div class="contact-preview">暂无消息</div>
      </div>
    </div>`;
  }).join('');
}

function renderProfileTab() {
  const user = loadUser();
  if (!user) return;
  const avatarEl = document.getElementById('profile-avatar');
  const nameEl = document.getElementById('profile-name');
  setAvatarPreview(avatarEl, user.avatar);
  nameEl.textContent = user.name;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function readFileAsDataUrl(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) { callback(e.target.result); };
  reader.readAsDataURL(file);
}

document.addEventListener('DOMContentLoaded', function () {
  /* User 头像上传 */
  const userAvatarInput = document.getElementById('user-avatar-input');
  const userAvatarPreview = document.getElementById('user-avatar-preview');
  if (userAvatarInput) {
    userAvatarInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
      readFileAsDataUrl(file, function (dataUrl) {
        pendingUserAvatar = dataUrl;
        setAvatarPreview(userAvatarPreview, dataUrl);
      });
    });
  }

  /* Character 头像上传 */
  const characterAvatarInput = document.getElementById('character-avatar-input');
  const characterAvatarPreview = document.getElementById('character-avatar-preview');
  if (characterAvatarInput) {
    characterAvatarInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
      readFileAsDataUrl(file, function (dataUrl) {
        pendingCharacterAvatar = dataUrl;
        setAvatarPreview(characterAvatarPreview, dataUrl);
      });
    });
  }

  /* 创建 User */
  const btnCreateUser = document.getElementById('btn-create-user');
  if (btnCreateUser) {
    btnCreateUser.addEventListener('click', function () {
      const nameInput = document.getElementById('user-name-input');
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      saveUser({ name: name, avatar: pendingUserAvatar });
      pendingUserAvatar = null;
      enterChatApp();
    });
  }

  /* 创建 Character */
  const btnCreateCharacter = document.getElementById('btn-create-character');
  if (btnCreateCharacter) {
    btnCreateCharacter.addEventListener('click', function () {
      const nameInput = document.getElementById('character-name-input');
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      const characters = loadCharacters();
      characters.push({ id: 'char_' + Date.now(), name: name, avatar: pendingCharacterAvatar });
      saveCharacters(characters);
      pendingCharacterAvatar = null;
      nameInput.value = '';
      setAvatarPreview(document.getElementById('character-avatar-preview'), null);
      enterChatApp();
    });
  }

  /* "添加"页里再创建新 Character 的入口 */
  const btnAddCharacter = document.getElementById('btn-add-character');
  if (btnAddCharacter) {
    btnAddCharacter.addEventListener('click', function () {
      switchChatView('onboarding-character');
    });
  }
});
