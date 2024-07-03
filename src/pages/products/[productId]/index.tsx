import Button from '@/components/Button';
import BasicLoader from '@/components/Loader/basic-loader';
import Select from '@/components/Select';
import SelectChips from '@/components/SelectChips';
import { COLORS } from '@/constants/colors.contant';
import {
  useLazyGetCategoriesQuery,
  useLazyGetProductQuery
} from '@/store/api/productsApi';
import { IProductType } from '@/types/product.type';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Alert from '@/components/Alert';
import Navbar from '@/components/Navbar/navbar';
import { useAppSelector } from '@/hooks/useAppSelector';
import useCart from '@/hooks/useCart';
import { useAddToCartMutation } from '@/store/api/cartApi';

// export const getServerSideProps: GetServerSideProps =
//   wrapper.getServerSideProps((store) => async (ctx) => {
//     const product = await store.dispatch(
//       getProduct.initiate(ctx.query.productId as string)
//     );
//     console.log(ctx.query.productId);
//     return {
//       props: {
//         product: product?.data?.data || null,
//       },
//     };
//   });
//{ product }: { product: IProductType }
export default function ProductPage() {
  const [addToCart, addToCartState] = useAddToCartMutation();
  const [getCategories, getCategoriesState] = useLazyGetCategoriesQuery();
  const [APPLICATIONS, SETAPPLICATIONS] = useState<string[] | number[]>([
    'Driver Side ',
    'Passenger Side ',
    'SET ',
  ]);
  const [selectedApplication, setSelectApplication] = useState<string | number>(
    ''
  );
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const cart = useAppSelector(store => store.cartReducer.cart)

  const { handleAddToCart: handleAddToCartStore, handleSetCart } = useCart()

  useEffect(() => {
    const container = document.getElementById('container');
    const img = document.getElementById('test-img');
    container?.addEventListener('mousemove', onZoom);
    container?.addEventListener('mouseover', onZoom);
    container?.addEventListener('mouseleave', offZoom);
    function onZoom(e: any) {
      const x = e.clientX - e.target.offsetLeft;
      const y = e.clientY - e.target.offsetTop;
      img!.style.transformOrigin = `${x}px ${y}px`;
      img!.style.transform = 'scale(2.5)';
    }
    function offZoom(e: any) {
      img!.style.transformOrigin = `center center`;
      img!.style.transform = 'scale(1)';
    }
  }, []);

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState('');
  const [product, setProduct] = useState<IProductType | null>(null);
  const [getProduct, getProductState] = useLazyGetProductQuery();

  const getProductHandler = async (id: string) => {
    const { data } = await getProduct(id);
    setProduct(data?.data);
    setSelectedImage(data?.data.images[0]);
    await getCategories(data?.data.productType);
  };


  useEffect(() => {
    if (router.query?.productId) {
      getProductHandler(router.query?.productId as string);
    }
  }, [router]);

  useEffect(() => {
    setSelectApplication(APPLICATIONS[0]);
    setSelectedColor(COLORS[0].name);
  }, [APPLICATIONS]);

  const handleAddToCart = async () => {
    if (selectedColor && selectedApplication && product) {
      await addToCart({
        productId: product!.id,
        quantity: 1,
        application: String(selectedApplication),
        color: selectedColor,
      }).then(async ({ data }: any) => {
        if (data?.data) {
          handleSetCart(data.data)
        }
      })
    }
  };

  const handleAddToCartResponseAlert = () => {
    const error: any = addToCartState.error;
    if (error?.status === 401) {
      setTimeout(() => addToCartState.reset(), 5000); // 5 Seconds
      return (
        <Alert
          onClick={() => {
            router.replace({
              pathname: '/account/authentication',
            });
          }}
          type={'error'}
          title={'Failed'}
          message={'Login required (Click here), Please try again.'}
          className="cursor-pointer"
        />
      );
    }

    if (addToCartState.isSuccess) {
      setTimeout(() => addToCartState.reset(), 5000); // 5 Seconds
      return (
        <Alert
          type={'success'}
          title={'Success'}
          message={'Check your cart items.'}
        />
      );
    }

    if (addToCartState.isError) {
      setTimeout(() => addToCartState.reset(), 5000);
      return (
        <Alert
          type={'error'}
          title={'Failed'}
          message={'Something wrong, Please try again.'}
        />
      );
    }
  };

  const handleAddToCartValidation = () => {
    if (!selectedColor)
      return (
        <Alert
          type={'error'}
          title={'Failed'}
          message={'Please select a color.'}
        />
      );

    if (!selectedApplication)
      return (
        <Alert
          type={'error'}
          title={'Failed'}
          message={'Plesae select application.'}
        />
      );
  };

  if (getProductState.isLoading)
    return (
      <>
        <div className="bg-white h-[50vh] w-full flex items-center justify-center">
          <h1 className="text-3xl text-red-700">Please wait...</h1>
        </div>
      </>
    );


  if (!product && !getProductState.isLoading)
    return (
      <>
        <div className="bg-white h-[50vh] w-full flex items-center justify-center">
          <h1 className="text-3xl text-red-700">Product not found</h1>
        </div>
      </>
    );

  if (product) {
    return (
      <>
        <main className="">
          {addToCartState.isLoading && (
            <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
              <BasicLoader />
            </div>
          )}
          <Navbar />
          {handleAddToCartResponseAlert()}
          {handleAddToCartValidation()}
          <div className="p-5 md:px-[10%] md:py-5 flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Featured Product</h1>
            <div className="p-5 bg-white flex gap-2">
              <div className="w-[130px] flex flex-col gap-2">
                {product.images.map(
                  (src) =>
                    src && (
                      <Image
                        key={src}
                        src={src}
                        alt="product"
                        width={100}
                        height={100}
                        className={`border-2 cursor-pointer ${selectedImage === src
                          ? 'border-red-500'
                          : 'border-slate-500'
                          }`}
                        onClick={() => setSelectedImage(src)}
                      />
                    )
                )}
              </div>
              <div className="flex w-full">
                <div id="container">
                  <img
                    src={selectedImage}
                    alt="Image Alt"
                    className="IMG"
                    id="test-img"
                  />
                </div>

                <div className="w-1/2 px-5 break-words">
                  <h2 className="text-2xl font-bold">{product?.name}</h2>
                  <h2 className="text-2xl font-bold">{product?.brandName}</h2>

                  <p className="text-md text-slate-400 font-bold py-3">
                    {product?.description}
                  </p>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center  gap-2">
                      <h3 className="font-bold">Variant: </h3>
                      <Select
                        options={COLORS.map((color) => color.name)}
                        className="p-0"
                        placeholder="Select Variant"
                        onChange={(e) => setSelectedColor(e.target.value)}
                        value={selectedColor}
                      />
                    </div>

                    <div className="flex items-center  gap-2">
                      <h3 className="font-bold">Application: </h3>
                      <h3 className="font-bold text-slate-500">
                        {selectedApplication}
                      </h3>
                    </div>

                    <SelectChips
                      options={APPLICATIONS}
                      onSelectOne={(selected) => {
                        setSelectApplication(selected);
                      }}
                      defaultValueOne={selectedApplication}
                    />

                    <div className="flex flex-row gap-5 justify-center mt-[20%] ">
                      <Button
                        title={product.quantity <= 0 ? "Out of Stock" : "Add to cart"}
                        buttonClass={`bg-red-700 w-full rounded text-white flex-initial py-3 ${product.quantity <= 0 ? 'w-102' : 'w-full'}`}
                        onClick={handleAddToCart}
                        disabled={product.quantity <= 0}
                      />

                      {/* <Button
                        disabled
                        title="Buy now"
                        buttonClass="bg-blue-950 rounded text-white flex-initial w-full py-3"
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}
