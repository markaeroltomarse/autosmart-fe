import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';

export default function LoginAdmin() {
  return (
    <>
      <main className="px-5 md:px-[10%] flex flex-col justify-center items-center border h-screen w-screen">
        <div className="bg-white p-5 rounded border ">
          <h3 className="font-bold text-2xl text-slate-700 mb-2 flex items-center gap-3">
            {' '}
            <span>Welcome Back! </span>
            <Logo className="w-[60px] h-[30px] rounded-md border-none " />
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col gap-2"
          >
            <Input
              type="email"
              placeholder="Enter email.."
              className="bg-slate-100"
              required
            />

            <Input
              type="password"
              placeholder="Enter password.."
              className="bg-slate-100"
              required
            />

            <Button
              buttonType="submit"
              title="Login"
              buttonClass="bg-green-500 text-green-100"
            />
          </form>
        </div>
      </main>
    </>
  );
}
