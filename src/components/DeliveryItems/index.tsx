import { ITransactionType } from "@/types/product.type";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkedAlt } from "react-icons/fa";
import Button from "../Button";
import BasicLoader from "../Loader/basic-loader";
export interface DeliveryItemsProps {
    deliveries: any[],
    onUpdateDelivery?: (order: ITransactionType, status: 'pending' | 'shipped' | 'completed' | 'cancelled') => void
    loading?: boolean
}

const DeliveryItems: React.FC<DeliveryItemsProps> = (props) => {
    const { deliveries, onUpdateDelivery, loading } = props;
    

    return <div>
        <div className="flex flex-col gap-3">
            {loading && <BasicLoader />}
            {
                deliveries.map((delivery, i) => (
                    <div key={delivery.id + '-' + i} className="bg-white rounded-md p-5 flex flex-col gap-3">
                        <div className=" flex gap-3 ">
                            <Image alt={delivery.customer.profileImage} src={delivery.customer.profileImage} height={50} width={50} className="rounded-full border" />
                            <div>
                                <h5 className="text-lg">{delivery.customer.lname}, {delivery.customer.fname}</h5>
                                <small className="text-slate-400">Receiver</small>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <FaMapMarkedAlt size={25} />
                            <a target="_blank" className="text-lg font-bold underline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.customer?.defaultAddress!)}`}>{delivery.customer?.defaultAddress}</a>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {
                                delivery.products.map((cart: any, i: number) => (
                                    <div key={cart.productId + '-' + i} className="flex gap-3 border p-3 rounded-md hover:shadow-md transition-all hover:scale-105">
                                        <div className="border aspect-square w-[100px] rounded-md relative">
                                            <Image alt={cart.product.name} src={cart.product.images?.[0]} fill />
                                        </div>
                                        <div>
                                            <h5 className="hover:underline font-bold text-md tracking-wide"><Link target="_blank" href={`/products/${cart.product.id}`}>{cart.product.name}</Link></h5>
                                            <p className="text-slate-400">{cart.product.brandName}</p>
                                            <b>₱{cart.product.price.toFixed(2).toLocaleString()}</b>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex justify-end gap-3">
                            {
                                loading ? <BasicLoader /> : <>
                                    <Button
                                        onClick={() => {
                                            onUpdateDelivery?.(delivery, 'completed')
                                        }}
                                        title="Complete Delivery" buttonClass="bg-green-600 text-white p-3" />
                                    <Button
                                        onClick={() => {
                                            onUpdateDelivery?.(delivery, 'cancelled')
                                        }}
                                        title="Cancel Delivery" buttonClass="bg-red-600 text-white p-3"
                                    />
                                </>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    </div>;
};

export default DeliveryItems;
