import DeliveryItems from "@/components/DeliveryItems";
import DeliveryView from "@/components/Views/delivery.view";
import useAlert from "@/hooks/useAlert";
import { useLazyGetCustomerProfileQuery } from "@/store/api/customerApi";
import { useLazyGetOrdersQuery, useUpdateOrderStatusMutation } from "@/store/api/ordersApi";
import { NextPageWithLayout } from "@/types/next-page-with-layout.types";
import { ITransactionType } from "@/types/product.type";
import moment from "moment";
import { useEffect, useState } from "react";

export interface DeliveryPageProps { }

type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

const DeliveryPage: NextPageWithLayout<DeliveryPageProps> = (_, ref: IndexPageRef) => {
    const [getOrders, { data, isLoading }] = useLazyGetOrdersQuery();
    const [getCustomer, { isSuccess, data: userProfile }] = useLazyGetCustomerProfileQuery();
    const [updateOrderStatus, updateOrderStatusState] = useUpdateOrderStatusMutation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<ITransactionType | null>(null);
    const [toStatus, setToStatus] = useState<"pending" | "shipped" | "completed" | "cancelled">("pending");

    const { execute } = useAlert();

    const loadOrders = async () => {
        const customerRes = await getCustomer(undefined);
        if (customerRes?.data?.data?.id) {
            getOrders({ riderId: customerRes.data.data.id }, undefined);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleCompleteDelivery = async () => {
        if (currentOrder) {
            const res: any = await updateOrderStatus({
                serialNumber: currentOrder.serialNumber,
                status: toStatus,
                email: currentOrder.customer?.email
            });

            if (res?.error) {
                return execute({
                    title: 'Delivery Failed',
                    message: `Order ${currentOrder.serialNumber} failed. Please contact the admin.`,
                    type: 'error'
                });
            }

            await loadOrders();

            if (toStatus === 'completed') {
                execute({
                    title: 'Delivery Completed',
                    message: `Order ${currentOrder.serialNumber} delivered.`,
                    type: 'success'
                });
            }

            if (toStatus === 'cancelled') {
                execute({
                    title: 'Delivery Cancelled',
                    message: `Order ${currentOrder.serialNumber} cancelled.`,
                    type: 'success'
                });
            }
        }

        setIsModalVisible(false);
    };

    const showModal = (order: ITransactionType, status: "pending" | "shipped" | "completed" | "cancelled") => {
        setCurrentOrder(order);
        setToStatus(status);
        setIsModalVisible(true);
    };

    return (
        <div>
            <div className="p-5 md:p-0">
                <h3 className="text-2xl font-bold">My Deliveries</h3>
                <br />
                <h5 className="text-2xl tracking-wide font-thin text-slate-400">{moment().calendar()}</h5>
                <br />
            </div>
            {(isLoading || updateOrderStatusState.isLoading) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="loader">Loading...</div>
                </div>
            )}
            <DeliveryItems
                loading={isLoading || updateOrderStatusState.isLoading}
                onUpdateDelivery={(order, status) => showModal(order, status)}
                deliveries={data?.data?.shipped || []}
            />
            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Update Delivery Status</h2>
                        <p>Are you sure you want to {toStatus} this order?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setIsModalVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={handleCompleteDelivery}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

DeliveryPage.getLayout = function getLayout(page: React.ReactElement) {
    return <DeliveryView>{page}</DeliveryView>;
};

export default DeliveryPage;
