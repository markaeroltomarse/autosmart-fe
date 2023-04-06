import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import {
  useCreateProductMutation,
  useLazyGetProductsQuery,
} from '@/store/api/productsApi';
import { useEffect } from 'react';

export default function Home() {
  const [getProducts, productsState] = useLazyGetProductsQuery();

  useEffect(() => {
    // const { isLoading, isError, data } = productsState
    getProducts(undefined).then(({ data }) => {
      console.log(data);
    });
    // createProduct({
    //   brandName: 'test brand',
    //   name: 'app product',
    //   category: 'test category',
    //   price: 1000,
    //   quantity: 100,
    //   status: 'test status',
    //   discount: 10,
    // }).then(({ data, error }: any) => {
    //   console.log(error);
    //   console.log(data);
    // });
  }, []);
  return (
    <>
      <main className="p-5 md:px-[10%] md:py-5">
        <h1 className="text-2xl">
          Products {productsState.isSuccess && productsState?.data.data.length}
        </h1>
        <div className="flex">
          {productsState.isSuccess &&
            productsState?.data.data.map((product: any) => (
              <div className="border p-5 rounde" key={product.id}>
                {product.name}
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
