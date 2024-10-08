import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import Table from '@/components/Table';
import useAlert from '@/hooks/useAlert';
import {
  useLazyGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/store/api/ordersApi';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { GiFullMotorcycleHelmet } from 'react-icons/gi';

export default function Orders() {
  const [getOrders, getOrdersState] = useLazyGetOrdersQuery();
  const [updateOrderStatus, updateOrderStatusState] =
    useUpdateOrderStatusMutation();

  const { execute } = useAlert()

  const [orders, setOrders] = useState({
    shipped: [],
    pending: [],
    completed: [],
    cancelled: [],
  });

  const [selectedStatus, setSelectedStatus] = useState<
    'shipped' | 'pending' | 'completed' | 'cancelled'
  >('pending');

  const [toBeShip, setToBeShip] = useState<{
    id: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    getOrders(undefined).then(({ data }) => {
      setOrders(data?.data);
    });
  }, []);

  const columns = useMemo(() => {
    const cols = [
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
        key: selectedStatus === 'pending' ? 'toShip' : 'toComplete',
        value: 'Action',
      },
    ];

    if (selectedStatus !== 'pending') {
      cols.splice(5, 0, {
        key: 'rider',
        value: 'Rider',
      });
    }
    return cols;
  }, [selectedStatus]);

  useEffect(() => {
    if (updateOrderStatusState.isSuccess) {
      execute({
        type: 'success',
        title: 'Order update successfully.',
        message: ''
      })
      getOrders(undefined, undefined).then(({ data }) => {
        setOrders(data?.data);
      });
    }

    if (updateOrderStatusState.isError) {
      const error: any = updateOrderStatusState.error
      execute({
        type: 'error',
        title: 'Cannot update order',
        message: error?.data?.message || error?.data?.message?.[0]
      })
    }
  }, [updateOrderStatusState]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const order: any = orders.pending.find(
      (order: any) => order.id === toBeShip?.id
    );
    if (order) {
      const res: any = await updateOrderStatus({
        serialNumber: order.serialNumber,
        status: 'shipped',
        email: toBeShip?.email,
      });

      if (!res?.error) {
        setToBeShip(null);
        setSelectedStatus('shipped');
      }
    }
  }

  return (
    <>
      <main className="">
        {(getOrdersState.isLoading || updateOrderStatusState.isLoading) && (
          <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
            <BasicLoader />
          </div>
        )}

        {toBeShip && selectedStatus === 'pending' && (
          <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center bg-slate-600 bg-opacity-50">
            <form
              className="bg-white rounded-md shadow-md p-5 flex flex-col gap-3"
              onSubmit={handleSubmit}
            >
              <h3 className="text-1xl font-bold">Enter a rider email.</h3>
              <Input
                type="email"
                required={true}
                onChange={(e) =>
                  setToBeShip({
                    ...toBeShip,
                    email: e.target.value,
                  })
                }
                icon={<GiFullMotorcycleHelmet size={20} color="grey" />}
              />
              <div className="flex justify-end gap-2">
                <Button
                  title="Cancel"
                  buttonClass="shadow text-sm"
                  onClick={() => setToBeShip(null)}
                />
                <Button
                  title="Done"
                  buttonClass="shadow text-sm bg-green-700 text-white"
                  buttonType="submit"
                />
              </div>
            </form>
          </div>
        )}
        <AdminNav />
        <div className="px-5 md:px-[10%] w-full ">
          <h1 className="font-bold text-2xl text-slate-500 my-5">Orders</h1>
          <div className="flex min-h-[80vh] w-full ">
            <div className="flex-none">
              <AdminMenu defaultValue="Orders" />
            </div>
            <div className="flex flex-col gap-5 w-full ">
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
                  headers={columns}
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
                        if (selectedStatus === 'pending') {
                          return (
                            <Button
                              title="To Ship"
                              buttonClass="bg-green-600 text-green-100 px-3 py-1"
                              onClick={() => {
                                setToBeShip({
                                  id: id,
                                  email: '',
                                });
                              }}
                            />
                          );
                        } else if (selectedStatus === 'shipped') {
                          return (
                            <Button
                              title="To Complete"
                              buttonClass="bg-green-600 text-green-100 px-3 py-1"
                              onClick={async () => {
                                await updateOrderStatus({
                                  serialNumber: value,
                                  status: 'completed',
                                });
                              }}
                            />
                          );
                        } else {
                          return <div> </div>;
                        }
                      },
                    },
                  ]}
                  data={orders[selectedStatus].map((order: any) => ({
                    ...order,
                    toShip: order.serialNumber,
                    toComplete: order.serialNumber,
                    createdAt: moment(selectedStatus === 'pending' ? order?.createdAt : order?.updatedAt).format('ll'),
                    rider: order?.rider && order.rider.email
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
