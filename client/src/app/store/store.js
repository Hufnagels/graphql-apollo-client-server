import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger'
import { combineReducers } from "redux";
import thunkMiddleware from 'redux-thunk'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from "../reducers/authSlice";
import messageReducer from "../reducers/messageSlice";

const reducers = combineReducers({
  auth: authReducer,
  message: messageReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    .concat(logger),
})

export const persistor = persistStore(store)

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware()
//     .concat(logger)
// })