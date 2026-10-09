import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    ready: false,
    loaded: false,
    detailOpen: false,
    menuOpen: false,
    soundOn: false,
    scrollProgress: 0
  },
  reducers: {
    setReady(state, action) {
      state.ready = action.payload
    },
    setSound(state, action) {
      state.soundOn = action.payload
    },
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
  setReady,
  setSound,
  setLoaded,
  openDetail,
  closeDetail,
  toggleMenu,
  toggleSound,
  setScrollProgress
} = uiSlice.actions

export default uiSlice.reducer
