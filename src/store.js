import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'reduxjs-toolkit-persist/es/constants';
import { persistReducer } from 'reduxjs-toolkit-persist';
import createSagaMiddleware from "redux-saga";
import {reduxBatch} from "@manaflair/redux-batch";
import storage from 'reduxjs-toolkit-persist/lib/storage';
import persistStore from 'reduxjs-toolkit-persist/es/persistStore';
import scrollspyReducer from 'components/scrollspy/scrollspySlice';
import langReducer from 'lang/langSlice';
import menuReducer from 'layout/nav/main-menu/menuSlice';
import settingsReducer from 'settings/settingsSlice';
import notificationReducer from 'layout/nav/notifications/notificationSlice';
import * as auth from 'auth/authSlice';
import * as schools from 'slices/schools';
import layoutReducer from 'layout/layoutSlice';
import { REDUX_PERSIST_KEY } from 'config.js';
import loader from "./utils/redux/reducers/loader";

const persistConfig = {
  key: REDUX_PERSIST_KEY,
  storage,
  whitelist: ['menu', 'settings', 'lang', 'auth'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    settings: settingsReducer,
    layout: layoutReducer,
    lang: langReducer,
    menu: menuReducer,
    notification: notificationReducer,
    scrollspy: scrollspyReducer,
    auth: auth.reducer,
    // auth: auth.reducer,
    loading: loader,
    schoolData: schools.reducer
  }),
);

const sagaMiddleware = createSagaMiddleware();
const middleware = [
    ...getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        thunk: true,
    }),
    sagaMiddleware
];

const store = configureStore({
    reducer: persistedReducer,
    middleware,
    devTools: process.env.NODE_ENV !== "production",
    enhancers: [reduxBatch]
  // reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});
const persistedStore = persistStore(store);
export { store, persistedStore };
export default store;
