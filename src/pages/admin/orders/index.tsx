import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup';
import BasicLoader from '@/components/Loader/basic-loader';
import Table from '@/components/Table';
import {
  useLazyGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/store/api/ordersApi';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface IOrders {
  shipped: any[];
  pending: any[];
  completed: any[];
  cancelled: any[];
}

export default function Orders() {
  const [getOrders, getOrdersState] = useLazyGetOrdersQuery();
  const [updateOrderStatus, updateOrderStatusState] =
    useUpdateOrderStatusMutation();
  const [orders, setOrders] = useState({
    shipped: [],
    pending: [],
    completed: [],
    cancelled: [],
  });
  const [selectedStatus, setSelectedStatus] = useState<
    'shipped' | 'pending' | 'completed' | 'cancelled'
  >('pending');

  useEffect(() => {
    getOrders(undefined).then(({ data }) => {
      setOrders(data?.data);
      console.log(data?.data);
    });
  }, []);

  useEffect(() => {
    if (updateOrderStatusState.isSuccess) {
      getOrders(undefined).then(({ data }) => {
        setOrders(data?.data);
      });
    }
  }, [updateOrderStatusState]);

  return (
    <>
      <main className="">
        {(getOrdersState.isLoading || updateOrderStatusState.isLoading) && (
          <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
            <BasicLoader />
          </div>
        )}
        <AdminNav />
        <div className="px-5 md:px-[10%] w-full">
          <h1 className="font-bold text-2xl text-slate-500 my-5">Orders</h1>
          <div className="flex min-h-[80vh] w-full  ">
            <div className="flex-none">
              <AdminMenu defaultValue="Orders" />
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <ButtonGroup
                  values={['pending', 'shipped', 'completed', 'cancelled']}
                  onClick={(e) => {
                    setSelectedStatus(e.selected);
                  }}
                  defaultValue={selectedStatus}
                />
              </div>
              {!getOrdersState.isLoading && orders && (
                <Table
                  headers={[
                    {
                      key: 'fullname',
                      value: 'Name',
                    },
                    {
                      key: 'serialNumber',
                      value: 'Serial Number',
                    },
                    {
                      key: 'createdAt',
                      value: 'Date',
                    },
                    {
                      key: 'contactNumber',
                      value: 'Contact',
                    },
                    {
                      key: 'address',
                      value: 'Address',
                    },
                    {
                      key:
                        selectedStatus === 'pending' ? 'toShip' : 'toComplete',
                      value: 'Action',
                    },
                  ]}
                  rowClassName={[
                    {
                      key: 'serialNumber',
                      customElement: (value, id) => {
                        return <span>#{value}</span>;
                      },
                    },
                    {
                      key:
                        selectedStatus === 'pending' ? 'toShip' : 'toComplete',
                      customElement: (value, id) => {
                        return selectedStatus === 'pending' ? (
                          <Button
                            title="To Ship"
                            buttonClass="bg-green-600 text-green-100 px-3 py-1"
                            onClick={() => {
                              updateOrderStatus({
                                serialNumber: value,
                                status: 'shipped',
                              });
                            }}
                          />
                        ) : (
                          <Button
                            title="Complete"
                            buttonClass="bg-blue-600 text-blue-100 px-3 py-1"
                            onClick={() => {
                              updateOrderStatus({
                                serialNumber: value,
                                status: 'completed',
                              });
                            }}
                          />
                        );
                      },
                    },
                  ]}
                  data={orders[selectedStatus].map((order: any) => ({
                    ...order,
                    toShip: order.serialNumber,
                    toComplete: order.serialNumber,
                    createdAt: moment(order?.createdAt).format('ll'),
                  }))}
                  title={'Orders'}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
