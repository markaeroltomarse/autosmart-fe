import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import Button from "../Button";
import Input from "../Input";
import BasicLoader from "../Loader/basic-loader";
import Select from "../Select";

export interface CustomerRegisterFormProps {
    onSubmit?: (formData: { [key: string]: string }) => void
    loading?: boolean
    success?: boolean
}

const CustomerRegisterForm: React.FC<CustomerRegisterFormProps> = (props) => {
    const { onSubmit, loading, success } = props;

    // Define state to hold form data
    const [formData, setFormData] = useState<{ [key: string]: string }>({});

    const passwordError = useMemo(() => {
        if (!formData?.password || !formData?.confirmPassword) return

        if (formData?.password !== formData?.confirmPassword) {
            return <span className="text-sm text-red-600">Password does not match.</span>
        }
    }, [formData?.password, formData?.confirmPassword])

    // Function to handle input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault()
        delete formData?.confirmPassword
        console.log(formData)
        onSubmit?.(formData)
    }

    return <div className="rounded shadow-lg p-10 bg-white">
        {
            success && <div className="h-[500px] flex justify-center flex-col items-center text-center text-blue-900">
                <FaUserCheck size={100} />

                <p className="font-Jost tracking-wide">
                    Registration success. We sent you an email for your account verification link to <b>{formData?.email}</b> and after that, you may now proceed to login your account <Link href={'/account/authentication'} className="underline">here.</Link>
                </p>
            </div>
        }

        {
            loading && <div className="flex justify-center items-center"><BasicLoader /></div>
        }

        <form className={`flex flex-col gap-5 ${(loading || success) && 'overflow-hidden h-0'}`} onSubmit={handleSubmit}>
            <div className="gap-3 flex flex-col">
                <Input onChange={handleInputChange} name="email" type="email" className="font-Jost text-blue-900" label="Email" required />
                <div className="border p-5 rounded gap-3 flex flex-col">
                    <Input minLength={6} onChange={handleInputChange} name="password" type="password" className="font-Jost text-blue-900" label="Password" required />
                    <Input minLength={6} onChange={handleInputChange} name="confirmPassword" type="password" className="font-Jost text-blue-900" label="Confirm Password" required />
                    {passwordError}
                </div>
                <Input onChange={handleInputChange} name="contactNumber" type="number" className="font-Jost text-blue-900" label="Contact Number" required />
                <Input onChange={handleInputChange} name="fname" type="text" className="font-Jost text-blue-900" label="First Name" required />
                <Input onChange={handleInputChange} name="lname" type="text" className="font-Jost text-blue-900" label="Last Name" required />
                <Select onChange={(e) => {
                    const { name, value } = e.target;
                    setFormData({ ...formData, [name]: value });
                }} name="gender" label="Gender" required options={['Male', 'Female']} value={'Male'} className="p-3 rounded" />
                <Input onChange={handleInputChange} name="address" type="text" className="font-Jost text-blue-900" label="Primary Address" required />
            </div>
            <div className="flex justify-end gap-3">
                <Button title="< Back" buttonType="button" buttonClass="text-blue-900 p-3 mr-3" />
                <Button title="Submit" buttonType="submit" buttonClass="bg-blue-900 text-white p-3" />
            </div>
        </form>
    </div>

};

export default CustomerRegisterForm;
