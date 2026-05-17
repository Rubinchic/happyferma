import React from 'react'

export default function Background() {
  return (
    <div className="bg-scene" aria-hidden="true">
      <div className="sun" />
      {[1, 2, 3].map(i => (
        <div key={i} className={'cloud c' + i} />
      ))}
    </div>
  )
}
