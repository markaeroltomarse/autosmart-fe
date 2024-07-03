import Button from '@/components/Button';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import CustomerView from '@/components/Views/customer.view';
import useAlert from '@/hooks/useAlert';
import { useAppSelector } from '@/hooks/useAppSelector';
import useCustomerAuth from '@/hooks/useCustomerAuth';
import { useResendVerifyAccountEmailMutation, useUpdateCustomerMutation } from '@/store/api/customerApi';
import { ICustomerType } from '@/types/customer.type';
import Image from 'next/image';
import { useState } from 'react';
import { MdAddLocationAlt, MdLocationOn } from 'react-icons/md';

export default function MyAccount() {
  const [updateCustomer, updateCustomerState] = useUpdateCustomerMutation();
  const [newAddress, setNewAddress] = useState<string>('');

  const [resendVerifyAccountEmail, { isLoading: resendVerifyAccountEmailIsLoading }] = useResendVerifyAccountEmailMutation()

  const customer: ICustomerType | null = useAppSelector(store => store.userReducer.user)

  const { execute } = useAlert()
  const { getCustomerProfileHandler } = useCustomerAuth()

  const handleAddNewAddress = async (e: any) => {
    e.preventDefault();
    if (customer) {
      const updatedAddresses = [...customer.address, newAddress];
      const { error }: any = await updateCustomer({
        address: updatedAddresses,
        defaultAddress: customer.defaultAddress || newAddress
      });

      if (error) {
        return execute({
          message: error?.data?.message,
          type: 'error',
          title: 'Adding Failed.'
        })
      }

      setNewAddress('');
      await getCustomerProfileHandler();
    }
  };

  const handleVerifyAccount = async () => {
    const { error }: any = await resendVerifyAccountEmail(undefined)

    if (error) {
      return execute({
        title: 'Account Verification Failed',
        type: 'error',
        message: `We have already sent an email verification link to ${customer?.email}. Please wait 5 minutes before requesting again.`
      });
    }

    execute({
      title: 'Account Verification Sent',
      type: 'success',
      message: `We have sent an email verification link to ${customer?.email}.`
    });
  }

  const handleSetDefaultAddress = async (address: string) => {
    if (!customer) return

    const { error }: any = await updateCustomer({
      address: customer.address,
      defaultAddress: address,
    });

    if (error) {
      return execute({
        message: error?.data?.message,
        type: 'error',
        title: 'Updating Failed.'
      })
    }

    await getCustomerProfileHandler();
  };

  if (!customer) {
    return (
      <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
        <BasicLoader />
      </div>
    );
  }

  return (
    <>
      <CustomerView>
        {updateCustomerState.isLoading && (
          <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
            <BasicLoader />
          </div>
        )}
        <div className="bg-white p-5 rounded-md shadow-md">
          <div className="border-b pb-3 mb-5">
            <h1 className="text-3xl font-bold text-slate-800">My Account</h1>
            <h2 className="text-xl font-medium text-slate-600">
              Manage and protect your account.
            </h2>
            <Button
              title={customer?.isVerified ? 'Account verified' : 'Verify Account'}
              onClick={handleVerifyAccount}
              disabled={resendVerifyAccountEmailIsLoading || customer?.isVerified}
              loading={resendVerifyAccountEmailIsLoading}
              variant={customer?.isVerified ? 'success' : 'primary'}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-slate-500">
                Hello, {customer.fname}
              </h2>

              <form onSubmit={handleAddNewAddress} className="flex flex-col gap-3">
                <div className="flex items-center border border-blue-500 text-blue-600 rounded p-3 bg-blue-50 hover:bg-blue-100 transition">
                  <MdAddLocationAlt size={24} />
                  <div className='flex-auto'>
                    <Input
                      type="text"
                      className="bg-transparent border-none flex-grow ml-3 border flex"
                      placeholder="Enter new address"
                      value={newAddress}
                      required
                      label='Address'
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                  </div>
                  <Button
                    buttonType="submit"
                    title="Add"
                    buttonClass="ml-3 bg-blue-600 text-white hover:bg-blue-700"
                    size='medium'
                  />
                </div>
              </form>

              <div className="flex flex-col gap-2 mt-5">
                {customer.address.map((address) => (
                  <div
                    key={address}
                    className="flex justify-between items-center border rounded bg-slate-100 p-3 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <MdLocationOn size={24} />
                      <span>{address}</span>
                    </div>

                    {address === customer.defaultAddress ? (
                      <Button title="Default" buttonClass="text-sm bg-green-600 text-white" disabled />
                    ) : (
                      <Button
                        title="Set Default"
                        buttonClass="text-sm bg-blue-700 text-white hover:bg-blue-800"
                        onClick={() => handleSetDefaultAddress(address)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-2 flex items-center justify-center">
              <Image
                src={customer?.profileImage || '/logo.png'}
                width={150}
                height={150}
                alt={customer.email}
                className="rounded-full w-[150px] h-[150px] object-contain border-2 border-slate-400"
              />
            </div>
          </div>
        </div>
      </CustomerView>
    </>
  );
}
