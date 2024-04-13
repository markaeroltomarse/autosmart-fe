import DeliveryItems from "@/components/DeliveryItems";
import DeliveryView from "@/components/Views/delivery.view";
import useAlert from "@/hooks/useAlert";
import { useLazyGetCustomerProfileQuery } from "@/store/api/customerApi";
import { useLazyGetOrdersQuery, useUpdateOrderStatusMutation } from "@/store/api/ordersApi";
import { NextPageWithLayout } from "@/types/next-page-with-layout.types";
import { ITransactionType } from "@/types/product.type";
import moment from "moment";
import { useEffect } from "react";

export interface DeliveryPageProps {

}

type IndexPageRef = React.ForwardedRef<HTMLDivElement>

const DeliveryPage: NextPageWithLayout<DeliveryPageProps> = (_, ref: IndexPageRef) => {
    const [getOrders, { data, isLoading }] = useLazyGetOrdersQuery();
    const [getCustomer, { isSuccess, data: userProfile }] = useLazyGetCustomerProfileQuery();

    const loadOrders = () => {
        getCustomer(undefined).then(customerRes => {
            getOrders({ riderId: customerRes?.data?.data.id }, undefined)
        })
    }

    useEffect(() => {
        loadOrders()
    }, [])

    const { execute } = useAlert()

    const [updateOrderStatus, updateOrderStatusState] =
        useUpdateOrderStatusMutation();

    const handleCompleteDelivery = async (order: ITransactionType, toStatus: "pending" | "shipped" | "completed" | "cancelled") => {
        const res: any = await updateOrderStatus({
            serialNumber: order.serialNumber,
            status: toStatus,
            email: order.customer?.email
        })

        if (res?.error) {
            execute({
                title: 'Delivery Failed',
                message: `Order ${order.serialNumber} failed. Please contact the admin.`,
                type: 'error'
            })
        } else {
            execute({
                title: 'Delivery Completed',
                message: `Order ${order.serialNumber} delivered.`,
                type: 'success'
            })

            loadOrders()
        }
    }

    return (
        <div>
            <div className="p-5 md:p-0">
                <h3 className="text-2xl font-bold">My Deliveries</h3>
                <br />
                <h5 className="text-2xl tracking-wide font-thin text-slate-400">{moment().calendar()}</h5>
                <br />
            </div>
            <DeliveryItems loading={isLoading || updateOrderStatusState?.isLoading} onUpdateDelivery={handleCompleteDelivery} deliveries={data?.data?.shipped || []} />
        </div>
    );
};

DeliveryPage.getLayout = function getLayout(page: React.ReactElement) {
    return <DeliveryView>{page}</DeliveryView>;
};
export default DeliveryPage;
