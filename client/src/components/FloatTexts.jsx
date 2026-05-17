import React from 'react'
import useStore from '../store/gameStore.js'

export default function FloatTexts() {
  const floatTexts = useStore(s => s.floatTexts)
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {floatTexts.map(f => (
        <div key={f.id} className="float-text" style={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#27ae60',
          textShadow: '0 2px 4px rgba(0,0,0,.3)',
          animation: 'floatUp 1.2s ease-out forwards',
          pointerEvents: 'none',
        }}>
          {f.text}
        </div>
      ))}
    </div>
  )
}
