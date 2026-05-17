import React from 'react'
import useStore from './store/gameStore.js'
import useGameLoop from './hooks/useGameLoop.js'
import AuthScreen from './components/AuthScreen.jsx'
import Background from './components/Background.jsx'
import TopBar from './components/TopBar.jsx'
import StatsBar from './components/StatsBar.jsx'
import TabBar from './components/TabBar.jsx'
import EventBanner from './components/EventBanner.jsx'
import Modal from './components/Modal.jsx'
import FloatTexts from './components/FloatTexts.jsx'
import FarmTab from './components/tabs/FarmTab.jsx'
import AnimalsTab from './components/tabs/AnimalsTab.jsx'
import HousesTab from './components/tabs/HousesTab.jsx'
import YardTab from './components/tabs/YardTab.jsx'
import CraftTab from './components/tabs/CraftTab.jsx'
import InventoryTab from './components/tabs/InventoryTab.jsx'
import MarketTab from './components/tabs/MarketTab.jsx'
import OrdersTab from './components/tabs/OrdersTab.jsx'
import QuestsTab from './components/tabs/QuestsTab.jsx'
import ProfileTab from './components/tabs/ProfileTab.jsx'

function GameUI() {
  useGameLoop()
  const currentTab = useStore(s => s.currentTab)

  return (
    <div id="gameUI">
      <Background />
      <TopBar />
      <EventBanner />
      <StatsBar />
      <TabBar />
      <div className="panels-wrap">
        <div id="tab-farm" className={'panel' + (currentTab === 'farm' ? ' active' : '')}><FarmTab /></div>
        <div id="tab-animals" className={'panel' + (currentTab === 'animals' ? ' active' : '')}><AnimalsTab /></div>
        <div id="tab-houses" className={'panel' + (currentTab === 'houses' ? ' active' : '')}><HousesTab /></div>
        <div id="tab-yard" className={'panel' + (currentTab === 'yard' ? ' active' : '')}><YardTab /></div>
        <div id="tab-craft" className={'panel' + (currentTab === 'craft' ? ' active' : '')}><CraftTab /></div>
        <div id="tab-inventory" className={'panel' + (currentTab === 'inventory' ? ' active' : '')}><InventoryTab /></div>
        <div id="tab-market" className={'panel' + (currentTab === 'market' ? ' active' : '')}><MarketTab /></div>
        <div id="tab-orders" className={'panel' + (currentTab === 'orders' ? ' active' : '')}><OrdersTab /></div>
        <div id="tab-quests" className={'panel' + (currentTab === 'quests' ? ' active' : '')}><QuestsTab /></div>
        <div id="tab-profile" className={'panel' + (currentTab === 'profile' ? ' active' : '')}><ProfileTab /></div>
      </div>
      <Modal />
      <FloatTexts />
    </div>
  )
}

export default function App() {
  const G = useStore(s => s.G)
  return G ? <GameUI /> : <AuthScreen />
}
