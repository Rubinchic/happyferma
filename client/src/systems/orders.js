import { TOURIST_ORDER_TEMPLATES } from '../data/orders.js';
import { PRODUCTS } from '../data/products.js';
import { getCityOrderSlots, isCityOrdersUnlocked, getTruckRewardMul } from './state.js';

export function nextTouristDelay() {
  return (8 + Math.random() * 17) * 60000;
}

export function initTouristSystem(G) {
  if (!G.tourist) G.tourist = {nextVisitAt: Date.now() + nextTouristDelay(), visit: null};
}

export function startTouristVisit(G, { addLog, spawnParticles, showTouristBanner, renderOrders, currentTab }) {
  if (!G || !G.tourist || G.tourist.visit) return;
  const shuffled = [...TOURIST_ORDER_TEMPLATES].sort(() => Math.random() - .5);
  G.tourist.visit = {
    startedAt: Date.now(),
    expiresAt: Date.now() + 900000,
    chainIndex: 0,
    orders: shuffled.slice(0,5).map((t,i) => ({
      id: 'tord_'+i+'_'+Date.now(),
      items: t.items.map(x => ({...x})),
      coins: t.coins, xp: t.xp,
    })),
    completedCount: 0,
  };
  addLog('🧳 Турист завітав на ферму! У нього 5 замовлень — встигни за 15 хвилин!');
  spawnParticles('🧳', window.innerWidth/2, window.innerHeight/4);
  showTouristBanner();
  if (currentTab === 'orders') renderOrders();
}

export function tickOrders(G, deps) {
  if (!G) return;
  const { addLog, spawnParticles, showTouristBanner, hideTouristBanner, renderOrders, currentTab } = deps;
  initTouristSystem(G);
  initCityOrdersSystem(G, false);
  const now = Date.now();
  const t = G.tourist;
  if (!t.visit) {
    if (now >= t.nextVisitAt) startTouristVisit(G, deps);
    if (currentTab === 'orders') renderOrders();
    return;
  }
  if (now >= t.visit.expiresAt) {
    const done = t.visit.completedCount;
    const total = t.visit.orders.length;
    if (done < total) addLog('🧳 Турист пішов... Виконано ' + done + '/' + total + ' замовлень.');
    t.visit = null;
    t.nextVisitAt = now + nextTouristDelay();
    hideTouristBanner();
    if (currentTab === 'orders') renderOrders();
    return;
  }
  deps.updateTouristBannerTimer();
  if (currentTab === 'orders') renderOrders();
}

export function canFulfillTOrder(G, order) {
  return order.items.every(i => (G.inventory[i.k]||0) >= i.qty);
}

export function fulfillTOrder(G, orderId, { addLog, addXP, updateTopBar, spawnParticles, hideTouristBanner, renderOrders, renderInventory, currentTab, saveCurrentGame }) {
  if (!G || !G.tourist || !G.tourist.visit) return;
  const visit = G.tourist.visit;
  const order = visit.orders[visit.chainIndex];
  if (!order || order.id !== orderId) return;
  if (!canFulfillTOrder(G, order)) return;
  order.items.forEach(item => {
    G.inventory[item.k] = (G.inventory[item.k]||0) - item.qty;
    if (G.inventory[item.k] <= 0) delete G.inventory[item.k];
  });
  G.coins += order.coins; G.stats.earned += order.coins;
  addXP(order.xp);
  visit.completedCount++; visit.chainIndex++;
  addLog('🧳 Туристу доставлено! +' + order.coins + '🪙 +' + order.xp + 'XP');
  spawnParticles('💰', window.innerWidth/2, window.innerHeight/2);
  updateTopBar();
  if (visit.chainIndex >= visit.orders.length) {
    G.coins += 500; addXP(200);
    addLog('🎉 Всі 5 замовлень туриста виконано! Бонус +500🪙 +200XP!');
    spawnParticles('🎉', window.innerWidth/2, window.innerHeight/3);
    G.tourist.visit = null;
    G.tourist.nextVisitAt = Date.now() + nextTouristDelay();
    hideTouristBanner();
    updateTopBar();
  }
  if (currentTab === 'orders') renderOrders();
  if (currentTab === 'inventory') renderInventory();
  saveCurrentGame();
}

