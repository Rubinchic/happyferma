import React, { useEffect, useRef } from 'react'
import useStore from '../../store/gameStore.js'
import { ANIMALS_DEF, PRODUCTS } from '../../store/gameStore.js'

// ── Walk-state engine (module-level so it survives re-renders) ────────────────
const walkState = {}
let barnW = 600

function initWalk(uid, w) {
  if (walkState[uid]) return
  walkState[uid] = {
    x: 60 + Math.random() * Math.max(1, w - 160),
    y: 10 + Math.random() * 50,
    vx: (Math.random() - .5) * 1.4,
    state: 'walk',
    timer: Math.random() * 180,
    flip: Math.random() > .5,
    bubble: false,
    bubbleText: '',
    bubbleTimer: 0,
  }
}

function resetWalk(uid) { delete walkState[uid] }

function tickWalk(ws, happiness, w) {
  ws.timer--
  if (ws.bubbleTimer > 0) ws.bubbleTimer--
  else ws.bubble = false

  if (ws.timer <= 0) {
    const r = Math.random()
    if (happiness < 20) {
      ws.state = 'scared'; ws.timer = 60
      ws.bubble = true; ws.bubbleText = '😭 Голодна!'; ws.bubbleTimer = 80
    } else if (r < .35) {
      ws.state = 'walk'; ws.vx = (Math.random() - .5) * 1.8
      ws.timer = 80 + Math.random() * 120; ws.flip = ws.vx < 0
    } else if (r < .55) {
      ws.state = 'idle'; ws.vx = 0; ws.timer = 60 + Math.random() * 100
    } else if (r < .7) {
      ws.state = 'sleep'; ws.vx = 0; ws.timer = 100 + Math.random() * 150
      ws.bubble = true; ws.bubbleText = '💤 Сплю...'; ws.bubbleTimer = 120
    } else if (r < .85) {
      ws.state = 'eat'; ws.vx = 0; ws.timer = 50 + Math.random() * 80
      ws.bubble = true; ws.bubbleText = '😋 Ням-ням!'; ws.bubbleTimer = 90
    } else {
      ws.state = 'happy'; ws.timer = 40
      ws.bubble = true; ws.bubbleText = '🎉 Yay!'; ws.bubbleTimer = 60
    }
  }

  if (ws.state === 'walk') {
    ws.x += ws.vx
    if (ws.x < 60) { ws.x = 60; ws.vx = Math.abs(ws.vx); ws.flip = false }
    if (ws.x > w - 80) { ws.x = w - 80; ws.vx = -Math.abs(ws.vx); ws.flip = true }
  }
}

// ── SelectedAnimalInfo ────────────────────────────────────────────────────────

