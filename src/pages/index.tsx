import AAPBanner from "@/assets/images/BASE.png";
import AAPBannercomp from "@/assets/images/TOYOTA SUPRA W BG.png";
import AAPMainBackground from "@/assets/images/WHEEL BG FULL.png";
import Button from '@/components/Button';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/navbar';
import {
  useLazyGetProductsQuery
} from '@/store/api/productsApi';
import { IProductType } from '@/types/product.type';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { BsFillCartPlusFill } from 'react-icons/bs';

export default function Home() {
  const [getProducts, productsState] = useLazyGetProductsQuery();
  const [formData, setFormData] = useState({
    search: '',
    category: ''
  })
  const router = useRouter();
  useEffect(() => {
    getProducts(undefined).then(({ data }) => {
      console.log(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tempProducts = useMemo(() => {
    if (!productsState.isSuccess) return [];
    if (!formData?.category && !formData?.search) return productsState?.data.data;

    console.log('formData', formData)

    let result = []
    if (formData?.category) {
      result = productsState?.data.data.filter(
        (product: IProductType) => product.category === formData?.category
      )
    }

    if (formData?.search) {
      result = productsState?.data.data.filter(
        (product: IProductType) => product.name.toLowerCase().includes(formData?.search.toLowerCase())
      )
    }

    return result
  }, [productsState, formData]);

  return (
    <>
      <main className=" ">
        <p className="flex items-center  absolute top-0 left-1/2 transform -translate-x-1/2 z-10 p-2 text-blue-950 text-bolder hover:text-gray-300 cursor-pointer">
          Need Help? Contact Us!
        </p>

        <Navbar
          onChangeFormData={(formData) => {
            setFormData(formData)
          }}
        />

        <div className="relative w-[100vw] h-[50vh] z-10 flex justify-end items-center">
          <Image
            className="bg-blue-950  object-fit w-full h-full"
            src={
              AAPBanner
            }
            fill
            alt={'aapBanner'}
          />

          <div className="relative w-[600px] h-[35vh] mr-[6.5%]">
            <Image
              className="bg-none object-fit w-full h-full"
              src={
                AAPBannercomp
              }
              fill
              alt={'aapbannercomp'}
            />
          </div>
        </div>
        {/* <div className="absolute top-[32%] right-[5%] z-10">
          <div className="relative w-[600px] h-[35vh] ">
            <Image
              className="bg-none object-fit w-full h-full"
              src={
                AAPBannercomp
              }
              fill
              alt={'aapbannercomp'}
            />
          </div>
        </div> */}
        <div className="fixed bottom-[-10%] right-[-10%] animate-bounce z-0">
          <div className="relative w-[25vw] h-[50vh] ">
            <Image
              className="bg-none  object-fit w-full h-full"
              src={
                AAPMainBackground
              }
              fill
              alt={'aapmainbackground'}
            />
          </div>
        </div>
        {/* <BannerSlider/> */}

        <div className="p-5 md:px-[10%] md:py-5 flex gap-2 flex-col">
          <h1 className="text-2xl font-bold text-blue-950">ORDER NOW!</h1>
          <br />
          <div className="flex gap-2 flex-row flex-wrap ">
            {productsState.isLoading && (
              <div className="flex items-center justify-center h-[30vh] w-full font-bold text-red-500">
                Loading products...
              </div>
            )}
            {!productsState.isLoading && tempProducts.length === 0 && (
              <div className="flex items-center justify-center h-[30vh] w-full font-bold text-red-500">
                Products not found for | {formData?.category} | {formData?.search}
              </div>
            )}
            {productsState.isSuccess &&
              tempProducts.map((product: IProductType) => (
                <div
                  className="p-5 rounded bg-white flex justify-between flex-col hover:mb-2 hover:-mt-2 transition-all"
                  key={product.id}
                >
                  <div>
                    <Image
                      src={
                        product.images[0] ||
                        'https://cdn.shopify.com/s/files/1/0580/3245/5858/products/10-pc-chickenjoy-bucket.jpg?v=1635459211&width=1080'
                      }
                      alt="product"
                      width={150}
                      height={200}
                    />
                  </div>
                  <div className="flex justify-between flex-col relative">
                    <div className="font-bold truncate w-[150px]">
                      {product.name}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        {
                          product.discount > 0 && <>
                            <span className="text-slate-500 line-through">
                              ₱{product.price}
                            </span>{' '}
                          </>
                        }
                        ₱{product.price - product.discount}
                      </div>

                      <Button
                        icon={<BsFillCartPlusFill color="white" />}
                        buttonClass="border py-2 px-3 text-xs justify-center bg-blue-950"
                        onClick={() => {
                          router.push('/products/' + product.id);
                        }}
                        size='small'
                      />
                    </div>
                  </div>

                </div>
              ))}
          </div>
        </div>
        <div className="z-10">
          <Footer />

        </div>
      </main>
    </>
  );
}
