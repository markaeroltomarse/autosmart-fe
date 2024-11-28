import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Table from "@/components/Table";
import AdminView from "@/components/Views/admin.view";
import { useLazyGetRidersQuery, useUpdateCustomerMutation } from "@/store/api/customerApi";
import { useEffect, useState } from "react";
import { GiFullMotorcycleHelmet } from "react-icons/gi";

export interface RidersProps {

}

const Riders: React.FC<RidersProps> = (props) => {
    const { } = props;
    const [getRiders, { data }] = useLazyGetRidersQuery()
    const [updateCustomer, { error: isErrorSetRider, isLoading: isLoadingSetRider, isSuccess: isSuccessSetRider }] = useUpdateCustomerMutation()

    const [isAddNewRiderModal, setIsAddNewRiderModal] = useState(false)
    const [riderEmail, setRiderEmail] = useState('')

    const handleSubmitNewRider = async () => {
        if (riderEmail) {
            try {
                await updateCustomer({
                    email: riderEmail,
                    isRider: true
                })
                await getRiders(undefined)
                setIsAddNewRiderModal(false)
            } catch (error) {
                console.log(error)
            }
        }
    }


    useEffect(() => {
        getRiders(undefined)
    }, [getRiders])

    return (
        <>
            <AdminView page="Riders">
                {
                    isErrorSetRider && <Alert
                        type={"error"}
                        title={"Email not found"}
                        message={"This email is not register as customer."}
                    />
                }
                {
                    isSuccessSetRider && <Alert
                        type={"success"}
                        title={"New delivery staff assigned."}
                        message={""}
                    />
                }
                {
                    isAddNewRiderModal && <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center bg-slate-600 bg-opacity-50">
                        <form
                            className="bg-white rounded-md shadow-md p-5 flex flex-col gap-3"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                handleSubmitNewRider()
                            }}
                        >
                            <h3 className="text-1xl font-bold">Enter the rider email.</h3>
                            <Input
                                type="email"
                                required={true}
                                icon={<GiFullMotorcycleHelmet size={20} color="grey" />}
                                onChange={(e) => setRiderEmail(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    title="Cancel"
                                    buttonClass="shadow text-sm"
                                    onClick={() => {
                                        setIsAddNewRiderModal(false)
                                        setRiderEmail('')
                                    }}
                                />
                                <Button
                                    title="Done"
                                    buttonClass="shadow text-sm bg-green-700 text-white"
                                    buttonType="submit"
                                />
                            </div>
                        </form>
                    </div>
                }
                <div className="flex justify-end gap-3 mb-5">
                    <Button title="Add new" buttonClass="bg-green-600 text-white py-3 px-5" onClick={() => setIsAddNewRiderModal(true)} />
                </div>
                <Table headers={[
                    {
                        key: 'id',
                        value: '',
                    },
                    {
                        key: 'email',
                        value: 'Email',
                    },
                    {
                        key: 'deliveries',
                        value: 'Deliveries',
                    },
                    {
                        key: 'createdAt',
                        value: 'Date Joined',
                    },
                ]} data={data?.data ? data?.data : []} title={"Riders"} />
            </AdminView>
        </>
    )
};

export default Riders;
