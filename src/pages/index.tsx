import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import {
  useCreateProductMutation,
  useLazyGetProductsQuery,
} from '@/store/api/productsApi';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar/navbar';

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
      <main className="">
        <Navbar/>
        <div className='p-5 md:px-[10%] md:py-5'>
        <h1 className="text-2xl">
          AutoSmart {productsState.isSuccess && productsState?.data.data.length}

        </h1>
        <div className="flex gap-2 flex-row flex-wrap border">
          {productsState.isSuccess &&
            productsState?.data.data.map((product: any) => (
              <div
                className="border p-5 rounded bg-white flex-wrap w-[24.2%]"
                key={product.id}
              >
              
              
                {/* <Image
                  src={
                    'https://cdn.shopify.com/s/files/1/0580/3245/5858/products/10-pc-chickenjoy-bucket.jpg?v=1635459211&width=1080'
                  }
                  alt="product"
                  width={150}
                  height={150}
                /> */}
                <div className="flex justify-between">
                  <div>{product.name}</div>
                  <div>
                    <span className="text-slate-500 line-through">
                      ${product.price}
                    </span>{' '}
                    ${product.price - product.discount}
                  </div>
                </div>
              </div>
            ))}
        </div>

        </div>
       
      </main>
    </>
  );
}
