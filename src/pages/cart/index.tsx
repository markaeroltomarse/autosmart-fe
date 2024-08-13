import Alert from '@/components/Alert';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import Navbar from '@/components/Navbar/navbar';
import useAlert from '@/hooks/useAlert';
import useCart, { ICartItem } from '@/hooks/useCart';

import {
  useCheckOutMutation,
  useGcashPaymentMutation,
  useUpdateCartItemQuantityMutation
} from '@/store/api/cartApi';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { MdProductionQuantityLimits } from 'react-icons/md';

export default function Cart() {
  const router = useRouter();
  const [PRODUCTS, SETPRODUCTS] = useState<
    ICartItem[]
  >([]);

  const [selectedProducts, setSelecteProducts] = useState<string[]>([]);
  const [requestGcashPayment, requestGcashPaymentState] =
    useGcashPaymentMutation();
  const [checkOut, checkOutState] = useCheckOutMutation();
  const [updateCartItem, updateCartItemState] =
    useUpdateCartItemQuantityMutation();

  const [focusedOn, setFocusedOn] = useState<string>('');

  const { execute } = useAlert();

  const {
    handleSetCart,
    handleGetProducts,
    removeCartRemoveItems,
    getCartState: { isLoading: cartIsLoading },
    removeCartItemsState: { isLoading: removeCartItemsIsLoading },
    cart,
  } = useCart();

  useEffect(() => {
    const loadCart = async () => {
      const cartResponse = await handleGetProducts();

      if (cartResponse) {
        SETPRODUCTS(
          cartResponse.products
        );
      }

    };

    loadCart();
  }, []);

  const handleUpdateQuantity = async (newQuantity: string, product: ICartItem) => {
    const CONSTPRODUCT = PRODUCTS.find(
      (prod: ICartItem) => prod.productId === product.product.id
    );

    if (CONSTPRODUCT && +newQuantity !== CONSTPRODUCT.quantity) {
      await updateCartItem({
        productId: product.product.id,
        quantity: +newQuantity,
        id: product.id
      }).then(async () => {
        const cartResponse = await handleGetProducts();
        if (cartResponse) {
          SETPRODUCTS(
            cartResponse.products
          );
        }
      });
    }

    setFocusedOn('');
  }

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
          message={'Something went wrong with your checkout, please try again.'}
        />
      );

    if (checkOutState.fulfilledTimeStamp) {
      setTimeout(() => checkOutState.reset(), 5000); // 5 Seconds
    }
  };

  const handleCheckOut = async () => {
    if (updateCartItemState.isLoading) return;
    if (selectedProducts.length === 0) {
      execute({
        message: 'Please select the products.',
        title: 'Required products.',
        type: 'warning',
      });
    } else {
      const toBeCheckOut: any[] = selectedProducts.map((id) => {
        const prod = cart?.products.find(
          (product: ICartItem) => product.id === id
        )

        return {
          id,
          productId: prod?.productId,
          quantity: prod?.quantity,
        }
      });

      // SerialNumber for creating actual record pending transaction.
      const serialNumber = `${Math.floor(Math.random() * 100000)}`;
      sessionStorage.setItem(
        'toBeCheckOut',
        JSON.stringify({
          serialNumber,
          toBeCheckOut,
        })
      );
      let amount = 0;
      for (const item of toBeCheckOut) {
        const cartItem = cart?.products.find(
          (product: ICartItem) => product.id === item.id
        );

        if (cartItem) {
          amount += cartItem.quantity * cartItem.product.price;
          amount = amount - cartItem.product.discount
        }
      }

      const { data, error }: any = await requestGcashPayment({
        externalId: serialNumber,
        amount,
        phoneNumber: '+639097801235',
      }).catch((error: any) => {
        sessionStorage.setItem('toBeCheckOut', '');
      });

      if (error) {
        execute({
          message: error.data.message,
          title: 'Order error',
          type: 'error',
        });
        sessionStorage.setItem('toBeCheckOut', '');
      }

      if (data) {
        router.replace(data.desktop_web_checkout_url)
        // window.location.href = data.desktop_web_checkout_url;
      }
    }
  };

  const totalAmount = useMemo(() => {
    if (!cart?.products || cart?.products.length === 0) return 0

    let total = 0
    for (const selectedProductId of selectedProducts) {
      const product = cart?.products.find(prod => prod.id === selectedProductId)
      if (product) {
        total += (product?.product?.price - product?.product?.discount) * product?.quantity
      }
    }

    return total
  }, [cart, selectedProducts])


  useEffect(() => {
    if (!sessionStorage.getItem('toBeCheckOut')) return;
    const prevCheckOut = JSON.parse(sessionStorage.getItem('toBeCheckOut')!);

    if (
      router.query.payment === 'success' &&
      prevCheckOut &&
      prevCheckOut?.toBeCheckOut.length > 0
    ) {
      checkOut({
        serialNumber: prevCheckOut.serialNumber,
        products: prevCheckOut.toBeCheckOut,
      }).then(async (response: any) => {
        if (response.error) {
          return alert(response.error.data.message);
        }

        if (response.data.message === 'success') {
          handleGetProducts();
          sessionStorage.setItem('toBeCheckOut', '');
          router.replace('/cart');
        }
      });
    }
  }, [router]);

  return (
    <>
      <main className="min-h-screen bg-gray-100">
        {(requestGcashPaymentState.isLoading ||
          checkOutState.isLoading ||
          cartIsLoading ||
          removeCartItemsIsLoading ||
          updateCartItemState.isLoading) && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <BasicLoader />
            </div>
          )}
        <Navbar />
        {handleAddToCartResponseAlert()}
        <div className="p-5 md:px-[10%] md:py-5">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center p-3 border-b">
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-xl">Products</h4>
              </div>
              <div className="w-full md:w-1/5 text-center">
                <h4 className="font-bold text-xl">Unit Price</h4>
              </div>
              <div className="w-full md:w-1/5 text-center">
                <h4 className="font-bold text-xl">Quantity</h4>
              </div>
              <div className="w-full md:w-1/5 text-center">
                <h4 className="font-bold text-xl">Total Price</h4>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-5 bg-white">
              <div className="ITEMS h-[60vh] overflow-y-auto flex flex-col gap-6">
                {cart &&
                  cart.products.map((product: ICartItem) => (
                    <div
                      key={product.id}
                      className="flex flex-col md:flex-row items-center justify-between bg-white w-full border-b pb-5"
                    >
                      <div className="flex-1 flex items-center gap-3 overflow-hidden">
                        <Image
                          src={
                            product.product.images[0] ||
                            'https://cdn.shopify.com/s/files/1/0580/3245/5858/products/10-pc-chickenjoy-bucket.jpg?v=1635459211&width=1080'
                          }
                          width={120}
                          height={120}
                          alt="product"
                        />
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <small className="font-bold text-slate-600">
                            {product.product.brandName}
                          </small>
                          <h2 className="font-bold text-2xl truncate">
                            {product.product.name}
                          </h2>
                        </div>
                      </div>
                      <div className="w-full md:w-1/5 text-center">
                        <h2 className="font-bold text-xl">{product.color}</h2>
                        <h2 className="font-bold text-xl">{product.application}</h2>
                      </div>
                      <div className="w-full md:w-1/5 text-center">
                        <h4 className="font-bold text-xl">₱{product.product.price - product.product.discount}</h4>
                      </div>
                      <div className="w-full md:w-1/5 text-center flex items-center justify-center">
                        <Input
                          name={product.product.id}
                          value={product.quantity}
                          type="number"
                          className="text-center w-20"
                          onFocus={(e) =>
                            e.target.name === product.product.id && setFocusedOn(product.product.id)
                          }
                          onBlur={(e) => {
                            handleUpdateQuantity(e.target.value, product)
                          }}
                          onChange={(e) => {
                            if (cart) {
                              let tempCartProducts = JSON.parse(
                                JSON.stringify(cart.products)
                              );
                              tempCartProducts.forEach((prod: any) => {
                                if (
                                  prod.id === product.id &&
                                  +e.target.value <= prod.product.quantity
                                ) {
                                  prod.quantity = Number(e.target.value);
                                }
                              });

                              handleSetCart({
                                ...cart,
                                products: tempCartProducts,
                              });
                            }
                          }}
                        />
                        {focusedOn === product.id && (
                          <div className="flex gap-2 items-center text-red-500">
                            <MdProductionQuantityLimits color="red" /> ({product.product.quantity})
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-1/5 text-center text-red-500">
                        <h4 className="font-bold text-xl">₱{(product.quantity * (product.product.price - product.product.discount)).toLocaleString()}</h4>
                      </div>
                      <div className="text-center text-red-500">
                        <button
                          onClick={() => {
                            if (selectedProducts.includes(product.id)) {
                              setSelecteProducts(
                                selectedProducts.filter((id) => id !== product.id)
                              );
                            } else {
                              setSelecteProducts([...selectedProducts, product.id]);
                            }
                          }}
                          className={`border p-3 rounded flex items-center justify-center ${selectedProducts.includes(product.id)
                            ? 'bg-blue-400'
                            : 'bg-slate-100'
                            }`}
                        >
                          {selectedProducts.includes(product.id) && (
                            <BsCheckLg color="white" className="absolute" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between">
                <div></div>
                <div className="mt-4 md:mt-0">
                  <Button
                    title={`Pay Now | Gcash ₱${totalAmount.toLocaleString()}`}
                    buttonClass="bg-blue-950 text-white rounded-sm w-full md:w-64 p-3"
                    onClick={handleCheckOut}
                    disabled={selectedProducts.length === 0}
                  />
                </div>
                <div className="mt-4 md:mt-0">
                  <Button
                    title="Remove"
                    buttonClass="bg-red-600 text-white rounded-sm w-full md:w-64 p-3"
                    disabled={selectedProducts.length === 0}
                    onClick={() => removeCartRemoveItems(selectedProducts)}
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
