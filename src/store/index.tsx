import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import { adminApi } from './api/adminApi';
import { cartsApi } from './api/cartApi';
import { customersApi } from './api/customerApi';
import { ordersApi } from './api/ordersApi';
import { productsApi } from './api/productsApi';
import cartSlice from './reducers/cartsReducers';
import componentsReducers from './reducers/componentsReducers';
import productReducer from './reducers/productsReducers';
import userReducer from './reducers/userReducers';

const persistedCartReducer = persistReducer(
  { key: 'cart', storage: storageSession },
  cartSlice.reducer
);

const store: any = () =>
  configureStore({
    reducer: {
      [productsApi.reducerPath]: productsApi.reducer,
      [customersApi.reducerPath]: customersApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer,
      [cartsApi.reducerPath]: cartsApi.reducer,
      [ordersApi.reducerPath]: ordersApi.reducer,
      // Persists,
      [cartSlice.name]: persistedCartReducer,
      productReducer,
      userReducer,
      componentsReducers
    },
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(
        productsApi.middleware,
        customersApi.middleware,
        adminApi.middleware,
        cartsApi.middleware,
        ordersApi.middleware,

        // productsApi.middleware
      ),
  });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export default store;
export const wrapper = createWrapper<AppStore>(store);
