import { useRouter } from 'next/router';
import Image from 'next/image';
import Select from '@/components/Select';
import { COLORS } from '@/constants/colors.contant';
import SelectChips from '@/components/SelectChips';
import Button from '@/components/Button';
import ProductImageZoom from '@/components/ZoomableImage';
import { useEffect, useState } from 'react';
import { getProduct, useLazyGetProductQuery } from '@/store/api/productsApi';
import { IProductType } from '@/types/product.type';
import BasicLoader from '@/components/Loader/basic-loader';
import { wrapper } from '@/store';
import { GetServerSideProps } from 'next';

import { useAddToCartMutation } from '@/store/api/cartApi';
import Alert from '@/components/Alert';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { tempAddToCart, tempSetCart } from '@/store/reducers/cartsReducers';
import Navbar from '@/components/Navbar/navbar';
import { useLazyGetCustomerProfileQuery } from '@/store/api/customerApi';
import { read_cookie } from 'sfcookies';

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
  const [APPLICATIONS, SETAPPLICATIONS] = useState<string[] | number[]>([
    'Driver Side ',
    'Passenger Side ',
    'SET ',
  ]);
  const [selectedApplication, setSelectApplication] = useState<string | number>(
    ''
  );
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);

  const dispatch = useAppDispatch();
  

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
  const [selectedImage, setSelectedImage] = useState("");
  const [product, setProduct] = useState<IProductType | null>(null);
  const [getProduct, getProductState] = useLazyGetProductQuery();
  useEffect(() => {
    if (router.query?.productId) {
      getProduct(router.query?.productId as string).then(({ data }) => {
        setProduct(data?.data);
        setSelectedImage(data?.data.images[0])
      });
    }
  }, [router]);

  

  useEffect(() => {
    setSelectApplication(APPLICATIONS[0]);
    setSelectedColor(COLORS[0].name);
  }, [APPLICATIONS]);

  const handleAddToCart = () => {
    if (selectedColor && selectedApplication) {
      addToCart({
        productId: product!.id,
        quantity: 1,
        application: String(selectedApplication),
        color: selectedColor,
      });
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

  if (!product)
    return (
      <>
        <div className="bg-white h-[50vh] w-full flex items-center justify-center">
          <h1 className="text-3xl text-red-700">Product not found</h1>
        </div>
      </>
    );

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
                      className={`border-2 cursor-pointer ${
                        selectedImage === src
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

              <div className="w-1/2 px-5">
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
                    {product.quantity <= 0 ? (
                      <Button
                        title="Out of Stock"
                        buttonClass="bg-red-700 rounded text-white flex-initial w-102 py-3"
                        onClick={handleAddToCart}
                        disabled={true}
                      />
                    ) : (
                      <Button
                        title="Add to cart"
                        buttonClass="bg-red-700 rounded text-white flex-initial w-full py-3"
                        onClick={handleAddToCart}
                      />
                    )}

                    <Button
                      title="Buy now"
                      buttonClass="bg-blue-950 rounded text-white flex-initial w-full py-3"
                    />
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
