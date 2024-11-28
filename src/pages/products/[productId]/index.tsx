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
import useCart from '@/hooks/useCart';
import { useAddToCartMutation } from '@/store/api/cartApi';

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
    setSelectedImage(data?.data?.images[0]);
    await getCategories(data?.data?.productType);
  };


  useEffect(() => {
    if (router.query?.productId) {
      getProductHandler(router.query?.productId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <main className="relative">
          {addToCartState.isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 z-50">
              <BasicLoader />
            </div>
          )}
          <Navbar />
          {handleAddToCartResponseAlert()}
          {handleAddToCartValidation()}

          <div className="p-5 md:px-10 md:py-8 flex flex-col gap-6 max-w-screen-lg mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-800">Featured Product</h1>

            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:w-1/3 flex flex-col gap-4 p-4 border-r border-gray-200">
                {product.images.map((src) =>
                  src ? (
                    <Image
                      key={src}
                      src={src}
                      alt="product"
                      width={100}
                      height={100}
                      className={`border-2 cursor-pointer rounded ${selectedImage === src
                        ? 'border-red-500'
                        : 'border-gray-300'
                        }`}
                      onClick={() => setSelectedImage(src)}
                    />
                  ) : null
                )}
              </div>

              <div className="md:w-2/3 flex flex-col p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={selectedImage}
                    alt={product?.name || "Selected product image"}
                    className="w-full h-auto rounded-lg shadow-md IMG"
                    id="test-img"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product?.name}</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">{product?.brandName}</h3>

                <p className="text-md text-gray-600 mb-4">
                  {product?.description}
                </p>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">Variant:</h4>
                    <Select
                      options={COLORS.map((color) => color.name)}
                      className="w-full"
                      placeholder="Select Variant"
                      onChange={(e) => setSelectedColor(e.target.value)}
                      value={selectedColor}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">Application:</h4>
                    <h4 className="font-semibold text-gray-500">{selectedApplication}</h4>
                  </div>

                  <SelectChips
                    options={APPLICATIONS}
                    onSelectOne={(selected) => {
                      setSelectApplication(selected);
                    }}
                    defaultValueOne={selectedApplication}
                  />
                </div>

                <div className="flex gap-4 mt-auto">
                  <Button
                    title={product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                    buttonClass={`bg-red-700 w-full rounded-lg text-white py-3 ${product.quantity <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={handleAddToCart}
                    disabled={product.quantity <= 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>


      </>
    );
  }
}
