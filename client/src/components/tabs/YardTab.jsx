import React from 'react'
import useStore from '../../store/gameStore.js'
import { YARD_DEF, PRODUCTS } from '../../store/gameStore.js'
import { invCount, getInvCap, getAutoFieldSlots, getCityOrderSlots, groundCount, pruneGroundDrops } from '../../systems/state.js'

export default function YardTab() {
  const { G, upgradeYard, pickupGround, switchTab } = useStore()
  if (!G) return null

  pruneGroundDrops(G)
  const invUsed = invCount(G)
  const invCap = getInvCap(G)
  const gUsed = groundCount(G)
  const gLeft = Math.max(0, 220 - gUsed)
  const hqLvl = Math.max(1, G.yard.hqLevel || 1)
  const barnLvl = Math.max(1, G.yard.barnLevel || 1)
  const kitchenLvl = Math.max(1, G.yard.kitchenLevel || 1)
  const truckLvl = Math.max(0, G.yard.truckLevel || 0)
  const hqDef = YARD_DEF.hq.levels.find(x => x.lvl === hqLvl) || YARD_DEF.hq.levels[0]
  const barnDef = YARD_DEF.barn.levels.find(x => x.lvl === barnLvl) || YARD_DEF.barn.levels[0]
  const kitDef = YARD_DEF.kitchen.levels.find(x => x.lvl === kitchenLvl) || YARD_DEF.kitchen.levels[0]
  const trkDef = YARD_DEF.truck.levels.find(x => x.lvl === truckLvl) || YARD_DEF.truck.levels[0]

  function UpgradeBtn({ kind, curLvl, defArr }) {
    const next = defArr.find(l => l.lvl === curLvl + 1)
    if (!next) return <button className="bbtn secondary" disabled>Максимум</button>
    const locked = G.level < next.reqLevel
    const afford = !next.upgradeCost || G.coins >= next.upgradeCost
    const needItems = !next.reqItems || next.reqItems.every(it => (G.inventory[it.k] || 0) >= it.qty)
    const dis = locked || !afford || !needItems
    const label = locked ? '🔒 Рвн.' + next.reqLevel : !needItems ? '📦 Нема ресурсів' : '⬆️ ' + next.upgradeCost + '🪙'
    return <button className="bbtn primary" disabled={dis} onClick={() => upgradeYard(kind)}>{label}</button>
  }

  return (
    <div className="yard-layout" style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* HQ */}
      <div className="bcard">
        <div className="btop">
          <div className="bicon">🏚</div>
          <div><div className="bname">Дім фермера (HQ)</div><div className="bsmall">{hqDef.label}</div></div>
          <div className="blvl">Рівень {hqLvl}</div>
        </div>
        <div className="bdesc">Керує доступними системами: авто-поля та лімітом слотів замовлень.</div>
        <div className="bmini">
          <div className="m"><div className="mv">{getAutoFieldSlots(G)}</div><div className="ml">⚙️ авто-поля</div></div>
          <div className="m"><div className="mv">{getCityOrderSlots(G)}</div><div className="ml">📦 слоти замовл.</div></div>
        </div>
        <div className="bacts">
          <UpgradeBtn kind="hq" curLvl={hqLvl} defArr={YARD_DEF.hq.levels} />
          <button className="bbtn secondary" onClick={() => switchTab('orders')}>До замовлень</button>
        </div>
        <div className="bsmall">Підказка: авто-поле відкривається з HQ 2 рівня.</div>
      </div>

      {/* Barn */}
      <div className="bcard">
        <div className="btop">
          <div className="bicon">📦</div>
          <div><div className="bname">Склад / Амбар</div><div className="bsmall">{barnDef.label}</div></div>
          <div className="blvl">Рівень {barnLvl}</div>
        </div>
        <div className="bdesc">Ліміт інвентаря. Якщо переповнення — зайве падає "на землю" на 10 хв.</div>
        <div className="bmini">
          <div className="m"><div className="mv">{invUsed}/{invCap}</div><div className="ml">📦 комора</div></div>
          <div className="m"><div className="mv">{gUsed}/{220}</div><div className="ml">🌿 на землі</div></div>
        </div>
        <div className="bacts">
          <UpgradeBtn kind="barn" curLvl={barnLvl} defArr={YARD_DEF.barn.levels} />
        </div>
        {(G.groundDrops || []).length > 0 && (
          <div style={{ marginTop: 6 }}>
            {(G.groundDrops || []).map(d => {
              const p = PRODUCTS[d.k] || { emoji: '📦', name: d.k }
              const remain = Math.max(0, Math.ceil(((d.expiresAt || 0) - Date.now()) / 1000))
              const m = Math.floor(remain / 60), s = remain % 60
              const t = m > 0 ? m + 'хв ' + s + 'с' : s + 'с'
              return (
                <span key={d.k} className="ground-pill">
                  {p.emoji} {p.name} ×{d.qty} • ⏱ {t}{' '}
                  <button style={{ marginLeft: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 900, color: '#1a472a' }} onClick={() => pickupGround(d.k)}>підняти</button>
                </span>
              )
            })}
          </div>
        )}
        {!(G.groundDrops || []).length && <div className="bsmall">На землі нічого немає.</div>}
      </div>

      {/* Kitchen */}
      <div className="bcard">
        <div className="btop">
          <div className="bicon">🍳</div>
          <div><div className="bname">Кухня (крафт-слоти)</div><div className="bsmall">{kitDef.label}</div></div>
          <div className="blvl">Рівень {kitchenLvl}</div>
        </div>
        <div className="bdesc">Кількість одночасних крафт-слотів. Апгрейдуй щоб готувати більше страв паралельно.</div>
        <div className="bmini">
          <div className="m"><div className="mv">{kitDef.craftSlots}</div><div className="ml">🍳 крафт-слоти</div></div>
          <div className="m"><div className="mv">{(G.craftQueue || []).length}</div><div className="ml">⏳ активних</div></div>
        </div>
        <div className="bacts">
          <UpgradeBtn kind="kitchen" curLvl={kitchenLvl} defArr={YARD_DEF.kitchen.levels} />
          <button className="bbtn secondary" onClick={() => switchTab('craft')}>До крафту</button>
        </div>
      </div>

      {/* Truck */}
      <div className="bcard">
        <div className="btop">
          <div className="bicon">🚚</div>
          <div><div className="bname">Вантажівка (міські замовлення)</div><div className="bsmall">{trkDef.label}</div></div>
          <div className="blvl">Рівень {truckLvl}</div>
        </div>
        <div className="bdesc">Відкриває міські замовлення з бонусними цінами. Потребує ресурсів для будівництва.</div>
        <div className="bmini">
          <div className="m"><div className="mv">{trkDef.cityUnlocked ? '✅' : '❌'}</div><div className="ml">🏙️ місто</div></div>
          <div className="m"><div className="mv">×{trkDef.rewardMul?.toFixed(2) || '1.00'}</div><div className="ml">💰 множник</div></div>
        </div>
        {YARD_DEF.truck.levels.find(l => l.lvl === truckLvl + 1)?.reqItems && (
          <div className="bsmall" style={{ marginBottom: 6 }}>
            Ресурси для апгрейду: {YARD_DEF.truck.levels.find(l => l.lvl === truckLvl + 1)?.reqItems?.map(it => {
              const p = PRODUCTS[it.k] || { emoji: '📦', name: it.k }
              const have = G.inventory[it.k] || 0
              return `${p.emoji} ${p.name} ${have}/${it.qty}`
            }).join(' • ')}
          </div>
        )}
        <div className="bacts">
          <UpgradeBtn kind="truck" curLvl={truckLvl} defArr={YARD_DEF.truck.levels} />
        </div>
      </div>
    </div>
  )
}
