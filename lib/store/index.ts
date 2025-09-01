import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import coursesReducer from './slices/coursesSlice';
import authReducer from './slices/authSlice';
import videoReducer from './slices/videoSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  version: 1, // Increment this to invalidate old cache
  storage,
  whitelist: ['auth'] // Remove 'courses' to always fetch fresh data
};

const videoPersistConfig = {
  key: 'video',
  storage,
  whitelist: ['currentTime', 'volume']
};

const rootReducer = combineReducers({
  courses: coursesReducer,
  auth: authReducer,
  video: persistReducer(videoPersistConfig, videoReducer),
  ui: uiReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;