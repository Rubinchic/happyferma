import React from 'react'
import useStore from '../store/gameStore.js'

const TABS = [
  { id: 'farm',      label: '🌾 Поле' },
  { id: 'animals',   label: '🐄 Тварини' },
  { id: 'houses',    label: '🏠 Будинки' },
  { id: 'yard',      label: '🏡 Двір' },
  { id: 'craft',     label: '🍳 Крафт' },
  { id: 'inventory', label: '📦 Комора' },
  { id: 'market',    label: '🛒 Ринок' },
  { id: 'orders',    label: '📋 Замовлення' },
  { id: 'quests',    label: '📜 Квести' },
  { id: 'profile',   label: '👤 Профіль' },
]

export default function TabBar() {
  const currentTab = useStore(s => s.currentTab)
  const switchTab = useStore(s => s.switchTab)

  return (
    <nav id="tabBar" className="tabs">
      {TABS.map(t => (
        <button
          key={t.id}
          id={'tab-btn-' + t.id}
          className={'tab-btn' + (currentTab === t.id ? ' active' : '')}
          onClick={() => switchTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
