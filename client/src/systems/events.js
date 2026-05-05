export function buildEventDefs({ G, addLog, addXP, updateTopBar, spawnParticles, renderGrid, setHint }) {
  return {
    rain: {
      id:'rain', icon:'🌧', cls:'rain',
      title:'Дощ!',
      desc:'Усі поля политі. Посаджуй під дощ — буде бонус!',
      duration: () => 45 + Math.floor(Math.random() * 46),
      canStart: () => {
        if (!G) return false;
        return (G.cells||[]).some(c => c.state==='planted'||c.state==='growing'||c.state==='ready') || true;
      },
      onStart: () => {
        (G.cells||[]).forEach(cell => {
          if (cell.state==='planted'||cell.state==='growing') cell.waterBonus = true;
        });
        renderGrid();
      },
      onEnd: () => {},
      onSuccess: null,
    },
    pest: {
      id:'pest', icon:'🐛', cls:'pest',
      title:'Шкідники!',
      desc:'Прожени шкідників: 0/3',
      duration: () => 45 + Math.floor(Math.random() * 16),
      canStart: () => {
        if (!G) return false;
        return (G.cells||[]).filter(c => (c.state==='planted'||c.state==='growing') && c.state!=='auto_running').length >= 2;
      },
      onStart: () => {
        const candidates = (G.cells||[])
          .map((c,i) => ({c,i}))
          .filter(({c,i}) => (c.state==='planted'||c.state==='growing') && !(G.autoFields||[]).some(af=>af.cellIndex===i&&af.active));
        const count = Math.min(3, candidates.length);
        const shuffled = candidates.sort(() => Math.random()-.5).slice(0, count);
        G.activeEvent.targets = shuffled.map(({i}) => i);
        G.activeEvent.cleared = 0;
        shuffled.forEach(({i}) => { G.cells[i].pest = true; });
        renderGrid();
        setHint('🐛 ШКІДНИКИ! Клікни на клітинки з 🐛 щоб прогнати. Швидше — буде нагорода!');
        addLog("🐛 З'явились шкідники! Переключись на Поле і клікай по заражених грядках!");
      },
      onEnd: () => {
        (G.cells||[]).forEach(cell => {
          if (cell.pest) { cell.pest = false; cell.pestFailed = true; }
        });
        renderGrid();
      },
      onSuccess: () => {
        addLog('🏆 Шкідників переможено! +50XP +100🪙');
        addXP(50); G.coins += 100;
        updateTopBar();
        spawnParticles('🎉', window.innerWidth/2, window.innerHeight/3);
      },
    },
  };
}

export function startRandomEvent(G, EVENT_DEFS, { addLog, renderEventBanner }) {
  if (!G || G.activeEvent) return;
  if ((G.stats.harvested||0) < 3 && (G.day||1) < 2) return;
  const available = Object.values(EVENT_DEFS).filter(d => d.canStart());
  if (!available.length) return;
  const def = available[Math.floor(Math.random() * available.length)];
  const duration = def.duration();
  G.activeEvent = {id:def.id, startedAt:Date.now(), duration:duration*1000, endsAt:Date.now()+duration*1000};
  if (def.onStart) def.onStart();
  renderEventBanner();
  addLog(def.icon + ' ' + def.title + ' ' + def.desc);
}

export function tickEvent(G, EVENT_DEFS, { renderEventBanner, endEvent }) {
  if (!G) return;
  if (!G.activeEvent) {
    if (!G.eventStats) G.eventStats = {lastEvent:0, harvests:0};
    const now = Date.now();
    const minInterval = 120000, maxInterval = 300000;
    if (!G.eventStats.nextEventAt) {
      G.eventStats.nextEventAt = now + minInterval + Math.random() * (maxInterval - minInterval);
    }
    if (now >= G.eventStats.nextEventAt) {
      startRandomEvent(G, EVENT_DEFS, {addLog: ()=>{}, renderEventBanner});
      G.eventStats.nextEventAt = now + minInterval + Math.random() * (maxInterval - minInterval);
    }
    return;
  }
  const ev = G.activeEvent;
  const remaining = Math.max(0, ev.endsAt - Date.now());
  renderEventBanner();
  if (remaining <= 0) endEvent(false);
}

export function endEvent(G, success, EVENT_DEFS, { addLog, hideEventBanner, renderGrid, saveCurrentGame }) {
  if (!G || !G.activeEvent) return;
  const ev = G.activeEvent;
  const def = EVENT_DEFS[ev.id];
  if (!def) { G.activeEvent = null; hideEventBanner(); return; }
  if (def.onEnd) def.onEnd();
  if (success && def.onSuccess) def.onSuccess();
  if (!success && ev.id === 'pest') {
    const failed = (ev.targets||[]).filter(i => G.cells[i]?.pest).length;
    if (failed > 0) addLog('🐛 Шкідники зіпсували ' + failed + ' грядок (-20% врожаю)');
  }
  G.activeEvent = null;
  hideEventBanner();
  saveCurrentGame();
}
