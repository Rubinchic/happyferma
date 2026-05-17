import { useEffect, useRef } from 'react'
import useStore from '../store/gameStore.js'

export default function useGameLoop() {
  const { G, gameTick, regenWater, newDay, autoSave } = useStore()
  const tickRef = useRef(null)
  const waterRef = useRef(null)
  const dayRef = useRef(null)
  const saveRef = useRef(null)

  useEffect(() => {
    if (!G) {
      clearInterval(tickRef.current)
      clearInterval(waterRef.current)
      clearInterval(dayRef.current)
      clearInterval(saveRef.current)
      tickRef.current = waterRef.current = dayRef.current = saveRef.current = null
      return
    }

    tickRef.current = setInterval(() => useStore.getState().gameTick(), 1000)
    waterRef.current = setInterval(() => useStore.getState().regenWater(), 5000)
    dayRef.current = setInterval(() => useStore.getState().newDay(), 90000)
    saveRef.current = setInterval(() => useStore.getState().autoSave(), 15000)

    return () => {
      clearInterval(tickRef.current)
      clearInterval(waterRef.current)
      clearInterval(dayRef.current)
      clearInterval(saveRef.current)
    }
  }, [!!G])
}
