import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loaded: false,
    detailOpen: false,
    menuOpen: false,
    soundOn: false,
    scrollProgress: 0
  },
  reducers: {
    setLoaded(state, action) {
      state.loaded = action.payload
    },
    openDetail(state) {
      state.detailOpen = true
    },
    closeDetail(state) {
      state.detailOpen = false
    },
    toggleMenu(state) {
      state.menuOpen = !state.menuOpen
    },
    toggleSound(state) {
      state.soundOn = !state.soundOn
    },
    setScrollProgress(state, action) {
      state.scrollProgress = action.payload
    }
  }
})

export const {
  setLoaded,
  openDetail,
  closeDetail,
  toggleMenu,
  toggleSound,
  setScrollProgress
} = uiSlice.actions

export default uiSlice.reducer
