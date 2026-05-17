import React from 'react'
import useStore from '../store/gameStore.js'

export default function StatsBar() {
  const G = useStore(s => s.G)
  const getInvCap = useStore(s => s.getInvCap)
  const getInvCount = useStore(s => s.getInvCount)
  const hint = useStore(s => s.hint)
  if (!G) return null

  const invCap = getInvCap()
  const invUsed = getInvCount()
  const xpPct = Math.min(100, (G.xp / G.xpNext) * 100)

  return (
    <>
      <div id="statsBar" className="stats-bar">
        <div className="stat">💰 <b>{G.coins}</b></div>
        <div className="stat">
          ⭐ <b>{G.level}</b>
          <div className="xp-mini-bar" style={{ width: 36, height: 4, background: '#eee', borderRadius: 2, overflow: 'hidden', display: 'inline-block', marginLeft: 4 }}>
            <div style={{ width: xpPct + '%', height: '100%', background: '#f39c12', borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: '.72rem', color: '#888' }}>{G.xp}/{G.xpNext}</span>
        </div>
        <div className="stat">💧 <b>{G.water}</b>/{G.maxWater}</div>
        <div className={'stat' + (invUsed >= invCap ? ' inv-full' : '')}>📦 <b>{invUsed}</b>/{invCap}</div>
        <div className="stat">🌅 День <b>{G.day}</b></div>
      </div>
      {hint && (
        <div id="hintBox" className="hint-box" style={{ textAlign: 'center', margin: '0 16px 4px', padding: '6px 12px', fontSize: '.85rem' }}>
          {hint}
        </div>
      )}
    </>
  )
}
