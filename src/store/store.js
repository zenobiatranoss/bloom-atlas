import { configureStore } from '@reduxjs/toolkit'
import flowersReducer from './slices/flowersSlice'
import themeReducer from './slices/themeSlice'
import uiReducer from './slices/uiSlice'

const STORAGE_KEY = 'bloom-atlas-state'

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

const persisted = loadState()
const defaults = flowersReducer(undefined, { type: '@@init' })
const knownFlower = (id) => defaults.items.includes(id)

export const store = configureStore({
  reducer: {
    flowers: flowersReducer,
    theme: themeReducer,
    ui: uiReducer
  },
  preloadedState: persisted
    ? {
        theme: persisted.theme,
        flowers: {
          ...defaults,
          selectedId: knownFlower(persisted.selectedId) ? persisted.selectedId : defaults.selectedId,
          favorites: persisted.favorites || []
        }
      }
    : undefined
})

store.subscribe(() => {
  try {
    const s = store.getState()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: s.theme,
        selectedId: s.flowers.selectedId,
        favorites: s.flowers.favorites
      })
    )
  } catch {
    return
  }
})
