import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useLazyGetCustomerProfileQuery } from "@/store/api/customerApi";
import { setUser } from "@/store/reducers/userReducers";
import { ICustomerType } from "@/types/customer.type";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { read_cookie } from "sfcookies";
import DeliveryNav from "../DeliveryNav";

export interface DeliveryViewProps {
    children?: ReactNode
}

const DeliveryView: React.FC<DeliveryViewProps> = (props) => {
    const { children } = props;

    const router = useRouter()
    const [getUserApi] = useLazyGetCustomerProfileQuery()
    const dispatch = useAppDispatch()
    const token = read_cookie('token')

    useEffect(() => {
        if (token) {
            getUserApi(undefined).then(res => {
                const user: ICustomerType = res?.data && res.data.data

                if (!user || !user.isRider) {
                    router.replace('/')
                }

                dispatch(setUser(user))
            })
        } else {
            router.replace('/')
        }
    }, [token])

    return <div className="flex justify-center font-Jost text-[#3f3f3f]">
        <div className="md:w-[50%] w-[100%]">
            <DeliveryNav />
            {children}
        </div>
    </div>;
};

export default DeliveryView;
