import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';

export default function Dashboard() {
  return (
    <>
      <main className="">
        <AdminNav />
        <div className="px-5 md:px-[10%] w-full">
          <h1 className="font-bold text-2xl text-slate-500 my-5">Dashboard</h1>
          <div className="flex min-h-[80vh] w-full  ">
            <div className="flex-none">
              <AdminMenu defaultValue="Dashboard" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
