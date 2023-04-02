import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { productsApi } from './api/productsApi';
import productReducer from './reducers/productsReducers';


const store: any = () =>
  configureStore({
    reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    productReducer,
    },
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(
        productsApi.middleware,
        // distributorApi.middleware,
        // productsApi.middleware
      ),
  });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export default store;
export const wrapper = createWrapper<AppStore>(store);
