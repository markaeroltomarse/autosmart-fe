import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { read_cookie } from 'sfcookies';

interface ICheckOutInput {
  products: {
    productId: string;
    quantity: number;
  }[];
}

interface IAddToCartInput {
  productId: string;
  quantity: number;
}

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return read_cookie('token');
  } else {
    return null;
  }
};

export const ordersApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API}/api/transactions`,
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  reducerPath: 'ordersApi',
  tagTypes: ['GetOrders'],
  endpoints: (build) => ({
    getOrders: build.query({
      query: (token?: string) => {
        return {
          url: ``,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`, // pass the user token(authenticated identifier) to get his cart record
          },
        };
      },
      providesTags: ['GetOrders'],
    }),

    updateOrderStatus: build.mutation({
      query: (
        updateOrderInput: {
          serialNumber: string;
          status: 'pending' | 'shipped' | 'completed' | 'cancelled';
        },
        token?: string
      ) => {
        return {
          url: `/${updateOrderInput.serialNumber}`,
          method: 'PUT',
          body: {
            status: updateOrderInput.status,
          },
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),
  }),
});

export const {
  useLazyGetOrdersQuery,
  useUpdateOrderStatusMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = ordersApi;
export const { getOrders, updateOrderStatus } = ordersApi.endpoints;
