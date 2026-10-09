import { createSlice } from '@reduxjs/toolkit'

export const themes = ['dawn', 'dusk', 'midnight']

const themeSlice = createSlice({
  name: 'theme',
  initialState: { current: 'midnight' },
  reducers: {
    setTheme(state, action) {
      if (themes.includes(action.payload)) state.current = action.payload
    },
    cycleTheme(state) {
      const i = themes.indexOf(state.current)
      state.current = themes[(i + 1) % themes.length]
    }
  }
})

export const { setTheme, cycleTheme } = themeSlice.actions
export default themeSlice.reducer
