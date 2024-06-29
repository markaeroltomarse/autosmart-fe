import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { read_cookie } from 'sfcookies';

interface INewCustomer {
  email: string;
  fname?: string;
  lname?: string;
  profileImage?: string;
}

interface IUpdateCustomer {
  address?: string[];
  defaultAddress?: string;
  fname?: string;
  lname?: string;
  gender?: 'male' | 'female';
  isRider?: boolean;
  email?: string
}

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return read_cookie('token');
  } else {
    return null;
  }
};

export const customersApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API}/api/customers`,
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  reducerPath: 'customersApi',
  tagTypes: ['GetCustomer', 'GetRiders'],
  endpoints: (build) => ({
    getCustomerProfile: build.query({
      query: (token?: string) => {
        return {
          url: ``,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
      providesTags: ['GetCustomer'],
    }),
    getRiders: build.query({
      query: (token?: string) => {
        return {
          url: `/riders`,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
      providesTags: ['GetRiders'],
    }),
    createCustomer: build.mutation({
      query: (newCustomer: INewCustomer) => {
        return {
          url: ``,
          method: 'POST',
          body: newCustomer,
        };
      },
    }),
    loginCustomer: build.mutation({
      query: (loginCustomer: { email: string, password?: string }) => {
        return {
          url: `/login`,
          method: 'POST',
          body: loginCustomer,
        };
      },
    }),
    updateCustomer: build.mutation({
      query: (updateCustomerInput: IUpdateCustomer, token?: string) => {
        return {
          url: ``,
          method: 'PUT',
          body: updateCustomerInput,
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),
    resendVerifyAccountEmail: build.mutation({
      query: (token?: string) => {
        return {
          url: `/verify`,
          method: 'PATCH',
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useLoginCustomerMutation,
  useLazyGetCustomerProfileQuery,
  useUpdateCustomerMutation,
  useLazyGetRidersQuery,
  useGetCustomerProfileQuery,
  useResendVerifyAccountEmailMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = customersApi;
export const {
  getCustomerProfile,
  createCustomer,
  loginCustomer,
  updateCustomer,
  getRiders,
  resendVerifyAccountEmail
} = customersApi.endpoints;
