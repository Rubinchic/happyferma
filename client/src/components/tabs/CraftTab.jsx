import React from 'react'
import useStore from '../../store/gameStore.js'
import { RECIPES, RECIPE_CATEGORIES, PRODUCTS } from '../../store/gameStore.js'
import { getCraftSlots, canAcceptToStorage } from '../../systems/state.js'

export default function CraftTab() {
  const { G, startCraft } = useStore()
  if (!G) return null

  const usedSlots = (G.craftQueue || []).length
  const maxSlots = getCraftSlots(G)

  const byCategory = {}
  RECIPES.forEach(r => {
    if (!byCategory[r.category]) byCategory[r.category] = []
    byCategory[r.category].push(r)
  })

  function canCraft(recipe) {
    return Object.entries(recipe.ingredients).every(([k, qty]) => (G.inventory[k] || 0) >= qty)
  }

  function getCraftingEntry(recipeId) {
    return (G.craftQueue || []).find(e => e.recipeId === recipeId) || null
  }

  return (
    <div id="craftContent" style={{ padding: '0 8px 20px' }}>
      <div id="craftSlotsHint" style={{ textAlign: 'center', fontSize: '.8rem', color: '#888', margin: '8px 0' }}>
        Слоти крафту: {usedSlots}/{maxSlots} • Апгрейд: вкладка "🏡 Двір"
      </div>

      {Object.entries(byCategory).map(([cat, recipes]) => {
        const catDef = RECIPE_CATEGORIES[cat] || { label: cat, color: '#fff' }
        return (
          <div key={cat} className="craft-section">
            <div className="craft-section-title">{catDef.label}</div>
            <div className="craft-cards">
              {recipes.map(recipe => {
                const output = PRODUCTS[recipe.output]
                const craftable = canCraft(recipe)
                const craftingEntry = getCraftingEntry(recipe.id)
                const isCrafting = !!craftingEntry
                const elapsed = isCrafting ? Date.now() - craftingEntry.startTime : 0
                const pct = isCrafting ? Math.min(100, (elapsed / craftingEntry.duration) * 100) : 0
                const remaining = isCrafting ? Math.max(0, Math.ceil((craftingEntry.duration - elapsed) / 1000)) : 0
                const slotsAvail = usedSlots < maxSlots
                const canStart = craftable && !isCrafting && slotsAvail

                return (
                  <div key={recipe.id} className={'craft-card' + (craftable && !isCrafting ? ' craftable' : '') + (isCrafting ? ' crafting-active' : '')} style={{ background: catDef.color }}>
                    <span className="craft-xp">+{recipe.xp} XP</span>
                    <div className="craft-header">
                      <span className="craft-output-emoji">{output?.emoji}</span>
                      <div className="craft-output-info">
                        <div className="craft-output-name">{recipe.name}</div>
                        <div className="craft-output-desc">{recipe.desc}</div>
                      </div>
                      <span className="craft-output-yield">× {recipe.outputAmt} → 💰{output?.sellPrice}</span>
                    </div>
                    <div className="craft-ingredients">
                      {Object.entries(recipe.ingredients).map(([k, qty]) => {
                        const have = G.inventory[k] || 0
                        const hasEnough = have >= qty || isCrafting
                        const prod = PRODUCTS[k]
                        return (
                          <div key={k} className={'craft-ing ' + (hasEnough ? 'have' : 'missing')}>
                            <span className="craft-ing-emoji">{prod?.emoji || '?'}</span>
                            <span>{prod?.name || k}</span>
                            <span className="craft-ing-qty">{isCrafting ? qty : have}/{qty}</span>
                          </div>
                        )
                      })}
                    </div>
                    {isCrafting && (
                      <div className="craft-progress-wrap show">
                        <div className="craft-progress-bar">
                          <div className="craft-progress-fill" style={{ width: pct + '%' }} />
                        </div>
                        <div className="craft-progress-label">⏱ Ще {remaining}с...</div>
                      </div>
                    )}
                    <div className="craft-footer">
                      <div className="craft-meta">⏱ {recipe.time}с</div>
                      <button
                        className={'craft-btn' + (isCrafting ? ' crafting' : canStart ? ' can' : ' cant')}
                        disabled={isCrafting || !craftable || !slotsAvail}
                        onClick={() => startCraft(recipe.id)}
                      >
                        {isCrafting ? '⏳ Готується...' : !slotsAvail && craftable ? '🚫 Нема слотів' : craftable ? '🍳 Готувати' : '❌ Не вистачає'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
