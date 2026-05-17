import React from 'react'
import useStore from '../../store/gameStore.js'
import { PRODUCTS } from '../../store/gameStore.js'
import { invCount, getInvCap, groundCount } from '../../systems/state.js'

export default function InventoryTab() {
  const { G, sellOne, sellAll, pickupGround } = useStore()
  if (!G) return null

  const invUsed = invCount(G)
  const invCap = getInvCap(G)
  const gUsed = groundCount(G)

  const items = Object.entries(G.inventory).filter(([, v]) => v > 0)
  const grounds = (G.groundDrops || []).filter(d => d.qty > 0)

  return (
    <div style={{ padding: '0 8px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 8, fontSize: '.85rem', color: '#888' }}>
        Комора: {invUsed}/{invCap} • На землі: {gUsed}/220
      </div>

      <div className="inventory-grid">
        {items.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#aaa', padding: '30px 0', fontSize: '.9rem' }}>
            Комора порожня 📦<br />Збери врожай або продукти тварин!
          </div>
        )}
        {items.map(([k, v]) => {
          const p = PRODUCTS[k]
          if (!p) return null
          return (
            <div key={k} className="inv-item">
              <span className="inv-emoji">{p.emoji}</span>
              <div className="inv-name">{p.name}</div>
              <div className="inv-qty">{v}</div>
              <div className="inv-price">💰{p.sellPrice}/шт</div>
              <div className="inv-actions">
                <button className="sell-btn" onClick={() => sellOne(k)}>Продати 1</button>
                {v > 1 && <button className="sell-all-btn" onClick={() => sellAll(k)}>Продати всі ({v})</button>}
              </div>
            </div>
          )
        })}
      </div>

      {grounds.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#888', marginBottom: 6 }}>🌿 На землі (тимчасово):</div>
          {grounds.map(d => {
            const p = PRODUCTS[d.k] || { emoji: '📦', name: d.k }
            const remain = Math.max(0, Math.ceil(((d.expiresAt || 0) - Date.now()) / 1000))
            const m = Math.floor(remain / 60), s = remain % 60
            const t = m > 0 ? m + 'хв ' + s + 'с' : s + 'с'
            return (
              <div key={d.k} className="ground-item" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                <span style={{ color: '#f39c12', fontWeight: 900 }}>×{d.qty}</span>
                <span style={{ color: '#aaa', fontSize: '.8rem' }}>⏱ {t}</span>
                <button style={{ marginLeft: 'auto', border: 'none', background: '#d4edda', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }} onClick={() => pickupGround(d.k)}>Підняти</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
