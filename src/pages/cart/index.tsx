import Alert from '@/components/Alert';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import Navbar from '@/components/Navbar/navbar';

import {
  useCheckOutMutation,
  useLazyGetCartQuery,
  useUpdateCartItemQuantityMutation,
} from '@/store/api/cartApi';
import { IProductType } from '@/types/product.type';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { MdProductionQuantityLimits } from 'react-icons/md';

interface ICartType {
  id: string;
  customerId: string;
  products: {
    color: string;
    application: string;
    product: IProductType;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function Cart() {
  const [getCart, getCartState] = useLazyGetCartQuery();
  const [cart, setCart] = useState<ICartType | null>(null);
  const [PRODUCTS, SETPRODUCTS] = useState<
    {
      productId: string;
      quantity: number;
    }[]
  >([]);
  const [selectedProducts, setSelecteProducts] = useState<string[]>([]);
  const [checkOut, checkOutState] = useCheckOutMutation();
  const [updateCartItem, updateCartItemState] =
    useUpdateCartItemQuantityMutation();

  const [focusedOn, setFocusedOn] = useState<string>('');

  const handleGetProducts = () => {
    getCart(undefined).then(({ data, isError }: any) => {
      if (!isError) {
        const cart: ICartType = data.data;
        console.log(cart);
        setCart(cart);
        SETPRODUCTS(
          cart.products.map((prod) => ({
            productId: prod.product.id,
            quantity: prod.quantity,
          }))
        );
      }
    });
  };
  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleAddToCartResponseAlert = () => {
    if (checkOutState.isSuccess)
      return (
        <Alert
          type={'success'}
          title={'Success'}
          message={'Your order is now pending, Thank you.'}
        />
      );

    if (checkOutState.isError)
      return (
        <Alert
          type={'error'}
          title={'Failed'}
          message={'Something wrong in your check out, Please try again.'}
        />
      );

    if (checkOutState.fulfilledTimeStamp) {
      setTimeout(() => checkOutState.reset(), 5000); // 5 Seconds
    }
  };

  const handleCheckOut = () => {
    if (updateCartItemState.isLoading) return;
    if (selectedProducts.length === 0) {
      alert('Please select the products.');
    } else {
      const toBeCheckOut: any[] = selectedProducts.map((id) => ({
        productId: id,
        quantity: cart?.products.find((product) => product.product.id === id)
          ?.quantity,
      }));

      checkOut({
        products: toBeCheckOut,
      }).then((response: any) => {
        if (response.error) {
        return alert('Please select an address for your order, Please try again')
        }
        if (response.data.message === 'success') {
          getCart(undefined).then(({ data, isError }: any) => {
            if (!isError) {
              const cart: ICartType = data.data;
              setCart(cart);
            }
          });
        }
      });
    }
  };

  return (
    <>
      <main className="">
        {(checkOutState.isLoading ||
          getCartState.isLoading ||
          updateCartItemState.isLoading) && (
          <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
            <BasicLoader />
          </div>
        )}
        <Navbar />
        {handleAddToCartResponseAlert()}
        <div className="p-5 md:px-[10%] md:py-5">
          <div className="flex gap-2 flex-wrap  flex-col">
            <div className="flex bg-white w-full items-center p-3">
              <div className="flex-auto text-center">
                <h4 className="font-bold text-1xl">Products</h4>
              </div>
              <div className="w-[15%] text-center">
                <h4 className="font-bold text-1xl">Unit Price</h4>
              </div>
              <div className="w-[15%] text-center">
                <h4 className="font-bold text-1xl">Quantity</h4>
              </div>
              <div className="w-[15%] text-center">
                <h4 className="font-bold text-1xl">Total Price</h4>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-5 bg-white ">
              <div className="ITEMS h-[80vh] overflow-y-scroll flex flex-col gap-6">
                {cart?.products.map((product) => (
                  <div
                    key={product.product.id}
                    className="flex bg-white w-full items-center  border-b pb-5"
                  >
                    <div className="flex-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <Image
                              src={
                                product.product.images[0] ||
                                'https://cdn.shopify.com/s/files/1/0580/3245/5858/products/10-pc-chickenjoy-bucket.jpg?v=1635459211&width=1080'
                              }
                              width={120}
                              height={120}
                              alt="product"
                            />
                          </div>
                          <div>
                            <small className="font-bold">
                              {product.product.brandName}
                            </small>
                            <h2 className="font-bold text-2xl">
                              {product.product.name}
                            </h2>
                          </div>
                        </div>

                        <div className="text-center">
                          <h2 className="font-bold text-1xl">
                            {product.color}
                          </h2>
                          <h2 className="font-bold text-1xl">
                            {product.application}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="w-[15%] text-center">
                      <h4 className="font-bold text-4xl">
                        ₱{product.product.price}
                      </h4>
                    </div>
                    <div className="w-[15%] text-center flex items-center">
                      <Input
                        name={product.product.id}
                        value={product.quantity}
                        type={'number'}
                        className="text-center w-[100px]"
                        onFocus={(e) =>
                          e.target.name === product.product.id &&
                          setFocusedOn(product.product.id)
                        }
                        onBlur={(e) => {
                          const CONSTPRODUCT = PRODUCTS.find(
                            (prod) => prod.productId === product.product.id
                          );

                          if (
                            CONSTPRODUCT &&
                            +e.target.value !== CONSTPRODUCT.quantity
                          ) {
                            updateCartItem({
                              productId: product.product.id,
                              quantity: +e.target.value,
                            }).then(() => {
                              handleGetProducts();
                            });
                          }

                          setFocusedOn('');
                        }}
                        onChange={(e) => {
                          setCart((prev: any) => {
                            if (prev) {
                              let tempCartProducts = JSON.parse(
                                JSON.stringify(prev.products)
                              );
                              tempCartProducts.forEach((prod: any) => {
                                if (
                                  prod.product.id === product.product.id &&
                                  +e.target.value <= prod.product.quantity
                                ) {
                                  prod.quantity = Number(e.target.value);
                                }
                              });
                              return {
                                ...prev,
                                products: tempCartProducts,
                              };
                            }
                          });
                        }}
                      />

                      {focusedOn === product.product.id && (
                        <div className="flex gap-2 items-center text-red-500">
                          <MdProductionQuantityLimits color="red" /> (
                          {product.product.quantity})
                        </div>
                      )}
                    </div>
                    <div className="w-[15%] text-center text-red-500">
                      <h4 className="font-bold text-4xl">
                        ₱{product.quantity * product.product.price}
                      </h4>
                    </div>
                    <div className=" text-center text-red-500">
                      <button
                        onClick={(e) => {
                          if (selectedProducts.includes(product.product.id)) {
                            setSelecteProducts(
                              selectedProducts.filter(
                                (id) => id !== product.product.id
                              )
                            );
                          } else {
                            setSelecteProducts([
                              ...selectedProducts,
                              product.product.id,
                            ]);
                          }
                        }}
                        className={`CHECKBOX border p-3 rounded flex items-center justify-center ${
                          selectedProducts.includes(product.product.id)
                            ? 'bg-blue-400'
                            : 'bg-slate-100'
                        }`}
                      >
                        {selectedProducts.includes(product.product.id) && (
                          <BsCheckLg color="white" className="absolute " />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <div></div>
                <div>
                  <Button
                    title="Order Now"
                    buttonClass="bg-blue-950 text-white rounded-sm w-[250px] p-3"
                    onClick={handleCheckOut}
                  />
                </div>
                <div>
                  <Button
                    title="Remove"
                    buttonClass="bg-red-600 text-white rounded-sm p-3"
                    disabled={selectedProducts.length === 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
