import React from 'react'
import useStore from '../../store/gameStore.js'
import { PRODUCTS } from '../../store/gameStore.js'
import { isCityOrdersUnlocked } from '../../systems/state.js'

export default function OrdersTab() {
  const { G, fulfillCityOrder, fulfillTOrder } = useStore()
  if (!G) return null

  const t = G.tourist || {}
  const cityOrders = G.cityOrders?.orders || []
  const unlocked = isCityOrdersUnlocked(G)
  const now = Date.now()

  function ItemList({ items }) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0' }}>
        {items.map((item, i) => {
          const p = PRODUCTS[item.k]
          const have = G.inventory[item.k] || 0
          const ok = have >= item.qty
          return (
            <span key={i} style={{ padding: '3px 8px', borderRadius: 8, background: ok ? 'rgba(39,174,96,.15)' : 'rgba(231,76,60,.12)', border: '1.5px solid ' + (ok ? '#52b788' : '#e74c3c'), fontSize: '.82rem', fontWeight: 700, color: ok ? '#1a472a' : '#c0392b' }}>
              {p?.emoji} {p?.name} {have}/{item.qty}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div id="ordersContent" style={{ padding: '0 8px 28px' }}>

      {/* Tourist section */}
      <div className="orders-section-title" style={{ color: '#333', margin: '18px 0 10px', fontWeight: 900 }}>🧳 Турист</div>

      {!t.visit ? (
        <div style={{ background: 'rgba(0,0,0,.05)', borderRadius: 14, padding: '24px 18px', margin: '10px 0 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.2rem', marginBottom: 10, opacity: .5 }}>🧳</div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 6, opacity: .75 }}>Туриста зараз немає</div>
          <div style={{ fontSize: '.82rem', opacity: .5 }}>Він завітає несподівано — будь готовий!</div>
        </div>
      ) : (
        <div>
          {/* Tourist header */}
          <div style={{ background: 'linear-gradient(135deg,#7b1fa2,#9c27b0)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: '2.5rem' }}>🧳</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Турист на фермі!</div>
                <div style={{ fontSize: '.8rem', opacity: .85 }}>Виконай замовлення щоб відкрити наступне</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.72rem', opacity: .8 }}>Залишилось</div>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: (t.visit.expiresAt - now) < 180000 ? '#ffcc00' : '#fff' }}>
                  {(() => { const r = Math.max(0, Math.ceil((t.visit.expiresAt - now) / 1000)); const m = Math.floor(r / 60), s = r % 60; return m > 0 ? m + 'хв ' + s + 'с' : s + 'с' })()}
                </div>
              </div>
            </div>
            {/* Chain progress */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'center' }}>
              {[0, 1, 2, 3, 4].map(i => {
                const ci = t.visit.chainIndex
                const d = i < ci, cur = i === ci
                return (
                  <React.Fragment key={i}>
                    <span style={{ fontSize: '1.1rem' }}>{d ? '✅' : cur ? '🔵' : i === ci + 1 ? '⬜' : '🔒'}</span>
                    {i < 4 && <span style={{ opacity: .3, fontSize: '.7rem' }}>──</span>}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Tourist orders */}
          {t.visit.orders.map((order, i) => {
            const ci = t.visit.chainIndex
            const isDone = i < ci, isCur = i === ci, isFog = i > ci + 1
            if (isDone) return (
              <div key={i} style={{ background: 'rgba(39,174,96,.1)', border: '2px solid rgba(39,174,96,.4)', borderRadius: 14, padding: '10px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, opacity: .6 }}>
                <span style={{ fontSize: '1.8rem' }}>✅</span>
                <div style={{ fontWeight: 700 }}>Замовлення {i + 1} — виконано!</div>
              </div>
            )
            if (isFog) return (
              <div key={i} style={{ background: 'rgba(0,0,0,.05)', border: '2px dashed rgba(0,0,0,.12)', borderRadius: 14, padding: 18, marginBottom: 10, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 4 }}>🔒</div>
                <div style={{ color: 'rgba(0,0,0,.35)', fontSize: '.82rem' }}>Замовлення {i + 1}</div>
              </div>
            )
            const ok = isCur && order.items.every(it => (G.inventory[it.k] || 0) >= it.qty)
            return (
              <div key={i} className="order-card" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Замовлення {i + 1} {isCur ? '← поточне' : ''}</div>
                <ItemList items={order.items} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <div style={{ fontSize: '.85rem', color: '#666' }}>+{order.coins}🪙 +{order.xp}XP</div>
                  {isCur && (
                    <button className={'order-fulfill-btn' + (ok ? '' : ' disabled')} disabled={!ok} onClick={() => fulfillTOrder(order.id)}>
                      {ok ? '🚚 Доставити' : '❌ Не вистачає'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* City orders section */}
      <div className="orders-section-title" style={{ color: '#333', margin: '18px 0 10px', fontWeight: 900 }}>🏙️ Міські замовлення</div>

      {!unlocked ? (
        <div style={{ background: 'rgba(0,0,0,.05)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🚚</div>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>Побудуй вантажівку в "Дворі" щоб відкрити!</div>
          <div style={{ fontSize: '.82rem', color: '#888' }}>Потрібен рівень 2 та ресурси</div>
        </div>
      ) : cityOrders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', padding: '20px 0' }}>Немає активних замовлень</div>
      ) : (
        cityOrders.map(order => {
          const canFulfill = order.items.every(i => (G.inventory[i.k] || 0) >= i.qty)
          return (
            <div key={order.id} className="order-card" style={{ marginBottom: 12 }}>
              <ItemList items={order.items} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ fontSize: '.85rem', color: '#666' }}>+{order.coins}🪙 +{order.xp}XP</div>
                <button className={'order-fulfill-btn' + (canFulfill ? '' : ' disabled')} disabled={!canFulfill} onClick={() => fulfillCityOrder(order.id)}>
                  {canFulfill ? '🚚 Доставити' : '❌ Не вистачає'}
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
