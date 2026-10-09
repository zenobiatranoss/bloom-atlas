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
          items: flowersReducer(undefined, { type: '@@init' }).items,
          selectedId: persisted.selectedId,
          hoveredId: null,
          favorites: persisted.favorites || [],
          query: ''
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
