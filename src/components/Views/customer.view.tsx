import { useAppSelector } from "@/hooks/useAppSelector";
import useCustomerAuth from "@/hooks/useCustomerAuth";
import { ReactNode } from "react";
import CustomerNavbar from "../CustomerNavbar";

export interface CustomerViewProps {
    children?: ReactNode
}

const CustomerView: React.FC<CustomerViewProps> = (props) => {
    const { children } = props;
    const customer = useAppSelector(store => store.userReducer.user)
    const { VerificationMessage } = useCustomerAuth()


    return <main className="px-5 md:px-[10%] py-10 bg-gray-100 min-h-screen">
        <CustomerNavbar customer={customer} />
        {VerificationMessage}
        <div className="flex flex-col gap-5 my-5">
            {children}
        </div>
    </main>
};

export default CustomerView;
