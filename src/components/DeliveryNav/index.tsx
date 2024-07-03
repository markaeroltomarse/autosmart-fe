import { useAppSelector } from "@/hooks/useAppSelector";
import Image from 'next/image';
import Link from "next/link";
import Logo from "../Logo";
export interface DeliveryNavProps {

}

const DeliveryNav: React.FC<DeliveryNavProps> = (props) => {
    const { } = props;

    const user = useAppSelector(store => store.userReducer.user)

    return <nav className="p-5 md:px-0 flex justify-between">
        <div>
            <Logo className="z-[1] w-[100px] h-[65px] border-2 border-blue-900 rounded-md flex" />
        </div>
        <div className="flex flex-row gap-5 items-center">
            <div>
                <h3 className="text-1xl">{user?.fname + ', ' + user?.lname}</h3>
                <div className="flex gap-3">
                    <Link href={'/api/auth/logout'}>
                        <small className="text-sm text-slate-500">Logout</small>
                    </Link>

                    <Link href={'/customer/account'}>
                        <small className="text-sm text-slate-500">My Profile</small>
                    </Link>

                    <Link href={'/customer'}>
                        <small className="text-sm text-blue-500">Switch as Customer</small>
                    </Link>
                </div>
            </div>
            <Image
                width={50}
                height={50}
                alt={user?.fname || ''}
                src={user?.profileImage || ''}
                className="rounded-full"
            />
        </div>
    </nav>;
};

export default DeliveryNav;
