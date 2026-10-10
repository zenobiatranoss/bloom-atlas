import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    ready: false,
    loaded: false,
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
    setScrollProgress(state, action) {
      state.scrollProgress = action.payload
    }
  }
})

export const { setReady, setSound, setLoaded, setScrollProgress } = uiSlice.actions

export default uiSlice.reducer
