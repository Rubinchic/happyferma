import { ACHIEVEMENTS, ACHIEVEMENT_TARGETS } from '../data/achievements.js';

export function getAchievementProgress(G, id) {
  if (!G) return 0;
  const map = {
    harvest10:   () => G.stats.harvested,
    harvest50:   () => G.stats.harvested,
    harvest200:  () => G.stats.harvested,
    harvest500:  () => G.stats.harvested,
    harvest1000: () => G.stats.harvested,
    animals3:    () => G.animals.length,
    animals5:    () => G.animals.length,
    animals10:   () => G.animals.length,
    collect100:  () => G.stats.productsCollected || 0,
    collect500:  () => G.stats.productsCollected || 0,
    coins500:    () => G.coins,
    coins2000:   () => G.coins,
    coins10000:  () => G.coins,
    coins100000: () => G.coins,
    earned50000: () => G.stats.earned || 0,
    level3:      () => G.level,
    level5:      () => G.level,
    level10:     () => G.level,
    level15:     () => G.level,
    sell20:      () => G.stats.sold || 0,
    sell100:     () => G.stats.sold || 0,
    sell500:     () => G.stats.sold || 0,
    water20:     () => G.stats.watered || 0,
    water100:    () => G.stats.watered || 0,
    craft10:     () => G.stats.crafted || 0,
    auto_complete:   () => G.stats.autoCompleted || 0,
    unlock10cells:   () => (G.cells||[]).filter(x => x.unlocked !== false).length,
  };
  return map[id] ? map[id]() : null;
}

export function checkAchievement(G, id, value, { addLog, spawnParticles, updateTopBar, renderProfile, currentTab }) {
  if (!G.achievements) G.achievements = [];
  if (G.achievements.includes(id)) return;
  const T = ACHIEVEMENT_TARGETS;
  if (!((id in T) ? (value||0) >= T[id] : true)) return;
  G.achievements.push(id);
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  const rw = [];
  if (ach.xp    > 0) { G.xp += ach.xp;       rw.push('+' + ach.xp + 'XP'); }
  if (ach.coins > 0) { G.coins += ach.coins;  rw.push('+' + ach.coins + '🪙'); }
  addLog('🏆 ' + ach.icon + ' ' + ach.name + (rw.length ? ' (' + rw.join(', ') + ')' : ''));
  spawnParticles('🏆', window.innerWidth / 2, window.innerHeight / 4);
  updateTopBar();
  if (currentTab === 'profile') renderProfile();
}

export function checkAllAchievements(G, deps) {
  if (!G) return;
  const { checkAch } = deps;
  checkAch('coins500',    G.coins);
  checkAch('coins2000',   G.coins);
  checkAch('coins10000',  G.coins);
  checkAch('coins100000', G.coins);
  checkAch('earned50000', G.stats.earned || 0);
  checkAch('harvest10',   G.stats.harvested);
  checkAch('harvest50',   G.stats.harvested);
  checkAch('harvest200',  G.stats.harvested);
  checkAch('harvest500',  G.stats.harvested);
  checkAch('harvest1000', G.stats.harvested);
  checkAch('animals3',    G.animals.length);
  checkAch('animals5',    G.animals.length);
  checkAch('animals10',   G.animals.length);
  checkAch('collect100',  G.stats.productsCollected || 0);
  checkAch('collect500',  G.stats.productsCollected || 0);
  checkAch('sell20',      G.stats.sold || 0);
  checkAch('sell100',     G.stats.sold || 0);
  checkAch('sell500',     G.stats.sold || 0);
  checkAch('water20',     G.stats.watered || 0);
  checkAch('water100',    G.stats.watered || 0);
  checkAch('level3',      G.level);
  checkAch('level5',      G.level);
  checkAch('level10',     G.level);
  checkAch('level15',     G.level);
  const unl = (G.cells || []).filter(x => x.unlocked !== false).length;
  checkAch('unlock10cells', unl);
  const gt = new Set((G.cells||[]).filter(x => x.crop).map(x => x.crop));
  const { CROPS } = deps;
  if (gt.size >= CROPS.length) checkAch('all_crops');
  const ot = new Set((G.animals||[]).map(a => a.type));
  const { ANIMALS_DEF } = deps;
  if (ot.size >= ANIMALS_DEF.length) checkAch('all_animals');
  if ((G.stats.autoCompleted || 0) >= 5) checkAch('auto_complete', G.stats.autoCompleted);
}
