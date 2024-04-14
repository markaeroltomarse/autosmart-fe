import HeroBg from '@/assets/images/base_img_white_bg_red_bar.png';
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();
  useEffect(() => {
    getProducts(undefined).then(({ data }) => {
      console.log(data);
    });
  }, []);

  const tempProducts = useMemo(() => {
    if (!productsState.isSuccess) return [];
    if (!selectedCategory) return productsState?.data.data;
    return productsState?.data.data.filter(
      (product: IProductType) => product.category === selectedCategory
    );
  }, [productsState, selectedCategory]);
  return (
    <>
      <main className=" ">
        <p className="flex items-center  absolute top-0 left-1/2 transform -translate-x-1/2 z-10 p-2 text-white text-bold hover:text-gray-300 cursor-pointer">
          Need Help? Contact Us!
        </p>

        <Navbar
          onSelectedCategory={(category: string) =>
            setSelectedCategory(category)
          }
        />

        <div className=" relative w-[100vw] h-[50vh] ">
          <Image
            className="bg-black  object-cover w-full h-full"
            src={
              HeroBg
            }
            fill
            alt={'https://media.discordapp.net/attachments/1087951220313956486/1100320518256730142/Discount.png?width=1440&height=338'}
          />
        </div>
        {/* <BannerSlider/> */}

        <div className="p-5 md:px-[10%] md:py-5 flex gap-2 flex-col">
          <h1 className="text-2xl font-bold">ORDER NOW!</h1>
          <div className="flex gap-2 flex-row flex-wrap ">
            {productsState.isLoading && (
              <div className="flex items-center justify-center h-[30vh] w-full font-bold text-red-500">
                Loading products...
              </div>
            )}
            {!productsState.isLoading && tempProducts.length === 0 && (
              <div className="flex items-center justify-center h-[30vh] w-full font-bold text-red-500">
                Products not found for | {selectedCategory}
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
                    <div className="flex justify-between ">
                      <div>
                        <span className="text-slate-500 line-through">
                          ₱{product.price}
                        </span>{' '}
                        ₱{product.price - product.discount}
                      </div>

                      <Button
                        icon={<BsFillCartPlusFill color="white" />}
                        buttonClass="border py-2 px-3 text-xs justify-center bg-blue-950"
                        onClick={() => {
                          router.replace('/products/' + product.id);


                        }}
                      />



                    </div>

                  </div>

                </div>

              ))}
          </div>

        </div>
        <Footer />


      </main>
    </>
  );
}
