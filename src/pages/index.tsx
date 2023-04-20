import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import {
  useCreateProductMutation,
  useLazyGetProductsQuery,
} from '@/store/api/productsApi';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar/navbar';
import { IProductType } from '@/types/product.type';
import { useRouter } from 'next/router';
export default function Home() {
  const [getProducts, productsState] = useLazyGetProductsQuery();

  const router = useRouter();
  useEffect(() => {
    getProducts(undefined).then(({ data }) => {
      console.log(data);
    });
  }, []);
  return (
    <>
      <main className="">
        <Navbar />

        <div className="relative w-[100vw] h-[50vh]">
          <Image
            className=""
            src={
              'https://media.discordapp.net/attachments/1093520927960092772/1095372282492362912/base_img_white_bg_red_bar.png?width=1440&height=338'
            }
            fill
            alt={'asbanner1'}
          />
        </div>

        <div className="p-5 md:px-[10%] md:py-5">
          <h1 className="text-2xl">ORDER NOW!</h1>
          <div className="flex gap-2 flex-row flex-wrap border">
            {productsState.isSuccess &&
              productsState?.data.data.map((product: IProductType) => (
                <div
                  onClick={() => {
                    router.replace('/products/' + product.id);
                  }}
                  className="border p-5 rounded bg-red-500 flex-wrap w-[24.2%]"
                  key={product.id}
                >
                  <Image
                    src={
                      product.images[0] ||
                      'https://cdn.shopify.com/s/files/1/0580/3245/5858/products/10-pc-chickenjoy-bucket.jpg?v=1635459211&width=1080'
                    }
                    alt="product"
                    width={150}
                    height={150}
                  />
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
