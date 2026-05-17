import React from 'react'
import useStore from '../../store/gameStore.js'
import { CROPS, PRODUCTS } from '../../store/gameStore.js'
import { getCellUnlockCost, getCellUnlockLevel, getAutoFieldSlots } from '../../systems/state.js'

function CropCell({ cell, index }) {
  const { G, cellClick } = useStore()
  const af = (G.autoFields || []).find(a => a.cellIndex === index && a.active)
  const isAuto = cell.state === 'auto_running' || !!af
  const crop = cell.crop ? CROPS.find(c => c.id === cell.crop) : null

  let cls = 'cell ' + (cell.unlocked === false ? 'locked-cell' : cell.state)
  if (cell.waterBonus && (cell.state === 'planted' || cell.state === 'growing')) cls += ' watered'
  if (cell.pest) cls += ' pest-cell'
  if (isAuto) cls += ' auto_running'
  const canUnlock = cell.unlocked === false && G.level >= (CROPS[0]?.unlockLevel || 1)
  if (canUnlock) cls += ' can-unlock'

  if (cell.unlocked === false) {
    const cost = getCellUnlockCost(index)
    const lvl = getCellUnlockLevel(index)
    return (
      <div className={cls} onClick={() => cellClick(index)}>
        <div className="cell-lock-icon">🔒</div>
        <div className="cell-lock-cost">{G.level < lvl ? 'Рвн.' + lvl : cost + '🪙'}</div>
      </div>
    )
  }

  if (isAuto && af) {
    const now = Date.now()
    const elapsed = now - af.startTime
    const totalDur = af.totalDuration || 1
    const remaining = Math.max(0, totalDur - elapsed)
    const pct = Math.min(100, elapsed / totalDur * 100)
    const rm = Math.floor(remaining / 60000), rs = Math.floor((remaining % 60000) / 1000)
    const timeStr = rm > 0 ? rm + 'хв ' + rs + 'с' : rs + 'с'
    return (
      <div className={cls} onClick={() => cellClick(index)}>
        <div style={{ fontSize: '1.5rem' }}>{crop?.emoji || '⚙️'}</div>
        <div style={{ fontSize: '.55rem', fontWeight: 900, color: '#3498db' }} data-countdown>⚙️ {timeStr}</div>
        <div className="prog-bar"><div className="prog-fill" style={{ width: pct.toFixed(1) + '%', background: 'linear-gradient(90deg,#3498db,#27ae60)' }} /></div>
      </div>
    )
  }

  if (cell.state === 'empty') {
    return <div className={cls} onClick={() => cellClick(index)} />
  }

  if (cell.state === 'planted' || cell.state === 'growing') {
    const growTime = cell.waterBonus ? (crop?.time || 10) * 0.7 : (crop?.time || 10)
    const elapsed = (Date.now() - cell.plantedAt) / 1000
    const pct = Math.min(100, (elapsed / growTime) * 100)
    return (
      <div className={cls} onClick={() => cellClick(index)}>
        {cell.pest && <span style={{ fontSize: '1rem', position: 'absolute', top: 2, right: 2 }}>🐛</span>}
        <div style={{ fontSize: '1.5rem' }}>{cell.state === 'growing' ? crop?.emoji : '🌱'}</div>
        <div className="prog-bar"><div className="prog-fill" style={{ width: pct + '%' }} /></div>
        {cell.waterBonus && <div className="water-drop">💧</div>}
      </div>
    )
  }

  if (cell.state === 'ready') {
    return (
      <div className={cls} onClick={() => cellClick(index)}>
        <div style={{ fontSize: '1.8rem' }}>{crop?.emoji}</div>
        <div className="ready-indicator">✨</div>
      </div>
    )
  }

  return <div className={cls} onClick={() => cellClick(index)} />
}

export default function FarmTab() {
  const G = useStore(s => s.G)
  const { selectTool, selectCrop, harvestAll } = useStore()
  const logEntries = useStore(s => s.logEntries)
  if (!G) return null

  const autoSlots = getAutoFieldSlots(G)

  const tools = [
    { id: 'plant',   emoji: '🌱', label: 'Садити' },
    { id: 'water',   emoji: '💧', label: 'Полити' },
    { id: 'harvest', emoji: '🌾', label: 'Зібрати' },
    { id: 'plow',    emoji: '⛏',  label: 'Скопати' },
    { id: 'auto',    emoji: '⚙️', label: 'Авто', disabled: autoSlots <= 0 },
  ]

  return (
    <div className="farm-layout">
      {/* Left: tools + crop shop */}
      <div className="side-panel">
        <div className="card">
          <h3>🛠 Дії</h3>
          {tools.map(t => (
            <button key={t.id}
              className={'tool-btn' + (G.selectedTool === t.id ? ' selected' : '')}
              onClick={() => selectTool(t.id)}
              disabled={t.disabled}
            >
              <span className="te">{t.emoji}</span> {t.label}
            </button>
          ))}
          <button className="harvest-all" onClick={harvestAll}>🌾 Зібрати все</button>
        </div>

        {G.selectedTool === 'plant' && (
          <div className="card">
            <h3>🌱 Насіння</h3>
            {CROPS.map(crop => {
              const locked = G.level < crop.unlockLevel
              return (
                <div key={crop.id}
                  className={'shop-item' + (G.selectedCrop === crop.id ? ' selected' : '') + (locked ? ' disabled' : '')}
                  onClick={() => !locked && selectCrop(crop.id)}
                >
                  <span className="ie">{crop.emoji}</span>
                  <div>
                    <div className="item-name">{crop.name}{locked ? ' 🔒' + crop.unlockLevel + 'рвн' : ''}</div>
                    <div className="item-price">💰{crop.cost}🪙</div>
                    <div className="item-grow">⏱{crop.time}с → {PRODUCTS[crop.gives]?.emoji}{crop.givesAmt}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Center: farm grid */}
      <div className="farm-main">
        <div className="farm-grid">
          {G.cells.map((cell, i) => (
            <CropCell key={i} cell={cell} index={i} />
          ))}
        </div>
      </div>

      {/* Right: log */}
      <div className="side-panel">
        <div className="card">
          <h3>📋 Журнал</h3>
          <div className="log-box">
            {logEntries.map((msg, i) => (
              <div key={i} className="log-entry">{msg}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
