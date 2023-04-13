import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { read_cookie } from 'sfcookies';

interface INewProduct {
  brandName: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  discount: number;
}

interface IUpdateProduct {
  id?: string;
  brandName?: string;
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  status?: string;
  discount?: number;
}

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZnVvODE1bDAwMDB0dnlvM2M2MGd0OTAiLCJpYXQiOjE2ODA1MjUwODN9.FMpKpoH8HSlKwm0jieNBUlpA01qtHDRTrIGvPPguqC0';
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
    getProduct: build.query({
      query: (productId: string) => {
        return {
          url: `/${productId}`,
          method: 'GET',
        };
      },
      providesTags: ['GetProducts'],
    }),
    createProduct: build.mutation({
      query: (newProduct: INewProduct, token?: string) => {
        return {
          url: ``,
          method: 'POST',
          body: newProduct,
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),

    updateProduct: build.mutation({
      query: (updateProduct: IUpdateProduct, token?: string) => {
        const id = updateProduct.id;
        return {
          url: `/${id}`,
          method: 'PUT',
          body: updateProduct,
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),
  }),
});

export const {
  useLazyGetProductsQuery,
  useLazyGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = productsApi;
export const { getProducts, getProduct, createProduct, updateProduct } =
  productsApi.endpoints;
