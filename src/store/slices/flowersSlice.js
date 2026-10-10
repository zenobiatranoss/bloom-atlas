import { createSlice, createSelector } from '@reduxjs/toolkit'
import { flowers } from '../../data/flowers'

const initialState = {
  items: flowers.map((f) => f.id),
  selectedId: flowers[0].id,
  favorites: [],
  query: ''
}

const flowersSlice = createSlice({
  name: 'flowers',
  initialState,
  reducers: {
    selectFlower(state, action) {
      state.selectedId = action.payload
    },
    toggleFavorite(state, action) {
      const id = action.payload
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id]
    },
    setQuery(state, action) {
      state.query = action.payload
    },
    nextFlower(state) {
      const i = state.items.indexOf(state.selectedId)
      state.selectedId = state.items[(i + 1) % state.items.length]
    },
    prevFlower(state) {
      const i = state.items.indexOf(state.selectedId)
      state.selectedId = state.items[(i - 1 + state.items.length) % state.items.length]
    }
  }
})

export const { selectFlower, toggleFavorite, setQuery, nextFlower, prevFlower } =
  flowersSlice.actions

const selectFlowersState = (state) => state.flowers

export const selectSelectedFlower = createSelector(selectFlowersState, (s) =>
  flowers.find((f) => f.id === s.selectedId)
)

export const selectFilteredFlowers = createSelector(selectFlowersState, (s) => {
  const q = s.query.trim().toLowerCase()
  if (!q) return flowers
  return flowers.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.meaning.toLowerCase().includes(q) ||
      f.latin.toLowerCase().includes(q)
  )
})

export const selectFavorites = createSelector(selectFlowersState, (s) => s.favorites)

export default flowersSlice.reducer
