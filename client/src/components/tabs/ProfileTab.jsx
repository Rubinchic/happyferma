import React from 'react'
import useStore from '../../store/gameStore.js'
import { ACHIEVEMENTS } from '../../store/gameStore.js'

const ACH_TARGETS = {
  harvest10: 10, harvest50: 50, harvest200: 200, harvest500: 500, harvest1000: 1000,
  animals3: 3, animals5: 5, animals10: 10, collect100: 100, collect500: 500,
  coins500: 500, coins2000: 2000, coins10000: 10000, coins100000: 100000,
  earned50000: 50000, level3: 3, level5: 5, level10: 10, level15: 15,
  sell20: 20, sell100: 100, sell500: 500, water20: 20, water100: 100,
  craft10: 10, auto_complete: 5, unlock10cells: 10,
}

function getAchievementProgress(G, id) {
  const map = {
    harvest10: () => G.stats.harvested, harvest50: () => G.stats.harvested,
    harvest200: () => G.stats.harvested, harvest500: () => G.stats.harvested, harvest1000: () => G.stats.harvested,
    animals3: () => G.animals.length, animals5: () => G.animals.length, animals10: () => G.animals.length,
    collect100: () => G.stats.productsCollected || 0, collect500: () => G.stats.productsCollected || 0,
    coins500: () => G.coins, coins2000: () => G.coins, coins10000: () => G.coins, coins100000: () => G.coins,
    earned50000: () => G.stats.earned || 0,
    level3: () => G.level, level5: () => G.level, level10: () => G.level, level15: () => G.level,
    sell20: () => G.stats.sold || 0, sell100: () => G.stats.sold || 0, sell500: () => G.stats.sold || 0,
    water20: () => G.stats.watered || 0, water100: () => G.stats.watered || 0,
    craft10: () => G.stats.crafted || 0,
    auto_complete: () => G.stats.autoCompleted || 0,
    unlock10cells: () => (G.cells || []).filter(x => x.unlocked !== false).length,
  }
  return map[id] ? map[id]() : null
}

export default function ProfileTab() {
  const G = useStore(s => s.G)
  if (!G) return null

  const xpPct = Math.min(100, (G.xp / G.xpNext) * 100)
  const earned = G.achievements || []

  return (
    <div style={{ padding: '0 8px 20px' }}>
      <div id="profileCard" className="profile-card">
        <div id="profAvatar" className="prof-avatar">🧑‍🌾</div>
        <div id="profName" className="prof-name">{G.displayName}</div>
        <div id="profJoined" className="prof-joined">Фермер з {G.joinedDate || 'сьогодні'}</div>
        <div className="prof-level-wrap">
          <div>⭐ Рівень <b id="profLevel">{G.level}</b></div>
          <div id="profXPWrap" className="prof-xp-bar-wrap">
            <div id="profXPBar" className="prof-xp-bar" style={{ width: xpPct + '%' }} />
          </div>
          <div style={{ fontSize: '.75rem', color: '#888' }}>
            XP: <span id="profXP">{G.xp}</span>/<span id="profXPNext">{G.xpNext}</span>
          </div>
        </div>
        <div className="prof-stats">
          <div className="ps"><div className="psv" id="profCoins">{G.coins}</div><div className="psl">💰 Монет</div></div>
          <div className="ps"><div className="psv" id="profHarvests">{G.stats.harvested}</div><div className="psl">🌾 Зібрано</div></div>
          <div className="ps"><div className="psv" id="profAnimals">{G.stats.animalsBought || 0}</div><div className="psl">🐾 Тварин</div></div>
          <div className="ps"><div className="psv" id="profEarned">{G.stats.earned}</div><div className="psl">💸 Зароблено</div></div>
          <div className="ps"><div className="psv" id="profDays">{G.day}</div><div className="psl">📅 Днів</div></div>
          <div className="ps"><div className="psv" id="profXP2">{G.xp}</div><div className="psl">✨ XP</div></div>
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 20 }}>🏆 Досягнення ({earned.length}/{ACHIEVEMENTS.length})</div>
      <div id="achGrid" className="ach-grid">
        {ACHIEVEMENTS.map(a => {
          const isEarned = earned.includes(a.id)
          const cur = !isEarned ? getAchievementProgress(G, a.id) : null
          const tgt = !isEarned ? ACH_TARGETS[a.id] : null
          const showBar = cur !== null && tgt !== null
          const pct = showBar ? Math.min(100, Math.round(cur / tgt * 100)) : 0
          const rewardStr = (a.xp > 0 ? '+' + a.xp + 'XP' : '') + (a.xp > 0 && a.coins > 0 ? ' ' : '') + (a.coins > 0 ? '+' + a.coins + '🪙' : '')
          return (
            <div key={a.id} className={'ach' + (isEarned ? ' earned' : '')}>
              <span className="ach-icon">{a.icon}</span>
              <div style={{ fontWeight: 700, fontSize: '.8rem' }}>{a.name}</div>
              <div style={{ fontSize: '.72rem', color: '#888' }}>{a.desc}</div>
              {rewardStr && <div style={{ fontSize: '.68rem', color: '#f39c12', marginTop: 2 }}>{rewardStr}</div>}
              {showBar && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ height: 4, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#52b788', width: pct + '%', borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: '.65rem', color: '#aaa', textAlign: 'right' }}>{cur}/{tgt}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
