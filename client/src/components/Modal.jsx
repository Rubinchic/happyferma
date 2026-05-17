import React, { useState } from 'react'
import useStore from '../store/gameStore.js'
import { CROPS, PRODUCTS, ANIMALS_DEF } from '../store/gameStore.js'

function AutoFieldModal({ cellIndex }) {
  const { G, startAutoField, stopAutoFieldWithPartialHarvest, waterAutoField, closeModal } = useStore()
  const [selectedCrop, setSelectedCrop] = useState(G.selectedCrop || 'wheat')
  const [budget, setBudget] = useState('')

  const af = (G.autoFields || []).find(a => a.cellIndex === cellIndex && a.active)

  if (af) {
    const crop = CROPS.find(c => c.id === af.cropId)
    const outProd = crop ? PRODUCTS[crop.gives] : null
    const totalDur = af.totalDuration || 1
    const elapsed = Date.now() - af.startTime
    const remaining = Math.max(0, totalDur - elapsed)
    const remainSec = Math.ceil(remaining / 1000)
    const rm = Math.floor(remainSec / 60), rs = remainSec % 60
    const pct = Math.min(100, elapsed / totalDur * 100)
    const cycleDur = af.cycleDuration || (totalDur / af.totalCycles)
    const cyclesDone = Math.min(af.totalCycles, Math.floor(elapsed / cycleDur))
    const collectedAmt = cyclesDone * (crop ? crop.givesAmt : 0)
    const remainingCycles = af.totalCycles - cyclesDone
    const moneyRefund = Math.floor(remainingCycles * (crop ? crop.cost : 0) * 0.5)
    const alreadyWatered = G.cells[cellIndex]?.waterBonus

    return (
      <div>
        <h3>⚙️ Авто-поле #{cellIndex + 1}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0' }}>
          <span style={{ fontSize: '3rem' }}>{crop?.emoji}</span>
          <div>
            <div style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.1rem', color: '#1a472a' }}>{crop?.name}</div>
            <div style={{ fontSize: '.82rem', color: '#888' }}>Всього {af.totalCycles} циклів</div>
          </div>
        </div>
        <div style={{ height: 14, background: '#eee', borderRadius: 8, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#52b788,#f39c12)', width: pct.toFixed(1) + '%', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, margin: '10px 0' }}>
          <div style={{ background: '#f0f7f0', borderRadius: 10, padding: 8, textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#e67e22' }}>{rm > 0 ? rm + 'хв ' + rs + 'с' : rs + 'с'}</div>
            <div style={{ fontSize: '.7rem', color: '#888' }}>⏱ Залишилось</div>
          </div>
          <div style={{ background: '#f0f7f0', borderRadius: 10, padding: 8, textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#27ae60' }}>{cyclesDone} / {af.totalCycles}</div>
            <div style={{ fontSize: '.7rem', color: '#888' }}>✅ Циклів готово</div>
          </div>
          <div style={{ background: '#fff8e1', borderRadius: 10, padding: 8, textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#27ae60' }}>{collectedAmt} {outProd?.emoji}</div>
            <div style={{ fontSize: '.7rem', color: '#888' }}>📦 Вже готово</div>
          </div>
          <div style={{ background: '#fff8e1', borderRadius: 10, padding: 8, textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#3498db' }}>{af.totalCycles * (crop?.givesAmt || 0)} {outProd?.emoji}</div>
            <div style={{ fontSize: '.7rem', color: '#888' }}>🎯 Всього отримаєш</div>
          </div>
        </div>
        {!alreadyWatered && (
          <button
            disabled={G.water <= 0}
            onClick={() => { waterAutoField(cellIndex); closeModal() }}
            style={{ width: '100%', padding: 9, border: 'none', borderRadius: 10, background: G.water <= 0 ? '#ccc' : 'linear-gradient(135deg,#3498db,#1a6fa8)', color: '#fff', fontWeight: 900, cursor: G.water <= 0 ? 'default' : 'pointer', marginBottom: 8 }}
          >
            💧 Полити (скоротити час на 30%) — є {G.water} 💧
          </button>
        )}
        {alreadyWatered && (
          <div style={{ background: '#e3f2fd', borderRadius: 10, padding: 8, textAlign: 'center', fontSize: '.85rem', color: '#1a6fa8', marginBottom: 10 }}>
            💧 Поле вже поливано — час скорочено на 30%!
          </div>
        )}
        <div style={{ background: '#ffeaea', borderRadius: 10, padding: 8, fontSize: '.8rem', color: '#c0392b', marginBottom: 10 }}>
          🛑 Якщо зупинити: отримаєш <b>{collectedAmt} {outProd?.emoji}</b> + повернеться <b>{moneyRefund}🪙</b> (50% за незакінчені цикли)
        </div>
        <div className="modal-btns">
          <button className="modal-btn secondary" onClick={closeModal}>Закрити</button>
          <button className="modal-btn primary" style={{ background: 'linear-gradient(135deg,#e74c3c,#c0392b)' }}
            onClick={() => { stopAutoFieldWithPartialHarvest(cellIndex); closeModal() }}>
            🛑 Зупинити і забрати
          </button>
        </div>
      </div>
    )
  }

  const crop = CROPS.find(c => c.id === selectedCrop) || CROPS[0]
  const defBudget = crop.cost * 5
  const b = Math.max(crop.cost, parseInt(budget) || defBudget)
  const cycles = Math.max(1, Math.floor(b / crop.cost))
  const actualCost = cycles * crop.cost
  const totalSec = cycles * crop.time
  const mins = Math.floor(totalSec / 60), secs = totalSec % 60
  const timeStr = mins > 0 ? (mins + 'хв ' + (secs > 0 ? secs + 'с' : '')) : (secs + 'с')
  const totalOutput = cycles * crop.givesAmt
  const outProd = PRODUCTS[crop.gives]
  const canAfford = G.coins >= actualCost

  return (
    <div>
      <h3>⚙️ Авто-поле #{cellIndex + 1}</h3>
      <p style={{ fontSize: '.78rem', color: '#666', marginBottom: 8 }}>Вклади монети — поле саме виросте і збере весь врожай одним великим таймером!</p>
      <div className="auto-modal-crop-grid">
        {CROPS.map(c => {
          const locked = G.level < c.unlockLevel
          return (
            <div key={c.id}
              className={'auto-crop-opt' + (c.id === selectedCrop ? ' selected' : '') + (locked ? ' locked-opt' : '')}
              onClick={() => { if (!locked) setSelectedCrop(c.id) }}
            >
              <div style={{ fontSize: '1.8rem' }}>{c.emoji}</div>
              <div style={{ fontSize: '.72rem', fontWeight: 800 }}>{c.name}</div>
              <div style={{ color: '#888', fontSize: '.62rem' }}>{c.cost}🪙 • {c.time}с</div>
              {locked && <div style={{ color: '#e74c3c', fontSize: '.6rem' }}>🔒 Рвн.{c.unlockLevel}</div>}
            </div>
          )
        })}
      </div>
      <div className="auto-input-row">
        <label>💰 Інвестиція:</label>
        <input type="number" value={budget || defBudget} min={crop.cost} step={crop.cost}
          onChange={e => setBudget(e.target.value)}
          style={{ width: 130, padding: '7px 10px', borderRadius: 8, border: '2px solid #d4edda', fontSize: '1.1rem', fontWeight: 800, textAlign: 'center' }} />
        <span style={{ color: '#888', fontSize: '.8rem' }}>🪙</span>
      </div>
      <div className="auto-preview-box">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, textAlign: 'center' }}>
          <div style={{ background: 'rgba(82,183,136,.15)', borderRadius: 10, padding: 10, border: '2px solid #52b788' }}>
            <div style={{ fontSize: '1.8rem' }}>{crop.emoji}</div>
            <div style={{ fontWeight: 800, color: '#1a472a', fontSize: '1.15rem' }}>{cycles} циклів</div>
            <div style={{ fontSize: '.7rem', color: '#888' }}>по {crop.cost}🪙</div>
          </div>
          <div style={{ background: 'rgba(243,156,18,.15)', borderRadius: 10, padding: 10, border: '2px solid #f39c12' }}>
            <div style={{ fontSize: '1.8rem' }}>⏱</div>
            <div style={{ fontWeight: 800, color: '#e67e22', fontSize: '1.15rem' }}>{timeStr}</div>
            <div style={{ fontSize: '.7rem', color: '#888' }}>загальний час</div>
          </div>
          <div style={{ background: 'rgba(231,76,60,.12)', borderRadius: 10, padding: 10, border: '2px solid #e74c3c' }}>
            <div style={{ fontSize: '1.8rem' }}>💸</div>
            <div style={{ fontWeight: 800, color: '#c0392b', fontSize: '1.15rem' }}>{actualCost}🪙</div>
            <div style={{ fontSize: '.7rem', color: '#888' }}>витратиш (є {G.coins})</div>
          </div>
          <div style={{ background: 'rgba(52,152,219,.12)', borderRadius: 10, padding: 10, border: '2px solid #3498db' }}>
            <div style={{ fontSize: '1.8rem' }}>{outProd?.emoji || '📦'}</div>
            <div style={{ fontWeight: 800, color: '#1565c0', fontSize: '1.15rem' }}>{totalOutput} {outProd?.name || ''}</div>
            <div style={{ fontSize: '.7rem', color: '#888' }}>отримаєш</div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: '.85rem', fontWeight: 800, textAlign: 'center', padding: '7px 10px', borderRadius: 8, background: canAfford ? 'rgba(39,174,96,.12)' : 'rgba(231,76,60,.12)', color: canAfford ? '#27ae60' : '#e74c3c' }}>
          {canAfford ? '✅ Вистачає! Можна запускати.' : '❌ Не вистачає ' + (actualCost - G.coins) + '🪙'}
        </div>
      </div>
      <div className="modal-btns" style={{ marginTop: 12 }}>
        <button className="modal-btn secondary" onClick={closeModal}>Скасувати</button>
        <button className="modal-btn primary" disabled={!canAfford}
          onClick={() => { startAutoField(cellIndex, selectedCrop, b); closeModal() }}>
          🚀 Запустити! (-{actualCost}🪙)
        </button>
      </div>
    </div>
  )
}

function FeedModal({ uid }) {
  const { G, feedAnimal, closeModal } = useStore()
  const animal = G.animals.find(a => a.uid === uid)
  if (!animal) return null
  const def = ANIMALS_DEF.find(a => a.id === animal.type)
  const feedable = Object.entries(G.inventory).filter(([k, v]) => v > 0 && PRODUCTS[k]?.feedValue > 0 && PRODUCTS[k]?.category === 'crop')

  if (!feedable.length) {
    return (
      <div>
        <h3>{def?.emoji} Годувати {animal.name}</h3>
        <p>😢 В тебе нема їжі для тварин! Збери врожай з поля.</p>
        <div className="modal-btns"><button className="modal-btn secondary" onClick={closeModal}>Зрозуміло</button></div>
      </div>
    )
  }

  return (
    <div>
      <h3>{def?.emoji} Годувати {animal.name}</h3>
      <p>Поточне щастя: {animal.happiness}% • Потрібно корму: {def?.feedCost} очок</p>
      <div className="feed-select">
        {feedable.map(([k, v]) => {
          const p = PRODUCTS[k]
          return (
            <div key={k} className="feed-option" onClick={() => { feedAnimal(uid, k); closeModal() }}>
              <span className="fo-emoji">{p.emoji}</span>
              <div className="fo-name">{p.name}</div>
              <div className="fo-qty">в наявності: {v} | +{p.feedValue} щастя</div>
            </div>
          )
        })}
      </div>
      <div className="modal-btns"><button className="modal-btn secondary" onClick={closeModal}>Скасувати</button></div>
    </div>
  )
}

function ConfirmModal({ title, desc, onConfirm }) {
  const closeModal = useStore(s => s.closeModal)
  return (
    <div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="modal-btns">
        <button className="modal-btn secondary" onClick={closeModal}>Скасувати</button>
        <button className="modal-btn primary" onClick={() => { closeModal(); onConfirm?.() }}>Підтвердити</button>
      </div>
    </div>
  )
}

export default function Modal() {
  const { modal, closeModal } = useStore()
  if (!modal) return null

  let content = null
  if (modal.type === 'autoField') content = <AutoFieldModal cellIndex={modal.cellIndex} />
  else if (modal.type === 'feed') content = <FeedModal uid={modal.uid} />
  else if (modal.type === 'confirm') content = <ConfirmModal title={modal.title} desc={modal.desc} onConfirm={modal.onConfirm} />

  return (
    <div id="modalOverlay" style={{ display: 'flex' }} onClick={e => { if (e.target.id === 'modalOverlay') closeModal() }}>
      <div id="modalBox">{content}</div>
    </div>
  )
}
