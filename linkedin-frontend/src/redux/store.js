import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice.js'
import postReducer from './slices/postSlice.js'

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store