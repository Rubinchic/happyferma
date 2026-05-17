import React from 'react'
import useStore from '../store/gameStore.js'

export default function EventBanner() {
  const G = useStore(s => s.G)
  const switchTab = useStore(s => s.switchTab)
  if (!G) return null

  const ev = G.activeEvent
  const tourist = G.tourist?.visit

  if (!ev && !tourist) return null

  if (tourist && !ev) {
    const remaining = Math.max(0, Math.ceil((tourist.expiresAt - Date.now()) / 1000))
    const m = Math.floor(remaining / 60), s = remaining % 60
    const timeStr = m > 0 ? m + 'хв ' + s + 'с' : s + 'с'
    return (
      <div id="eventBanner" className="show tourist" style={{ cursor: 'pointer' }} onClick={() => switchTab('orders')}>
        <span id="eventIcon">🧳</span>
        <div style={{ flex: 1 }}>
          <span id="eventTitle">Турист на фермі!</span>
          <span id="eventDesc" style={{ fontSize: '.8rem', opacity: .8, marginLeft: '8px' }}>У нього 5 замовлень — натисни щоб відкрити</span>
        </div>
        <span id="eventTimer">⏱ {timeStr}</span>
      </div>
    )
  }

  if (ev) {
    const remaining = Math.max(0, Math.ceil((ev.endsAt - Date.now()) / 1000))
    const m = Math.floor(remaining / 60), s = remaining % 60
    const timeStr = m > 0 ? m + 'хв ' + s + 'с' : s + 'с'
    const iconMap = { rain: '🌧', pest: '🐛', tourist: '🧳' }
    const titleMap = { rain: 'Дощ!', pest: 'Шкідники!', tourist: 'Турист!' }
    const descMap = {
      rain: 'Усі поля политі. Посаджуй під дощ — буде бонус!',
      pest: 'Прожени шкідників! Клікни на 🐛 на полі.',
      tourist: 'Виконай замовлення!',
    }
    return (
      <div id="eventBanner" className={'show ' + (ev.cls || ev.id)}>
        <span id="eventIcon">{iconMap[ev.id] || '⚡'}</span>
        <div style={{ flex: 1 }}>
          <span id="eventTitle">{titleMap[ev.id] || ev.id}</span>
          <span id="eventDesc" style={{ fontSize: '.8rem', opacity: .8, marginLeft: '8px' }}>{descMap[ev.id] || ''}</span>
        </div>
        <span id="eventTimer">⏱ {timeStr}</span>
      </div>
    )
  }

  return null
}
