import { GRID_SIZE, YARD_DEF, GROUND_TTL_MS, GROUND_CAP_QTY, INV_LEVEL_BONUS_PCT, INV_EVERY5_BONUS_PCT } from '../data/yard.js';
import { PRODUCTS } from '../data/products.js';

export function defaultGameState(name) {
  return {
    displayName: name,
    password: '',
    coins: 200,
    water: 10, maxWater: 10,
    level: 1, xp: 0, xpNext: 100,
    day: 1,
    inventory: {},
    animals: [],
    animalIdCounter: 0,
    cells: Array(GRID_SIZE).fill(null).map((_,i) => ({
      state:'empty', crop:null, plantedAt:null, waterBonus:false, unlocked: i < 7
    })),
    unlockedCells: 7,
    stats: {planted:0, harvested:0, watered:0, earned:0, sold:0, animalsBought:0, productsCollected:0},
    achievements: [],
    joinedDate: new Date().toLocaleDateString('uk-UA'),
    selectedCrop: 'wheat',
    selectedTool: 'plant',
    houses: {chicken_coop: {level:1, built:true}},
    craftQueue: [],
    autoFields: [],
    houseFeed: {},
    yard: {hqLevel:1, barnLevel:1, kitchenLevel:1, truckLevel:0},
    groundDrops: [],
    cityOrders: {orders:[], nextRefreshAt:0},
  };
}

// ── Inventory capacity ──
export function invCount(G) {
  return Object.values(G.inventory || {}).reduce((a,b) => a + (b||0), 0);
}

export function getInvCap(G) {
  const lvl = Math.max(1, G?.yard?.barnLevel || 1);
  const def = YARD_DEF.barn.levels.find(x => x.lvl === lvl) || YARD_DEF.barn.levels[0];
  const playerLvl = Math.max(1, G?.level || 1);
  const mult = Math.pow(1 + INV_LEVEL_BONUS_PCT, Math.max(0, playerLvl - 1))
             * Math.pow(1 + INV_EVERY5_BONUS_PCT, Math.floor(playerLvl / 5));
  return Math.max(0, Math.round((def.invCap || 0) * mult));
}

export function getCraftSlots(G) {
  const lvl = Math.max(1, G?.yard?.kitchenLevel || 1);
  const def = YARD_DEF.kitchen.levels.find(x => x.lvl === lvl) || YARD_DEF.kitchen.levels[0];
  return def.craftSlots;
}

export function getAutoFieldSlots(G) {
  const lvl = Math.max(1, G?.yard?.hqLevel || 1);
  const def = YARD_DEF.hq.levels.find(x => x.lvl === lvl) || YARD_DEF.hq.levels[0];
  return def.autoSlots;
}

export function getCityOrderSlots(G) {
  const hqLvl = Math.max(1, G?.yard?.hqLevel || 1);
  const hqDef = YARD_DEF.hq.levels.find(x => x.lvl === hqLvl) || YARD_DEF.hq.levels[0];
  const truckLvl = Math.max(0, G?.yard?.truckLevel || 0);
  const tDef = YARD_DEF.truck.levels.find(x => x.lvl === truckLvl) || YARD_DEF.truck.levels[0];
  return Math.max(0, (hqDef.orderSlots || 0) + (tDef.slotBonus || 0));
}

export function isCityOrdersUnlocked(G) {
  const truckLvl = Math.max(0, G?.yard?.truckLevel || 0);
  const tDef = YARD_DEF.truck.levels.find(x => x.lvl === truckLvl) || YARD_DEF.truck.levels[0];
  return !!tDef.cityUnlocked;
}

export function getTruckRewardMul(G) {
  const truckLvl = Math.max(0, G?.yard?.truckLevel || 0);
  const tDef = YARD_DEF.truck.levels.find(x => x.lvl === truckLvl) || YARD_DEF.truck.levels[0];
  return tDef.rewardMul || 1.0;
}

// ── Ground drops ──
export function pruneGroundDrops(G) {
  if (!G || !G.groundDrops) return;
  const now = Date.now();
  G.groundDrops = G.groundDrops.filter(d => (d.qty||0) > 0 && (d.expiresAt||0) > now);
}

export function groundCount(G) {
  if (!G.groundDrops) G.groundDrops = [];
  pruneGroundDrops(G);
  return (G.groundDrops||[]).reduce((s,x) => s + (x.qty||0), 0);
}

