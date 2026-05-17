import React from 'react'
import useStore from '../../store/gameStore.js'
import { QUEST_POOL } from '../../data/quests.js'

export default function QuestsTab() {
  const G = useStore(s => s.G)
  if (!G) return null

  const active = G.quests?.active || []
  const completed = G.quests?.completed || []

  return (
    <div style={{ padding: '0 8px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 12, color: '#888', fontSize: '.85rem' }}>
        Активних: {active.length}/3 • Виконано: {completed.length}
      </div>

      {active.length === 0 && (
        <div style={{ textAlign: 'center', color: '#aaa', padding: '30px 0', fontSize: '.9rem' }}>
          📜 Нових квестів поки немає.<br />Підвищуй рівень щоб відкрити більше!
        </div>
      )}

      {active.map(aq => {
        const d = QUEST_POOL.find(q => q.id === aq.id)
        if (!d) return null
        const pct = Math.min(100, Math.round((aq.progress || 0) / d.target * 100))
        return (
          <div key={aq.id} className="quest-card">
            <div className="quest-header">
              <span className="quest-icon">{d.icon}</span>
              <div>
                <div className="quest-name">{d.name}</div>
                <div className="quest-desc">{d.desc}</div>
              </div>
              <div className="quest-reward">+{d.rewardCoins}🪙 +{d.rewardXP}XP</div>
            </div>
            <div className="quest-progress">
              <div className="quest-bar">
                <div className="quest-bar-fill" style={{ width: pct + '%' }} />
              </div>
              <div className="quest-progress-text">{aq.progress || 0}/{d.target}</div>
            </div>
          </div>
        )
      })}

      {completed.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#888', marginBottom: 8 }}>✅ Виконані квести:</div>
          {completed.map(id => {
            const d = QUEST_POOL.find(q => q.id === id)
            if (!d) return null
            return (
              <div key={id} className="quest-card completed" style={{ opacity: .6 }}>
                <span className="quest-icon">{d.icon}</span>
                <span style={{ fontWeight: 700 }}>{d.name}</span>
                <span style={{ marginLeft: 'auto', color: '#27ae60', fontWeight: 900 }}>✅</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
