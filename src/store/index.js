import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import viewReducer from './viewSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    view: viewReducer,
  },
})

export default store