import { QUEST_POOL } from '../data/quests.js';

export function getQDef(id) {
  return QUEST_POOL.find(q => q.id === id);
}

export function generateDailyQuests(G) {
  if (!G.quests) G.quests = {active:[], completed:[], lastRefresh:0};
  const avail = QUEST_POOL.filter(q =>
    G.level >= q.minLevel &&
    !(G.quests.completed||[]).includes(q.id) &&
    !(G.quests.active||[]).find(a => a.id === q.id)
  );
  const need = 3 - (G.quests.active||[]).length;
  for (let i = 0; i < need && avail.length; i++) {
    const ri = Math.floor(Math.random() * avail.length);
    G.quests.active.push({id: avail.splice(ri,1)[0].id, progress: 0});
  }
}

export function updateQuestProgress(G, type, val, extra, { checkQuestCompletion, renderQuests, currentTab }) {
  if (!G || !G.quests || !G.quests.active) return;
  let changed = false;
  G.quests.active.forEach(aq => {
    const d = getQDef(aq.id);
    if (!d || d.type !== type) return;
    if (type === 'harvest' && d.crop    && d.crop    !== extra) return;
    if (type === 'collect' && d.product && d.product !== extra) return;
    if (type === 'craft'   && d.product && d.product !== extra) return;
    aq.progress = Math.min(d.target, (aq.progress||0) + (val||1));
    changed = true;
  });
  if (changed) {
    checkQuestCompletion();
    if (currentTab === 'quests') renderQuests();
  }
}

export function checkQuestCompletion(G, { addLog, addXP, updateTopBar, spawnParticles, generateDailyQuests: genQuests, renderQuests, currentTab }) {
  if (!G.quests || !G.quests.active) return;
  const done = G.quests.active.filter(aq => {
    const d = getQDef(aq.id);
    return d && aq.progress >= d.target;
  });
  done.forEach(aq => {
    const d = getQDef(aq.id);
    G.quests.active = G.quests.active.filter(q => q.id !== aq.id);
    G.quests.completed = G.quests.completed || [];
    G.quests.completed.push(aq.id);
    G.coins += d.rewardCoins;
    addXP(d.rewardXP);
    addLog('✅ Квест: ' + d.icon + ' ' + d.name + ' (+' + d.rewardCoins + '🪙 +' + d.rewardXP + 'XP)');
    spawnParticles('✅', window.innerWidth/2, window.innerHeight/3);
    updateTopBar();
    genQuests(G);
    if (currentTab === 'quests') renderQuests();
  });
}
