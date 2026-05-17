import { create } from 'zustand'
import { CROPS } from '../data/crops.js'
import { PRODUCTS } from '../data/products.js'
import { ANIMALS_DEF, HOUSES_DEF } from '../data/animals.js'
import { RECIPES, RECIPE_CATEGORIES } from '../data/recipes.js'
import { ACHIEVEMENTS } from '../data/achievements.js'
import { TOURIST_ORDER_TEMPLATES } from '../data/orders.js'
import { YARD_DEF, GROUND_TTL_MS, GROUND_CAP_QTY } from '../data/yard.js'
import {
  defaultGameState, invCount, getInvCap, getCraftSlots, getAutoFieldSlots,
  getCityOrderSlots, isCityOrdersUnlocked, getTruckRewardMul,
  pruneGroundDrops, groundCount, addToGround, addToInventory, canAcceptToStorage,
  getHouseState, countAnimals, getHouseProduceBonus, getCellUnlockCost, getCellUnlockLevel,
  hasReqItems, reqItemsToText, deductReqItems, migrateAutoFields,
} from '../systems/state.js'
import { apiLogin, apiRegister, apiSave, saveKnownUser, loadKnownUsers } from '../api/server.js'
import { generateDailyQuests } from '../systems/quests.js'
import { QUEST_POOL } from '../data/quests.js'

// ── helpers ──────────────────────────────────────────────────────────────────

function randInt(a, b) { return Math.floor(a + Math.random() * (b - a + 1)) }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function generateCityOrder(G) {
  const pool = Object.entries(PRODUCTS).filter(([, p]) => p && p.sellPrice > 0)
  const count = Math.random() < 0.65 ? 1 : 2
  const items = []; const used = new Set()
  for (let i = 0; i < count; i++) {
    const [k, p] = pick(pool)
    if (used.has(k)) { i--; continue }
    used.add(k)
    const base = p.category === 'crafted' ? randInt(1, 2) : p.category === 'animal' ? randInt(2, 4) : randInt(4, 8)
    items.push({ k, qty: base })
  }
  const rawValue = items.reduce((s, it) => s + (PRODUCTS[it.k]?.sellPrice || 0) * it.qty, 0)
  const mul = getTruckRewardMul(G)
  const coins = Math.max(60, Math.round(rawValue * (0.95 + Math.random() * 0.35) * mul))
  const xp = Math.max(15, Math.round((coins / 10) * (0.7 + Math.random() * 0.3)))
  return { id: 'cord_' + Date.now() + '_' + Math.floor(Math.random() * 9999), items, coins, xp }
}

function initCityOrders(G) {
  if (!G.cityOrders) G.cityOrders = { orders: [], nextRefreshAt: 0 }
  if (!isCityOrdersUnlocked(G)) return
  const slots = getCityOrderSlots(G)
  if (slots <= 0) return
  const now = Date.now()
  if (!G.cityOrders.nextRefreshAt || now >= G.cityOrders.nextRefreshAt) {
    G.cityOrders.orders = []
    G.cityOrders.nextRefreshAt = now + 10 * 60 * 1000
  }
  while ((G.cityOrders.orders || []).length < slots) G.cityOrders.orders.push(generateCityOrder(G))
  if (G.cityOrders.orders.length > slots) G.cityOrders.orders = G.cityOrders.orders.slice(0, slots)
}

function initTourist(G) {
  if (!G.tourist) G.tourist = { nextVisitAt: Date.now() + nextTouristDelay(), visit: null }
}

function nextTouristDelay() { return (8 + Math.random() * 17) * 60000 }

function normalizeG(g) {
  if (!g.craftQueue) g.craftQueue = []
  if (!g.autoFields) g.autoFields = []
  if (!g.houseFeed) g.houseFeed = {}
  if (!g.houses) g.houses = { chicken_coop: { level: 1, built: true } }
  if (!g.yard) g.yard = { hqLevel: 1, barnLevel: 1, kitchenLevel: 1, truckLevel: 0 }
  if (typeof g.yard.hqLevel !== 'number') g.yard.hqLevel = 1
  if (typeof g.yard.barnLevel !== 'number') g.yard.barnLevel = 1
  if (typeof g.yard.kitchenLevel !== 'number') g.yard.kitchenLevel = 1
  if (typeof g.yard.truckLevel !== 'number') g.yard.truckLevel = 0
  if (!g.groundDrops) g.groundDrops = []
  if (!g.cityOrders) g.cityOrders = { orders: [], nextRefreshAt: 0 }
  if (!g.cityOrders.orders) g.cityOrders.orders = []
  if (!g.quests) g.quests = { active: [], completed: [], lastRefresh: 0 }
  if (!g.eventStats) g.eventStats = { nextEventAt: 0 }
  if (!g.stats) g.stats = { planted: 0, harvested: 0, watered: 0, earned: 0, sold: 0, animalsBought: 0, productsCollected: 0 }
  migrateAutoFields(g)
  generateDailyQuests(g)
  return g
}

// ── Achievement helpers ───────────────────────────────────────────────────────

const ACH_TARGETS = {
  harvest10: 10, harvest50: 50, harvest200: 200, harvest500: 500, harvest1000: 1000,
  animals3: 3, animals5: 5, animals10: 10, collect100: 100, collect500: 500,
  coins500: 500, coins2000: 2000, coins10000: 10000, coins100000: 100000,
  earned50000: 50000, level3: 3, level5: 5, level10: 10, level15: 15,
  sell20: 20, sell100: 100, sell500: 500, water20: 20, water100: 100,
  craft10: 10, auto_complete: 5, unlock10cells: 10,
}

// ── Store ─────────────────────────────────────────────────────────────────────

let _floatIdCounter = 0

