import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import usersSlice from './slices/usersSlice';
import postsSlice from './slices/postsSlice';
import commentsSlice from './slices/commentsSlice';
import followsSlice from './slices/followsSlice';
import verificationSlice from './slices/verificationSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    posts: postsSlice,
    comments: commentsSlice,
    follows: followsSlice,
    verification: verificationSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
