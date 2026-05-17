import React from 'react'
import useStore from '../store/gameStore.js'

export default function TopBar() {
  const { G, logout } = useStore()
  if (!G) return null

  return (
    <header id="topBar" className="topbar">
      <div className="top-left">
        <div className="game-title">🌻 Весела Ферма</div>
      </div>
      <div className="top-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="user-badge">
          <span className="user-avatar">🧑‍🌾</span>
          <span className="user-name">{G.displayName}</span>
        </div>
        <button className="logout-btn" onClick={logout} title="Вийти">🚪</button>
      </div>
    </header>
  )
}