function SelectedAnimalInfo() {
  const { G, collectAnimalProduct, releaseAnimal, showModal } = useStore()
  const uid = useStore(s => s.selectedAnimalUid)

  if (!uid) {
    return (
      <div id="selectedAnimalInfo" style={{ textAlign: 'center', color: '#999', fontSize: '.85rem', padding: '20px 0' }}>
        <div style={{ fontSize: '3rem' }}>🐾</div>
        Клікни на тваринку щоб побачити деталі
      </div>
    )
  }

  const animal = G.animals.find(a => a.uid === uid)
  if (!animal) return null
  const def = ANIMALS_DEF.find(a => a.id === animal.type)
  const prod = PRODUCTS[def.produces]
  const hpColor = animal.happiness > 60 ? '#2ecc71' : animal.happiness > 30 ? '#f39c12' : '#e74c3c'
  const moodText = animal.happiness > 70 ? '😊 Щаслива' : animal.happiness > 40 ? '😐 Нормально' : animal.happiness > 15 ? '😢 Голодна' : '😭 Критично!'
  const nextIn = Math.max(0, def.produceTime - Math.floor((Date.now() - animal.lastProduced) / 1000))

  return (
    <div id="selectedAnimalInfo">
      <div className="sel-anim-header">
        <span className="sel-anim-emoji">{def.emoji}</span>
        <div><div className="sel-anim-name">{animal.name}</div><div className="sel-anim-type">{def.name}</div></div>
      </div>
      <div className="anim-stat-row">
        <span className="anim-stat-label">❤️ Щастя</span>
        <span style={{ fontWeight: 900, color: hpColor, fontSize: '.9rem' }}>{animal.happiness}%</span>
      </div>
      <div style={{ height: 8, background: '#eee', borderRadius: 5, margin: '-4px 0 10px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: hpColor, width: animal.happiness + '%', borderRadius: 5, transition: 'width .5s' }} />
      </div>
      <div style={{ fontSize: '.78rem', color: '#555', lineHeight: 1.8, marginBottom: 6 }}>
        <div>{moodText}</div>
        {prod && <div>{prod.emoji} Виробляє: {prod.name}</div>}
        <div>📦 Готово: <b>{animal.pendingProducts}</b></div>
        <div>⏱ Наступне: {nextIn > 0 ? '~' + nextIn + 'с' : '⚡ зараз!'}</div>
      </div>
      {animal.pendingProducts > 0 && (
        <button className="collect-big-btn" onClick={() => collectAnimalProduct(uid)}>
          📦 Зібрати {prod?.emoji} ({animal.pendingProducts})
        </button>
      )}
      <button className="feed-big-btn" onClick={() => showModal({ type: 'feed', uid })}>🥕 Годувати</button>
      <button className="release-btn" onClick={() => showModal({
        type: 'confirm',
        title: 'Відпустити ' + def.emoji + ' ' + animal.name + '?',
        desc: 'Тварину не можна повернути.',
        onConfirm: () => releaseAnimal(uid)
      })}>🔓 Відпустити</button>
    </div>
  )
}

// ── BarnScene ─────────────────────────────────────────────────────────────────

function buildFence(fence, w) {
  if (!fence || w <= 0) return
  fence.innerHTML = ''
  const postCount = Math.floor(w / 55)
  for (let i = 0; i < postCount; i++) {
    const p = document.createElement('div')
    p.className = 'fence-post'
    p.style.cssText = `left:${i * 55 + 10}px;height:32px;`
    fence.appendChild(p)
  }
  const r1 = document.createElement('div'); r1.className = 'fence-rail'; r1.style.bottom = '22px'; fence.appendChild(r1)
  const r2 = document.createElement('div'); r2.className = 'fence-rail'; r2.style.bottom = '10px'; fence.appendChild(r2)
}

function buildGrass(grass) {
  if (!grass) return
  grass.innerHTML =
    ['🌿','🌱','🍀','🌿','🌱','🍀','🌿','🌱','🍀','🌿','🌱']
      .map((g, i) => `<span class="grass-patch" style="left:${i * 9 + 2}%;font-size:${.9 + (i % 3) * .2}rem">${g}</span>`).join('') +
    ['🌼','🌸','🌺','🌼','🌸']
      .map((f, i) => `<span class="flower-deco" style="left:${12 + i * 17}%">${f}</span>`).join('')
}

function BarnScene() {
  const animalCount = useStore(s => s.G?.animals.length ?? 0)
  const sceneRef = useRef(null)
  const layerRef = useRef(null)
  const fenceRef = useRef(null)
  const grassRef = useRef(null)
  const rafRef = useRef(null)
  const prevWRef = useRef(0)   // last known barnW; 0 = not yet visible

  useEffect(() => {
    buildGrass(grassRef.current)

    function loop() {
      const { G: G2, selectedAnimalUid: selUid } = useStore.getState()
      if (!G2?.animals.length || !layerRef.current) { rafRef.current = null; return }

      // ── detect when the barn becomes visible for the first time (or resizes) ──
      const sceneW = sceneRef.current?.offsetWidth ?? 0
      if (sceneW > 0 && sceneW !== prevWRef.current) {
        barnW = sceneW
        prevWRef.current = sceneW
        buildFence(fenceRef.current, barnW)
        // Reset animal positions so they spawn within the actual visible area
        G2.animals.forEach(a => resetWalk(a.uid))
      }

      // Still not visible — keep the loop alive and wait
      if (prevWRef.current === 0) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const layer = layerRef.current

      G2.animals.forEach(animal => {
        const def = ANIMALS_DEF.find(d => d.id === animal.type)
        initWalk(animal.uid, barnW)
        const ws = walkState[animal.uid]
        tickWalk(ws, animal.happiness, barnW)

        const isSel = selUid === animal.uid
        const moodEmoji = animal.happiness <= 40 ? '😢' : ''
        const stCls = ws.state === 'walk' ? 'walking-anim'
          : ws.state === 'sleep' ? 'sleeping'
          : ws.state === 'eat'   ? 'eating'
          : ws.state === 'happy' ? 'happy-anim'
          : ws.state === 'scared' ? 'scared' : ''
        const hpColor = animal.happiness > 60 ? '#2ecc71' : animal.happiness > 30 ? '#f39c12' : '#e74c3c'

        let el = document.getElementById('wa-' + animal.uid)
        if (!el) {
          el = document.createElement('div')
          el.className = 'walking-animal'
          el.id = 'wa-' + animal.uid
          el.onclick = e => { e.stopPropagation(); useStore.getState().selectAnimal(animal.uid) }
          layer.appendChild(el)
        }

        el.style.left   = ws.x + 'px'
        el.style.bottom = ws.y + 'px'
        el.style.transform = isSel ? 'scale(1.2)' : 'scale(1)'

        el.innerHTML = `<div class="wa-body ${stCls}">
          ${ws.bubble ? `<div class="wa-bubble" style="color:${animal.happiness < 30 ? '#e74c3c' : '#1a472a'}">${ws.bubbleText}</div>` : ''}
          ${animal.pendingProducts > 0 ? `<div class="produce-sparkle">${PRODUCTS[def.produces]?.emoji ?? '✨'}</div>` : ''}
          <div class="wa-status">${moodEmoji}</div>
          <div class="wa-name-tag"${isSel ? ' style="background:#d4f7b0;color:#1a472a;border:1.5px solid #52b788;"' : ''}>${animal.name.split(' ')[0]}</div>
          <span class="wa-emoji" style="transform:scaleX(${ws.flip ? -1 : 1})">${def.emoji}</span>
          <div class="wa-shadow"></div>
          <div style="width:30px;height:3px;background:#eee;border-radius:2px;overflow:hidden;margin-top:1px;">
            <div style="height:100%;background:${hpColor};width:${animal.happiness}%;border-radius:2px;"></div>
          </div>
        </div>`
      })

      // Remove elements for animals that no longer exist
      layer.querySelectorAll('.walking-animal').forEach(el => {
        const uid = parseInt(el.id.replace('wa-', ''))
        if (!G2.animals.find(a => a.uid === uid)) { el.remove(); resetWalk(uid) }
      })

      rafRef.current = requestAnimationFrame(loop)
    }

    if (!rafRef.current) rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    }
  }, [animalCount])   // restart when animals are bought or released

  const G = useStore(s => s.G)

  return (
    <div id="barnScene" ref={sceneRef} className="barn-scene">
      <div className="barn-bg">
        <div className="barn-sky" />
        <div id="barnGrass" ref={grassRef} className="barn-grass" />
      </div>
      {!G?.animals.length && (
        <div className="no-animals-msg">
          <div style={{ fontSize: '3rem' }}>🐾</div>
          <div>Тут поки порожньо! Купи тваринок нижче.</div>
        </div>
      )}
      <div id="barnAnimalsLayer" ref={layerRef} className="barn-animals-layer" />
      <div id="barnFence"        ref={fenceRef} className="barn-fence" />
    </div>
  )
}

// ── AnimalsTab ────────────────────────────────────────────────────────────────

export default function AnimalsTab() {
  const { G, buyAnimal, collectAllProducts, feedAllAnimals } = useStore()
  if (!G) return null

  const feedItems = Object.entries(G.inventory).filter(
    ([k, v]) => v > 0 && PRODUCTS[k]?.feedValue > 0 && PRODUCTS[k]?.category === 'crop'
  )

  return (
    <div className="animals-layout">
      {/* Left: shop + feed inventory */}
      <div className="animals-shop">
        <div className="card">
          <h3>🐾 Купити тваринку</h3>
          {ANIMALS_DEF.map(a => {
            const locked = a.unlockLevel && G.level < a.unlockLevel
            return (
              <div key={a.id}
                className={'animal-shop-item' + (locked ? ' disabled' : '')}
                onClick={() => !locked && buyAnimal(a.id)}
              >
                <span className="aie">{a.emoji}</span>
                <div>
                  <div className="item-name">{a.name}{locked ? ` 🔒${a.unlockLevel}рвн` : ''}</div>
                  <div className="item-price">💰{a.cost}🪙</div>
                  <div className="item-grow">{PRODUCTS[a.produces]?.emoji} кожні {a.produceTime}с</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="card">
          <h3>🌾 Корм у коморі</h3>
          {feedItems.length === 0
            ? <div style={{ fontSize: '.82rem', color: '#888' }}>Зберіть врожай щоб годувати тварин!</div>
            : feedItems.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                <span style={{ fontSize: '1.3rem' }}>{PRODUCTS[k].emoji}</span>
                <span style={{ fontSize: '.82rem', fontWeight: 700 }}>{PRODUCTS[k].name}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 900, color: '#f39c12' }}>{v}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Right: barn + actions + selected animal */}
      <div className="animals-main">
        <BarnScene />

        <div className="animals-bottom-bar" style={{ marginTop: 10 }}>
          <button className="collect-all-btn" onClick={collectAllProducts}>📦 Зібрати все</button>
          <button className="feed-all-btn" onClick={feedAllAnimals}>🥕 Годувати всіх</button>
        </div>

        <div className="selected-animal-info" style={{ marginTop: 10 }}>
          <SelectedAnimalInfo />
        </div>
      </div>
    </div>
  )
}
