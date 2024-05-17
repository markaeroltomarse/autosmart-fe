import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { read_cookie } from 'sfcookies';

interface INewCustomer {
  email: string;
  fname?: string;
  lname?: string;
  profileImage?: string;
}

interface INewEmployee {
  email: string;
  fname?: string;
  lname?: string;
  profileImage?: string;
  role: string;
}
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return read_cookie('token');
  } else {
    return null;
  }
};

export const adminApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API}/api/admin`,
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  reducerPath: 'adminApi',
  tagTypes: ['GetAdmin', 'GetSalesPrediction', 'GetInventoryPrediction'],
  endpoints: (build) => ({
    getAdmiProfile: build.query({
      query: (token?: string) => {
        return {
          url: ``,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
      providesTags: ['GetAdmin'],
    }),
    createAdmin: build.mutation({
      query: (newEmployee: INewEmployee) => {
        return {
          url: ``,
          method: 'POST',
          body: newEmployee,
        };
      },
    }),
    loginAdmin: build.mutation({
      query: (newEmployee: { email: string }) => {
        return {
          url: `/login`,
          method: 'POST',
          body: newEmployee,
        };
      },
    }),
    getSalesPrediction: build.query({
      query: (token?: string) => {
        return {
          url: `/sales-prediction`,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
      providesTags: ['GetSalesPrediction'],
    }),
    getInventoryPrediction: build.query({
      query: (token?: string) => {
        return {
          url: `/inventory-prediction`,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
      providesTags: ['GetInventoryPrediction'],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useLoginAdminMutation,
  useLazyGetAdmiProfileQuery,
  useLazyGetSalesPredictionQuery,
  useLazyGetInventoryPredictionQuery,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = adminApi;
export const { getAdmiProfile, createAdmin, loginAdmin, getSalesPrediction, getInventoryPrediction } = adminApi.endpoints;
