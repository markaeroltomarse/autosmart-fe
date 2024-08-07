import { ICustomerType } from '@/types/customer.type';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from '../Logo';

export default function CustomerNavbar({
  customer,
}: {
  customer: ICustomerType | null;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (customer) {
      setIsLoaded(true);
    }
  }, [customer]);

  if (!customer) return <div></div>;

  return (
    <div
      className={`transition-opacity duration-300 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        } flex flex-row justify-between items-center py-3 border-b`}
    >
      <div>
        <Logo className="z-[1] w-[100px] h-[65px] border-2 border-blue-900 rounded-md flex" />
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

            {customer?.isRider && (
              <Link href={'/delivery'}>
                <small className="text-sm text-blue-500">Switch as Rider</small>
              </Link>
            )}
          </div>
        </div>
        <Image
          width={50}
          height={50}
          alt={customer.fname!}
          src={customer.profileImage! || '/logo.png'}
          className="rounded-full"
        />
      </div>
    </div>
  );
}
