import { ICustomerType } from '@/types/customer.type';
import Logo from '../Logo';
import Image from 'next/image';
import Link from 'next/link';
export default function CustomerNavbar({
  customer,
}: {
  customer: ICustomerType;
}) {
  return (
    <div className=" flex flex-row justify-between items-center py-3 border-b">
      <div>
        <Logo className="h-[100]" />
      </div>
      <div className="flex flex-row gap-5 items-center">
        <div>
          <h3 className="text-1xl">{customer.fname + ', ' + customer.lname}</h3>
          <div className="flex gap-3">
            <Link href={'/api/auth/logout'}>
              <small className="text-sm text-slate-500">Logout</small>
            </Link>

            <Link href={'/customer/account'}>
              <small className="text-sm text-slate-500">My Profile</small>
            </Link>
          </div>
        </div>
        <Image
          width={50}
          height={50}
          alt={customer.fname}
          src={customer.profileImage}
          className="rounded-full"
        />
      </div>
    </div>
  );
}