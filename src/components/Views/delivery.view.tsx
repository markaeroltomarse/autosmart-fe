import useCustomerAuth from "@/hooks/useCustomerAuth";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import DeliveryNav from "../DeliveryNav";

export interface DeliveryViewProps {
    children?: ReactNode
}

const DeliveryView: React.FC<DeliveryViewProps> = (props) => {
    const { children } = props;

    const router = useRouter()
    const { getCustomerProfileHandler, } = useCustomerAuth()

    useEffect(() => {
        getCustomerProfileHandler((customer) => {
            if (!customer || !customer.isRider) {
                router.replace('/')
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="flex justify-center font-Jost text-[#3f3f3f]">
        <div className="md:w-[50%] w-[100%]">
            <DeliveryNav />
            {children}
        </div>
    </div>;
};

export default DeliveryView;
