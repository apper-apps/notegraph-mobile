import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentView: 'grid', // grid, list, calendar
  selectedFolder: null,
  selectedTags: [],
  sidebarOpen: false,
}

export const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload
    },
    setSelectedFolder: (state, action) => {
      state.selectedFolder = action.payload
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload
    },
    toggleTag: (state, action) => {
      const tag = action.payload
      const index = state.selectedTags.indexOf(tag)
      if (index >= 0) {
        state.selectedTags.splice(index, 1)
      } else {
        state.selectedTags.push(tag)
      }
    },
    clearFilters: (state) => {
      state.selectedFolder = null
      state.selectedTags = []
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const { 
  setCurrentView, 
  setSelectedFolder, 
  setSelectedTags, 
  toggleTag, 
  clearFilters,
  setSidebarOpen 
} = viewSlice.actions

export default viewSlice.reducer