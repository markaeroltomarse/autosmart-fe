import Button from '@/components/Button';
import CustomerNavbar from '@/components/CustomerNavbar';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import {
  useLazyGetCustomerProfileQuery,
  useUpdateCustomerMutation
} from '@/store/api/customerApi';
import { ICustomerType } from '@/types/customer.type';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdAddLocationAlt, MdLocationOn } from 'react-icons/md';
import { read_cookie } from 'sfcookies';
export default function MyAccount() {
  const router = useRouter();
  const [getProfile, getProfileState] = useLazyGetCustomerProfileQuery();
  const [customer, setCustomer] = useState<ICustomerType | null>(null);
  const [updateCustomer, updateCustomerState] = useUpdateCustomerMutation();
  const [newAddress, setNewAddress] = useState<string>('');

  const getCustomerProfileHandler = async () => {
    const token = read_cookie('token');

    if (token && token.length > 0) {
      getProfile(String(token)).then(({ data, isError }) => {
        if (isError) {
          router.push('/');
        }
        console.log(data?.data);
        setCustomer(data?.data);
      });
    }
  };
  useEffect(() => {
    getCustomerProfileHandler();
  }, []);

  const handleAddNewAddress = async (e: any) => {
    e.preventDefault();
    if (customer) {
      const updatedAddresses = [...customer.address, newAddress];
      const { data, error }: any = await updateCustomer({
        address: updatedAddresses,
        defaultAddress: updatedAddresses.find(
          (address) => address === customer.defaultAddress
        ),
      });

      if (error) {
        return alert(error?.data?.message);
      }

      await getCustomerProfileHandler();
    }
  };

  const handleSetDefaultAddress = async (address: string) => {
    if (customer) {
      const { data, error }: any = await updateCustomer({
        address: customer.address,
        defaultAddress: address,
      });

      if (error) {
        return alert(error?.data?.message);
      }

      await getCustomerProfileHandler();
    }
  };

  if (!customer)
    return (
      <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
        <BasicLoader />
      </div>
    );

  return (
    <>
      <main className="px-5 md:px-[10%]">
        {updateCustomerState.isLoading && (
          <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
            <BasicLoader />
          </div>
        )}
        <CustomerNavbar customer={customer} />
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-5 flex-col bg-white p-5 rounded-md">
            <div className="border-b pb-3">
              <h1 className="text-2xl font-bold text-slate-800">My Account</h1>
              <h2 className="text-1xl font-bold text-slate-600">
                Manage and protect your account.
              </h2>
            </div>

            <div className="flex w-full ">
              <div className="flex-1 flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-slate-500">
                  Hello, {customer.fname}
                </h2>
                {/* <form>
                  <Input type="text" label="Email" required />
                </form> */}

                <form onSubmit={handleAddNewAddress}>
                  <div className="flex justify-between gap-3 items-center border border-blue-500 text-blue-600 rounded p-3  hover:bg-blue-100">
                    <div>
                      <MdAddLocationAlt size={20} />
                    </div>
                    <div className="  w-full">
                      <Input
                        type={'text'}
                        className="bg-transparent border-none"
                        required
                        onChange={(e) => setNewAddress(e.target.value)}
                      />
                    </div>

                    <div>
                      <Button
                        buttonType="submit"
                        title="Add new"
                        buttonClass="w-[100px] border-none"
                      />
                    </div>
                  </div>
                </form>
                {customer.address.map((address) => (
                  <div
                    key={address}
                    className="flex gap-3 items-center justify-between border rounded bg-slate-100 p-3"
                  >
                    <div className="flex gap-3">
                      <div>
                        <MdLocationOn size={20} />
                      </div>
                      <div>{address}</div>
                    </div>

                    {address === customer.defaultAddress ? (
                      <Button title="Default" buttonClass="text-sm" />
                    ) : (
                      <Button
                        title="Set Default"
                        buttonClass="text-sm bg-blue-700 w-[100px] text-blue-100"
                        onClick={() => handleSetDefaultAddress(address)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex-2 w-[300px] flex items-center justify-center">
                <Image
                  src={customer?.profileImage || ''}
                  width={150}
                  height={150}
                  alt={customer.email}
                  className="rounded-full border-2 border-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
