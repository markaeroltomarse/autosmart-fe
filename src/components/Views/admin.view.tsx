import useCustomerAuth from "@/hooks/useCustomerAuth";
import { ReactNode } from "react";
import AdminMenu from "../AdminMenu";
import AdminNav from "../AdminNav";

export interface AdminViewProps {
    children?: ReactNode,
    page?: string
}

const AdminView: React.FC<AdminViewProps> = (props) => {
    const { children, page } = props;

    useCustomerAuth({ role: "admin" })

    return <main className="">
        <AdminNav />
        <div className="px-5 md:px-[10%] w-full">
            <h1 className="font-bold text-2xl text-blue-950 my-5">Dashboard</h1>
            <div className="flex min-h-[80vh] w-full  ">
                <div className="flex-none">
                    <AdminMenu defaultValue={page || "Dashboard"} />
                </div>
                <div className='w-[100%] px-5'>
                    {children}
                </div>
            </div>
        </div>
    </main>
};

export default AdminView;
