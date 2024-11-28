import { useLazyGetCustomerProfileQuery } from "@/store/api/customerApi";
import { setUser } from "@/store/reducers/userReducers";
import { ICustomerType } from "@/types/customer.type";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { read_cookie } from "sfcookies";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

export interface useCustomerAuthProps {

}

const useCustomerAuth = (props?: { role?: string }) => {
    const { role } = props || {}
    const router = useRouter()
    const [getProfile, getCustomerState] = useLazyGetCustomerProfileQuery();
    const dispatch = useAppDispatch()
    const customer: ICustomerType | null = useAppSelector(store => store.userReducer.user)
    const user = useAppSelector(state => state.userReducer.user)

    const token = read_cookie("token")


    const getCustomerProfileHandler = async (callBack?: (customerData: ICustomerType) => void) => {
        const token = read_cookie('token');

        if (token && token.length > 0) {
            const { data, isError } = await getProfile(String(token))
            console.log({
                data
            })
            if (isError) {
                router.push('/');
            } else {
                dispatch(setUser(data?.data))
                callBack?.(data?.data)
            }
        }
    };

    const VerificationMessage = useMemo(() => {
        const PATH_EXCLUDES = ['/customer/account']

        if (!customer) return <div></div>
        if (customer?.isVerified || PATH_EXCLUDES.includes(router.asPath)) return <div></div>

        return <div className="w-full p-3 text-center text-sm bg-green-600 text-white">
            Verify your account <Link href='/customer/account' className="font-bold"> here</Link>.
        </div>
    }, [customer, router])


    useEffect(() => {
        // const isAtAuthPage = router.pathname.split("/")[1]?.toLowerCase()

        // if ((!token || token.length === 0) && role && role.toLowerCase() === isAtAuthPage) {
        //     router.replace("/")
        // }

        // if (user && isAtAuthPage && user?.role !== isAtAuthPage) {
        //     router.replace("/")
        // }
    }, [role, user, token, router])


    return {
        getCustomerProfileHandler, getCustomerState, VerificationMessage
    }
};

export default useCustomerAuth;     
