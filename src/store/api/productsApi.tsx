import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { read_cookie } from 'sfcookies';

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return read_cookie('token');
  } else {
    return null;
  }
};

export const productsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API}/api/products`,
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  reducerPath: 'productsApi',
  tagTypes: ['GetProducts'],
  endpoints: (build) => ({
    getProducts: build.query({
      query: () => {
        return {
          url: ``,
          method: 'GET',
        };
      },
      providesTags: ['GetProducts'],
    }),
  }),
});

export const {
  useLazyGetProductsQuery,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = productsApi;
export const { getProducts } = productsApi.endpoints;
