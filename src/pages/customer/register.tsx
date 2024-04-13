import CustomerRegisterForm from "@/components/Forms/CustomerRegister.form";
import Navbar from "@/components/Navbar/navbar";
import useAlert from "@/hooks/useAlert";
import { useCreateCustomerMutation } from "@/store/api/customerApi";

export interface CustomerRegisterPageProps {
}

const CustomerRegisterPage: React.FC<CustomerRegisterPageProps> = (props) => {
    const { execute } = useAlert()
    const [createCustomer, { isLoading, isSuccess }] = useCreateCustomerMutation();

    const handleSubmit = async (formData: any) => {
        const payload = {
            ...formData,
            address: [formData.address]
        }
        const res: any = await createCustomer(payload)
        if (!res?.error) {
            execute({
                title: 'Register Success',
                type: 'success',
                message: 'You can now login your account.',
                interval: 5000
            })
        } else {
            execute({
                title: 'Register failed',
                type: 'error',
                message: res.error.data.message,
                interval: 5000
            })
        }
    }

    return <main className=" ">
        <p className="flex items-center  absolute top-0 left-1/2 transform -translate-x-1/2 z-10 p-2 text-white text-bold hover:text-gray-300 cursor-pointer">
            Need Help? Contact Us!
        </p>

        <Navbar />

        <div className=" relative w-[100vw] h-[50vh] flex justify-center">
            <div className="container">
                <h1 className="text-3xl my-5 font-extrabold text-blue-900">
                    Registration
                </h1>
                <CustomerRegisterForm success={isSuccess} loading={isLoading} onSubmit={handleSubmit} />
            </div>
        </div>
    </main>;
};

export default CustomerRegisterPage;
