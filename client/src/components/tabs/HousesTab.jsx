import React from 'react'
import useStore from '../../store/gameStore.js'
import { ANIMALS_DEF, HOUSES_DEF, PRODUCTS } from '../../store/gameStore.js'

export default function HousesTab() {
  const { G, buildHouse, upgradeHouse, buyAnimal, setHouseFeed } = useStore()
  if (!G) return null

  const allFeedItems = Object.entries(PRODUCTS).filter(([, p]) => p.feedValue > 0 && p.category === 'crop')

  return (
    <div style={{ padding: '0 8px 20px' }}>
      <div id="housesGrid" className="houses-grid">
        {HOUSES_DEF.map(house => {
          const hs = G.houses?.[house.id] || null
          const isBuilt = hs && hs.built
          const lvl = isBuilt ? hs.level : 0
          const levelInfo = isBuilt ? house.levels[lvl - 1] : null
          const nextLevelInfo = isBuilt && lvl < house.levels.length ? house.levels[lvl] : null
          const isLocked = G.level < house.unlockLevel
          const animDef = ANIMALS_DEF.find(a => a.id === house.animalId)
          const myAnimals = G.animals.filter(a => a.type === house.animalId)
          const capacity = isBuilt ? levelInfo.capacity : 0
          const canBuild = !isBuilt && !isLocked && G.coins >= house.buildCost
          const canUpgrade = isBuilt && nextLevelInfo && G.level >= nextLevelInfo.reqLevel && G.coins >= nextLevelInfo.upgradeCost
          const isMaxLevel = isBuilt && lvl >= house.levels.length
          const capacityPct = capacity > 0 ? (myAnimals.length / capacity * 100) : 0
          const capColor = myAnimals.length >= capacity ? '#e74c3c' : myAnimals.length >= capacity * 0.7 ? '#f39c12' : '#52b788'
          const selectedFeed = (G.houseFeed || {})[house.id] || 'none'

          return (
            <div key={house.id} className={'house-card' + (isLocked ? ' locked' : '')}>
              {/* Scene */}
              <div className="house-scene">
                <div className="house-bg-sky" />
                <div className="house-bg-grass" />
                {isLocked && <div className="house-locked-overlay">🔒</div>}
                {isBuilt && <div className="house-lvl-badge">Рвн. {lvl}</div>}
                <div className="house-building">
                  <span className="house-icon">{house.icon}</span>
                </div>
                <div className="house-animals-preview">
                  {myAnimals.slice(0, 6).map(a => (
                    <span key={a.uid} title={a.name}>{animDef.emoji}</span>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="house-info">
                <div className="house-name">{house.name}</div>
                <div className="house-animal-type">
                  {animDef.emoji} {animDef.name} • {isLocked ? '🔒 Розблок. з рівня ' + house.unlockLevel : isBuilt ? levelInfo.label : 'Не побудовано'}
                </div>

                {isBuilt && (
                  <>
                    {/* Capacity */}
                    <div className="house-capacity-label">{myAnimals.length}/{capacity} тварин</div>
                    <div className="house-capacity-bar">
                      <div className="house-capacity-fill" style={{ width: capacityPct + '%', background: capColor }} />
                    </div>

                    {/* Animals list */}
                    {myAnimals.length > 0 && (
                      <div className="house-animals-list">
                        {myAnimals.map(a => {
                          const hpColor = a.happiness > 60 ? '#2ecc71' : a.happiness > 30 ? '#f39c12' : '#e74c3c'
                          return (
                            <div key={a.uid} className="house-animal-row">
                              {animDef.emoji} <span style={{ flex: 1 }}>{a.name}</span>
                              <div className="house-animal-hp">
                                <div className="house-animal-hp-fill" style={{ width: a.happiness + '%', background: hpColor }} />
                              </div>
                              <span style={{ fontSize: '.75rem', color: '#888', marginLeft: 4 }}>{a.happiness}%</span>
                              {a.pendingProducts > 0 && <span style={{ fontSize: '.9rem', marginLeft: 4 }}>📦{a.pendingProducts}</span>}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Feed picker */}
                    <div className="house-feed-section">
                      <div className="house-feed-title">🥩 Чим годуємо:</div>
                      <div className="feed-picker-grid">
                        <div
                          className={'feed-picker-opt' + (selectedFeed === 'none' ? ' selected-feed' : '')}
                          onClick={() => setHouseFeed(house.id, 'none')}
                        >
                          🚫 Авто
                        </div>
                        {allFeedItems.map(([k, p]) => {
                          const qty = G.inventory[k] || 0
                          const isSel = selectedFeed === k
                          return (
                            <div
                              key={k}
                              className={'feed-picker-opt' + (isSel ? ' selected-feed' : '') + (qty <= 0 ? ' no-stock' : '')}
                              onClick={() => setHouseFeed(house.id, k)}
                            >
                              {p.emoji} {p.name} ({qty})
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="house-actions" style={{ display:'flex', flexDirection:'column', gap:6, marginTop:10 }}>
                  {!isBuilt && !isLocked && (
                    <button className="bbtn primary"
                      disabled={!canBuild}
                      onClick={() => buildHouse(house.id)}>
                      🏗 Побудувати ({house.buildCost}🪙)
                    </button>
                  )}
                  {isBuilt && !isMaxLevel && nextLevelInfo && (
                    <button className="bbtn primary"
                      disabled={!canUpgrade}
                      onClick={() => upgradeHouse(house.id)}>
                      ⬆️ Апгрейд ({nextLevelInfo.upgradeCost}🪙)
                    </button>
                  )}
                  {isBuilt && isMaxLevel && (
                    <button className="bbtn secondary" disabled>✅ Максимум</button>
                  )}
                  {isBuilt && myAnimals.length < capacity && (
                    <button className="add-animal-btn"
                      disabled={G.coins < animDef.cost}
                      onClick={() => buyAnimal(animDef.id)}>
                      + {animDef.emoji} {animDef.name} ({animDef.cost}🪙)
                    </button>
                  )}
                </div>

                {isBuilt && nextLevelInfo && (
                  <div className="house-upgrade-preview">
                    Апгрейд → {nextLevelInfo.upgradeLabel}: {nextLevelInfo.capacity} тварин | ×{nextLevelInfo.produceBonus} продукт
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