const useStore = create((set, get) => {
  // commit: trigger re-render after G mutation
  function commit() {
    const { G } = get()
    set({ G: { ...G } })
  }

  function addLog(msg) {
    set(s => ({ logEntries: [msg, ...s.logEntries].slice(0, 15) }))
  }

  function setHint(text) {
    set({ hint: text })
    clearTimeout(get()._hintTimer)
    const t = setTimeout(() => set({ hint: null }), 3000)
    set({ _hintTimer: t })
  }

  function spawnParticle(emoji) {
    const id = ++_floatIdCounter
    set(s => ({ floatTexts: [...s.floatTexts, { id, text: emoji }] }))
    setTimeout(() => set(s => ({ floatTexts: s.floatTexts.filter(f => f.id !== id) })), 1200)
  }

  // ── Achievement ──────────────────────────────────────────────────────────────
  function checkAchievement(G, id, value) {
    if (!G.achievements) G.achievements = []
    if (G.achievements.includes(id)) return
    const tgt = ACH_TARGETS[id]
    if (tgt !== undefined && (value || 0) < tgt) return
    G.achievements.push(id)
    const ach = ACHIEVEMENTS.find(a => a.id === id)
    if (!ach) return
    const rw = []
    if (ach.xp > 0) { G.xp += ach.xp; rw.push('+' + ach.xp + 'XP') }
    if (ach.coins > 0) { G.coins += ach.coins; rw.push('+' + ach.coins + '🪙') }
    addLog('🏆 ' + ach.icon + ' ' + ach.name + (rw.length ? ' (' + rw.join(', ') + ')' : ''))
    spawnParticle('🏆')
  }

  function checkAllAchievements(G) {
    checkAchievement(G, 'coins500', G.coins)
    checkAchievement(G, 'coins2000', G.coins)
    checkAchievement(G, 'coins10000', G.coins)
    checkAchievement(G, 'coins100000', G.coins)
    checkAchievement(G, 'earned50000', G.stats.earned || 0)
    checkAchievement(G, 'harvest10', G.stats.harvested)
    checkAchievement(G, 'harvest50', G.stats.harvested)
    checkAchievement(G, 'harvest200', G.stats.harvested)
    checkAchievement(G, 'harvest500', G.stats.harvested)
    checkAchievement(G, 'harvest1000', G.stats.harvested)
    checkAchievement(G, 'animals3', G.animals.length)
    checkAchievement(G, 'animals5', G.animals.length)
    checkAchievement(G, 'animals10', G.animals.length)
    checkAchievement(G, 'collect100', G.stats.productsCollected || 0)
    checkAchievement(G, 'collect500', G.stats.productsCollected || 0)
    checkAchievement(G, 'sell20', G.stats.sold || 0)
    checkAchievement(G, 'sell100', G.stats.sold || 0)
    checkAchievement(G, 'sell500', G.stats.sold || 0)
    checkAchievement(G, 'water20', G.stats.watered || 0)
    checkAchievement(G, 'water100', G.stats.watered || 0)
    checkAchievement(G, 'level3', G.level)
    checkAchievement(G, 'level5', G.level)
    checkAchievement(G, 'level10', G.level)
    checkAchievement(G, 'level15', G.level)
    const unl = (G.cells || []).filter(x => x.unlocked !== false).length
    checkAchievement(G, 'unlock10cells', unl)
    const gt = new Set((G.cells || []).filter(x => x.crop).map(x => x.crop))
    if (gt.size >= CROPS.length) checkAchievement(G, 'all_crops')
    const ot = new Set((G.animals || []).map(a => a.type))
    if (ot.size >= ANIMALS_DEF.length) checkAchievement(G, 'all_animals')
    if ((G.stats.autoCompleted || 0) >= 5) checkAchievement(G, 'auto_complete', G.stats.autoCompleted)
  }

  // ── XP ───────────────────────────────────────────────────────────────────────
  function addXP(G, amount) {
    G.xp += amount
    while (G.xp >= G.xpNext) {
      G.xp -= G.xpNext
      G.level++
      G.xpNext = Math.round(G.xpNext * 1.6)
      G.maxWater = Math.min(20, G.maxWater + 2)
      addLog('⭐ РІВЕНЬ ' + G.level + '! Нові можливості розблоковані!')
      setHint('🎉 Вітаємо з рівнем ' + G.level + '!')
      checkAchievement(G, 'level3', G.level)
      checkAchievement(G, 'level5', G.level)
      checkAchievement(G, 'level10', G.level)
      checkAchievement(G, 'level15', G.level)
    }
  }

  // ── Quest helpers ────────────────────────────────────────────────────────────
  function updateQP(G, type, val, extra) {
    if (!G.quests?.active) return
    let changed = false
    // QUEST_POOL imported at top
    G.quests.active.forEach(aq => {
      const d = QUEST_POOL.find(q => q.id === aq.id)
      if (!d || d.type !== type) return
      if (type === 'harvest' && d.crop && d.crop !== extra) return
      if (type === 'collect' && d.product && d.product !== extra) return
      if (type === 'craft' && d.product && d.product !== extra) return
      aq.progress = Math.min(d.target, (aq.progress || 0) + (val || 1))
      changed = true
    })
    if (changed) checkQuestCompl(G)
  }

  function checkQuestCompl(G) {
    if (!G.quests?.active) return
    // QUEST_POOL imported at top
    const done = G.quests.active.filter(aq => {
      const d = QUEST_POOL.find(q => q.id === aq.id)
      return d && aq.progress >= d.target
    })
    done.forEach(aq => {
      const d = QUEST_POOL.find(q => q.id === aq.id)
      G.quests.active = G.quests.active.filter(q => q.id !== aq.id)
      if (!G.quests.completed) G.quests.completed = []
      G.quests.completed.push(aq.id)
      G.coins += d.rewardCoins
      addXP(G, d.rewardXP)
      addLog('✅ Квест: ' + d.icon + ' ' + d.name + ' (+' + d.rewardCoins + '🪙 +' + d.rewardXP + 'XP)')
      spawnParticle('✅')
      generateDailyQuests(G)
    })
  }

  // ── Craft helpers ────────────────────────────────────────────────────────────
  function canCraft(G, recipe) {
    return Object.entries(recipe.ingredients).every(([k, qty]) => (G.inventory[k] || 0) >= qty)
  }

  function finishCraft(G, recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId)
    if (!recipe) return
    if (!addToInventory(G, recipe.output, recipe.outputAmt, { source: 'craft', allowGround: true })) {
      const entry = G.craftQueue.find(e => e.recipeId === recipeId)
      const now = Date.now()
      if (!entry._blockedNoticeAt || now - entry._blockedNoticeAt > 15000) {
        entry._blockedNoticeAt = now
        addLog('📦 Нема місця для результату крафту. Звільни комору або апгрейдни амбар у "Дворі".')
      }
      return
    }
    G.craftQueue = G.craftQueue.filter(e => e.recipeId !== recipeId)
    addXP(G, recipe.xp)
    G.stats.crafted = (G.stats.crafted || 0) + 1
    checkAchievement(G, 'first_craft')
    checkAchievement(G, 'craft10', G.stats.crafted)
    if (recipe.output === 'pizza') checkAchievement(G, 'craft_pizza')
    updateQP(G, 'craft', recipe.outputAmt, recipe.output)
    addLog('✅ Готово! ' + PRODUCTS[recipe.output].emoji + ' ' + recipe.name + ' × ' + recipe.outputAmt + ' в коморі!')
    spawnParticle(PRODUCTS[recipe.output].emoji)
  }

  // ── Event helpers ────────────────────────────────────────────────────────────
  function buildEventCtx(G) {
    return {
      rain: {
        id: 'rain', icon: '🌧', cls: 'rain',
        title: 'Дощ!', desc: 'Усі поля политі. Посаджуй під дощ — буде бонус!',
        duration: () => 45 + Math.floor(Math.random() * 46),
        canStart: () => !!(G.cells || []).length,
        onStart: () => {
          (G.cells || []).forEach(cell => {
            if (cell.state === 'planted' || cell.state === 'growing') cell.waterBonus = true
          })
        },
        onEnd: () => {},
        onSuccess: null,
      },
      pest: {
        id: 'pest', icon: '🐛', cls: 'pest',
        title: 'Шкідники!', desc: 'Прожени шкідників: 0/3',
        duration: () => 45 + Math.floor(Math.random() * 16),
        canStart: () => (G.cells || []).filter(c =>
          (c.state === 'planted' || c.state === 'growing') && c.state !== 'auto_running'
        ).length >= 2,
        onStart: () => {
          const candidates = (G.cells || []).map((c, i) => ({ c, i }))
            .filter(({ c, i }) =>
              (c.state === 'planted' || c.state === 'growing') &&
              !(G.autoFields || []).some(af => af.cellIndex === i && af.active)
            )
          const count = Math.min(3, candidates.length)
          const shuffled = candidates.sort(() => Math.random() - .5).slice(0, count)
          G.activeEvent.targets = shuffled.map(({ i }) => i)
          G.activeEvent.cleared = 0
          shuffled.forEach(({ i }) => { G.cells[i].pest = true })
          setHint('🐛 ШКІДНИКИ! Клікни на клітинки з 🐛 щоб прогнати. Швидше — буде нагорода!')
          addLog("🐛 З'явились шкідники! Переключись на Поле і клікай по заражених грядках!")
        },
        onEnd: () => {
          (G.cells || []).forEach(cell => {
            if (cell.pest) { cell.pest = false; cell.pestFailed = true }
          })
        },
        onSuccess: () => {
          addLog('🏆 Шкідників переможено! +50XP +100🪙')
          addXP(G, 50); G.coins += 100
          spawnParticle('🎉')
        },
      },
    }
  }

  function startRandomEvent(G) {
    if (!G || G.activeEvent) return
    if ((G.stats.harvested || 0) < 3 && (G.day || 1) < 2) return
    const defs = buildEventCtx(G)
    const available = Object.values(defs).filter(d => d.canStart())
    if (!available.length) return
    const def = available[Math.floor(Math.random() * available.length)]
    const duration = def.duration()
    G.activeEvent = { id: def.id, startedAt: Date.now(), duration: duration * 1000, endsAt: Date.now() + duration * 1000 }
    if (def.onStart) def.onStart()
    addLog(def.icon + ' ' + def.title + ' ' + def.desc)
  }

  function endEvent(G, success) {
    if (!G || !G.activeEvent) return
    const ev = G.activeEvent
    const def = buildEventCtx(G)[ev.id]
    if (!def) { G.activeEvent = null; return }
    if (def.onEnd) def.onEnd()
    if (success && def.onSuccess) def.onSuccess()
    if (!success && ev.id === 'pest') {
      const failed = (ev.targets || []).filter(i => G.cells[i]?.pest).length
      if (failed > 0) addLog('🐛 Шкідники зіпсували ' + failed + ' грядок (-20% врожаю)')
    }
    G.activeEvent = null
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function saveGame(G, user) {
    if (!G || !user) return
    try { await apiSave(user, G) } catch (e) { /* silent */ }
  }

  return {
    // ── state ────────────────────────────────────────────────────────────────
    G: null,
    currentUser: null,
    currentTab: 'farm',
    logEntries: [],
    hint: null,
    modal: null,
    floatTexts: [],
    knownUsers: loadKnownUsers(),
    selectedAnimalUid: null,
    _hintTimer: null,
    _tickCount: 0,

    // Exposed data refs for components
    CROPS, PRODUCTS, ANIMALS_DEF, HOUSES_DEF, RECIPES, RECIPE_CATEGORIES,
    ACHIEVEMENTS, YARD_DEF,

    // ── auth ─────────────────────────────────────────────────────────────────
    async login(username, password) {
      try {
        const { res, data } = await apiLogin(username, password)
        if (!res.ok) return data.error || 'Помилка входу'
        let g = (typeof data.data === 'string') ? JSON.parse(data.data) : data.data
        if (!g.displayName) g.displayName = username
        g = normalizeG(g)
        saveKnownUser(username)
        set({ G: g, currentUser: username, knownUsers: loadKnownUsers(), logEntries: [] })
        addLog('👋 Привіт, ' + g.displayName + '! Вдалого дня на фермі!')
        return null
      } catch (e) {
        return 'Сервер не відповідає.'
      }
    },

    async register(username, password) {
      try {
        const g = defaultGameState(username)
        const { res, data } = await apiRegister(username, password, g)
        if (!res.ok) return data.error || 'Помилка реєстрації'
        saveKnownUser(username)
        set({ G: normalizeG(g), currentUser: username, knownUsers: loadKnownUsers(), logEntries: [] })
        addLog('🎉 Ласкаво просимо, ' + g.displayName + '! Починаємо гру!')
        return null
      } catch (e) {
        return 'Помилка сервера'
      }
    },

    logout() {
      const { G, currentUser } = get()
      saveGame(G, currentUser)
      set({ G: null, currentUser: null, currentTab: 'farm', logEntries: [], selectedAnimalUid: null })
    },

    switchTab(tab) {
      set({ currentTab: tab })
      if (tab === 'orders') {
        const { G } = get()
        if (G) { initCityOrders(G); initTourist(G); commit() }
      }
    },

    // ── game tick (called by useGameLoop) ────────────────────────────────────
    gameTick() {
      const { G, _tickCount } = get()
      if (!G) return
      const ticks = _tickCount + 1
      set({ _tickCount: ticks })
      let changed = false

      // grow crops
      G.cells.forEach(cell => {
        if (cell.state === 'auto_running') return
        if (cell.state === 'planted' || cell.state === 'growing') {
          const crop = CROPS.find(c => c.id === cell.crop)
          if (!crop) return
          const elapsed = (Date.now() - cell.plantedAt) / 1000
          const growTime = cell.waterBonus ? crop.time * 0.7 : crop.time
          if (elapsed >= growTime * 0.3 && cell.state === 'planted') { cell.state = 'growing'; changed = true }
          if (elapsed >= growTime) { cell.state = 'ready'; changed = true }
        }
      })

      // animal happiness decay & production
      G.animals.forEach(animal => {
        const def = ANIMALS_DEF.find(a => a.id === animal.type)
        if (!def) return
        if (ticks % 30 === 0) {
          animal.happiness = Math.max(0, animal.happiness - def.happinessDecay)
          changed = true
        }
        const elapsed = (Date.now() - animal.lastProduced) / 1000
        const bonus = getHouseProduceBonus(G, animal.type, HOUSES_DEF)
        const effectiveTime = def.produceTime / bonus
        if (elapsed >= effectiveTime && animal.happiness >= 30) {
          animal.pendingProducts = (animal.pendingProducts || 0) + 1
          animal.lastProduced = Date.now()
          changed = true
        }
      })

      // craft tick
      if (G.craftQueue?.length) {
        G.craftQueue.forEach(entry => {
          if (Date.now() - entry.startTime >= entry.duration) finishCraft(G, entry.recipeId)
        })
        changed = true
      }

      // auto-fields tick
      if (G.autoFields?.length) {
        const toRemove = []
        G.autoFields.forEach(af => {
          if (!af.active) return
          const cell = G.cells[af.cellIndex]
          if (!cell) return
          const crop = CROPS.find(c => c.id === af.cropId)
          if (!crop) return
          const elapsed = Date.now() - af.startTime
          if (elapsed >= af.totalDuration) {
            const totalOutput = af.totalCycles * crop.givesAmt
            if (!addToInventory(G, crop.gives, totalOutput, { source: 'auto' })) {
              const n = Date.now()
              if (!af._blockedNoticeAt || n - af._blockedNoticeAt > 15000) {
                af._blockedNoticeAt = n
                addLog('📦 Авто-поле готове, але комора переповнена. Звільни місце або апгрейдни амбар у "Дворі".')
              }
              cell.state = 'auto_running'; cell.crop = af.cropId
            } else {
              G.stats.harvested += af.totalCycles
              addXP(G, af.totalCycles * 10)
              cell.state = 'empty'; cell.crop = null; cell.plantedAt = null; cell.waterBonus = false
              G.stats.autoCompleted = (G.stats.autoCompleted || 0) + 1
              checkAchievement(G, 'first_auto')
              checkAchievement(G, 'auto_complete', G.stats.autoCompleted)
              updateQP(G, 'auto', 1)
              addLog('✅ Авто-поле #' + (af.cellIndex + 1) + ' готово! +' + totalOutput + ' ' + crop.emoji + ' ' + (PRODUCTS[crop.gives]?.name || '') + ' в комору!')
              spawnParticle(crop.emoji)
              toRemove.push(af.cellIndex)
            }
          } else {
            cell.state = 'auto_running'; cell.crop = af.cropId
          }
          changed = true
        })
        toRemove.forEach(idx => { G.autoFields = G.autoFields.filter(a => a.cellIndex !== idx) })
      }

      // event tick
      try {
        if (!G.activeEvent) {
          const now = Date.now()
          if (!G.eventStats) G.eventStats = { nextEventAt: 0 }
          if (!G.eventStats.nextEventAt) {
            G.eventStats.nextEventAt = now + 120000 + Math.random() * 180000
          }
          if (now >= G.eventStats.nextEventAt) {
            startRandomEvent(G)
            G.eventStats.nextEventAt = now + 120000 + Math.random() * 180000
            changed = true
          }
        } else {
          const ev = G.activeEvent
          const remaining = Math.max(0, ev.endsAt - Date.now())
          if (remaining <= 0) { endEvent(G, false); changed = true }
        }
      } catch (e) { G.activeEvent = null }

      // tourist/orders tick
      if (ticks % 30 === 0) {
        initTourist(G)
        initCityOrders(G)
        const t = G.tourist
        if (t && !t.visit && Date.now() >= t.nextVisitAt) {
          const shuffled = [...TOURIST_ORDER_TEMPLATES].sort(() => Math.random() - .5)
          t.visit = {
            startedAt: Date.now(), expiresAt: Date.now() + 900000,
            chainIndex: 0,
            orders: shuffled.slice(0, 5).map((tmpl, i) => ({
              id: 'tord_' + i + '_' + Date.now(),
              items: tmpl.items.map(x => ({ ...x })),
              coins: tmpl.coins, xp: tmpl.xp,
            })),
            completedCount: 0,
          }
          addLog('🧳 Турист завітав на ферму! У нього 5 замовлень — встигни за 15 хвилин!')
          spawnParticle('🧳')
          changed = true
        }
        if (t?.visit && Date.now() >= t.visit.expiresAt) {
          const done = t.visit.completedCount; const total = t.visit.orders.length
          if (done < total) addLog('🧳 Турист пішов... Виконано ' + done + '/' + total + ' замовлень.')
          t.visit = null; t.nextVisitAt = Date.now() + nextTouristDelay()
          changed = true
        }
      }

      if (ticks % 20 === 0) checkAllAchievements(G)

      if (changed) commit()
    },

    regenWater() {
      const { G } = get()
      if (!G) return
      if (G.water < G.maxWater) { G.water = Math.min(G.maxWater, G.water + 1); commit() }
    },

    newDay() {
      const { G } = get()
      if (!G) return
      G.day++; G.water = G.maxWater
      addLog('🌅 Настав новий день ' + G.day + '! Вода поповнена.')
      commit()
    },

    autoSave() {
      const { G, currentUser } = get()
      saveGame(G, currentUser)
    },

    // ── farm actions ─────────────────────────────────────────────────────────
    cellClick(i) {
      const { G } = get()
      if (!G) return
      const cell = G.cells[i]

      if (cell.pest && G.activeEvent?.id === 'pest') {
        cell.pest = false
        G.activeEvent.cleared = (G.activeEvent.cleared || 0) + 1
        addLog('🥊 Прогнав шкідника! ' + G.activeEvent.cleared + '/' + G.activeEvent.targets.length)
        spawnParticle('✨')
        if (G.activeEvent.cleared >= G.activeEvent.targets.length) endEvent(G, true)
        commit(); return
      }

      if (cell.unlocked === false) {
        get().unlockCell(i); return
      }

      if (cell.state === 'auto_running' || (G.autoFields || []).some(af => af.cellIndex === i && af.active)) {
        if (G.selectedTool === 'water') {
          if (cell.waterBonus) return setHint('Вже полито!')
          if (G.water <= 0) return setHint('Нема води!')
          G.water--; cell.waterBonus = true; G.stats.watered++
          const af = (G.autoFields || []).find(x => x.cellIndex === i && x.active)
          if (af) {
            const rem = Math.max(0, (af.totalDuration || 1) - (Date.now() - af.startTime))
            af.startTime -= rem * 0.3; af.waterBonus = true
          }
          addLog('💧 Авто-поле поливено! Час скорочено на 30%')
          checkAchievement(G, 'water20', G.stats.watered)
          commit(); return
        }
        set({ modal: { type: 'autoField', cellIndex: i } }); return
      }

      const tool = G.selectedTool
      if (tool === 'plant') {
        if (cell.state !== 'empty') return setHint('Скопай або збери спочатку!')
        const crop = CROPS.find(c => c.id === G.selectedCrop)
        if (!crop) return setHint('Обери культуру!')
        if (G.level < crop.unlockLevel) return setHint('🔒 ' + crop.name + ' доступна з рівня ' + crop.unlockLevel + '!')
        if (G.coins < crop.cost) return setHint('Не вистачає монет! Потрібно ' + crop.cost + '🪙')
        G.coins -= crop.cost
        cell.state = 'planted'; cell.crop = crop.id
        cell.plantedAt = Date.now()
        cell.waterBonus = !!(G.activeEvent?.id === 'rain')
        G.stats.planted++
        updateQP(G, 'plant', 1)
        addLog('🌱 Посаджено ' + crop.emoji + ' ' + crop.name)
        checkAchievement(G, 'first_plant')
        setHint(crop.emoji + ' Посаджено! Зросте через ' + crop.time + 'сек.')
      } else if (tool === 'water') {
        if (cell.state === 'empty' || cell.state === 'ready') return setHint('Нема що поливати!')
        if (cell.waterBonus) return setHint('Вже полито!')
        if (G.water <= 0) return setHint('Нема води! Зачекай поповнення (кожні 5 сек).')
        G.water--; cell.waterBonus = true; G.stats.watered++
        updateQP(G, 'water', 1)
        addLog('💧 Полито клітинку')
        setHint('💧 Ріст прискорено на 30%!')
        checkAchievement(G, 'water20', G.stats.watered)
      } else if (tool === 'harvest') {
        if (cell.state !== 'ready') return setHint('Ще не дозріло! Зачекай...')
        get().doHarvest(i); return
      } else if (tool === 'plow') {
        if (cell.state === 'empty') return setHint('Тут вже порожньо!')
        cell.state = 'empty'; cell.crop = null; cell.plantedAt = null; cell.waterBonus = false
        addLog('⛏ Клітинку скопано')
      } else if (tool === 'auto') {
        set({ modal: { type: 'autoField', cellIndex: i } }); return
      }
      commit(); saveGame(G, get().currentUser)
    },

    doHarvest(i) {
      const { G } = get()
      const cell = G.cells[i]
      if (cell.state !== 'ready') return
      const crop = CROPS.find(c => c.id === cell.crop)
      if (!crop) return
      let amt = cell.waterBonus ? crop.givesAmt + 1 : crop.givesAmt
      if (cell.pestFailed) { amt = Math.max(1, Math.floor(amt * 0.8)); cell.pestFailed = false }
      if (!addToInventory(G, crop.gives, amt, { source: 'harvest' })) {
        return addLog('📦 Комора переповнена! Апгрейдни амбар у "Дворі" або підніми речі з землі.')
      }
      const harvestedCropId = cell.crop
      cell.state = 'empty'; cell.crop = null; cell.plantedAt = null; cell.waterBonus = false
      G.stats.harvested++
      addXP(G, 15)
      checkAchievement(G, 'first_harvest')
      updateQP(G, 'harvest', 1, harvestedCropId)
      addLog(crop.emoji + ' Зібрано ' + crop.name + '! +' + amt + PRODUCTS[crop.gives].emoji + ' в комору')
      spawnParticle('+' + amt + crop.emoji)
      checkAchievement(G, 'harvest10', G.stats.harvested)
      checkAchievement(G, 'harvest50', G.stats.harvested)
      commit(); saveGame(G, get().currentUser)
    },

    harvestAll() {
      const { G } = get()
      if (!G) return
      let count = 0
      G.cells.forEach((cell, i) => {
        if (cell.state === 'ready' && cell.state !== 'auto_running') { get().doHarvest(i); count++ }
      })
      if (!count) setHint('Нема стиглих культур!')
      else addLog('🌾 Зібрано ' + count + ' культур!')
    },

    unlockCell(i) {
      const { G } = get()
      const cell = G.cells[i]
      if (!cell || cell.unlocked !== false) return
      const reqLvl = getCellUnlockLevel(i)
      if (G.level < reqLvl) return setHint('🔒 Потрібен рівень ' + reqLvl + ' для розблокування!')
      const cost = getCellUnlockCost(i)
      if (G.coins < cost) return setHint('❌ Потрібно ' + cost + '🪙 для розблокування!')
      G.coins -= cost; cell.unlocked = true
      G.unlockedCells = (G.unlockedCells || 7) + 1
      addLog('🔓 Клітинку #' + (i + 1) + ' розблоковано за ' + cost + '🪙!')
      checkAchievement(G, 'unlock10cells', G.cells.filter(x => x.unlocked !== false).length)
      commit(); saveGame(G, get().currentUser)
    },

    selectTool(tool) {
      const { G } = get()
      if (!G) return
      G.selectedTool = tool
      commit()
    },

    selectCrop(cropId) {
      const { G } = get()
      if (!G) return
      G.selectedCrop = cropId
      commit()
    },

    // ── auto-field ────────────────────────────────────────────────────────────
    startAutoField(cellIndex, cropId, budget) {
      const { G } = get()
      const crop = CROPS.find(c => c.id === cropId)
      if (!crop) return addLog('❌ Культура не знайдена!')
      const limit = getAutoFieldSlots(G)
      const active = (G.autoFields || []).filter(a => a.active).length
      const replacing = (G.autoFields || []).some(a => a.cellIndex === cellIndex && a.active)
      if (limit <= 0) return addLog('🔒 Авто-поля відкриваються після апгрейду HQ у "Дворі".')
      if (!replacing && active >= limit) return addLog('🚫 Ліміт авто-полів: ' + active + '/' + limit + '. Апгрейдни HQ у "Дворі".')
      const cycles = Math.max(1, Math.floor(budget / crop.cost))
      const actualCost = cycles * crop.cost
      if (G.coins < actualCost) return addLog('❌ Не вистачає монет! Потрібно ' + actualCost + '🪙')
      G.coins -= actualCost
      const cycleDuration = crop.time * 1000
      const totalDuration = cycles * cycleDuration
      const now = Date.now()
      if (!G.autoFields) G.autoFields = []
      G.autoFields = G.autoFields.filter(af => af.cellIndex !== cellIndex)
      G.autoFields.push({ cellIndex, cropId, cycles, cyclesLeft: cycles, totalCycles: cycles, active: true, startTime: now, totalDuration, cycleDuration })
      const cell = G.cells[cellIndex]
      cell.state = 'planted'; cell.crop = cropId; cell.plantedAt = now
      cell.waterBonus = !!(G.activeEvent?.id === 'rain')
      const m = Math.floor(cycles * crop.time / 60), s = (cycles * crop.time) % 60
      const tStr = m > 0 ? (m + 'хв ' + (s > 0 ? s + 'с' : '')) : (s + 'с')
      addLog('⚙️ Авто-поле #' + (cellIndex + 1) + ': ' + crop.emoji + ' ×' + cycles + ' циклів (' + tStr + ') запущено! -' + actualCost + '🪙')
      spawnParticle('⚙️')
      commit(); saveGame(G, get().currentUser)
    },

    stopAutoFieldWithPartialHarvest(cellIndex) {
      const { G } = get()
      if (!G.autoFields) return
      const af = G.autoFields.find(a => a.cellIndex === cellIndex && a.active)
      if (!af) return
      const crop = CROPS.find(c => c.id === af.cropId)
      const outProd = crop ? PRODUCTS[crop.gives] : null
      const totalDur = af.totalDuration || 1
      const elapsed = Date.now() - af.startTime
      const cycleDur = af.cycleDuration || (totalDur / af.totalCycles)
      const cyclesDone = Math.min(af.totalCycles, Math.floor(elapsed / cycleDur))
      const remainingCycles = af.totalCycles - cyclesDone
      const collectedAmt = cyclesDone * (crop ? crop.givesAmt : 0)
      if (collectedAmt > 0 && crop) {
        if (!addToInventory(G, crop.gives, collectedAmt, { source: 'auto' })) {
          addLog('📦 Нема місця щоб забрати врожай авто-поля. Звільни комору або апгрейдни амбар у "Дворі".')
          return
        }
        G.stats.harvested += cyclesDone
        addXP(G, cyclesDone * 10)
      }
      const moneyRefund = Math.floor(remainingCycles * (crop ? crop.cost : 0) * 0.5)
      if (moneyRefund > 0) G.coins += moneyRefund
      const parts = []
      if (collectedAmt > 0) parts.push('+' + collectedAmt + ' ' + (outProd ? outProd.emoji + ' ' + outProd.name : ''))
      if (moneyRefund > 0) parts.push('+' + moneyRefund + '🪙 повернуто')
      addLog('🛑 Авто-поле #' + (cellIndex + 1) + ' зупинено. ' + parts.join(' • '))
      const cell = G.cells[cellIndex]
      if (cell) { cell.state = 'empty'; cell.crop = null; cell.plantedAt = null; cell.waterBonus = false }
      G.autoFields = G.autoFields.filter(a => a.cellIndex !== cellIndex)
      commit(); saveGame(G, get().currentUser)
    },

    waterAutoField(cellIndex) {
      const { G } = get()
      if (!G || G.water <= 0) return setHint('Нема води!')
      const cell = G.cells[cellIndex]
      if (cell?.waterBonus) return setHint('Вже полито!')
      G.water--
      if (cell) cell.waterBonus = true
      const af = (G.autoFields || []).find(x => x.cellIndex === cellIndex && x.active)
      if (af) {
        const rem = Math.max(0, (af.totalDuration || 1) - (Date.now() - af.startTime))
        af.startTime -= rem * 0.3; af.waterBonus = true
      }
      G.stats.watered++
      checkAchievement(G, 'water20', G.stats.watered)
      addLog('💧 Авто-поле поливано! Час скорочено на 30%')
      commit(); saveGame(G, get().currentUser)
    },

    // ── animals ───────────────────────────────────────────────────────────────
    buyAnimal(animalId) {
      const { G } = get()
      const def = ANIMALS_DEF.find(a => a.id === animalId)
      if (!def) return
      const house = HOUSES_DEF.find(h => h.animalId === animalId)
      if (house) {
        const hs = getHouseState(G, house.id)
        if (!hs || !hs.built) return addLog('🏠 Спочатку побудуй ' + house.name + ' у вкладці "Будиночки"!')
        const capacity = house.levels[hs.level - 1].capacity
        if (countAnimals(G, animalId) >= capacity) return addLog('🚫 ' + house.name + ' заповнений (' + capacity + '/' + capacity + ')! Апгрейдуй у вкладці "Будиночки".')
      }
      if (G.coins < def.cost) return addLog('❌ Не вистачає монет для ' + def.name + '!')
      G.coins -= def.cost
      G.animalIdCounter = (G.animalIdCounter || 0) + 1
      G.animals.push({ uid: G.animalIdCounter, type: def.id, name: def.name + ' #' + G.animalIdCounter, happiness: 100, lastFed: Date.now(), lastProduced: Date.now(), pendingProducts: 0 })
      G.stats.animalsBought = (G.stats.animalsBought || 0) + 1
      addLog(def.emoji + ' Куплено ' + def.name + '! Годуй щоб отримувати продукти!')
      checkAchievement(G, 'first_animal')
      checkAchievement(G, 'animals5', G.animals.length)
      commit(); saveGame(G, get().currentUser)
    },

    feedAnimal(uid, productId) {
      const { G } = get()
      const animal = G.animals.find(a => a.uid === uid)
      if (!animal) return
      const def = ANIMALS_DEF.find(a => a.id === animal.type)
      if (!G.inventory[productId] || G.inventory[productId] <= 0) return addLog('Немає їжі!')
      G.inventory[productId]--
      if (G.inventory[productId] <= 0) delete G.inventory[productId]
      const feedVal = PRODUCTS[productId].feedValue
      animal.happiness = Math.min(100, animal.happiness + feedVal)
      animal.lastFed = Date.now()
      addLog(def.emoji + ' ' + animal.name + ' нагодовано ' + PRODUCTS[productId].emoji + '! +' + feedVal + '% щастя')
      commit(); saveGame(G, get().currentUser)
    },

    collectAnimalProduct(uid) {
      const { G } = get()
      const animal = G.animals.find(a => a.uid === uid)
      if (!animal || animal.pendingProducts <= 0) return
      const def = ANIMALS_DEF.find(a => a.id === animal.type)
      const prod = def.produces
      const amt = animal.pendingProducts
      if (!addToInventory(G, prod, amt, { source: 'animal' })) {
        return addLog('📦 Комора переповнена! Апгрейдни амбар у "Дворі" або підніми речі з землі.')
      }
      animal.pendingProducts = 0
      G.stats.productsCollected = (G.stats.productsCollected || 0) + amt
      updateQP(G, 'collect', amt, prod)
      checkAchievement(G, 'collect100', G.stats.productsCollected)
      checkAchievement(G, 'collect500', G.stats.productsCollected)
      addLog(def.emoji + ' Зібрано ' + amt + 'x' + (PRODUCTS[prod]?.emoji || '?') + ' від ' + animal.name + '!')
      spawnParticle('+' + amt + (PRODUCTS[prod]?.emoji || '?'))
      commit(); saveGame(G, get().currentUser)
    },

    collectAllProducts() {
      const { G } = get()
      if (!G) return
      let count = 0
      G.animals.forEach(a => { if (a.pendingProducts > 0) { get().collectAnimalProduct(a.uid); count++ } })
      if (!count) setHint('📦 Нема що збирати поки що!')
      else spawnParticle('📦')
    },

    feedAllAnimals() {
      const { G } = get()
      if (!G) return
      if (!G.houseFeed) G.houseFeed = {}
      let fed = 0
      G.animals.forEach(animal => {
        if (animal.happiness >= 80) return
        const house = HOUSES_DEF.find(h => h.animalId === animal.type)
        const preferred = house ? G.houseFeed[house.id] : null
        let key = null
        if (preferred && G.inventory[preferred] > 0) {
          key = preferred
        } else {
          const fallback = Object.entries(G.inventory).find(([k, v]) => v > 0 && PRODUCTS[k]?.feedValue > 0 && PRODUCTS[k]?.category === 'crop')
          if (fallback) key = fallback[0]
        }
        if (key) { get().feedAnimal(animal.uid, key); fed++ }
      })
      if (!fed) setHint('🥕 Нема голодних тварин або корму!')
    },

    releaseAnimal(uid) {
      const { G } = get()
      const animal = G.animals.find(a => a.uid === uid)
      if (!animal) return
      G.animals = G.animals.filter(a => a.uid !== uid)
      if (get().selectedAnimalUid === uid) set({ selectedAnimalUid: null })
      addLog(ANIMALS_DEF.find(a => a.id === animal.type)?.emoji + ' ' + animal.name + ' відпущена')
      commit(); saveGame(G, get().currentUser)
    },

    selectAnimal(uid) {
      set({ selectedAnimalUid: uid })
    },

    // ── houses ────────────────────────────────────────────────────────────────
    buildHouse(houseId) {
      const { G } = get()
      const house = HOUSES_DEF.find(h => h.id === houseId)
      if (!house) return
      if (G.level < house.unlockLevel) return addLog('🔒 Потрібен вищий рівень!')
      if (G.coins < house.buildCost) return addLog('❌ Не вистачає монет! Потрібно ' + house.buildCost + '🪙')
      G.coins -= house.buildCost
      if (!G.houses) G.houses = {}
      G.houses[houseId] = { level: 1, built: true }
      addLog('🏗 Побудовано ' + house.name + '!')
      commit(); saveGame(G, get().currentUser)
    },

    upgradeHouse(houseId) {
      const { G } = get()
      const house = HOUSES_DEF.find(h => h.id === houseId)
      if (!house) return
      const hs = getHouseState(G, houseId)
      if (!hs || !hs.built) return
      const nextLvl = house.levels[hs.level]
      if (!nextLvl) return addLog('Максимальний рівень!')
      if (nextLvl.reqLevel && G.level < nextLvl.reqLevel) return addLog('🔒 Потрібен рівень ' + nextLvl.reqLevel + ' для цього апгрейду!')
      if (G.coins < nextLvl.upgradeCost) return addLog('❌ Не вистачає монет! Потрібно ' + nextLvl.upgradeCost + '🪙')
      G.coins -= nextLvl.upgradeCost; hs.level++
      addLog('⬆️ ' + house.name + ' апгрейджено до рівня ' + hs.level + '! Ліміт тварин: ' + house.levels[hs.level - 1].capacity)
      spawnParticle('⭐')
      commit(); saveGame(G, get().currentUser)
    },

    setHouseFeed(houseId, productKey) {
      const { G } = get()
      if (!G.houseFeed) G.houseFeed = {}
      G.houseFeed[houseId] = productKey
      commit()
    },

    // ── craft ─────────────────────────────────────────────────────────────────
    startCraft(recipeId) {
      const { G } = get()
      const recipe = RECIPES.find(r => r.id === recipeId)
      if (!recipe) return
      const slots = getCraftSlots(G)
      const used = (G.craftQueue || []).length
      if (used >= slots) return addLog('🚫 Нема слотів крафту (' + used + '/' + slots + '). Апгрейдни кухню у "Дворі".')
      if (!canCraft(G, recipe)) return addLog('❌ Не вистачає інгредієнтів!')
      if (G.craftQueue.find(e => e.recipeId === recipeId)) return addLog('⏳ Вже готується!')
      if (!canAcceptToStorage(G, recipe.output, recipe.outputAmt)) return addLog('📦 Нема місця для результату крафту.')
      Object.entries(recipe.ingredients).forEach(([k, qty]) => {
        G.inventory[k] = (G.inventory[k] || 0) - qty
        if (G.inventory[k] <= 0) delete G.inventory[k]
      })
      G.craftQueue.push({ recipeId, startTime: Date.now(), duration: recipe.time * 1000 })
      addLog('🍳 Почали готувати: ' + recipe.name + '!')
      commit(); saveGame(G, get().currentUser)
    },

    // ── market ────────────────────────────────────────────────────────────────
    sellOne(k) {
      const { G } = get()
      if (!G.inventory[k] || G.inventory[k] <= 0) return
      const p = PRODUCTS[k]
      G.inventory[k]--
      if (!G.inventory[k]) delete G.inventory[k]
      G.coins += p.sellPrice; G.stats.earned += p.sellPrice; G.stats.sold = (G.stats.sold || 0) + 1
      addXP(G, 5)
      checkAchievement(G, 'first_sell')
      updateQP(G, 'sell', 1)
      addLog('💰 Продано ' + p.emoji + ' ' + p.name + ' за ' + p.sellPrice + '🪙')
      checkAchievement(G, 'coins500', G.coins); checkAchievement(G, 'coins2000', G.coins)
      checkAchievement(G, 'sell20', G.stats.sold); checkAchievement(G, 'sell100', G.stats.sold)
      commit(); saveGame(G, get().currentUser)
    },

    sellAll(k) {
      const { G } = get()
      if (!G.inventory[k] || G.inventory[k] <= 0) return
      const p = PRODUCTS[k]; const qty = G.inventory[k]
      const earned = qty * p.sellPrice
      delete G.inventory[k]
      G.coins += earned; G.stats.earned += earned; G.stats.sold = (G.stats.sold || 0) + qty
      addXP(G, qty * 5)
      checkAchievement(G, 'first_sell')
      updateQP(G, 'sell', qty)
      addLog('💰 Продано ' + qty + 'x' + p.emoji + ' за ' + earned + '🪙!')
      checkAchievement(G, 'coins500', G.coins); checkAchievement(G, 'coins2000', G.coins)
      commit(); saveGame(G, get().currentUser)
    },

    // ── yard ──────────────────────────────────────────────────────────────────
    upgradeYard(kind) {
      const { G } = get()
      if (!G?.yard) return
      const y = G.yard
      const defs = { hq: YARD_DEF.hq.levels, barn: YARD_DEF.barn.levels, kitchen: YARD_DEF.kitchen.levels, truck: YARD_DEF.truck.levels }
      const curMap = { hq: () => Math.max(1, y.hqLevel || 1), barn: () => Math.max(1, y.barnLevel || 1), kitchen: () => Math.max(1, y.kitchenLevel || 1), truck: () => Math.max(0, y.truckLevel || 0) }
      const setMap = { hq: (v) => { y.hqLevel = v }, barn: (v) => { y.barnLevel = v }, kitchen: (v) => { y.kitchenLevel = v }, truck: (v) => { y.truckLevel = v } }
      const cur = curMap[kind]()
      const next = defs[kind].find(l => l.lvl === cur + 1)
      if (!next) return addLog('✅ ' + kind + ' вже максимум!')
      if (G.level < next.reqLevel) return addLog('🔒 Потрібен рівень ' + next.reqLevel + '.')
      if (kind === 'truck') {
        if (!hasReqItems(G, next.reqItems)) return addLog('📦 Не вистачає ресурсів: ' + reqItemsToText(G, next.reqItems, true, (k) => PRODUCTS[k] || { emoji: '📦', name: k }))
        if (G.coins < next.upgradeCost) return addLog('❌ Не вистачає монет: потрібно ' + next.upgradeCost + '🪙')
        G.coins -= next.upgradeCost; deductReqItems(G, next.reqItems)
      } else {
        if (G.coins < next.upgradeCost) return addLog('❌ Не вистачає монет: потрібно ' + next.upgradeCost + '🪙')
        G.coins -= next.upgradeCost
      }
      setMap[kind](cur + 1)
      const nameMap = { hq: '🏚 HQ', barn: '📦 Амбар', kitchen: '🍳 Кухня', truck: '🚚 Вантажівка' }
      addLog('⬆️ ' + nameMap[kind] + ' апгрейджено до рівня ' + (cur + 1) + '!')
      if (kind === 'truck' && isCityOrdersUnlocked(G)) initCityOrders(G)
      commit(); saveGame(G, get().currentUser)
    },

    pickupGround(key) {
      const { G } = get()
      if (!G?.groundDrops) return
      pruneGroundDrops(G)
      const d = G.groundDrops.find(x => x.k === key)
      if (!d) return
      const qty = d.qty || 0; if (!qty) return
      const freeInv = Math.max(0, getInvCap(G) - invCount(G))
      if (freeInv <= 0) return addLog('📦 Комора повна. Апгрейдни амбар у "Дворі".')
      const take = Math.min(qty, freeInv)
      d.qty -= take; G.inventory[key] = (G.inventory[key] || 0) + take
      if (d.qty <= 0) G.groundDrops = G.groundDrops.filter(x => x !== d)
      addLog('📦 Підібрано з землі: ' + take + 'x' + (PRODUCTS[key]?.emoji || '📦') + ' ' + (PRODUCTS[key]?.name || key))
      commit(); saveGame(G, get().currentUser)
    },

    // ── orders ────────────────────────────────────────────────────────────────
    fulfillCityOrder(orderId) {
      const { G } = get()
      if (!G?.cityOrders?.orders) return
      const idx = G.cityOrders.orders.findIndex(o => o.id === orderId)
      if (idx < 0) return
      const order = G.cityOrders.orders[idx]
      if (!order.items.every(i => (G.inventory[i.k] || 0) >= i.qty)) return addLog('❌ Не вистачає товарів для доставки.')
      order.items.forEach(item => {
        G.inventory[item.k] = (G.inventory[item.k] || 0) - item.qty
        if (G.inventory[item.k] <= 0) delete G.inventory[item.k]
      })
      G.coins += order.coins; G.stats.earned += order.coins
      addXP(G, order.xp)
      addLog('🏙️ Доставка в місто виконана! +' + order.coins + '🪙 +' + order.xp + 'XP')
      spawnParticle('🚚')
      G.cityOrders.orders.splice(idx, 1)
      initCityOrders(G)
      commit(); saveGame(G, get().currentUser)
    },

    fulfillTOrder(orderId) {
      const { G } = get()
      if (!G?.tourist?.visit) return
      const visit = G.tourist.visit
      const ci = visit.chainIndex
      const order = visit.orders[ci]
      if (!order || order.id !== orderId) return
      if (!order.items.every(i => (G.inventory[i.k] || 0) >= i.qty)) return
      order.items.forEach(item => {
        G.inventory[item.k] = (G.inventory[item.k] || 0) - item.qty
        if (G.inventory[item.k] <= 0) delete G.inventory[item.k]
      })
      G.coins += order.coins; G.stats.earned += order.coins
      addXP(G, order.xp)
      visit.completedCount++; visit.chainIndex++
      addLog('🧳 Туристу доставлено! +' + order.coins + '🪙 +' + order.xp + 'XP')
      spawnParticle('💰')
      if (visit.chainIndex >= visit.orders.length) {
        G.coins += 500; addXP(G, 200)
        addLog('🎉 Всі 5 замовлень туриста виконано! Бонус +500🪙 +200XP!')
        spawnParticle('🎉')
        G.tourist.visit = null; G.tourist.nextVisitAt = Date.now() + nextTouristDelay()
      }
      commit(); saveGame(G, get().currentUser)
    },

    // ── modal helpers ─────────────────────────────────────────────────────────
    showModal(modal) { set({ modal }) },
    closeModal() { set({ modal: null }) },

    // ── log ───────────────────────────────────────────────────────────────────
    addLog,
    setHint,

    // ── computed helpers (used by components) ─────────────────────────────────
    getInvCap: () => { const { G } = get(); return G ? getInvCap(G) : 0 },
    getInvCount: () => { const { G } = get(); return G ? invCount(G) : 0 },
    getCraftSlots: () => { const { G } = get(); return G ? getCraftSlots(G) : 1 },
    getAutoFieldSlots: () => { const { G } = get(); return G ? getAutoFieldSlots(G) : 0 },
    getCityOrderSlots: () => { const { G } = get(); return G ? getCityOrderSlots(G) : 0 },
    isCityOrdersUnlocked: () => { const { G } = get(); return G ? isCityOrdersUnlocked(G) : false },
    getHouseState: (id) => { const { G } = get(); return G ? getHouseState(G, id) : null },
    countAnimals: (id) => { const { G } = get(); return G ? countAnimals(G, id) : 0 },
    hasReqItems: (reqItems) => { const { G } = get(); return G ? hasReqItems(G, reqItems) : false },
    groundCount: () => { const { G } = get(); return G ? groundCount(G) : 0 },
    getCellUnlockCost,
    getCellUnlockLevel,
    pruneGroundDrops: () => { const { G } = get(); if (G) pruneGroundDrops(G) },
  }
})

export default useStore
export { CROPS, PRODUCTS, ANIMALS_DEF, HOUSES_DEF, RECIPES, RECIPE_CATEGORIES, ACHIEVEMENTS, YARD_DEF }