// ── City orders ──
function randInt(a,b) { return Math.floor(a + Math.random()*(b-a+1)); }
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

export function generateCityOrder(G) {
  const pool = Object.entries(PRODUCTS).filter(([k,p]) => p && p.sellPrice > 0);
  const count = Math.random() < 0.65 ? 1 : 2;
  const items = []; const used = new Set();
  for (let i=0;i<count;i++) {
    const [k] = pick(pool);
    if (used.has(k)) { i--; continue; }
    used.add(k);
    const base = PRODUCTS[k]?.category==='crafted' ? randInt(1,2) : PRODUCTS[k]?.category==='animal' ? randInt(2,4) : randInt(4,8);
    items.push({k, qty:base});
  }
  const rawValue = items.reduce((s,it) => s + (PRODUCTS[it.k]?.sellPrice||0)*it.qty, 0);
  const mul = getTruckRewardMul(G);
  const coins = Math.max(60, Math.round(rawValue * (0.95 + Math.random()*0.35) * mul));
  const xp = Math.max(15, Math.round((coins/10) * (0.7 + Math.random()*0.3)));
  return {id:'cord_'+Date.now()+'_'+Math.floor(Math.random()*9999), items, coins, xp};
}

export function initCityOrdersSystem(G, force) {
  if (!G) return;
  if (!G.cityOrders) G.cityOrders = {orders:[], nextRefreshAt:0};
  if (!G.cityOrders.orders) G.cityOrders.orders = [];
  if (!isCityOrdersUnlocked(G)) return;
  const slots = getCityOrderSlots(G);
  if (slots <= 0) return;
  const now = Date.now();
  if (force || !G.cityOrders.nextRefreshAt) G.cityOrders.nextRefreshAt = now;
  if (now >= (G.cityOrders.nextRefreshAt||0)) {
    G.cityOrders.orders = [];
    G.cityOrders.nextRefreshAt = now + 10*60*1000;
  }
  while ((G.cityOrders.orders||[]).length < slots) {
    G.cityOrders.orders.push(generateCityOrder(G));
  }
  if ((G.cityOrders.orders||[]).length > slots) G.cityOrders.orders = G.cityOrders.orders.slice(0, slots);
}

export function canFulfillCityOrder(G, order) {
  return order.items.every(i => (G.inventory[i.k]||0) >= i.qty);
}

export function fulfillCityOrder(G, orderId, { addLog, addXP, updateTopBar, spawnParticles, renderOrders, renderInventory, currentTab, saveCurrentGame }) {
  if (!G || !G.cityOrders || !G.cityOrders.orders) return;
  const idx = G.cityOrders.orders.findIndex(o => o.id === orderId);
  if (idx < 0) return;
  const order = G.cityOrders.orders[idx];
  if (!canFulfillCityOrder(G, order)) return addLog('❌ Не вистачає товарів для доставки.');
  order.items.forEach(item => {
    G.inventory[item.k] = (G.inventory[item.k]||0) - item.qty;
    if (G.inventory[item.k] <= 0) delete G.inventory[item.k];
  });
  G.coins += order.coins; G.stats.earned += order.coins;
  addXP(order.xp);
  addLog(`🏙️ Доставка в місто виконана! +${order.coins}🪙 +${order.xp}XP`);
  spawnParticles('🚚', window.innerWidth/2, window.innerHeight/2);
  G.cityOrders.orders.splice(idx, 1);
  initCityOrdersSystem(G, false);
  updateTopBar();
  if (currentTab === 'orders') renderOrders();
  if (currentTab === 'inventory') renderInventory();
  saveCurrentGame();
}
