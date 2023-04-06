import ButtonGroup from '@/components/ButtonGroup';
import { wrapper } from '@/store';
import { getCustomerProfile } from '@/store/api/customerApi';
import { ICustomerType } from '@/types/customer.type';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    const customer = await store.dispatch(
      getCustomerProfile.initiate(ctx.req.cookies?.token)
    );

    return {
      props: {
        customer: customer?.data?.data || null,
      },
    };
  });

export default function Customer({ customer }: { customer: ICustomerType }) {
  const [selectedTab, setSelectedTab] = useState('Completed');
  return (
    <>
      <main className="px-5 md:px-[10%]">
        <div className=" flex flex-row justify-between items-center py-3">
          <div>
            <h1>LOGO</h1>
          </div>
          <div className="flex flex-row gap-5 items-center">
            <div>
              <h3 className="text-1xl">
                {customer.fname + ', ' + customer.lname}
              </h3>
              <Link href={'/api/auth/logout'}>
                <small className="text-sm text-slate-500">Logout</small>
              </Link>
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

        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-slate-600">Dashboard</h1>

          <div className=" rounded-md bg-white p-5">
            <ButtonGroup
              values={['Completed', 'Cancelled', 'Shipped']}
              onClick={(data) => {
                setSelectedTab(data.selected);
              }}
            />

            <div className="my-5 flex-col">
              <div className="p-3">
                <h3 className="text-1xl">Item 1</h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