export function addToGround(G, key, amount) {
  if (!G.groundDrops) G.groundDrops = [];
  pruneGroundDrops(G);
  const now = Date.now();
  const existing = G.groundDrops.find(d => d.k === key);
  if (existing) { existing.qty += amount; existing.expiresAt = now + GROUND_TTL_MS; }
  else G.groundDrops.push({k: key, qty: amount, expiresAt: now + GROUND_TTL_MS});
}

export function canAcceptToStorage(G, key, amount) {
  const freeInv = Math.max(0, getInvCap(G) - invCount(G));
  const freeGround = Math.max(0, GROUND_CAP_QTY - groundCount(G));
  return (freeInv + freeGround) >= amount;
}

export function addToInventory(G, key, amount, opts = {}) {
  if (!G || !key || !amount) return true;
  pruneGroundDrops(G);
  const cap = getInvCap(G);
  const cur = invCount(G);
  const freeInv = Math.max(0, cap - cur);
  const freeGround = Math.max(0, GROUND_CAP_QTY - groundCount(G));
  const canUseGround = opts.allowGround !== false;
  const totalFree = freeInv + (canUseGround ? freeGround : 0);
  if (totalFree < amount) return false;
  const toInv = Math.min(amount, freeInv);
  const toGround = amount - toInv;
  if (toInv > 0) G.inventory[key] = (G.inventory[key]||0) + toInv;
  if (toGround > 0) addToGround(G, key, toGround);
  return true;
}

// ── House helpers ──
export function getHouseState(G, houseId) {
  if (!G.houses) G.houses = {chicken_coop:{level:1,built:true}};
  return G.houses[houseId] || null;
}

export function getCapacityForAnimal(G, animalId, HOUSES_DEF) {
  const house = HOUSES_DEF.find(h => h.animalId === animalId);
  if (!house) return 0;
  const hs = getHouseState(G, house.id);
  if (!hs || !hs.built) return 0;
  return house.levels[hs.level - 1].capacity;
}

export function countAnimals(G, animalId) {
  return G.animals.filter(a => a.type === animalId).length;
}

export function getHouseProduceBonus(G, animalId, HOUSES_DEF) {
  const house = HOUSES_DEF.find(h => h.animalId === animalId);
  if (!house) return 1.0;
  const hs = getHouseState(G, house.id);
  if (!hs || !hs.built) return 1.0;
  return house.levels[hs.level - 1].produceBonus;
}

// ── Cell unlock pricing ──
export function getCellUnlockCost(index) {
  if (index < 7) return 0;
  const base = [100,200,350,600,1000,1800,3000,5000,8500,14000,22000,35000,55000,85000,130000,200000,300000,450000,700000,1000000,1500000,2000000,3000000,5000000,7500000,10000000,15000000,22000000];
  return base[index - 7] || Math.round(500000 * Math.pow(1.6, index - 28));
}

export function getCellUnlockLevel(index) {
  if (index < 7) return 1;
  const lvls = [1,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,11,12,13,14,15,16,17,18];
  return lvls[index - 7] || Math.floor((index - 7) / 2) + 1;
}

// ── reqItems helpers ──
export function hasReqItems(G, reqItems) {
  if (!reqItems || !reqItems.length) return true;
  return reqItems.every(it => (G.inventory[it.k] || 0) >= it.qty);
}

export function reqItemsMissingList(G, reqItems) {
  if (!reqItems || !reqItems.length) return [];
  return reqItems.map(it => ({...it, have:(G.inventory[it.k]||0)})).filter(it => it.have < it.qty);
}

export function reqItemsToText(G, reqItems, withHave, getItemLabel) {
  if (!reqItems || !reqItems.length) return '—';
  return reqItems.map(it => {
    const p = getItemLabel(it.k);
    const have = G.inventory[it.k] || 0;
    return withHave ? `${p.emoji} ${p.name} ${have}/${it.qty}` : `${p.emoji} ${p.name} ×${it.qty}`;
  }).join(' • ');
}

export function deductReqItems(G, reqItems) {
  if (!reqItems || !reqItems.length) return true;
  if (!hasReqItems(G, reqItems)) return false;
  reqItems.forEach(it => {
    G.inventory[it.k] = (G.inventory[it.k] || 0) - it.qty;
    if (G.inventory[it.k] <= 0) delete G.inventory[it.k];
  });
  return true;
}

// ── Migrate auto-fields on load ──
export function migrateAutoFields(G) {
  if (!G || !G.autoFields) return;
  G.autoFields.forEach(af => {
    const cell = G.cells[af.cellIndex];
    if (cell && cell.state !== 'auto_running') {
      cell.state = 'auto_running';
      cell.crop = af.cropId;
    }
  });
}
