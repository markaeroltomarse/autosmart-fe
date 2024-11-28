import ButtonGroup from '@/components/ButtonGroup';
import BasicLoader from '@/components/Loader/basic-loader';
import CustomerView from '@/components/Views/customer.view';
import { ICartItem } from '@/hooks/useCart';
import useCustomerAuth from '@/hooks/useCustomerAuth';
import { useLazyGetCustomerOrdersQuery } from '@/store/api/ordersApi';
import { ICustomerType } from '@/types/customer.type';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export default function Customer() {
  const router = useRouter();
  const [customer, setCustomer] = useState<ICustomerType | null>(null);
  const [selectedTab, setSelectedTab] = useState<'Completed' | 'Cancelled' | 'Shipped' | 'Pending'>('Pending');
  const [orders, setOrders] = useState({
    shipped: [],
    pending: [],
    completed: [],
    cancelled: [],
  });

  const [getOrders, getOrdersState] = useLazyGetCustomerOrdersQuery();
  const { getCustomerProfileHandler, getCustomerState } = useCustomerAuth()

  useEffect(() => {
    getCustomerProfileHandler(async (customer) => {
      if (customer) {
        console.log('customer', customer);
        setCustomer(customer);

        const { data: orderResponse } = await getOrders(undefined);

        console.log({
          orderResponse
        })
        setOrders(orderResponse?.data);
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tempOrders = useMemo(() => {
    if (!getOrdersState.isSuccess && !orders) return [];

    const data = orders[selectedTab.toLowerCase() as 'pending' | 'completed' | 'shipped' | 'cancelled'];

    const ords = data.map((order: any) => ({ ...order, total: 0 }));

    ords.forEach((order: any) => {
      let total = 0;
      for (const orderProduct of order.products) {
        total += orderProduct?.quantity * orderProduct?.product?.price;
      }

      order['total'] = total;
    });

    return ords;
  }, [orders, selectedTab, getOrdersState]);

  if (!customer || getOrdersState?.isLoading || getCustomerState?.isLoading)
    return (
      <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
        <BasicLoader />
      </div>
    );

  return (
    <>
      <CustomerView>
        {getOrdersState.isLoading && (
          <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
            <BasicLoader />
          </div>
        )}
        <h1 className="text-2xl font-bold text-slate-600">Dashboard</h1>

        <div className="rounded-md bg-white p-5 shadow-md">
          <ButtonGroup
            values={['Pending', 'Shipped', 'Completed', 'Cancelled']}
            onClick={(data) => {
              setSelectedTab(data.selected);
            }}
          />

          <div className="my-5 flex flex-col gap-3">
            {tempOrders.map((order: any) => (
              <div key={order.serialNumber} className="p-5 border rounded-lg flex flex-col gap-3 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">#{order.serialNumber}</h3>
                  <h3 className="font-bold text-lg text-green-600">
                    PHP {order.total.toLocaleString()}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {order.products.map((product: ICartItem) => (
                    <div key={product.product.name} className="flex border-b gap-3 w-full sm:w-[300px] border rounded-lg p-3 bg-gray-50 shadow-sm">
                      <Image
                        src={
                          product.product.images.length > 0
                            ? product.product.images[0]
                            : 'data:image/png;base64,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'
                        }
                        width={50}
                        height={50}
                        alt="item 1"
                        className="rounded-md object-contain"
                      />

                      <div className="flex flex-col justify-between break-words overflow-hidden">
                        <Link href={`/products/${product.product.id}`} className="font-bold text-sm text-blue-900">
                          {product.product.name} ({product.quantity})
                        </Link>
                        <small>
                          {product.application} - {product.color}
                        </small>
                        <small className="text-gray-600">
                          P {(product.product.price * product.quantity).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CustomerView>
    </>
  );
}
