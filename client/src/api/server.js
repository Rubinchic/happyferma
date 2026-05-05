const API_URL = 'https://farm.slivce.cc/api';

export async function apiLogin(username, password) {
  const res = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password, mode: 'login'})
  });
  return {res, data: await res.json()};
}

export async function apiRegister(username, password, gameData) {
  const res = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password, mode: 'register', gameData})
  });
  return {res, data: await res.json()};
}

export async function apiSave(username, gameData) {
  try {
    const res = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, gameData})
    });
    const result = await res.json();
    if (result.success) console.log('✅ Збережено в Redis');
  } catch(e) {
    console.error('❌ Помилка синхронізації:', e);
  }
}

// Known users cache (for quick-login chips)
const KNOWN_USERS_KEY = 'VF_KNOWN_USERS';

export function saveKnownUser(name) {
  try {
    const raw = localStorage.getItem(KNOWN_USERS_KEY) || '[]';
    const list = JSON.parse(raw);
    if (!list.find(u => (u.name || u) === name)) {
      list.push({name, displayName: name});
      localStorage.setItem(KNOWN_USERS_KEY, JSON.stringify(list));
    }
  } catch(e) {}
}

export function loadKnownUsers() {
  try {
    return JSON.parse(localStorage.getItem(KNOWN_USERS_KEY) || '[]');
  } catch(e) { return []; }
}
