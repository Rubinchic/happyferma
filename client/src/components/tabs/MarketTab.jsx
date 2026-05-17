import React from 'react'
import useStore from '../../store/gameStore.js'
import { PRODUCTS } from '../../store/gameStore.js'

export default function MarketTab() {
  const { G, sellOne, sellAll } = useStore()
  if (!G) return null

  return (
    <div style={{ padding: '0 8px 20px' }}>
      <div id="marketGrid" className="market-grid">
        {Object.entries(PRODUCTS).map(([k, p]) => {
          const qty = G.inventory[k] || 0
          return (
            <div key={k} className="market-item">
              <span className="me">{p.emoji}</span>
              <div className="mn">{p.name}</div>
              <div className="mp">💰 {p.sellPrice} монет/шт</div>
              <div style={{ fontSize: '.8rem', color: '#888', marginBottom: 8 }}>У тебе: {qty}</div>
              <button className="sell-btn" disabled={qty <= 0} onClick={() => sellOne(k)}>Продати 1</button>
              {qty > 1 && (
                <button className="sell-all-btn" onClick={() => sellAll(k)}>Продати всі ({qty})</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
